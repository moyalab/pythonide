# -*- coding: utf-8 -*-
"""PoseDetector ported from helloai.ext.pose_detector for the web IDE.

Original: helloai-06-dev-2.8/helloai/helloai/ext/pose_detector/pose_detector.py
Only change: replaced `from helloai.core.image import Image` with the
shared `_helloai_image` shim used by the other detector ports.
"""
import math
import web_cv2 as cv2
import numpy as np
import mediapipe as mp
from collections import deque
from .image import Image


__all__ = ["PoseDetector"]


class PoseDetector:
    def __init__(self, draw_label=True):
        self.__mp_drawing = mp.solutions.drawing_utils
        self.__mp_pose = mp.solutions.pose
        self.__pose = self.__mp_pose.Pose(
            min_detection_confidence=0.5, min_tracking_confidence=0.5
        )
        self.__landmarks = []
        self.__pose_label = None
        self._draw_label = bool(draw_label)
        self.load_model()

    def load_model(self):
        pass

    def process(self, image, draw=True, line_width=4, circle_radius=6,
                draw_color=[(242, 46, 232), (242, 46, 232)], show_label=None):
        image = image.frame
        if not hasattr(image, "_token"):
            image = image.copy()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        try:
            image.flags.writeable = False
        except Exception:
            pass
        results = self.__pose.process(image)

        try:
            image.flags.writeable = True
        except Exception:
            pass
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            ret = []
            for id, lm in enumerate(results.pose_landmarks.landmark):
                h, w, c = image.shape
                cx, cy, cz = int(lm.x * w), int(lm.y * h), int(lm.z * w)
                ret.append((cx, cy, cz))

            self.__landmarks = ret
            self.__pose_label = self.__classify_pose()
            if draw:
                rgb1 = draw_color[0]
                rgb2 = draw_color[1]

                self.__mp_drawing.draw_landmarks(
                    image,
                    results.pose_landmarks,
                    self.__mp_pose.POSE_CONNECTIONS,
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
        else:
            ret = []
            self.__landmarks = ret
            self.__pose_label = None

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and show and self.__pose_label:
            cv2.putText(image, self.__pose_label, (10, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
            cv2.putText(image, self.__pose_label, (10, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)

        return Image(image), self.__landmarks

    @property
    def pose(self):
        return self.__pose_label

    @staticmethod
    def __angle(p1, p2, p3):
        a = math.atan2(p1[1] - p2[1], p1[0] - p2[0])
        b = math.atan2(p3[1] - p2[1], p3[0] - p2[0])
        deg = math.degrees(abs(a - b))
        if deg > 180:
            deg = 360 - deg
        return deg

    def __classify_pose(self):
        lms = self.__landmarks
        if len(lms) < 33:
            return None

        L_SH, R_SH = lms[11], lms[12]
        L_WR, R_WR = lms[15], lms[16]
        L_HP, R_HP = lms[23], lms[24]
        L_KN, R_KN = lms[25], lms[26]
        L_AN, R_AN = lms[27], lms[28]

        # screen-frame wrist mapping (mirror-agnostic): smaller x = screen left
        if L_WR[0] <= R_WR[0]:
            scr_l_wr, scr_r_wr = L_WR, R_WR
        else:
            scr_l_wr, scr_r_wr = R_WR, L_WR

        sh_y = (L_SH[1] + R_SH[1]) / 2
        hp_y = (L_HP[1] + R_HP[1]) / 2
        kn_y = (L_KN[1] + R_KN[1]) / 2
        an_y = (L_AN[1] + R_AN[1]) / 2
        unit = max(1, abs(L_SH[0] - R_SH[0]))

        if abs(sh_y - hp_y) < unit * 0.5 and abs(hp_y - kn_y) < unit * 0.6:
            return "lying"

        if (abs(L_WR[0] - R_SH[0]) < unit * 0.5 and
                abs(R_WR[0] - L_SH[0]) < unit * 0.5 and
                L_WR[1] > sh_y and R_WR[1] > sh_y):
            return "arms_crossed"

        if L_WR[1] < L_SH[1] and R_WR[1] < R_SH[1]:
            return "hands_up"

        if (abs(L_WR[1] - L_SH[1]) < unit * 0.3 and
                abs(R_WR[1] - R_SH[1]) < unit * 0.3 and
                abs(L_WR[0] - L_SH[0]) > unit * 0.7 and
                abs(R_WR[0] - R_SH[0]) > unit * 0.7):
            return "t_pose"

        left_up = scr_l_wr[1] < sh_y - unit * 0.2
        right_up = scr_r_wr[1] < sh_y - unit * 0.2
        if left_up and not right_up:
            return "left_hand_up"
        if right_up and not left_up:
            return "right_hand_up"

        if hp_y >= kn_y - unit * 0.2:
            return "squat"

        knee_angle = (self.__angle(L_HP, L_KN, L_AN) +
                      self.__angle(R_HP, R_KN, R_AN)) / 2
        if 60 <= knee_angle <= 130:
            return "sitting"

        if abs(sh_y - hp_y) < unit * 0.9:
            return "bending"

        if sh_y < hp_y < kn_y < an_y:
            return "standing"

        return None

    def calc_angle(self, image, p1, p2, p3, draw=True):
        image = image.frame
        x1, y1, _ = p1
        x2, y2, _ = p2
        x3, y3, _ = p3

        # Calculate the Angle
        angle = math.degrees(
            math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2)
        )
        if angle < 0:
            angle += 360

        # Draw
        if draw:
            image = cv2.line(image, (x1, y1), (x2, y2), (255, 255, 255), 3)
            image = cv2.line(image, (x3, y3), (x2, y2), (255, 255, 255), 3)
            image = cv2.circle(image, (x1, y1), 10, (0, 0, 255), cv2.FILLED)
            image = cv2.circle(image, (x1, y1), 15, (0, 0, 255), 2)
            image = cv2.circle(image, (x2, y2), 10, (0, 0, 255), cv2.FILLED)
            image = cv2.circle(image, (x2, y2), 15, (0, 0, 255), 2)
            image = cv2.circle(image, (x3, y3), 10, (0, 0, 255), cv2.FILLED)
            image = cv2.circle(image, (x3, y3), 15, (0, 0, 255), 2)
            image = cv2.putText(
                image,
                str(int(angle)),
                (x2 - 50, y2 + 50),
                cv2.FONT_HERSHEY_PLAIN,
                2,
                (0, 0, 255),
                2,
            )
        return angle, Image(image)

    def distance(self, p1, p2, image, draw=True):
        image = image.frame
        r = 15
        t = 3
        x1, y1 = self.__landmarks[p1][1:3]
        x2, y2 = self.__landmarks[p2][1:3]
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
            if self.__pose:
                self.__pose.close()
        except Exception:
            pass
