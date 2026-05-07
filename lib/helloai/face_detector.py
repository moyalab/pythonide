# -*- coding: utf-8 -*-
"""웹 IDE용으로 이식된 :class:`FaceDetector` 모듈.

원본 위치는 ``helloai-06-dev-2.8/helloai/helloai/ext/face_detector/face_detector.py``
이며, Pyodide 환경에 맞춰 다음 부분만 변경되었습니다.

  * ``from helloai.core.image import Image`` → 같은 패키지 안의 공용
    :class:`Image` shim 사용.
  * ``image.flags.writeable`` 접근을 우회 (FrameRef는 진짜 ``flags``
    객체를 갖고 있지 않음).
  * ``frame.copy()`` 동작 차이 보호 (FrameRef.copy 는 자기 자신을
    돌려주므로 별도 복사가 필요 없음).
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
"""학습/검출 시 외부에 노출하는 22개 핵심 키포인트 인덱스 (478개 풀셋 기준).

전통적 68-point 랜드마크 모델과 비슷한 의미 영역(얼굴 외곽 / 양쪽 눈썹 /
양쪽 눈 / 코 / 입술)에서 골라 둔 부분집합입니다. MediaPipe FaceMesh의
좌우 표기는 우리 시점과 반대라는 점에 유의하세요.
"""


class FaceDetector:
    """MediaPipe FaceMesh 기반의 얼굴 검출/그리기 도우미 클래스.

    한 프레임에 하나의 얼굴(``max_num_faces=1``)만 검출하며, 478개의 풀
    랜드마크 중 22개 핵심 인덱스(:data:`LANDMARK_INDICES_68`)만 골라
    호출자에게 돌려줍니다. ``expressions=True`` 로 만들면 52개의 얼굴
    표정 계수(blendshape)도 함께 받아오며, :attr:`expression` 으로 가장
    강한 표정 한 가지를 즉시 조회할 수 있습니다.

    Args:
        min_detection_confidence (float): 검출/추적 신뢰도 임계값
            (0.0 ~ 1.0). 같은 값이 detection 과 tracking 모두에 사용됩니다.
            기본값 0.5.
        expressions (bool): ``True`` 면 ``output_face_blendshapes`` 가
            활성화되어 :attr:`blendshapes`, :attr:`expression`,
            :attr:`expression_score` 가 채워집니다. 기본값 ``False``.
        draw_label (bool): ``True`` 면 :meth:`process` 가 좌상단에 가장
            강한 표정 라벨을 그립니다. ``expressions=False`` 인 경우에는
            그릴 라벨이 없으므로 사실상 무의미합니다. 기본값 ``True``.

    Attributes:
        landmarks_full (list[tuple] | None): 가장 최근 검출의 478개 풀
            랜드마크. :class:`FaceClassifier` 처럼 다른 부분집합을 다시
            골라 써야 하는 코드가 사용합니다.
        blendshapes (dict[str, float] | None): 가장 최근 검출의 52개 표정
            계수. ``expressions=False`` 이거나 직전 프레임에 얼굴이 없으면
            ``None``.
        expression (str | None): ``_neutral`` 을 제외한 최상위 blendshape
            카테고리 이름 (예: ``"mouthSmileLeft"``).
        expression_score (float): 위 :attr:`expression` 의 점수 (0.0 ~ 1.0).
            검출 결과가 없으면 ``0.0``.
    """

    def __init__(self, min_detection_confidence=0.5, expressions=False, draw_label=True):
        """검출기 인스턴스를 만들고 즉시 모델을 로드합니다.

        Args:
            min_detection_confidence (float): 검출/추적 신뢰도 임계값.
            expressions (bool): blendshape(표정 계수) 출력 여부.
            draw_label (bool): 결과 라벨 자동 표시 여부.
        """
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
        """가장 최근 검출의 478개 풀 랜드마크를 반환합니다.

        :meth:`process` 는 이미 :data:`LANDMARK_INDICES_68` (22개) 로
        필터링된 리스트를 반환하므로, ``FaceClassifier`` 처럼 학습용
        ``FACE_KEY_INDICES`` (82개)를 다시 골라야 하는 코드는 이 프로퍼티로
        풀셋에 접근합니다.

        Returns:
            list[tuple] | None: ``(x_px, y_px, z_px)`` 튜플 478개. 검출
            결과가 없으면 ``None``.
        """
        # 478개 raw landmarks. process() 가 이미 LANDMARK_INDICES_68(22개)으로
        # 필터한 list를 반환하므로, 학습용 FACE_KEY_INDICES(82개)로 다시
        # 골라야 하는 FaceClassifier가 이 프로퍼티로 raw 전체에 접근한다.
        return self.__landmarks

    @property
    def blendshapes(self):
        """가장 최근 검출의 52개 표정 계수 매핑을 반환합니다.

        Returns:
            dict[str, float] | None: blendshape 이름 → 점수(0.0 ~ 1.0).
            ``expressions=False`` 로 만든 검출기거나, 직전 프레임에 얼굴이
            잡히지 않았으면 ``None``.
        """
        # dict[str, float] | None — 가장 최근 process() 의 52개 표정 계수.
        # expressions=False 로 만든 검출기거나, 직전 프레임에 얼굴이 잡히지
        # 않았으면 None.
        return self.__blendshapes

    @property
    def expression(self):
        """``_neutral`` 을 제외한 최상위 표정 카테고리 이름을 돌려줍니다.

        예: ``"mouthSmileLeft"``, ``"browDownLeft"``, ``"jawOpen"``.

        Returns:
            str | None: 최상위 표정 이름. blendshape 정보가 없거나 모두
            ``_neutral`` 이면 ``None``.
        """
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
        """:attr:`expression` 으로 선택된 표정의 점수를 반환합니다.

        Returns:
            float: 0.0 ~ 1.0 범위의 점수. blendshape 정보가 없으면 ``0.0``.
        """
        bs = self.__blendshapes
        if not bs:
            return 0.0
        candidates = [s for n, s in bs.items() if n != "_neutral"]
        return max(candidates) if candidates else 0.0

    def load_model(self):
        """MediaPipe ``FaceMesh`` 모델을 (한 번만) 초기화합니다.

        이미 한 번 로드되었다면 추가 작업 없이 즉시 반환합니다. 생성자에서
        한 번 호출되므로 사용자가 직접 부를 일은 거의 없습니다.
        """
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
        """한 프레임에서 얼굴을 검출하고 22개 핵심 랜드마크를 반환합니다.

        Args:
            img (Image): 입력 이미지. 내부 frame은 ``FrameRef`` 또는
                일반 numpy ndarray 모두 허용됩니다.
            draw (bool): ``True`` 면 풀 메쉬/윤곽/홍채/22개 핵심 점을 그려
                넣고, 마지막에 라벨도 ``show_label`` 에 따라 표시합니다.
            show_label (bool | None): 라벨(가장 강한 표정) 표시 여부를
                호출 단위로 덮어씁니다. ``None`` 이면 생성자의
                ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, list[tuple]]: ``(out_image, selected_landmarks)``.

            * ``out_image`` 는 그리기 결과가 반영된 :class:`Image`.
            * ``selected_landmarks`` 는 :data:`LANDMARK_INDICES_68` 순서로
              뽑은 22개의 ``(x_px, y_px, z_px)`` 튜플 리스트. 얼굴이
              검출되지 않으면 빈 리스트 ``[]``.

        Note:
            모델이 아직 준비되지 않았다면 안내 메시지를 출력하고 입력 이미지를
            그대로 돌려줍니다.
        """
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
        """원본에서 가져온 빈 자리 표시자.

        현재는 아무 일도 하지 않습니다. 추후 얼굴 영역 박스를 그리거나
        반환할 때 채워 쓰기 위한 슬롯입니다.
        """
        pass

    def __draw_landmarks(self, image, face_landmarks):
        """얼굴 메쉬, 윤곽, 홍채, 22개 핵심 점을 한 번에 그립니다.

        그리기 순서는 ``FACEMESH_TESSELATION`` (메쉬) → ``FACEMESH_CONTOURS``
        (윤곽) → ``FACEMESH_IRISES`` (홍채) → 22개 점(:data:`LANDMARK_INDICES_68`)
        입니다.

        Args:
            image: 그릴 대상 프레임.
            face_landmarks: MediaPipe 가 돌려준 한 얼굴의 랜드마크 객체.

        Returns:
            tuple: ``(image, [])`` 형태로 그리기가 반영된 프레임을 돌려줍니다.
            두 번째 값은 자리만 잡아둔 빈 리스트입니다.
        """
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
