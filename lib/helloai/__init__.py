# -*- coding: utf-8 -*-
"""helloai - bundled detectors/classifiers for the web IDE."""
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
