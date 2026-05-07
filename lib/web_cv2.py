# -*- coding: utf-8 -*-
# Minimal OpenCV-compatible shim for the web IDE. Exposed as `web_cv2` so
# users can write `import web_cv2 as cv2` and remain aware that this is not
# the real OpenCV — only the surface needed by the IDE's mediapipe/imshow
# story is implemented; everything else raises NotImplementedError so
# failures are explicit.
import _cv2Bridge
import _mpBridge
import numpy as np


class _Flags:
    """Mimic numpy ndarray.flags for FrameRef. The settable attribute is a
    no-op — pixels live on the main thread, there is nothing to lock here.
    """
    __slots__ = ("writeable",)

    def __init__(self):
        self.writeable = True


class FrameRef:
    """Opaque handle to an image whose pixels live on the main thread.

    Exposes shape / ndim / dtype / flags so it duck-types like a numpy
    ndarray for the parts of cv2/mediapipe stubs that need it. Direct pixel
    access (e.g. image[y, x]) is intentionally unsupported in v1.
    """
    __slots__ = ("_token", "shape", "ndim", "dtype", "flags", "_w", "_h")

    def __init__(self, token, w, h, channels=3):
        self._token = int(token)
        self._w = int(w)
        self._h = int(h)
        self.shape = (self._h, self._w, int(channels))
        self.ndim = 3
        self.dtype = np.dtype(np.uint8)
        self.flags = _Flags()

    @property
    def width(self):
        return self._w

    @property
    def height(self):
        return self._h

    def copy(self):
        # Drawing operations are queued on the token; same token serves a copy.
        return self

# --- Color space codes (subset). Values match OpenCV. ---
COLOR_BGR2RGB = 4
COLOR_RGB2BGR = 4
COLOR_BGR2GRAY = 6
COLOR_GRAY2BGR = 8
COLOR_BGR2HSV = 40
COLOR_HSV2BGR = 54

# --- Window flags (no-op, present for compatibility). ---
WINDOW_NORMAL = 0
WINDOW_AUTOSIZE = 1

# --- Drawing thickness sentinel (== OpenCV's cv2.FILLED). ---
FILLED = -1

# --- Hershey font face constants (only the names are honored; canvas always
# renders a sans-serif approximation). Values match OpenCV. ---
FONT_HERSHEY_SIMPLEX = 0
FONT_HERSHEY_PLAIN = 1
FONT_HERSHEY_DUPLEX = 2
FONT_HERSHEY_COMPLEX = 3
FONT_HERSHEY_TRIPLEX = 4
FONT_HERSHEY_COMPLEX_SMALL = 5
FONT_HERSHEY_SCRIPT_SIMPLEX = 6
FONT_HERSHEY_SCRIPT_COMPLEX = 7


def _to_rgba_bytes(img):
    """numpy ndarray (HxW or HxWxC, uint8) -> (rgba_bytes, w, h).
    Input is assumed to be in OpenCV's BGR convention; output is RGBA
    suitable for ImageData on the main thread.
    """
    arr = np.asarray(img)
    if arr.dtype != np.uint8:
        arr = arr.astype(np.uint8)
    if arr.ndim == 2:
        h, w = arr.shape
        rgba = np.empty((h, w, 4), dtype=np.uint8)
        rgba[..., 0] = arr
        rgba[..., 1] = arr
        rgba[..., 2] = arr
        rgba[..., 3] = 255
        return rgba.tobytes(), w, h
    h, w, c = arr.shape
    if c == 4:
        # Treat as BGRA → swap to RGBA.
        rgba = np.empty_like(arr)
        rgba[..., 0] = arr[..., 2]
        rgba[..., 1] = arr[..., 1]
        rgba[..., 2] = arr[..., 0]
        rgba[..., 3] = arr[..., 3]
        return rgba.tobytes(), w, h
    if c == 3:
        rgba = np.empty((h, w, 4), dtype=np.uint8)
        rgba[..., 0] = arr[..., 2]
        rgba[..., 1] = arr[..., 1]
        rgba[..., 2] = arr[..., 0]
        rgba[..., 3] = 255
        return rgba.tobytes(), w, h
    raise ValueError("imshow: unsupported image shape: %r" % (arr.shape,))


def imshow(name, image):
    """Display image in the IDE's floating window. Non-blocking."""
    if isinstance(image, FrameRef):
        # Pixels live on the main thread; just point the window at the token.
        _cv2Bridge.imshowToken(str(name), int(image._token))
        return
    payload, w, h = _to_rgba_bytes(image)
    _cv2Bridge.imshow(str(name), int(w), int(h), payload)


def waitKey(ms=0):
    """Block until a key is pressed in the imshow window or ms elapses.

    ms <= 0 means wait forever. Returns the key code (low 8 bits)
    or -1 on timeout / when the window is not focused.
    """
    return int(_cv2Bridge.waitKey(int(ms)))


def destroyWindow(name):
    _cv2Bridge.destroyWindow(str(name))


def destroyAllWindows():
    _cv2Bridge.destroyAllWindows()


def cvtColor(image, code):
    """Best-effort color conversion.

    For FrameRef (token-backed) inputs, this is a no-op — the main-thread
    bitmap is already RGB and the BGR↔RGB toggle that mediapipe demos use
    is cosmetic.  For numpy inputs, swap channels in place.
    """
    if isinstance(image, FrameRef):
        return image
    arr = np.asarray(image)
    if code in (COLOR_BGR2RGB, COLOR_RGB2BGR):
        if arr.ndim == 3 and arr.shape[2] >= 3:
            out = arr.copy()
            out[..., 0] = arr[..., 2]
            out[..., 2] = arr[..., 0]
            return out
        return arr.copy()
    if code == COLOR_BGR2GRAY:
        if arr.ndim == 3 and arr.shape[2] >= 3:
            return (
                0.114 * arr[..., 0] + 0.587 * arr[..., 1] + 0.299 * arr[..., 2]
            ).astype(np.uint8)
        return arr.copy()
    if code == COLOR_GRAY2BGR:
        if arr.ndim == 2:
            return np.stack([arr, arr, arr], axis=-1)
        return arr.copy()
    raise NotImplementedError("cvtColor code %d not implemented" % code)


def flip(image, axis):
    if isinstance(image, FrameRef):
        # Flip will be applied by the main thread when imshow renders the
        # frame; for v1 we just pass the token through so drawing stays
        # aligned. (A future revision can carry a flip flag on the token.)
        return image
    arr = np.asarray(image)
    if axis == 0:
        return arr[::-1, :].copy()
    if axis == 1:
        return arr[:, ::-1].copy()
    return arr[::-1, ::-1].copy()


def _bgr_to_rgb_list(color):
    if len(color) >= 3:
        return [int(color[2]), int(color[1]), int(color[0])]
    return [int(color[0]), int(color[0]), int(color[0])]


def line(image, pt1, pt2, color, thickness=1):
    """Queue a line drawing op on the image's overlay. Returns the same image
    so user code that does ``image = cv2.line(image, ...)`` keeps working.
    """
    tok = getattr(image, "_token", None)
    if tok is not None:
        _cv2Bridge.queueDraw(int(tok), {
            "op": "line",
            "pt1": [int(pt1[0]), int(pt1[1])],
            "pt2": [int(pt2[0]), int(pt2[1])],
            "color": _bgr_to_rgb_list(color),
            "thickness": int(thickness),
        })
    return image


def circle(image, center, radius, color, thickness=1):
    """Queue a circle drawing op. thickness=-1 (FILLED) fills the disc."""
    tok = getattr(image, "_token", None)
    if tok is not None:
        _cv2Bridge.queueDraw(int(tok), {
            "op": "circle",
            "center": [int(center[0]), int(center[1])],
            "radius": int(radius),
            "color": _bgr_to_rgb_list(color),
            "thickness": int(thickness),
        })
    return image


def rectangle(image, pt1, pt2, color, thickness=1):
    """Queue a rectangle drawing op. thickness=-1 (FILLED) fills the rect."""
    tok = getattr(image, "_token", None)
    if tok is not None:
        _cv2Bridge.queueDraw(int(tok), {
            "op": "rectangle",
            "pt1": [int(pt1[0]), int(pt1[1])],
            "pt2": [int(pt2[0]), int(pt2[1])],
            "color": _bgr_to_rgb_list(color),
            "thickness": int(thickness),
        })
    return image


def putText(image, text, org, fontFace, fontScale, color, thickness=1, lineType=None, bottomLeftOrigin=False):
    """Queue a text drawing op. fontFace is honored only by name (the canvas
    renders a sans-serif approximation); fontScale maps to ~14*scale px.
    """
    del fontFace, lineType, bottomLeftOrigin  # Approximated by canvas defaults.
    tok = getattr(image, "_token", None)
    if tok is not None:
        _cv2Bridge.queueDraw(int(tok), {
            "op": "text",
            "text": str(text),
            "org": [int(org[0]), int(org[1])],
            "fontPx": int(round(float(fontScale) * 14)),
            "color": _bgr_to_rgb_list(color),
            "thickness": int(thickness),
        })
    return image


def imread(path, flags=None):
    """Load an image and return a FrameRef whose pixels are held on the main
    thread (zero-copy for the worker).

    `path` may be either:
      - an HTTP(S) URL (fetched on the main thread, subject to CORS); or
      - a virtual filesystem path (tried as /work/<path> first, then /<path>).
    Returns None on failure to match OpenCV's behavior.
    """
    s = str(path)
    if s.startswith("http://") or s.startswith("https://"):
        try:
            result = _mpBridge.call("img.fetch", {"url": s})
        except Exception:
            return None
        return FrameRef(result["token"], result["w"], result["h"])
    candidates = []
    if not s.startswith("/"):
        candidates.append("/work/" + s)
    candidates.append(s)
    data = None
    for cand in candidates:
        try:
            with open(cand, "rb") as f:
                data = f.read()
            break
        except OSError:
            continue
    if data is None:
        return None  # OpenCV returns None on failure
    result = _mpBridge.call("img.read", {"bytes": data})
    return FrameRef(result["token"], result["w"], result["h"])


def imwrite(*a, **k):
    raise NotImplementedError(
        "imwrite is not implemented yet in this IDE."
    )


class VideoCapture:
    """Webcam capture backed by getUserMedia on the main thread.

    Only a single camera is supported in v1. Each .read() call grabs the
    latest video frame as a FrameRef whose pixels live on the main thread.
    """

    def __init__(self, source=0):
        self._opened = False
        self._w = 0
        self._h = 0
        try:
            r = _mpBridge.call("cam.open", {"deviceIndex": int(source)})
            self._w = int(r.get("w", 0))
            self._h = int(r.get("h", 0))
            self._opened = self._w > 0 and self._h > 0
        except Exception as e:
            print(f"[VideoCapture] open failed: {e}")
            self._opened = False

    def isOpened(self):
        if not self._opened:
            return False
        try:
            r = _mpBridge.call("cam.isOpen", {})
            return bool(r.get("open", False))
        except Exception:
            return False

    def read(self):
        if not self._opened:
            return False, None
        r = _mpBridge.call("cam.read", {})
        token = int(r.get("token", 0))
        if token == 0:
            return False, None
        w = int(r.get("w", self._w))
        h = int(r.get("h", self._h))
        return True, FrameRef(token, w, h)

    def release(self):
        if not self._opened:
            return
        try:
            _mpBridge.call("cam.release", {})
        except Exception:
            pass
        self._opened = False

    def __del__(self):
        try:
            self.release()
        except Exception:
            pass
