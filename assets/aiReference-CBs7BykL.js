import{h as e,f as a,p as r,t as i}from"./tm_export_tfjs-k-0nS32K.js";const t=[{id:"cv2",title:"이미지·카메라 다루기 (web_cv2)",description:"이미지 파일이나 웹캠 영상을 화면에 띄우고, 그 위에 선·사각형·원·글자를 그리는 가장 기본적인 모듈입니다. OpenCV(cv2)와 사용법이 거의 같습니다.",icon:"image",entries:[{name:"import web_cv2 as cv2",summary:"이 IDE에 내장된 OpenCV 호환 모듈을 가져옵니다. 표준 OpenCV(cv2)와 구분되도록 모듈 이름은 web_cv2이며, 관례상 cv2라는 별칭을 붙여 사용합니다.",example:`# 모든 예제의 첫 줄에 등장하는 가장 기본 import
import web_cv2 as cv2

# 이제부터 cv2.imread(...), cv2.imshow(...) 처럼 짧게 부를 수 있습니다.
print(cv2)`,warning:"web_cv2는 표준 OpenCV의 일부 기능만 구현되어 있습니다. imwrite 등 미구현 함수는 호출 시 NotImplementedError가 발생합니다.",warningType:"info"},{name:"cv2.imread(path) — 파일에서 이미지 불러오기",summary:"프로젝트 안의 이미지 파일을 읽어서 이미지 객체로 돌려줍니다.",details:`Args:
  path (str): 프로젝트 루트 기준 상대 경로 (예: "cat.png")
Returns:
  image: 성공 시 이미지 객체, 실패 시 None

업로드 가능한 이미지 최대 크기는 50MB입니다.`,example:`import web_cv2 as cv2

# 같은 폴더에 있는 cat.png를 읽어옵니다
frame = cv2.imread('cat.png')

if frame is None:
    # 파일이 없거나 형식이 잘못되었을 때 None이 돌아옵니다
    print('파일을 찾을 수 없습니다')
else:
    # frame.shape는 (높이, 너비, 채널) 형태입니다
    print('이미지 크기:', frame.shape)`,warning2:'cv2와 검출기(FaceDetector / HandsDetector 등)는 같은 카메라 프레임을 다루지만 받는 형식이 다릅니다.\n다음 세 가지 규칙만 기억하세요.\n\n① cv2.* 함수 → raw frame 그대로\n```python\nok, frame = cap.read()\ncv2.imshow("camera", frame)\ncv2.rectangle(frame, (10, 10), (100, 100), (0, 255, 0), 2)\n```\n② Detector.process() → frame을 Image()로 감싸서 전달\n```python\nout_img, points = detector.process(Image(frame))\n```\n③ Image에서 frame 꺼낼 때는 .frame 사용\n```python\ncv2.imshow("face", out_img.frame)\n```',warning2Type:"info"},{name:"cv2.imread(url) — URL의 이미지 불러오기",summary:"http(s):// 로 시작하는 인터넷 주소의 이미지를 직접 불러옵니다.",details:`Args:
  url (str): "http://" 또는 "https://"로 시작하는 이미지 URL
Returns:
  image: 성공 시 이미지 객체, 실패(네트워크 오류·CORS 차단 등) 시 None

대상 서버가 CORS 응답을 허용해야 합니다. 허용하지 않으면 None이 돌아옵니다.`,warning:"원격 이미지의 최대 크기 또한 50MB로 제한됩니다.",example:`import web_cv2 as cv2

# 인터넷에 있는 이미지 주소를 그대로 넘겨줍니다
url = 'https://example.com/cat.png'
frame = cv2.imread(url)

if frame is None:
    print('이미지를 가져오지 못했습니다 (CORS/네트워크 오류)')
else:
    print('크기:', frame.shape)
    cv2.imshow('remote', frame)
    cv2.waitKey(0)              # 아무 키나 누르면 종료
    cv2.destroyAllWindows()`},{name:"cv2.imshow(name, image) — 이미지 창에 띄우기",summary:"이미지를 IDE 안의 떠다니는 창에 띄웁니다 (논블로킹).",details:`Args:
  name (str): 창 제목. 같은 이름이면 같은 창에 다시 그립니다.
  image: cv2.imread / cv2.VideoCapture.read 결과나 numpy 배열
Returns: 없음`,example:`import web_cv2 as cv2

# 이미지 한 장을 띄우고 키 입력을 기다립니다
frame = cv2.imread('cat.png')
cv2.imshow('preview', frame)    # 'preview' 창에 표시
cv2.waitKey(0)                   # 아무 키나 누를 때까지 대기
cv2.destroyAllWindows()          # 모든 창 닫기`},{name:"cv2.waitKey(ms=0) — 키 입력 대기",summary:"키 입력을 ms(밀리초)만큼 기다립니다. 정적 이미지엔 0(무한대기), 영상 루프엔 1을 자주 씁니다.",details:`Args:
  ms (int): 대기 시간(ms). 0 이하면 키가 눌릴 때까지 무한 대기.
Returns:
  int: 눌린 키 코드. 시간 초과 또는 포커스가 없으면 -1`,example:`import web_cv2 as cv2
from helloai import Keyboard

# (A) 정적 이미지: 키가 눌릴 때까지 창 유지
frame = cv2.imread('cat.png')
cv2.imshow('image', frame)
cv2.waitKey(0)                  # 0 = 무한 대기
cv2.destroyAllWindows()

# (B) 영상 루프: 매 프레임 갱신하며 ESC로 종료
cap = cv2.VideoCapture()
while True:
    ok, frame = cap.read()
    if not ok:
        continue
    cv2.imshow('camera', frame)
    if cv2.waitKey(1) == Keyboard.ESC:   # 1ms만 살짝 대기
        break
cap.release()
cv2.destroyAllWindows()`},{name:"cv2.destroyAllWindows() — 모든 창 닫기",summary:"열려 있는 모든 imshow 창을 닫습니다.",details:`Args: 없음
Returns: 없음

특정 창만 닫고 싶다면 cv2.destroyWindow(name)을 사용합니다.`,example:`import web_cv2 as cv2

# 이미지 한 장 띄우고 키 입력 후 정리
frame = cv2.imread('cat.png')
cv2.imshow('demo', frame)
cv2.waitKey(0)

# 열려있던 모든 창을 한꺼번에 닫습니다
cv2.destroyAllWindows()`},{name:"cv2.VideoCapture(source=0) — 웹캠 열기",summary:"웹캠을 엽니다. .isOpened() / .read() / .release() 메서드를 제공합니다.",details:`Args:
  source (int, 선택): 카메라 인덱스. 기본값은 0(기본 웹캠).
    브라우저 환경에서는 한 번에 카메라 1대만 사용하므로
    cv2.VideoCapture()와 cv2.VideoCapture(0)는 동일하게 동작합니다.
Returns: VideoCapture 객체

메서드:
  isOpened() -> bool
  read() -> (bool, image): 한 프레임을 받아옵니다.
  release(): 카메라를 닫습니다.`,example:`import web_cv2 as cv2

# 기본 웹캠을 엽니다 (source=0은 기본값이라 생략 가능)
cap = cv2.VideoCapture()

# 한 프레임만 받아 크기를 확인
ok, frame = cap.read()
if ok:
    print('프레임 크기:', frame.shape)
else:
    print('카메라를 열지 못했습니다')

cap.release()                   # 카메라 자원 해제`},{name:"cv2.line(image, pt1, pt2, color, thickness=1) — 직선 그리기",summary:"이미지 위에 직선을 그립니다.",details:`Args:
  image: 그릴 대상
  pt1, pt2 ((x, y)): 시작점, 끝점
  color (B, G, R): OpenCV 관례대로 BGR 순서. (0, 0, 255) = 빨강.
  thickness (int): 선 두께(px)
Returns:
  image: 같은 이미지 (체이닝용)`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# (0, 0)에서 (200, 200)까지 빨간색(BGR) 직선을 두께 3으로 그립니다
cv2.line(frame, (0, 0), (200, 200), (0, 0, 255), 3)

cv2.imshow('line', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.rectangle(image, pt1, pt2, color, thickness=1) — 사각형 그리기",summary:"이미지 위에 사각형을 그립니다. thickness=-1(또는 cv2.FILLED)이면 안을 채웁니다.",details:`Args:
  image: 그릴 대상
  pt1 ((x, y)): 좌상단 모서리
  pt2 ((x, y)): 우하단 모서리
  color (B, G, R): BGR
  thickness (int): 선 두께. -1 또는 cv2.FILLED면 내부를 채움.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# 외곽선만 그리는 초록 사각형
cv2.rectangle(frame, (50, 50), (200, 150), (0, 255, 0), 2)
# 내부까지 채운 파란 사각형
cv2.rectangle(frame, (10, 10), (40, 40), (255, 0, 0), cv2.FILLED)

cv2.imshow('rectangle', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.circle(image, center, radius, color, thickness=1) — 원 그리기",summary:"이미지 위에 원을 그립니다. thickness=-1이면 채워진 원.",details:`Args:
  image: 그릴 대상
  center ((x, y)): 중심 좌표
  radius (int): 반지름(px)
  color (B, G, R): BGR
  thickness (int): 선 두께. -1이면 채움.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# 외곽선만 있는 보라색 원
cv2.circle(frame, (100, 100), 30, (255, 0, 255), 2)
# 안을 채운 노란 원
cv2.circle(frame, (200, 100), 30, (0, 255, 255), -1)

cv2.imshow('circle', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.putText(image, text, org, fontFace, fontScale, color, thickness=1) — 글자 쓰기",summary:"이미지 위에 텍스트를 그립니다.",details:`Args:
  image: 그릴 대상
  text (str): 표시할 문자열 (한글 가능)
  org ((x, y)): 텍스트의 좌하단 기준점
  fontFace: cv2.FONT_HERSHEY_SIMPLEX 등 폰트 상수
  fontScale (float): 글자 크기 배율 (≈ 14*scale px)
  color (B, G, R): BGR
  thickness (int): 선 두께

주의: 이 IDE는 캔버스의 sans-serif 폰트로 근사 렌더링합니다.
폰트 상수는 받지만 실제 모양은 모두 비슷합니다.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# (20, 40) 좌표에 흰색으로 'Hello CV2' 출력
cv2.putText(frame, 'Hello CV2', (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

cv2.imshow('putText', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.cvtColor(image, code) — 색공간 변환",summary:"색공간을 변환합니다 (numpy 배열에 대해서만 실제 변환됨).",details:`Args:
  image: 입력 이미지
  code: 변환 코드. 지원: COLOR_BGR2RGB, COLOR_RGB2BGR,
        COLOR_BGR2GRAY, COLOR_GRAY2BGR.
Returns:
  변환된 이미지

제약: imread/VideoCapture가 돌려주는 이미지는 메인 스레드에서
이미 RGB로 표시되므로 BGR↔RGB 변환은 시각적 차이가 없습니다.
numpy 배열을 직접 만들어 넣은 경우에만 실제로 채널 스왑이 일어납니다.`,example:`import web_cv2 as cv2
import numpy as np

# numpy로 직접 만든 BGR 배열에서만 cvtColor가 실제로 동작합니다
arr = np.zeros((100, 100, 3), dtype=np.uint8)
arr[:, :, 0] = 255              # B 채널을 255로 (파랑)

# BGR → 그레이스케일 변환
gray = cv2.cvtColor(arr, cv2.COLOR_BGR2GRAY)
print(gray.shape)               # (100, 100)`},{name:"cv2.flip(image, axis) — 좌우/상하 뒤집기",summary:"이미지를 뒤집습니다 (numpy 배열에 대해서만 실제 변환됨).",details:`Args:
  image: 입력 이미지
  axis (int): 0=상하반전, 1=좌우반전, -1=양쪽
Returns:
  뒤집힌 이미지`,example:`import web_cv2 as cv2
import numpy as np

# 12개 숫자로 3x4 배열을 만든 뒤 좌우 반전
arr = np.arange(12, dtype=np.uint8).reshape(3, 4)
print('원본:\\n', arr)
print('좌우 반전:\\n', cv2.flip(arr, 1))`},{name:"예제 1: 이미지 파일 표시",summary:"프로젝트 안의 이미지를 읽어 창에 띄웁니다. 아무 키나 누르면 종료.",details:null,example:`import web_cv2 as cv2

# 같은 폴더의 cat.png를 읽어 화면에 띄웁니다
frame = cv2.imread('cat.png')

if frame is None:
    print('cat.png 파일을 프로젝트에 추가해 주세요')
else:
    cv2.imshow('image', frame)
    cv2.waitKey(0)              # 아무 키나 누르면 종료
    cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 영상 표시",summary:"웹캠을 열고 ESC를 누를 때까지 매 프레임을 화면에 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import Keyboard

cap = cv2.VideoCapture()        # 기본 웹캠 열기

while cap.isOpened():
    ok, frame = cap.read()      # 한 프레임 받기
    if not ok:
        continue                # 일시적 실패는 건너뜀
    cv2.imshow('camera', frame)
    # 1ms 대기하며 ESC가 눌리면 루프 종료
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()                   # 카메라 자원 해제
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

    # 화면 중앙에 200x200 가이드 박스 좌표 계산
    bx, by, bw, bh = w // 2 - 100, h // 2 - 100, 200, 200

    # 가이드 박스 (노란색)
    cv2.rectangle(frame, (bx, by), (bx + bw, by + bh), (0, 255, 255), 2)
    # 좌상단 안내 텍스트
    cv2.putText(frame, 'Place object inside the box', (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    # 좌하단 종료 안내
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

    # 현재 시간과 직전 시간 차이로 FPS 계산
    now = time.time()
    fps = 1.0 / max(now - prev_t, 1e-6)
    prev_t = now

    # 좌상단에 FPS와 프레임 번호 표시
    label = f'FPS {fps:5.1f}  #{frame_no}'
    cv2.putText(frame, label, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('fps', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand",title:"손 검출 (HandsDetector)",description:'카메라/이미지에서 양손을 찾아 21개 keypoint(관절)를 돌려줍니다. "OK", "V", "주먹" 같은 사인도 자동으로 분류해 줍니다.',icon:"sign_language",image:e,entries:[{name:"from helloai import HandsDetector, Image",summary:"손 검출기와 이미지 래퍼를 가져옵니다. 모든 예제의 첫 줄에서 사용합니다.",details:"예제 코드 맨 위에 그대로 붙여 사용하세요.",example:`# 손 검출기와 Image 래퍼를 함께 가져옵니다
from helloai import HandsDetector, Image`},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을 그대로, HandsDetector에는 Image(frame)으로 감싸서 넣습니다. 다시 cv2로 보낼 때는 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()      # 손 검출기 만들기
cap = cv2.VideoCapture()         # 웹캠 열기

while cap.isOpened():
    ok, frame = cap.read()       # cv2 → 원본 frame을 받음
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달 — 양손 인식
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # 'right'/'left'와 검지 끝(8번 keypoint) 좌표 출력
        print(h['handedness'], h['landmarks'][8])

    # cv2.imshow에는 다시 raw frame이 필요 → .frame으로 꺼냄
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warningType:"info"},{name:"HandsDetector(draw_label=True) — 검출기 만들기",summary:"손 검출기를 만듭니다. 양손(왼손+오른손)을 동시에 인식하며, 첫 호출 시 모델(약 6MB)을 다운로드합니다. 시각화 시 오른손 연결선은 옅은 보라색, 왼손은 회색으로 그려져 한눈에 구분됩니다.",details:`Args:
  draw_label (bool): True면 process()가 매 프레임 각 손목 위에
    "right: v" / "left: fist" 같은 사인 라벨을 자동으로 그립니다.
    끄려면 False.
Returns: HandsDetector 객체`,example:`from helloai import HandsDetector

# 기본 옵션으로 검출기를 만듭니다 (라벨 자동 표시 ON)
detector = HandsDetector()

# 라벨 자동 표시를 끄고 싶다면:
# detector = HandsDetector(draw_label=False)`},{name:"detector.process(image, ...) — 손 검출하기",summary:"입력 이미지에서 양손을 검출하고 (시각화된 Image, 손별 정보 리스트)를 돌려줍니다.",details:`Args:
  image (Image): 카메라 프레임 또는 이미지를 감싼 Image 객체
  draw (bool): True면 결과에 keypoint와 연결선을 그립니다.
  line_width (int): 연결선 두께
  circle_radius (int): keypoint 원의 반지름
  show_label (bool|None): True/False면 이 호출에서만 라벨 표시 토글.
    None이면 생성자의 draw_label을 따릅니다.

Returns: (Image, list[dict])
  - Image: keypoint와 연결선이 그려진 시각화 결과
  - list[dict]: 검출된 손마다 한 개씩 들어있는 dict 리스트
    각 dict는 {"handedness": "left"|"right", "landmarks": [(x,y,z), ...21개]}`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image

detector = HandsDetector()
img = cv2.imread('hand.jpg')

# 양손을 검출하고 결과를 받아옵니다
out_img, hands = detector.process(Image(img))

print('검출된 손 개수:', len(hands))   # 0, 1, 또는 2
for h in hands:
    side = h['handedness']           # 'right' 또는 'left'
    pts = h['landmarks']             # 21개 (x, y, z) 튜플
    print(f'{side} 검지 끝:', pts[8])
    print(f'{side} 엄지 끝:', pts[4])

cv2.imshow('hands', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`,warning2:`리스트 길이로 검출된 손 개수를 알 수 있습니다.
  · 손 0개 → []
  · 손 1개 → 길이 1
  · 양손   → 길이 2

각 dict의 키:
  · "handedness" (str): 항상 소문자 "right" 또는 "left"
  · "landmarks" (list): 21개 (x, y, z) 정수 픽셀 튜플
      0=손목, 4=엄지끝, 8=검지끝, 12=중지끝, 16=약지끝, 20=새끼끝

주의: 웹캠은 거울 영상이라 화면 기준 오른쪽 손이 "left"로 분류될 수 있습니다.`,warning2Type:"info"},{name:"detector.fingers_up(side='right') — 펴진 손가락 확인",summary:"직전 process 결과에서 지정한 손의 펴진 손가락을 [엄지, 검지, 중지, 약지, 새끼] 순서의 0/1 리스트로 돌려줍니다.",details:`Args:
  side (str): 'right' 또는 'left'. 생략 시 'right'.
Returns:
  list[int]: 길이 5. 1=펴짐, 0=접힘.
  지정한 손이 검출되지 않았으면 [0, 0, 0, 0, 0].`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # 매 프레임 손을 검출 (fingers_up은 process 뒤에 호출해야 함)
    out_img, _ = detector.process(Image(frame))

    right_fingers = detector.fingers_up('right')
    left_fingers = detector.fingers_up('left')

    # 펴진 손가락 개수는 1의 합으로 셉니다
    print('오른손:', right_fingers, '(', right_fingers.count(1), '개)')
    print('왼손  :', left_fingers,  '(', left_fingers.count(1),  '개)')

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.distance(p1, p2, image, draw=True) — 두 점 사이 거리",summary:"두 keypoint 좌표 사이의 픽셀 거리를 계산하고 (선택 시) 화면에 선과 점을 그립니다.",details:`Args:
  p1, p2 ((x, y, z)): 좌표 튜플 — process가 돌려준 dict의 "landmarks"에서 골라 넘김
  image (Image): 그릴 이미지
  draw (bool): True면 마젠타 선과 양 끝/중점에 원을 그립니다.
Returns:
  (length, Image, [x1, y1, x2, y2, cx, cy])`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        if h['handedness'] != 'right':
            continue
        pts = h['landmarks']
        # 엄지 끝(4)과 검지 끝(8) 사이 거리를 측정 + 선 그림
        length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
        print(f'오른손 엄지-검지 거리: {length:.1f}px')

    cv2.imshow('distance', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.recognize_sign(lm) — 손 사인 분류",summary:'한 손의 21개 keypoint로부터 손 사인을 분류해 ID 문자열을 돌려줍니다 (예: "OK", "v", "fist").',details:`Args:
  lm (list): 한 손의 21개 (x, y, z) 픽셀 튜플 리스트
Returns:
  str | None: 인식된 사인 ID. 매칭 안 되면 None.

process()가 매 프레임 양손에 대해 자동 호출하므로 보통은
직접 부르지 않고 detector.sign["right"]/["left"]로 결과만 읽습니다.`,table:{headers:["사인 ID","손 모양"],rows:[["OK","엄지-검지로 동그라미 + 나머지 세 손가락 폄"],["v","검지+중지 폄 (V / Peace)"],["fist","주먹 (모두 접음)"],["open_hand","다섯 손가락 모두 폄 (손바닥)"],["thumbs_up","엄지만 폄 (좋아요)"],["pointing","검지만 폄 (가리키기)"],["three","검지+중지+약지 폄"],["four","엄지 빼고 네 손가락 폄"],["pinky","새끼만 폄 (약속)"],["rock","검지+새끼 폄 (락앤롤)"],["call_me","엄지+새끼 폄 (전화 / 샤카)"],["ily","엄지+검지+새끼 폄 (ASL '사랑해')"],["L","엄지+검지 폄 (L자)"]]},example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # 직접 분류기 호출 (process가 이미 detector.sign에 채워놓긴 함)
        sign = detector.recognize_sign(h['landmarks'])
        print(h['handedness'], '→', sign)

    cv2.imshow('signs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.sign — 손별 사인 dict (자동 갱신)",summary:'process()가 매 프레임 자동으로 채워두는 손별 사인 dict (읽기 전용 프로퍼티). 항상 {"left": ..., "right": ...} 형태입니다.',details:`값 형태:
  detector.sign = {
      'left':  <왼손 사인 ID 또는 None>,
      'right': <오른손 사인 ID 또는 None>,
  }

검출되지 않은 손이나 매칭되는 패턴이 없으면 None.`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # process가 끝나면 detector.sign이 손별로 자동 갱신됩니다
    out_img, _ = detector.process(Image(frame))

    if detector.sign['right'] == 'OK':
        print('오른손 OK 사인!')
    if detector.sign['left'] == 'fist':
        print('왼손 주먹!')

    cv2.imshow('sign property', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 1: 정적 이미지에서 양손 검출",summary:"이미지 파일을 읽어 양손 keypoint를 검출하고 결과를 화면에 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image

detector = HandsDetector()
img = cv2.imread('hand.jpg')

# Image()로 감싸서 검출기에 전달
out_img, hands = detector.process(Image(img))

print('검출된 손 개수:', len(hands))
for h in hands:
    print(h['handedness'], '→ keypoints:', len(h['landmarks']))

cv2.imshow('hands', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 양손 트래킹",summary:"웹캠을 열어 매 프레임 양손을 검출하고 화면에 그립니다. 오른손은 옅은 보라색 선으로 시각적으로 구분됩니다. ESC로 종료.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # 양손 모두 그려지며 오른손 선분만 옅은 보라색
    out_img, hands = detector.process(Image(frame))
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 양손 검지 끝점 좌표 출력",summary:"실시간 영상에서 오른손/왼손 검지 끝(8번 keypoint) 좌표를 콘솔에 찍습니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # 8번 = INDEX_FINGER_TIP (검지 끝)
        x, y, _ = h['landmarks'][8]
        print(f"{h['handedness']} 검지 끝: ({x}, {y})")

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 양손 펴진 손가락 개수 세기",summary:"fingers_up('right'/'left')로 양손의 펴진 손가락 패턴을 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    if hands:                   # 손이 하나 이상 검출되었을 때만
        right = detector.fingers_up('right')
        left = detector.fingers_up('left')
        print(f'오른손: {right} ({right.count(1)}개) / '
              f'왼손: {left} ({left.count(1)}개)')

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 양손 각각의 엄지-검지 거리 측정",summary:"검출된 손마다 엄지(4)와 검지(8) 끝점 사이 거리를 측정해 화면에 표시합니다 (줌 제스처 아이디어).",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        pts = h['landmarks']
        # 엄지 끝(4)과 검지 끝(8) 사이 거리 측정
        length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
        print(f"{h['handedness']} 엄지-검지: {length:.0f}px")

    cv2.imshow('zoom gesture', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 양손 사인 동시 인식 (OK / V 등)",summary:"detector.sign dict로 오른손과 왼손의 사인을 한 번에 읽어 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    # detector.sign은 항상 {'left': ..., 'right': ...} dict
    right_sign = detector.sign['right']
    left_sign = detector.sign['left']

    # 양손이 동시에 OK인지 확인하는 예시
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
cv2.destroyAllWindows()`},{name:"예제 7: 손별 사인이 바뀐 순간만 잡아내기",summary:"detector.sign dict의 변화를 추적해 오른손/왼손 각각 사인이 바뀐 순간만 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

# 직전 프레임의 손별 사인을 기억해 둡니다
prev = {'left': None, 'right': None}

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    for side in ('right', 'left'):
        cur = detector.sign[side]
        if cur != prev[side]:           # 사인이 바뀐 순간 한 번만 출력
            if cur:
                print(f'{side} 사인 변경: {cur}')
            prev[side] = cur

    cv2.imshow('sign change', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 8: 손목 위 자동 사인 라벨 토글",summary:'process()가 자동으로 그리는 "right: v" / "left: fist" 라벨을 t 키로 켜고/끄는 예제.',details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

# 기본 draw_label=True → 손목 위에 사인 라벨 자동 표시
detector = HandsDetector()
cap = cv2.VideoCapture()

label_on = True
while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # show_label은 이번 호출만 토글. None이면 생성자 draw_label을 따름
    out_img, _ = detector.process(Image(frame), show_label=label_on)

    cv2.imshow('auto label', out_img.frame)
    key = cv2.waitKey(1)
    if key == Keyboard.ESC:
        break
    if key == Keyboard.T:           # 't' 키로 라벨 토글
        label_on = not label_on

cap.release()
cv2.destroyAllWindows()`}]},{id:"face",title:"얼굴 검출 (FaceDetector)",description:"얼굴 메시(눈썹·눈·코·입) 22개 keypoint를 검출하고, 옵션을 켜면 미소·입벌림 같은 표정 점수(blendshape) 52개도 함께 받을 수 있습니다.",icon:"face_4",image:a,entries:[{name:"from helloai import FaceDetector, Image",summary:"얼굴 검출기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 그대로 붙여 사용합니다.",example:`# 얼굴 검출기와 Image 래퍼를 함께 가져옵니다
from helloai import FaceDetector, Image`},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을, FaceDetector에는 Image(frame)을 넣습니다. 다시 cv2로 보낼 때는 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()       # cv2 → 원본 frame
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달
    out_img, points = detector.process(Image(frame))

    # cv2.imshow에 다시 raw frame이 필요 → .frame으로 꺼냄
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceDetector(min_detection_confidence=0.5, expressions=False, draw_label=True)",summary:"얼굴 검출기를 만듭니다. 첫 호출 시 모델(약 3MB)을 다운로드합니다.",details:`Args:
  min_detection_confidence (float): 0~1. 낮을수록 잘 잡지만 오탐 ↑.
  expressions (bool): True면 표정(blendshape) 계수 52개를 함께 계산.
    켜야 detector.blendshapes / .expression / .expression_score를
    읽을 수 있습니다.
  draw_label (bool): True면 process가 좌상단에 expression 라벨을
    자동으로 그립니다 (expressions=True와 함께일 때만 의미).
Returns: FaceDetector 객체`,example:`from helloai import FaceDetector

# 기본 검출기 (표정은 계산하지 않음)
detector = FaceDetector()

# 표정까지 보고 싶다면 expressions=True
# detector = FaceDetector(expressions=True)`},{name:"detector.process(img, draw=True, show_label=None) — 얼굴 검출하기",summary:"얼굴 메시를 검출하고 22개 핵심 keypoint 리스트를 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지를 감싼 Image 객체
  draw (bool): True면 메시 + 22점을 결과에 그립니다.
  show_label (bool|None): True/False면 이 호출에서만 expression 라벨
    표시 토글. None이면 생성자의 draw_label을 따릅니다.

Returns: (Image, list)
  - Image: 시각화된 결과
  - list: 22개 (x, y, z) 튜플 (얼굴 미검출 시 빈 리스트 [])`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image

detector = FaceDetector()
img = cv2.imread('face.jpg')

# 얼굴 검출 → 시각화 결과와 22개 keypoint 받기
out_img, points = detector.process(Image(img))

if points:
    print('얼굴 점 22개:', len(points))
    print('코끝(15번):', points[15])

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"detector.blendshapes — 52개 표정 계수 (expressions=True 일 때만)",summary:"직전 process() 결과의 52개 표정 계수 dict[str, float].",details:`expressions=False로 만든 검출기거나 직전 프레임에 얼굴이 잡히지 않았으면 None.

주요 카테고리 예:
  mouthSmileLeft / mouthSmileRight  — 입꼬리 올라감 (미소)
  mouthFrownLeft / mouthFrownRight  — 입꼬리 내려감
  browDownLeft / browDownRight      — 눈썹 내림 (화남)
  browInnerUp                       — 눈썹 안쪽 올림 (놀람)
  eyeBlinkLeft / eyeBlinkRight      — 눈 깜빡임
  jawOpen                           — 입 벌림
  cheekPuff                         — 볼 부풀리기
  noseSneerLeft / noseSneerRight    — 코 찡그림
  _neutral                          — 무표정 정도`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# expressions=True 옵션을 켜야 blendshapes를 받을 수 있습니다
detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    bs = detector.blendshapes
    if bs:
        # 좌우 입꼬리 점수 평균으로 미소 정도 측정
        smile = (bs.get('mouthSmileLeft', 0) + bs.get('mouthSmileRight', 0)) / 2
        print(f'미소 점수: {smile:.2f}')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.expression — 가장 두드러진 표정 이름 (expressions=True 일 때만)",summary:'_neutral을 제외한 최상위 blendshape 카테고리 이름. 예: "mouthSmileLeft".',details:`얼굴 미검출이거나 모두 _neutral이면 None.

process(draw=True) + expressions=True 조건에서 expression 값이
자동으로 영상 좌상단에 그려집니다.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    if detector.expression:
        # 예: 'mouthSmileLeft', 'browDownLeft', 'jawOpen'
        print(detector.expression)

    cv2.imshow('expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.expression_score — 위 expression 점수 (0.0~1.0)",summary:"detector.expression이 가리키는 카테고리의 점수.",details:"얼굴 미검출 또는 expressions=False면 0.0.",example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    name = detector.expression
    score = detector.expression_score
    # 임계값 0.5 이상일 때만 신뢰
    if name and score > 0.5:
        print(f'{name}: {score:.2f}')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 1: 정적 이미지 얼굴 메시 표시",summary:"이미지 파일에서 얼굴을 검출하고 메시 + 22점을 그려서 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image

detector = FaceDetector()
img = cv2.imread('face.jpg')

# 얼굴 검출 → 메시가 그려진 결과 이미지 받기
out_img, points = detector.process(Image(img))

print('22점 검출:', len(points))
cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 얼굴 메시",summary:"웹캠을 열어 매 프레임 얼굴 메시를 화면에 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

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
cv2.destroyAllWindows()`},{name:"예제 3: 코끝 좌표 출력",summary:"검출된 22점 중 코끝(인덱스 15)의 좌표를 매 프레임 콘솔에 찍습니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# points 인덱스: [14]=NOSE 5번, [15]=NOSE 4번(끝점)
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
cv2.destroyAllWindows()`},{name:"예제 4: 좌우 입꼬리 거리로 미소 감지",summary:'입의 좌측 끝(18)과 우측 끝(20) 사이 거리가 임계값을 넘으면 "미소" 출력.',details:null,example:`import web_cv2 as cv2
import math
from helloai import FaceDetector, Image, Keyboard

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
        # 두 점 사이 픽셀 거리 (입 너비)
        width = math.hypot(rx - lx, ry - ly)
        print(f'입 너비: {width:.0f}px',
              '(미소!)' if width > 80 else '')

    cv2.imshow('smile', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: blendshape으로 미소·입벌림·눈깜빡임 감지",summary:"expressions=True 옵션으로 표정 계수를 받아 임계값으로 표정을 판별합니다.",details:`expressions=True를 켜면 478개 랜드마크 외에 52개 표정 계수가 함께
계산됩니다. 학습 모델(.fcm) 없이도 즉시 미소/입벌림/눈깜빡임 같은
기본 표정을 정량화할 수 있습니다.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    bs = detector.blendshapes
    if bs:
        # 좌우 평균으로 점수 정규화
        smile = (bs.get('mouthSmileLeft', 0) + bs.get('mouthSmileRight', 0)) / 2
        jaw = bs.get('jawOpen', 0)
        blink = (bs.get('eyeBlinkLeft', 0) + bs.get('eyeBlinkRight', 0)) / 2

        # 임계값을 넘으면 표정 메시지 출력
        if smile > 0.5:
            print(f'미소! ({smile:.2f})')
        if jaw > 0.4:
            print(f'입 벌림 ({jaw:.2f})')
        if blink > 0.5:
            print(f'눈 감음 ({blink:.2f})')

    cv2.imshow('expressions', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 가장 두드러진 표정 한 줄 출력",summary:"detector.expression / .expression_score로 최상위 표정을 매 프레임 표시.",details:`expression은 _neutral을 제외한 최상위 blendshape 이름이라 무표정에서는
직전 표정이 약하게 남거나 None이 나올 수 있습니다. 임계값(예: 0.4)으로
잡음을 줄이세요.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

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

    cv2.imshow('top expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 7: 자동 expression 라벨 오버레이",summary:"expressions=True + draw_label=True(기본) 조건에서 expression이 매 프레임 자동으로 좌상단에 표시됩니다.",details:`표정을 화면에 그리려면 두 가지 모두 켜져 있어야 합니다.
  1) FaceDetector(expressions=True) — expression 값이 계산됨
  2) draw_label=True (기본) — process가 좌상단에 자동으로 putText

단발성으로 끄고 싶다면 process(..., show_label=False).`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# expression 계산이 켜져 있어야 라벨이 표시됨
detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # 라벨이 자동으로 좌상단에 그려짐 (별도 putText 불필요)
    out_img, _ = detector.process(Image(frame))

    cv2.imshow('auto expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"pose",title:"전신 포즈 검출 (PoseDetector)",description:'카메라/이미지에서 전신의 33개 keypoint(머리·어깨·팔꿈치·손목·엉덩이·무릎·발목)를 찾고, "만세", "T자", "스쿼트" 같은 자세도 자동으로 분류해 줍니다.',icon:"directions_run",image:r,entries:[{name:"from helloai import PoseDetector, Image",summary:"포즈 검출기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 그대로 붙여 사용합니다.",example:`# 포즈 검출기와 Image 래퍼를 함께 가져옵니다
from helloai import PoseDetector, Image`},{name:"Image와 frame의 관계 (꼭 읽어주세요)",summary:"cv2 함수에는 frame을, PoseDetector에는 Image(frame)을 넣습니다. 다시 cv2로 보낼 때는 .frame 속성으로 꺼냅니다.",example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()       # cv2 → 원본 frame
    if not ok:
        continue

    # 검출기에는 Image(frame)으로 감싸서 전달
    out_img, lmlist = detector.process(Image(frame))

    # cv2.imshow에 다시 raw frame이 필요 → .frame으로 꺼냄
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseDetector(draw_label=True) — 검출기 만들기",summary:"포즈 검출기를 만듭니다. 첫 호출 시 모델(약 5MB)을 다운로드합니다.",details:`Args:
  draw_label (bool): True면 process가 매 프레임 영상의 좌상단에
    detector.pose 라벨을 자동으로 그립니다. 끄려면 False.
Returns: PoseDetector 객체`,example:`from helloai import PoseDetector

# 기본 옵션으로 검출기를 만듭니다
detector = PoseDetector()`,warning2:`33개 keypoint 인덱스: 0=NOSE, 11/12=L/R 어깨, 13/14=L/R 팔꿈치,
15/16=L/R 손목, 23/24=L/R 엉덩이, 25/26=L/R 무릎, 27/28=L/R 발목.`,warning2Type:"info"},{name:"detector.process(image, ...) — 포즈 검출",summary:"포즈를 검출하고 33개 keypoint의 픽셀 좌표 리스트를 돌려줍니다.",details:`Args:
  image (Image): 입력 이미지
  draw (bool): True면 보라색 스켈레톤을 그립니다.
  line_width (int), circle_radius (int): 시각화 크기
  show_label (bool|None): 이 호출에서만 pose 라벨 토글.

Returns: (Image, list)
  - Image: 시각화된 결과
  - list: 33개 (x, y, z) 튜플 (미검출 시 빈 리스트 [])`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image

detector = PoseDetector()
img = cv2.imread('pose.jpg')

# 포즈 검출 → 시각화 결과와 33개 keypoint
out_img, lmlist = detector.process(Image(img))

if lmlist:
    nose = lmlist[0]            # 0번 = 코
    print('코 좌표:', nose[:2])

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"detector.calc_angle(image, p1, p2, p3, draw=True) — 세 점이 이루는 각도",summary:"세 점 (p1-p2-p3)이 만드는 p2 기준의 각도를 도(degree)로 계산합니다.",details:`Args:
  image (Image): 그릴 이미지
  p1, p2, p3 ((x, y, z)): 세 keypoint
  draw (bool): True면 흰 선 + 빨간 원 + 각도 숫자를 표시
Returns:
  (angle, Image): 0~360 사이 각도, 시각화된 Image`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # 11=왼어깨, 13=왼팔꿈치, 15=왼손목 → 팔꿈치 각도
        angle, out_img = detector.calc_angle(
            out_img, lmlist[11], lmlist[13], lmlist[15]
        )
        print(f'왼팔 팔꿈치 각도: {angle:.0f}°')

    cv2.imshow('elbow angle', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.distance(p1_idx, p2_idx, image, draw=True) — 두 keypoint 거리",summary:"두 keypoint **인덱스** 사이의 거리를 계산합니다 (HandsDetector.distance와 인자 형식이 다름 — 좌표가 아니라 인덱스 번호).",details:`Args:
  p1_idx, p2_idx (int): keypoint 인덱스 (0~32)
  image (Image): 그릴 이미지
  draw (bool): True면 마젠타 선 + 원을 그림
Returns:
  (length, Image, [x1, y1, x2, y2, cx, cy])`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # 11번(왼어깨)~15번(왼손목) 사이 픽셀 거리
        length, out_img, _ = detector.distance(11, 15, out_img)
        print(f'어깨~손목 거리: {length:.0f}px')

    cv2.imshow('distance', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.pose — 자동 포즈 라벨",summary:"process() 직후 현재 사람이 취한 포즈를 문자열로 돌려줍니다. 판별 불가/미검출이면 None.",details:`랜드마크의 상대 좌표(어깨 너비를 단위로)로 우선순위에 따라 단일 라벨을 결정합니다.
process() 안에서 자동 갱신되므로 detector.pose로 바로 읽으면 됩니다.

process(draw=True)일 때는 detector.pose 값이 자동으로 영상 좌상단에 그려집니다.

참고:
  • 좌/우는 화면 기준입니다 (카메라 미러 모드와 무관).
  • 한 프레임에서 여러 조건이 맞으면 아래 표 순서로 단일 라벨이 선택됩니다.
  • 임계값은 어깨 너비로 정규화되어 카메라 거리에 무관합니다.`,table:{headers:["라벨","조건"],rows:[['"lying"',"몸이 수평 (어깨/엉덩이/무릎 y 거의 동일)"],['"arms_crossed"',"양 손목이 반대쪽 어깨 근처, 어깨 아래"],['"hands_up"',"양 손목이 양 어깨보다 위 (만세)"],['"t_pose"',"양 팔이 수평으로 어깨 바깥까지 뻗음"],['"left_hand_up"',"화면 왼쪽 손만 어깨 위"],['"right_hand_up"',"화면 오른쪽 손만 어깨 위"],['"squat"',"엉덩이가 무릎 근처/아래로 내려감"],['"sitting"',"무릎 각도 약 60°~130° (다리 굽힘)"],['"bending"',"어깨가 엉덩이 가까이로 내려감 (허리 굽힘)"],['"standing"',"어깨 < 엉덩이 < 무릎 < 발목 순으로 수직 정렬"],["None","어느 조건도 만족하지 않거나 사람이 검출되지 않음"]]},example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    # process가 끝나면 detector.pose가 자동 갱신됨
    if detector.pose == 'hands_up':
        print('만세!')
    elif detector.pose is None:
        print('포즈를 인식할 수 없습니다')

    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 1: 정적 이미지 포즈 검출",summary:"이미지 파일에서 전신 포즈를 검출하고 스켈레톤을 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image

detector = PoseDetector()
img = cv2.imread('pose.jpg')

# 포즈 검출 → 33개 keypoint와 시각화된 이미지
out_img, lmlist = detector.process(Image(img))

print('keypoint 개수:', len(lmlist))
cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 포즈",summary:"웹캠을 열어 매 프레임 포즈 스켈레톤을 화면에 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

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
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        l = lmlist[11]              # 11번 = 왼어깨 (LEFT_SHOULDER)
        r = lmlist[12]              # 12번 = 오른어깨 (RIGHT_SHOULDER)
        print(f'L 어깨 {l[:2]}  R 어깨 {r[:2]}')

    cv2.imshow('shoulders', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 왼팔 팔꿈치 각도 측정",summary:"어깨(11)-팔꿈치(13)-손목(15)으로 팔꿈치 각도를 실시간 측정합니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # 11-13-15 세 점이 이루는 13번에서의 각도 = 팔꿈치 각도
        angle, out_img = detector.calc_angle(
            out_img, lmlist[11], lmlist[13], lmlist[15]
        )
        print(f'왼팔 팔꿈치 각도: {angle:.0f}°')

    cv2.imshow('elbow angle', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 어깨~손목 거리 측정",summary:"distance(p1_idx, p2_idx)로 왼쪽 어깨-손목 거리를 화면에 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # 인덱스를 직접 넘김 (HandsDetector.distance와 다름!)
        length, out_img, _ = detector.distance(11, 15, out_img)
        print(f'어깨~손목: {length:.0f}px')

    cv2.imshow('reach', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 자동 포즈 라벨 표시 (만세/스쿼트 등)",summary:"매 프레임 detector.pose 값이 자동으로 좌상단에 그려집니다. 만세/T자/스쿼트/앉기/눕기 등을 직접 시도해 보세요.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

# 기본 draw_label=True → 좌상단에 pose 라벨 자동 표시
detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # 자동 라벨 + 스켈레톤이 그려진 결과
    out_img, _ = detector.process(Image(frame))

    # 콘솔에도 현재 포즈를 찍어서 확인
    if detector.pose:
        print('현재 포즈:', detector.pose)

    cv2.imshow('pose label', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"ocr",title:"글자 인식 (OCR)",description:"이미지나 카메라 영상 속의 영문/한글 텍스트를 읽어서 문자열로 돌려줍니다 (Tesseract.js 기반).",icon:"document_scanner",entries:[{name:"from helloai import OCR, Image",summary:"OCR 클래스와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 그대로 붙여 사용합니다.",example:`# 글자 인식기와 Image 래퍼를 함께 가져옵니다
from helloai import OCR, Image`},{name:"OCR() — 인식기 만들기",summary:"한/영 OCR 엔진을 만듭니다. 첫 호출 시 언어 데이터(언어당 약 5–10MB)를 다운로드합니다.",details:`Args: 없음 (영어+한국어 고정)
Returns: OCR 객체

내부적으로 easyocr.Reader(["en", "ko"]) 인터페이스를 따르지만
실제 추론은 브라우저의 Tesseract.js로 라우팅됩니다.`,example:`from helloai import OCR

# 한/영 동시 인식 OCR 인스턴스 생성
ocr = OCR()`},{name:"ocr.readtext(img, isdraw=True) — 글자 인식",summary:"이미지에서 텍스트를 인식하고 (결과 리스트, 시각화된 Image)를 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지
  isdraw (bool): True면 인식된 단어 주변에 초록 박스 + 빨간 라벨을 그림.
Returns:
  (results, Image): results = [(bbox, text, prob), ...]
    bbox = [TL, TR, BR, BL] 4점 ([[x,y], ...])
    text = 인식된 문자열
    prob = 0~1 신뢰도`,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# 글자 인식 → 결과 리스트와 시각화 이미지
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # 인식된 단어와 신뢰도 함께 출력
    print(f'{text!r}  prob={prob:.2f}')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 1: 정적 이미지에서 영문 인식",summary:"이미지 파일에서 텍스트를 읽고 인식 결과를 콘솔에 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# 글자 영역과 신뢰도가 함께 나옵니다
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    print(f'{text!r}  ({prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 한글 텍스트 인식",summary:"한글이 포함된 이미지에서도 동일한 코드로 인식됩니다 (en+ko 동시 지원).",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('hangul.png')      # 한글이 들어있는 이미지

results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # 신뢰도와 함께 한 줄씩 출력
    print(f'[{prob:.2f}] {text}')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 3: 신뢰도(prob) 0.7 이상만 출력",summary:"낮은 신뢰도의 잘못된 인식은 걸러내고 확실한 결과만 사용합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # 임계값 미만이면 건너뜀
    if prob < 0.7:
        continue
    print(f'{text}  (prob {prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 4: 인식된 박스 좌표만 추출 (시각화 끄기)",summary:"isdraw=False로 박스 그리기를 끄고 좌표/텍스트만 활용합니다.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# 시각화 없이 좌표만 받아서 사용
results, _ = ocr.readtext(Image(img), isdraw=False)

for (bbox, text, prob) in results:
    tl = bbox[0]                # 좌상단
    br = bbox[2]                # 우하단
    print(f'{text}  TL={tl}  BR={br}')`}]},{id:"qr",title:"QR 코드 인식 (QRReader)",description:"카메라/이미지에서 QR 코드를 디코드해 그 안의 텍스트를 꺼내옵니다. 모델 다운로드 없이 즉시 사용 가능합니다.",icon:"qr_code_scanner",entries:[{name:"from helloai import QRReader, Image",summary:"QR 리더와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 그대로 붙여 사용합니다.",example:`# QR 리더와 Image 래퍼를 함께 가져옵니다
from helloai import QRReader, Image`},{name:"QRReader() — 리더 만들기",summary:"QR 리더를 만듭니다. 모델 다운로드 없이 즉시 사용 가능합니다.",details:`Args: 없음
Returns: QRReader 객체

jsQR 라이브러리(약 30KB) 기반으로 추가 네트워크 다운로드가 없습니다.`,example:`from helloai import QRReader

# QR 리더 인스턴스 생성 (즉시 사용 가능)
qr = QRReader()`},{name:"qr.process(img, draw=True) — QR 디코드",summary:"이미지에서 QR을 디코드하고 (결과 리스트, 시각화된 Image)를 돌려줍니다.",details:`Args:
  img (Image): 입력 이미지
  draw (bool): True면 QR 외곽 4면을 초록색, 텍스트를 빨간색으로 그림.
Returns:
  (results, Image): results = [(bbox, data), ...]
    bbox = [TL, TR, BR, BL] 4점
    data = 디코드된 문자열

한 프레임당 최대 1개 (jsQR 제약).`,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

# QR 디코드 → 결과 리스트와 시각화 이미지
results, out_img = qr.process(Image(img))

for (bbox, data) in results:
    print('QR:', data)

cv2.imshow('qr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"qr.read(img) — 텍스트만 추출",summary:"process의 단축형 — 디코드된 문자열 리스트만 돌려줍니다 (시각화 없음).",details:`Args:
  img (Image): 입력 이미지
Returns:
  list[str]: 디코드된 문자열 (현재 최대 1개 원소)`,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

# 시각화 없이 텍스트만 빠르게 추출
texts = qr.read(Image(img))
if texts:
    print(texts[0])
else:
    print('QR을 찾지 못했습니다')`},{name:"예제 1: 정적 이미지의 QR 디코드",summary:"이미지 파일에 그려진 QR을 한 번에 읽습니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

results, out_img = qr.process(Image(img))

for (bbox, data) in results:
    print('QR 데이터:', data)

cv2.imshow('qr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"예제 2: 웹캠 실시간 스캔",summary:"웹캠 앞에 QR을 비추면 매 프레임 디코드 결과를 콘솔에 출력합니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image, Keyboard

qr = QRReader()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))
    for (bbox, data) in results:
        print('QR:', data)
    cv2.imshow('QR scanner', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 3: 같은 QR 중복 출력 방지",summary:"같은 코드를 들고 있는 동안에는 한 번만 출력합니다 (last 비교 패턴).",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image, Keyboard

qr = QRReader()
cap = cv2.VideoCapture()
last = None                         # 직전에 출력한 QR 텍스트 기억

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))

    for (bbox, data) in results:
        # 직전과 다를 때만 새로운 QR로 간주해 출력
        if data != last:
            print('NEW QR:', data)
            last = data

    cv2.imshow('QR', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: URL인 경우만 출력",summary:"디코드된 데이터가 http:// 또는 https://로 시작할 때만 처리합니다.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image, Keyboard

qr = QRReader()
cap = cv2.VideoCapture()
last = None

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))

    for (bbox, data) in results:
        # URL 형식인지 확인 후 한 번만 출력
        if data != last and data.startswith(('http://', 'https://')):
            print('URL 발견:', data)
            last = data

    cv2.imshow('QR URL Scanner', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"tm_image",title:"Teachable Machine 모델 사용 (TMImageModel)",description:"Google Teachable Machine 사이트에서 학습한 이미지 분류 모델을 IDE로 가져와 카메라/이미지에 바로 적용합니다.",icon:"category",externalLink:{href:"https://teachablemachine.withgoogle.com/train/image",label:"Teachable Machine 열기",icon:"open_in_new"},image:i,imageNote:`이 페이지의 API를 사용하려면 Teachable Machine에서 학습이 끝난 모델을 "Export Model" → "Tensorflow" 탭의 "Tensorflow.js" 옵션에서 URL 또는 파일을 내려받아야 합니다.
다운로드한 모델 파일(.zip)은 좌측 File Explorer에 업로드한 뒤, 코드에서 그 경로를 load_model()에 전달해 사용합니다.`,entries:[{name:"from helloai import TMImageModel, Image",summary:"Teachable Machine 이미지 분류기와 이미지 래퍼를 가져옵니다.",details:"예제 코드 맨 위에 그대로 붙여 사용합니다.",example:`# Teachable Machine 이미지 모델과 Image 래퍼를 가져옵니다
from helloai import TMImageModel, Image`},{name:"TMImageModel() — 빈 모델 객체 만들기",summary:"Teachable Machine 이미지 모델 객체를 만듭니다 (모델은 아직 비어 있음).",details:`Args: 없음
Returns: TMImageModel 객체

내부적으로 @teachablemachine/image (TensorFlow.js) 가 메인 스레드에서
실행되며, 첫 load_model() 호출 시점에 약 1MB의 라이브러리가 lazy 다운로드됩니다.`,example:`from helloai import TMImageModel

# 빈 모델 인스턴스 생성 (실제 가중치는 load_model에서 받아옴)
tm = TMImageModel()`},{name:"tm.load_model(url_or_path) — 모델 불러오기",summary:"Teachable Machine URL 또는 업로드한 .zip 경로로 모델을 로드합니다.",details:`Args:
  url 형태 (str): TM "Tensorflow.js" 탭의 "Upload my model"로 발급된 공유 URL.
    예) "https://teachablemachine.withgoogle.com/models/VQ9dhejr9/"
  파일 경로 (str): /work/ 기준 상대경로 또는 절대경로.
    "Tensorflow.js" 탭의 "Download my model"로 받은 .zip을 Explorer에
    업로드한 뒤 그 파일명을 전달합니다.
Returns: 로딩 성공 시 True

주의: 브라우저 TFJS는 keras .h5 파일을 직접 열지 못합니다. 반드시 "Tensorflow.js"
export로 받은 URL 또는 .zip 파일을 사용하세요.`,example:`from helloai import TMImageModel

tm = TMImageModel()

# 방법 A: URL로 모델 받아오기
tm.load_model("https://teachablemachine.withgoogle.com/models/VQ9dhejr9/")

# 방법 B: 업로드한 zip 파일 (방법 A를 안 쓸 때)
# tm.load_model("my_model.zip")

# 학습된 클래스 확인
print('클래스:', tm.labels)`},{name:"tm.process(img) — 이미지 분류",summary:"입력 이미지를 분류하고 가장 확률 높은 클래스 라벨(문자열)을 돌려줍니다.",details:`Args:
  img (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
Returns:
  str: 가장 확률 높은 클래스 라벨. 모델 미로딩이거나 입력이 비면 "".

직전 호출의 신뢰도는 tm.confidence로 따로 읽을 수 있습니다.`,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')

# 분류 → 라벨 문자열 + 신뢰도 확인
label = tm.process(Image(img))
print('결과:', label, '신뢰도:', tm.confidence)`},{name:"tm.labels — 클래스 이름 리스트",summary:"모델의 클래스 라벨 리스트(읽기 전용).",details:`Returns:
  list[str]: TM에서 지정한 클래스 이름 순서대로의 리스트.

load_model() 이후에 사용 가능합니다.`,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

# 학습된 클래스 이름들
print(tm.labels)
# 예: ["Class 1", "Class 2", "Class 3"]`},{name:"tm.confidence — 직전 분류 신뢰도",summary:"직전 process() 결과의 최고 클래스 확률(0.0 ~ 1.0).",details:`Returns:
  float: 0~1 사이 확률. 소수 셋째 자리까지 반올림.

process()를 한 번도 호출하지 않았다면 None입니다.`,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')
label = tm.process(Image(img))

# 임계값을 넘었을 때만 신뢰
if tm.confidence and tm.confidence >= 0.8:
    print('확신:', label)`},{name:"tm.summary() — 모델 정보 출력",summary:"로드된 모델의 클래스 라벨을 콘솔에 출력합니다.",details:`Args: 없음
Returns: 없음

모델이 로딩되지 않았으면 안내 메시지를 출력합니다.`,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

# 콘솔에 클래스 정보 출력
tm.summary()`},{name:"예제 1: 모델 로딩 + 클래스 확인",summary:"URL로 모델을 받아오고 클래스 이름을 확인합니다 (가장 단순한 시작점).",details:null,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

# 학습된 클래스 개수와 이름을 한 번에 확인
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
from helloai import TMImageModel, Image, Keyboard

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
from helloai import TMImageModel, Image, Keyboard

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

    # 임계값 이상인 결과만 신뢰
    if tm.confidence and tm.confidence >= THRESHOLD:
        print(f'>> {label}  ({tm.confidence:.2f})')
    else:
        print('...')                # 잡음으로 처리

    cv2.imshow('tm', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 라벨/신뢰도 화면 오버레이",summary:"결과 라벨과 신뢰도를 매 프레임 영상 좌상단에 그려서 보여줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image, Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))

    # 라벨과 신뢰도를 한 줄 텍스트로 만들어 그리기
    text = f'{label}  {tm.confidence:.2f}' if label else 'no model'
    cv2.putText(frame, text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('tm overlay', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 6: 라벨 변경 시점만 출력 + 클래스별 카운트",summary:"같은 라벨이 이어지는 동안에는 출력을 억제하고, 라벨이 바뀔 때마다 누적 카운트를 표시합니다.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image, Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
THRESHOLD = 0.7

tm = TMImageModel()
tm.load_model(URL)

# 클래스별 누적 카운터 초기화
counts = {name: 0 for name in tm.labels}
last = None                         # 직전 라벨 기억

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    confident = tm.confidence and tm.confidence >= THRESHOLD

    # 라벨이 새로 바뀐 순간만 카운트 + 출력
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
cv2.destroyAllWindows()`}]},{id:"image_classifier",title:"내 이미지 분류기 (ImageClassifier)",description:"좌측 Classify 패널에서 직접 학습한 .fcm 이미지 모델을 카메라/이미지에 적용합니다 (예: 컵 vs 책 vs 빈 손).",icon:"image_search",notice:'실행 전에 좌측 Classify 패널의 [Image] 탭에서 클래스를 학습하고 ".fcm" 파일로 저장해 두어야 합니다. 모델 파일이 없으면 ImageClassifier(...) 호출에서 FileNotFoundError가 발생합니다.',entries:[{name:"from helloai import ImageClassifier, Image",summary:"이미지 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 그대로 붙여 사용합니다.

ImageClassifier는 사진 한 장 전체의 "분위기/대상"을 분류하는 모델입니다.
예) 컵 vs 책 vs 빈손, 마스크 착용 vs 미착용, 사과 vs 바나나 vs 포도 등.
Classify 패널에서 클래스마다 사진을 모아 학습하면 자동으로 .fcm 파일이 만들어집니다.`,example:`# 이미지 분류기와 Image 래퍼를 함께 가져옵니다
from helloai import ImageClassifier, Image`},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`ImageClassifier는 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널이 담당하고, 그 결과가 한 개의 .fcm 파일로 저장됩니다.

단계별 절차:

① 좌측 사이드바에서 Classify (분류) 패널을 엽니다.
② [Image] 탭을 선택하고, 분류하고 싶은 클래스(예: cup / book / empty)를
   2개 이상 만든 뒤 각 클래스마다 웹캠으로 사진을 여러 장 캡처합니다.
③ "Train" 버튼으로 학습 → 끝나면 "💾 .fcm 저장" 버튼이 활성화됩니다.
④ 적당한 이름(예: cup_book.fcm)으로 프로젝트 폴더에 저장합니다.
⑤ 코드에서 그 경로를 ImageClassifier(...)에 넘기면 됩니다.

경로 규칙: "models/cup_book.fcm" 처럼 프로젝트 루트 기준 상대경로 권장.
         절대경로(/work/...)도 가능합니다.`,example:`# 프로젝트 폴더 구조 예시
# my_project/
#   ├─ main.py            ← 지금 작성 중인 코드
#   └─ cup_book.fcm       ← Classify 패널에서 저장한 모델

from helloai import ImageClassifier, Image

# 같은 폴더면 파일명만 넘기면 됩니다
clf = ImageClassifier('cup_book.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (Detector와 동일한 규칙)",summary:"cv2 함수에는 frame을, ImageClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image를 그대로 돌려줍니다.",example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 → 원본 frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # 분류기 → Image로 감싸기
    cv2.imshow('image', out_img.frame)            # cv2.imshow → .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warning2:"ImageClassifier는 cv2.imread() 또는 cap.read()로 얻은 프레임만 받습니다. numpy 배열을 직접 만들어 Image()로 감싸 넣으면 TypeError가 발생합니다.",warning2Type:"info"},{name:"ImageClassifier(model_path, draw_label=True) — 분류기 만들기",summary:".fcm 파일을 읽어 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: ImageClassifier 객체

내부적으로 MobileNetV2의 1280차원 특징을 메인 스레드에서 추출한 뒤,
Classify 패널이 학습한 가벼운 분류 헤드(softmax / MLP / SVM / RandomForest)를 통과시킵니다.
첫 호출 시 MobileNet 가중치(약 9MB)가 1회 다운로드된 뒤 캐시됩니다.`,example:`from helloai import ImageClassifier

# .fcm 파일 경로를 넘겨 분류기 생성
clf = ImageClassifier('cup_book.fcm')
print('클래스:', clf.labels)`},{name:"clf.process(image, draw=True) — 이미지 분류",summary:"입력 이미지를 분류해 (Image, Result)를 돌려줍니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True이고 생성자에서 draw_label=True면 라벨 텍스트를 화면에 그림
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 라벨 그려짐)
    - Result: 아래 "Result 객체" 항목 참고`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')
img = cv2.imread('test.png')

# 분류 → 결과 객체 받기
out_img, result = clf.process(Image(img))
print(result.label, '신뢰도:', f'{result.confidence:.2f}')

cv2.imshow('image', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result 객체 — label / confidence / probabilities / labels",summary:"process()가 돌려주는 분류 결과 객체. 어떤 클래스인지·얼마나 확신하는지가 담겨 있습니다.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름. 예) "cup"
  result.index (int): labels 리스트에서의 위치
  result.confidence (float): 0.0 ~ 1.0 — 가장 높은 클래스의 확률
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 모델 전체 클래스 이름 리스트
  result.landmarks: ImageClassifier에서는 항상 None
                   (얼굴/손/포즈 분류기에서만 keypoint 좌표가 들어옵니다)`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')
img = cv2.imread('test.png')
out_img, result = clf.process(Image(img))

# 가장 높은 클래스 결과
print(result.label)
print(f'{result.confidence * 100:.1f}%')

# 모든 클래스의 점수도 함께 확인
for name, p in zip(result.labels, result.probabilities):
    print(f'  {name}: {p:.2f}')`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 메모리 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process()할 수 없습니다.`,example:`from helloai import ImageClassifier

clf = ImageClassifier('cup_book.fcm')
print(clf.labels)               # 예: ['cup', 'book', 'empty']

# 더 이상 쓰지 않을 때 명시적 정리(선택)
clf.close()`},{name:"예제 1: 정적 이미지 1장 분류",summary:"이미지 파일을 한 장 읽어 가장 확률이 높은 클래스와 신뢰도를 출력합니다.",details:null,example:`import web_cv2 as cv2
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
from helloai import ImageClassifier, Image, Keyboard

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
낮은 확률로 아무 클래스나 골라버립니다. 임계값을 두면 깜빡임이 줄어듭니다.`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

THRESHOLD = 0.8
clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # 임계값 이상일 때만 신뢰
    if result.confidence >= THRESHOLD:
        print(f'>> {result.label}  ({result.confidence:.2f})')
    else:
        print('...')

    cv2.imshow('image', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 모든 클래스 확률을 화면에 표시",summary:"probabilities를 이용해 클래스별 점수를 화면 좌상단에 한 줄씩 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

# 라벨을 직접 그릴 거라 자동 표시는 끔
clf = ImageClassifier('cup_book.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # 클래스마다 한 줄씩 점수 표시
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 라벨이 바뀔 때만 출력 + 누적 카운트",summary:"같은 라벨이 이어지는 동안에는 출력을 억제하고, 라벨이 바뀔 때마다 클래스별 카운트를 보여줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

THRESHOLD = 0.7
clf = ImageClassifier('cup_book.fcm')

# 클래스별 카운터 초기화
counts = {name: 0 for name in clf.labels}
last = None

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    confident = result.confidence >= THRESHOLD

    # 라벨이 새로 바뀐 순간만 처리
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
cv2.destroyAllWindows()`}]},{id:"face_classifier",title:"내 얼굴(표정) 분류기 (FaceClassifier)",description:"좌측 Classify 패널에서 학습한 .fcm 얼굴 모델로 표정을 분류합니다 (예: 미소 vs 무표정, 눈 감음 vs 눈 뜸).",icon:"sentiment_satisfied",image:a,notice:'실행 전에 먼저 좌측 Classify 패널의 [Face] 탭에서 표정/얼굴 클래스를 학습하고 ".fcm" 파일로 저장해 두어야 합니다.',entries:[{name:"from helloai import FaceClassifier, Image",summary:"얼굴 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 그대로 붙여 사용합니다.

FaceClassifier는 얼굴의 표정/움직임을 분류하는 모델입니다.
예) 웃는 얼굴 vs 무표정, 눈 감음 vs 눈 뜸, 입 벌림 vs 다물기 등.
입력 frame에서 직접 얼굴 keypoint를 뽑아 분류기에 넣기 때문에
FaceDetector를 따로 만들 필요가 없습니다.`,example:`# 얼굴 분류기와 Image 래퍼를 함께 가져옵니다
from helloai import FaceClassifier, Image`},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Face] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`FaceClassifier도 모델을 직접 학습하지 않습니다.
학습은 IDE 좌측의 "Classify" 패널 [Face] 탭이 담당하고, 결과가 ".fcm"으로 저장됩니다.

단계별로:

① 좌측 사이드바 → Classify 패널 → [Face] 탭을 엽니다.
② "smile / neutral"처럼 클래스를 만들고, 각 클래스에서 자기 얼굴을
   카메라에 비추며 샘플을 모읍니다 (한 클래스에 30~100장 권장).
③ "Train" 후 "💾 .fcm 저장"으로 프로젝트 폴더에 저장합니다.
④ 코드에서 그 경로를 FaceClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe FaceLandmarker로 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이뤄집니다 (오차가 작음).`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ smile.fcm

from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (Detector와 동일한 규칙)",summary:"cv2 함수에는 frame을, FaceClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:`주의: cv2.imread() / cap.read()로 얻은 프레임만 받습니다.
직접 만든 numpy 배열은 TypeError를 발생시킵니다.`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 → 원본 frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # 분류기 → Image로 감싸기
    cv2.imshow('face', out_img.frame)             # cv2.imshow → .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceClassifier(model_path, draw_label=True) — 분류기 만들기",summary:".fcm 파일을 읽어 얼굴 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: FaceClassifier 객체

내부에서 MediaPipe FaceLandmarker로 478개 점 중 학습 시 사용한 82개
서브셋만 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 FaceLandmarker 모델(약 3MB)이 1회 다운로드됩니다.`,example:`from helloai import FaceClassifier

# .fcm 파일 경로로 분류기 생성
clf = FaceClassifier('smile.fcm')
print('클래스:', clf.labels)`},{name:"clf.process(image, draw=True) — 표정 분류",summary:"얼굴을 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 회색 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 얼굴 미검출 시 label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
img = cv2.imread('face.jpg')

# 표정 분류 → 결과 객체
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('얼굴이 보이지 않습니다')

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 얼굴 keypoint 픽셀 좌표 리스트.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 학습에 쓰인 82개 얼굴 keypoint 픽셀 좌표
                                     (얼굴 미검출 시 빈 리스트 [])`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
img = cv2.imread('face.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    print('keypoint 수:', len(result.landmarks))
    print('첫 점:', result.landmarks[0])  # (x, y, z)`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 메모리 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process()할 수 없습니다.`,example:`from helloai import FaceClassifier

clf = FaceClassifier('smile.fcm')
print(clf.labels)               # 예: ['smile', 'neutral']

# 명시적 정리 (선택)
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
from helloai import FaceClassifier, Image, Keyboard

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
cv2.destroyAllWindows()`},{name:'예제 3: "smile"일 때만 신호 출력',summary:"특정 클래스가 일정 신뢰도 이상으로 나올 때만 메시지를 띄웁니다.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()
last = None                         # 직전 상태 기억

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # smile 라벨이 0.7 이상으로 처음 나타날 때만 출력
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
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # 클래스마다 한 줄씩 점수 표시
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: landmarks로 얼굴 중심에 점 찍기",summary:"result.landmarks 첫 점에 빨간 원을 추가로 그립니다.",details:`landmarks는 학습에 사용된 82개 keypoint입니다. 인덱스 의미는
Classify 패널 [Face] 탭의 시각화와 동일한 순서입니다.`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    if result.landmarks:
        # 첫 keypoint 위치에 빨간 점을 직접 추가
        x, y, _ = result.landmarks[0]
        cv2.circle(out_img.frame, (x, y), 8, (0, 0, 255), -1)

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand_classifier",title:"내 손(제스처) 분류기 (HandClassifier)",description:"좌측 Classify 패널에서 학습한 .fcm 손 모델로 제스처를 분류합니다 (예: 가위/바위/보, 숫자 손가락).",icon:"gesture",image:e,notice:'실행 전에 먼저 좌측 Classify 패널의 [Hand] 탭에서 손 모양/제스처 클래스를 학습하고 ".fcm" 파일로 저장해 두어야 합니다.',entries:[{name:"from helloai import HandClassifier, Image",summary:"손 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 그대로 붙여 사용합니다.

HandClassifier는 손 모양·제스처를 분류하는 모델입니다.
예) 가위 vs 바위 vs 보, 엄지척 vs 평범, 숫자 1~5 손가락 등.
입력 frame에서 직접 손 keypoint를 뽑아 분류기에 넣기 때문에
HandsDetector를 따로 만들 필요가 없습니다.`,example:`# 손 분류기와 Image 래퍼를 함께 가져옵니다
from helloai import HandClassifier, Image`},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Hand] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`단계별로:

① 좌측 사이드바 → Classify 패널 → [Hand] 탭을 엽니다.
② "rock / paper / scissors"처럼 클래스를 만들고, 카메라 앞에서
   각 손 모양을 보여주며 샘플을 모읍니다 (한 클래스 30~100장 권장).
③ "Train" 후 "💾 .fcm 저장"으로 프로젝트 폴더에 저장합니다.
④ 코드에서 그 경로를 HandClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe HandLandmarker로 21개 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이뤄집니다.`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ rps.fcm     ← 가위/바위/보 모델

from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (Detector와 동일한 규칙)",summary:"cv2 함수에는 frame을, HandClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:"주의: cv2.imread() / cap.read() 결과만 받습니다. numpy 배열은 TypeError.",example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 → 원본 frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # 분류기 → Image로 감싸기
    cv2.imshow('hand', out_img.frame)             # cv2.imshow → .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"HandClassifier(model_path, draw_label=True) — 분류기 만들기",summary:".fcm 파일을 읽어 손 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: HandClassifier 객체

내부에서 MediaPipe HandLandmarker로 손 21개 keypoint를 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 HandLandmarker 모델(약 6MB)이 1회 다운로드됩니다.`,example:`from helloai import HandClassifier

# .fcm 파일 경로로 분류기 생성
clf = HandClassifier('rps.fcm')
print('클래스:', clf.labels)`},{name:"clf.process(image, draw=True) — 손 모양 분류",summary:"손을 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 파란 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 손 미검출 시 label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
img = cv2.imread('hand.jpg')

# 손 모양 분류 → 결과 객체
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('손이 보이지 않습니다')

cv2.imshow('hand', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 21개 손 keypoint 픽셀 좌표.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 21개 손 keypoint 픽셀 좌표

주요 인덱스 (HandsDetector와 동일):
  0=손목, 4=엄지 끝, 8=검지 끝, 12=중지 끝, 16=약지 끝, 20=새끼 끝`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
img = cv2.imread('hand.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    thumb = result.landmarks[4]     # 엄지 끝
    index = result.landmarks[8]     # 검지 끝
    print('엄지 끝:', thumb[:2], '검지 끝:', index[:2])`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 메모리 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process()할 수 없습니다.`,example:`from helloai import HandClassifier

clf = HandClassifier('rps.fcm')
print(clf.labels)               # 예: ['rock', 'paper', 'scissors']
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
from helloai import HandClassifier, Image, Keyboard

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
cv2.destroyAllWindows()`},{name:"예제 3: 라벨이 바뀔 때만 출력 (떨림 방지)",summary:"같은 손 모양이 이어지는 동안에는 한 번만 출력합니다.",details:`카메라 떨림으로 같은 손인데 짧게 다른 클래스가 깜빡일 수 있습니다.
임계값과 라벨 변화 비교를 함께 두면 출력이 깔끔해집니다.`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

THRESHOLD = 0.7
clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()
last = None                         # 직전 라벨 기억

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
from helloai import HandClassifier, Image, Keyboard

clf = HandClassifier('rps.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    if result.landmarks:
        tx, ty, _ = result.landmarks[4]     # 엄지 끝
        ix, iy, _ = result.landmarks[8]     # 검지 끝
        d = math.hypot(ix - tx, iy - ty)    # 픽셀 거리
        text = f'{result.label}  d={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('hand', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 5: 클래스별 확률 막대 그리기",summary:"probabilities로 각 클래스 점수를 막대그래프처럼 그려줍니다.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

clf = HandClassifier('rps.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # 클래스마다 한 줄 — 점수 비율로 막대 길이 계산
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        y = 30 + i * 28
        bar_w = int(200 * p)
        cv2.rectangle(out_img.frame, (140, y - 18),
                      (140 + bar_w, y), (0, 200, 0), -1)
        cv2.putText(out_img.frame, f'{name}: {p * 100:4.1f}%',
                    (10, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                    (255, 255, 255), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"pose_classifier",title:"내 자세 분류기 (PoseClassifier)",description:"좌측 Classify 패널에서 학습한 .fcm 전신 포즈 모델로 자세를 분류합니다 (예: 서있기/앉아있기, 요가 자세 A/B/C).",icon:"accessibility_new",image:r,notice:'실행 전에 먼저 좌측 Classify 패널의 [Pose] 탭에서 자세 클래스를 학습하고 ".fcm" 파일로 저장해 두어야 합니다.',entries:[{name:"from helloai import PoseClassifier, Image",summary:"포즈 분류기와 이미지 래퍼를 가져옵니다.",details:`예제 코드 맨 위에 그대로 붙여 사용합니다.

PoseClassifier는 전신 자세를 분류하는 모델입니다.
예) 서있기 vs 앉아있기, 만세 vs 차렷, 요가 자세 A/B/C 등.
입력 frame에서 직접 포즈 keypoint를 뽑아 분류기에 넣기 때문에
PoseDetector를 따로 만들 필요가 없습니다.`,example:`# 포즈 분류기와 Image 래퍼를 함께 가져옵니다
from helloai import PoseClassifier, Image`},{name:"준비 단계: .fcm 파일 만들기 (꼭 먼저 읽어주세요)",summary:'좌측 Classify 패널 [Pose] 탭에서 모델을 학습해 ".fcm" 파일을 프로젝트에 저장한 뒤 코드에서 그 경로를 사용합니다.',details:`단계별로:

① 좌측 사이드바 → Classify 패널 → [Pose] 탭을 엽니다.
② "stand / sit / hands_up"처럼 클래스를 만들고, 카메라 앞에서
   각 자세를 취하며 샘플을 모읍니다 (전신이 화면에 들어와야 합니다).
③ "Train" 후 "💾 .fcm 저장"으로 프로젝트 폴더에 저장합니다.
④ 코드에서 그 경로를 PoseClassifier(...)에 넘기면 됩니다.

학습/추론 모두 동일한 MediaPipe PoseLandmarker로 33개 keypoint를 뽑기 때문에
예측이 학습 때와 같은 분포에서 이뤄집니다.`,example:`# 프로젝트 폴더 예시
# my_project/
#   ├─ main.py
#   └─ yoga.fcm

from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
print('학습된 클래스:', clf.labels)`},{name:"Image와 frame의 관계 (Detector와 동일한 규칙)",summary:"cv2 함수에는 frame을, PoseClassifier에는 Image(frame)을 넣습니다. process()는 입력 Image에 스켈레톤이 그려진 같은 객체를 돌려줍니다.",details:"주의: cv2.imread() / cap.read() 결과만 받습니다. numpy 배열은 TypeError.",example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image, Keyboard

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 → 원본 frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # 분류기 → Image로 감싸기
    cv2.imshow('pose', out_img.frame)             # cv2.imshow → .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseClassifier(model_path, draw_label=True) — 분류기 만들기",summary:".fcm 파일을 읽어 포즈 분류기를 만듭니다.",details:`Args:
  model_path (str): 프로젝트 루트 기준 상대경로 또는 절대경로 (.fcm 파일)
  draw_label (bool): True면 process()가 화면 좌상단에 라벨과 % 텍스트를 그립니다.
Returns: PoseClassifier 객체

내부에서 MediaPipe PoseLandmarker로 33개 keypoint를 뽑아 분류기 헤드에 넣습니다.
첫 호출 시 PoseLandmarker 모델(약 5MB)이 1회 다운로드됩니다.`,example:`from helloai import PoseClassifier

# .fcm 파일 경로로 분류기 생성
clf = PoseClassifier('yoga.fcm')
print('클래스:', clf.labels)`},{name:"clf.process(image, draw=True) — 자세 분류",summary:"포즈를 검출하고 분류해 (Image, Result)를 돌려줍니다. 같은 Image에 마젠타 스켈레톤이 그려집니다.",details:`Args:
  image (Image): cv2.imread / cap.read 결과를 Image()로 감싼 객체
  draw (bool): True면 검출된 keypoint와 연결선이 image.frame에 그려집니다.
Returns:
  (Image, Result):
    - Image: 입력 image와 같은 객체 (in-place로 스켈레톤·라벨 그려짐)
    - Result: 포즈 미검출 시 label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
img = cv2.imread('pose.jpg')

# 자세 분류 → 결과 객체
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('전신이 화면에 들어와야 합니다')

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result 객체 — landmarks 포함",summary:"분류 결과 + 33개 포즈 keypoint 픽셀 좌표.",details:`필드:
  result.label (str): 가장 확률이 높은 클래스 이름
  result.index (int): 그 클래스의 인덱스
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): 모든 클래스 확률 (labels 순서)
  result.labels (list[str]): 전체 클래스 이름 리스트
  result.landmarks (list[(x, y, z)]): 33개 포즈 keypoint 픽셀 좌표

주요 인덱스 (PoseDetector와 동일):
  0=NOSE, 11/12=L/R 어깨, 13/14=L/R 팔꿈치, 15/16=L/R 손목,
  23/24=L/R 엉덩이, 25/26=L/R 무릎, 27/28=L/R 발목`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
img = cv2.imread('pose.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    nose = result.landmarks[0]      # 0번 = 코
    l_wrist = result.landmarks[15]  # 15번 = 왼손목
    print('코:', nose[:2], '왼손목:', l_wrist[:2])`},{name:"clf.labels (속성) / clf.close()",summary:"labels는 클래스 이름 리스트, close()는 메모리 정리.",details:`clf.labels: list[str] — 학습된 클래스 이름 (읽기 전용)
clf.close(): 메모리 명시적 정리. 한 번 close된 객체는 다시 process()할 수 없습니다.`,example:`from helloai import PoseClassifier

clf = PoseClassifier('yoga.fcm')
print(clf.labels)               # 예: ['stand', 'sit', 'hands_up']
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
from helloai import PoseClassifier, Image, Keyboard

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
from helloai import PoseClassifier, Image, Keyboard

TARGET = 'hands_up'
HOLD_FRAMES = 10                # 약 0.3초 유지해야 트리거 (30fps 기준)
THRESHOLD = 0.7

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()
streak = 0                      # 연속 유지 프레임 수

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
        streak = 0              # 조건이 깨지면 카운터 리셋

    cv2.imshow('hands_up trigger', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"예제 4: 클래스별 확률을 화면에 표시",summary:"probabilities로 모든 클래스 점수를 한 줄씩 그립니다.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image, Keyboard

clf = PoseClassifier('yoga.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # 클래스마다 한 줄씩 점수 표시
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
from helloai import PoseClassifier, Image, Keyboard

clf = PoseClassifier('yoga.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    if result.landmarks:
        sx, sy, _ = result.landmarks[11]    # 왼어깨
        wx, wy, _ = result.landmarks[15]    # 왼손목
        d = math.hypot(wx - sx, wy - sy)    # 픽셀 거리
        text = f'{result.label}  L_arm={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]}];export{t as AI_REFERENCE};
