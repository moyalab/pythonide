# -*- coding: utf-8 -*-
"""Connection sets used by mp_drawing.draw_landmarks(...).

The MediaPipe Tasks JS API does not expose these constants directly, so
they are hard-coded here to match the legacy mediapipe Python values.
"""

HAND_CONNECTIONS = frozenset([
    # Thumb
    (0, 1), (1, 2), (2, 3), (3, 4),
    # Index
    (0, 5), (5, 6), (6, 7), (7, 8),
    # Middle
    (5, 9), (9, 10), (10, 11), (11, 12),
    # Ring
    (9, 13), (13, 14), (14, 15), (15, 16),
    # Pinky
    (13, 17), (0, 17), (17, 18), (18, 19), (19, 20),
])
