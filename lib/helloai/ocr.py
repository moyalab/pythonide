# -*- coding: utf-8 -*-
"""OCR ported from helloai.ext.ocr for the web IDE.

Original: helloai-06-dev-2.8/helloai/helloai/ext/ocr/ocr.py
Changes vs. the original:
  - `from helloai.core.image import Image` → shared `_helloai_image` shim
  - PIL/easyocr-on-PyTorch is replaced by Tesseract.js via the easyocr stub
    (interface preserved: Reader().readtext(image) returns the same shape)
  - PIL drawing (rectangle + Korean text) is replaced by cv2.rectangle +
    cv2.putText so the overlay queue can render it on the imshow canvas
"""
import web_cv2 as cv2
from . import _easyocr as easyocr
from .image import Image


__all__ = ["OCR"]


class OCR:
    def __init__(self):
        self.__reader = easyocr.Reader(['en', 'ko'])

    def readtext(self, img, isdraw=True):
        if not isinstance(img, Image) or img.image is None:
            return []

        frame = img.frame
        results = self.__reader.readtext(frame)

        if isdraw:
            for (bbox, text, prob) in results:
                top_left = tuple(map(int, bbox[0]))
                bottom_right = tuple(map(int, bbox[2]))

                # Green outline rectangle (BGR (0, 255, 0))
                cv2.rectangle(frame, top_left, bottom_right, (0, 255, 0), 2)
                # Red label above the box (BGR (0, 0, 255))
                cv2.putText(
                    frame,
                    f"{text} ({prob:.2f})",
                    (top_left[0], max(0, top_left[1] - 5)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 0, 255),
                    2,
                )

        return results, Image(frame)
