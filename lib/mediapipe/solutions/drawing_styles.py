# -*- coding: utf-8 -*-
"""mp.solutions.drawing_styles — minimal default-style helpers.

The legacy module exposes per-landmark color schemes; v1 returns a single
DrawingSpec for each helper (sufficient visual fidelity for tutorials).
"""
from .drawing_utils import DrawingSpec


def get_default_hand_landmarks_style():
    # Red filled landmarks (BGR (0, 0, 255)).
    return DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=4)


def get_default_hand_connections_style():
    # White connecting lines.
    return DrawingSpec(color=(255, 255, 255), thickness=2)
