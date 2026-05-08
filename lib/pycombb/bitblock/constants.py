# -*-coding:utf-8-*-
"""Bitblock 펌웨어 프로토콜 상수 정의 모듈.

이 모듈은 컴블럭(Bitblock) 메인보드와 주고받는 20바이트 고정 길이 패킷의
"의미 있는 자릿수" 와 "들어갈 수 있는 값"을 모두 이름 있는 상수로 노출합니다.
사용자 코드에서는 직접 다룰 일이 거의 없고, :class:`pycombb.bitblock.Bitblock`
의 각 메서드가 내부적으로 패킷을 만들 때 사용합니다.

크게 다음 네 종류로 묶입니다.

* **하드웨어 매핑**: :class:`PIN`, :class:`SYMBOL`, :class:`COLOR`,
  :class:`NOTE` — 핀 번호, LED 매트릭스로 출력할 문자/숫자 토큰, RGB 색상
  프리셋, MIDI 음표 인덱스.
* **프로토콜 코드**: :class:`ACTION_CODE`, :class:`ACTION_MODE` —
  명령 패킷의 ``ACTION`` 자리에 들어가는 1바이트 명령 코드와, 같은 명령
  안에서 세부 동작을 구분하는 ``MODE`` 코드.
* **패킷 구조**: :class:`BBPACKET`, :class:`BBRETURN`,
  :data:`NULL_COMMAND_PACKET`, :data:`LENGTH_OF_PACKET` — 송신/수신 패킷의
  필드 인덱스, 그리고 모든 메서드가 복사해서 채워 보내는 20바이트 기본
  패킷.
* **연결/오류**: :class:`BLEUUID`, :class:`ERROR` — BLE 모드에서 사용할
  UUID 와 사용자에게 노출되는 오류 메시지.

Attributes:
    NULL_COMMAND_PACKET (list[int]): 모든 메서드가 ``[:]`` 로 복사해 사용
        하는 20바이트 기본 명령 패킷. 0번/1번 자리에 헤더(``0xff``, ``0x77``),
        2번 자리에 길이(``0x11``), 마지막 자리에 종료 바이트(``0x5a``)가
        들어가 있습니다. 0.4 버전부터 헤더의 두 번째 바이트는 ``0x77`` 로
        고정됩니다.
    LENGTH_OF_PACKET (int): 송수신 패킷의 고정 길이. 항상 20입니다.
"""

__all__ = [
    "SYMBOL",
    "COLOR",
    "NOTE",
    "PIN",

    "BBPACKET",
    "BBRETURN",
    "ACTION_CODE",
    "ACTION_MODE",
    "NULL_COMMAND_PACKET",
    "LENGTH_OF_PACKET",
    "BLEUUID",
    "ERROR"
]


class PIN:
    """컴블럭 메인보드의 외부 핀 번호 매핑.

    보드 실루엣에 인쇄된 ``P0`` ~ ``P12`` 라벨을 펌웨어가 인식하는 실제
    GPIO 번호로 변환할 때 사용합니다. ``SERVO`` / ``DCMOTOR`` 는 메인보드에
    내장된 서보/DC 모터의 전용 핀입니다.

    사용자 코드에서는 보통 ``Bitblock`` 인스턴스의 ``pin`` 속성을 통해
    접근하지만, 직접 ``PIN.P0`` 처럼 클래스 상수로도 쓸 수 있습니다.
    """
    P0 = 10
    P1 = 4
    P2 = 8
    P3 = 2
    P4 = 47  # 9
    P7 = 39
    P11 = 48  #7
    P12 = 18
    SERVO = 16
    DCMOTOR = 46


class SYMBOL:
    """LED 매트릭스에 글자/숫자를 표시할 때 쓰는 1바이트 토큰.

    :meth:`Bitblock.Display.char` / :meth:`Bitblock.Display.num` 인자로
    그대로 전달되며, 펌웨어가 미리 가지고 있는 폰트 글리프를 선택합니다.
    값은 ASCII 문자 자체이므로 ``"A"`` 같은 리터럴을 직접 넘겨도 동작합니다.
    """
    CHAR_A= 'A'
    CHAR_B= 'B'
    CHAR_C= 'C'
    CHAR_D= 'D'
    CHAR_E= 'E'
    CHAR_F= 'F'
    CHAR_G= 'G'
    CHAR_H= 'H'
    CHAR_I= 'I'
    CHAR_J= 'J'
    CHAR_K= 'K'
    CHAR_L= 'L'
    CHAR_M= 'M'
    CHAR_N= 'N'
    CHAR_O= 'O'
    CHAR_P= 'P'
    CHAR_Q= 'Q'
    CHAR_R= 'R'
    CHAR_S= 'S'
    CHAR_T= 'T'
    CHAR_U= 'U'
    CHAR_V= 'V'
    CHAR_W= 'W'
    CHAR_X= 'X'
    CHAR_Y= 'Y'
    CHAR_= 'Z'
    NUM_0= '0'
    NUM_1= '1'
    NUM_2= '2'
    NUM_3= '3'
    NUM_4= '4'
    NUM_5= '5'
    NUM_6= '6'
    NUM_7= '7'
    NUM_8= '8'
    NUM_9= '9'


