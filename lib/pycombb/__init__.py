# -*-coding:utf-8-*-
"""pycombb — 컴블럭(Combb / Bitblock) 보드용 Python SDK 네임스페이스.

서브패키지 :mod:`pycombb.bitblock` 의 공개 심볼(Bitblock, COLOR, wait, ...)을
이 패키지 최상위로 재노출한다. 사용자는 다음 두 가지 형태 중 어느 쪽이든
원하는 것을 쓸 수 있다::

    from pycombb import Bitblock, COLOR, wait
    from pycombb.bitblock import Bitblock, COLOR, wait
"""

from .bitblock import *  # noqa: F401,F403
