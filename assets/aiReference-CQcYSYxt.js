import{h as e,f as a,p as r,t as i}from"./tm_export_tfjs-B0NsUDfF.js";const t=[{id:"cv2",title:"web_cv2 (OpenCV shim)",description:"이미지/카메라 프레임을 화면에 띄우고, 도형·텍스트를 그립니다. 표준 OpenCV(cv2)와 구분되도록 web_cv2라는 이름으로 제공됩니다.",icon:"image",entries:[{name:"import web_cv2 as cv2",summary:` 이 IDE에 내장된 OpenCV 호환 모듈(web_cv2)을 cv2라는 이름으로 가져옵니다. web_cv2 모듈은 OpenCV 패키지의 극히 일부분의 기능만 제공합니다.   

 `,example:"import web_cv2 as cv2",warning:"표준 OpenCV(cv2) 라이브러리와 혼동되지 않도록 모듈 이름을 web_cv2로 사용하고, 관례적인 코드 스타일을 유지하기 위해 `import web_cv2 as cv2`와 같이 별칭(cv2)을 붙여 사용합니다.   \n  \nweb_cv2는 표준 OpenCV 기능의 일부분만 구현(shim)되었으며, imwrite 등 그 외 함수는 명시적으로  NotImplementedError를 발생시킵니다. ",warningType:"info"},{name:"cv2.imread(path)",summary:"프로젝트 안의 이미지 파일을 불러와 이미지 객체를 돌려줍니다.",details:`Args:
  path (str): 프로젝트 루트 기준 상대 경로 (예: "cat.png")
Returns:
  image: 성공 시 이미지 객체, 실패 시 None

`,warning:"업로드 가능한 이미지의 최대 크기는 50MB로 제한됩니다.",example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')
if frame is None:
    print('파일을 찾을 수 없습니다')
else:
    print('크기:', frame.shape)   # (h, w, 3)`,warning2:`web_cv2(cv2)와 FaceDetector는 같은 카메라 프레임을 다루지만, 받는 형식이 다릅니다.
헷갈리기 쉬운 부분이라 다음 세 가지 규칙만 기억하면 됩니다.

① cv2.* 함수 → raw frame을 그대로 넣는다
\`\`\`python
     ok, frame = cap.read()
     cv2.imshow("camera", frame)
     cv2.rectangle(frame, (10, 10), (100, 100), (0, 255, 0), 2)
\`\`\`
② FaceDetector.process() → frame을 Image()로 감싸서 넣는다
\`\`\`     
   out_img, points = detector.process(Image(frame))
\`\`\`
   process()가 돌려주는 out_img도 Image 객체입니다.
   (raw frame이 아니므로 cv2.imshow에 그대로 넘기면 안 됩니다.)

③ Image에서 cv2용 frame 꺼내기 → .frame 속성을 쓴다
\`\`\`
     cv2.imshow("face", out_img.frame)
     cv2.rectangle(out_img.frame, ...)
\`\`\`
한눈에 보기:
\`\`\`
  cv2.xxx(frame, ...)              ← raw frame
  detector.process(Image(frame))   ← Image로 감싸기
  out_img.frame                    ← Image → raw frame
\`\`\`

참고: Image.image 도 같은 frame을 돌려줍니다 (.frame 의 별칭).
Image 객체의 가로/세로는 out_img.width, out_img.height 로 읽을 수 있습니다.`,warning2Type:"info"},{name:"cv2.imread(url)",summary:"http(s):// 로 시작하는 URL의 이미지를 직접 불러와 이미지 객체를 돌려줍니다.",details:`Args:
  url (str): "http://" 또는 "https://"로 시작하는 이미지 URL
Returns:
  image: 성공 시 이미지 객체, 실패(네트워크 오류·CORS 차단 등) 시 None

동작: URL은 메인 스레드에서 fetch로 다운로드한 뒤 디코딩됩니다.
대상 서버가 CORS(Cross-Origin) 응답을 허용해야 하며, 그렇지 않으면 None이 반환됩니다.

`,warning:"불러올 수 있는 원격 이미지의 최대 크기 또한 50MB로 제한됩니다.",example:{description:"주의: path 버전과 동일하게 image[y, x] 같은 직접 픽셀 접근은 지원하지 않습니다.",code:`import web_cv2 as cv2

url = 'https://example.com/cat.png'
frame = cv2.imread(url)
if frame is None:
    print('이미지를 가져오지 못했습니다 (CORS/네트워크 오류)')
else:
    print('크기:', frame.shape)   # (h, w, 3)
    cv2.imshow('remote', frame)
    cv2.waitKey(0)`}},{name:"cv2.imshow(name, image)",summary:"이미지를 IDE의 플로팅 윈도우에 표시합니다 (논블로킹).",details:`Args:
  name (str): 윈도우 제목 (같은 이름이면 같은 창에 다시 그림)
  image: cv2.imread / cv2.VideoCapture.read 결과 또는 numpy 배열
Returns: 없음`,example:`cv2.imshow('preview', frame)
cv2.waitKey(0)`},{name:"cv2.waitKey(ms=0)",summary:`키 입력을 ms(밀리초)만큼 기다립니다. 정적 이미지엔 0, 영상 루프엔 1을 씁니다. 


`,details:`Args:
  ms (int): 대기 시간(ms). 0 이하면 키가 눌릴 때까지 무한 대기.
Returns:
  int: 눌린 키의 코드. 시간 초과 또는 포커스가 없으면 -1
`,example:`import web_cv2 as cv2
from helloai import Keyboard

# (A) 정적 이미지: 키가 눌릴 때까지 창을 유지
frame = cv2.imread('cat.png')
cv2.imshow('image', frame)
cv2.waitKey(0)            # 0 = 무한 대기
cv2.destroyAllWindows()

# (B) 영상 루프: 매 프레임 갱신하며 ESC로 종료
cap = cv2.VideoCapture()
while True:
    ok, frame = cap.read()
    if not ok:
        continue
    cv2.imshow('camera', frame)
    if cv2.waitKey(1) == Keyboard.ESC:   # 1 = 1ms만 살짝 대기
        break
cap.release()
cv2.destroyAllWindows()`},{name:"cv2.destroyAllWindows()",summary:"열려 있는 모든 imshow 윈도우를 닫습니다.",details:`Args: 없음
Returns: 없음

특정 창만 닫으려면 cv2.destroyWindow(name)을 사용합니다.`,example:"cv2.destroyAllWindows()"},{name:"cv2.VideoCapture(source=0)",summary:"웹캠을 엽니다. .isOpened() / .read() / .release() 메서드를 제공합니다.",details:`Args:
  source (int, 선택): 카메라 인덱스. 기본값은 0 (기본 웹캠).
    브라우저 환경에서는 한 번에 카메라 1대만 사용하므로
    인자를 생략한 cv2.VideoCapture()와 cv2.VideoCapture()는 동일하게
    동작합니다.
Returns: VideoCapture 객체

메서드:
  isOpened() -> bool: 카메라가 열려 있는지
  read() -> (bool, image): 한 프레임을 받아옵니다.
  release(): 카메라를 닫습니다.

브라우저 환경 특성상 한 번에 카메라 1대만 사용할 수 있습니다.`,example:`import web_cv2 as cv2

# 기본 웹캠을 엽니다. source는 기본값 0이라 생략 가능합니다.
cap = cv2.VideoCapture()
ok, frame = cap.read()
if ok:
    print('프레임 크기:', frame.shape)
cap.release()`},{name:"cv2.line(image, pt1, pt2, color, thickness=1)",summary:"이미지 위에 직선을 그립니다.",details:`Args:
  image: imread / VideoCapture.read 결과
  pt1, pt2 ((x, y)): 시작점, 끝점 (픽셀 좌표)
  color (B, G, R): OpenCV 관례대로 BGR 순서. (0, 0, 255) = 빨강.
  thickness (int): 선 두께(px)
Returns:
  image: 같은 이미지 (체이닝용)`,example:"cv2.line(frame, (0, 0), (200, 200), (0, 0, 255), 3)"},{name:"cv2.rectangle(image, pt1, pt2, color, thickness=1)",summary:"이미지 위에 사각형을 그립니다. thickness=-1 (cv2.FILLED)은 채움.",details:`Args:
  image: 그릴 대상
  pt1 ((x, y)): 좌상단 모서리
  pt2 ((x, y)): 우하단 모서리
  color (B, G, R): BGR
  thickness (int): 선 두께. -1 또는 cv2.FILLED면 내부를 채움.`,example:`cv2.rectangle(frame, (50, 50), (200, 150), (0, 255, 0), 2)
cv2.rectangle(frame, (10, 10), (40, 40), (255, 0, 0), cv2.FILLED)`},{name:"cv2.circle(image, center, radius, color, thickness=1)",summary:"이미지 위에 원을 그립니다. thickness=-1은 채워진 원.",details:`Args:
  image: 그릴 대상
  center ((x, y)): 중심 좌표
  radius (int): 반지름(px)
  color (B, G, R): BGR
  thickness (int): 선 두께. -1이면 채움.`,example:`cv2.circle(frame, (100, 100), 30, (255, 0, 255), 2)
cv2.circle(frame, (200, 100), 30, (0, 255, 255), -1)`},{name:"cv2.putText(image, text, org, fontFace, fontScale, color, thickness=1)",summary:"이미지 위에 텍스트를 그립니다.",details:`Args:
  image: 그릴 대상
  text (str): 표시할 문자열 (한글 가능)
  org ((x, y)): 텍스트의 좌하단 기준점
  fontFace: cv2.FONT_HERSHEY_SIMPLEX 등 폰트 상수
  fontScale (float): 글자 크기 배율 (≈ 14*scale px)
  color (B, G, R): BGR
  thickness (int): 선 두께

주의: 이 IDE는 캔버스의 sans-serif 폰트로 근사 렌더링합니다.
폰트 상수 종류는 받아주지만 모양은 모두 비슷해 보입니다.`,example:`cv2.putText(frame, 'Hello CV2', (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)`},{name:"cv2.cvtColor(image, code)",summary:"색공간을 변환합니다. (numpy 배열에 대해서만 실제 변환됨)",details:`Args:
  image: 입력 이미지
  code: 변환 코드. 지원: COLOR_BGR2RGB, COLOR_RGB2BGR,
        COLOR_BGR2GRAY, COLOR_GRAY2BGR.
Returns:
  변환된 이미지

제약: imread/VideoCapture가 돌려주는 이미지는 메인 스레드에서
이미 RGB로 표시되므로 BGR↔RGB 변환은 시각적으로 효과가 없습니다.
numpy 배열을 직접 만들어 넣은 경우에만 실제 채널 스왑이 일어납니다.`,example:`import web_cv2 as cv2
import numpy as np

arr = np.zeros((100, 100, 3), dtype=np.uint8)
arr[:, :, 0] = 255   # BGR의 B 채널
gray = cv2.cvtColor(arr, cv2.COLOR_BGR2GRAY)
print(gray.shape)    # (100, 100)`},{name:"cv2.flip(image, axis)",summary:"이미지를 뒤집습니다. (numpy 배열에 대해서만 실제 변환됨)",details:`Args:
  image: 입력 이미지
  axis (int): 0=상하반전, 1=좌우반전, -1=양쪽
Returns:
  뒤집힌 이미지

제약: cvtColor와 마찬가지로, imread/VideoCapture 결과(FrameRef)에는
아직 적용되지 않습니다. numpy 배열에서만 실제로 동작합니다.`,example:`import web_cv2 as cv2
import numpy as np

arr = np.arange(12, dtype=np.uint8).reshape(3, 4)
print(cv2.flip(arr, 1))   # 좌우 반전된 배열`},{name:"예제 1: 이미지 파일 표시",summary:"프로젝트 안의 이미지를 읽어 창에 띄웁니다. 아무 키나 누르면 종료.",details:null,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')
if frame is None:
    print('cat.png 파일을 프로젝트에 추가해 주세요')
else:
    cv2.imshow('image', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 영상 표시",summary:"웹캠을 열고 ESC를 누를 때까지 매 프레임을 화면에 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import Keyboard

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    cv2.imshow('camera', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 이미지 위에 도형과 라벨 그리기",summary:"정적 이미지에 사각형, 원, 선, 텍스트를 한꺼번에 그려서 보여줍니다.",details:null,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')
if frame is None:
    print('cat.png가 필요합니다')
else:
    h, w, _ = frame.shape

    # 외곽 박스 (초록, 두께 3)
    cv2.rectangle(frame, (10, 10), (w - 10, h - 10), (0, 255, 0), 3)

    # 화면 중심에 빨간 십자선
    cx, cy = w // 2, h // 2
    cv2.line(frame, (cx - 20, cy), (cx + 20, cy), (0, 0, 255), 2)
    cv2.line(frame, (cx, cy - 20), (cx, cy + 20), (0, 0, 255), 2)

    # 채워진 마젠타 원
    cv2.circle(frame, (cx, cy), 8, (255, 0, 255), cv2.FILLED)

    # 좌상단에 라벨
    cv2.putText(frame, 'CENTER', (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

    cv2.imshow('annotated', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"예제 4: 카메라 화면에 가이드 박스와 안내 텍스트",summary:"매 프레임마다 중앙 가이드 박스와 상단 안내문을 그려 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import Keyboard

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    h, w, _ = frame.shape
    bx, by, bw, bh = w // 2 - 100, h // 2 - 100, 200, 200

    # 가이드 박스
    cv2.rectangle(frame, (bx, by), (bx + bw, by + bh), (0, 255, 255), 2)
    # 안내 텍스트 (좌상단)
    cv2.putText(frame, 'Place object inside the box', (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    # 종료 안내 (좌하단)
    cv2.putText(frame, 'Press ESC to quit', (10, h - 15),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow('guide', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 카메라 + 실시간 FPS 표시",summary:"매 프레임 처리 시간을 측정해 좌상단에 FPS와 프레임 번호를 그립니다.",details:null,example:`import web_cv2 as cv2
import time
from helloai import Keyboard

cap = cv2.VideoCapture()
prev_t = time.time()
frame_no = 0

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    frame_no += 1

    now = time.time()
    fps = 1.0 / max(now - prev_t, 1e-6)
    prev_t = now

    label = f'FPS {fps:5.1f}  #{frame_no}'
    cv2.putText(frame, label, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('fps', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand",title:"Hand (HandsDetector)",description:"카메라의 영상/이미지에서 손의 21개 keypoint를 검출합니다. ",icon:"sign_language",image:e,entries:[{name:"from helloai import HandsDetector, Image",summary:"손 검출기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import HandsDetector, Image"},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을, HandsDetector에는 Image(frame)을 넣습니다. Image에서 frame은 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()              # cv2 → raw frame
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달 — 양손 모두 인식
    out_img, hands = detector.process(Image(frame))
    for h in hands:
        print(h['handedness'], h['landmarks'][8])  # 'right'/'left' 와 검지 끝

    # cv2.imshow에는 다시 raw frame이 필요하므로 .frame 으로 꺼냄
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warningType:"info"},{name:"HandsDetector(draw_label=True)",summary:`손 검출기를 만듭니다. 양손(왼손+오른손)을 동시에 인식합니다. 첫 호출 시 모델(약 6MB)을 다운로드합니다.  

시각화 시 오른손의 연결선은 옅은 보라색(thistle)으로, 왼손은 기본 회색으로 그려져 좌우를 한눈에 구별할 수 있습니다.`,details:`Args:
  draw_label (bool): True면 process()가 매 프레임 각 손의 손목 위쪽에 "right: v" / "left: fist" 형식의 sign 라벨을 자동으로 그립니다. 끄려면 False.
Returns: HandsDetector 객체


`,example:"detector = HandsDetector()"},{name:"detector.process(image, draw=True, line_width=4, circle_radius=6, show_label=None)",summary:"입력 이미지에서 양손을 검출하고 결과 이미지와 손별 정보 리스트를 돌려줍니다.",details:`Args:
  image (Image): 카메라 프레임 또는 이미지 파일을 감싼 Image 객체
  draw (bool): True면 결과 이미지에 keypoint와 연결선을 그립니다.
    오른손은 옅은 보라색 선, 왼손은 기본 회색 선으로 시각적으로 구분됩니다.
  line_width (int): 연결선 두께
  circle_radius (int): keypoint 원의 반지름
  show_label (bool|None): True/False면 이 호출에서만 손목 위 sign 라벨 표시를 켜/끄고, None이면 생성자의 draw_label을 따릅니다.

Returns: (Image, list[dict]) 형태의 튜플
  ─ 1번째 (Image): keypoint와 연결선이 그려진 시각화 결과 이미지(원본 frame은 변경되지 않습니다).
  ─ 2번째 (list[dict]): 검출된 손별로 한 개씩 들어 있는 dict 리스트.`,example:`out_img, hands = detector.process(img)

print('검출된 손 개수:', len(hands))   # 0, 1, 또는 2

for h in hands:
    side = h['handedness']             # 'right' 또는 'left'
    pts = h['landmarks']               # 21개 (x, y, z) 튜플
    print(f'{side} 검지 끝:', pts[8])
    print(f'{side} 엄지 끝:', pts[4])`,warning2:`리스트 길이로 검출된 손 개수를 알 수 있습니다.
  · 손 0개 → []          (빈 리스트)
  · 손 1개 → 길이 1
  · 양손   → 길이 2

각 dict는 정확히 두 개의 키를 가집니다.
  · "handedness" (str): 어느 쪽 손인지. 항상 소문자 "right" 또는 "left".
  · "landmarks" (list): 21개 keypoint 좌표 리스트. 각 항목은 (x, y, z) 정수 튜플(픽셀 단위).
       - 인덱스 0~20은 MediaPipe 손 모델의 표준 순서(0=손목, 4=엄지끝, 8=검지끝, 12=중지끝, 16=약지끝, 20=새끼끝).
       - x,y는 화면 픽셀 좌표(0,0 = 좌상단).
       - z는 손목을 0 기준으로 한 상대적 깊이(음수=카메라에 가까움).

예시 구조:
  [
    {"handedness": "right", "landmarks": [(312, 240, 0), (320, 215, -3), ... 총 21개]},
    {"handedness": "left",  "landmarks": [(120,  90, 0), (132, 110, -2), ... 총 21개]},
  ]

주의 — 좌우 기준:
  "right"/"left"는 MediaPipe가 분류한 결과를 그대로 노출합니다.
  웹캠은 화면이 거울처럼 좌우 반전된 영상을 보여주는 경우가 많아, 화면 기준 오른쪽에 보이는 손이
  "left"로 분류될 수도 있습니다. 사용자 시점이 아닌 입력 프레임 기준으로 라벨이 결정된다고
  생각하면 됩니다.`,warning2Type:"info"},{name:"detector.fingers_up(side='right')",summary:"직전 process 결과에서 지정한 손의 펴진 손가락을 [엄지, 검지, 중지, 약지, 새끼] 순서의 0/1 리스트로 돌려줍니다.",details:`Args:
  side (str): 'right' 또는 'left'. 생략 시 기본값은 'right'.
Returns:
  list[int]: 길이 5. 1=펴짐, 0=접힘. 예) [1, 1, 0, 0, 0] = 엄지+검지만 폄.
  지정한 쪽 손이 검출되지 않았으면 [0, 0, 0, 0, 0].

`,example:`out_img, hands = detector.process(img)
right_fingers = detector.fingers_up('right')
left_fingers  = detector.fingers_up('left')
print('오른손:', right_fingers, '(', right_fingers.count(1), '개)')
print('왼손  :', left_fingers,  '(', left_fingers.count(1),  '개)')`,warning2:"process()를 먼저 호출해야 의미 있는 값이 나옵니다. 양손이 모두 검출된 경우 side로 어느 손을 볼지 명시하세요.",warning2Type:"info"},{name:"detector.distance(p1, p2, image, draw=True)",summary:"두 keypoint 사이의 픽셀 거리를 계산하고 (선택 시) 화면에 선과 점을 그립니다.",details:`Args:
  p1, p2 ((x, y, z)): keypoint 좌표. process()가 돌려준 dict의 "landmarks"에서 한 점씩 꺼내 넘깁니다.
  image (Image): 그릴 이미지
  draw (bool): True면 두 점 사이 마젠타 선과 양 끝/중점에 원을 그립니다.
Returns:
  (length, Image, [x1, y1, x2, y2, cx, cy])`,example:`out_img, hands = detector.process(img)
for h in hands:
    if h['handedness'] != 'right':
        continue
    pts = h['landmarks']
    length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
    print(f'오른손 엄지-검지 거리: {length:.1f}px')`},{name:"detector.recognize_sign(lm)",summary:'손 keypoint 리스트로부터 손 사인을 분류해 ID 문자열을 돌려줍니다. (예: "OK", "v", "fist")',details:`Args:
  lm (list): 한 손의 21개 (x, y, z) 픽셀 튜플 리스트. process()가 돌려준 dict의 "landmarks" 값을 넘기면 됩니다.
Returns:
  str | None: 인식된 사인 ID. 손이 없거나 어떤 사인에도 해당되지 않으면 None.



인식 가능한 13종 사인 ID는 아래 표를 참고하세요.`,table:{headers:["사인 ID","손 모양"],rows:[["OK","엄지-검지로 동그라미 + 나머지 세 손가락 폄"],["v","검지+중지 폄 (V / Peace)"],["fist","주먹 (모두 접음)"],["open_hand","다섯 손가락 모두 폄 (손바닥)"],["thumbs_up","엄지만 폄 (좋아요)"],["pointing","검지만 폄 (가리키기)"],["three","검지+중지+약지 폄"],["four","엄지 빼고 네 손가락 폄"],["pinky","새끼만 폄 (약속)"],["rock","검지+새끼 폄 (락앤롤)"],["call_me","엄지+새끼 폄 (전화 / 샤카)"],["ily","엄지+검지+새끼 폄 (ASL '사랑해')"],["L","엄지+검지 폄 (L자)"]]},example:`out_img, hands = detector.process(img)
for h in hands:
    sign = detector.recognize_sign(h['landmarks'])
    print(h['handedness'], '→', sign)`,warning2:`process()는 매 프레임 양손 각각에 대해 이 함수를 자동으로 호출하고 결과를 detector.sign["right"] / detector.sign["left"]에 채워둡니다.
직접 호출이 필요한 경우(예: 손 별도 조합 분석)에만 한 손의 landmarks를 골라 넘겨주세요.`,warning2Type:"info"},{name:"detector.sign",summary:"process()가 매 프레임 자동으로 계산해 두는 손별 사인 ID dict (읽기 전용 프로퍼티).",details:`Type: dict — 항상 정확히 두 개의 키 'left', 'right' 를 가집니다.

값 형태:
  detector.sign = {
      'left':  <왼손 사인 ID 또는 None>,
      'right': <오른손 사인 ID 또는 None>,
  }`,example:`out_img, hands = detector.process(img)
# process()가 끝난 시점에 detector.sign이 이미 손별로 갱신되어 있다.
if detector.sign['right'] == 'OK':
    print('오른손 OK 사인!')
if detector.sign['left'] == 'fist':
    print('왼손 주먹!')`,warning2:`process()를 호출하면 내부에서 검출된 각 손에 대해 recognize_sign(landmarks)을 실행하고 그 결과를 
detector.sign['left'] / detector.sign['right']에 저장합니다.
검출되지 않은 쪽 손의 값은 None 입니다(예: 오른손만 보이면 left=None).

process(draw=True)일 때는 각 손의 손목 위쪽에 "right: v" / "left: fist" 형식으로 라벨이 자동으로 그려집니다
(끄려면 process(..., show_label=False) 또는 HandsDetector(draw_label=False)).

인식 가능한 사인 ID 종류는 위 recognize_sign(lm) 표를 참고하세요.`,warning2Type:"info"},{name:"예제 1: 정적 이미지에서 양손 검출",summary:"이미지 파일을 읽어 양손 keypoint를 검출하고 결과를 화면에 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image

detector = HandsDetector()
img = cv2.imread('hand.jpg')
out_img, hands = detector.process(Image(img))

print('검출된 손 개수:', len(hands))
for h in hands:
    print(h['handedness'], '→ keypoints:', len(h['landmarks']))
cv2.imshow('hands', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 양손 트래킹",summary:"웹캠을 열어 매 프레임 양손을 검출하고 화면에 그립니다. 오른손은 옅은 보라색 선으로 시각적으로 구분됩니다. ESC로 종료.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))
    # 양손이 모두 보일 때 두 손 모두 그려지고, 오른손 선분만 옅은 보라색
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 양손 검지 끝점 좌표 출력",summary:"실시간 영상에서 오른손/왼손 검지 끝(8번 keypoint) 좌표를 각각 콘솔에 찍습니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))
    for h in hands:
        x, y, _ = h['landmarks'][8]   # INDEX_FINGER_TIP
        print(f"{h['handedness']} 검지 끝: ({x}, {y})")
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 양손 펴진 손가락 개수 세기",summary:"fingers_up('right'), fingers_up('left')로 양손의 펴진 손가락 패턴을 각각 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))
    if hands:
        right = detector.fingers_up('right')
        left  = detector.fingers_up('left')
        print(f'오른손: {right} ({right.count(1)}개) / 왼손: {left} ({left.count(1)}개)')
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 양손 각각의 엄지-검지 거리 측정",summary:"검출된 손마다 엄지(4)와 검지(8) 끝점 사이 거리를 측정해 화면에 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))
    for h in hands:
        pts = h['landmarks']
        length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
        print(f"{h['handedness']} 엄지-검지: {length:.0f}px")
    cv2.imshow('zoom gesture', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 양손 사인 동시 인식 (OK / V 등)",summary:"오른손과 왼손의 사인을 동시에 인식해 콘솔에 출력합니다. detector.sign dict로 양손 결과를 한 번에 읽습니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    # detector.sign은 항상 {'left': ..., 'right': ...} dict
    right_sign = detector.sign['right']
    left_sign  = detector.sign['left']

    if right_sign == 'OK' and left_sign == 'OK':
        print('양손 OK!')
    elif right_sign == 'v' or left_sign == 'v':
        print('V 사인 감지')
    else:
        if right_sign:
            print('오른손:', right_sign)
        if left_sign:
            print('왼손  :', left_sign)

    cv2.imshow('signs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 7: detector.sign dict로 손별 사인 변화 감지",summary:"process()가 매 프레임 자동 갱신하는 detector.sign dict를 읽어 오른손/왼손 각각의 사인이 바뀐 순간을 따로 잡아냅니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

prev = {'left': None, 'right': None}
while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # process()가 양손 각각에 recognize_sign을 호출해 detector.sign에 저장한다.
    out_img, _ = detector.process(Image(frame))

    for side in ('right', 'left'):
        cur = detector.sign[side]
        if cur != prev[side]:
            if cur:
                print(f'{side} 사인 변경: {cur}')
            prev[side] = cur

    cv2.imshow('sign property', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 8: 손목 위 자동 sign 라벨 오버레이 켜기/끄기",summary:'process()가 매 프레임 각 손의 손목 위쪽에 "right: v" / "left: fist" 라벨을 자동으로 그립니다. 생성자 draw_label과 호출 시 show_label로 토글할 수 있습니다.',details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image
from helloai import Keyboard

# 기본값 draw_label=True 이므로 각 손의 손목 위쪽에 sign 라벨이 자동 표시된다.
# 영구히 끄려면: detector = HandsDetector(draw_label=False)
detector = HandsDetector()
cap = cv2.VideoCapture()

label_on = True
while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # show_label은 이번 호출만 켜고/끔. None이면 생성자 draw_label을 따른다.
    out_img, _ = detector.process(Image(frame), show_label=label_on)

    cv2.imshow('auto label', out_img.frame)
    key = cv2.waitKey(1)
    if key == Keyboard.ESC:
        break
    if key == ord('t'):  # 't' 키로 라벨 토글
        label_on = not label_on

cap.release()
cv2.destroyAllWindows()`}]},{id:"face",title:"Face (FaceDetector)",description:"얼굴 메시 478점·22점 서브셋(눈썹·눈·코·입)과 표정(blendshape) 52계수를 검출합니다.",icon:"face_4",image:a,entries:[{name:"from helloai import FaceDetector, Image",summary:"얼굴 검출기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import FaceDetector, Image"},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을, FaceDetector에는 Image(frame)을 넣습니다. Image에서 frame은 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()              # cv2 → raw frame
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달
    out_img, points = detector.process(Image(frame))

    # cv2.imshow에는 다시 raw frame이 필요하므로 .frame 으로 꺼냄
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceDetector(min_detection_confidence=0.5, expressions=False, draw_label=True)",summary:"얼굴 검출기를 만듭니다. 첫 호출 시 모델(약 3MB)을 다운로드합니다.",details:`Args:
  min_detection_confidence (float): 0~1. 낮을수록 잘 탐지하지만 오탐 증가.
  expressions (bool): True면 표정(blendshape) 계수를 함께 계산.
    기본 False. 켜면 detector.blendshapes / .expression /
    .expression_score 프로퍼티로 표정 정보를 읽을 수 있습니다.
  draw_label (bool): True면 process()가 영상의 좌상단에 detector.expression 라벨을
    자동으로 그립니다. 단, expressions=False면 expression이 항상 None이라 표시 자체가
    일어나지 않습니다(둘 다 켜야 라벨이 보입니다).
Returns: FaceDetector 객체`,example:`detector = FaceDetector(min_detection_confidence=0.5)
# 표정까지 보고 싶으면:
detector = FaceDetector(expressions=True)`},{name:"detector.process(img, draw=True, show_label=None)",summary:"얼굴 메시를 검출하고 22점 서브셋을 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지를 감싼 Image 객체
  draw (bool): True면 메시 + 22점을 결과 이미지에 그립니다.
  show_label (bool|None): True/False면 이 호출에서만 좌상단 expression 라벨 표시를
    켜/끄고, None이면 생성자의 draw_label을 따릅니다. expressions=True 일 때만 의미가 있습니다.
Returns:
  (Image, list): 시각화된 Image, [(x, y, z), ...] 22개 — 얼굴 윤곽/눈썹/눈/코/입
  얼굴 미검출 시 (원본 img, [])`,example:`out_img, points = detector.process(img)
if points:
    print('얼굴 점 22개:', len(points))
    print('코끝(NOSE 4번):', points[15])`},{name:"detector.blendshapes  (expressions=True 일 때만)",summary:"52개 표정 계수 dict[str, float]. 직전 process() 결과 기준.",details:`MediaPipe FaceLandmarker 가 정의한 52개 표정 단위(action unit)와 점수
(0.0 ~ 1.0)를 dict로 돌려줍니다. expressions=False 로 만든 검출기거나
직전 프레임에 얼굴이 잡히지 않았으면 None.

주요 카테고리 예:
  mouthSmileLeft / mouthSmileRight  — 입꼬리 올라감 (미소)
  mouthFrownLeft / mouthFrownRight  — 입꼬리 내려감 (찡그림)
  browDownLeft / browDownRight      — 눈썹 내림 (화남)
  browInnerUp                       — 눈썹 안쪽 올림 (놀람·슬픔)
  eyeBlinkLeft / eyeBlinkRight      — 눈 깜빡임
  jawOpen                           — 입 벌림
  cheekPuff                         — 볼 부풀리기
  noseSneerLeft / noseSneerRight    — 코 찡그림
  _neutral                          — 무표정 정도`,example:`detector = FaceDetector(expressions=True)
out_img, _ = detector.process(Image(frame))
bs = detector.blendshapes
if bs:
    print('미소 좌:', bs.get('mouthSmileLeft', 0))
    print('미소 우:', bs.get('mouthSmileRight', 0))`},{name:"detector.expression  (expressions=True 일 때만)",summary:"_neutral 을 제외한 최상위 blendshape 카테고리 이름.",details:`52개 blendshape 중 _neutral 을 빼고 가장 점수가 높은 카테고리를 반환.
예: "mouthSmileLeft", "browDownLeft", "jawOpen".
얼굴 미검출 또는 모두 _neutral 인 경우 None.

process(draw=True) + expressions=True 조건에서 expression 값이 자동으로 영상 좌상단에 그려집니다(끄려면 process(..., show_label=False) 또는 FaceDetector(..., draw_label=False)).

*주의*: "happy/sad/angry" 같은 큰 분류가 아니라 미세한 액션 단위 이름
입니다. 큰 라벨이 필요하면 여러 blendshape 을 직접 조합하거나
FaceClassifier(.fcm) 로 학습된 모델을 쓰세요.`,example:`if detector.expression:
    print(detector.expression)  # 예: 'mouthSmileLeft'`},{name:"detector.expression_score  (expressions=True 일 때만)",summary:"위 expression 카테고리의 점수 (0.0~1.0).",details:`detector.expression 이 가리키는 카테고리의 점수.
얼굴 미검출 또는 expressions=False 면 0.0.`,example:`name = detector.expression
score = detector.expression_score
if name and score > 0.5:
    print(f'{name}: {score:.2f}')`},{name:"예제 1: 정적 이미지 얼굴 메시 표시",summary:"이미지 파일에서 얼굴을 검출하고 메시 + 22점을 그려서 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image

detector = FaceDetector()
img = cv2.imread('face.jpg')
out_img, points = detector.process(Image(img))

print('22점 검출:', len(points))
cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 얼굴 메시",summary:"웹캠을 열어 매 프레임 얼굴 메시를 화면에 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, points = detector.process(Image(frame))
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 코끝 좌표 출력",summary:"검출된 22점 중 코끝(NOSE)의 좌표를 매 프레임 콘솔에 찍습니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

# points의 인덱스 매핑은 LANDMARK_INDICES_68 순서를 따릅니다.
# 코는 [14]=NOSE 5번, [15]=NOSE 4번(끝점).
detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, points = detector.process(Image(frame))
    if points:
        x, y, _ = points[15]
        print(f'코끝: ({x}, {y})')
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 좌우 입꼬리 거리로 미소 감지",summary:'입의 좌측 끝(61)과 우측 끝(409) 사이 거리가 어느 임계값을 넘으면 "미소" 출력.',details:null,example:`import web_cv2 as cv2
import math
from helloai import FaceDetector, Image
from helloai import Keyboard

# points[18] = LIPS 61(왼끝), points[20] = LIPS 409(오른끝)
detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, points = detector.process(Image(frame))
    if points:
        lx, ly, _ = points[18]
        rx, ry, _ = points[20]
        width = math.hypot(rx - lx, ry - ly)
        print(f'입 너비: {width:.0f}px',
              '(미소!)' if width > 80 else '')
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: blendshape 으로 미소·입벌림·눈깜빡임 감지",summary:"expressions=True 옵션으로 표정 계수를 받아 임계값으로 표정을 판별합니다.",details:`expressions=True 를 켜면 478개 랜드마크 외에 52개 표정 계수가 함께
계산됩니다. 학습 모델(.fcm) 없이도 즉시 미소/입벌림/눈깜빡임 같은
기본 표정을 정량화할 수 있습니다.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    bs = detector.blendshapes
    if bs:
        smile = (bs.get('mouthSmileLeft', 0)
                 + bs.get('mouthSmileRight', 0)) / 2
        jaw = bs.get('jawOpen', 0)
        blink = (bs.get('eyeBlinkLeft', 0)
                 + bs.get('eyeBlinkRight', 0)) / 2

        if smile > 0.5:
            print(f'미소! ({smile:.2f})')
        if jaw > 0.4:
            print(f'입 벌림 ({jaw:.2f})')
        if blink > 0.5:
            print(f'눈 감음 ({blink:.2f})')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 가장 두드러진 표정 한 줄 출력",summary:"detector.expression / .expression_score 로 최상위 표정을 매 프레임 표시.",details:`expression 은 _neutral 을 제외한 최상위 blendshape 이름이라 무표정에는
직전 표정이 약하게 남거나 None 이 나올 수 있습니다. 임계값(예: 0.4)을
걸어 잡음을 줄이세요.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    name = detector.expression
    score = detector.expression_score
    if name and score > 0.4:
        print(f'{name}: {score:.2f}')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 7: 자동 expression 라벨 오버레이",summary:"expressions=True + draw_label=True(기본) 조건에서 detector.expression 이 매 프레임 자동으로 좌상단에 표시됩니다.",details:`표정을 화면에 그리려면 두 가지 모두 켜져 있어야 합니다.
  1) FaceDetector(expressions=True) — 그래야 expression 값이 계산됩니다.
  2) draw_label=True (기본) — process()가 좌상단에 자동으로 putText 합니다.
단발성으로 끄고 싶다면 process(..., show_label=False).`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image
from helloai import Keyboard

# expression 이 None 이 아니어야 표시되므로 expressions=True 가 필수.
detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # 라벨이 자동으로 영상 좌상단에 그려진다.
    out_img, _ = detector.process(Image(frame))

    cv2.imshow('auto expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"pose",title:"Pose (PoseDetector)",description:"전신 포즈 33개 keypoint를 검출하고 각도/거리를 계산합니다.",icon:"directions_run",image:r,entries:[{name:"from helloai import PoseDetector, Image",summary:"포즈 검출기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import PoseDetector, Image"},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을, PoseDetector에는 Image(frame)을 넣습니다. Image에서 frame은 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()              # cv2 → raw frame
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달
    out_img, lmlist = detector.process(Image(frame))

    # cv2.imshow에는 다시 raw frame이 필요하므로 .frame 으로 꺼냄
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseDetector(draw_label=True)",summary:"포즈 검출기를 만듭니다. 첫 호출 시 모델(약 5MB)을 다운로드합니다.",details:`Args:
  draw_label (bool): True면 process()가 매 프레임 영상의 좌상단에 detector.pose 라벨을 자동으로 그립니다. 끄려면 False.
Returns: PoseDetector 객체`,example:"detector = PoseDetector()",warning2:`33개 keypoint 인덱스: 0=NOSE, 11/12=L/R 어깨, 13/14=L/R 팔꿈치,
15/16=L/R 손목, 23/24=L/R 엉덩이, 25/26=L/R 무릎, 27/28=L/R 발목.`,warning2Type:"info"},{name:"detector.process(image, draw=True, line_width=4, circle_radius=6, show_label=None)",summary:"포즈를 검출하고 33개 keypoint의 픽셀 좌표 리스트를 돌려줍니다.",details:`Args:
  image (Image): 입력 이미지
  draw (bool): True면 보라색 스켈레톤을 그립니다.
  line_width (int), circle_radius (int): 시각화 크기
  show_label (bool|None): True/False면 이 호출에서만 좌상단 pose 라벨 표시를 켜/끄고, None이면 생성자의 draw_label을 따릅니다.
Returns:
  (Image, list): 시각화된 Image, [(x, y, z), ...] 33개
  미검출 시 (원본 image, [])`,example:`out_img, lmlist = detector.process(img)
if lmlist:
    nose = lmlist[0]
    print('코 좌표:', nose[:2])`},{name:"detector.calc_angle(image, p1, p2, p3, draw=True)",summary:"세 점 (p1-p2-p3)으로 이루는 각도(p2 기준)를 도(degree)로 계산합니다.",details:`Args:
  image (Image): 그릴 이미지
  p1, p2, p3 ((x, y, z)): 세 keypoint
  draw (bool): True면 흰 선 + 빨간 원 + 각도 숫자를 표시
Returns:
  (angle, Image): 각도(0~360, float), 시각화된 Image`,example:`out_img, lmlist = detector.process(img)
if lmlist:
    angle, out_img = detector.calc_angle(
        out_img, lmlist[11], lmlist[13], lmlist[15]
    )
    print(f'왼팔 팔꿈치 각도: {angle:.0f}°')`},{name:"detector.distance(p1_idx, p2_idx, image, draw=True)",summary:"두 keypoint 인덱스 사이의 거리를 계산합니다 (HandsDetector.distance와 인자가 다름).",details:`Args:
  p1_idx, p2_idx (int): keypoint 인덱스 (0~32)
  image (Image): 그릴 이미지
  draw (bool): True면 마젠타 선 + 원을 그림
Returns:
  (length, Image, [x1, y1, x2, y2, cx, cy])`,example:`length, out_img, _ = detector.distance(11, 15, out_img)
print(f'어깨~손목 거리: {length:.0f}px')`},{name:"detector.pose",summary:"process() 직후 현재 사람이 취한 포즈를 문자열로 돌려줍니다. 판별 불가/미검출 시 None.",details:`랜드마크의 상대 좌표(어깨 너비를 단위로)로 우선순위에 따라 단일 라벨을 결정합니다.
별도 호출 없이 process() 안에서 자동 갱신되므로 detector.pose 로 바로 읽으면 됩니다.

process(draw=True)일 때는 detector.pose 값이 자동으로 영상 좌상단에 그려집니다(끄려면 process(..., show_label=False) 또는 PoseDetector(draw_label=False)).

참고:
  • 좌/우는 화면 기준입니다 (카메라 미러 모드와 무관).
  • 한 프레임에서 여러 조건이 맞으면 아래 표 순서(우선순위)로 단일 라벨이 선택됩니다.
  • 각도/거리 임계값은 어깨 너비를 기준으로 정규화되어 카메라 거리에 무관합니다.

인식 라벨 (10종):`,table:{headers:["라벨","조건"],rows:[['"lying"',"몸이 수평 (어깨/엉덩이/무릎 y 거의 동일)"],['"arms_crossed"',"양 손목이 반대쪽 어깨 근처, 어깨 아래"],['"hands_up"',"양 손목이 양 어깨보다 위 (만세)"],['"t_pose"',"양 팔이 수평으로 어깨 바깥까지 뻗음"],['"left_hand_up"',"화면 왼쪽 손만 어깨 위"],['"right_hand_up"',"화면 오른쪽 손만 어깨 위"],['"squat"',"엉덩이가 무릎 근처/아래로 내려감"],['"sitting"',"무릎 각도 약 60°~130° (다리 굽힘)"],['"bending"',"어깨가 엉덩이 가까이로 내려감 (허리 굽힘)"],['"standing"',"어깨 < 엉덩이 < 무릎 < 발목 순으로 수직 정렬"],["None","어느 조건도 만족하지 않거나 사람이 검출되지 않음"]]},example:`out_img, lmlist = detector.process(Image(frame))
if detector.pose == 'hands_up':
    print('만세!')
elif detector.pose is None:
    print('포즈를 인식할 수 없습니다')`},{name:"예제 1: 정적 이미지 포즈 검출",summary:"이미지 파일에서 전신 포즈를 검출하고 스켈레톤을 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image

detector = PoseDetector()
img = cv2.imread('pose.jpg')
out_img, lmlist = detector.process(Image(img))

print('keypoints:', len(lmlist))
cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 포즈",summary:"웹캠을 열어 매 프레임 포즈 스켈레톤을 화면에 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 어깨 좌표 출력",summary:"왼쪽/오른쪽 어깨(11, 12) 좌표를 매 프레임 콘솔에 찍습니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))
    if lmlist:
        l = lmlist[11]   # LEFT_SHOULDER
        r = lmlist[12]   # RIGHT_SHOULDER
        print(f'L 어깨 {l[:2]}  R 어깨 {r[:2]}')
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 왼팔 팔꿈치 각도 측정",summary:"어깨(11)-팔꿈치(13)-손목(15)으로 팔꿈치 각도를 실시간 측정합니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))
    if lmlist:
        angle, out_img = detector.calc_angle(
            out_img, lmlist[11], lmlist[13], lmlist[15]
        )
        print(f'왼팔 팔꿈치 각도: {angle:.0f}°')
    cv2.imshow('elbow angle', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 어깨~손목 거리 측정",summary:"distance(p1_idx, p2_idx)로 왼쪽 어깨-손목 거리를 화면에 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))
    if lmlist:
        length, out_img, _ = detector.distance(11, 15, out_img)
        print(f'어깨~손목: {length:.0f}px')
    cv2.imshow('reach', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 포즈 분류 (detector.pose)",summary:"매 프레임 detector.pose 라벨을 화면 좌상단에 표시합니다. 만세/T자/스쿼트/앉기/눕기 등을 시도해 보세요.",details:`참고: 이제 detector가 기본으로 라벨을 좌상단에 자동으로 그리므로, 이 예제처럼
cv2.putText 로 직접 그리지 않아도 됩니다. 자동 표시를 끄려면
process(..., show_label=False) 또는 PoseDetector(draw_label=False)를 사용하세요.`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image
from helloai import Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    label = detector.pose if detector.pose else 'unknown'
    cv2.putText(
        out_img.frame, label, (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3,
    )
    cv2.imshow('pose label', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"ocr",title:"OCR (텍스트 인식)",description:"이미지의 영문/한글 텍스트를 추출합니다 (Tesseract.js 기반).",icon:"document_scanner",entries:[{name:"from helloai import OCR, Image",summary:"OCR 클래스와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import OCR, Image"},{name:"OCR()",summary:"한/영 OCR 엔진을 만듭니다. 첫 호출 시 언어 데이터(언어당 약 5–10MB)를 다운로드합니다.",details:`Args: 없음 (영어+한국어 고정)
Returns: OCR 객체

내부적으로 easyocr.Reader(["en", "ko"])를 사용하지만 실제 추론은
브라우저의 Tesseract.js로 라우팅됩니다.`,example:"ocr = OCR()"},{name:"ocr.readtext(img, isdraw=True)",summary:"이미지에서 텍스트를 인식하고 결과 리스트와 시각화된 이미지를 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지
  isdraw (bool): True면 인식된 단어 주변에 초록 박스 + 빨간 라벨을 그립니다.
Returns:
  (results, Image): results = [(bbox, text, prob), ...]
    bbox = [TL, TR, BR, BL] 4점 ([[x,y], ...])
    text = 인식된 문자열
    prob = 0~1 신뢰도`,example:`results, out_img = ocr.readtext(Image(img))
for (bbox, text, prob) in results:
    print(f'{text!r}  prob={prob:.2f}')`},{name:"예제 1: 정적 이미지에서 영문 인식",summary:"이미지 파일에서 텍스트를 읽고 인식 결과를 콘솔에 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    print(f'{text!r}  ({prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 한글 텍스트 인식",summary:"한글이 포함된 이미지에서도 동일한 코드로 인식됩니다 (en+ko 동시 지원).",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('hangul.png')
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    print(f'[{prob:.2f}] {text}')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 3: 신뢰도(prob) 0.7 이상만 출력",summary:"낮은 신뢰도의 잘못된 인식은 걸러내고 확실한 결과만 사용합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    if prob < 0.7:
        continue
    print(f'{text}  (prob {prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 4: 인식된 박스 좌표만 추출 (시각화 끄기)",summary:"isdraw=False로 박스 그리기를 끄고 좌표/텍스트만 활용합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')
results, _ = ocr.readtext(Image(img), isdraw=False)

for (bbox, text, prob) in results:
    tl = bbox[0]      # 좌상단
    br = bbox[2]      # 우하단
    print(f'{text}  TL={tl}  BR={br}')`}]},{id:"qr",title:"QR (QRReader)",description:"카메라/이미지에서 QR 코드를 디코드합니다.",icon:"qr_code_scanner",entries:[{name:"from helloai import QRReader, Image",summary:"QR 리더와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import QRReader, Image"},{name:"QRReader()",summary:"QR 리더를 만듭니다. 모델 다운로드 없음, 즉시 사용 가능.",details:`Args: 없음
Returns: QRReader 객체

jsQR 라이브러리(약 30KB) 기반으로 추가 네트워크 다운로드가 없습니다.`,example:"qr = QRReader()"},{name:"qr.process(img, draw=True)",summary:"이미지에서 QR을 디코드하고 결과 리스트와 시각화된 이미지를 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지
  draw (bool): True면 QR 외곽 4면을 초록색으로, 디코드된 텍스트를 빨간색으로 그립니다.
Returns:
  (results, Image): results = [(bbox, data), ...]
    bbox = [TL, TR, BR, BL] 4점
    data = 디코드된 문자열

한 프레임당 최대 1개 (jsQR 제약).`,example:`results, out_img = qr.process(Image(frame))
for (bbox, data) in results:
    print('QR:', data)`},{name:"qr.read(img)",summary:"process의 단축형 — 디코드된 문자열만 리스트로 돌려줍니다 (시각화 없음).",details:`Args:
  img (Image): 입력 이미지
Returns:
  list[str]: 디코드된 문자열 (현재 최대 1개 원소)`,example:`texts = qr.read(Image(frame))
if texts:
    print(texts[0])`},{name:"예제 1: 정적 이미지의 QR 디코드",summary:"이미지 파일에 그려진 QR을 한 번에 읽습니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')
results, out_img = qr.process(Image(img))

for (bbox, data) in results:
    print('QR 데이터:', data)

cv2.imshow('qr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 스캔",summary:"웹캠 앞에 QR을 비추면 매 프레임 디코드 결과를 콘솔에 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image
from helloai import Keyboard

qr = QRReader()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))
    for (bbox, data) in results:
        print('QR:', data)
    cv2.imshow('QR', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 같은 QR 중복 출력 방지",summary:"같은 코드를 들고 있는 동안에는 한 번만 출력합니다 (last 비교 패턴).",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image
from helloai import Keyboard

qr = QRReader()
cap = cv2.VideoCapture()
last = None

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))
    for (bbox, data) in results:
        if data != last:
            print('NEW QR:', data)
            last = data
    cv2.imshow('QR', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: URL인 경우만 출력",summary:"디코드된 데이터가 http://나 https://로 시작할 때만 처리합니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image
from helloai import Keyboard

qr = QRReader()
cap = cv2.VideoCapture()
last = None

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))
    for (bbox, data) in results:
        if data != last and data.startswith(('http://', 'https://')):
            print('URL 발견:', data)
            last = data
    cv2.imshow('QR URL Scanner', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"tm_image",title:"TM Image (Teachable Machine)",description:"Google Teachable Machine에서 학습한 이미지 분류 모델을 카메라/이미지에 적용합니다.",icon:"category",externalLink:{href:"https://teachablemachine.withgoogle.com/train/image",label:"Teachable Machine 열기",icon:"open_in_new"},image:i,imageNote:`이 페이지의 API를 사용하려면 Teachable Machine에서 학습이 끝난 모델을 "Export Model" → "Tensorflow" 탭의 "Tensorflow.js" 옵션에서 URL 또는 파일을 내려받아야 합니다.
다운로드한 모델 파일(.zip)은 좌측 File Explorer에 업로드한 뒤, 코드에서 그 경로를 load_model()에 전달해 사용합니다.`,entries:[{name:"from helloai import TMImageModel, Image",summary:"Teachable Machine 이미지 분류기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 붙여 사용합니다.",example:"from helloai import TMImageModel, Image"},{name:"TMImageModel()",summary:"Teachable Machine 이미지 모델 객체를 만듭니다 (모델은 아직 비어 있음).",details:`Args: 없음
Returns: TMImageModel 객체

내부적으로 @teachablemachine/image (TensorFlow.js 1.x) 가 메인 스레드에서
실행되며, 첫 load_model() 호출 시점에 약 1MB의 라이브러리가 lazy 다운로드됩니다.`,example:"tm = TMImageModel()"},{name:"tm.load_model(url_or_path)",summary:"Teachable Machine URL 또는 업로드한 .zip 경로로 모델을 로드합니다.",details:`Args:
  url 형태 (str): TM에서 "Tensorflow.js" 탭의 "Upload my model" 옵션으로
                  발급된 공유 URL.
                  예) "https://teachablemachine.withgoogle.com/models/VQ9dhejr9/"
                  끝의 슬래시는 자동으로 보정됩니다.
  파일 경로 (str): /work/ 기준 상대경로 또는 절대경로. TM에서 "Tensorflow.js" 탭의
                   "Download my model"로 받은 .zip(=model.json + weights.bin +
                   metadata.json)을 좌측 Explorer에 업로드한 뒤 그 파일명을 전달.
Returns: 로딩 성공 시 True

주의: 브라우저 TFJS는 keras .h5 파일을 직접 열지 못합니다. 반드시 "Tensorflow.js"
export로 받은 URL 또는 .zip 파일을 사용하세요.`,example:`tm = TMImageModel()
tm.load_model("https://teachablemachine.withgoogle.com/models/VQ9dhejr9/")
# 또는 Explorer에 업로드한 zip 파일 경로:
tm.load_model("my_model.zip")
print('클래스:', tm.labels)`},{name:"tm.process(img)",summary:"입력 이미지를 분류하고 가장 확률이 높은 클래스 라벨(문자열)을 돌려줍니다.",details:`Args:
  img (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
Returns:
  str: 가장 확률이 높은 클래스 라벨. 모델 미로딩이거나 입력이 비면 "" 반환.

직전 호출의 신뢰도는 tm.confidence 로 따로 읽을 수 있습니다.`,example:`label = tm.process(Image(frame))
print(label, tm.confidence)`},{name:"tm.labels",summary:"모델의 클래스 라벨 리스트(읽기 전용).",details:`Returns:
  list[str]: TM에서 지정한 클래스 이름 순서대로의 리스트.

load_model() 이후에 사용 가능합니다.`,example:`print(tm.labels)
# 예: ["Class 1", "Class 2", "Class 3"]`},{name:"tm.confidence",summary:"직전 process() 결과의 최고 클래스 확률(0.0 ~ 1.0).",details:`Returns:
  float: 0~1 사이 확률. 소수 셋째 자리까지 반올림.

process()를 한 번도 호출하지 않았다면 None 입니다.`,example:`label = tm.process(Image(frame))
if tm.confidence and tm.confidence >= 0.8:
    print('확신:', label)`},{name:"tm.summary()",summary:"로드된 모델의 클래스 라벨을 콘솔에 출력합니다.",details:`Args: 없음
Returns: 없음

모델이 로딩되지 않았으면 안내 메시지를 출력합니다.`,example:"tm.summary()"},{name:"예제 1: 모델 로딩 + 클래스 확인",summary:"URL로 모델을 받아오고 클래스 이름을 확인합니다 (가장 단순한 시작점).",details:null,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

print('클래스 수:', len(tm.labels))
for i, name in enumerate(tm.labels):
    print(f'  {i}: {name}')`},{name:"예제 2: 정적 이미지 1장 분류",summary:"이미지 파일 하나를 모델에 넣어 라벨과 신뢰도를 한 번 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')
if img is None:
    print('test.png 파일을 프로젝트에 추가해 주세요')
else:
    label = tm.process(Image(img))
    print(f'결과: {label}  (신뢰도 {tm.confidence:.2f})')

    cv2.imshow('tm', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"예제 3: 웹캠 실시간 분류",summary:"매 프레임 카메라 영상을 분류해 라벨을 콘솔에 출력합니다. ESC로 종료.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image
from helloai import Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    print(f'{label}  ({tm.confidence:.2f})')
    cv2.imshow('tm', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 신뢰도 임계값 필터링",summary:'신뢰도가 0.8 미만이면 "..."을 출력해 잡음 분류를 무시합니다.',details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image
from helloai import Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
THRESHOLD = 0.8

tm = TMImageModel()
tm.load_model(URL)

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    if tm.confidence and tm.confidence >= THRESHOLD:
        print(f'>> {label}  ({tm.confidence:.2f})')
    else:
        print('...')
    cv2.imshow('tm', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 라벨/신뢰도 화면 오버레이",summary:"결과 라벨과 신뢰도를 매 프레임 영상 좌상단에 그려서 보여줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image
from helloai import Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    text = f'{label}  {tm.confidence:.2f}' if label else 'no model'
    cv2.putText(frame, text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    cv2.imshow('tm overlay', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 라벨 변경 시점만 출력 + 클래스별 카운트",summary:"같은 라벨이 이어지는 동안에는 출력을 억제하고, 라벨이 바뀔 때마다 누적 카운트를 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image
from helloai import Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
THRESHOLD = 0.7

tm = TMImageModel()
tm.load_model(URL)

counts = {name: 0 for name in tm.labels}
last = None

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    confident = tm.confidence and tm.confidence >= THRESHOLD

    if confident and label != last:
        counts[label] = counts.get(label, 0) + 1
        last = label
        print(f'CHANGE -> {label}')
        for name, n in counts.items():
            print(f'  {name}: {n}')

    cv2.imshow('tm', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"image_classifier",title:"Image (ImageClassifier)",description:"좌측 Classify 패널에서 학습해 저장한 .fcm 이미지 분류 모델을 카메라/이미지에 적용합니다.",icon:"image_search",notice:'실행 전에 먼저 좌측 Classify 패널의 [Image] 탭에서 클래스를 학습하고 ".fcm" 파일로 내보내 두어야 합니다. 모델 파일이 없으면 ImageClassifier(...) 호출에서 FileNotFoundError가 발생합니다.',entries:[{name:"from helloai import ImageClassifier, Image",summary:"이미지 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 붙여 사용합니다.

ImageClassifier는 사진 한 장 전체의 "분위기/대상"을 분류하는 모델입니다.
예) 컵 vs 책 vs 빈손, 마스크 착용 vs 미착용, 사과 vs 바나나 vs 포도 등.
Classify 패널에서 클래스마다 사진을 모아 학습하면 자동으로 .fcm 파일이 만들어집니다.`,example:"from helloai import ImageClassifier, Image"},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`ImageClassifier는 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널이 담당하고, 그 결과가 ".fcm"이라는 한 개의 파일로 저장됩니다.

단계별로 정리하면 다음과 같습니다.

① 좌측 사이드바에서 Classify (분류) 패널을 엽니다.
② [Image] 탭을 선택하고, 분류하고 싶은 클래스(예: cup / book / empty)를
   2개 이상 만든 뒤 각 클래스마다 웹캠으로 사진을 여러 장 캡처합니다.
③ "Train" 버튼으로 학습 → 끝나면 "💾 .fcm 저장" 버튼이 활성화됩니다.
④ 적당한 이름(예: cup_book.fcm)으로 프로젝트 폴더에 저장합니다.
⑤ 코드에서는 그 경로를 ImageClassifier(...)에 넘겨주면 됩니다.

경로 규칙: "models/cup_book.fcm" 처럼 프로젝트 루트 기준 상대경로를 권장합니다.
         절대경로(/work/...)도 가능합니다.`,example:`# 프로젝트 폴더 구조 예시
# my_project/
#   ├─ main.py            ← 지금 작성 중인 코드
#   └─ cup_book.fcm       ← Classify 패널에서 저장한 모델

from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')   # ← 같은 폴더면 파일명만
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (FaceDetector와 동일한 규칙)",summary:"cv2 함수에는 frame을, ImageClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image를 그대로 돌려줍니다.",example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image
from helloai import Keyboard

clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                     # cv2 → raw frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))  # 분류기 → Image로 감싸기
    cv2.imshow('image', out_img.frame)         # cv2.imshow → .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warning2:`web_cv2(cv2)와 ImageClassifier는 같은 카메라 프레임을 다루지만, 받는 형식이 다릅니다.
검출기(FaceDetector / HandsDetector / PoseDetector)와 똑같은 세 가지 규칙을 따릅니다.

① cv2.* 함수 → raw frame을 그대로 넣는다
     ok, frame = cap.read()
     cv2.imshow("camera", frame)

② ImageClassifier.process() → frame을 Image()로 감싸서 넣는다
     out_img, result = clf.process(Image(frame))

   주의: ImageClassifier는 cv2.imread() / cap.read()로 얻은 프레임만 받습니다.
         numpy 배열을 직접 만들어 넣으면 TypeError가 납니다.

③ Image에서 cv2용 frame 꺼내기 → .frame 속성을 쓴다
     cv2.imshow("image", out_img.frame)

한눈에 보기:
  cv2.xxx(frame, ...)              ← raw frame
  clf.process(Image(frame))        ← Image로 감싸기
  out_img.frame                    ← Image → raw frame`,warning2Type:"info"},{name:"ImageClassifier(model_path, draw_label=True)",summary:".fcm 파일을 읽어 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: ImageClassifier 객체

`,example:`clf = ImageClassifier('cup_book.fcm')
print('클래스:', clf.labels)`,warning2:`내부적으로 MobileNetV2의 1280차원 특징을 메인 스레드에서 추출한 뒤,
Classify 패널이 학습한 가벼운 분류 헤드(softmax / MLP / SVM / RandomForest)를 통과시킵니다.
첫 호출 시 MobileNet 가중치(약 9MB)가 1회 다운로드된 뒤 캐시됩니다.`,warning2Type:"info"},{name:"clf.process(image, draw=True)",summary:"입력 이미지를 분류해 (Image, Result)를 돌려줍니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True이고 생성자에서 draw_label=True 였다면 라벨 텍스트를 화면에 그림
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 라벨 그려짐)
    - Result: 아래 "Result 객체" 항목 참고`,example:`out_img, result = clf.process(Image(frame))
print(result.label, '신뢰도:', f'{result.confidence:.2f}')`,warning2:"주의: cv2.imread() / cap.read() 가 돌려준 frame만 입력으로 받습니다. 직접 만든 numpy 배열을 Image()로 감싸 넣으면 TypeError가 납니다."},{name:"Result 객체 — label / confidence / probabilities / labels",summary:"process()가 돌려주는 분류 결과 객체. 어떤 클래스인지·얼마나 확신하는지가 담겨 있습니다.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름. 예) "cup"
  result.index (int): 그 클래스의 인덱스 (labels 리스트에서의 위치)
  result.confidence (float): 0.0 ~ 1.0 — 가장 높은 클래스의 확률
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 모델이 가진 전체 클래스 이름 리스트
  result.landmarks: ImageClassifier에서는 항상 None
                   (얼굴/손/포즈 분류기에서만 keypoint 좌표가 들어옵니다)`,example:`out_img, result = clf.process(Image(frame))
print(result.label)
print(f'{result.confidence * 100:.1f}%')
for name, p in zip(result.labels, result.probabilities):
    print(f'  {name}: {p:.2f}')`},{name:"clf.labels (속성)",summary:"모델에 학습된 클래스 이름 리스트(읽기 전용).",details:`Returns:
  list[str]: Classify 패널에서 만든 클래스 이름 순서대로의 리스트.`,example:`print(clf.labels)
# 예) ['cup', 'book', 'empty']`},{name:"clf.close()",summary:"모델을 메모리에서 내립니다. 보통 명시적으로 호출하지 않아도 자동 정리됩니다.",details:`여러 모델을 번갈아 쓰는 긴 스크립트에서 메모리를 명시적으로 풀고 싶을 때 사용합니다.
한 번 close된 객체는 다시 process() 할 수 없습니다.`,example:"clf.close()"},{name:"예제 1: 정적 이미지 1장 분류",summary:"이미지 파일을 한 장 읽어 가장 확률이 높은 클래스와 신뢰도를 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')

img = cv2.imread('test.png')
if img is None:
    print('test.png를 프로젝트에 추가해 주세요')
else:
    out_img, result = clf.process(Image(img))
    print(f'결과: {result.label}  ({result.confidence * 100:.1f}%)')
    cv2.imshow('image', out_img.frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 분류",summary:"매 프레임 카메라 영상을 분류해 라벨을 콘솔에 출력합니다. ESC로 종료.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image
from helloai import Keyboard

clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    print(f'{result.label}  ({result.confidence:.2f})')
    cv2.imshow('image', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 신뢰도 임계값 필터링",summary:'신뢰도가 0.8 미만이면 "..."을 출력해 잡음 분류를 무시합니다.',details:`카메라가 흔들리거나 학습 때 보지 못한 장면이 들어오면 모델은 종종
낮은 확률로 아무 클래스나 골라버립니다. THRESHOLD를 두면 이런 깜빡임을 줄일 수 있습니다.`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image
from helloai import Keyboard

THRESHOLD = 0.8
clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.confidence >= THRESHOLD:
        print(f'>> {result.label}  ({result.confidence:.2f})')
    else:
        print('...')
    cv2.imshow('image', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 모든 클래스 확률을 화면에 표시",summary:"probabilities를 이용해 클래스별 점수를 화면 좌상단에 한 줄씩 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image
from helloai import Keyboard

clf = ImageClassifier('cup_book.fcm', draw_label=False)  # 직접 그릴 거라 끔
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 라벨이 바뀔 때만 출력 + 누적 카운트",summary:"같은 라벨이 이어지는 동안에는 출력을 억제하고, 라벨이 바뀔 때마다 클래스별 카운트를 보여줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image
from helloai import Keyboard

THRESHOLD = 0.7
clf = ImageClassifier('cup_book.fcm')

counts = {name: 0 for name in clf.labels}
last = None

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    confident = result.confidence >= THRESHOLD

    if confident and result.label != last:
        counts[result.label] = counts.get(result.label, 0) + 1
        last = result.label
        print(f'CHANGE -> {result.label}')
        for name, n in counts.items():
            print(f'  {name}: {n}')

    cv2.imshow('image', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"face_classifier",title:"Face (FaceClassifier)",description:"좌측 Classify 패널에서 학습해 저장한 .fcm 얼굴 keypoint 분류 모델을 카메라/이미지에 적용합니다.",icon:"sentiment_satisfied",image:a,notice:'실행 전에 먼저 좌측 Classify 패널의 [Face] 탭에서 표정/얼굴 클래스를 학습하고 ".fcm" 파일로 내보내 두어야 합니다.',entries:[{name:"from helloai import FaceClassifier, Image",summary:"얼굴 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 붙여 사용합니다.

FaceClassifier는 얼굴의 표정/움직임을 분류하는 모델입니다.
예) 웃는 얼굴 vs 무표정, 눈 감음 vs 눈 뜸, 입 벌림 vs 다물기 등.
입력 frame에서 직접 얼굴 keypoint를 뽑아 분류기에 넣기 때문에
FaceDetector를 따로 만들 필요가 없습니다.`,example:"from helloai import FaceClassifier, Image"},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Face] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`FaceClassifier도 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널 [Face] 탭이 담당하고, 그 결과가 ".fcm"으로 저장됩니다.

단계별로:

① 좌측 사이드바 → Classify 패널 → [Face] 탭을 엽니다.
② "smile / neutral" 처럼 클래스를 만들고, 각 클래스에서 자기 얼굴을
   카메라에 비추며 샘플을 모읍니다 (한 클래스에 30~100장 권장).
③ "Train" 후 "💾 .fcm 저장" 으로 프로젝트 폴더에 저장합니다.
④ 코드에서는 그 경로를 FaceClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe FaceLandmarker로 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이루어집니다 (오차가 작음).`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ smile.fcm

from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (FaceDetector와 동일한 규칙)",summary:"cv2 함수에는 frame을, FaceClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:`web_cv2(cv2)와 FaceClassifier는 같은 카메라 프레임을 다루지만, 받는 형식이 다릅니다.

① cv2.* 함수 → raw frame을 그대로 넣는다
     ok, frame = cap.read()
     cv2.imshow("camera", frame)

② FaceClassifier.process() → frame을 Image()로 감싸서 넣는다
     out_img, result = clf.process(Image(frame))

   주의: cv2.imread() / cap.read()로 얻은 프레임만 받습니다.
         numpy 배열은 TypeError를 발생시킵니다.

③ Image에서 cv2용 frame 꺼내기 → .frame 속성을 쓴다
     cv2.imshow("face", out_img.frame)`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image
from helloai import Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceClassifier(model_path, draw_label=True)",summary:".fcm 파일을 읽어 얼굴 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: FaceClassifier 객체

내부에서 MediaPipe FaceLandmarker로 478개 점 중 학습 시 사용한 82개
서브셋만 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 FaceLandmarker 모델(약 3MB)이 1회 다운로드됩니다.`,example:"clf = FaceClassifier('smile.fcm')"},{name:"clf.process(image, draw=True)",summary:"얼굴을 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 회색 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 얼굴 미검출 시 label="", confidence=0, landmarks=[]`,example:`out_img, result = clf.process(Image(frame))
if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('얼굴이 보이지 않습니다')`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 얼굴 keypoint 픽셀 좌표 리스트.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 학습에 사용된 82개 얼굴 keypoint 픽셀 좌표
                                     (얼굴 미검출 시 빈 리스트 [])`,example:`out_img, result = clf.process(Image(frame))
if result.landmarks:
    print('keypoint 수:', len(result.landmarks))
    print('첫 점:', result.landmarks[0])  # (x, y, z)`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 모델 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process() 할 수 없습니다.`,example:`print(clf.labels)
# 예) ['smile', 'neutral']
clf.close()`},{name:"예제 1: 정적 이미지 1장 분류",summary:"이미지 파일에서 얼굴을 찾아 표정 클래스와 신뢰도를 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')

img = cv2.imread('face.jpg')
out_img, result = clf.process(Image(img))

if result.label:
    print(f'결과: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('얼굴이 검출되지 않았습니다')

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 표정 분류",summary:"매 프레임 얼굴을 검출해 표정을 분류하고 화면에 라벨/스켈레톤을 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image
from helloai import Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.label:
        print(f'{result.label}  ({result.confidence:.2f})')
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:'예제 3: "smile" 일 때만 신호 출력',summary:"특정 클래스가 일정 신뢰도 이상으로 나올 때만 메시지를 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image
from helloai import Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()
last = None

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    smiling = (result.label == 'smile' and result.confidence >= 0.7)
    if smiling and last != 'smile':
        print('😊 미소 감지!')
        last = 'smile'
    elif not smiling and last == 'smile':
        last = None
    cv2.imshow('smile detector', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 클래스별 확률을 화면에 표시",summary:"probabilities를 이용해 모든 클래스의 점수를 한 줄씩 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image
from helloai import Keyboard

clf = FaceClassifier('smile.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: landmarks로 얼굴 중심에 점 찍기",summary:"result.landmarks 첫 점(보통 코 근처)에 빨간 원을 추가로 그립니다.",details:`landmarks는 학습에 사용된 82개 keypoint입니다. 인덱스 의미는
Classify 패널 [Face] 탭의 시각화와 동일한 순서입니다.`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image
from helloai import Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.landmarks:
        x, y, _ = result.landmarks[0]
        cv2.circle(out_img.frame, (x, y), 8, (0, 0, 255), -1)
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand_classifier",title:"Hand (HandClassifier)",description:"좌측 Classify 패널에서 학습해 저장한 .fcm 손 keypoint 분류 모델을 카메라/이미지에 적용합니다.",icon:"gesture",image:e,notice:'실행 전에 먼저 좌측 Classify 패널의 [Hand] 탭에서 손 모양/제스처 클래스를 학습하고 ".fcm" 파일로 내보내 두어야 합니다.',entries:[{name:"from helloai import HandClassifier, Image",summary:"손 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 붙여 사용합니다.

HandClassifier는 손 모양·제스처를 분류하는 모델입니다.
예) 가위 vs 바위 vs 보, 엄지척 vs 평범, 숫자 1~5 손가락 등.
입력 frame에서 직접 손 keypoint를 뽑아 분류기에 넣기 때문에
HandsDetector를 따로 만들 필요가 없습니다.`,example:"from helloai import HandClassifier, Image"},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Hand] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`HandClassifier도 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널 [Hand] 탭이 담당하고, 그 결과가 ".fcm"으로 저장됩니다.

단계별로:

① 좌측 사이드바 → Classify 패널 → [Hand] 탭을 엽니다.
② "rock / paper / scissors"처럼 클래스를 만들고, 카메라 앞에서
   각 손 모양을 보여주며 샘플을 모읍니다 (한 클래스에 30~100장 권장).
③ "Train" 후 "💾 .fcm 저장" 으로 프로젝트 폴더에 저장합니다.
④ 코드에서는 그 경로를 HandClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe HandLandmarker로 21개 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이루어집니다.`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ rps.fcm     ← rock/paper/scissors 모델

from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (HandsDetector와 동일한 규칙)",summary:"cv2 함수에는 frame을, HandClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:`web_cv2(cv2)와 HandClassifier는 같은 카메라 프레임을 다루지만, 받는 형식이 다릅니다.

① cv2.* 함수 → raw frame을 그대로 넣는다
     ok, frame = cap.read()
     cv2.imshow("camera", frame)

② HandClassifier.process() → frame을 Image()로 감싸서 넣는다
     out_img, result = clf.process(Image(frame))

   주의: cv2.imread() / cap.read()로 얻은 프레임만 받습니다.
         numpy 배열은 TypeError를 발생시킵니다.

③ Image에서 cv2용 frame 꺼내기 → .frame 속성을 쓴다
     cv2.imshow("hand", out_img.frame)`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image
from helloai import Keyboard

clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    cv2.imshow('hand', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"HandClassifier(model_path, draw_label=True)",summary:".fcm 파일을 읽어 손 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: HandClassifier 객체

내부에서 MediaPipe HandLandmarker로 손 21개 keypoint를 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 HandLandmarker 모델(약 6MB)이 1회 다운로드됩니다.`,example:"clf = HandClassifier('rps.fcm')"},{name:"clf.process(image, draw=True)",summary:"손을 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 파란 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 손 미검출 시 label="", confidence=0, landmarks=[]`,example:`out_img, result = clf.process(Image(frame))
if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('손이 보이지 않습니다')`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 21개 손 keypoint 픽셀 좌표.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 21개 손 keypoint 픽셀 좌표

주요 인덱스 (HandsDetector와 동일):
  0=손목, 4=엄지 끝, 8=검지 끝, 12=중지 끝, 16=약지 끝, 20=새끼 끝`,example:`out_img, result = clf.process(Image(frame))
if result.landmarks:
    thumb = result.landmarks[4]   # (x, y, z)
    index = result.landmarks[8]
    print('엄지 끝:', thumb[:2], '검지 끝:', index[:2])`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 모델 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process() 할 수 없습니다.`,example:`print(clf.labels)
# 예) ['rock', 'paper', 'scissors']
clf.close()`},{name:"예제 1: 정적 이미지 1장 분류",summary:"이미지 파일에서 손 모양을 한 번 분류해 클래스/신뢰도를 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')

img = cv2.imread('hand.jpg')
out_img, result = clf.process(Image(img))

if result.label:
    print(f'결과: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('손이 검출되지 않았습니다')

cv2.imshow('hand', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 가위바위보",summary:"매 프레임 손 모양을 분류하고 라벨을 콘솔에 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image
from helloai import Keyboard

clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.label:
        print(f'{result.label}  ({result.confidence:.2f})')
    cv2.imshow('rps', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 라벨이 바뀔 때만 출력 (떨림 방지)",summary:"같은 손 모양이 이어지는 동안에는 한 번만 출력합니다.",details:`카메라 떨림으로 같은 손인데 짧게 다른 클래스가 깜빡이는 경우가 많습니다.
THRESHOLD를 두고 마지막 라벨과 비교하면 출력이 깔끔해집니다.`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image
from helloai import Keyboard

THRESHOLD = 0.7
clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()
last = None

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    confident = result.confidence >= THRESHOLD
    if confident and result.label != last:
        print('NEW ->', result.label)
        last = result.label
    cv2.imshow('rps', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 엄지-검지 거리도 함께 측정",summary:"landmarks를 직접 사용해 엄지(4)와 검지(8) 끝 사이 거리를 같이 표시합니다.",details:null,example:`import web_cv2 as cv2
import math
from helloai import HandClassifier, Image
from helloai import Keyboard

clf = HandClassifier('rps.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.landmarks:
        tx, ty, _ = result.landmarks[4]
        ix, iy, _ = result.landmarks[8]
        d = math.hypot(ix - tx, iy - ty)
        text = f'{result.label}  d={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    cv2.imshow('hand', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 클래스별 확률 막대 그리기",summary:"probabilities로 각 클래스 점수를 막대그래프처럼 그려줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image
from helloai import Keyboard

clf = HandClassifier('rps.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        y = 30 + i * 28
        bar_w = int(200 * p)
        cv2.rectangle(out_img.frame, (140, y - 18), (140 + bar_w, y), (0, 200, 0), -1)
        cv2.putText(out_img.frame, f'{name}: {p * 100:4.1f}%',
                    (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"pose_classifier",title:"Pose (PoseClassifier)",description:"좌측 Classify 패널에서 학습해 저장한 .fcm 전신 포즈 keypoint 분류 모델을 카메라/이미지에 적용합니다.",icon:"accessibility_new",image:r,notice:'실행 전에 먼저 좌측 Classify 패널의 [Pose] 탭에서 자세 클래스를 학습하고 ".fcm" 파일로 내보내 두어야 합니다.',entries:[{name:"from helloai import PoseClassifier, Image",summary:"포즈 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 붙여 사용합니다.

PoseClassifier는 전신 자세를 분류하는 모델입니다.
예) 서있기 vs 앉아있기, 만세 vs 차렷, 요가 자세 A/B/C 등.
입력 frame에서 직접 포즈 keypoint를 뽑아 분류기에 넣기 때문에
PoseDetector를 따로 만들 필요가 없습니다.`,example:"from helloai import PoseClassifier, Image"},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Pose] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`PoseClassifier도 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널 [Pose] 탭이 담당하고, 그 결과가 ".fcm"으로 저장됩니다.

단계별로:

① 좌측 사이드바 → Classify 패널 → [Pose] 탭을 엽니다.
② "stand / sit / hands_up" 처럼 클래스를 만들고, 카메라 앞에서
   각 자세를 취하며 샘플을 모읍니다 (전신이 화면에 들어와야 합니다).
③ "Train" 후 "💾 .fcm 저장" 으로 프로젝트 폴더에 저장합니다.
④ 코드에서는 그 경로를 PoseClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe PoseLandmarker로 33개 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이루어집니다.`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ yoga.fcm

from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (PoseDetector와 동일한 규칙)",summary:"cv2 함수에는 frame을, PoseClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:`web_cv2(cv2)와 PoseClassifier는 같은 카메라 프레임을 다루지만, 받는 형식이 다릅니다.

① cv2.* 함수 → raw frame을 그대로 넣는다
     ok, frame = cap.read()
     cv2.imshow("camera", frame)

② PoseClassifier.process() → frame을 Image()로 감싸서 넣는다
     out_img, result = clf.process(Image(frame))

   주의: cv2.imread() / cap.read()로 얻은 프레임만 받습니다.
         numpy 배열은 TypeError를 발생시킵니다.

③ Image에서 cv2용 frame 꺼내기 → .frame 속성을 쓴다
     cv2.imshow("pose", out_img.frame)`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image
from helloai import Keyboard

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseClassifier(model_path, draw_label=True)",summary:".fcm 파일을 읽어 포즈 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: PoseClassifier 객체

내부에서 MediaPipe PoseLandmarker로 33개 keypoint를 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 PoseLandmarker 모델(약 5MB)이 1회 다운로드됩니다.`,example:"clf = PoseClassifier('yoga.fcm')"},{name:"clf.process(image, draw=True)",summary:"포즈를 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 마젠타 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 포즈 미검출 시 label="", confidence=0, landmarks=[]`,example:`out_img, result = clf.process(Image(frame))
if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('전신이 화면에 들어와야 합니다')`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 33개 포즈 keypoint 픽셀 좌표.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 33개 포즈 keypoint 픽셀 좌표

주요 인덱스 (PoseDetector와 동일):
  0=NOSE, 11/12=L/R 어깨, 13/14=L/R 팔꿈치, 15/16=L/R 손목,
  23/24=L/R 엉덩이, 25/26=L/R 무릎, 27/28=L/R 발목`,example:`out_img, result = clf.process(Image(frame))
if result.landmarks:
    nose = result.landmarks[0]
    l_wrist = result.landmarks[15]
    print('코:', nose[:2], '왼손목:', l_wrist[:2])`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 모델 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process() 할 수 없습니다.`,example:`print(clf.labels)
# 예) ['stand', 'sit', 'hands_up']
clf.close()`},{name:"예제 1: 정적 이미지 1장 분류",summary:"이미지 파일에서 자세를 한 번 분류해 클래스/신뢰도를 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')

img = cv2.imread('pose.jpg')
out_img, result = clf.process(Image(img))

if result.label:
    print(f'결과: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('포즈가 검출되지 않았습니다 (전신이 들어와야 함)')

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 자세 분류",summary:"매 프레임 자세를 분류하고 화면에 라벨/스켈레톤을 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image
from helloai import Keyboard

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.label:
        print(f'{result.label}  ({result.confidence:.2f})')
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:'예제 3: "hands_up"이 일정 시간 유지되면 신호',summary:"특정 클래스가 N프레임 연속 유지될 때만 메시지를 띄웁니다 (디바운싱).",details:`한 번 만세를 했다고 바로 반응하면 떨림으로 오작동하기 쉽습니다.
연속 프레임 카운터를 두면 안정적으로 트리거할 수 있습니다.`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image
from helloai import Keyboard

TARGET = 'hands_up'
HOLD_FRAMES = 10        # 약 0.3초 유지해야 트리거 (30fps 기준)
THRESHOLD = 0.7

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()
streak = 0

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.label == TARGET and result.confidence >= THRESHOLD:
        streak += 1
        if streak == HOLD_FRAMES:
            print('🙌 만세 감지!')
    else:
        streak = 0
    cv2.imshow('hands_up trigger', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 클래스별 확률을 화면에 표시",summary:"probabilities로 모든 클래스 점수를 한 줄씩 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image
from helloai import Keyboard

clf = PoseClassifier('yoga.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: landmarks로 어깨~손목 거리 같이 측정",summary:"왼쪽 어깨(11)와 손목(15) keypoint 사이 픽셀 거리를 분류 결과와 함께 표시합니다.",details:null,example:`import web_cv2 as cv2
import math
from helloai import PoseClassifier, Image
from helloai import Keyboard

clf = PoseClassifier('yoga.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    if result.landmarks:
        sx, sy, _ = result.landmarks[11]
        wx, wy, _ = result.landmarks[15]
        d = math.hypot(wx - sx, wy - sy)
        text = f'{result.label}  L_arm={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]}];export{t as AI_REFERENCE};
