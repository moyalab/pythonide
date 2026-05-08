# -*- coding: utf-8 -*-
"""Subset of mp.solutions.* for the web IDE.

Currently implemented: hands. Pose / FaceMesh / FaceDetection / etc. are
planned but not yet wired.
"""
from . import hands  # noqa: F401
from . import face_mesh  # noqa: F401
from . import pose  # noqa: F401
from . import drawing_utils  # noqa: F401
from . import drawing_styles  # noqa: F401

__all__ = ["hands", "face_mesh", "pose", "drawing_utils", "drawing_styles"]
