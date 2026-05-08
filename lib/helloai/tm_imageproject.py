# -*- coding: utf-8 -*-
"""TMImageModel — 웹 IDE에서 사용하는 Teachable Machine 이미지 분류기 모듈.

Teachable Machine 의 "TensorFlow.js" 모델을 불러와, 메인 스레드의
``@teachablemachine/image`` 런타임(``src/runtime/mp/tmRuntime.js``)에서
추론합니다. 두 가지 모델 입력을 지원합니다.

1. Teachable Machine 사이트가 알려주는 **공유 URL**
   (예: ``https://teachablemachine.withgoogle.com/models/XXXX/``).
2. IDE 탐색기에 업로드한 **``.zip`` 파일**.
   ``model.json`` + ``weights.bin`` + ``metadata.json`` 이 들어 있는
   "Tensorflow.js → Download my model" 내보내기 결과물이어야 합니다.

원본 ``helloai.ext.tmimage.tm_imageproject`` 가 지원하던 keras ``.h5``
포맷은 의도적으로 빠져 있습니다. 브라우저 TensorFlow.js 가 ``.h5`` 를
직접 읽을 수 없기 때문입니다.

Examples:
    URL 또는 ``.zip`` 어느 쪽이든 같은 방식으로 사용합니다::

        from helloai import TMImageModel, Image
        import web_cv2 as cv2

        tm = TMImageModel()
        tm.load_model("https://teachablemachine.withgoogle.com/models/XXXX/")
        # 또는: tm.load_model("my_model.zip")
"""
import _mpBridge
from .image import Image


__all__ = ["TMImageModel"]


def _resolve_token(image):
    """이미지 객체에서 메인 스레드 프레임 토큰을 꺼냅니다.

    Args:
        image: ``_token`` 프로퍼티를 가진 객체(보통 ``FrameRef``).

    Returns:
        int: 메인 스레드 프레임을 가리키는 정수 토큰.

    Raises:
        ValueError: ``_token`` 이 없을 때, 사용자에게 ``cv2.imread()`` 또는
            ``cap.read()`` 결과를 사용하라고 안내합니다.
    """
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "TMImageModel: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


def _load_zip(path):
    """``.zip`` 모델 파일을 읽어 바이트로 반환합니다.

    절대경로면 그대로, 상대경로면 ``/work/`` 하위 → 원본 경로 순으로 시도합니다.

    Args:
        path: 모델 zip 파일 경로.

    Returns:
        bytes: zip 파일 전체 바이트.

    Raises:
        FileNotFoundError: 어떤 후보 경로에서도 파일을 열 수 없을 때.
            메시지는 한국어로 표시됩니다.
    """
    s = str(path)
    candidates = [s] if s.startswith("/") else ["/work/" + s, s]
    for c in candidates:
        try:
            with open(c, "rb") as f:
                return f.read()
        except OSError:
            continue
    raise FileNotFoundError(f"모델 파일을 찾을 수 없습니다: {path}")


