# -*- coding: utf-8 -*-
"""mediapipe stub for the web IDE.

The real `mediapipe` PyPI package is not Pyodide-compatible. This stub
provides the legacy `mp.solutions.*` API surface that mediapipe tutorials
and books use, while routing inference to the JavaScript MediaPipe Tasks
runtime running on the main thread.

Only a subset of solutions / utilities is implemented; see solutions/* for
the actual list. Calls outside that surface raise AttributeError.
"""
from . import solutions

__version__ = "stub-0.1"
__all__ = ["solutions"]
