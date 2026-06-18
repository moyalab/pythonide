# -*- coding: utf-8 -*-
"""웹 IDE용으로 이식된 :class:`HandsDetector` 모듈.

원본 위치는 ``helloai-06-dev-2.8/helloai/helloai/ext/hands_detector/hands_detector.py``
입니다. ``from helloai.core.image import Image`` 임포트를 같은 패키지의
공용 :class:`Image` shim 사용으로 바꾼 것이 유일한 변경 사항입니다.

손 검출 외에도 손가락 펴짐 패턴을 12종 사전(:data:`_PATTERN_TO_SIGN`)과
대조해 ``"thumbs_up"``, ``"v"``, ``"OK"`` 같은 짧은 사인 라벨을 자동으로
붙여 줍니다(휴리스틱).
"""
import math
import web_cv2 as cv2
import numpy as np
import mediapipe as mp
from .image import Image


__all__ = ["HandsDetector"]
tip_ids = [4, 8, 12, 16, 20]
"""손가락 끝 마디(엄지/검지/중지/약지/소지) 랜드마크 인덱스."""

_PATTERN_TO_SIGN = {
    (0, 0, 0, 0, 0): 'fist',
    (1, 1, 1, 1, 1): 'open_hand',
    (1, 0, 0, 0, 0): 'thumbs_up',
    (0, 1, 0, 0, 0): 'pointing',
    (0, 1, 1, 0, 0): 'v',
    (0, 1, 1, 1, 0): 'three',
    (0, 1, 1, 1, 1): 'four',
    (0, 0, 0, 0, 1): 'pinky',
    (0, 1, 0, 0, 1): 'rock',
    (1, 0, 0, 0, 1): 'call_me',
    (1, 1, 0, 0, 1): 'ily',
    (1, 1, 0, 0, 0): 'L',
}
"""손가락 펴짐 5비트 패턴 → 사인 라벨 매핑.

비트 순서는 ``(엄지, 검지, 중지, 약지, 소지)`` 이며 ``1`` 이 펴진 상태,
``0`` 이 굽은 상태를 뜻합니다. 이 사전에 없는 패턴은 알 수 없는 사인으로
처리되어 ``None`` 이 반환됩니다.
"""

# RGB; converted to BGR before being handed to mediapipe DrawingSpec.
# The right hand uses fixed blue shades for both joint points and connection
# lines so it is clearly distinguishable from the left hand (which is drawn
# with draw_color, defaulting to red shades).
_RIGHT_HAND_POINT_RGB = (0, 90, 255)    # blue (joint points)
_RIGHT_HAND_LINE_RGB = (150, 190, 255)  # light blue (connection lines)
"""오른손 점/연결선 색(파랑 계열, RGB).

왼손(빨강 계열, ``draw_color``)과 확실히 구분되도록 오른손에는 항상 파랑
계열을 씁니다 — 점은 진한 파랑, 연결선은 연한 파랑. MediaPipe
``DrawingSpec`` 에 넘기기 전에 BGR 로 변환됩니다.
"""


