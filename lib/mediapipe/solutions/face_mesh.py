# -*- coding: utf-8 -*-
"""mp.solutions.face_mesh — legacy-compatible wrapper around FaceLandmarker.

Connection set constants (FACEMESH_TESSELATION, FACEMESH_CONTOURS, …) are
fetched once from the JS side at module load. Each is a frozenset of
(parent_idx, child_idx) tuples, matching the legacy mediapipe Python API.
"""
import _mpBridge

from .._proto import NormalizedLandmarkList

__all__ = [
    "FaceMesh",
    "FACEMESH_TESSELATION",
    "FACEMESH_CONTOURS",
    "FACEMESH_IRISES",
    "FACEMESH_FACE_OVAL",
    "FACEMESH_LIPS",
    "FACEMESH_LEFT_EYE",
    "FACEMESH_RIGHT_EYE",
    "FACEMESH_LEFT_EYEBROW",
    "FACEMESH_RIGHT_EYEBROW",
]


def _frozen(pairs):
    return frozenset((int(a), int(b)) for a, b in pairs)


# --- Connection sets ---------------------------------------------------------
_consts = _mpBridge.call("face.constants", {})

FACEMESH_TESSELATION = _frozen(_consts.get("tesselation", []))
FACEMESH_CONTOURS = _frozen(_consts.get("contours", []))
FACEMESH_FACE_OVAL = _frozen(_consts.get("faceOval", []))
FACEMESH_LIPS = _frozen(_consts.get("lips", []))
FACEMESH_LEFT_EYE = _frozen(_consts.get("leftEye", []))
FACEMESH_RIGHT_EYE = _frozen(_consts.get("rightEye", []))
FACEMESH_LEFT_EYEBROW = _frozen(_consts.get("leftEyebrow", []))
FACEMESH_RIGHT_EYEBROW = _frozen(_consts.get("rightEyebrow", []))
FACEMESH_IRISES = _frozen(
    list(_consts.get("leftIris", [])) + list(_consts.get("rightIris", []))
)


# --- FaceMesh ----------------------------------------------------------------
class _FaceMeshResult:
    __slots__ = ("multi_face_landmarks", "multi_face_blendshapes")

    def __init__(self, raw):
        landmarks = raw.get("landmarks") or []
        self.multi_face_landmarks = (
            [NormalizedLandmarkList(lst) for lst in landmarks] if landmarks else None
        )
        # blendshapes: list per face of {name: score} dicts. Only populated
        # when FaceMesh was created with output_face_blendshapes=True; legacy
        # FaceMesh callers can ignore it without side-effects.
        bs_per_face = raw.get("blendshapes") or []
        self.multi_face_blendshapes = (
            [{c["name"]: float(c["score"]) for c in cats} for cats in bs_per_face]
            if bs_per_face else None
        )


_ts_counter = [0]


def _next_ts_ms():
    _ts_counter[0] += 33
    return _ts_counter[0]


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "mediapipe.face_mesh: image has no frame token. "
            "Use cv2.imread(...) or cap.read() to obtain a usable image."
        )
    return int(tok)


class FaceMesh:
    def __init__(
        self,
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
        output_face_blendshapes=False,
    ):
        # refine_landmarks is implicitly always-on in MediaPipe Tasks (478-pt
        # model includes the iris); we accept the flag for API parity.
        del refine_landmarks
        self._static = bool(static_image_mode)
        result = _mpBridge.call("mp.create", {
            "kind": "face",
            "options": {
                "runningMode": "IMAGE" if self._static else "VIDEO",
                "numFaces": int(max_num_faces),
                "minFaceDetectionConfidence": float(min_detection_confidence),
                "minFacePresenceConfidence": float(min_detection_confidence),
                "minTrackingConfidence": float(min_tracking_confidence),
                "outputFaceBlendshapes": bool(output_face_blendshapes),
            },
        })
        self._handle = int(result["handle"])
        self._closed = False

    def process(self, image):
        if self._closed:
            raise RuntimeError("FaceMesh.process called after close()")
        token = _resolve_token(image)
        raw = _mpBridge.call("mp.process", {
            "handle": self._handle,
            "frameToken": token,
            "mode": "image" if self._static else "video",
            "ts": 0 if self._static else _next_ts_ms(),
        })
        return _FaceMeshResult(raw)

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
