# -*-coding:utf-8-*-
"""KAMIBOT(카미봇파이) 로봇 제어용 Python SDK 모듈.

이 모듈은 KAMIBOT 본체와 시리얼(UART) 로 주고받는 20바이트 고정 길이
패킷을 사람 친화적인 메서드 호출로 감싸는 :class:`KamibotPi` 클래스를
제공합니다. 사용자는 보통 다음과 같이 한 줄로 시작합니다::

    from pibot import KamibotPi
    bot = KamibotPi(port="COM5")
    bot.move_forward(1)
    bot.turn_led_idx(2)
    bot.beep()
    bot.close()

내부 구조 요약:

* :class:`CommandType` / :class:`ModeType` — 펌웨어가 인식하는 명령/모드
  바이트 상수.
* :class:`PacketIndex` / :class:`RETURN_PACKET` — 송신/수신 패킷 안에서
  각 필드가 위치한 인덱스.
* :data:`NULL_COMMAND_PACKET` — 모든 메서드가 복사해서 채워 보내는 20바이트
  기본 패킷.
* :data:`LED` / :data:`LED_COLOR` / :class:`LedColor` — RGB LED 색상 단축 매핑.
* :class:`Note` — ``melody()`` 인자로 쓰이는 MIDI 음계 상수.
* :class:`KamibotPi` — 실제 사용자 진입 클래스. 이동, 모터, LED, 센서,
  도형, 멜로디 등 모든 기능이 메서드로 노출됩니다.

웹 IDE 환경에서는 ``serial`` / ``termcolor`` 패키지가 폴리필 형태로 제공됩니다.
"""
import sys
import serial
import time
import math
from termcolor import cprint

# 명령타입
class CommandType:
    """펌웨어가 인식하는 명령(command type) 바이트 상수 모음.

    각 상수는 :class:`PacketIndex.COMMANDTYPE` 위치(또는 일부 패킷에서는
    별도 모드 명령 자리)에 들어가는 1바이트 값입니다. 이름은 펌웨어
    프로토콜 사양 그대로 보존되어 있어, 사양 문서를 그대로 코드와 매핑할
    수 있습니다(예: ``MOVE_FORWARD_BLOCK = 0x02``).

    실제 사용자 코드에서는 직접 다루기보다 :class:`KamibotPi` 의 고수준
    메서드(``move_forward``, ``turn_left`` 등)를 통해 간접적으로 사용됩니다.
    """
    FORCE_STOP = 0x01
    MOVE_FORWARD_BLOCK = 0x02
    MOVE_BACKWARD_BLOCK = 0x03
    TURN_LEFT_BLOCK = 0x04
    TURN_RIGHT_BLOCK = 0x05
    TURN_BACK_BLOCK = 0x06
    MOVE_FORWARD_LINE = 0x07
    TURN_LEFT_LINE = 0x08
    TURN_RIGHT_LINE = 0x09
    TURN_BACK_LINE = 0x0A
    SET_MOVE_SPEED = 0x0B
    MOVE_FORWARD_SPEED = 0x0C
    MOVE_LEFT_SPEED = 0x0D
    MOVE_RIGHT_SPEED = 0x0E
    MOVE_BACKWARD_SPEED = 0x10
    MOVE_FORWARD_LRSPEED = 0x11
    MOVE_BACKWARD_LRSPEED = 0x12
    MOVE_UNIT = 0x13
    SPIN_DEGREE = 0x14
    WHEEL_SET_SPEED = 0x15
    WHEEL_RUN = 0x16
    WHEEL_RUN_UNIT = 0x17
    WHEEL_RUN_LRUNIT = 0x18
    TOPMOTOR_SET_SPEED = 0x19
    TOPMOTOR_TURN = 0x1A
    TOPMOTOR_TURN_UNIT = 0x1B
    TOPMOTOR_MOVE_ABSOLUTE = 0x1C
    TOPMOTOR_STOP = 0x1D
    LED_TURN = 0x1E
    DRAW_SHAPE = 0x20
    DRAW_CIRCLE = 0x21
    DRAW_SEMICIRCLE = 0x22
    DRAW_SEMICIRCEL_UNIT = 0x23
    MELODY_BEEP = 0x24
    MELODY_MUTE = 0x25
    MELODY_SET_BMP = 0x26
    MELODY_PLAY_FREQ = 0x27
    SENSOR_GET_COLOR = 0x28
    SENSOR_GET_OBJECT = 0x29
    SENSOR_GET_LINE = 0x2A
    TOGGLE_LINERRACER = 0x2B
    BOTPI_STOP = 0x2C
    BOTPI_EMERGENCY_STOP = 0x2D
    BOTPI_INITIALIZE = 0x2E
    BOTPI_RESET = 0x30
    BOTPI_CLEAR = 0x31


# 명령패킷의 인덱스
class PacketIndex:
    """송신용 20바이트 명령 패킷의 필드 위치(인덱스) 상수.

    KAMIBOT 펌웨어는 항상 길이 20 의 고정 패킷을 주고받습니다.
    각 메서드가 :data:`NULL_COMMAND_PACKET` 사본을 만든 뒤
    ``packet[PacketIndex.MODETYPE] = ...`` 처럼 이 클래스의 상수를 인덱스로
    써서 자리에 값을 채워 넣습니다.

    Attributes:
        START (int): 헤더 시작 바이트 위치(0).
        LENGTH (int): 패킷 길이(20) 위치.
        HWID, HWTYPE (int): 하드웨어 ID/타입 위치.
        COMMANDTYPE (int): 읽기/쓰기 구분 등의 :class:`CommandType` 위치.
        MODETYPE, MODECOMMAND (int): :class:`ModeType` 과 그 하위 명령 위치.
        DATA0..DATA10 (int): 페이로드 영역.
        INDEX (int): 명령 시퀀스 번호 위치(255 까지 순환).
        END (int): 끝 바이트 위치(보통 ``0x5A``).
    """
    START = 0
    LENGTH = 1
    HWID = 2
    HWTYPE = 3
    COMMANDTYPE = 4
    MODETYPE = 5
    MODECOMMAND = 6
    DATA0 = 7
    DATA1 = 8
    DATA2 = 9
    DATA3 = 10
    DATA4 = 11
    DATA5 = 12
    DATA6 = 13
    INDEX = 14
    DATA7 = 15
    DATA8 = 16
    DATA9 = 17
    DATA10 = 18
    END = 19


