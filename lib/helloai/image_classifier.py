# -*- coding: utf-8 -*-
"""ImageClassifier — ``.fcm`` 형식의 이미지 전이학습 모델로 프레임을 분류하는 모듈.

MobileNetV2 의 1280 차원 특징 벡터를 메인 스레드(JavaScript) 쪽에서 뽑아오므로,
프레임마다 따로 키포인트 검출기를 둘 필요가 없습니다. 입력으로는 반드시
``cv2.imread()`` 나 ``cv2.VideoCapture().read()`` 가 돌려주는 ``FrameRef`` 가
필요합니다(메인 스레드 프레임 토큰을 들고 있어야 하므로 raw numpy ndarray 는
지원하지 않습니다).

Examples:
    Detector 와 같은 흐름으로 사용할 수 있습니다::

        clf = ImageClassifier('models/cup.fcm')
        out_img, result = clf.process(Image(frame))
        print(result.label, result.confidence)
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["ImageClassifier"]


def _load_fcm(path):
    """``.fcm`` 모델 파일을 읽어 바이트로 반환합니다.

    절대경로면 그대로, 상대경로면 ``/work/`` 디렉터리 아래를 먼저 시도하고
    그 다음에 원본 경로를 시도합니다. IDE 탐색기에서 업로드한 파일이
    ``/work/`` 에 매핑된다는 점에 맞춰진 동작입니다.

    Args:
        path: 모델 파일 경로(문자열 또는 ``Path`` 비슷한 객체).

    Returns:
        bytes: 모델 파일 전체 바이트.

    Raises:
        FileNotFoundError: 어떤 후보 경로에서도 파일을 열 수 없을 때.
    """
    s = str(path)
    candidates = [s] if s.startswith("/") else ["/work/" + s, s]
    for c in candidates:
        try:
            with open(c, "rb") as f:
                return f.read()
        except OSError:
            continue
    raise FileNotFoundError(f"Cannot read .fcm: {path}")


class ImageClassifier:
    """``.fcm`` 파일에서 불러온 이미지 분류기 (MobileNetV2 특징 기반).

    생성자에서 모델을 한 번 메인 스레드 쪽에 등록한 뒤,
    :meth:`process` 가 그 핸들로 프레임을 보내 라벨/신뢰도를 받아옵니다.

    Args:
        model_path: ``.fcm`` 모델 파일 경로. 작업 폴더(``/work/``) 기준
            상대경로 또는 절대경로.
        draw_label (bool): ``True`` 면 :meth:`process` 가 결과 라벨을
            프레임 좌상단에 텍스트로 그려 넣습니다. 기본값은 ``True``.

    Attributes:
        labels (list[str]): 모델이 학습한 클래스 이름 목록(읽기 전용 프로퍼티).
    """

    def __init__(self, model_path, draw_label=True):
        """모델 파일을 읽어 메인 스레드 분류기 인스턴스를 만듭니다.

        Args:
            model_path: ``.fcm`` 파일 경로.
            draw_label (bool): 결과 라벨 자동 표시 여부.

        Raises:
            FileNotFoundError: 모델 파일을 열 수 없을 때.
            ValueError: 파일이 ``image`` 종류의 모델이 아닐 때
                (예: 손/얼굴/포즈 모델을 잘못 넘긴 경우).
        """
        data = _load_fcm(model_path)
        info = _mpBridge.call("clf.load", {"bytes": data})
        kind = info.get("kind") if hasattr(info, "get") else info["kind"]
        if kind != "image":
            raise ValueError(f"Not an image model: kind={kind}")
        self._handle = int(info["handle"])
        self._labels = [str(x) for x in (info.get("labels") or [])]
        self._closed = False
        self._draw_label = bool(draw_label)

    @property
    def labels(self):
        """모델의 클래스 이름 목록 사본을 반환합니다.

        Returns:
            list[str]: 학습된 클래스 이름들의 새 리스트(원본을 보호하기
            위해 매번 사본을 돌려줍니다).
        """
        return list(self._labels)

    def process(self, image, draw=True, show_label=None):
        """한 프레임을 분류해 :class:`Result` 를 반환합니다.

        Args:
            image (Image): 입력 이미지. 내부 frame은 반드시 ``FrameRef``
                여야 합니다(``cv2.imread()`` / ``cap.read()`` 결과).
            draw (bool): ``True`` 면 결과를 프레임 위에 그립니다(라벨 표시
                여부는 ``show_label`` 또는 생성자의 ``draw_label`` 에 따름).
            show_label (bool | None): 라벨 표시 여부를 호출 단위로 덮어씁니다.
                ``None`` 이면 생성자에서 받은 ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, Result]: ``(image, result)`` 형태.

            * ``image`` 는 입력으로 받은 :class:`Image` 인스턴스 그대로
              (그리기 옵션이 켜져 있으면 그 위에 라벨이 직접 그려져 있음).
            * ``result`` 는 :class:`helloai.result.Result` 형태의 분류 결과.

        Raises:
            TypeError: 내부 frame이 ``FrameRef`` 가 아닐 때(raw ndarray 등).
        """
        frame = image.frame
        token = getattr(frame, "_token", None)
        if token is None:
            raise TypeError(
                "ImageClassifier requires a FrameRef input "
                "(use cv2.imread() or cv2.VideoCapture().read()); "
                "raw numpy ndarrays are not supported."
            )

        r = _mpBridge.call("clf.predictImage", {
            "handle": self._handle,
            "frameToken": int(token),
        })
        result = Result(
            label=str(r.get("label") or ""),
            index=int(r.get("index", -1)),
            confidence=float(r.get("confidence", 0.0)),
            probabilities=[float(p) for p in (r.get("probabilities") or [])],
            labels=list(self._labels),
            landmarks=None,
        )

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and show and result.label:
            label_txt = result.label
            pct_txt = f"{result.confidence * 100:.1f}%"
            cv2.putText(image.frame, label_txt, (10, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
            cv2.putText(image.frame, pct_txt, (10, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
            cv2.putText(image.frame, label_txt, (10, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)
            cv2.putText(image.frame, pct_txt, (10, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)
        return image, result

    def close(self):
        """메인 스레드 분류기 인스턴스를 해제합니다.

        한 번 호출되면 :attr:`_closed` 가 ``True`` 로 설정되고 이후 호출은
        즉시 반환됩니다. 해제 도중 발생한 예외는 무시됩니다.
        """
        if self._closed:
            return
        self._closed = True
        try:
            _mpBridge.call("clf.close", {"handle": self._handle})
        except Exception:
            pass

    def __del__(self):
        """가비지 컬렉션 시점에 안전하게 :meth:`close` 를 호출합니다."""
        try:
            self.close()
        except Exception:
            pass
