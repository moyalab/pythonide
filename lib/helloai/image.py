# -*- coding: utf-8 -*-
"""검출기(Detector)들이 공유하는 최소 :class:`Image` 래퍼 모듈.

원본 ``helloai.core.image.Image``의 모든 기능을 그대로 옮겨오지 않고,
이 웹 IDE의 검출기/분류기들이 실제로 사용하는 기능만 추려서 구현한
가벼운 버전입니다.

생성자는 OpenCV가 다루는 ndarray(또는 ``FrameRef``)를 그대로 받아
보관하고, ``.frame`` / ``.image`` 프로퍼티로 같은 객체를 다시 꺼내쓸 수
있게 합니다. 원본 ``Image``의 ``.show()``, ``.save()``, ``.resize()``
같은 편의 메서드는 v1에서는 제공하지 않습니다.
"""


class Image:
    """카메라 프레임을 감싸는 가벼운 래퍼 클래스.

    검출기·분류기 사이에서 프레임을 주고받을 때 항상 동일한 형태의
    객체로 다룰 수 있도록 ndarray 한 장을 감싸는 역할만 합니다.
    내부적으로 한 장의 프레임을 보관하고, 자주 쓰이는 너비/높이를
    함께 노출합니다.

    Attributes:
        frame: 보관 중인 원본 프레임 객체. 일반적으로 BGR 순서의 numpy
            ndarray입니다.
        image: ``frame``과 같은 객체에 대한 별칭. 원본 helloai와의
            호환을 위해 두 이름을 모두 제공합니다.
        width (int): 프레임의 가로 픽셀 수. 형상을 읽을 수 없을 때는 ``-1``.
        height (int): 프레임의 세로 픽셀 수. 형상을 읽을 수 없을 때는 ``-1``.
    """

    def __init__(self, frame):
        """주어진 프레임으로 Image를 만듭니다.

        Args:
            frame: 감쌀 프레임 객체. 보통 OpenCV가 돌려주는 BGR ndarray
                지만, 같은 ``shape`` 인터페이스를 갖는 ``FrameRef`` 도
                허용됩니다. ``None`` 은 받지 않습니다.

        Raises:
            TypeError: ``frame`` 이 ``None`` 일 때 발생합니다.
        """
        if frame is None:
            raise TypeError("Image() requires a frame")
        self._frame = frame

    @property
    def frame(self):
        """보관 중인 원본 프레임을 반환합니다.

        Returns:
            생성자에 전달했던 프레임 객체 그대로(보통 numpy ndarray).
        """
        return self._frame

    @property
    def image(self):
        """``frame`` 의 별칭. 원본 helloai와의 호환을 위해 제공됩니다.

        Returns:
            :pyattr:`frame` 프로퍼티와 동일한 객체.
        """
        return self._frame

    @property
    def width(self):
        """프레임의 가로 픽셀 수를 반환합니다.

        Returns:
            int: 가로 길이. 프레임의 ``shape`` 를 읽지 못한 경우에는 ``-1``.
        """
        try:
            return int(self._frame.shape[1])
        except Exception:
            return -1

    @property
    def height(self):
        """프레임의 세로 픽셀 수를 반환합니다.

        Returns:
            int: 세로 길이. 프레임의 ``shape`` 를 읽지 못한 경우에는 ``-1``.
        """
        try:
            return int(self._frame.shape[0])
        except Exception:
            return -1
