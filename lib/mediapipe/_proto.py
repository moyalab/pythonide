# -*- coding: utf-8 -*-
"""Lightweight stand-ins for the mediapipe-protobuf result objects.

The classic API exposes `results.multi_hand_landmarks[i].landmark[j].x` /
`results.multi_handedness[i].classification[0].label` etc. We mirror that
nesting so user code that follows tutorials works unchanged.
"""


class _Pt:
    __slots__ = ("x", "y", "z", "visibility")

    def __init__(self, d):
        self.x = d["x"]
        self.y = d["y"]
        self.z = d.get("z", 0.0)
        self.visibility = d.get("visibility", 1.0)

    def __repr__(self):
        return f"Pt(x={self.x:.3f}, y={self.y:.3f}, z={self.z:.3f})"


class NormalizedLandmarkList:
    """multi_hand_landmarks[i] / multi_face_landmarks[i] equivalent.

    Access via ``.landmark[j].x/y/z`` to match the legacy protobuf API.
    """

    def __init__(self, raw_list):
        self.landmark = [_Pt(d) for d in raw_list]

    def __iter__(self):
        return iter(self.landmark)

    def __len__(self):
        return len(self.landmark)


class LandmarkList(NormalizedLandmarkList):
    """world_landmarks variant; same shape, different units (meters)."""


class _Classification:
    __slots__ = ("label", "score", "index")

    def __init__(self, d):
        self.label = d.get("label", "")
        self.score = d.get("score", 0.0)
        self.index = d.get("index", 0)


class ClassificationList:
    """multi_handedness[i] equivalent. Access via ``.classification[0].label``."""

    def __init__(self, raw):
        self.classification = [_Classification(c) for c in raw]
