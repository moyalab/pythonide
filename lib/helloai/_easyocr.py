# -*- coding: utf-8 -*-
"""easyocr stub for the web IDE.

The real `easyocr` package depends on PyTorch which is not Pyodide
compatible. This shim routes `Reader.readtext()` to a Tesseract.js
runtime on the main thread; the result shape matches easyocr's
`[(bbox, text, prob), ...]`.
"""
import _mpBridge

__all__ = ["Reader"]


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "easyocr: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class Reader:
    """Minimal easyocr.Reader replacement.

    Args:
        lang_list: list of language codes, e.g. ['en', 'ko'].
        Other easyocr kwargs (gpu, model_storage_directory, …) are accepted
        for source-compat but ignored — the JS runtime handles model storage.
    """

    def __init__(self, lang_list=None, gpu=False, model_storage_directory=None,
                 user_network_directory=None, recog_network='standard',
                 download_enabled=True, detector=True, recognizer=True,
                 verbose=True, quantize=True, cudnn_benchmark=False):
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
        """Recognize text in image. Returns list of (bbox, text, prob).

        bbox is a list of 4 [x, y] corners (TL, TR, BR, BL) matching easyocr.
        Extra args (allowlist, blocklist, paragraph, …) are accepted and
        silently ignored — the underlying engine does not expose them.
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
        if self._closed:
            return
        try:
            _mpBridge.call("ocr.close", {"handle": self._handle})
        except Exception:
            pass
        self._closed = True

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass
