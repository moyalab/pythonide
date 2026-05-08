# -*- coding: utf-8 -*-
"""웹 IDE용 OpenCV 호환 최소 shim 모듈.

브라우저(Pyodide) 환경에서는 진짜 OpenCV 를 그대로 쓸 수 없기 때문에,
이 모듈이 OpenCV 의 가장 자주 쓰이는 함수/상수들만 흉내 내서 같은
시그니처로 제공해 줍니다. 사용자 코드에서는 다음과 같이 가져와 쓰는 것을
권장합니다::

    import web_cv2 as cv2

이렇게 쓰면 일반 OpenCV 코드처럼 보이지만, 실제로 그려지는 픽셀은 메인
스레드(JavaScript) 가 들고 있습니다. Worker 와 메인 스레드 사이에 픽셀을
복사해 오가지 않고 토큰(:class:`FrameRef`)으로만 가리킨다는 점이 핵심
설계 차이입니다.

구현되지 않은 OpenCV API는 의도적으로 ``NotImplementedError`` 를 던져,
조용히 잘못된 결과가 나가는 것을 막습니다. 이 IDE 의 mediapipe / imshow
시연에 필요한 표면만 구현되어 있습니다.
"""
import _cv2Bridge
import _mpBridge
import numpy as np


class _Flags:
    """numpy ``ndarray.flags`` 를 흉내 내는 더미 객체.

    MediaPipe 등이 ``image.flags.writeable = False`` 같은 식으로 ``flags``
    필드에 접근하기 때문에 :class:`FrameRef` 가 같은 모양의 객체를 들고
    있어야 합니다. 이 객체의 ``writeable`` 은 단순한 메모리 플래그이며,
    실제 픽셀이 메인 스레드에 있기 때문에 락(lock) 효과는 없습니다.
    """
    __slots__ = ("writeable",)

    def __init__(self):
        """``writeable`` 플래그를 ``True`` 로 두고 시작합니다."""
        self.writeable = True


class FrameRef:
    """메인 스레드에 픽셀이 있는 이미지에 대한 불투명 핸들.

    ``shape`` / ``ndim`` / ``dtype`` / ``flags`` 를 함께 노출하므로 mediapipe
    같은 라이브러리에서 numpy ndarray 처럼 동작합니다(덕 타이핑). 단, 픽셀
    값에 직접 접근하는 ``image[y, x]`` 같은 인덱싱은 v1 에서는 의도적으로
    지원하지 않습니다.

    Args:
        token (int): 메인 스레드 프레임을 가리키는 정수 토큰.
        w (int): 가로 해상도(픽셀).
        h (int): 세로 해상도(픽셀).
        channels (int): 채널 수. 기본값 3 (BGR).

    Attributes:
        shape (tuple[int, int, int]): ``(h, w, channels)`` 형태의 형상 튜플.
        ndim (int): 항상 ``3``.
        dtype (numpy.dtype): 항상 ``uint8``.
        flags (_Flags): numpy 호환 더미 flags.
        width (int): 가로 픽셀 수(프로퍼티).
        height (int): 세로 픽셀 수(프로퍼티).
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
        """가로 픽셀 수를 반환합니다."""
        return self._w

    @property
    def height(self):
        """세로 픽셀 수를 반환합니다."""
        return self._h

    def copy(self):
        """numpy ``copy()`` 호환 메서드. 자기 자신을 그대로 돌려줍니다.

        :class:`FrameRef` 의 그리기 작업은 모두 토큰 기반의 큐에 누적되므로,
        토큰 하나가 곧 한 장의 캔버스를 가리킵니다. 따라서 별도의 픽셀 복사
        없이 같은 핸들을 그대로 돌려주어도 의미가 같습니다.

        Returns:
            FrameRef: ``self``.
        """
        # Drawing operations are queued on the token; same token serves a copy.
        return self

# --- Color space codes (subset). Values match OpenCV. ---
COLOR_BGR2RGB = 4
COLOR_RGB2BGR = 4
COLOR_BGR2GRAY = 6
COLOR_GRAY2BGR = 8
COLOR_BGR2HSV = 40
COLOR_HSV2BGR = 54
"""``cv2.cvtColor`` 코드의 부분집합. 값은 OpenCV 와 동일합니다."""

# --- Window flags (no-op, present for compatibility). ---
WINDOW_NORMAL = 0
WINDOW_AUTOSIZE = 1
"""``cv2.namedWindow`` 호환용 윈도 플래그. 실제 동작은 무시됩니다."""

# --- Drawing thickness sentinel (== OpenCV's cv2.FILLED). ---
FILLED = -1
"""채우기 두께 센티넬. ``thickness=FILLED`` 로 전달하면 면 채우기 의미입니다."""

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
"""Hershey 폰트 식별자. 이름만 인정되며 실제 렌더링은 캔버스 sans-serif 근사."""


def _to_rgba_bytes(img):
    """numpy ndarray 를 ``ImageData`` 용 RGBA 바이트로 변환합니다.

    OpenCV 가 사용하는 BGR 입력을 메인 스레드 ``ImageData`` 가 요구하는
    RGBA 로 변환합니다. 1채널 회색조는 RGB 동일 값으로 복제하고, 3채널은
    BGR↔RGB 채널 스왑, 4채널은 BGRA↔RGBA 채널 스왑을 수행합니다.

    Args:
        img: numpy ndarray. ``(H, W)`` 회색조 또는 ``(H, W, 3|4)`` 컬러.
            uint8 가 아니면 ``astype(uint8)`` 으로 자동 변환됩니다.

    Returns:
        tuple[bytes, int, int]: ``(rgba_bytes, w, h)`` 형태.

    Raises:
        ValueError: 지원하지 않는 형상의 배열이 들어왔을 때.
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
    """이미지를 IDE 의 플로팅 윈도에 표시합니다(논블로킹).

    :class:`FrameRef` 가 들어오면 메인 스레드 토큰만 윈도에 연결하고
    즉시 반환합니다. numpy ndarray 가 들어오면 :func:`_to_rgba_bytes` 로
    RGBA 바이트로 변환한 뒤 메인 스레드에 한 번 보냅니다.

    Args:
        name (str): 윈도 이름.
        image: 표시할 이미지. :class:`FrameRef` 또는 numpy ndarray.
    """
    if isinstance(image, FrameRef):
        # Pixels live on the main thread; just point the window at the token.
        _cv2Bridge.imshowToken(str(name), int(image._token))
        return
    payload, w, h = _to_rgba_bytes(image)
    _cv2Bridge.imshow(str(name), int(w), int(h), payload)


def waitKey(ms=0):
    """imshow 윈도에서 키 입력을 ``ms`` 밀리초 동안 기다립니다.

    이 함수는 worker 안에서 SharedArrayBuffer + ``Atomics.wait`` 으로
    "동기적으로" 차단됩니다. 실제 입력 대기는 메인 스레드가 수행하고
    그 결과만 worker 에 돌려줍니다.

    Args:
        ms (int): 대기 시간(ms). ``0`` 이하이면 무한 대기.

    Returns:
        int: 키 코드(하위 8비트). 타임아웃이거나 윈도 포커스가 없으면 ``-1``.
    """
    return int(_cv2Bridge.waitKey(int(ms)))


def destroyWindow(name):
    """주어진 이름의 imshow 윈도를 닫습니다.

    Args:
        name (str): 닫을 윈도 이름.
    """
    _cv2Bridge.destroyWindow(str(name))


def destroyAllWindows():
    """현재 열려 있는 모든 imshow 윈도를 닫습니다."""
    _cv2Bridge.destroyAllWindows()


def cvtColor(image, code):
    """가능한 한도 안에서 색공간을 변환합니다(best-effort).

    :class:`FrameRef` (토큰 기반) 입력에서는 메인 스레드 비트맵이 이미 RGB
    이고 BGR↔RGB 토글은 화면상 차이가 없기 때문에 사실상 no-op 입니다.
    numpy 입력이면 채널을 직접 스왑/혼합해서 새 배열을 돌려줍니다.

    Args:
        image: :class:`FrameRef` 또는 numpy ndarray.
        code (int): :data:`COLOR_BGR2RGB` 등의 변환 코드.

    Returns:
        :class:`FrameRef` 입력은 ``image`` 그대로, numpy 입력은 변환된 새 배열.

    Raises:
        NotImplementedError: 구현되지 않은 코드를 요청한 경우.
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
    """이미지를 지정한 축 기준으로 뒤집습니다.

    :class:`FrameRef` 입력은 v1 에서는 그대로 통과합니다. 뒤집기는 메인
    스레드가 imshow 시점에 적용하기 때문에 그리기 좌표가 어긋나지 않게
    토큰만 그대로 전달합니다(향후 토큰에 flip 플래그를 실어 처리할 수 있음).

    Args:
        image: :class:`FrameRef` 또는 numpy ndarray.
        axis (int): ``0`` 상하 뒤집기 / ``1`` 좌우 뒤집기 / 그 외(보통
            ``-1``) 상하·좌우 동시 뒤집기.

    Returns:
        뒤집힌 새 ndarray, 또는 :class:`FrameRef` 의 경우 원본 그대로.
    """
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
    """OpenCV BGR 색상 튜플을 메인 스레드용 RGB 리스트로 변환합니다.

    Args:
        color (Sequence[int]): 길이 1 이상의 BGR(또는 회색조) 튜플/리스트.

    Returns:
        list[int]: ``[R, G, B]`` 순서의 정수 3원소 리스트. 1원소 입력이면
        같은 값을 R/G/B 세 곳에 복제합니다.
    """
    if len(color) >= 3:
        return [int(color[2]), int(color[1]), int(color[0])]
    return [int(color[0]), int(color[0]), int(color[0])]


def line(image, pt1, pt2, color, thickness=1):
    """이미지 오버레이에 선을 그리는 작업을 큐에 추가합니다.

    OpenCV 처럼 그린 결과를 호출자에게 다시 돌려주는 인터페이스를 유지하기
    위해 ``image`` 를 그대로 반환합니다(``image = cv2.line(image, ...)``
    같은 코드가 그대로 동작하도록).

    Args:
        image: 그릴 대상. :class:`FrameRef` 또는 토큰을 가진 객체.
        pt1 (Sequence[int]): 시작점 ``(x, y)``.
        pt2 (Sequence[int]): 끝점 ``(x, y)``.
        color (Sequence[int]): BGR 색상 튜플.
        thickness (int): 선 두께. 기본값 ``1``.

    Returns:
        ``image`` 인수 그대로.
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
    """이미지 오버레이에 원을 그리는 작업을 큐에 추가합니다.

    Args:
        image: 그릴 대상.
        center (Sequence[int]): 원의 중심 ``(x, y)``.
        radius (int): 원의 반지름(픽셀).
        color (Sequence[int]): BGR 색상.
        thickness (int): 선 두께. ``-1`` (:data:`FILLED`) 이면 채워서 그립니다.

    Returns:
        ``image`` 인수 그대로.
    """
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
    """이미지 오버레이에 사각형을 그리는 작업을 큐에 추가합니다.

    Args:
        image: 그릴 대상.
        pt1 (Sequence[int]): 사각형의 한 꼭짓점 ``(x, y)``.
        pt2 (Sequence[int]): 그 대각선 꼭짓점 ``(x, y)``.
        color (Sequence[int]): BGR 색상.
        thickness (int): 선 두께. ``-1`` (:data:`FILLED`) 이면 면을 채웁니다.

    Returns:
        ``image`` 인수 그대로.
    """
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
    """이미지 오버레이에 텍스트를 그리는 작업을 큐에 추가합니다.

    ``fontFace`` 는 이름만 형식적으로 받고, 실제 렌더링은 메인 스레드의
    캔버스 기본 sans-serif 폰트로 근사합니다. ``fontScale`` 은 약 ``14 *
    scale`` 픽셀 단위로 매핑됩니다. ``lineType`` / ``bottomLeftOrigin`` 은
    캔버스 기본값으로 처리되어 무시됩니다.

    Args:
        image: 그릴 대상.
        text (str): 그릴 문자열.
        org (Sequence[int]): 텍스트의 기준점(왼쪽-아래) ``(x, y)``.
        fontFace (int): Hershey 폰트 식별자(이름만 인정).
        fontScale (float): 글자 크기 배율.
        color (Sequence[int]): BGR 색상.
        thickness (int): 글자 두께. 기본값 ``1``.
        lineType: OpenCV 호환용으로 받지만 무시됩니다.
        bottomLeftOrigin (bool): OpenCV 호환용으로 받지만 무시됩니다.

    Returns:
        ``image`` 인수 그대로.
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
    """이미지를 읽어 메인 스레드에 픽셀이 머무르는 :class:`FrameRef` 를 돌려줍니다.

    Worker → 메인 스레드 사이의 픽셀 복사를 피하도록 설계되었습니다.

    Args:
        path (str): 두 가지 형식을 지원합니다.

            * **HTTP(S) URL** — 메인 스레드가 ``fetch`` 합니다(CORS 정책의
              제약을 받습니다).
            * **가상 파일시스템 경로** — ``/work/<path>`` 를 먼저 시도한 뒤
              실패하면 ``/<path>`` 를 시도합니다.

        flags: OpenCV 호환용 인자(현재 무시됩니다).

    Returns:
        FrameRef | None: 성공하면 :class:`FrameRef`. OpenCV 와 동일하게
        실패 시에는 ``None`` 을 돌려줍니다.
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
    """이 IDE 에서는 아직 구현되지 않았습니다.

    Raises:
        NotImplementedError: 항상 발생합니다.
    """
    raise NotImplementedError(
        "imwrite is not implemented yet in this IDE."
    )


class VideoCapture:
    """메인 스레드 ``getUserMedia`` 로 동작하는 웹캠 캡처 클래스.

    OpenCV 의 ``cv2.VideoCapture`` 와 동일한 인터페이스를 제공하지만
    실제 카메라 제어는 메인 스레드가 수행합니다. v1 에서는 한 개의 카메라만
    지원합니다. 매 :meth:`read` 호출은 가장 최근 비디오 프레임을 가리키는
    :class:`FrameRef` 를 돌려주며, 픽셀 자체는 메인 스레드에 머뭅니다.

    Args:
        source (int): 카메라 디바이스 인덱스. 보통 ``0``.
    """

    def __init__(self, source=0):
        """카메라를 열고 해상도를 캐시합니다.

        Args:
            source (int): 카메라 디바이스 인덱스.
        """
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
        """카메라가 열려 있는지 확인합니다.

        생성자에서 한 번 성공한 뒤에도 메인 스레드에 즉시 다시 물어 보아,
        사용자가 사이트 권한을 끈 경우 등 실시간 상태를 반영합니다.

        Returns:
            bool: 카메라 사용 가능 여부.
        """
        if not self._opened:
            return False
        try:
            r = _mpBridge.call("cam.isOpen", {})
            return bool(r.get("open", False))
        except Exception:
            return False

    def read(self):
        """가장 최근 카메라 프레임을 한 장 가져옵니다.

        Returns:
            tuple[bool, FrameRef | None]: ``(ret, frame)`` 형태.

            * ``ret`` 가 ``False`` 면 카메라가 닫혀 있거나 아직 첫 프레임이
              도착하지 않은 상태이며, ``frame`` 은 ``None``.
            * ``True`` 일 때 ``frame`` 은 메인 스레드 픽셀을 가리키는
              :class:`FrameRef`.
        """
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
        """카메라 자원을 해제합니다.

        호출 이후 :meth:`isOpened` 는 ``False`` 가 되며, :meth:`read` 는
        실패 결과를 돌려줍니다. 해제 중 예외는 무시됩니다.
        """
        if not self._opened:
            return
        try:
            _mpBridge.call("cam.release", {})
        except Exception:
            pass
        self._opened = False

    def __del__(self):
        """가비지 컬렉션 시점에 안전하게 :meth:`release` 를 호출합니다."""
        try:
            self.release()
        except Exception:
            pass