# 리턴 패킷의 인덱스
class RETURN_PACKET:
    """수신용 20바이트 응답 패킷의 필드 위치(인덱스) 상수.

    펌웨어가 명령에 대한 응답으로 돌려주는 20바이트 패킷의 각 자리를
    어디서 읽어야 하는지 알려줍니다. :meth:`KamibotPi._KamibotPi__process_return`
    에서 이 상수들을 사용해 배터리, 객체/라인/색상 센서 값, 명령 인덱스,
    페이로드 등을 추출합니다.

    Attributes:
        BATTERY (int): 배터리 잔량 위치.
        LEFT_OBJECT, RIGHT_OBJECT (int): 좌/우 물체 감지 센서값 위치.
        LEFT_LINE, CENTER_LINE, RIGHT_LINE (int): 라인 센서값 위치.
        COLOR (int): 색상 인덱스 위치.
        INDEX (int): 응답하는 원래 명령의 시퀀스 번호 위치.
        DATA0..DATA3 (int): 추가 페이로드(예: 색상 RGB 성분).
    """
    START = 0
    LENGTH = 1
    HWID = 2
    HWTYPE = 3
    CMDTYPE = 4
    MODE = 5
    RESULT = 6
    BATTERY = 7
    LEFT_OBJECT = 8
    RIGHT_OBJECT = 9
    LEFT_LINE = 10
    CENTER_LINE = 11
    RIGHT_LINE = 12
    COLOR = 13
    INDEX = 14
    DATA0 = 15
    DATA1 = 16
    DATA2 = 17
    DATA3 = 18
    END = 19


class ModeType:
    """펌웨어의 동작 모드(모드 타입) 바이트 상수 모음.

    한 패킷의 :class:`PacketIndex.MODETYPE` 위치에 들어가는 1바이트 값입니다.
    KAMIBOT 은 모드별로 사용 가능한 하위 명령(모드 명령)이 다르므로,
    "어떤 모드에서 어떤 일을 하라" 를 ``MODETYPE`` + ``MODECOMMAND`` 두
    바이트로 표현합니다.

    주요 모드:
        * ``MAPBOARD`` / ``LINEMAP`` — 맵보드/라인맵 위에서의 칸 단위 이동.
        * ``CONTROL`` — 좌/우 모터 직접 속도 제어.
        * ``RGB`` — LED 색상 변경.
        * ``TOP_STEPPER`` — 상단(top) 스텝 모터 회전.
        * ``OBJECT_DETECTER`` / ``LINE_DETECTOR`` / ``COLOR_DETECTOR`` — 센서.
        * ``BATTERY`` / ``VERSION`` — 상태 조회.
        * ``DRAWSHAPE`` — 도형 그리기 모드.
        * ``PRECISION_CTR`` — 정밀 제어(스텝/시간/cm 단위 이동).
        * ``MELODY`` — 부저 음.
        * ``LINE`` — 라인 트레이서 토글.
        * ``INITIALIZE`` / ``RESET`` / ``EMERGENCY_STOP`` — 시스템 제어.
    """
    MAPBOARD = 0x01
    CONTROL = 0x02
    RGB = 0x3
    TOP_STEPPER = 0x04
    OBJECT_DETECTER = 0x05
    LINE_DETECTOR = 0x06
    COLOR_DETECTOR = 0x7
    BATTERY = 0x08
    VERSION = 0x9
    REALTIME = 0x0A
    DRAWSHAPE = 0x0B
    PRECISION_CTR = 0x0C
    MELODY = 0x0D
    LINEMAP = 0x0E
    RESET = 0x0F
    EMERGENCY_STOP = 0x11
    LINE = 0x12
    INITIALIZE = 0x22
    MOTOR_SPEED = 0x33


# Command Type
COMMANDTYPE_WRITE = 0x01
COMMANDTYPE_READ = 0x02
COMMANDTYPE_RETURN = 0x03
"""명령 패킷의 ``COMMANDTYPE`` 자리에 들어가는 읽기/쓰기/응답 식별 바이트."""

# 디바이스 타입
HWTYPE_BOTPI = 0x00
HWTYPE_XBLOCK = 0x10
"""연결된 하드웨어 종류 식별 바이트 (KAMIBOT Pi / X-Block)."""

# LED 색상 YELLOW
TEST_COMMAND = [
    0x41, 0x14, 0x01, 0x01, 0x01,
    0x03, 0x00, 0xff, 0xff, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x5a,
]
"""연결 확인용으로 LED 를 노란색으로 켜는 시험 명령 패킷(20바이트)."""

NULL_COMMAND_PACKET = [
    0x41, 0x14, 0x01, HWTYPE_BOTPI, COMMANDTYPE_WRITE,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x5a,
]
"""값이 모두 0 으로 초기화된 표준 송신 패킷(20바이트).

각 메서드는 이 리스트를 슬라이스 복사(``[:]``) 한 뒤
:class:`PacketIndex` 상수를 인덱스로 써서 ``MODETYPE``, ``MODECOMMAND``,
``DATA*``, ``INDEX`` 자리에 값을 채워 보냅니다. 헤더(``0x41 0x14 0x01``)와
끝 바이트(``0x5A``)는 모든 패킷이 공유합니다.
"""

DEFAULT_MOTOR_SPEED = 0x96      # 150
"""모터 명령에서 별도 속도가 주어지지 않을 때 사용할 기본값(0x96 = 150)."""


LED = {
    "off": [0, 0, 0],
    "red": [255, 0, 0],
    "orange": [255, 165, 0],
    "yellow": [255, 255, 0],
    "green": [0, 255, 0],
    "blue": [0, 0, 255],
    "skyblue": [0, 255, 255],
    "purple": [139, 0, 255],
    "white": [255, 255, 255],
}
"""LED 색 이름 → ``[R, G, B]`` 리스트 매핑.

문자열 키로 색을 다루고 싶을 때 사용합니다. 클래스 형태(상수 접근)로
같은 색을 쓰고 싶으면 :class:`LedColor` 를 사용하세요.
"""

LED_COLOR = [
    LED["off"], LED["red"], LED["orange"], LED["yellow"], LED["green"],
    LED["blue"], LED["skyblue"], LED["purple"], LED["white"]
]
""":meth:`KamibotPi.turn_led_idx` 의 ``idx`` 인자가 가리키는 색 순서표.

인덱스 0 부터 ``[off, red, orange, yellow, green, blue, skyblue, purple, white]``
순서이며, 각 항목은 :data:`LED` 와 같은 ``[R, G, B]`` 리스트입니다.
"""


class LedColor:
    """:meth:`KamibotPi.turn_led` 인자에 그대로 넣을 수 있는 색 상수 컨테이너.

    Examples:
        >>> bot.turn_led(*LedColor.RED)   # 빨간색 ON
        >>> bot.turn_led(*LedColor.OFF)   # OFF

    Attributes:
        OFF (list[int]): ``[0, 0, 0]`` (소등).
        RED, ORANGE, YELLOW, GREEN, BLUE, SKYBLUE, PURPLE, WHITE
            (list[int]): 각 색의 ``[R, G, B]`` 리스트.
    """
    OFF = LED["off"]
    RED = LED["red"]
    ORANGE = LED["orange"]
    YELLOW = LED["yellow"]
    GREEN = LED["green"]
    BLUE = LED["blue"]
    SKYBLUE = LED["skyblue"]
    PURPLE = LED["purple"]
    WHITE = LED["white"]


