# -*- coding: utf-8 -*-
"""HandClassifier — load a .fcm hand-keypoint model and classify webcam frames.

Independent of HandsDetector: keypoints are extracted on the JS side using
exactly the same library and options that the training panel used
(@mediapipe/tasks-vision HandLandmarker), so training and inference share
the same feature distribution.

    clf = HandClassifier('models/rps.fcm')
    out_img, result = clf.process(Image(frame))
    print(result.label, result.confidence)
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["HandClassifier"]


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


class HandClassifier:
    """Hand keypoint classifier loaded from a .fcm file.

    Args:
        model_path: 작업 폴더 기준 상대경로 또는 절대경로
        draw_label: True 면 process() 가 좌상단에 라벨 텍스트를 렌더
    """

    def __init__(self, model_path, draw_label=True):
        data = _load_fcm(model_path)
        info = _mpBridge.call("clf.load", {"bytes": data})
        kind = info.get("kind") if hasattr(info, "get") else info["kind"]
        if kind != "hand":
            raise ValueError(f"Not a hand model: kind={kind}")
        self._handle = int(info["handle"])
        self._labels = [str(x) for x in (info.get("labels") or [])]
        self._connections = [
            (int(c[0]), int(c[1])) for c in (info.get("connections") or [])
        ]
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
                "HandClassifier requires a FrameRef input "
                "(use cv2.imread() or cv2.VideoCapture().read()); "
                "raw numpy ndarrays are not supported."
            )

        r = _mpBridge.call("clf.predictKeypointFromFrame", {
            "handle": self._handle,
            "frameToken": int(token),
        })
        pix = [tuple(int(v) for v in p) for p in (r.get("pixelLandmarks") or [])]
        result = Result(
            label=str(r.get("label") or ""),
            index=int(r.get("index", -1)),
            confidence=float(r.get("confidence", 0.0)),
            probabilities=[float(p) for p in (r.get("probabilities") or [])],
            labels=list(self._labels),
            landmarks=pix,
        )

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and pix:
            self._draw_skeleton(image.frame, pix)
            if show and result.label:
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

    def _draw_skeleton(self, frame, pix):
        n = len(pix)
        for a, b in self._connections:
            if 0 <= a < n and 0 <= b < n:
                cv2.line(
                    frame,
                    (pix[a][0], pix[a][1]),
                    (pix[b][0], pix[b][1]),
                    (255, 0, 0), 2,
                )
        for x, y, _z in pix:
            cv2.circle(frame, (x, y), 4, (0, 255, 0), -1)

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