class COLOR:
    """LED 매트릭스 출력에 사용할 RGB 프리셋 모음.

    각 상수는 ``[R, G, B]`` (각각 0~255) 형태의 리스트입니다.
    :meth:`Bitblock.Display.color`, :meth:`Bitblock.Display.symbol`,
    :meth:`Bitblock.Display.row` 등 색상을 받는 모든 메서드에 그대로 넘길
    수 있고, 같은 자리에 ``"#RRGGBB"`` 헥사 문자열을 넘겨도 동일하게
    동작합니다.

    Examples:
        >>> bot.display.color(COLOR.RED)
        >>> bot.display.color([255, 0, 0])
        >>> bot.display.color("#ff0000")
    """
    BLACK=      [0, 0, 0]
    WHITE=      [255, 255, 255]
    BLUE=       [0, 0, 255]
    YELLOW=     [255, 255, 0]
    RED=        [255, 0, 0]
    VIOLET=     [181, 126, 220]
    ORANGE=     [255, 165, 0]
    GREEN=      [0, 128, 0]
    GRAY=       [128, 128, 128]

    IVORY=      [255, 255, 240]
    BEIGE=      [245, 245, 220]
    WHEAT=      [245, 222, 179]
    TAN=        [210, 180, 140]
    KHAKI=      [195, 176, 145]
    SILVER=     [192, 192, 192]
    CHARCOAL=   [70, 70, 70]
    NAVYBLUE=   [0, 0, 128]
    ROYALBLUE=  [8, 76, 158]
    MEDIUMBLUE= [0, 0, 205]
    AZURE=      [0, 127, 255]
    CYAN=       [0, 255, 255]
    AQUAMARINE= [127, 255, 212]
    TEAL=       [0, 128, 128]
    FORESTGREEN= [34, 139, 34]
    OLIVE=      [128, 128, 0]
    LIME=       [191, 255, 0]
    GOLD=       [255, 215, 0]
    SALMON=     [250, 128, 114]
    HOTPINK=    [252, 15, 192]
    FUCHSIA=    [255, 119, 255]
    PUCE=       [204, 136, 153]
    PLUM=       [132, 49, 121]
    INDIGO=     [75, 0, 130]
    MAROON=     [128, 0, 0]
    CRIMSON=    [220, 20, 60]
    DEFAULT=    [0, 0, 0]


class NOTE:
    """부저 음정에 사용할 음표 인덱스 상수.

    이름은 표준 옥타브 표기(``C4``, ``CS4`` = C#4 등)를 그대로 따르며,
    값은 펌웨어가 음표 테이블에서 사용하는 0부터 시작하는 정수 인덱스입니다.
    :meth:`Bitblock.note` 의 ``note`` 인자에 직접 전달합니다.
    """
    B0=     0
    C1=     1
    CS1=    2
    D1=     3
    DS1=    4
    E1=     5
    F1=     6
    FS1=    7
    G1=     8
    GS1=    9
    A1=     10
    AS1=    11
    B1=     12
    C2=     13
    CS2=    14
    D2=     15
    DS2=    16
    E2=     17
    F2=     18
    FS2=    19
    G2=     20
    GS2=    21
    A2=     22
    AS2=    23
    B2=     24
    C3=     25
    CS3=    26
    D3=     27
    DS3=    28
    E3=     29
    F3=     30
    FS3=    31
    G3=     32
    GS3=    33
    A3=     34
    AS3=    35
    B3=     36
    C4=     37
    CS4=    38
    D4=     39
    DS4=    40
    E4=     41
    F4=     42
    FS4=    43
    G4=     44
    GS4=    45
    A4=     46
    AS4=    47
    B4=     48
    C5=     49
    CS5=    50
    D5=     51
    DS5=    52
    F5=     53
    FS5=    54
    G5=     55
    GS5=    56
    A5=     57
    AS5=    58
    B5=     59
    C6=     60
    CS6=    61
    D6=     62
    DS6=    63
    E6=     64
    F6=     65
    G6=     66
    GS6=    67
    A6=     68
    AS6=    69
    B6=     70
    C7=     71
    CS7=    72
    D7=     73
    DS7=    74
    E7=     75
    F7=     76
    FS7=    77
    G7=     78
    GS7=    79
    A7=     80
    AS7=    81
    B7=     82
    C8=     83
    CS8=    84
    DS8=    85


