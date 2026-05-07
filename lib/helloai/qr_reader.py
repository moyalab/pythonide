# -*- coding: utf-8 -*-
"""QRReader — read QR codes from camera frames or image files.

Designed to match the same `(results, Image)` shape used by ocr.OCR so
educational code can swap them. Decoding runs on the main thread via the
`jsQR` JavaScript library (no model, no network, sub-10ms typical).
"""
import web_cv2 as cv2
import _mpBridge
from .image import Image


__all__ = ["QRReader"]


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "QRReader: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class QRReader:
    """Read QR codes from a camera frame or an image file.

    Typical usage::

        qr = QRReader()
        results, out = qr.process(Image(frame))
        for (bbox, data) in results:
            print('QR found:', data)
        cv2.imshow('qr', out.frame)

    Each result item is ``(bbox, data)`` where:
      - ``bbox`` is ``[TL, TR, BR, BL]``, four ``[x, y]`` pixel-space points.
      - ``data`` is the decoded text (UTF-8 string).
    """

    def __init__(self):
        # No model to load — jsQR runs on raw pixels every call.
        pass

    def process(self, img, draw=True):
        """Decode QR codes in img. Returns ``(results, Image)``.

        ``img`` may be either a helloai Image or a FrameRef directly.
        Currently detects at most one QR per frame (jsQR limit).
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
        """Convenience: return only the decoded strings (no drawing)."""
        results, _ = self.process(img, draw=False)
        return [data for (_, data) in results]