class Note:
    """Musical note constants (MIDI standard mapping).

    Use these as the `scale` argument of bot.melody(scale, sec).

    Naming:
        C4 ~ B4   : natural notes (octave 4, middle C = C4 = 60)
        Cs4       : C-sharp 4 (= Db4)
        Db4       : D-flat 4  (= Cs4)
        CM1       : C in octave -1 (M = Minus, range floor)

    Example:
        bot.melody(Note.C4, 1)   # play middle C for 1 second
        bot.melody(Note.Bb4, 1)  # play B-flat 4 (= As4)
    """

    # Octave -1 (scale 0 ~ 11)
    CM1 = 0
    CsM1 = 1; DbM1 = 1
    DM1 = 2
    DsM1 = 3; EbM1 = 3
    EM1 = 4
    FM1 = 5
    FsM1 = 6; GbM1 = 6
    GM1 = 7
    GsM1 = 8; AbM1 = 8
    AM1 = 9
    AsM1 = 10; BbM1 = 10
    BM1 = 11

    # Octave 0 (scale 12 ~ 23)
    C0 = 12
    Cs0 = 13; Db0 = 13
    D0 = 14
    Ds0 = 15; Eb0 = 15
    E0 = 16
    F0 = 17
    Fs0 = 18; Gb0 = 18
    G0 = 19
    Gs0 = 20; Ab0 = 20
    A0 = 21
    As0 = 22; Bb0 = 22
    B0 = 23

    # Octave 1 (scale 24 ~ 35)
    C1 = 24
    Cs1 = 25; Db1 = 25
    D1 = 26
    Ds1 = 27; Eb1 = 27
    E1 = 28
    F1 = 29
    Fs1 = 30; Gb1 = 30
    G1 = 31
    Gs1 = 32; Ab1 = 32
    A1 = 33
    As1 = 34; Bb1 = 34
    B1 = 35

    # Octave 2 (scale 36 ~ 47)
    C2 = 36
    Cs2 = 37; Db2 = 37
    D2 = 38
    Ds2 = 39; Eb2 = 39
    E2 = 40
    F2 = 41
    Fs2 = 42; Gb2 = 42
    G2 = 43
    Gs2 = 44; Ab2 = 44
    A2 = 45
    As2 = 46; Bb2 = 46
    B2 = 47

    # Octave 3 (scale 48 ~ 59)
    C3 = 48
    Cs3 = 49; Db3 = 49
    D3 = 50
    Ds3 = 51; Eb3 = 51
    E3 = 52
    F3 = 53
    Fs3 = 54; Gb3 = 54
    G3 = 55
    Gs3 = 56; Ab3 = 56
    A3 = 57
    As3 = 58; Bb3 = 58
    B3 = 59

    # Octave 4 (scale 60 ~ 71) — middle C, concert A
    C4 = 60
    Cs4 = 61; Db4 = 61
    D4 = 62
    Ds4 = 63; Eb4 = 63
    E4 = 64
    F4 = 65
    Fs4 = 66; Gb4 = 66
    G4 = 67
    Gs4 = 68; Ab4 = 68
    A4 = 69
    As4 = 70; Bb4 = 70
    B4 = 71

    # Octave 5 (scale 72 ~ 83) — top of supported range
    C5 = 72
    Cs5 = 73; Db5 = 73
    D5 = 74
    Ds5 = 75; Eb5 = 75
    E5 = 76
    F5 = 77
    Fs5 = 78; Gb5 = 78
    G5 = 79
    Gs5 = 80; Ab5 = 80
    A5 = 81
    As5 = 82; Bb5 = 82
    B5 = 83