class ACTION_CODE:
    """명령 패킷의 ``ACTION`` 자리에 들어가는 최상위 명령 코드.

    "어떤 부품을 동작시킬지" 를 1바이트로 식별합니다. 같은 부품이라도
    세부 동작은 :class:`ACTION_MODE` 의 모드 코드로 한 번 더 구분됩니다.
    예를 들어 LED 매트릭스에 색을 지정할 때는 ``ACTION_CODE.MATRIX_LED``
    + ``ACTION_MODE.DISPLAY_COLOR`` 조합을 사용합니다.

    Attributes:
        NOTHING (int): 빈 동작.
        RESET_BOARD (int): 보드 리셋.
        MATRIX_LED (int): 5x5 LED 매트릭스 명령군.
        BUTTON (int): 본체 버튼 상태 조회.
        BUZZER (int): 부저 명령군(비프/멜로디/음표).
        MPU_ACTION (int): 6축 IMU 기반 기울기 조회.
        DIGITAL (int): 디지털 입출력.
        ANALOG (int): 아날로그 입출력 / DC모터 PWM.
        ULTRASONIC (int): 초음파 거리 측정.
        SERVO (int): 외부 핀 서보.
        TOUCH (int): 정전식 터치 센서.
        DCMOTOR (int): DC 모터 전용 명령(현재는 ANALOG로 대체).
        TMPHUM (int): DHT11 온습도 센서.
        LIGHT_SENSOR (int): 빛 센서 두 채널.
        MIC_SENSOR (int): 마이크(소리) 센서.
        RCCAR (int): RC카 모드 명령군.
        MAIN_SERVO (int): 메인보드 내장 서보.
        ACT_OK (int): 펌웨어가 보내는 정상 응답 마커.
        ERROR (int): 펌웨어가 보내는 오류 응답 마커.
    """
    NOTHING=        0x00
    RESET_BOARD=    0xc0
    MATRIX_LED=     0xc1
    BUTTON=         0xc2
    BUZZER=         0xc3
    MPU_ACTION=     0xc4
    DIGITAL=        0xc5
    ANALOG=         0xc6
    ULTRASONIC=     0xc7
    SERVO=          0xc8
    TOUCH=          0xc9
    DCMOTOR=        0xca
    TMPHUM=         0xcb
    LIGHT_SENSOR=   0xcc
    MIC_SENSOR=     0xcd
    RCCAR=          0xce
    MAIN_SERVO=     0xd0
    # BOARD_RESET= 0xaa
    ACT_OK=         0xfe
    ERROR=          0xff


class ACTION_MODE:
    """:class:`ACTION_CODE` 명령군 내부의 세부 동작 모드.

    같은 ``ACTION`` 코드 안에서 "정확히 무엇을 시킬지" 를 구분하는
    1바이트 값입니다. 이름은 접두어로 어떤 명령군에 속하는지 표시합니다
    (``DISPLAY_*`` → ``MATRIX_LED``, ``BUZZER_*`` → ``BUZZER``, ``DIGITAL_*``
    → ``DIGITAL``, ``RCCAR_*`` → ``RCCAR`` 등).

    값은 명령군별로 독립적으로 정의되어 있어, 다른 그룹끼리는 같은 정수가
    겹칠 수 있습니다(예: ``DISPLAY_NUM = 0x01`` 과 ``BUZZER_BEEP = 0x01``).
    반드시 같은 ``ACTION_CODE`` 와 짝지어 사용해야 합니다.
    """
    DISPLAY_NUM=        0x01
    DISPLAY_CHAR=       0x02
    DISPLAY_SYMBOL=     0x03
    DISPLAY_COLOR=      0x04
    DISPLAY_BRIGHT=     0x05
    DISPLAY_XY=         0x06
    DISPLAY_EFFECT=     0x07
    DISPLAY_ROW=        0x08

    BUZZER_BEEP=        0x01
    BUZZER_MELODY=      0x02
    BUZZER_NOTE=        0x03

    TOUCH_INIT=         0x01
    TOUCH_VALUES=       0x02

    DIGITAL_OUTPUT=     0x01
    DIGITAL_INPUT=      0x02
    DIGITAL_PULLUP=     0x03

    ANALOG_OUTPUT=      0x01
    ANALOG_INPUT=       0x02

    RCCAR_FORWARD=      0x01
    RCCAR_BACKWARD=     0x02
    RCCAR_RLSPEED=      0x03
    RCCAR_STOP=         0X04
    RCCAR_DISTANCE=     0x05
    RCCAR_LINESENSOR=   0x06
    RCCAR_INITIALIZE=   0x10

# 파이썬 라이브러리는 HEADER를 0x77로 설정한다. 0.4버전 부터
NULL_COMMAND_PACKET = [0xff,0x77,0x11,0x00,0x00,
                       0x00,0x00,0x00,0x00,0x00,
                       0x00,0x00,0x00,0x00,0x00,
                       0x00,0x00,0x00,0x00,0x5a]
