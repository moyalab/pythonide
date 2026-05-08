# -*- coding: utf-8 -*-
"""QRReader — 카메라 프레임이나 이미지 파일에서 QR 코드를 읽는 모듈.

반환 모양은 :class:`helloai.ocr.OCR` 과 같은 ``(results, Image)`` 튜플로
맞춰져 있어, 교육용 코드에서 OCR 과 QRReader 를 거의 그대로 바꿔 쓸 수
있습니다.

실제 디코딩은 메인 스레드의 ``jsQR`` JavaScript 라이브러리에서 수행됩니다.
별도의 머신러닝 모델이나 네트워크 호출이 없어 한 프레임당 보통 10ms 이내로
끝납니다.
"""
import web_cv2 as cv2
import _mpBridge
from .image import Image


__all__ = ["QRReader"]


def _resolve_token(image):
    """이미지 객체에서 메인 스레드 프레임 토큰을 꺼냅니다.

    Args:
        image: ``_token`` 프로퍼티를 가진 이미지 객체.

    Returns:
        int: 메인 스레드 프레임을 가리키는 정수 토큰.

    Raises:
        ValueError: ``_token`` 이 없을 때, 사용자가 ``cv2.imread(...)`` 또는
            ``cap.read()`` 로 이미지를 다시 받도록 안내하는 메시지와 함께
            발생합니다.
    """
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "QRReader: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class QRReader:
    """카메라 프레임이나 이미지 파일에서 QR 코드를 인식하는 클래스.

    한 번에 한 프레임을 처리하며, 결과는 ``(bbox, data)`` 튜플의 리스트로
    돌아옵니다. ``bbox`` 는 픽셀 좌표 4개(``[TL, TR, BR, BL]``)이고,
    ``data`` 는 디코딩된 UTF-8 문자열입니다. jsQR 의 한계로 한 프레임에서
    동시에 인식되는 QR 은 최대 1개입니다.

    Examples:
        간단한 사용 예::

            qr = QRReader()
            results, out = qr.process(Image(frame))
            for (bbox, data) in results:
                print('QR found:', data)
            cv2.imshow('qr', out.frame)
    """

    def __init__(self):
        """별도로 로드할 모델이 없으므로 아무 일도 하지 않습니다.

        Note:
            jsQR 은 매 호출마다 원본 픽셀을 직접 분석하므로 사전 로딩
            과정이 없습니다.
        """
        # No model to load — jsQR runs on raw pixels every call.
        pass

    def process(self, img, draw=True):
        """이미지에서 QR 코드를 디코딩합니다.

        Args:
            img: 처리할 이미지. :class:`helloai.image.Image` 인스턴스이거나
                메인 스레드의 ``FrameRef`` 를 직접 넘길 수 있습니다.
            draw (bool): ``True`` 면 인식한 QR 영역을 초록색 다각형으로
                테두리 치고, 좌상단 위에 디코딩된 텍스트를 빨간색으로
                표시합니다. 기본값은 ``True`` 입니다.

        Returns:
            tuple[list[tuple], Image]: ``(results, out)`` 형태의 튜플.

            * ``results`` 는 ``(bbox, data)`` 튜플의 리스트.
            * ``out`` 은 결과를 그려 넣은 새 :class:`Image` (``draw=False``
              일 때는 원본 프레임을 그대로 감싼 :class:`Image`).

        Raises:
            ValueError: ``img`` (또는 그 내부 frame)에 ``_token`` 이 없을 때.
        """
        if isinstance(img, Image):
            frame = img.frame
        else:
            frame = img

        token = _resolve_token(frame)
        raw = _mpBridge.call("qr.decode", {"frameToken": token})

        results = []
        for it in raw.get("items", []) or []:
            bbox = it.get("bbox") or []
            data = it.get("data", "")
            results.append((bbox, data))

        if draw:
            for (bbox, data) in results:
                if len(bbox) != 4:
                    continue
                # Polygon outline (green, BGR)
                pts = [tuple(map(int, p)) for p in bbox]
                for i in range(4):
                    cv2.line(frame, pts[i], pts[(i + 1) % 4], (0, 255, 0), 2)
                # Decoded text label above the top-left corner (red)
                tl = pts[0]
                cv2.putText(
                    frame,
                    data,
                    (tl[0], max(0, tl[1] - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 0, 255),
                    2,
                )

        return results, Image(frame)

    def read(self, img):
        """편의 메서드 — QR 코드의 디코딩된 문자열만 리스트로 돌려줍니다.

        프레임 위에 결과를 그리지 않으며, 좌표 정보도 빼고 순수 텍스트만
        필요할 때 사용합니다.

        Args:
            img: 처리할 이미지. :class:`Image` 또는 ``FrameRef``.

        Returns:
            list[str]: 디코딩된 문자열들의 리스트. 인식된 QR 이 없으면 빈 리스트.
        """
        results, _ = self.process(img, draw=False)
        return [data for (_, data) in results]
