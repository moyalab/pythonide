# -*- coding: utf-8 -*-
"""mp.solutions.pose — legacy-compatible wrapper around PoseLandmarker.

Pose has 33 landmarks (BlazePose). The legacy API exposes
`results.pose_landmarks` (single pose); we mirror that even though the
underlying Tasks API can return multiple poses.
"""
import enum
import _mpBridge

from .._proto import NormalizedLandmarkList, LandmarkList

__all__ = ["Pose", "PoseLandmark", "POSE_CONNECTIONS"]


class PoseLandmark(enum.IntEnum):
    NOSE = 0
    LEFT_EYE_INNER = 1
    LEFT_EYE = 2
    LEFT_EYE_OUTER = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR = 7
    RIGHT_EAR = 8
    MOUTH_LEFT = 9
    MOUTH_RIGHT = 10
    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_PINKY = 17
    RIGHT_PINKY = 18
    LEFT_INDEX = 19
    RIGHT_INDEX = 20
    LEFT_THUMB = 21
    RIGHT_THUMB = 22
    LEFT_HIP = 23
    RIGHT_HIP = 24
    LEFT_KNEE = 25
    RIGHT_KNEE = 26
    LEFT_ANKLE = 27
    RIGHT_ANKLE = 28
    LEFT_HEEL = 29
    RIGHT_HEEL = 30
    LEFT_FOOT_INDEX = 31
    RIGHT_FOOT_INDEX = 32


# --- Connection set from JS Tasks runtime ------------------------------------
_consts = _mpBridge.call("pose.constants", {})
POSE_CONNECTIONS = frozenset(
    (int(a), int(b)) for a, b in _consts.get("connections", [])
)


class _PoseResult:
    __slots__ = ("pose_landmarks", "pose_world_landmarks")

    def __init__(self, raw):
        landmarks = raw.get("landmarks") or []
        # Legacy `pose_landmarks` is a single NormalizedLandmarkList (first pose).
        self.pose_landmarks = NormalizedLandmarkList(landmarks[0]) if landmarks else None
        world = raw.get("worldLandmarks") or []
        self.pose_world_landmarks = LandmarkList(world[0]) if world else None


_ts_counter = [0]


def _next_ts_ms():
    _ts_counter[0] += 33
    return _ts_counter[0]


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "mediapipe.pose: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class Pose:
    def __init__(
        self,
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        enable_segmentation=False,
        smooth_segmentation=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ):
        # smooth_* and model_complexity are accepted for legacy parity but
        # not exposed by the Tasks runtime in the same shape; we ignore them.
        del smooth_landmarks, smooth_segmentation, model_complexity
        if enable_segmentation:
            # Segmentation masks are not yet wired in v1; warn but continue.
            print("[mediapipe.pose] enable_segmentation=True is ignored in v1.")
        self._static = bool(static_image_mode)
        result = _mpBridge.call("mp.create", {
            "kind": "pose",
            "options": {
                "runningMode": "IMAGE" if self._static else "VIDEO",
                "numPoses": 1,
                "minPoseDetectionConfidence": float(min_detection_confidence),
                "minPosePresenceConfidence": float(min_detection_confidence),
                "minTrackingConfidence": float(min_tracking_confidence),
            },
        })
        self._handle = int(result["handle"])
        self._closed = False

    def process(self, image):
        if self._closed:
            raise RuntimeError("Pose.process called after close()")
        token = _resolve_token(image)
        raw = _mpBridge.call("mp.process", {
            "handle": self._handle,
            "frameToken": token,
            "mode": "image" if self._static else "video",
            "ts": 0 if self._static else _next_ts_ms(),
        })
        return _PoseResult(raw)

    def close(self):
        if self._closed:
            return
        try:
            _mpBridge.call("mp.close", {"handle": self._handle})
        except Exception:
            pass
        self._closed = True

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()
        return False

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass
