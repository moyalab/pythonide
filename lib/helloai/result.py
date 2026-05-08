# -*- coding: utf-8 -*-
"""분류기(Classifier)들이 공통으로 반환하는 결과(Result) 타입 모듈.

``FaceClassifier``, ``HandClassifier``, ``PoseClassifier``,
``ImageClassifier``의 ``process()`` 메서드는 모두 :class:`Result` 객체
하나를 돌려줍니다. 학생/사용자 코드에서는 ``result.label`` 처럼 속성
접근만으로 예측 결과를 읽을 수 있도록 단순한 컨테이너 형태를 가집니다.
"""


__all__ = ["Result"]


class Result:
    """분류 결과 한 건을 담는 가벼운 컨테이너.

    가장 확률이 높은 라벨 하나뿐 아니라, 전체 클래스에 대한 확률 분포와
    (있다면) 함께 검출된 랜드마크 좌표까지 묶어서 보관합니다. 분류기 종류와
    상관없이 동일한 인터페이스로 결과를 다룰 수 있도록 설계되었습니다.

    Attributes:
        label (str): 가장 확률이 높은 클래스의 이름. 예: ``"thumbs_up"``.
        index (int): ``labels`` 안에서 위 ``label``이 위치한 인덱스.
        confidence (float): 가장 확률이 높은 클래스의 확률값(0.0 ~ 1.0).
        probabilities (Sequence[float]): 모든 클래스에 대한 확률 분포.
            ``labels``와 같은 순서·같은 길이를 가집니다.
        labels (Sequence[str]): 분류기가 학습한 전체 클래스 이름 목록.
        landmarks: 손/얼굴/포즈 검출에서 함께 얻은 키포인트.
            분류기 종류에 따라 형식이 다르며, 사용하지 않는 분류기에서는
            ``None`` 입니다.
    """

    __slots__ = ("label", "index", "confidence", "probabilities", "labels", "landmarks")

    def __init__(self, label, index, confidence, probabilities, labels, landmarks=None):
        """Result 객체를 초기화합니다.

        Args:
            label (str): 가장 확률이 높은 클래스 이름.
            index (int): ``labels`` 안에서의 인덱스 위치.
            confidence: 가장 높은 확률값. ``float``으로 자동 변환됩니다.
            probabilities (Sequence[float]): 전체 클래스에 대한 확률 분포.
            labels (Sequence[str]): 전체 클래스 이름 목록.
            landmarks: 함께 검출된 랜드마크. 사용하지 않으면 ``None``.
        """
        self.label = label
        self.index = index
        self.confidence = float(confidence)
        self.probabilities = probabilities
        self.labels = labels
        self.landmarks = landmarks

    def __repr__(self):
        """디버깅용 문자열 표현을 반환합니다.

        Returns:
            str: 라벨, 인덱스, 소수점 셋째 자리까지 반올림된 신뢰도가 포함된
            한 줄 요약 문자열.

        Examples:
            >>> r = Result("ok", 0, 0.9123, [0.9123, 0.0877], ["ok", "ng"])
            >>> repr(r)
            "Result(label='ok', index=0, confidence=0.912)"
        """
        return (
            f"Result(label={self.label!r}, index={self.index}, "
            f"confidence={self.confidence:.3f})"
        )
