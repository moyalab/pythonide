# -*- coding: utf-8 -*-
"""mp.solutions.hands — legacy-compatible wrapper around HandLandmarker."""
import enum
import _mpBridge

from .._proto import NormalizedLandmarkList, LandmarkList, ClassificationList
from ._connections import HAND_CONNECTIONS

__all__ = ["Hands", "HandLandmark", "HAND_CONNECTIONS"]


class HandLandmark(enum.IntEnum):
    WRIST = 0
    THUMB_CMC = 1
    THUMB_MCP = 2
    THUMB_IP = 3
    THUMB_TIP = 4
    INDEX_FINGER_MCP = 5
    INDEX_FINGER_PIP = 6
    INDEX_FINGER_DIP = 7
    INDEX_FINGER_TIP = 8
    MIDDLE_FINGER_MCP = 9
    MIDDLE_FINGER_PIP = 10
    MIDDLE_FINGER_DIP = 11
    MIDDLE_FINGER_TIP = 12
    RING_FINGER_MCP = 13
    RING_FINGER_PIP = 14
    RING_FINGER_DIP = 15
    RING_FINGER_TIP = 16
    PINKY_MCP = 17
    PINKY_PIP = 18
    PINKY_DIP = 19
    PINKY_TIP = 20


class _HandsResult:
    __slots__ = ("multi_hand_landmarks", "multi_hand_world_landmarks", "multi_handedness")

    def __init__(self, raw):
        landmarks = raw.get("landmarks") or []
        self.multi_hand_landmarks = (
            [NormalizedLandmarkList(lst) for lst in landmarks] if landmarks else None
        )
        world = raw.get("worldLandmarks") or []
        self.multi_hand_world_landmarks = (
            [LandmarkList(lst) for lst in world] if world else None
        )
        handed = raw.get("handednesses") or []
        self.multi_handedness = (
            [ClassificationList(c) for c in handed] if handed else None
        )


_ts_counter = [0]


def _next_ts_ms():
    _ts_counter[0] += 33
    return _ts_counter[0]


def _resolve_token(image):
    """Extract the frame token from an image. cv2.imread / cap.read attach
    a ._token attribute to their return value; user-created numpy arrays
    must be published first (see cv2 helpers).
    """
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "mediapipe: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class Hands:
    def __init__(
        self,
        static_image_mode=False,
        max_num_hands=2,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ):
        self._static = bool(static_image_mode)
        result = _mpBridge.call("mp.create", {
            "kind": "hand",
            "options": {
                "runningMode": "IMAGE" if self._static else "VIDEO",
                "numHands": int(max_num_hands),
                "modelComplexity": int(model_complexity),
                "minHandDetectionConfidence": float(min_detection_confidence),
                "minHandPresenceConfidence": float(min_detection_confidence),
                "minTrackingConfidence": float(min_tracking_confidence),
            },
        })
        self._handle = int(result["handle"])
        self._closed = False

    def process(self, image):
        if self._closed:
            raise RuntimeError("Hands.process called after close()")
        token = _resolve_token(image)
        raw = _mpBridge.call("mp.process", {
            "handle": self._handle,
            "frameToken": token,
            "mode": "image" if self._static else "video",
            "ts": 0 if self._static else _next_ts_ms(),
        })
        return _HandsResult(raw)

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
