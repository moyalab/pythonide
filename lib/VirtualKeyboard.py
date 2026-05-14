# -*- coding: utf-8 -*-
"""툴바 가상 키보드 입력을 동기적으로 받아 오는 단독 모듈.

Examples:
    ``import VirtualKeyboard as kb`` 한 줄로 가져와 사용한다::

        import VirtualKeyboard as kb

        while True:
            key = kb.wait_key(0)
            if key == kb.ESC:
                break
            elif key == kb.ARROW_UP:
                print("up")

Note:
    이 모듈은 ``cv2.waitKey()`` 와 **독립된 큐**를 사용한다. imshow 창이
    열려 있어도 두 입력이 섞이지 않는다. 알파벳 상수 ``A`` ~ ``Z`` 는
    소문자 ASCII 코드(``ord('a')`` ~ ``ord('z')``)에 매핑되어 있다.
"""

import _vkeyBridge


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

# --- Arrow keys (custom 0x80+) ---
ARROW_LEFT = 0x80
ARROW_UP = 0x81
ARROW_RIGHT = 0x82
ARROW_DOWN = 0x83


def wait_key(ms=0):
    """가상 키보드의 다음 키를 기다린다.

    Args:
        ms (int): 대기 시간(ms). ``0`` 이하이면 키가 눌릴 때까지 무한 대기.

    Returns:
        int: 키 코드. 타임아웃이면 ``-1``.
    """
    return int(_vkeyBridge.waitKey(int(ms)))
