# -*- coding: utf-8 -*-
"""웹 IDE용으로 이식된 :class:`PoseDetector` 모듈.

원본 위치는 ``helloai-06-dev-2.8/helloai/helloai/ext/pose_detector/pose_detector.py``
입니다. Pyodide 환경에 맞춰 ``from helloai.core.image import Image`` 임포트를
같은 패키지 안의 공용 :class:`Image` shim 사용으로 바꾼 것이 유일한 변경
사항입니다.
"""
import math
import web_cv2 as cv2
import numpy as np
import mediapipe as mp
from collections import deque
from .image import Image


__all__ = ["PoseDetector"]


class PoseDetector:
    """MediaPipe Pose 기반의 전신 포즈 검출기.

    한 프레임에서 33개의 신체 키포인트를 뽑고, 그 키포인트들을 휴리스틱
    규칙으로 분석해 ``"hands_up"``, ``"t_pose"``, ``"sitting"`` 같은 짧은
    포즈 라벨을 자동으로 붙여 줍니다. 학습 모델이 아닌 규칙 기반이므로
    카메라 각도/거리에 따라 결과가 달라질 수 있습니다.

    Args:
        draw_label (bool): ``True`` 면 :meth:`process` 가 좌상단에 분류된
            포즈 라벨을 그립니다. 기본값은 ``True``.

    Attributes:
        pose (str | None): 가장 최근 :meth:`process` 의 포즈 라벨
            (프로퍼티). 검출 실패 시 ``None``.
    """

    def __init__(self, draw_label=True):
        """검출기 인스턴스를 만들고 모델을 초기화합니다.

        Args:
            draw_label (bool): 결과 라벨 자동 표시 여부.
        """
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
        """모델 로드 자리 표시자.

        ``__init__`` 단계에서 이미 ``self.__pose`` 를 만들기 때문에 따로
        할 일이 없습니다. 다른 검출기들과 시그니처를 맞추기 위해서만 존재합니다.
        """
        pass

    def process(self, image, draw=True, line_width=4, circle_radius=6,
                draw_color=[(242, 46, 232), (242, 46, 232)], show_label=None):
        """한 프레임에서 포즈를 검출하고 33개 랜드마크를 반환합니다.

        Args:
            image (Image): 입력 이미지. 내부 frame은 ``FrameRef`` 또는
                일반 numpy ndarray 모두 허용됩니다.
            draw (bool): ``True`` 면 검출된 포즈 스켈레톤을 프레임 위에
                그립니다.
            line_width (int): 스켈레톤 선의 굵기.
            circle_radius (int): 관절 점의 반지름.
            draw_color (list[tuple[int, int, int]]): ``[관절_RGB, 연결선_RGB]``
                두 색을 지정합니다(RGB 튜플). 내부에서 BGR 로 변환해
                MediaPipe ``DrawingSpec`` 에 전달합니다.
            show_label (bool | None): 포즈 라벨 표시 여부를 호출 단위로
                덮어씁니다. ``None`` 이면 생성자의 ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, list[tuple]]: ``(out_image, landmarks)``.

            * ``out_image`` 는 그리기가 반영된 :class:`Image`.
            * ``landmarks`` 는 ``(x_px, y_px, z_px)`` 튜플 33개. 검출 실패
              시 빈 리스트 ``[]`` 를 돌려주며, :attr:`pose` 도 ``None`` 으로
              설정됩니다.
        """
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
        """가장 최근 :meth:`process` 가 분류한 포즈 라벨을 반환합니다.

        Returns:
            str | None: 다음 중 하나, 혹은 분류 실패 시 ``None``.
            ``"lying"``, ``"arms_crossed"``, ``"hands_up"``, ``"t_pose"``,
            ``"left_hand_up"``, ``"right_hand_up"``, ``"squat"``,
            ``"sitting"``, ``"bending"``, ``"standing"``.
        """
        return self.__pose_label

    @staticmethod
    def __angle(p1, p2, p3):
        """세 점이 만드는 ``p2`` 에서의 끼인각(0 ~ 180°)을 계산합니다.

        Args:
            p1: 첫 점 ``(x, y, ...)``.
            p2: 꼭짓점 ``(x, y, ...)``.
            p3: 끝 점 ``(x, y, ...)``.

        Returns:
            float: 0 ~ 180 사이의 각도(도).
        """
        a = math.atan2(p1[1] - p2[1], p1[0] - p2[0])
        b = math.atan2(p3[1] - p2[1], p3[0] - p2[0])
        deg = math.degrees(abs(a - b))
        if deg > 180:
            deg = 360 - deg
        return deg

    def __classify_pose(self):
        """현재 보유한 33개 랜드마크로부터 휴리스틱 규칙에 따라 포즈를 결정합니다.

        규칙은 어깨/손목/엉덩이/무릎/발목의 상대 좌표와 두 어깨 사이 거리
        (``unit``)를 기준으로 합니다. 어떤 규칙에도 들어맞지 않으면
        ``None`` 을 돌려줍니다.

        Returns:
            str | None: :attr:`pose` 와 동일한 라벨 집합 중 하나.
        """
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
        """세 키포인트가 ``p2`` 에서 만드는 각도를 계산하고 시각화합니다.

        교육용으로 관절 각도(예: 팔꿈치, 무릎)를 화면에 직접 보여주고 싶을
        때 사용합니다.

        Args:
            image (Image): 그릴 대상 이미지.
            p1: 첫 점 ``(x, y, z)`` 튜플.
            p2: 꼭짓점 ``(x, y, z)`` 튜플.
            p3: 끝 점 ``(x, y, z)`` 튜플.
            draw (bool): ``True`` 면 세 점과 두 변, 그리고 각도 텍스트를
                프레임 위에 그립니다.

        Returns:
            tuple[float, Image]: ``(angle, out_image)``.
            ``angle`` 은 0 ~ 360 사이의 각도(도)입니다.
        """
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
        """저장된 랜드마크 두 개 사이의 거리를 계산하고 시각화합니다.

        ``p1`` 과 ``p2`` 는 :meth:`process` 가 마지막에 채워둔 내부
        랜드마크 리스트의 **인덱스** 입니다(좌표가 아님). 함수는 두 점을
        잇는 선과 점, 그리고 중간점 표시를 직접 프레임에 그려 줍니다.

        Args:
            p1 (int): 첫 번째 랜드마크 인덱스.
            p2 (int): 두 번째 랜드마크 인덱스.
            image (Image): 그릴 대상 이미지.
            draw (bool): ``True`` 면 선/점/중심점을 그립니다.

        Returns:
            tuple[float, Image, list[int]]: ``(length, out_image, [x1, y1, x2, y2, cx, cy])``.
            ``length`` 는 두 점 사이의 픽셀 거리입니다.
        """
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
        """가비지 컬렉션 시점에 MediaPipe ``Pose`` 인스턴스를 닫습니다.

        해제 중 발생한 예외는 모두 삼킵니다.
        """
        try:
            if self.__pose:
                self.__pose.close()
        except Exception:
            pass
