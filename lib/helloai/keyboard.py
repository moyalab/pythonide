# -*- coding: utf-8 -*-
"""``cv2.waitKey()`` 비교에 쓰는 키 코드 상수 모음.

Examples:
    조건문에서 키 코드를 직접 외우지 않고 :class:`Keyboard` 상수로
    비교할 수 있습니다::

        from keyboard import Keyboard

        if cv2.waitKey(1) == Keyboard.ESC:
            break
        if cv2.waitKey(1) == Keyboard.A:
            ...

Note:
    알파벳 상수 ``A`` ~ ``Z`` 는 모두 **소문자 ASCII 코드**(``ord('a')`` ~
    ``ord('z')``)에 매핑되어 있습니다. ``cv2.waitKey()`` 는 Shift 를
    누르지 않은 상태에서 알파벳 키가 눌리면 소문자 코드를 돌려주기
    때문입니다. 대문자 입력을 구분해서 받으려면 ``ord('A')`` 처럼 직접
    비교해야 합니다.

    화살표/F-키/Home/End 처럼 ASCII 에 없는 특수 키는 인쇄 가능한 ASCII
    영역과 충돌하지 않도록 ``0x80`` 이상의 자체 코드로 정의되어 있습니다.
"""


class Keyboard:
    """``cv2.waitKey()`` 반환값과 비교하기 위한 키 코드 상수 컨테이너.

    인스턴스를 만들지 않고 ``Keyboard.ESC`` 처럼 클래스 속성으로 직접
    접근해서 사용합니다. 상수들은 다음과 같이 묶여 있습니다.

    Attributes:
        A, B, ... Z (int): 알파벳 키. 소문자 ASCII 코드(``ord('a')`` 등).
        NUM_0, NUM_1, ... NUM_9 (int): 숫자 키 ``'0'`` ~ ``'9'`` 의 ASCII 코드.
        BACKSPACE, TAB, ENTER, ESC, SPACE (int): 자주 쓰이는 ASCII 제어 코드.
        COMMA, PERIOD, SLASH, BACKSLASH, SEMICOLON, QUOTE,
            LEFT_BRACKET, RIGHT_BRACKET, MINUS, EQUAL, BACKTICK (int):
            구두점/기호 키의 ASCII 코드.
        ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN (int):
            화살표 키. ASCII 와 충돌을 피하려고 ``0x80`` ~ ``0x83`` 의
            커스텀 코드로 매핑되어 있습니다.
        F1 ~ F12 (int): 펑션 키. ``0x90`` ~ ``0x9B`` 의 커스텀 코드.
        HOME, END, PAGE_UP, PAGE_DOWN, INSERT, DELETE (int):
            내비게이션/편집 특수 키. ``0xA0`` ~ ``0xA5`` 의 커스텀 코드.
    """

    # --- Letters (lowercase ASCII) ---
    A = ord('a')
    B = ord('b')
    C = ord('c')
    D = ord('d')
    E = ord('e')
    F = ord('f')
    G = ord('g')
    H = ord('h')
    I = ord('i')
    J = ord('j')
    K = ord('k')
    L = ord('l')
    M = ord('m')
    N = ord('n')
    O = ord('o')
    P = ord('p')
    Q = ord('q')
    R = ord('r')
    S = ord('s')
    T = ord('t')
    U = ord('u')
    V = ord('v')
    W = ord('w')
    X = ord('x')
    Y = ord('y')
    Z = ord('z')

    # --- Digits ---
    NUM_0 = ord('0')
    NUM_1 = ord('1')
    NUM_2 = ord('2')
    NUM_3 = ord('3')
    NUM_4 = ord('4')
    NUM_5 = ord('5')
    NUM_6 = ord('6')
    NUM_7 = ord('7')
    NUM_8 = ord('8')
    NUM_9 = ord('9')

    # --- Control / common ASCII ---
    BACKSPACE = 8
    TAB = 9
    ENTER = 13
    ESC = 27
    SPACE = 32

    # --- Punctuation (ASCII) ---
    COMMA = ord(',')
    PERIOD = ord('.')
    SLASH = ord('/')
    BACKSLASH = ord('\\')
    SEMICOLON = ord(';')
    QUOTE = ord("'")
    LEFT_BRACKET = ord('[')
    RIGHT_BRACKET = ord(']')
    MINUS = ord('-')
    EQUAL = ord('=')
    BACKTICK = ord('`')

    # --- Arrow keys (custom 0x80+) ---
    ARROW_LEFT = 0x80
    ARROW_UP = 0x81
    ARROW_RIGHT = 0x82
    ARROW_DOWN = 0x83

    # --- Function keys (custom 0x90+) ---
    F1 = 0x90
    F2 = 0x91
    F3 = 0x92
    F4 = 0x93
    F5 = 0x94
    F6 = 0x95
    F7 = 0x96
    F8 = 0x97
    F9 = 0x98
    F10 = 0x99
    F11 = 0x9A
    F12 = 0x9B

    # --- Navigation / editing (custom 0xA0+) ---
    HOME = 0xA0
    END = 0xA1
    PAGE_UP = 0xA2
    PAGE_DOWN = 0xA3
    INSERT = 0xA4
    DELETE = 0xA5
