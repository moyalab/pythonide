# -*- coding: utf-8 -*-
"""HandClassifier — ``.fcm`` 형식의 손 키포인트 모델로 프레임을 분류하는 모듈.

학습 시 사용한 라이브러리/옵션과 정확히 동일한 ``@mediapipe/tasks-vision``
의 ``HandLandmarker`` 가 추론 시에도 사용됩니다. 즉, 학습 단계와 추론
단계의 키포인트 분포가 똑같이 맞춰지므로 분류 정확도가 보존됩니다.
:class:`HandsDetector` 와 독립적으로 동작하므로 사용자가 별도로 검출기를
만들 필요는 없습니다.

Examples:
    가위바위보 같은 분류 모델 사용 예::

        clf = HandClassifier('models/rps.fcm')
        out_img, result = clf.process(Image(frame))
        print(result.label, result.confidence)
"""
import _mpBridge
import web_cv2 as cv2
from .result import Result


__all__ = ["HandClassifier"]


def _load_fcm(path):
    """``.fcm`` 모델 파일을 읽어 바이트로 반환합니다.

    절대경로면 그대로, 상대경로면 ``/work/`` 하위를 먼저 시도한 뒤 원본
    경로를 시도합니다.

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


class HandClassifier:
    """``.fcm`` 파일에서 불러온 손 키포인트 분류기.

    내부적으로 메인 스레드의 MediaPipe HandLandmarker 가 추출한 키포인트를
    feature 로 사용합니다. 분류 결과와 함께 검출된 키포인트(픽셀 좌표) 도
    :attr:`Result.landmarks` 로 받을 수 있습니다.

    Args:
        model_path: ``.fcm`` 모델 파일 경로. 작업 폴더(``/work/``) 기준
            상대경로 또는 절대경로.
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
            ValueError: 파일이 ``hand`` 종류의 모델이 아닐 때.
        """
        data = _load_fcm(model_path)
        info = _mpBridge.call("clf.load", {"bytes": data})
        kind = info.get("kind") if hasattr(info, "get") else info["kind"]
        if kind != "hand":
            raise ValueError(f"Not a hand model: kind={kind}")
        self._handle = int(info["handle"])
        self._labels = [str(x) for x in (info.get("labels") or [])]
        self._connections = [
            (int(c[0]), int(c[1])) for c in (info.get("connections") or [])
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
        """한 프레임에서 손 키포인트를 뽑고 분류 결과를 반환합니다.

        Args:
            image (Image): 입력 이미지. 내부 frame은 반드시 ``FrameRef``
                여야 합니다.
            draw (bool): ``True`` 면 검출된 손 스켈레톤을 프레임 위에
                그립니다(라벨 표시는 ``show_label`` 에 따름).
            show_label (bool | None): 라벨 표시 여부를 호출 단위로 덮어씁니다.
                ``None`` 이면 생성자의 ``draw_label`` 을 사용합니다.

        Returns:
            tuple[Image, Result]: ``(image, result)`` 형태.

            * ``image`` 는 입력 :class:`Image` (스켈레톤·라벨이 그려질 수 있음).
            * ``result.landmarks`` 는 ``[(x, y, z), ...]`` 픽셀 좌표 리스트.

        Raises:
            TypeError: 내부 frame이 ``FrameRef`` 가 아닐 때.
        """
        frame = image.frame
        token = getattr(frame, "_token", None)
        if token is None:
            raise TypeError(
                "HandClassifier requires a FrameRef input "
                "(use cv2.imread() or cv2.VideoCapture().read()); "
                "raw numpy ndarrays are not supported."
            )

        r = _mpBridge.call("clf.predictKeypointFromFrame", {
            "handle": self._handle,
            "frameToken": int(token),
        })
        pix = [tuple(int(v) for v in p) for p in (r.get("pixelLandmarks") or [])]
        result = Result(
            label=str(r.get("label") or ""),
            index=int(r.get("index", -1)),
            confidence=float(r.get("confidence", 0.0)),
            probabilities=[float(p) for p in (r.get("probabilities") or [])],
            labels=list(self._labels),
            landmarks=pix,
        )

        show = self._draw_label if show_label is None else bool(show_label)
        if draw and pix:
            self._draw_skeleton(image.frame, pix)
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

    def _draw_skeleton(self, frame, pix):
        """프레임 위에 손 스켈레톤(연결선 + 관절 점)을 그립니다.

        Args:
            frame: 그릴 대상 프레임 (numpy ndarray).
            pix (list[tuple]): 각 키포인트의 ``(x, y, z)`` 픽셀 좌표 리스트.
        """
        n = len(pix)
        for a, b in self._connections:
            if 0 <= a < n and 0 <= b < n:
                cv2.line(
                    frame,
                    (pix[a][0], pix[a][1]),
                    (pix[b][0], pix[b][1]),
                    (255, 0, 0), 2,
                )
        for x, y, _z in pix:
            cv2.circle(frame, (x, y), 4, (0, 255, 0), -1)

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
