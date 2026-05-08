# -*- coding: utf-8 -*-
"""웹 IDE용 ``easyocr`` 호환 스텁 모듈.

원본 ``easyocr`` 패키지는 PyTorch에 의존하기 때문에 Pyodide에서는 그대로
설치/실행할 수 없습니다. 이 모듈은 같은 인터페이스(``Reader``,
``readtext`` 등)를 흉내 내되, 실제 인식 작업은 메인 스레드에서 동작하는
Tesseract.js 런타임에 위임합니다.

반환 형식은 원본과 동일하게 ``[(bbox, text, prob), ...]`` 입니다.
이 덕분에 :class:`helloai.ocr.OCR` 같은 상위 코드는 원본 easyocr 와
스텁을 구분 없이 사용할 수 있습니다.
"""
import _mpBridge

__all__ = ["Reader"]


def _resolve_token(image):
    """이미지 객체에서 메인 스레드 프레임 토큰을 꺼냅니다.

    Pyodide 워커에서 메인 스레드의 이미지에 접근하려면 ``_token``
    프로퍼티에 보관된 정수 핸들이 필요합니다. 이 함수는 해당 토큰을
    안전하게 꺼내고, 없을 때는 사용자에게 친절한 안내를 띄웁니다.

    Args:
        image: ``_token`` 프로퍼티를 가진 이미지 객체. 보통
            :class:`helloai.image.Image` 또는 ``FrameRef`` 입니다.

    Returns:
        int: 메인 스레드 프레임을 가리키는 정수 토큰.

    Raises:
        ValueError: ``image`` 가 ``_token`` 을 가지고 있지 않을 때.
            ``cv2.imread(...)`` 또는 ``cap.read()`` 로 얻은 이미지를
            전달하라는 안내를 함께 띄웁니다.
    """
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "easyocr: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class Reader:
    """원본 ``easyocr.Reader`` 의 최소 인터페이스 구현체.

    내부적으로 ``_mpBridge`` 를 통해 메인 스레드의 Tesseract.js 인스턴스를
    제어합니다. 생성자에서 한 번 모델을 초기화한 뒤, :meth:`readtext` 가
    반복적으로 그 인스턴스를 재사용합니다.

    Args:
        lang_list (list[str] | None): 인식할 언어 코드 목록. 예: ``['en', 'ko']``.
            ``None`` 이면 ``['en']`` 으로 동작합니다.
        gpu, model_storage_directory, user_network_directory, recog_network,
        download_enabled, detector, recognizer, quantize, cudnn_benchmark:
            원본 easyocr 와의 시그니처 호환성을 위해 받지만, JS 런타임이
            모델 저장/하드웨어를 알아서 다루기 때문에 모두 무시됩니다.
        verbose (bool): ``True`` 면 모델 로드 시 안내 메시지를 출력합니다.
            기본값은 ``True``.

    Attributes:
        _handle (int): 메인 스레드 reader 인스턴스 식별자.
        _closed (bool): :meth:`close` 호출 여부. ``True`` 이면 더 이상
            :meth:`readtext` 를 호출할 수 없습니다.
    """

    def __init__(self, lang_list=None, gpu=False, model_storage_directory=None,
                 user_network_directory=None, recog_network='standard',
                 download_enabled=True, detector=True, recognizer=True,
                 verbose=True, quantize=True, cudnn_benchmark=False):
        """주어진 언어로 메인 스레드 OCR 인스턴스를 초기화합니다.

        ``verbose`` 가 ``True`` 인 경우, 첫 실행에서 언어별 학습 데이터를
        다운로드한다는 안내(언어당 약 5~10MB)를 사용자에게 알려줍니다.
        """
        del gpu, model_storage_directory, user_network_directory, recog_network
        del download_enabled, detector, recognizer, quantize, cudnn_benchmark
        langs = list(lang_list) if lang_list else ["en"]
        if verbose:
            print(
                f"[easyocr] Loading OCR models for {langs} via Tesseract.js. "
                "First run downloads language data (~5-10MB per language)."
            )
        result = _mpBridge.call("ocr.create", {"langs": langs})
        self._handle = int(result["handle"])
        self._closed = False

    def readtext(self, image, *args, **kwargs):
        """이미지에서 글자를 인식해 결과 리스트를 돌려줍니다.

        Args:
            image: ``_token`` 을 가진 이미지 객체(보통 :class:`helloai.image.Image`).
            *args, **kwargs: 원본 easyocr 의 옵션(``allowlist``, ``blocklist``,
                ``paragraph`` 등)을 시그니처 호환을 위해 받기는 하지만,
                내부 엔진(Tesseract.js)이 제공하지 않는 옵션이므로 모두
                무시됩니다.

        Returns:
            list[tuple]: ``(bbox, text, prob)`` 튜플의 리스트.

            * ``bbox`` 는 ``[TL, TR, BR, BL]`` 순서로 4개의 ``[x, y]``
              꼭짓점 좌표입니다(원본 easyocr 와 동일).
            * ``text`` 는 인식된 문자열입니다.
            * ``prob`` 은 인식 신뢰도(0.0 ~ 1.0)입니다.

        Raises:
            RuntimeError: 이미 :meth:`close` 가 호출된 reader에 대해 호출되었을 때.
            ValueError: 이미지에 ``_token`` 이 없을 때 (``_resolve_token`` 참고).
        """
        if self._closed:
            raise RuntimeError("Reader.readtext called after close()")
        token = _resolve_token(image)
        raw = _mpBridge.call("ocr.readtext", {
            "handle": self._handle,
            "frameToken": token,
        })
        out = []
        for it in raw.get("items", []) or []:
            bbox = it.get("bbox") or []
            text = it.get("text", "")
            prob = float(it.get("prob", 0.0))
            out.append((bbox, text, prob))
        return out

    def close(self):
        """메인 스레드 reader 인스턴스를 해제합니다.

        한 번 호출되면 :attr:`_closed` 가 ``True`` 로 설정되며, 이후
        호출은 즉시 반환됩니다. 해제 도중 발생하는 예외는 무시되어
        애플리케이션 종료 흐름을 막지 않도록 합니다.
        """
        if self._closed:
            return
        try:
            _mpBridge.call("ocr.close", {"handle": self._handle})
        except Exception:
            pass
        self._closed = True

    def __del__(self):
        """가비지 컬렉션 시점에 안전하게 :meth:`close` 를 호출합니다.

        ``__del__`` 에서 발생하는 예외는 모두 삼켜 인터프리터 종료를
        방해하지 않도록 합니다.
        """
        try:
            self.close()
        except Exception:
            pass
