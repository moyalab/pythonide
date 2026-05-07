# -*- coding: utf-8 -*-
"""웹 IDE 환경에 맞춰 이식된 OCR(광학 문자 인식) 모듈.

원본 위치는 ``helloai-06-dev-2.8/helloai/helloai/ext/ocr/ocr.py`` 이며,
브라우저(Pyodide) 환경에서 동작하도록 다음과 같이 다듬어졌습니다.

  * ``from helloai.core.image import Image`` 대신 같은 패키지 내부의
    공용 :class:`Image` shim을 사용합니다.
  * PyTorch 기반의 PIL/easyocr 대신 ``_easyocr`` 스텁을 사용합니다.
    이 스텁은 내부적으로 메인 스레드의 Tesseract.js 를 호출하지만,
    ``Reader().readtext(image)`` 형태와 반환값 모양은 그대로 유지하므로
    사용자 코드 입장에서는 인터페이스 변화가 없습니다.
  * 결과를 그릴 때 PIL로 사각형/한글 문자열을 그리던 부분은
    ``cv2.rectangle`` 과 ``cv2.putText`` 호출로 대체되어, ``imshow``
    캔버스 위에 곧바로 오버레이로 표시됩니다.
"""
import web_cv2 as cv2
from . import _easyocr as easyocr
from .image import Image


__all__ = ["OCR"]


class OCR:
    """이미지에서 영어/한국어 글자를 인식하는 OCR 클래스.

    내부적으로 영어와 한국어를 동시에 인식하도록 설정된 reader 한 개를
    들고 있습니다. ``readtext()`` 한 번 호출에 두 언어 결과를 함께
    돌려주므로, 사용자 코드에서 언어 전환을 따로 신경 쓰지 않아도 됩니다.

    Examples:
        간단한 사용 예::

            ocr = OCR()
            results, drawn = ocr.readtext(camera_image)
            for bbox, text, prob in results:
                print(text, prob)
    """

    def __init__(self):
        """영어·한국어 reader 를 초기화합니다.

        Tesseract.js 기반의 :class:`_easyocr.Reader` 를 ``['en', 'ko']``
        설정으로 한 번만 만들어 보관합니다. 이후 :meth:`readtext` 호출은
        이 reader를 재사용합니다.
        """
        self.__reader = easyocr.Reader(['en', 'ko'])

    def readtext(self, img, isdraw=True):
        """주어진 이미지에서 글자 영역과 인식 결과를 찾아 돌려줍니다.

        ``isdraw`` 가 ``True`` 일 때는 인식된 영역에 초록색 사각형과
        빨간색 문자열(인식 결과 + 신뢰도)을 ``cv2`` 로 직접 그려 넣습니다.
        그 결과를 ``imshow`` 로 띄우면 어디서 무엇을 인식했는지 한눈에
        볼 수 있습니다.

        Args:
            img (Image): :class:`helloai.image.Image` 로 감싼 입력 프레임.
                ``Image`` 인스턴스가 아니거나 내부 프레임이 ``None`` 인
                경우에는 빈 리스트(``[]``)만 반환합니다.
            isdraw (bool): ``True`` 이면 입력 프레임 위에 인식 결과 박스와
                텍스트를 직접 그립니다. 기본값은 ``True`` 입니다.

        Returns:
            정상 입력일 때는 ``(results, Image)`` 형태의 튜플을 돌려줍니다.

            * ``results`` 는 ``(bbox, text, prob)`` 튜플을 담은 리스트입니다.

              * ``bbox`` : 인식 영역의 네 꼭짓점 좌표 (``[(x, y), ...]``).
              * ``text`` : 인식된 문자열.
              * ``prob`` : 인식 신뢰도 (0.0 ~ 1.0).

            * 두 번째 값은 결과를 그려 넣은 새 :class:`Image` 입니다.

            입력이 잘못된 경우에는 빈 리스트(``[]``)만 반환합니다.

        Examples:
            카메라 한 프레임에서 글자를 읽어 오는 예::

                ocr = OCR()
                results, image = ocr.readtext(frame)
                for bbox, text, prob in results:
                    print(text, f"{prob:.2f}")
        """
        if not isinstance(img, Image) or img.image is None:
            return []

        frame = img.frame
        results = self.__reader.readtext(frame)

        if isdraw:
            for (bbox, text, prob) in results:
                top_left = tuple(map(int, bbox[0]))
                bottom_right = tuple(map(int, bbox[2]))

                # Green outline rectangle (BGR (0, 255, 0))
                cv2.rectangle(frame, top_left, bottom_right, (0, 255, 0), 2)
                # Red label above the box (BGR (0, 0, 255))
                cv2.putText(
                    frame,
                    f"{text} ({prob:.2f})",
                    (top_left[0], max(0, top_left[1] - 5)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 0, 255),
                    2,
                )

        return results, Image(frame)
