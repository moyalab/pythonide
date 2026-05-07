# -*- coding: utf-8 -*-
"""ImageClassifier — load a .fcm image (Transfer-Learning) model and classify
webcam frames using MobileNetV2 features.

Mirrors the Detector-style API:
    clf = ImageClassifier('models/cup.fcm')
    out_img, result = clf.process(Image(frame))
    print(result.label, result.confidence)

Image classification uses MobileNetV2 1280-dim features extracted on the JS
side, so we don't need a per-frame keypoint detector. The input frame must be
a FrameRef (the type returned by cv2.imread() / cv2.VideoCapture().read() in
this IDE) — raw numpy ndarrays are not supported.
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["ImageClassifier"]


def _load_fcm(path):
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
    """Image classifier loaded from a .fcm file (MobileNetV2 features).

    Args:
        model_path: 작업 폴더 기준 상대경로 또는 절대경로
        draw_label: True 면 process() 가 좌상단에 라벨 텍스트를 렌더
    """

    def __init__(self, model_path, draw_label=True):
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
        return list(self._labels)

    def process(self, image, draw=True, show_label=None):
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
        if self._closed:
            return
        self._closed = True
        try:
            _mpBridge.call("clf.close", {"handle": self._handle})
        except Exception:
            pass

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass
