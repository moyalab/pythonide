# -*- coding: utf-8 -*-
"""Minimal helloai.core.image.Image shim shared by ported detectors.

Only what the detectors read is implemented: ndarray-or-FrameRef in,
.frame / .image accessor out. Methods like .show(), .save(), .resize()
from the full helloai Image are NOT provided in v1.
"""


class Image:
    def __init__(self, frame):
        if frame is None:
            raise TypeError("Image() requires a frame")
        self._frame = frame

    @property
    def frame(self):
        return self._frame

    @property
    def image(self):
        return self._frame

    @property
    def width(self):
        try:
            return int(self._frame.shape[1])
        except Exception:
            return -1

    @property
    def height(self):
        try:
            return int(self._frame.shape[0])
        except Exception:
            return -1
