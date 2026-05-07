# -*- coding: utf-8 -*-
"""FaceClassifier — ``.fcm`` 형식의 얼굴 키포인트 모델로 프레임을 분류하는 모듈.

학습에 사용된 라이브러리/옵션과 정확히 동일한 ``@mediapipe/tasks-vision``
의 ``FaceLandmarker`` 가 추론에서도 사용됩니다. 학습/추론 키포인트 분포가
일치하므로 분류 정확도가 보존됩니다. :class:`FaceDetector` 와는 독립적으로
동작합니다.

:attr:`Result.landmarks` 에는 학습에 사용된 부분집합인 ``FACE_KEY_INDICES``
(82개) 키포인트만, 학습 패널과 동일한 순서로, 픽셀 좌표로 들어갑니다.

Examples:
    감정 분류 모델 사용 예::

        clf = FaceClassifier('models/emotion.fcm')
        out_img, result = clf.process(Image(frame))
        print(result.label, result.confidence)
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["FaceClassifier"]


def _load_fcm(path):
    """``.fcm`` 모델 파일을 읽어 바이트로 반환합니다.

    절대경로면 그대로, 상대경로면 ``/work/`` 하위 → 원본 경로 순으로 시도합니다.

    Args:
        path: 모델 파일 경로.

    Returns:
        bytes: 모델 파일 전체 바이트.

    Raises:
        FileNotFoundError: 어떤 후보 경로에서도 파일을 열 수 없을 때.
    """
    s = str(path)
    candidates = [s] if s.startswith("/") else ["/work/" + s, s]
    for c in candidates:
        try:
            with open(c, "rb") as f:
                return f.read()
        except OSError:
            continue
    raise FileNotFoundError(f"Cannot read .fcm: {path}")


_FACE_GROUP_KEYS = (
    "tesselation",
    "faceOval",
    "rightEye", "rightEyebrow", "rightIris",
    "leftEye",  "leftEyebrow",  "leftIris",
    "lips",
)
"""얼굴 메쉬 그룹 이름 순서.

학습 패널의 ``DrawingUtils.drawConnectors`` 호출 순서와 같습니다.
:meth:`FaceClassifier._draw_face_overlay` 가 이 순서로 메쉬 → 윤곽 →
눈/눈썹/홍채 → 입술 순으로 그려서 학습 시 화면과 동일한 모양을 만듭니다.
"""

# 학습 패널 (faceTracker.drawFaceLandmarks) 의 drawConnectors 호출과 동일한
# 색/두께를 BGR 로 옮긴 것. 순서도 학습 시와 같다 — tesselation 을 가장 먼저
# 깔고 그 위에 윤곽/눈/눈썹/홍채/입술을 덮어 그린다.
_FACE_GROUP_STYLE = {
    "tesselation":  ((192, 192, 192), 1),  # #C0C0C0 (학습은 30 알파)
    "faceOval":     ((224, 224, 224), 1),  # #E0E0E0
    "rightEye":     (( 48,  48, 255), 1),  # #FF3030 (BGR)
    "rightEyebrow": (( 48,  48, 255), 1),  # #FF3030
    "rightIris":    (( 48,  48, 255), 1),  # #FF3030
    "leftEye":      (( 48, 255,  48), 1),  # #30FF30
    "leftEyebrow":  (( 48, 255,  48), 1),  # #30FF30
    "leftIris":     (( 48, 255,  48), 1),  # #30FF30
    "lips":         ((224, 224, 224), 1),  # #E0E0E0
}
"""그룹별 그리기 스타일(``(BGR 색, 선 두께)``).

