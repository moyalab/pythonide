# -*- coding: utf-8 -*-
"""TMImageModel — Teachable Machine image classifier for the web IDE.

Loads a Teachable Machine "TensorFlow.js" model and predicts via
`@teachablemachine/image` running on the main thread (see
`src/runtime/mp/tmRuntime.js`). Two model sources are supported:

1. The hosted shareable URL printed by TM
   (e.g. ``https://teachablemachine.withgoogle.com/models/XXXX/``).
2. A ``.zip`` archive uploaded to the IDE Explorer that contains
   ``model.json`` + ``weights.bin`` + ``metadata.json`` (TM's
   "Tensorflow.js" → "Download my model" export).

The keras ``.h5`` workflow from the original
``helloai.ext.tmimage.tm_imageproject`` is intentionally absent —
browser TFJS cannot read ``.h5`` directly.

Usage::

    from helloai import TMImageModel, Image
    import web_cv2 as cv2

    tm = TMImageModel()
    tm.load_model("https://teachablemachine.withgoogle.com/models/XXXX/")
    # or: tm.load_model("my_model.zip")
"""
import _mpBridge
from .image import Image


__all__ = ["TMImageModel"]


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "TMImageModel: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


def _load_zip(path):
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
    def __init__(self):
        self.__handle = None
        self.__labels = []
        self.__label = None
        self.__confidence = None

    def load_model(self, url):
        """Load a Teachable Machine "TensorFlow.js" model.

        ``url`` accepts two forms:

        - The hosted base URL printed by TM (e.g.
          ``https://teachablemachine.withgoogle.com/models/abcd1234/``).
          The runtime appends ``model.json`` / ``metadata.json``.
        - A ``.zip`` path (relative to ``/work/`` or absolute) containing
          ``model.json`` + ``weights.bin`` + ``metadata.json``. Upload the
          zip to the IDE Explorer first, then pass its filename.
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
        return self.__labels

    @property
    def confidence(self):
        return self.__confidence

    def summary(self):
        if self.__handle is None:
            print("모델이 로딩되지 않았습니다")
            return
        print("labels :", self.__labels)

    def __del__(self):
        try:
            if self.__handle is not None:
                _mpBridge.call("tm.close", {"handle": self.__handle})
                self.__handle = None
        except Exception:
            pass

    def __repr__(self):
        return f"<hello.core.TMImageModel at memory location: ({hex(id(self))})>"
