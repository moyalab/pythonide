# -*- coding: utf-8 -*-
"""helloai - 웹 IDE 번들 검출기/분류기 패키지.

이 패키지는 카메라 입력을 다루는 데 필요한 검출기(Detector)와
분류기(Classifier), 그리고 보조 클래스들을 한 곳에 모아 둡니다.
사용자는 ``from helloai import FaceDetector`` 처럼 짧게 가져올 수
있습니다.

포함된 공개 클래스:
    * 공용 타입 — :class:`Image`, :class:`Result`
    * 검출기 — :class:`HandsDetector`, :class:`FaceDetector`,
      :class:`PoseDetector`
    * 분류기 — :class:`HandClassifier`, :class:`FaceClassifier`,
      :class:`PoseClassifier`, :class:`ImageClassifier`
    * 텍스트/QR — :class:`OCR`, :class:`QRReader`
    * Teachable Machine — :class:`TMImageModel`
    * 키보드 입력 상수 — :class:`Keyboard`
"""
from .image import Image
from .result import Result
from .hands_detector import HandsDetector
from .face_detector import FaceDetector
from .pose_detector import PoseDetector
from .hand_classifier import HandClassifier
from .face_classifier import FaceClassifier
from .pose_classifier import PoseClassifier
from .image_classifier import ImageClassifier
from .ocr import OCR
from .qr_reader import QRReader
from .tm_imageproject import TMImageModel
from .keyboard import Keyboard

__all__ = [
    "Image", "Result",
    "HandsDetector", "FaceDetector", "PoseDetector",
    "HandClassifier", "FaceClassifier", "PoseClassifier", "ImageClassifier",
    "OCR", "QRReader", "TMImageModel", "Keyboard",
]