class TMImageModel:
    """Teachable Machine 이미지 모델을 감싸는 클래스.

    하나의 인스턴스에서 모델 로딩, 예측, 결과 조회가 모두 이뤄집니다.
    한 번 :meth:`load_model` 로 모델을 불러온 뒤에는 :meth:`process` 에
    프레임을 넘겨 예측 라벨을 받을 수 있습니다. 가장 최근 예측의 라벨과
    신뢰도는 :attr:`labels` / :attr:`confidence` 프로퍼티로 접근합니다.

    Attributes:
        labels (list[str]): 모델이 학습한 클래스 이름 목록(프로퍼티).
        confidence (float | None): 가장 최근 예측의 신뢰도(0.0 ~ 1.0).
            예측 전에는 ``None``.
    """

    def __init__(self):
        """빈 상태의 TMImageModel 을 생성합니다.

        실제 사용 전에는 :meth:`load_model` 을 한 번 호출해야 합니다.
        """
        self.__handle = None
        self.__labels = []
        self.__label = None
        self.__confidence = None

    def load_model(self, url):
        """Teachable Machine "TensorFlow.js" 모델을 불러옵니다.

        Args:
            url (str): 두 가지 형태를 지원합니다.

                * **URL** — Teachable Machine 이 알려주는 호스팅 base URL.
                  예: ``https://teachablemachine.withgoogle.com/models/abcd1234/``.
                  런타임이 자동으로 ``model.json`` / ``metadata.json`` 을 덧붙입니다.
                * **로컬 ``.zip`` 경로** — IDE 탐색기에 업로드한 zip 파일 이름.
                  ``/work/`` 기준 상대경로 또는 절대경로. ``model.json`` +
                  ``weights.bin`` + ``metadata.json`` 이 포함되어 있어야 합니다.

        Returns:
            bool: 항상 ``True``. 실패 시에는 예외를 던집니다.

        Raises:
            FileNotFoundError: ``.zip`` 입력에서 파일을 찾지 못한 경우.

        Note:
            이미 다른 모델이 로딩되어 있다면 자동으로 해제 후 새 모델로
            교체합니다.
        """
        if self.__handle is not None:
            _mpBridge.call("tm.close", {"handle": self.__handle})
            self.__handle = None

        s = str(url)
        if s.startswith("http://") or s.startswith("https://"):
            result = _mpBridge.call("tm.load", {"url": s})
        else:
            data = _load_zip(s)
            result = _mpBridge.call("tm.loadFromBytes", {"bytes": data})

        self.__handle = int(result.get("handle"))
        labels = result.get("labels") or []
        # _mpBridge returns a Python dict with list values; copy to a plain list
        # so callers see a regular [str, str, ...] (not a JsProxy-derived view).
        self.__labels = [str(x) for x in labels]
        return True

    def process(self, img):
        """한 프레임에 대해 예측을 수행하고 라벨 문자열을 반환합니다.

        예측 결과는 :attr:`confidence` 에도 함께 저장되어, 호출 직후
        ``model.confidence`` 로 신뢰도를 확인할 수 있습니다.

        Args:
            img (Image): 처리할 이미지. ``Image`` 가 아니거나 내부 frame
                이 ``None`` 인 경우, 또는 모델이 아직 로드되지 않은 경우
                빈 문자열(``""``)을 반환합니다.

        Returns:
            str: 예측된 클래스 라벨. 모델 미로드/입력 오류 시에는 ``""``.

        Raises:
            ValueError: 내부 frame에 ``_token`` 이 없을 때 (``_resolve_token`` 참고).
        """
        if self.__handle is None:
            print("모델이 로딩되지 않았습니다")
            return ""
        if not isinstance(img, Image) or img.image is None:
            return ""

        token = _resolve_token(img.frame)
        result = _mpBridge.call(
            "tm.predict", {"handle": self.__handle, "frameToken": token}
        )
        self.__label = str(result.get("label") or "")
        try:
            self.__confidence = round(float(result.get("confidence") or 0.0), 3)
        except Exception:
            self.__confidence = 0.0
        return self.__label

    @property
    def labels(self):
        """모델이 학습한 클래스 이름 목록을 반환합니다.

        Returns:
            list[str]: 학습 클래스 이름. 모델 미로드 시에는 빈 리스트.
        """
        return self.__labels

    @property
    def confidence(self):
        """가장 최근 예측의 신뢰도를 반환합니다.

        Returns:
            float | None: 0.0 ~ 1.0 사이 값. 예측 전에는 ``None``.
        """
        return self.__confidence

    def summary(self):
        """모델 정보를 콘솔에 간단히 출력합니다.

        현재 버전에서는 학습된 클래스 이름 목록만 출력합니다. 모델이
        로드되지 않았다면 안내 메시지를 출력합니다.
        """
        if self.__handle is None:
            print("모델이 로딩되지 않았습니다")
            return
        print("labels :", self.__labels)

    def __del__(self):
        """가비지 컬렉션 시점에 안전하게 메인 스레드 모델을 해제합니다.

        해제 중 발생한 예외는 모두 삼켜 인터프리터 종료를 방해하지 않게 합니다.
        """
        try:
            if self.__handle is not None:
                _mpBridge.call("tm.close", {"handle": self.__handle})
                self.__handle = None
        except Exception:
            pass

    def __repr__(self):
        """디버깅용 문자열 표현을 반환합니다.

        Returns:
            str: 객체의 메모리 주소가 포함된 식별 문자열.
        """
        return f"<hello.core.TMImageModel at memory location: ({hex(id(self))})>"