class KamibotPi:
    """KAMIBOT(카미봇파이) 본체와 시리얼로 통신하는 메인 SDK 클래스.

    한 인스턴스가 한 대의 KAMIBOT 과 1:1 로 연결됩니다. 생성과 동시에
    지정한 포트/속도로 시리얼을 열고, 이후 모든 메서드는 20바이트 패킷을
    써서 펌웨어에 명령을 보냅니다. 명령마다 응답 패킷을 한 번 받아 내부
    상태(배터리, 센서값, 마지막 명령 인덱스 등)를 갱신합니다.

    Examples:
        가장 단순한 사용 예::

            bot = KamibotPi(port="COM5")
            bot.move_forward(1)
            bot.turn_led_idx(2)   # 노란색 LED
            bot.beep()
            bot.close()

    Args:
        port (str | None): 시리얼 포트 이름. 예) ``"COM5"`` (Windows),
            ``"/dev/ttyUSB0"`` (Linux). ``None`` 이면 즉시
            ``ValueError`` 가 발생하며 프로세스가 종료됩니다.
        baud (int): 통신 속도(baud rate). 기본 ``57600``.
        timeout (int | float): 읽기 타임아웃(초). 기본 ``2``.
        verbose (bool): ``True`` 이면 각 명령 호출 시 디버깅 메시지를 출력합니다.
            기본 ``False``.
    """

    def __init__(self, port=None, baud=57600, timeout=2, verbose=False):
        """KAMIBOT 과 시리얼 연결을 열고 내부 상태를 초기화합니다.

        Args:
            port (str | None): 시리얼 포트 이름. ``None`` 이면 즉시 종료됩니다.
            baud (int): 통신 속도(baud rate).
            timeout (int | float): 읽기 타임아웃(초).
            verbose (bool): 디버깅 출력 여부.

        Note:
            시리얼 포트를 열지 못하면 메시지를 출력하고 ``sys.exit()`` 으로
            프로세스를 끝냅니다. 이 동작은 원본 SDK 의 정책을 그대로 따른
            것입니다.
        """
        self.__verbose = verbose
        self.__cmdIndex = 1     # 순차적으로 증가

        self.__mode = None
        self.__battery = None
        self.__left_object = None
        self.__right_object = None
        self.__left_line = None
        self.__center_line = None
        self.__right_line = None
        self.__port = port
        self.__baud = baud
        self.__color = None
        self.__index = None     # 리턴받은 명령의 인덱스
        self.__data0 = None
        self.__data1 = None
        self.__data2 = None
        self.__data3 = None
        self.__time = time.time()

        try:
            if self.__verbose:
                print("\nPython Version %s" % sys.version)

            if not port:
                raise ValueError("Could not find port.")

            cprint(f'👽 KamibotPi Connect PORT={self.__port}, BAUD={self.__baud}', "green")
            sr = serial.Serial(port, baud, timeout=timeout)
            sr.flush()
            self.sr = sr
        except Exception as e:
            cprint(f'👽 Error(KamibotPi): {e}', 'green')
            sys.exit()
        # except KeyboardInterrupt:
        #     if self.__verbose:
        #         print("Program Aborted Before Kamibot Instantiated")
        #     sys.exit()

    def __get_idx(self):
        """다음 명령에 사용할 시퀀스 인덱스(1~255)를 반환합니다.

        패킷의 ``INDEX`` 자리에 들어가는 1바이트 값으로, 응답 패킷이
        어느 명령에 대한 것인지 확인하는 데 사용됩니다. ``255`` 를 넘으면
        다시 ``1`` 부터 순환합니다.

        Returns:
            int: 1~255 범위의 다음 인덱스.
        """
        self.__cmdIndex = self.__cmdIndex + 1
        if self.__cmdIndex > 255:
            self.__cmdIndex = 1
        return self.__cmdIndex

    def close(self):
        """시리얼 포트를 정리하고 프로세스를 종료합니다.

        포트가 열려 있으면 버퍼를 비우고 닫은 뒤, 마지막에
        ``sys.exit(0)`` 을 호출해 프로세스를 끝냅니다. 종료 메시지는 빨간
        글씨로 출력됩니다. 종료 없이 그냥 포트만 닫고 싶다면 :meth:`disconnect`
        를 사용하세요.
        """
        try:
            if self.sr and self.sr.is_open:
                self.sr.flush()
                self.sr.close()
                cprint(f'🔥 Close (KamibotPi) {self.__port}', 'red')
        except Exception as e:
            cprint(f'Error(KamibotPi): {e}', 'red')
        finally:
            sys.exit(0)


    def disconnect(self):
        """프로세스 종료 없이 시리얼 포트만 닫습니다.

        :meth:`close` 와 다른 점은 ``sys.exit()`` 을 호출하지 않는다는
        것입니다. 같은 프로그램에서 잠시 연결을 끊었다가 다시 잡고 싶을
        때 사용합니다.
        """
        try:
            if self.sr and self.sr.is_open:
                self.sr.flush()
                self.sr.close()
                cprint(f'🔥 Disconnect(KamibotPi) {self.__port}', 'red')
        except Exception as e:
            cprint(f'Error(KamibotPi): {e}', 'red')


    def __process_return(self):
        """응답 20바이트를 한 패킷 단위로 받아 내부 상태에 반영합니다.

        시리얼에서 데이터가 도착할 때까지 1ms 간격으로 폴링하며 20바이트가
        모일 때까지 기다립니다. 모이면 :class:`RETURN_PACKET` 인덱스를
        써서 모드/배터리/센서 값/마지막 명령 인덱스/페이로드를 추출해
        ``self.__battery``, ``self.__left_object``, ``self.__data0`` …
        같은 멤버에 채워 둡니다.

        Note:
            패킷 길이가 20이 아니면 길이 오류 메시지를 한 줄 출력하고
            아무 일도 하지 않습니다(예외는 던지지 않습니다).
        """
        data = []
        while len(data) < 20:
            if self.sr.inWaiting():
                c = self.sr.read()
                data.append(ord(c))
            else:
                time.sleep(.001)

        if self.__verbose:
            print('return data length {0}'.format(len(data)))

        if len(data) == 20:
            self.__mode = data[RETURN_PACKET.MODE]
            self.__battery = data[RETURN_PACKET.BATTERY]
            self.__left_object = data[RETURN_PACKET.LEFT_OBJECT]
            self.__right_object = data[RETURN_PACKET.RIGHT_OBJECT]
            self.__left_line = data[RETURN_PACKET.LEFT_LINE]
            self.__center_line = data[RETURN_PACKET.CENTER_LINE]
            self.__right_line = data[RETURN_PACKET.RIGHT_LINE]
            self.__color = data[RETURN_PACKET.COLOR]
            self.__index = data[RETURN_PACKET.INDEX]
            self.__data0 = data[RETURN_PACKET.DATA0]
            self.__data1 = data[RETURN_PACKET.DATA1]
            self.__data2 = data[RETURN_PACKET.DATA2]
            self.__data3 = data[RETURN_PACKET.DATA3]
            self.__time = time.time()

            if self.__verbose:
                print(
                    f"leftObj:{self.__left_object}, rightObj:{self.__right_object}, leftLine:{self.__left_line}, centerLine:{self.__center_line}, rightLine:{self.__right_line}")
                print(f"color:{self.__color}, index:{self.__index}, data0:{self.__data0}, data1:{self.__data1}, data2:{self.__data2}, data3:{self.__data3}, battery:{self.__battery}")
        else:
            print(f'Return data error! size={len(data)}')

    # -------------------------------------------------------------------------------------------------------
    #  BLOCK ACTION
    # -------------------------------------------------------------------------------------------------------
    def delay(self, sec):
        """기다리기

        Args:
            sec (float): 초
        Returns:
            None
        """
        time.sleep(sec)

    def delayms(self, ms):
        """주어진 밀리초만큼 기다립니다.

        Args:
            ms (int | float): 대기 시간(밀리초). 내부적으로 ``ms/1000`` 초
                동안 ``time.sleep`` 합니다.

        Returns:
            None
        """
        time.sleep(ms/1000)


    def wait(self, ms):
        """:meth:`delayms` 의 별칭. 주어진 밀리초만큼 기다립니다.

        가독성을 위해 다른 이름으로도 호출할 수 있게 둔 편의 메서드입니다.

        Args:
            ms (int | float): 대기 시간(밀리초).

        Returns:
            None
        """
        self.delayms(ms)


    def toggle_linetracer(self, mode, speed=100):
        """라인트레이서 기능 켜고 끄기

        Args:
            mode (bool): True 켜기, False 끄기
            speed (int): 라인트레이서 속도
        Returns:
            None
        """
        speed = int(float(speed))
        if mode:
            self.__start_linetracer(speed)
        else:
            self.stop()

    def __start_linetracer(self,  speed):
        """라인 트레이서 모드를 켜고 주어진 속도로 동작시킵니다(내부용).

        :meth:`toggle_linetracer` 가 ``mode=True`` 로 호출되었을 때 사용합니다.
        ``MODETYPE = ModeType.LINE`` / ``MODECOMMAND = 0x01`` 패킷을 만들어
        ``DATA0`` 자리에 속도를 실어 보냅니다.

        Args:
            speed (int): 라인 트레이서 주행 속도.
        """
        if self.__verbose:
            print("\n *__start_linetracer")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.MODETYPE] = ModeType.LINE
        command[PacketIndex.MODECOMMAND] = 0x01
        command[PacketIndex.DATA0] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # ------------------- 라인 맵보드 ------------------------------------------
    def move_forward(self,  value, opt="-l"):
        """앞으로 ( 1 )칸 이동하기

        Args:
            value (int): 이동 칸수
            opt (str) '-l': 라인맵보드  '-b': 블록맵보드
        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_forward")
        command = NULL_COMMAND_PACKET[:]
        # print("command bytes %s" % (''.join('\\x' + format(x, '02x') for x in command)))
        # print('\\x'.join(format(x, '02x') for x in command))
        mode = ModeType.MAPBOARD        # 블록맵보드
        cmd = 0x01
        if opt == "-l":
            mode = ModeType.LINEMAP     # 라인맵보드

        command[PacketIndex.MODETYPE] = mode
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = value
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_backward(self,  value):
        """뒤로 ( 1 )칸 이동하기
        블록맵보드에서만 동작함. 라인맵보드에서는 동작안함.

        Args:
            value (int): 이동 칸수
        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_backward")

        command = NULL_COMMAND_PACKET[:]
        mode = ModeType.MAPBOARD
        cmd = 0x04

        command[PacketIndex.MODETYPE] = mode
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = value
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_left(self,  value=1, opt='-l'):
        """블록: 왼쪽으로 ( 1 ) 돌기
        라인: 왼쪽으로 돌기
        라인맵보드에서는 value값에 상관없이 왼쪽으로 1번 돌기만 실행됨.

        Args:
            value (int): 이동 칸수
            opt (str): '-l': 라인맵보드, '-b':블록맵보드
        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_left")

        command = NULL_COMMAND_PACKET[:]
        mode = ModeType.MAPBOARD
        cmd = 0x03
        if opt == "-l":
            mode = ModeType.LINEMAP

        command[PacketIndex.MODETYPE] = mode
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = value
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_right(self,  value=1, opt='-l'):
        """블록: 오른쪽으로 ( 1 ) 돌기
        라인: 오른쪽으로 돌기
        라인맵보드에서는 value값에 상관없이 오른쪽으로 1번 돌기만 실행됨.

        Args:
            value (int): 이동 칸수
            opt (str): '-l': 라인맵보드, '-b':블록맵보드
        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_right")

        command = NULL_COMMAND_PACKET[:]
        mode = ModeType.MAPBOARD
        cmd = 0x02
        if opt == "-l":
            mode = ModeType.LINEMAP

        command[PacketIndex.MODETYPE] = mode
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = value
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_back(self,  value=1, opt='-l'):
        """블록: 뒤로 ( 1 ) 돌기
        라인: 뒤로 돌기
        라인맵보드에서는 value값에 상관없이 뒤로 1번 돌기만 실행됨.

        Args:
            value (int): 이동 칸수
            opt (str): '-l': 라인맵보드, '-b':블록맵보드
        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_back")

        command = NULL_COMMAND_PACKET[:]
        mode = ModeType.MAPBOARD
        cmd = 0x05
        if opt == "-l":
            mode = ModeType.LINEMAP
            cmd = 0x04

        command[PacketIndex.MODETYPE] = mode
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = value
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # ----- 콘트롤 모드
    def go_dir_speed(self,  ldir, lspeed, rdir, rspeed):
        """왼쪽, 오른쪽 바퀴의 방향과 속도를 지정해서 동작시킴

        Args:
            ldir (str): 왼쪽 바퀴의 회전 방향 설정 'f':앞으로, 'b': 뒤로
            lspeed (int): 왼쪽 바퀴의 회전 속도
            rdir (str): 오른쪽 바퀴의 회전 방향 설정 'f':앞으로, 'b': 뒤로
            rspeed (int): 오른쪽 바퀴의 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_back")

        if ldir.upper().startswith("F"):
            ld = 0x00
        else:
            ld = 0x01

        if rdir.upper().startswith("F"):
            rd = 0x00
        else:
            rd = 0x01

        # command = NULL_COMMAND_PACKET[:]
        # command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        # command[PacketIndex.MODETYPE] = ModeType.CONTROL
        # command[PacketIndex.MODECOMMAND] = 0x00  # 양쪽 모터
        # command[PacketIndex.DATA0] = rd
        # command[PacketIndex.DATA1] = rspeed
        # command[PacketIndex.DATA2] = ld
        # command[PacketIndex.DATA3] = lspeed
        # command[PacketIndex.INDEX] = self.__get_idx()

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.CONTROL
        command[PacketIndex.MODECOMMAND] = 0x00  # 양쪽 모터
        command[PacketIndex.DATA0] = ld
        command[PacketIndex.DATA1] = lspeed

        command[PacketIndex.DATA2] = rd
        command[PacketIndex.DATA3] = rspeed

        command[PacketIndex.INDEX] = self.__get_idx()

        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def go_forward_speed(self,  lspeed, rspeed):
        """왼쩍, 오른쪽 바퀴의 속도를 지정해서 앞으로 이동시킴

        Args:
            lspeed (int): 왼쪽 바퀴의 회전 속도
            rspeed (int): 오른쪽 바퀴의 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_forward_speed")

        return self.go_dir_speed("f", lspeed, "f", rspeed)

    def go_backward_speed(self,  lspeed, rspeed):
        """왼쪽, 오른쪽 바퀴의 속도를 지정해서 뒤로 이동시킴

        Args:
            lspeed (int): 왼쪽 바퀴의 회전 속도
            rspeed (int): 오른쪽 바퀴의 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_backward_speed")

        return self.go_dir_speed("b", lspeed, "b", rspeed)

    def go_left_speed(self,  speed):
        """속도를 지정해서 왼쪽으로 회전시킴

        Args:
            speed (int): 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_left_speed")

        return self.go_dir_speed("f", speed, "f", 0)

    def go_right_speed(self,  speed):
        """속도를 지정해서 오른쪽으로 회전시킴

        Args:
            speed (int): 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_left_speed")

        return self.go_dir_speed("f", 0, "f", speed)

    def stop(self):
        """이동중인 로봇을 정지시킴

        Args:
            None
        Returns:
            None
        """
        if self.__verbose:
            print("\n * stop")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.CONTROL
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = 0x02
        command[PacketIndex.DATA2] = 0x02

        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # 초기화
    def init(self):
        """로봇을 초기화 시킴
        Args:
            None
        Returns:
            None
        """
        if self.__verbose:
            print("\n * init")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.MODETYPE] = ModeType.INITIALIZE
        command[PacketIndex.MODECOMMAND] = 0x01
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    ### ---------- 정밀제어모드 ------------------------- ###
    def move_step(self,  ldir, lstep, rdir, rstep):
        """왼쪽, 오른쪽 모터의 회전 방향을 지정하고 스텝수 단위로 이동

        Args:
            ldir (int): 왼쪽 바퀴 회전 방향 'f':앞으로 'b':뒤로
            lstep (int): 스텝수
            rdir (int): 오른쪽 바퀴 회전 방향 'f':앞으로 'b':뒤로
            rstep (int): 스텝수

        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_step *")

        if rdir.upper().startswith("F"):
            print('RF')
            rd = 0x01
        else:
            rd = 0x02

        if ldir.upper().startswith("F"):
            print('LF')
            ld = 0x01
        else:
            ld = 0x02

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = 0x11  # 스텝단위

        command[PacketIndex.DATA0] = rd
        command[PacketIndex.DATA1] = rstep & 0x00ff         # LOW BIT
        command[PacketIndex.DATA2] = (rstep >> 8) & 0x00ff  # HIGH BIT
        command[PacketIndex.DATA3] = 100  # 속도
        command[PacketIndex.DATA4] = ld
        command[PacketIndex.DATA5] = lstep & 0x00ff  # LOW BIT
        command[PacketIndex.DATA6] = (lstep >> 8) & 0x00ff  # HIGH BIT
        command[PacketIndex.DATA7] = 100  # 속도
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_time(self,  ldir, lsec, rdir, rsec):
        """왼쪽, 오른쪽 모터의 회전 방향을 지정하고 시간을 지정하여 이동

        Args:
            ldir (int): 왼쪽 바퀴 회전 방향 'f':앞으로 'b':뒤로
            lsec (int): 시간 (초)
            rdir (int): 오른쪽 바퀴 회전 방향 'f':앞으로 'b':뒤로
            rsec (int): 시간 (초)

        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_time *")

        if rdir.upper().startswith("F"):
            rd = 0x01
        else:
            rd = 0x02

        if ldir.upper().startswith("F"):
            ld = 0x01
        else:
            ld = 0x02

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = 0x12  # 초단위

        command[PacketIndex.DATA0] = rd
        command[PacketIndex.DATA1] = rsec & 0x00ff         # LOW BIT
        command[PacketIndex.DATA2] = (rsec >> 8) & 0x00ff  # HIGH BIT
        command[PacketIndex.DATA3] = 100  # 속도

        command[PacketIndex.DATA4] = ld
        command[PacketIndex.DATA5] = lsec & 0x00ff  # LOW BIT
        command[PacketIndex.DATA6] = (lsec >> 8) & 0x00ff  # HIGH BIT
        command[PacketIndex.DATA7] = 100  # 속도
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_forward_unit(self,  value=10, opt="-l", speed=50):
        """ 앞으로 이동할 단위를 지정하여 동작시킴
        1cm, 1초, 1스텝

        Args:
            value (int): 이동할 값
            opt (str): 옵션 '-l': cm, '-t': sec, '-s': step
            speed (int): 속도

        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_forward_unit *")

        if opt == '-l':
            cmd = 0x01  # 1cm 앞으로
        elif opt == '-t':
            cmd = 0x05   # 1초 앞으로
        elif opt == '-s':
            cmd = 0x0d  # 1스텝 앞으로
        else:
            return None

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = cmd

        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_right_speed(self, value=90, speed=50):
        """오른쪽으로 제자리에서 회전

        Args:
            value (int): 회전각
            speed (int): 속도

        Returns:
            None
        """
        # return self.move_right_unit(value, "-l", speed)
        if self.__verbose:
            print("\n * turn_right_speed * ")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = 0x11

        # 오른쪽 바퀴
        command[PacketIndex.DATA0] = 0x02
        command[PacketIndex.DATA1] = value & 0x00ff
        command[PacketIndex.DATA2] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA3] = speed

        # 왼쪽바퀴
        command[PacketIndex.DATA4] = 0x01
        command[PacketIndex.DATA5] = value & 0x00ff
        command[PacketIndex.DATA6] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA7] = speed

        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_right_unit(self, value=10, opt="-l", speed=50):
        """오른쪽으로 이동할 단위를 지정하여 동작시킴
        1cm, 1초, 1스텝

        Args:
            value (int): 이동할 값
            speed (int): 속도
            opt (str): 옵션 '-l': cm, '-t': 초, '-s': 스텝

        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_right_unit *")

        if opt == '-l':
            cmd = 0x02  # 1cm 앞으로
        elif opt == '-t':
            cmd = 0x06   # 1초 앞으로
        elif opt == '-s':
            cmd = 0x0e  # 1스텝 앞으로
        else:
            return None

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = cmd

        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_left_speed(self, value=90, speed=50):
        """왼쪽으로 제자리에서 회전

        Args:
            value (int): 회전각
            speed (int): 속도

        Returns:
            None
        """
        # return self.move_left_unit(value, "-l", speed)
        if self.__verbose:
            print("\n * turn_left_speed * ")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = 0x11

        # 오른쪽 바퀴
        command[PacketIndex.DATA0] = 0x01
        command[PacketIndex.DATA1] = value & 0x00ff
        command[PacketIndex.DATA2] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA3] = speed

        # 왼쪽바퀴
        command[PacketIndex.DATA4] = 0x02
        command[PacketIndex.DATA5] = value & 0x00ff
        command[PacketIndex.DATA6] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA7] = speed

        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_left_unit(self, value=10, opt="-l", speed=50):
        """왼쪽으로 이동할 단위를 지정하여 동작시킴
        1cm, 1초, 1스텝

        Args:
            value (int): 이동할 값
            speed (int): 속도
            opt (str): 옵션 '-l': cm, '-t': 초, '-s': 스텝

        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_left_unit * ")

        if opt == '-l':
            cmd = 0x03
        elif opt == '-t':
            cmd = 0x07
        elif opt == '-s':
            cmd = 0x0f
        else:
            return None

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = cmd

        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def move_backward_unit(self, value=10, opt="-l", speed=50):
        """뒤로 이동할 단위를 지정하여 동작시킴
        1cm, 1초, 1스텝

        Args:
            value (int): 이동할 값
            speed (int): 속도
            opt (str): 옵션 '-l': cm, '-t': 초, '-s': 스텝

        Returns:
            None
        """
        if self.__verbose:
            print("\n * move_backward_unit * ")

        if opt == '-l':
            cmd = 0x04
        elif opt == '-t':
            cmd = 0x08
        elif opt == '-s':
            cmd = 0x10
        else:
            return None

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = cmd

        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def turn_continous(self, dir="l", speed=100):
        """지정된 방향으로 계속 회전하기

        Args:
            dir (str): 회전 방향 'r': 오른쪽으로, 'l':왼쪽으로

        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_continous * ")

        if dir.upper() == 'L':
            cmd = 0x0c
        else:
            cmd = 0x0b

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.PRECISION_CTR
        command[PacketIndex.MODECOMMAND] = cmd

        command[PacketIndex.DATA0] = 0x00
        command[PacketIndex.DATA1] = 0x00
        command[PacketIndex.DATA2] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # ------------------------------LED ------------------------------------------------

    def turn_led_idx(self,  idx):
        """컬러 LED 켜기

        Args:
            idx (int): 0 ~ 7,  0:red, 1:orange, 2:yellow, 3:green, 4:blue , 5:skyblue , 6:purple , 7:white

        Returns:
            None
        """
        self.turn_led(LED_COLOR[idx][0], LED_COLOR[idx][1], LED_COLOR[idx][2])

    def turn_led(self,  rval, gval, bval):
        """컬러 LED 켜기

        Args:
            rval (int): 0 ~ 255 Red 값
            gval (int): 0 ~ 255 Green 값
            bval (int): 0 ~ 255 Blue 값

        Returns:
            None
        """
        if self.__verbose:
            print("\n * turn_led *")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.RGB
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = rval
        command[PacketIndex.DATA1] = gval
        command[PacketIndex.DATA2] = bval

        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # -------------------------------TOP 스텝퍼 모드 ----------------------------------------
    def top_motor_degree(self,  dir, value=90, speed=50):
        """탑모터 방향으로 지정해서 주어진 각도만큼 회전시키기

        Args:
            dir (int): 방향 'l': 왼쪽으로, 'r': 오른쪽으로
            value (int): 각도값
            speed (int): 회전 속도

        Returns:
            None
        """
        if self.__verbose:
            print("\n * top_motor_degree *")

        if dir.upper().startswith("L"):
            dir = 0x02
        elif dir.upper().startswith("R"):
            dir = 0x01
        else:
            dir = 0x04  # 멈춤

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.TOP_STEPPER
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = dir
        command[PacketIndex.DATA3] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def top_motor_abspos(self,  degree=0, speed=50):
        """탑모터 절대 각도 위치로 이동시키기

        Args:
            dir (int): 방향 'l': 왼쪽으로, 'r': 오른쪽으로
            degree (int): 각도값
            speed (int): 회전 속도

        Returns:
            None
        """
        if self.__verbose:
            print("\n * top_motor_abspos")

        degree = 65000 if degree > 65000 else degree

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.TOP_STEPPER
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = degree & 0x00ff
        command[PacketIndex.DATA1] = (degree >> 8) & 0x00ff
        command[PacketIndex.DATA2] = 0x03  # 절대각도
        command[PacketIndex.DATA3] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def top_motor_stop(self):
        """탑모터 회전 정지시키기

        Args:
            None

        Returns:
            None
        """
        if self.__verbose:
            print("\n * top_motor_stop *")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.TOP_STEPPER
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = 0x00
        command[PacketIndex.DATA1] = 0x00
        command[PacketIndex.DATA2] = 0x04
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def top_motor_time(self, dir, value=3, speed=50):
        """탑모터 방향을 지정해서 정해진 시간마큼 회전시키기

        Args:
            dir (int): 방향 'l': 왼쪽으로, 'r': 오른쪽으로
            value (int): 회전 시간을 초단위로 지정
            speed (int): 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * top_motor_time *")

        if dir.upper().startswith("L"):
            dir = 0x02
        elif dir.upper().startswith("R"):
            dir = 0x01
        else:
            dir = 0x04
            value = 0x00
            speed = 0x00

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.TOP_STEPPER
        command[PacketIndex.MODECOMMAND] = 0x01
        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = dir
        command[PacketIndex.DATA3] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def top_motor_round(self,  dir, value=1, speed=50):
        """탑모터 방향을 지정해서 정해진만큼 회전시키기

        Args:
            dir (int): 방향 'left': 왼쪽으로, 'right': 오른쪽으로
            value (int): 회전수
            speed (int): 회전 속도
        Returns:
            None
        """
        if self.__verbose:
            print("\n * top_motor_time *")

        if dir.upper().startswith("L"):
            dir = 0x02
        elif dir.upper().startswith("R"):
            dir = 0x01
        else:
            dir = 0x04
            value = 0x00
            speed = 0x00

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_WRITE
        command[PacketIndex.MODETYPE] = ModeType.TOP_STEPPER
        command[PacketIndex.MODECOMMAND] = 0x02
        command[PacketIndex.DATA0] = value & 0x00ff
        command[PacketIndex.DATA1] = (value >> 8) & 0x00ff
        command[PacketIndex.DATA2] = dir
        command[PacketIndex.DATA3] = speed
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # ----------------------------물체 감지 ------------------------------------------------

    def get_object_detect(self,  opt=True):
        """물체 감지 센서를 동작시킨다.

        Args:
            opt (bool): True 센서 동작, False 센서 멈춤

        Returns:
            None
        """
        if self.__verbose:
            print("\n * get_object_detect*")

        if opt:
            cmd = 0x00
        else:
            cmd = 0x01

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.OBJECT_DETECTER
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        # print(f"left:{self.__left_object}, right:{self.__right_object}")
        return self.__left_object, self.__right_object

    # -------------------------------라인센서, 라인 검출 모드-----------------------------------

    def get_line_sensor(self,  opt=True):
        """라인감지 센서를 동작시킨다.

        Args:
            opt (bool): True 센서 동작, False 센서 멈춤

        Returns:
            None
        """
        if self.__verbose:
            print("\n * get_line_sensor *")

        if opt:
            cmd = 0x01
        else:
            cmd = 0x00

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.LINE_DETECTOR
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = cmd
        command[PacketIndex.DATA1] = cmd
        command[PacketIndex.DATA2] = cmd
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        # 2022-04-08 left와 right의 방향을 바꾼다.
        # return (self.__left_line, self.__center_line, self.__right_line)
        return (self.__right_line, self.__center_line, self.__left_line)

    # -------------------------컬러측정 모드-------------------------------------------------------------
    def get_color_sensor(self,  opt=True):
        """컬러센서를 동작시킨다.

        Args:
            opt (bool): True 센서 동작, False 센서 멈춤

        Returns:
            color (int) : 색상 인덱스 값
        """

        if self.__verbose:
            print("\n * get_color_sensor *")

        if opt:
            cmd = 0x00
        else:
            cmd = 0x01

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.COLOR_DETECTOR
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return self.__color

    def get_color_elements(self,  opt=True):
        """컬러센서를 동작시킨다.

        Args:
            opt (bool): True 센서 동작, False 센서 멈춤

        Returns:
            color (r, g, b)
        """

        if self.__verbose:
            print("\n * get_color_sensor *")

        if opt:
            cmd = 0x00
        else:
            cmd = 0x01

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.COLOR_DETECTOR
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return (self.__data0, self.__data1, self.__data2)

    # --------------------------------배터리 값---------------------------------------------

    def get_battery(self):
        """배터리값을 구한다

        Args:
           opt (bool): 배터리값 획득 기능 옵션 True: 기능 켬, False: 기능 끔

        Returns:
            배터리값
        """
        if self.__verbose:
            print("\n * get_battery*")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.BATTERY
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return self.__battery

    # ---------------------------------버전 정보 -----------------------------------------------------
    def get_version(self):
        """펌웨어 버전 획득 

        Args:
           opt (bool): 펌웨어 버전 획득 기능 옵션 True: 기능 켬, False: 기능 끔 

        Returns:
            버전      
        """
        if self.__verbose:
            print("\n * get_version*")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.COMMANDTYPE] = COMMANDTYPE_READ
        command[PacketIndex.MODETYPE] = ModeType.VERSION
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # ---------------------------------도형 모드 --------------------------------------------
    def draw_tri(self, len):
        """삼각형 그리기

        Args:
           len (int): 삼각형 한변의 길이 cm

        Returns:
            None      
        """
        self.__draw_shape(0x01, len)

    def draw_rect(self, len):
        """사각형 그리기

        Args:
           len (int): 사각형 한변의 길이 cm

        Returns:
            None      
        """
        self.__draw_shape(0x02, len)

    def draw_penta(self, len):
        """오각형 그리기

        Args:
           len (int): 오각형 한변의 길이 cm

        Returns:
            None      
        """
        self.__draw_shape(0x03, len)

    def draw_hexa(self, len):
        """육각형 그리기

        Args:
           len (int): 육각형 한변의 길이 cm

        Returns:
            None
        """
        self.__draw_shape(0x04, len)

    def draw_star(self, len):
        """별모양 그리기

        Args:
           len (int): 별모양 한변의 길이 cm

        Returns:
            None      
        """
        self.__draw_shape(0x06, len)

    def draw_circle(self, len):
        """원 그리기

        Args:
           len (int): 원의 반지름

        Returns:
            None      
        """
        self.__draw_shape(0x07, len)

    def draw_semicircle(self, len, side="l"):
        """반원 그리기

        Args:
           len (int): 원의 반지름
           side (str): "l":왼쪽, "r":오른쪽
        Returns:
            None      
        """
        if side.upper().startswith("L"):
            cmd = 0x02
        else:
            cmd = 0x01
        self.__draw_shape(0x08, len, cmd)

    def draw_arc(self, radius, value=1, mode=0):
        """주어진 시간만큼 원호 그리기

        Args:
           radius (int): 원의 반지름
           value (int): mode == 0? 시간 (초) : 각도 
           mode (int) : 0 이면 시간, 1이면 각도 
        Returns:
            None      
        """
        # self.__draw_shape(0x0a, len, time & 0x00ff, (time >> 8) & 0x00ff)
        cmd = 0x0a if mode == 0 else 0x09;
        self.__draw_shape(cmd, radius, value & 0x00ff, (value >> 8) & 0x00ff)

    def __draw_shape(self,  cmd, len, val1=0, val2=0):
        """도형 그리기 모드 패킷을 만들어 보내는 공통 헬퍼(내부용).

        :meth:`draw_tri`, :meth:`draw_rect`, :meth:`draw_penta`,
        :meth:`draw_hexa`, :meth:`draw_star`, :meth:`draw_circle`,
        :meth:`draw_semicircle`, :meth:`draw_arc` 가 모두 이 함수를 통해
        펌웨어에 도형 명령을 전달합니다.

        Args:
            cmd (int): 도형 종류를 식별하는 ``MODECOMMAND`` 바이트
                (예: 삼각형 ``0x01``, 사각형 ``0x02``, 원 ``0x07``).
            len (int): ``DATA0`` 자리. 도형의 한 변 길이(또는 반지름) cm.
            val1 (int): ``DATA1`` 자리. 도형 종류에 따라 추가 파라미터로 사용.
            val2 (int): ``DATA2`` 자리. 도형 종류에 따라 추가 파라미터로 사용.

        Returns:
            None
        """
        if self.__verbose:
            print("\n * go_lrspeed_unit")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.MODETYPE] = ModeType.DRAWSHAPE
        command[PacketIndex.MODECOMMAND] = cmd
        command[PacketIndex.DATA0] = len
        command[PacketIndex.DATA1] = val1
        command[PacketIndex.DATA2] = val2
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    # -----------------------------------멜로디 모드 ----------------------------------------

    def melody(self,  scale=45, sec=1):
        """소리내기 

        Args:
            scale (int): 음계 (0 ~ 83)
            sec (int): 시간 (초)
        Returns:
            None      
        """
        if self.__verbose:
            print("\n * melody *")

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.MODETYPE] = ModeType.MELODY
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = scale
        command[PacketIndex.DATA1] = int(sec * 10)
        command[PacketIndex.DATA2] = 0x00
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def beep(self, sec=0.2):
        """삐 소리내기

        Args:
            sec (float): play duration in seconds (default 0.2). Range 0.1 ~ 25.5.

        Returns:
            None
        """
        if self.__verbose:
            print("\n * beep")

        duration = max(1, min(255, int(round(sec * 10))))

        command = NULL_COMMAND_PACKET[:]
        command[PacketIndex.MODETYPE] = ModeType.MELODY
        command[PacketIndex.MODECOMMAND] = 0x00
        command[PacketIndex.DATA0] = 60
        command[PacketIndex.DATA1] = duration  # 0.1s units
        command[PacketIndex.DATA2] = 0x00
        command[PacketIndex.INDEX] = self.__get_idx()
        try:
            self.sr.write(bytes(bytearray(command)))
            self.sr.flush()
        except Exception as e:
            print('An Exception occurred!', e)
        self.__process_return()
        return None

    def angle3p(p1, p2, p3):
        """세 점이 ``p2`` 에서 만드는 각도(도 단위, 반시계 방향)를 계산합니다.

        ``p1 → p2 → p3`` 순서를 기준으로, ``p2`` 를 꼭짓점으로 두고 ``p2 p1``
        방향에서 ``p2 p3`` 방향까지 시계 반대 방향으로 회전한 각도를
        돌려줍니다. 결과는 0 ~ 360 범위의 도(degree) 입니다.

        Args:
            p1: 첫 점 ``(x, y, ...)``.
            p2: 꼭짓점 ``(x, y, ...)``.
            p3: 끝 점 ``(x, y, ...)``.

        Returns:
            float: 0 ~ 360 사이의 각도(도).

        Note:
            이 메서드는 인스턴스 멤버에 접근하지 않으므로 동작 자체는
            정적이지만, 클래스 외부에서는 ``KamibotPi.angle3p(p1, p2, p3)``
            처럼 호출해야 동작합니다(``self`` 인자가 시그니처에 없음).
        """
        Ax, Ay = p1[0]-p2[0], p1[1]-p2[1]
        Cx, Cy = p3[0]-p2[0], p3[1]-p2[1]
        a = math.atan2(Ay, Ax)
        c = math.atan2(Cy, Cx)
        if a < 0:
            a += math.pi*2
        if c < 0:
            c += math.pi*2

        rad = (math.pi*2 + c - a) if a > c else (c - a)
        return rad * 180/math.pi

    def remap(self, value, source_range, target_range):
        """원본 범위에 있던 값을 같은 비율로 목표 범위에 매핑해 돌려줍니다.

        센서 입력값(예: 0~1023)을 모터 속도 범위(예: 0~100)로 옮길 때처럼
        선형 비례 변환이 필요한 곳에서 사용합니다.

        Args:
            value (float | int): 변환할 원본 값.
            source_range (tuple[float, float]): ``value`` 가 속한 원본
                범위 ``(s0, s1)``. ``s0 == s1`` 이면 0 으로 나누는 오류가
                발생할 수 있으므로 호출자가 회피해야 합니다.
            target_range (tuple[float, float]): 매핑할 목표 범위 ``(t0, t1)``.

        Returns:
            float: 같은 비율로 ``target_range`` 안에 옮겨진 값.

        Examples:
            >>> remap(50, (0, 100), (0, 10))
            5.0

            >>> remap(5, (0, 10), (0, 100))
            50.0

            >>> remap(5, (0, 10), (10, 20))
            15.0

            >>> remap(15, (10, 20), (0, 10))
            5.0
        """
        s0, s1 = source_range
        t0, t1 = target_range
        S = s1 - s0
        T = t1 - t0
        return t0 + ((value - s0) / S) * T
    

# END OF CLASS
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
#-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
#-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
# *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 