LENGTH_OF_PACKET = 20


class BBPACKET:
    """송신용 20바이트 명령 패킷의 필드 위치(인덱스) 상수.

    각 메서드가 :data:`NULL_COMMAND_PACKET` 사본을 만든 뒤
    ``command[BBPACKET.ACTION] = ...`` 처럼 이 클래스의 상수를 인덱스로
    써서 자리에 값을 채워 넣습니다.

    Attributes:
        START (int): 헤더 시작 바이트(0). 항상 ``0xff``.
        HEADER (int): 두 번째 헤더 바이트(1). 0.4 이상에서 ``0x77``.
        LENGTH (int): 패킷 길이(2). 항상 ``0x11`` = 17(헤더 제외).
        INDEX (int): 명령 시퀀스 번호(3). 1~255 사이를 순환합니다.
        ACTION (int): :class:`ACTION_CODE` 위치(4).
        DATA0..DATA13 (int): 페이로드 영역(5~18). 보통 ``DATA0`` 에
            :class:`ACTION_MODE` 가 들어가고 그 뒤로 모드별 인자가 따릅니다.
        END (int): 종료 바이트(19). 항상 ``0x5a``.
    """
    START= 0
    HEADER= 1
    LENGTH= 2
    INDEX= 3
    ACTION= 4
    DATA0= 5
    DATA1= 6
    DATA2= 7
    DATA3= 8
    DATA4= 9
    DATA5= 10
    DATA6= 11
    DATA7= 12
    DATA8= 13
    DATA9= 14
    DATA10= 15
    DATA11= 16
    DATA12= 17
    DATA13= 18
    END=    19


class BBRETURN:
    """수신용 20바이트 응답 패킷의 필드 위치(인덱스) 상수.

    펌웨어가 명령에 대한 응답으로 돌려주는 20바이트 패킷에서, 어느 자리를
    어떤 의미로 읽어야 하는지 알려줍니다. 송신 패킷의 :class:`BBPACKET` 과
    구조는 같지만, 자리 이름과 그 자리에 들어가는 값의 의미가 다르기 때문에
    별도로 정의되어 있습니다.

    Attributes:
        HEADER_1 (int): 첫 번째 헤더 바이트 위치(0).
        HEADER_2 (int): 두 번째 헤더 바이트 위치(1).
        LENGTH (int): 길이 바이트 위치(2).
        INDEX (int): 응답 대상 명령의 시퀀스 번호 위치(3). 송신 시
            ``BBPACKET.INDEX`` 에 적었던 값과 일치해야 정상 응답입니다.
        ACTION (int): 응답한 :class:`ACTION_CODE` 위치(4).
        DATA1..DATA14 (int): 페이로드 영역(5~18). 명령마다 의미가 다르며,
            16비트 값은 ``low/high`` 두 바이트로 나뉘어 들어옵니다.
        END (int): 종료 바이트 위치(19).
    """
    HEADER_1= 0
    HEADER_2= 1
    LENGTH= 2
    INDEX= 3
    ACTION= 4
    DATA1= 5
    DATA2= 6
    DATA3= 7
    DATA4= 8
    DATA5= 9
    DATA6= 10
    DATA7= 11
    DATA8= 12
    DATA9= 13
    DATA10= 14
    DATA11= 15
    DATA12= 16
    DATA13= 17 # ACTION
    DATA14= 18 # 10
    END=    19    # 13


class BLEUUID:
    """BLE(Bluetooth Low Energy) 모드에서 사용하는 GATT UUID.

    시리얼 대신 BLE 로 연결할 때 :class:`Bitblock` 의 백엔드가 이 UUID 를
    사용해 Nordic UART Service(NUS) 호환 채널을 찾고, ``RX`` 로 명령을
    보낸 뒤 ``TX`` 로 응답을 받습니다.

    Attributes:
        SERVICE_UUID (str): NUS 서비스 UUID.
        CHARACTERISTIC_UUID_RX (str): 호스트→보드 쓰기용 캐릭터리스틱 UUID.
        CHARACTERISTIC_UUID_TX (str): 보드→호스트 알림용 캐릭터리스틱 UUID.
    """
    SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
    CHARACTERISTIC_UUID_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
    CHARACTERISTIC_UUID_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"


class ERROR:
    """사용자에게 노출되는 오류 메시지 모음.

    응답 패킷의 시퀀스 번호가 송신 시 기록한 번호와 다른 경우처럼, 실행은
    계속 가능하지만 사용자가 인지할 필요가 있는 상황에 표준출력으로 찍어
    주는 메시지입니다.
    """
    WRONG_PACKET_INDEX = "🔥 리턴 패킷의 인덱스가 옳지않습니다."