학습 패널이 사용하는 RGB hex 색상을 BGR로 변환한 값입니다. 이 색깔들은
학습 화면과 추론 화면을 동일하게 보이게 하려는 것이므로 변경하지 마세요.
"""


class FaceClassifier:
    """``.fcm`` 파일에서 불러온 얼굴 키포인트 분류기.

    내부적으로 메인 스레드의 MediaPipe FaceLandmarker(478개 키포인트) 결과
    중 학습에 쓰였던 82개 부분집합만 모델 입력으로 사용합니다. 화면에는
    학습 패널과 동일한 풀 메쉬(478개)를 덮어 그리고, 그 위에 실제 추론에
    쓰이는 82개 점을 빨간 점으로 표시해 주는 디자인입니다.

    Args:
        model_path: ``.fcm`` 모델 파일 경로. 작업 폴더 기준 상대경로
            또는 절대경로.
        draw_label (bool): ``True`` 면 :meth:`process` 가 결과 라벨을
            프레임 좌상단에 표시합니다. 기본값은 ``True``.

    Attributes:
        labels (list[str]): 모델이 학습한 클래스 이름 목록(프로퍼티).
    """

    def __init__(self, model_path, draw_label=True):
        """모델 파일을 읽어 메인 스레드 분류기 인스턴스를 만듭니다.

        Args:
            model_path: ``.fcm`` 파일 경로.
            draw_label (bool): 결과 라벨 자동 표시 여부.

        Raises:
            FileNotFoundError: 모델 파일을 열 수 없을 때.
            ValueError: 파일이 ``face`` 종류의 모델이 아닐 때.
        """
        data = _load_fcm(model_path)
        info = _mpBridge.call("clf.load", {"bytes": data})
        kind = info.get("kind") if hasattr(info, "get") else info["kind"]
        if kind != "face":
            raise ValueError(f"Not a face model: kind={kind}")
        self._handle = int(info["handle"])
        self._labels = [str(x) for x in (info.get("labels") or [])]
        # 학습 패널과 동일한 그룹별(478-인덱스) 컨넥션. 한 번만 받아둔다.
        cg = info.get("faceColorGroups") or {}
        self._color_groups = {}
        for k in _FACE_GROUP_KEYS:
            edges = cg.get(k) or []
            self._color_groups[k] = [
                (int(e[0]), int(e[1])) for e in edges
            ]
        self._closed = False
        self._draw_label = bool(draw_label)

    @property
    def labels(self):
        """모델의 클래스 이름 목록 사본을 반환합니다.

        Returns:
            list[str]: 학습된 클래스 이름들의 새 리스트.
        """
        return list(self._labels)

    def process(self, image, draw=True, show_label=None):
        """한 프레임에서 얼굴 키포인트를 뽑고 분류 결과를 반환합니다.

        Args:
            image (Image): 입력 이미지. 내부 frame은 반드시 ``FrameRef`` 여야 합니다.
            draw (bool): ``True`` 면 풀 메쉬 오버레이와 학습 부분집합 점을
                프레임 위에 그립니다.
            show_label (bool | None): 라벨 표시 여부를 호출 단위로 덮어씁니다.
                ``None`` 이면 생성자의 ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, Result]: ``(image, result)`` 형태.
            ``result.landmarks`` 에는 학습에 쓰인 82개 키포인트가 들어갑니다.

        Raises:
            TypeError: 내부 frame이 ``FrameRef`` 가 아닐 때.
        """
        frame = image.frame
        token = getattr(frame, "_token", None)
        if token is None:
            raise TypeError(
                "FaceClassifier requires a FrameRef input "
                "(use cv2.imread() or cv2.VideoCapture().read()); "
                "raw numpy ndarrays are not supported."
            )

        r = _mpBridge.call("clf.predictKeypointFromFrame", {
            "handle": self._handle,
            "frameToken": int(token),
        })
        # 82 (px, py, pz) tuples — only the trained FACE_KEY_INDICES points.
        pix = [tuple(int(v) for v in p) for p in (r.get("pixelLandmarks") or [])]
        # 478 (px, py, pz) tuples — full landmark set, used solely for drawing
        # the same colored overlay the training panel renders.
        full_pix = [
            tuple(int(v) for v in p) for p in (r.get("fullPixelLandmarks") or [])
        ]
        result = Result(
            label=str(r.get("label") or ""),
            index=int(r.get("index", -1)),
            confidence=float(r.get("confidence", 0.0)),
            probabilities=[float(p) for p in (r.get("probabilities") or [])],
            labels=list(self._labels),
            landmarks=pix,
        )

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and full_pix:
            self._draw_face_overlay(image.frame, full_pix)
            # 모델 추론에 실제로 입력되는 trained-subset(82) 포인트를 빨간 점으로
            # 덧그려, 메쉬 오버레이 위에서 어떤 점이 학습/추론에 쓰이는지 보이게
            # 한다.
            for x, y, _z in pix:
                cv2.circle(image.frame, (x, y), 3, (0, 0, 255), -1)
            if show and result.label:
                label_txt = result.label
                pct_txt = f"{result.confidence * 100:.1f}%"
                cv2.putText(image.frame, label_txt, (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
                cv2.putText(image.frame, pct_txt, (10, 80),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 5)
                cv2.putText(image.frame, label_txt, (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)
                cv2.putText(image.frame, pct_txt, (10, 80),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 2)
        return image, result

    def _draw_face_overlay(self, frame, full_pix):
        """학습 패널과 동일한 색·순서로 얼굴 메쉬를 덮어 그립니다.

        그룹 그리기 순서는 ``tesselation`` (밑바탕) → 윤곽/눈/눈썹/홍채/
        입술 순서이며, 학습 시 ``DrawingUtils.drawConnectors`` 의 호출
        순서와 일치합니다.

        Args:
            frame: 그릴 대상 프레임 (numpy ndarray).
            full_pix (list[tuple]): 478개 키포인트의 ``(x, y, z)`` 픽셀 좌표.
        """
        # 학습 패널의 DrawingUtils.drawConnectors 호출 순서와 동일하게,
        # tesselation → 윤곽/눈/눈썹/홍채/입술 순으로 덮어 그린다.
        n = len(full_pix)
        for key in _FACE_GROUP_KEYS:
            edges = self._color_groups.get(key) or []
            color, thickness = _FACE_GROUP_STYLE[key]
            for a, b in edges:
                if 0 <= a < n and 0 <= b < n:
                    cv2.line(
                        frame,
                        (full_pix[a][0], full_pix[a][1]),
                        (full_pix[b][0], full_pix[b][1]),
                        color, thickness,
                    )

    def close(self):
        """메인 스레드 분류기 인스턴스를 해제합니다.

        한 번 호출 후 재호출은 무시되며, 해제 중 예외는 삼킵니다.
        """
        if self._closed:
            return
        self._closed = True
        try:
            _mpBridge.call("clf.close", {"handle": self._handle})
        except Exception:
            pass

    def __del__(self):
        """가비지 컬렉션 시점에 안전하게 :meth:`close` 를 호출합니다."""
        try:
            self.close()
        except Exception:
            pass
