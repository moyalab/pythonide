# -*-coding:utf-8-*-
"""Bitblock 패키지에서 공용으로 사용하는 보조 유틸리티 함수 모음.

다음 두 가지 부류의 헬퍼를 제공합니다.

* **타이밍 함수** — :func:`delay`, :func:`delayms`, :func:`wait`. 모두
  내부적으로는 ``time.sleep`` 으로 위임하며, 단위(초/밀리초)만 다르게
  노출합니다. 사용자 코드에서 자연스러운 단위로 호출할 수 있도록 같은
  동작을 여러 이름으로 제공합니다.
* **수치/표현 변환** — :func:`clamp` 는 값을 [최소, 최대] 범위로 잘라
  반환하고, :func:`split_and_join` 은 디버깅 목적으로 ``bytearray``/
  ``bytes`` 를 ``"ff,77,11,..."`` 형태의 사람이 읽기 쉬운 문자열로
  바꿔 줍니다.

이 모듈은 :mod:`pycombb.bitblock.bitblock` 내부에서 직접 임포트되며,
``from pycombb.bitblock import *`` 로도 그대로 노출됩니다.
"""
import sys
import time
import math
import asyncio

__all__ = [
    "split_and_join",
    "delay",
    'delayms',
    "wait",
    "clamp",
]

def split_and_join(msg, separator=','):
    """바이트 시퀀스를 사람이 읽기 좋은 헥사 문자열로 변환합니다.

    20바이트 명령/응답 패킷을 그대로 ``print`` 하면 ``\\xff\\x77...`` 처럼
    읽기 어렵기 때문에, 디버깅 시 한 바이트씩 끊어 ``"ff,77,11,00,..."``
    형태로 출력하기 위해 사용합니다.

    Args:
        msg (bytes | bytearray): 변환할 바이트 시퀀스.
        separator (str): 각 바이트 사이에 끼워 넣을 구분자. 기본값은
            ``","`` 입니다.

    Returns:
        str: 한 바이트 = 두 글자(헥사) 단위로 ``separator`` 로 이어붙인
        문자열. 길이가 홀수인 비정상 입력에는 표준출력으로 경고를 찍지만
        예외를 던지지는 않습니다.

    Examples:
        >>> split_and_join(bytearray([0xff, 0x77, 0x11]))
        'ff,77,11'
    """
    hex_string = msg.hex()
    if len(hex_string) % 2 != 0:
        print("주의: 문자열의 길이가 분할 단위로 나누어 떨어지지 않습니다.")
    split_str = [hex_string[i:i+2] for i in range(0, len(hex_string), 2)]
    return separator.join(split_str)


def delay(sec):
    """지정한 시간(초)만큼 현재 스레드를 블로킹합니다.

    내부적으로 :func:`time.sleep` 을 호출하므로, 웹 IDE(Pyodide) 환경에서는
    이벤트 루프가 ``Atomics.wait`` 기반으로 동기 대기를 수행합니다.

    Args:
        sec (float): 대기할 시간(초). 음수는 ``time.sleep`` 의 동작을
            그대로 따릅니다(즉시 반환).

    Returns:
        None

    Examples:
        >>> delay(0.5)   # 0.5초 대기
    """
    time.sleep(sec)


def delayms(ms):
    """지정한 시간(밀리초)만큼 현재 스레드를 블로킹합니다.

    :func:`delay` 의 밀리초 단위 래퍼입니다. 사용자 코드에서 ``delayms(500)``
    처럼 자연스럽게 ``ms`` 단위로 쓸 수 있도록 별도로 제공합니다.

    Args:
        ms (float): 대기할 시간(밀리초).

    Returns:
        None

    Examples:
        >>> delayms(500)   # 0.5초 대기
    """
    delay(ms/1000)


def wait(ms):
    """지정한 시간(밀리초)만큼 현재 스레드를 블로킹합니다.

    :func:`delayms` 의 동의어로, 다른 보드 라이브러리와 인터페이스를 맞추기
    위해 같은 동작을 ``wait`` 라는 이름으로도 노출합니다.

    Args:
        ms (float): 대기할 시간(밀리초).

    Returns:
        None

    Examples:
        >>> wait(1000)   # 1초 대기
    """
    delay(ms/1000)


def clamp(value, mval=0, xval=180):
    """값을 ``[mval, xval]`` 범위로 잘라 반환합니다.

    서보 각도(0~180), PWM(0~255) 등 펌웨어가 요구하는 유효 범위를 사용자
    입력값에 강제하기 위해 사용합니다. ``min/max`` 를 합친 형태와 동일하며,
    별도의 검증 예외는 던지지 않습니다.

    Args:
        value (int | float): 조정할 입력값.
        mval (int | float): 허용 최소값. 기본값 ``0``.
        xval (int | float): 허용 최대값. 기본값 ``180``.

    Returns:
        int | float: ``value`` 가 범위 안이면 그대로, 범위 밖이면 가까운
        경계값.

    Examples:
        >>> clamp(200, 0, 180)
        180
        >>> clamp(-50, 0, 180)
        0
        >>> clamp(90)
        90
    """
    return max(mval, min(xval, value))