class HandsDetector:
    """MediaPipe Hands 기반의 양손 검출기 + 사인 분류기.

    한 프레임에서 최대 2개의 손을 찾고, 각 손의 21개 키포인트를 픽셀 좌표로
    돌려줍니다. 손가락 펴짐 패턴과 :data:`_PATTERN_TO_SIGN` 매핑을 이용해
    자동으로 짧은 사인 라벨을 붙여 줍니다(``"open_hand"``, ``"v"``, ``"OK"``
    등).

    Args:
        draw_label (bool): ``True`` 면 :meth:`process` 가 손목 위에 사인
            라벨 텍스트를 그립니다. 기본값은 ``False`` — 영상을 좌우/상하
            반전하면 라벨 글자도 함께 반전되어 읽기 어렵기 때문에 기본적으로
            끕니다. 필요하면 ``True`` 로 켤 수 있습니다.

    Attributes:
        sign (dict[str, str | None]): ``{'left': sign_id, 'right': sign_id}``.
            가장 최근 :meth:`process` 에서 인식한 양손 사인. 검출되지 않은
            쪽은 ``None``.
    """

    def __init__(self, draw_label=False):
        """검출기 인스턴스를 만들고 모델을 초기화합니다.

        Args:
            draw_label (bool): 사인 라벨 자동 표시 여부. 기본값 ``False``
                (영상 반전 시 라벨 글자가 함께 반전되는 문제를 피하기 위함).
        """
        self.__mp_drawing = mp.solutions.drawing_utils
        self.__mp_hands = mp.solutions.hands
        self.__hands = self.__mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.__landmarks = []
        self.__handedness = []
        self.__angles = []
        self.__draw = True
        self.__sign = {'left': None, 'right': None}
        self._draw_label = bool(draw_label)

    def load_model(self):
        """모델 로드 자리 표시자.

        ``__init__`` 에서 이미 ``self.__hands`` 를 만들어 두므로 따로 할
        일이 없습니다. 다른 검출기들과 시그니처를 맞추기 위해 존재합니다.
        """
        pass

    def process(self, image, draw=True, line_width=4, circle_radius=6,
                draw_color=[(255, 0, 0), (255, 140, 140)], show_label=None):
        """한 프레임에서 양손을 검출하고 키포인트와 사인을 반환합니다.

        Args:
            image (Image): 입력 이미지(거울 모드 카메라 입력 가정).
            draw (bool): ``True`` 면 손 스켈레톤과 사인 라벨을 프레임 위에
                그립니다.
            line_width (int): 연결선/점 굵기.
            circle_radius (int): 관절 점 반지름.
            draw_color (list[tuple[int, int, int]]): **왼손**의
                ``[관절_RGB, 연결선_RGB]``. 기본값은 빨강 계열(점
                ``(255, 0, 0)``, 선 ``(255, 140, 140)``). 내부에서 BGR 로
                변환해 그립니다. 오른손은 좌우 구분을 위해 항상 파랑 계열
                고정색(:data:`_RIGHT_HAND_POINT_RGB` /
                :data:`_RIGHT_HAND_LINE_RGB`)을 쓰며 이 인자의 영향을
                받지 않습니다.
            show_label (bool | None): 사인 라벨 표시 여부를 호출 단위로
                덮어씁니다. ``None`` 이면 생성자의 ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, list[dict]]: ``(out_image, results)``.

            * ``out_image`` 는 그리기가 반영된 :class:`Image`.
            * ``results`` 는 검출된 손 수만큼의 dict 리스트. 각 dict 는
              ``{'handedness': 'left'|'right', 'landmarks': [(x,y,z), ...]}``
              형태이며, 손이 검출되지 않으면 빈 리스트 ``[]``.
        """
        self.__draw = draw

        image = image.frame
        h, w, c = image.shape

        # 입력되는 이미지가 거울 형식
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        try:
            image.flags.writeable = False
        except Exception:
            pass
        results = self.__hands.process(image)

        try:
            image.flags.writeable = True
        except Exception:
            pass
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        self.__landmarks = []
        self.__handedness = []

        if results.multi_hand_landmarks and results.multi_handedness:
            for hd, hand_landmarks in zip(
                results.multi_handedness, results.multi_hand_landmarks
            ):
                label = hd.classification[0].label.lower()  # 'right' | 'left'

                lmks = []
                joint = np.zeros((21, 3))

                if self.__draw:
                    # Left hand uses draw_color [points, lines]; the right hand
                    # uses fixed blue shades so the two hands are clearly
                    # distinct in both joint points and connection lines.
                    if label == 'right':
                        point_rgb, line_rgb = _RIGHT_HAND_POINT_RGB, _RIGHT_HAND_LINE_RGB
                    else:
                        point_rgb, line_rgb = draw_color[0], draw_color[1]

                    self.__mp_drawing.draw_landmarks(
                        image,
                        hand_landmarks,
                        self.__mp_hands.HAND_CONNECTIONS,
                        self.__mp_drawing.DrawingSpec(
                            color=(point_rgb[2], point_rgb[1], point_rgb[0]),
                            thickness=line_width,
                            circle_radius=circle_radius,
                        ),
                        self.__mp_drawing.DrawingSpec(
                            color=(line_rgb[2], line_rgb[1], line_rgb[0]),
                            thickness=line_width,
                            circle_radius=circle_radius,
                        ),
                    )

                for id, lm in enumerate(hand_landmarks.landmark):
                    px, py, pz = (
                        int(lm.x * w),
                        int(lm.y * h),
                        int(lm.z * w),
                    )
                    lmks.append((px, py, pz))
                    joint[id] = (px, py, pz)

                self.__find_angle(joint)

                self.__landmarks.append(lmks)
                self.__handedness.append(label)

        result = []
        self.__sign = {'left': None, 'right': None}
        for label, lmks in zip(self.__handedness, self.__landmarks):
            sign_id = self.recognize_sign(lmks)
            result.append({'handedness': label, 'landmarks': lmks})
            if label in ('left', 'right'):
                self.__sign[label] = sign_id

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and show:
            for label, lmks in zip(self.__handedness, self.__landmarks):
                sign_id = self.__sign.get(label)
                if not sign_id or len(lmks) == 0:
                    continue
                wx, wy, _ = lmks[0]
                text = "{}: {}".format(label, sign_id)
                ty = max(wy - 20, 20)
                cv2.putText(image, text, (wx, ty),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 5)
                cv2.putText(image, text, (wx, ty),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        return Image(image), result

    @property
    def sign(self):
        """가장 최근 :meth:`process` 의 양손 사인 결과를 반환합니다.

        Returns:
            dict[str, str | None]: ``{'left': sign_id, 'right': sign_id}``
            형태. 검출되지 않은 손은 ``None``, 매핑되지 않은 손가락 패턴
            역시 ``None``.
        """
        return self.__sign

    def __find_angle(self, joint):
        """21개 관절로부터 15개의 핑거 마디 각도를 계산해 보관합니다.

        ``self.__angles`` 에 결과(numpy 배열, 도 단위) 를 채워 둡니다.
        손가락 펴짐 판단에 직접 쓰이지는 않지만, 추가 분석을 위해 계산해
        둡니다.

        Args:
            joint (numpy.ndarray): ``(21, 3)`` 모양의 관절 좌표 배열.

        Returns:
            list[float]: 계산된 각도 리스트(도 단위).
        """
        self.__angles = []
        v1 = joint[
            [0, 1, 2, 3, 0, 5, 6, 7, 0, 9, 10, 11, 0, 13, 14, 15, 0, 17, 18, 19], :
        ]
        v2 = joint[
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], :
        ]
        v = v2 - v1
        # Avoid divide-by-zero on stationary joints.
        norms = np.linalg.norm(v, axis=1)
        norms[norms == 0] = 1.0
        v = v / norms[:, np.newaxis]

        angle = np.arccos(
            np.einsum(
                "nt,nt->n",
                v[[0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18], :],
                v[[1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19], :],
            )
        )
        self.__angles = np.degrees(angle)
        return self.__angles.tolist()

    def fingers_up(self, side='right'):
        """지정된 손의 손가락 펴짐 상태를 5비트 리스트로 돌려줍니다.

        엄지손가락은 x축 비교(좌우), 나머지 네 손가락은 y축 비교(상하)로
        판정합니다.

        Args:
            side (str): ``'left'`` 또는 ``'right'`` (대소문자 무관).
                알 수 없는 값이거나 해당 손이 검출되지 않은 경우
                ``[0, 0, 0, 0, 0]`` 을 돌려줍니다.

        Returns:
            list[int]: ``[엄지, 검지, 중지, 약지, 소지]`` 순서의 5비트 리스트.
            ``1`` 이 펴짐, ``0`` 이 굽음.
        """
        side = (side or '').lower()
        if side not in ('left', 'right'):
            return [0, 0, 0, 0, 0]

        lmlist = None
        for label, lmks in zip(self.__handedness, self.__landmarks):
            if label == side:
                lmlist = lmks
                break
        if not lmlist:
            return [0, 0, 0, 0, 0]

        fingers = []
        # 엄지 x값 비교
        if lmlist[tip_ids[0]][1] < lmlist[tip_ids[0] - 1][1]:
            fingers.append(1)
        else:
            fingers.append(0)

        # y값 비교
        for i in range(1, 5):
            if lmlist[tip_ids[i]][2] < lmlist[tip_ids[i] - 2][2]:
                fingers.append(1)
            else:
                fingers.append(0)
        return fingers

    def recognize_sign(self, lm):
        """손가락 펴짐 패턴을 :data:`_PATTERN_TO_SIGN` 과 비교해 사인 ID를 돌려줍니다.

        ``OK`` 사인은 엄지/검지가 닿은 핀치 동작이라 엄지 비트가 신뢰할 수
        없습니다. 이를 위해 OK 후보(중지·약지·소지가 모두 펴짐) 일 때는
        엄지/검지 거리도 함께 검사합니다.

        Args:
            lm (Sequence[tuple]): :meth:`process` 가 돌려준 한 손의
                21개 키포인트 좌표. 길이가 21 미만이면 ``None`` 반환.

        Returns:
            str | None: ``'OK'``, ``'thumbs_up'``, ``'v'``, ``'fist'`` 등의
            사인 ID. 매칭되는 패턴이 없으면 ``None``.
        """
        if not lm or len(lm) < 21:
            return None

        # 5-bit pattern; mirrors fingers_up()'s indexing for consistency.
        # Thumb compares index [1]; other fingers compare index [2].
        thumb = 1 if lm[4][1] < lm[3][1] else 0
        fingers = [thumb]
        for i in range(1, 5):
            tip = tip_ids[i]
            fingers.append(1 if lm[tip][2] < lm[tip - 2][2] else 0)

        # OK first: pinch makes the thumb bit unreliable, so checking
        # generic patterns first could mismatch (e.g. as 'three').
        if fingers[2] == 1 and fingers[3] == 1 and fingers[4] == 1:
            if self.__is_thumb_index_pinch(lm):
                return 'OK'

        return _PATTERN_TO_SIGN.get(tuple(fingers))

    def __is_thumb_index_pinch(self, lm, threshold=0.35):
        """엄지 끝과 검지 끝이 닿아 있는지(핀치) 판정합니다.

        손 크기에 비례한 정규화 거리를 기준으로 하므로, 카메라와의 거리에
        영향을 덜 받습니다.

        Args:
            lm (Sequence[tuple]): 한 손의 21개 키포인트.
            threshold (float): 손 크기 대비 임계값(기본 0.35). 작을수록
                "더 가까이 붙어야" 핀치로 인정합니다.

        Returns:
            bool: 핀치 동작이면 ``True``, 아니면 ``False``.
        """
        thumb_tip = lm[4]
        index_tip = lm[8]
        wrist = lm[0]
        mid_mcp = lm[9]

        d = math.hypot(thumb_tip[0] - index_tip[0],
                       thumb_tip[1] - index_tip[1])
        hand_size = math.hypot(mid_mcp[0] - wrist[0],
                               mid_mcp[1] - wrist[1])
        if hand_size == 0:
            return False
        return (d / hand_size) < threshold

    def distance(self, p1, p2, image, draw=True):
        """두 키포인트 좌표 사이의 거리를 계산하고 시각화합니다.

        :class:`PoseDetector.distance` 와 달리 ``p1``, ``p2`` 는 **인덱스가
        아니라** 이미 꺼낸 ``(x, y, z)`` 튜플을 그대로 받습니다.

        Args:
            p1: 첫 점 ``(x, y, z)`` 튜플.
            p2: 두 번째 점 ``(x, y, z)`` 튜플.
            image (Image): 그릴 대상 이미지.
            draw (bool): ``True`` 면 선/점/중심점을 프레임 위에 그립니다.

        Returns:
            tuple[float, Image, list[int]]: ``(length, out_image, [x1, y1, x2, y2, cx, cy])``.
            ``length`` 는 두 점 사이의 픽셀 거리입니다.
        """
        image = image.frame
        r = 10
        t = 3
        x1, y1, _ = p1
        x2, y2, _ = p2
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

        if draw:
            cv2.line(image, (x1, y1), (x2, y2), (255, 0, 255), t)
            cv2.circle(image, (x1, y1), r, (255, 0, 255), cv2.FILLED)
            cv2.circle(image, (x2, y2), r, (255, 0, 255), cv2.FILLED)
            cv2.circle(image, (cx, cy), r, (0, 0, 255), cv2.FILLED)
        length = math.hypot(x2 - x1, y2 - y1)

        return length, Image(image), [x1, y1, x2, y2, cx, cy]

    def __del__(self):
        """가비지 컬렉션 시점에 MediaPipe ``Hands`` 인스턴스를 닫습니다.

        해제 중 발생한 예외는 모두 삼킵니다.
        """
        try:
            if self.__hands:
                self.__hands.close()
        except Exception:
            pass
