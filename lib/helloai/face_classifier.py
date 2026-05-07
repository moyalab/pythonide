# -*- coding: utf-8 -*-
"""FaceClassifier — load a .fcm face-keypoint model and classify webcam frames.

Independent of FaceDetector: keypoints are extracted on the JS side using
exactly the same library and options that the training panel used
(@mediapipe/tasks-vision FaceLandmarker), so training and inference share
the same feature distribution.

`Result.landmarks` contains *only* the trained subset (FACE_KEY_INDICES, 82
points), in the same order the training panel uses, in pixel coordinates.

    clf = FaceClassifier('models/emotion.fcm')
    out_img, result = clf.process(Image(frame))
    print(result.label, result.confidence)
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["FaceClassifier"]


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


_FACE_GROUP_KEYS = (
    "tesselation",
    "faceOval",
    "rightEye", "rightEyebrow", "rightIris",
    "leftEye",  "leftEyebrow",  "leftIris",
    "lips",
)

# 학습 패널 (faceTracker.drawFaceLandmarks) 의 drawConnectors 호출과 동일한
# 색/두께를 BGR 로 옮긴 것. 순서도 학습 시와 같다 — tesselation 을 가장 먼저
# 깔고 그 위에 윤곽/눈/눈썹/홍채/입술을 덮어 그린다.
_FACE_GROUP_STYLE = {
    "tesselation":  ((192, 192, 192), 1),  # #C0C0C0 (학습은 30 알파)
    "faceOval":     ((224, 224, 224), 1),  # #E0E0E0
    "rightEye":     (( 48,  48, 255), 1),  # #FF3030 (BGR)
    "rightEyebrow": (( 48,  48, 255), 1),  # #FF3030
    "rightIris":    (( 48,  48, 255), 1),  # #FF3030
    "leftEye":      (( 48, 255,  48), 1),  # #30FF30
    "leftEyebrow":  (( 48, 255,  48), 1),  # #30FF30
    "leftIris":     (( 48, 255,  48), 1),  # #30FF30
    "lips":         ((224, 224, 224), 1),  # #E0E0E0
}


class FaceClassifier:
    """Face keypoint classifier loaded from a .fcm file.

    Args:
        model_path: 작업 폴더 기준 상대경로 또는 절대경로
        draw_label: True 면 process() 가 좌상단에 라벨 텍스트를 렌더
    """

    def __init__(self, model_path, draw_label=True):
        data = _load_fcm(model_path)
        info = _mpBridge.call("clf.load", {"bytes": data})
        kind = info.get("kind") if hasattr(info, "get") else info["kind"]
        if kind != "face":
            raise ValueError(f"Not a face model: kind={kind}")
        self._handle = int(info["handle"])
        self._labels = [str(x) for x in (info.get("labels") or [])]
        # 학습 패널과 동일한 그룹별(478-인덱스) 컨넥션. 한 번만 받아둔다.
        cg = info.get("faceColorGroups") or {}
        self._color_groups = {}
        for k in _FACE_GROUP_KEYS:
            edges = cg.get(k) or []
            self._color_groups[k] = [
                (int(e[0]), int(e[1])) for e in edges
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
                "FaceClassifier requires a FrameRef input "
                "(use cv2.imread() or cv2.VideoCapture().read()); "
                "raw numpy ndarrays are not supported."
            )

        r = _mpBridge.call("clf.predictKeypointFromFrame", {
            "handle": self._handle,
            "frameToken": int(token),
        })
        # 82 (px, py, pz) tuples — only the trained FACE_KEY_INDICES points.
        pix = [tuple(int(v) for v in p) for p in (r.get("pixelLandmarks") or [])]
        # 478 (px, py, pz) tuples — full landmark set, used solely for drawing
        # the same colored overlay the training panel renders.
        full_pix = [
            tuple(int(v) for v in p) for p in (r.get("fullPixelLandmarks") or [])
        ]
        result = Result(
            label=str(r.get("label") or ""),
            index=int(r.get("index", -1)),
            confidence=float(r.get("confidence", 0.0)),
            probabilities=[float(p) for p in (r.get("probabilities") or [])],
            labels=list(self._labels),
            landmarks=pix,
        )

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and full_pix:
            self._draw_face_overlay(image.frame, full_pix)
            # 모델 추론에 실제로 입력되는 trained-subset(82) 포인트를 빨간 점으로
            # 덧그려, 메쉬 오버레이 위에서 어떤 점이 학습/추론에 쓰이는지 보이게
            # 한다.
            for x, y, _z in pix:
                cv2.circle(image.frame, (x, y), 3, (0, 0, 255), -1)
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

    def _draw_face_overlay(self, frame, full_pix):
        # 학습 패널의 DrawingUtils.drawConnectors 호출 순서와 동일하게,
        # tesselation → 윤곽/눈/눈썹/홍채/입술 순으로 덮어 그린다.
        n = len(full_pix)
        for key in _FACE_GROUP_KEYS:
            edges = self._color_groups.get(key) or []
            color, thickness = _FACE_GROUP_STYLE[key]
            for a, b in edges:
                if 0 <= a < n and 0 <= b < n:
                    cv2.line(
                        frame,
                        (full_pix[a][0], full_pix[a][1]),
                        (full_pix[b][0], full_pix[b][1]),
                        color, thickness,
                    )

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
