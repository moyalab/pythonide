# -*-coding:utf-8-*-
"""Bitblock(컴블럭) 보드 제어용 Python SDK 패키지.

이 패키지는 컴블럭(Combb / Bitblock) 메인보드와 시리얼(UART)로 주고받는
20바이트 고정 길이 패킷 프로토콜을 사람 친화적인 메서드 호출로 감싸는
:class:`bitblock.Bitblock` 클래스와, 그에 필요한 상수/유틸리티를 한 번에
재노출합니다.

서브모듈 구성:

* :mod:`pycombb.bitblock.bitblock` — 사용자 진입 클래스 :class:`Bitblock`.
  LED 매트릭스, 부저, 버튼, 터치, 기울기, 빛/소리 센서, 디지털·아날로그
  입출력, 서보, DC 모터, 초음파, DHT11, 그리고 RC카 모드 전체를 한 곳에서
  노출합니다.
* :mod:`pycombb.bitblock.constants` — 펌웨어 프로토콜 상수.
  :class:`PIN`, :class:`SYMBOL`, :class:`COLOR`, :class:`NOTE`,
  :class:`ACTION_CODE`, :class:`ACTION_MODE`, :class:`BBPACKET`,
  :class:`BBRETURN`, :class:`BLEUUID`, :class:`ERROR` 와
  ``NULL_COMMAND_PACKET`` / ``LENGTH_OF_PACKET`` 등 모듈 수준 상수를
  제공합니다.
* :mod:`pycombb.bitblock.utils` — ``delay`` / ``delayms`` / ``wait``
  대기 함수, ``clamp`` 범위 클램프, ``split_and_join`` 디버깅용 헥사 변환
  등 보조 유틸리티.

사용 예::

    from pycombb.bitblock import Bitblock, COLOR

    bot = Bitblock()
    bot.connect()
    bot.display.color(COLOR.BLUE)
    bot.beep()
    bot.disconnect()

웹 IDE 환경에서는 ``serial`` / ``termcolor`` 가 폴리필 형태로 제공됩니다.
"""

from .bitblock import *
from .constants import *
from .utils import *
