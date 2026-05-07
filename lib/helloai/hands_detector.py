# -*- coding: utf-8 -*-
"""HandsDetector ported from helloai.ext.hands_detector for the web IDE.

Original: helloai-06-dev-2.8/helloai/helloai/ext/hands_detector/hands_detector.py
The only change vs. the original is replacing the
`from helloai.core.image import Image` import with the minimal Image shim
defined here (sufficient for HandsDetector's own use).
"""
import math
import web_cv2 as cv2
import numpy as np
import mediapipe as mp
from .image import Image


__all__ = ["HandsDetector"]
tip_ids = [4, 8, 12, 16, 20]

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

# RGB; converted to BGR before being handed to mediapipe DrawingSpec.
_RIGHT_HAND_LINE_RGB = (216, 191, 216)  # thistle (light purple)


class HandsDetector:
    def __init__(self, draw_label=True):
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
        pass

    def process(self, image, draw=True, line_width=4, circle_radius=6,
                draw_color=[(255, 0, 0), (192, 192, 192)], show_label=None):
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
                    rgb1 = draw_color[0]
                    # right-hand connection lines use a fixed light-purple shade
                    rgb2 = _RIGHT_HAND_LINE_RGB if label == 'right' else draw_color[1]

                    self.__mp_drawing.draw_landmarks(
                        image,
                        hand_landmarks,
                        self.__mp_hands.HAND_CONNECTIONS,
                        self.__mp_drawing.DrawingSpec(
                            color=(rgb1[2], rgb1[1], rgb1[0]),
                            thickness=line_width,
                            circle_radius=circle_radius,
                        ),
                        self.__mp_drawing.DrawingSpec(
                            color=(rgb2[2], rgb2[1], rgb2[0]),
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
        return self.__sign

    def __find_angle(self, joint):
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
        """Classify a hand sign from landmarks returned by process().

        `lm` is the second return value of process(). Returns a sign ID
        string ('OK', 'v', 'fist', ...) or None when lm is empty or the
        shape matches no known pattern.
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
        try:
            if self.__hands:
                self.__hands.close()
        except Exception:
            pass
