# -*- coding: utf-8 -*-
"""Key code constants for cv2.waitKey().

Usage:
    from keyboard import Keyboard
    if cv2.waitKey(1) == Keyboard.ESC:
        break
    if cv2.waitKey(1) == Keyboard.A:
        ...

Letter constants (A..Z) map to lowercase ASCII codes since pressing the key
without Shift returns ord('a')..ord('z'). For uppercase use ord('A').
Special keys (arrows, F-keys, Home/End/...) use custom byte codes in 0x80+
so they don't clash with printable ASCII.
"""


class Keyboard:
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
