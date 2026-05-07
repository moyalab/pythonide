# -*- coding: utf-8 -*-
"""Shared Result type returned from FaceClassifier/HandClassifier/
PoseClassifier/ImageClassifier.process()."""


__all__ = ["Result"]


class Result:
    __slots__ = ("label", "index", "confidence", "probabilities", "labels", "landmarks")

    def __init__(self, label, index, confidence, probabilities, labels, landmarks=None):
        self.label = label
        self.index = index
        self.confidence = float(confidence)
        self.probabilities = probabilities
        self.labels = labels
        self.landmarks = landmarks

    def __repr__(self):
        return (
            f"Result(label={self.label!r}, index={self.index}, "
            f"confidence={self.confidence:.3f})"
        )
