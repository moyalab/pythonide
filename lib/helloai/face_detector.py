# -*- coding: utf-8 -*-
"""FaceDetector ported from helloai.ext.face_detector for the web IDE.

Original: helloai-06-dev-2.8/helloai/helloai/ext/face_detector/face_detector.py
The only changes vs. the original are:
  - `from helloai.core.image import Image` → `from _helloai_image import Image`
  - guard `image.flags.writeable` (FrameRef has no real flags object)
  - guard `frame.copy()` (FrameRef.copy returns self)
"""
import copy
import web_cv2 as cv2
import mediapipe as mp
from .image import Image


__all__ = ["FaceDetector"]

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

# 색상 설정을 위해 DrawingSpec 객체 생성
tesselation_spec = mp_drawing.DrawingSpec(color=(192, 192, 192), thickness=1)
contours_spec = mp_drawing.DrawingSpec(color=(192, 192, 192), thickness=1)
iris_spec = mp_drawing.DrawingSpec(color=(192, 192, 192), thickness=1)

#  인덱스 번호 참조
#  https://www.kaggle.com/discussions/questions-and-answers/393052
LANDMARK_INDICES_68 = [
    # FACEMESH_FACE_OVAL
    10, 356, 152, 127,

    # FACEMESH_RIGHT_EYEBROW (미디어파이프는 우리와 왼쪽 오른쪽이 반대임.)
    46, 52, 55,

    # FACEMESH_LEFT_EYEBROW
    285, 282, 276,

    # FACEMESH_LEFT_EYE (미디어파이프는 우리와 왼쪽 오른쪽이 반대임.)
    33, 159, 155, 145,

    # FACEMESH_RIGHT_EYE
    382, 386, 263, 374,
    # NOSE
    5, 4,
    # FACEMESH_LIPS
    61, 13, 409, 14,
]


class FaceDetector:
    def __init__(self, min_detection_confidence=0.5, expressions=False, draw_label=True):
        self.__is_model_loaded = False
        self.__face = None
        self.__landmarks = None
        self.__blendshapes = None
        self.__min_detection_confidence = min_detection_confidence
        self.__expressions_enabled = bool(expressions)
        self.__draw = True
        self._draw_label = bool(draw_label)
        self.load_model()

    @property
    def landmarks_full(self):
        # 478개 raw landmarks. process() 가 이미 LANDMARK_INDICES_68(22개)으로
        # 필터한 list를 반환하므로, 학습용 FACE_KEY_INDICES(82개)로 다시
        # 골라야 하는 FaceClassifier가 이 프로퍼티로 raw 전체에 접근한다.
        return self.__landmarks

    @property
    def blendshapes(self):
        # dict[str, float] | None — 가장 최근 process() 의 52개 표정 계수.
        # expressions=False 로 만든 검출기거나, 직전 프레임에 얼굴이 잡히지
        # 않았으면 None.
        return self.__blendshapes

    @property
    def expression(self):
        # _neutral 을 제외한 최상위 blendshape 카테고리 이름.
        # (예: "mouthSmileLeft", "browDownLeft", "jawOpen")
        # blendshapes 가 비어 있거나 모두 _neutral 이면 None.
        bs = self.__blendshapes
        if not bs:
            return None
        candidates = [(n, s) for n, s in bs.items() if n != "_neutral"]
        if not candidates:
            return None
        return max(candidates, key=lambda kv: kv[1])[0]

    @property
    def expression_score(self):
        bs = self.__blendshapes
        if not bs:
            return 0.0
        candidates = [s for n, s in bs.items() if n != "_neutral"]
        return max(candidates) if candidates else 0.0

    def load_model(self):
        if not self.__is_model_loaded:
            self.__face = mp_face_mesh.FaceMesh(
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=self.__min_detection_confidence,
                min_tracking_confidence=self.__min_detection_confidence,
                output_face_blendshapes=self.__expressions_enabled,
            )
            self.__is_model_loaded = True

    def process(self, img, draw=True, show_label=None):
        self.__landmarks = []
        self.__blendshapes = None

        if not self.__is_model_loaded:
            print("모델이 준비되지 않았습니다")
            return img, []

        self.__draw = draw
        image = img.frame
        # FrameRef.copy returns self (drawing ops are queue-based on the same
        # token); for real ndarrays, .copy() makes a duplicate as in OpenCV.
        if hasattr(image, "_token"):
            pass
        else:
            image = image.copy()

        # 검출
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.__face.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # 얼굴을 검출하지 못했을 경우
        if not results.multi_face_landmarks:
            return img, []

        bs_per_face = getattr(results, "multi_face_blendshapes", None)
        if bs_per_face:
            self.__blendshapes = bs_per_face[0]

        # 이미지 너비, 높이
        image_width, image_height = image.shape[1], image.shape[0]
        landmark_point = []

        for face_landmarks in results.multi_face_landmarks:
            # 각 포인트 처리
            for landmark in face_landmarks.landmark:
                x_px = int(landmark.x * image_width)
                y_px = int(landmark.y * image_height)
                z_px = round(landmark.z * image_width)
                self.__landmarks.append((x_px, y_px, z_px))

            # 각 얼굴마다 그리기
            if draw:
                image, _ = self.__draw_landmarks(image, face_landmarks)

        # 필요한 포인트만 리턴한다면 여기서 필터링
        selected_landmarks = [self.__landmarks[i] for i in LANDMARK_INDICES_68]

        landmark_point = copy.deepcopy(self.__landmarks)

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and show:
            label = self.expression
            if label:
                cv2.putText(image, label, (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
                cv2.putText(image, label, (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)

        return Image(image), selected_landmarks

    def __calc_bounding_rect(self, image, bounding_box, draw):
        pass

    def __draw_landmarks(self, image, face_landmarks):

        image_width, image_height = image.shape[1], image.shape[0]

        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_TESSELATION,
            landmark_drawing_spec=None,
            connection_drawing_spec=tesselation_spec,
        )
        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_CONTOURS,
            landmark_drawing_spec=None,
            connection_drawing_spec=contours_spec,
        )

        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks,
            connections=mp_face_mesh.FACEMESH_IRISES,
            landmark_drawing_spec=None,
            connection_drawing_spec=iris_spec,
        )

        for idx in LANDMARK_INDICES_68:
            x = int(face_landmarks.landmark[idx].x * image_width)
            y = int(face_landmarks.landmark[idx].y * image_height)
            cv2.circle(image, (x, y), 4, (0, 0, 255), -1)
            cv2.circle(image, (x, y), 4, (255, 255, 255), 2)

        return image, []
