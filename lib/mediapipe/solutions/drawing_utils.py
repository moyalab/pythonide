# -*- coding: utf-8 -*-
"""mp.solutions.drawing_utils — landmark/connection drawing.

Drawing happens on the main thread's canvas overlay; the Python `image`
parameter must carry a frame token (i.e. came from cv2.imread / cap.read).
We do not modify pixel buffers in the worker.
"""
import _cv2Bridge


class DrawingSpec:
    __slots__ = ("color", "thickness", "circle_radius")

    def __init__(self, color=(224, 224, 224), thickness=2, circle_radius=2):
        # color is a BGR tuple per cv2 convention.
        self.color = tuple(int(c) for c in color)
        self.thickness = int(thickness)
        self.circle_radius = int(circle_radius)


_DEFAULT_LM_SPEC = DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=4)
_DEFAULT_CONN_SPEC = DrawingSpec(color=(255, 255, 255), thickness=2)


def _spec_dict(spec):
    if spec is None:
        return None
    # Convert BGR → RGB once, here, since the canvas overlay is RGB-native.
    c = spec.color
    return {
        "color": [int(c[2]), int(c[1]), int(c[0])],
        "thickness": int(spec.thickness),
        "circle_radius": int(spec.circle_radius),
    }


def _resolve_token(image):
    tok = getattr(image, "_token", None)
    if tok is None:
        raise ValueError(
            "drawing_utils: image has no frame token. "
            "Pass an image obtained from cv2.imread / cap.read."
        )
    return int(tok)


def draw_landmarks(
    image,
    landmark_list,
    connections=None,
    landmark_drawing_spec=_DEFAULT_LM_SPEC,
    connection_drawing_spec=_DEFAULT_CONN_SPEC,
):
    if landmark_list is None:
        return
    token = _resolve_token(image)
    points = [(float(lm.x), float(lm.y)) for lm in landmark_list.landmark]
    edges = [list(pair) for pair in (connections or [])]
    op = {
        "op": "landmarks",
        "points": points,
        "edges": edges,
        "landmarkSpec": _spec_dict(landmark_drawing_spec),
        "connectionSpec": _spec_dict(connection_drawing_spec),
    }
    _cv2Bridge.queueDraw(token, op)


def draw_detection(image, detection):
    # Reserved for FaceDetection in a later milestone.
    raise NotImplementedError("draw_detection is not implemented yet.")
