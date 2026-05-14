const n=[{id:"setup",title:"1. 환경설정",description:"BitBlock 보드 연결 준비 (Web Serial)",icon:"settings",setup:{intro:"이 IDE는 **Web Serial** 기능을 통해 BitBlock 보드와 시리얼 통신을 합니다. 별도 드라이버 설치는 필요하지 않으며, 아래 절차대로 보드를 PC에 연결한 뒤 IDE에서 포트를 선택하면 됩니다.",steps:["BitBlock 본체와 USB 동글을 준비합니다. 본체에 건전지가 들어 있는지 확인하고 전원을 켭니다.","USB 동글을 PC의 USB 포트에 꽂습니다.","BitBlock 본체를 동글에 가까이 가져간 다음, 동글의 작은 버튼을 한 번 눌러 보드와 동글을 무선으로 페어링합니다.",'IDE 우측 상단의 "연결" 버튼을 누르면 브라우저가 시리얼 포트 선택 창을 띄웁니다. 동글이 잡힌 포트를 골라 "연결" 을 누릅니다.',"연결이 끝나면 코드 안의 ``Bitblock(port)`` 가 그 포트로 명령을 보냅니다. 포트 이름(예: COM5, /dev/ttyUSB0)은 코드에 직접 적어 두면 됩니다."],note:"Web Serial은 Chrome / Edge / Opera 등 Chromium 계열 브라우저에서만 동작합니다. Safari, Firefox, 그리고 안드로이드 모바일 브라우저는 Web Serial을 지원하지 않으므로 PC 또는 크롬북에서 사용해 주세요."},notice:"동글 버튼을 눌러도 본체 LED 색이 바뀌지 않으면 본체 전원이 꺼져 있거나, 다른 동글에 이미 페어링된 상태일 수 있습니다. 본체 전원을 다시 껐다 켠 뒤 동글 버튼을 한 번만 눌러 보세요."},{id:"getting-started",title:"2. 시작하기",description:"연결 · 해제 · 대기 등 가장 기본이 되는 명령",icon:"play_circle",entries:[{name:"Bitblock(port)",summary:"BitBlock 보드 객체를 만든다. (이때 포트는 아직 열리지 않는다)",details:'`Bitblock` 은 BitBlock 보드 한 대를 다루는 컨트롤러 클래스이다.\n인스턴스를 만든다고 해서 바로 시리얼 포트가 열리는 것은 아니고, 포트 정보만 보관해 두었다가 ``connect()`` 를 부른 시점에 실제 연결이 시작된다.\n\nArgs:\n  port (str): 시리얼 포트 이름. Windows는 "COM5" 같이, Linux/Mac은 "/dev/ttyUSB0" 같이 적는다.\n  timeout (float): 보드 응답을 기다리는 최대 시간(초). 기본 5.\n  baud (int): 통신 속도. 펌웨어 기본값인 57600을 그대로 쓰면 된다.\n\n관례적으로 변수 이름은 ``bb``, ``board``, ``bot`` 중 하나를 쓴다. 이 튜토리얼은 ``bb`` 로 통일한다.',example:`from pycombb import Bitblock

# 아직 포트를 연 상태가 아니라 "연결할 준비"만 한 단계.
bb = Bitblock()
print(bb)`},{name:"bb.connect()",summary:"보관해 둔 포트로 시리얼 연결을 연다.",details:`\`\`Bitblock(port)\`\` 로 만든 객체에 대고 호출해야 비로소 보드와 통신이 시작된다.
한 번 연결한 뒤 다시 호출하면 무시된다(이미 열려 있으므로).

Returns:
  bool: 새로 연결을 연 경우 True, 이미 연결되어 있거나 포트가 비어 있어서 아무 일도 하지 않은 경우 False.

연결이 실패하면 보통 1) 포트 이름이 틀렸거나, 2) 다른 프로그램이 같은 포트를 잡고 있거나, 3) 동글이 보드와 페어링되지 않은 경우다. 환경설정 토픽의 절차를 다시 확인해 보자.`,example:`from pycombb import Bitblock

bb = Bitblock()

ok = bb.connect()
print("연결 결과:", ok)`},{name:"bb.disconnect()",summary:"열려 있는 시리얼 연결을 안전하게 닫는다.",details:`프로그램 끝에서 반드시 호출해 두면 다른 프로그램이 같은 포트를 다시 잡을 수 있다.
아직 연결을 연 적이 없거나 이미 닫혀 있어도 그대로 통과하므로, 안전하게 항상 마지막에 적어 두면 된다.

Returns:
  None

try / finally 패턴으로 묶어 두면 코드 중간에 오류가 나도 포트가 닫혀 깨끗한 상태가 보장된다.`,example:`from pycombb import Bitblock

bb = Bitblock()
bb.connect()

try:
    # 여기서 LED를 켜거나 센서를 읽는다.
    pass
finally:
    bb.disconnect()`},{name:"delay(sec)",summary:"주어진 시간(초)만큼 프로그램을 멈춘다.",details:"내부적으로는 ``time.sleep`` 을 호출한다. 1초보다 짧은 시간을 주려면 0.5처럼 소수점을 쓴다.\n``from pycombb.bitblock import delay`` 로 함수를 따로 가져오거나, 별표 import(``from pycombb.bitblock import *``) 시에는 그냥 ``delay(...)`` 로 부른다.\n\nArgs:\n  sec (float): 대기할 시간(초).\nReturns:\n  None",example:`from pycombb import Bitblock, delay

bb = Bitblock()
bb.connect()

print("1초 대기...")
delay(1)
print("완료")

bb.disconnect()`},{name:"delayms(ms)",summary:"주어진 시간(밀리초)만큼 프로그램을 멈춘다.",details:`\`\`delay\`\` 의 밀리초 단위 버전이다. 보드 동작은 millisecond 단위로 다루는 일이 많아서, 단위를 환산하지 않고 자연스럽게 쓰도록 별도 함수로 노출되어 있다.

Args:
  ms (float): 대기할 시간(밀리초). 500을 주면 0.5초 대기.
Returns:
  None`,example:`from pycombb import Bitblock, delayms

bb = Bitblock()
bb.connect()

for i in range(3):
    print("tick", i)
    delayms(500)   # 0.5초 대기

bb.disconnect()`},{name:"wait(ms)",summary:"delayms와 똑같이 밀리초 단위로 기다린다.",details:"BitBlock 위키 예제에서 자주 쓰는 이름이다. 다른 보드 라이브러리와 인터페이스를 맞추기 위해 같은 동작을 ``wait`` 라는 이름으로도 노출한다. ``delayms`` 와 동작이 완전히 같으므로 둘 중 어느 쪽을 써도 무방하다.\n\nArgs:\n  ms (float): 대기할 시간(밀리초).\nReturns:\n  None",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

print("1초 대기...")
wait(1000)
print("완료")

bb.disconnect()`},{name:"전체 흐름 예제",summary:"연결 → 잠깐 대기 → 연결 해제까지의 가장 작은 코드.",details:"BitBlock 코드는 거의 항상 다음 4단계로 이루어진다.\n  1) ``Bitblock(port)`` 로 객체 만들기\n  2) ``bb.connect()`` 로 포트 열기\n  3) 본 작업(LED 켜기, 부저 울리기, 센서 읽기 등)\n  4) ``bb.disconnect()`` 로 포트 닫기\n\n이 형식을 외워 두면 나머지 토픽의 예제도 그대로 따라 쓸 수 있다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# 본 작업 자리. 다음 토픽부터는 여기에 LED·부저 코드가 들어간다.
wait(500)

bb.disconnect()`}]},{id:"display-basic",title:"3. LED 디스플레이 — 기초",description:"5x5 매트릭스를 한 색 · 한 글자 · 한 숫자로 채우기",icon:"grid_on",entries:[{name:"색상 지정 방법 (개념)",summary:"BitBlock은 색을 세 가지 형식으로 받는다 — 헥사 문자열, [R, G, B] 리스트, COLOR 프리셋.",details:'디스플레이의 거의 모든 메서드(``color``, ``symbol``, ``row``, ``char``, ``num``, ``xy``)는 마지막 인자로 색을 받는다. 다음 세 가지 중 어느 것을 써도 동일하게 동작한다.\n\n  1) 헥사 문자열: ``"#RRGGBB"`` — 웹 색상과 같은 표기. 예) ``"#ff0000"``.\n  2) [R, G, B] 리스트(또는 튜플): 각 채널 0~255. 예) ``[255, 0, 0]``.\n  3) COLOR 상수: 자주 쓰는 색을 미리 이름 붙여 둔 것. ``COLOR.RED``, ``COLOR.BLUE`` 등.\n\n잘못된 형식(예: ``"red"``, ``[300, 0, 0]``)을 넘기면 ``ValueError`` 가 발생한다. COLOR 상수 목록은 이 토픽 아래의 표를 참고.',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# 같은 빨간색을 세 가지 방법으로 표현
bb.display.color("#ff0000");   wait(500)
bb.display.color([255, 0, 0]); wait(500)
bb.display.color(COLOR.RED);   wait(500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.color(color)",summary:"5x5 LED 매트릭스 25개 픽셀을 모두 같은 색으로 채운다.",details:'가장 단순한 디스플레이 명령. 매트릭스 전체를 한 색으로 채운다.\n\nArgs:\n  color (str | list | tuple): 위 "색상 지정 방법" 참고.\nReturns:\n  None\n\nLED를 끄려면 ``"#000000"`` 을 넘기거나, 더 짧게 ``bb.display.clear()`` 를 부른다.',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.color(COLOR.GREEN)
wait(1000)
bb.display.color(COLOR.BLUE)
wait(1000)
bb.display.clear()

bb.disconnect()`},{name:"bb.display.clear()",summary:"모든 LED를 끈다.",details:'내부적으로 ``bb.display.color("#000000")`` 과 같은 동작이다.\n인자가 없는 가장 짧은 형태이므로, 화면을 비우는 자리에 부담 없이 부르면 된다.\n\nReturns:\n  None',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.color(COLOR.RED)
wait(500)
bb.display.clear()

bb.disconnect()`},{name:"bb.display.bright(level)",summary:"매트릭스 전체 밝기를 0~255 범위로 조절한다.",details:`디스플레이 LED는 기본적으로 꽤 밝다. 어두운 환경이거나 밤에 보드를 쓸 때, 또는 카메라로 촬영하는 경우 밝기를 낮추면 보기 좋다.

Args:
  level (int): 0(완전 꺼짐) ~ 255(최대 밝기). 펌웨어가 PWM 듀티로 매핑한다.
Returns:
  None

한 번 설정하면 다음 명령에도 그대로 적용된다. 보드 전원을 껐다 켜면 다시 기본값이 된다.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.bright(30)            # 어둡게
bb.display.color(COLOR.WHITE)
wait(1500)

bb.display.bright(255)           # 다시 밝게
wait(1500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.char(letter, color)",summary:"알파벳 한 글자를 매트릭스에 표시한다.",details:'펌웨어에 내장된 5x5 폰트로 알파벳 한 글자를 그린다.\n\nArgs:\n  letter (str): 길이 1의 문자열(예: ``"A"``). ASCII 코드로 펌웨어 내부 글리프 테이블이 인덱싱된다.\n  color (str | list | tuple): 글자 색상.\nReturns:\n  None\n\n두 글자 이상을 한 번에 보내면 첫 글자만 표시된다. 단어를 보여주고 싶으면 ``for`` 문으로 한 글자씩 짧게 표시 → 대기 → 다음 글자 패턴으로 만든다.',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

for letter in "HELLO":
    bb.display.char(letter, COLOR.YELLOW)
    wait(500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.num(digit, color)",summary:"0~9 한 자리 숫자를 매트릭스에 표시한다.",details:"한 자리 숫자(0~9) 한 글자를 그린다. 글자와 마찬가지로 5x5 폰트가 사용된다.\n\nArgs:\n  digit (int | str): 표시할 숫자. 문자열을 주면 ``int(...)`` 로 변환된다.\n  color (str | list | tuple): 숫자 색상.\nReturns:\n  None\n\n두 자리 이상은 한 번에 표시할 수 없다. 카운트다운/초읽기처럼 보이게 하려면 ``for`` 문으로 한 글자씩 표시 → 대기 → 다음 숫자 표시 패턴을 쓴다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# 5초 카운트다운
for i in range(5, 0, -1):
    bb.display.num(i, COLOR.RED)
    wait(1000)

bb.display.clear()
bb.disconnect()`},{name:"종합 예제 — 신호등",summary:"빨강 → 노랑 → 초록 패턴을 반복하는 미니 신호등.",details:"지금까지 배운 ``color`` / ``clear`` / ``wait`` 만 조합해도 작은 시뮬레이션을 만들 수 있다. ``while True:`` 로 무한 반복하면서 ``Ctrl+C`` 로 멈춘다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        bb.display.color(COLOR.RED);    wait(2000)
        bb.display.color(COLOR.YELLOW); wait(800)
        bb.display.color(COLOR.GREEN);  wait(2000)
        bb.display.clear();             wait(400)
finally:
    bb.disconnect()`}],tables:[{title:"COLOR 프리셋 (대표 색)",headers:["이름","RGB","COLOR.* 상수"],rows:[["빨강","[255, 0, 0]","COLOR.RED"],["초록","[0, 128, 0]","COLOR.GREEN"],["파랑","[0, 0, 255]","COLOR.BLUE"],["노랑","[255, 255, 0]","COLOR.YELLOW"],["주황","[255, 165, 0]","COLOR.ORANGE"],["보라","[181, 126, 220]","COLOR.VIOLET"],["시안","[0, 255, 255]","COLOR.CYAN"],["흰색","[255, 255, 255]","COLOR.WHITE"],["검정","[0, 0, 0]","COLOR.BLACK"],["회색","[128, 128, 128]","COLOR.GRAY"]],note:"추가 프리셋: NAVYBLUE, ROYALBLUE, MEDIUMBLUE, AZURE, AQUAMARINE, TEAL, FORESTGREEN, OLIVE, LIME, GOLD, SALMON, HOTPINK, FUCHSIA, INDIGO, MAROON, CRIMSON, PLUM, SILVER, KHAKI, BEIGE, IVORY 등 30개 이상이 정의되어 있다."}]},{id:"display-advanced",title:"4. LED 디스플레이 — 응용",description:"한 픽셀 · 한 행 · 5x5 비트맵 · 내장 효과",icon:"auto_awesome",entries:[{name:"bb.display.xy(x, y, color)",summary:"매트릭스의 한 픽셀만 켠다. (0,0)이 좌상단, (4,4)가 우하단.",details:`5x5 격자 위에서 한 점만 색을 바꾼다. 다른 픽셀은 이전 상태가 유지되므로, 여러 번 호출하면 점이 누적되어 그림이 그려진다.

Args:
  x (int): 0(왼쪽) ~ 4(오른쪽) 범위의 X 좌표.
  y (int): 0(위) ~ 4(아래) 범위의 Y 좌표.
  color (str | list | tuple): 픽셀 색상.
Returns:
  None

범위 밖 좌표를 주면 펌웨어 동작이 정의되어 있지 않으니, \`\`range(5)\`\` 또는 \`\`0 <= n < 5\`\` 안에서만 사용한다.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# 대각선 그리기
bb.display.clear()
for i in range(5):
    bb.display.xy(i, i, COLOR.GREEN)
    wait(200)

wait(1500)
bb.display.clear()
bb.disconnect()`},{name:"bb.display.row(row, mask, color)",summary:"한 행을 5비트 비트마스크 패턴으로 켠다.",details:"한 행(가로 5칸)의 5개 LED 상태를 한 번에 설정한다. 각 비트가 한 픽셀에 해당하며, 1이면 켜짐 / 0이면 꺼짐이다.\n\nArgs:\n  row (int): 0(맨 위) ~ 4(맨 아래) 행 인덱스.\n  mask (int): 0~31 범위의 5비트 정수. ``0b11111`` 이면 그 행 전체 켜짐, ``0b10001`` 이면 양 끝만 켜짐.\n  color (str | list | tuple): 켜진 픽셀에 적용할 색.\nReturns:\n  None\n\n비트는 왼쪽이 MSB(가장 높은 자리)다. 즉 ``0b10000`` 은 그 행의 가장 왼쪽 픽셀을 켠다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.clear()

# 위에서 아래로 한 줄씩 흘러내리는 효과
for r in range(5):
    bb.display.clear()
    bb.display.row(r, 0b11111, COLOR.BLUE)
    wait(300)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.symbol(rows, color)",summary:"5x5 매트릭스 전체를 5개 비트마스크 행으로 한 번에 그린다.",details:"5x5 비트맵을 ``row`` 5번 호출하지 않고 한 패킷으로 보낼 수 있다. ``rows`` 는 길이 5의 정수 시퀀스로, 각 원소가 한 행의 비트마스크다(0~31).\n\nArgs:\n  rows (Sequence[int]): 길이 5의 정수 리스트. 각 원소가 한 행의 5비트 마스크.\n  color (str | list | tuple): 켜진 픽셀의 색.\nReturns:\n  None\n\n비트맵을 미리 변수로 정의해 두면 코드가 그림처럼 읽힌다 — 1이 보이는 자리가 곧 켜질 픽셀이다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# 하트 모양 비트맵
heart = [
    0b01010,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
]
bb.display.symbol(heart, COLOR.RED)

wait(2000)
bb.display.clear()
bb.disconnect()`},{name:"bb.display.effect(no)",summary:"펌웨어 내장 애니메이션을 번호로 재생한다.",details:`미리 펌웨어에 들어 있는 애니메이션을 한 번 호출로 트리거한다. 효과 중에는 다음 명령을 즉시 보내도 효과가 끝나야 적용되는 경우가 있으므로, 이어서 다른 그림을 그릴 때는 \`\`wait\`\` 로 잠깐 텀을 두는 게 안정적이다.

Args:
  no (int): 0=무지개, 1=폭포, 2=와이퍼.
Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.display.effect(0)   # 무지개
wait(3000)
bb.display.effect(1)   # 폭포
wait(3000)
bb.display.effect(2)   # 와이퍼
wait(3000)

bb.display.clear()
bb.disconnect()`}],tables:[{title:"내장 효과 번호",headers:["번호","효과"],rows:[["0","무지개 (Rainbow)"],["1","폭포 (Waterfall)"],["2","와이퍼 (Wiper)"]]}]},{id:"sound",title:"5. 소리 — 부저",description:"비프, 단일 음, 내장 멜로디",icon:"music_note",entries:[{name:"bb.beep()",summary:"짧은 비프음을 한 번 울린다. 인자 없음.",details:`음의 길이와 음정은 펌웨어가 정한 기본값을 사용한다. 어떤 동작이 끝났음을 알리거나, 사용자에게 즉시 피드백을 줄 때 가장 편하다.

Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.beep()
wait(300)
bb.beep()

bb.disconnect()`},{name:"bb.note(note, ms)",summary:"단일 음을 ms 밀리초 동안 연주한다.",details:'사람이 인지하는 "도/레/미"는 ``NOTE.C4``, ``NOTE.D4``, ``NOTE.E4`` 같은 정수 상수로 표현한다. 이 함수는 그 정수와 길이(밀리초)를 받아 부저를 울린다.\n\nArgs:\n  note (int): NOTE.C4, NOTE.D4 같은 음표 상수(0~85 범위의 정수).\n  ms (int): 음을 유지할 시간(밀리초). 0~65535.\nReturns:\n  None\n\n함수 호출은 즉시 반환된다(블로킹하지 않는다). 다음 음을 곧바로 호출하면 펌웨어가 끊기지 않게 이어서 연주하므로, 음 사이에 살짝 ``wait`` 를 끼우면 사람이 인지하기 좋은 끊어짐이 생긴다.',example:`from pycombb import Bitblock, NOTE, wait

bb = Bitblock()
bb.connect()

bb.note(NOTE.C4, 300); wait(350)
bb.note(NOTE.E4, 300); wait(350)
bb.note(NOTE.G4, 300); wait(350)
bb.note(NOTE.C5, 600); wait(700)

bb.disconnect()`},{name:"bb.melody(index)",summary:"펌웨어에 내장된 멜로디를 번호로 재생한다.",details:"미리 정의된 짧은 곡을 한 번에 재생한다. ``note`` 를 여러 번 호출해 직접 작곡하지 않아도 되는 편의 기능이다.\n\nArgs:\n  index (int): 0부터 시작하는 멜로디 번호. 펌웨어 빌드별로 곡 수가 다를 수 있다.\nReturns:\n  None\n\n재생이 끝나기 전에 다음 명령을 보내면 곡이 끊어진다. 이어서 다른 동작을 시키지 않을 거라면 ``wait`` 로 충분히 텀을 둔다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.melody(0)
wait(5000)         # 곡이 끝날 때까지 대기

bb.disconnect()`},{name:"종합 예제 — 음계 직접 연주",summary:"리스트로 (음, 길이) 시퀀스를 만들어 ``for`` 문으로 연주.",details:"``(음표, 길이)`` 튜플의 리스트를 만들고 ``for`` 문으로 ``note`` 를 차례로 호출하면 짧은 곡을 직접 만들 수 있다. 음 사이에 같은 길이만큼 ``wait`` 를 두어 자연스러운 끊어짐을 만든다.\n\n아래는 도→레→미→파→솔→라→시→도 다장조 음계를 한 옥타브 올라간 뒤 다시 내려오는 예제다.",example:`from pycombb import Bitblock, NOTE, wait

bb = Bitblock()
bb.connect()

# 다장조 음계 (올라갔다 내려오기)
scale_up   = [NOTE.C4, NOTE.D4, NOTE.E4, NOTE.F4,
              NOTE.G4, NOTE.A4, NOTE.B4, NOTE.C5]
scale_down = list(reversed(scale_up))

for n in scale_up + scale_down:
    bb.note(n, 250)
    wait(280)

bb.disconnect()`}],tables:[{title:"NOTE 상수 (옥타브 4 — 가운데 도부터)",headers:["음","상수","값"],rows:[["도 (C4)","NOTE.C4","37"],["도♯ (C#4)","NOTE.CS4","38"],["레 (D4)","NOTE.D4","39"],["레♯ (D#4)","NOTE.DS4","40"],["미 (E4)","NOTE.E4","41"],["파 (F4)","NOTE.F4","42"],["파♯ (F#4)","NOTE.FS4","43"],["솔 (G4)","NOTE.G4","44"],["솔♯ (G#4)","NOTE.GS4","45"],["라 (A4)","NOTE.A4","46"],["라♯ (A#4)","NOTE.AS4","47"],["시 (B4)","NOTE.B4","48"],["도 (C5)","NOTE.C5","49"]],note:"전체 범위는 ``NOTE.B0(=0)`` 부터 ``NOTE.DS8(=85)`` 까지 정의되어 있다. 한 옥타브 위는 NOTE.C5/D5/E5..., 한 옥타브 아래는 NOTE.C3/D3/E3... 형식."}]},{id:"inputs",title:"6. 입력 센서",description:"버튼 · 터치 · 기울기 · 빛 · 소리 읽기",icon:"sensors",entries:[{name:"입력 센서 공통 — 동기 호출 (개념)",summary:'센서 메서드는 명령을 보낸 뒤 응답을 기다리는 "블로킹" 호출이다.',details:'LED·부저처럼 "보내기만" 하는 명령과 달리, 센서 메서드(``button``, ``touch``, ``tilt``, ``light``, ``mic``)는 보드에 질의를 보내고 응답이 올 때까지 멈춰 기다린다. 따라서 호출이 끝나면 곧바로 그 시점의 값이 손에 들어온다.\n\n센서 값을 계속 감시하려면 ``while True:`` 안에서 메서드를 반복 호출하고, 매 회 끝에 ``wait(20)`` 정도의 짧은 텀을 두어 보드를 너무 자주 두드리지 않도록 한다.\n\n응답이 깨진 경우(시퀀스 인덱스 불일치) 메서드는 ``None`` 을 돌려준다. 안전하게는 반환값을 받자마자 ``None`` 인지 검사하고, 그렇다면 그 회만 건너뛰는 방식이 좋다.',example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.button()
        if result is None:
            wait(20)
            continue
        a, b = result
        print("A:", a, "B:", b)
        wait(100)
finally:
    bb.disconnect()`},{name:"bb.button()",summary:"본체 A · B 버튼이 눌려 있는지 동시에 알려준다.",details:"본체에 인쇄된 A 버튼과 B 버튼의 현재 눌림 상태를 한 번에 읽는다.\n\nReturns:\n  tuple[bool, bool] | None: ``(A 눌림, B 눌림)`` 두 불리언. 응답이 깨지면 ``None``.\n\n두 변수에 분해 대입(``a, b = bb.button()``) 하면 코드가 읽기 쉽다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.button()
        if result is None:
            wait(30); continue
        a, b = result

        if a:
            bb.display.color(COLOR.RED)
        elif b:
            bb.display.color(COLOR.BLUE)
        else:
            bb.display.clear()

        wait(50)
finally:
    bb.disconnect()`},{name:"bb.touch()",summary:"P0 · P1 · P2 세 개의 정전식 터치 핀이 닿였는지 알려준다.",details:"본체 측면의 정전식 터치 패드 3개를 동시에 읽는다. 손가락이 닿으면 그 채널이 ``True`` 가 된다.\n\nReturns:\n  tuple[bool, bool, bool] | None: ``(P0, P1, P2)`` 세 불리언. 응답이 깨지면 ``None``.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.touch()
        if result is None:
            wait(30); continue
        p0, p1, p2 = result

        bb.display.clear()
        if p0: bb.display.xy(0, 2, COLOR.RED)
        if p1: bb.display.xy(2, 2, COLOR.GREEN)
        if p2: bb.display.xy(4, 2, COLOR.BLUE)

        wait(50)
finally:
    bb.disconnect()`},{name:"bb.tilt()",summary:"6축 IMU로 본체가 어느 방향으로 기울었는지 알려준다.",details:"본체에 내장된 IMU 센서가 측정한 기울기를 4개 불리언 플래그(왼쪽 / 오른쪽 / 앞쪽 / 뒤쪽)로 단순화해 돌려준다. 동시에 두 방향이 ``True`` 가 될 수도 있다(예: 왼쪽 + 앞쪽으로 동시에 기울임).\n\nReturns:\n  tuple[bool, bool, bool, bool] | None: ``(left, right, fwd, back)``. 응답이 깨지면 ``None``.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.tilt()
        if result is None:
            wait(30); continue
        left, right, fwd, back = result

        bb.display.clear()
        if left:  bb.display.xy(0, 2, COLOR.YELLOW)
        if right: bb.display.xy(4, 2, COLOR.YELLOW)
        if fwd:   bb.display.xy(2, 0, COLOR.YELLOW)
        if back:  bb.display.xy(2, 4, COLOR.YELLOW)

        wait(50)
finally:
    bb.disconnect()`},{name:"bb.light()",summary:"좌 · 우 두 채널의 빛 센서 값을 0~1023 범위로 읽는다.",details:`본체 양쪽에 있는 빛 센서 값을 동시에 읽어 두 정수를 돌려준다. 어두울수록 값이 작고 밝을수록 커진다.

Returns:
  tuple[int, int] | None: \`\`(left, right)\`\` 각각 0~1023.

두 값을 비교하면 빛이 어느 쪽에서 오는지(예: 손전등 방향)를 추정할 수 있다.`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.light()
        if result is None:
            wait(30); continue
        left, right = result

        if left > right + 100:
            print("빛이 왼쪽")
        elif right > left + 100:
            print("빛이 오른쪽")
        else:
            print("거의 같음:", left, right)
        wait(200)
finally:
    bb.disconnect()`},{name:"bb.mic()",summary:"본체 마이크의 현재 입력 크기를 0~1023 정수로 읽는다.",details:`한 채널 마이크의 즉시 음량 값을 읽는다. 박수처럼 짧고 큰 소리를 감지하려면 임계값을 정해 두고 그보다 큰 값이 잡히면 반응하도록 한다.

Returns:
  int | None: 0~1023 정수. 응답이 깨지면 \`\`None\`\`.

주변 환경에 따라 잡음이 200~300 정도까지 깔리므로, 임계값은 실제 환경에서 측정해 보고 정하는 것이 좋다.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

THRESHOLD = 600

try:
    while True:
        level = bb.mic()
        if level is None:
            wait(30); continue

        if level > THRESHOLD:
            bb.display.color(COLOR.WHITE)
            wait(150)
            bb.display.clear()
        wait(30)
finally:
    bb.disconnect()`}]},{id:"actuators",title:"7. 출력 — 서보 · DC모터",description:"메인보드 서보 각도 제어와 DC모터 PWM 구동",icon:"tune",entries:[{name:"핀 매핑 — bb.pin (개념)",summary:"핀 번호는 보통 ``bb.pin.SERVO``, ``bb.pin.P0`` 처럼 인스턴스 매핑으로 부른다.",details:"메인보드에 인쇄된 핀 라벨(SERVO, DCMOTOR, P0~P12)은 실제 GPIO 번호와 다르다. 펌웨어 빌드별로 매핑이 바뀔 수 있어서, 사용자 코드는 ``Bitblock`` 인스턴스의 ``pin`` 속성을 우선 사용한다.\n\n예) ``bb.pin.SERVO``, ``bb.pin.DCMOTOR``, ``bb.pin.P0``\n\n클래스 단위 ``PIN`` 상수도 존재하지만(``from pycombb.bitblock import PIN``), 펌웨어 갱신 시 자동으로 따라가지 못할 수 있으므로, 인스턴스 매핑을 권장한다.",example:`from pycombb import Bitblock

bb = Bitblock()
bb.connect()

print("SERVO   ->", bb.pin.SERVO)
print("DCMOTOR ->", bb.pin.DCMOTOR)
print("P0      ->", bb.pin.P0)

bb.disconnect()`},{name:"bb.servo(pin, angle)",summary:"서보 모터를 0~180도 사이의 한 각도로 회전시킨다.",details:"메인보드 내장 서보(``bb.pin.SERVO``)나 확장 핀에 꽂은 외부 서보를 같은 메서드로 제어한다. 핀 번호를 보고 펌웨어가 알아서 알맞은 명령군을 골라 보낸다.\n\nArgs:\n  pin (int): 서보 핀 번호(보통 ``bb.pin.SERVO``).\n  angle (int): 0~180 범위의 정수 각도. 범위 밖 값은 펌웨어에서 잘릴 수 있으니 ``clamp(value, 0, 180)`` 으로 미리 다듬어도 좋다.\nReturns:\n  None\n\n각도를 갑자기 0→180 으로 바꾸면 서보가 무리하게 움직인다. 부드럽게 움직이려면 ``for`` 문으로 작은 단위씩 ``wait`` 를 끼워 단계적으로 보낸다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# 0 → 180 → 0 천천히 왕복
for angle in range(0, 181, 10):
    bb.servo(bb.pin.SERVO, angle)
    wait(40)

for angle in range(180, -1, -10):
    bb.servo(bb.pin.SERVO, angle)
    wait(40)

bb.disconnect()`},{name:"bb.dcmotor(pin, value)",summary:"DC 모터의 회전 속도를 PWM 0~1023 범위로 설정한다.",details:"DC 모터는 펄스 폭 변조(PWM) 신호의 듀티에 비례해 회전 속도가 정해진다. ``value`` 가 클수록 빠르게 돈다.\n\nArgs:\n  pin (int): 모터가 연결된 핀(보통 ``bb.pin.DCMOTOR`` 또는 외부 PWM 핀).\n  value (int): 0(정지) ~ 1023(최대 속도) 범위의 정수.\nReturns:\n  None\n\n내부적으로는 ``analog_write`` 와 같은 ANALOG 출력 패킷을 사용한다. 회전 방향이 한쪽으로만 도는 단방향 드라이버라면, 반대로 돌리려면 H-브리지 같은 추가 회로가 필요하다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# 천천히 가속했다가 정지
for v in range(0, 1024, 100):
    bb.dcmotor(bb.pin.DCMOTOR, v)
    wait(200)

bb.dcmotor(bb.pin.DCMOTOR, 0)   # 정지
bb.disconnect()`}],tables:[{title:"bb.pin 매핑 (인스턴스 단위)",headers:["속성","용도","코드 예"],rows:[["bb.pin.SERVO","메인보드 내장 서보","bb.servo(bb.pin.SERVO, 90)"],["bb.pin.DCMOTOR","메인보드 내장 DC 모터","bb.dcmotor(bb.pin.DCMOTOR, 512)"],["bb.pin.P0","확장 디지털/아날로그 핀","bb.digital_read(bb.pin.P0)"],["bb.pin.P1","확장 핀","bb.analog_read(bb.pin.P1)"],["bb.pin.P2","확장 핀","bb.dht11(bb.pin.P2)"],["bb.pin.P3","확장 핀","—"],["bb.pin.P4","확장 핀","—"],["bb.pin.P7","확장 핀(주로 trig)","bb.ultrasonic(bb.pin.P7, bb.pin.P11)"],["bb.pin.P11","확장 핀(주로 echo)","—"],["bb.pin.P12","확장 핀","—"]],note:"실제 GPIO 번호는 펌웨어 빌드에 따라 다를 수 있으므로, 코드에는 GPIO 숫자가 아니라 ``bb.pin.*`` 이름을 쓰는 것이 안전하다."}]},{id:"ext-sensor",title:"8. 확장 센서 보드",description:"GPIO 핀 입출력 · 초음파 · 온습도",icon:"developer_board",entries:[{name:"bb.digital_write(pin, value)",summary:"디지털 핀에 HIGH(1) 또는 LOW(0) 를 출력한다.",details:`LED, 릴레이, 트랜지스터 게이트 같이 "켜짐/꺼짐" 두 상태만 필요한 부품을 다룰 때 사용한다.

Args:
  pin (int): 출력할 핀 번호(\`\`bb.pin.P0\`\` 등).
  value (int): 0(LOW) 또는 1(HIGH).
Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# 외부 LED 깜빡이기 (P0에 LED 연결)
for _ in range(5):
    bb.digital_write(bb.pin.P0, 1); wait(300)
    bb.digital_write(bb.pin.P0, 0); wait(300)

bb.disconnect()`},{name:"bb.digital_read(pin)",summary:"디지털 핀의 현재 레벨을 풀업 모드로 읽는다 (0 또는 1).",details:"핀이 풀업 모드로 설정된 상태에서 현재 레벨을 읽는다. 외부에 푸시버튼을 GND 로 연결해 두면, 누르지 않을 때 ``1``, 눌렀을 때 ``0`` 이 읽힌다(풀업 회로 특성).\n\nArgs:\n  pin (int): 핀 번호.\nReturns:\n  int | None: ``0`` 또는 ``1``. 응답이 깨지면 ``None``.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        v = bb.digital_read(bb.pin.P0)
        if v is None:
            wait(30); continue

        if v == 0:                    # 버튼 눌림 (풀업)
            bb.display.color(COLOR.GREEN)
        else:
            bb.display.clear()
        wait(50)
finally:
    bb.disconnect()`},{name:"bb.analog_write(pin, value)",summary:"핀에 PWM 신호(0~1023) 를 출력한다.",details:`디지털 핀이 "켜짐/꺼짐" 만 가능했다면, 아날로그 출력은 듀티비를 조절해 LED 밝기, 모터 속도, 부저 음량 같은 "중간 정도" 값을 만들어낸다.

Args:
  pin (int): 출력 핀.
  value (int): 0(완전 OFF) ~ 1023(완전 ON) 범위의 정수.
Returns:
  None

DC 모터 전용 메서드 \`\`bb.dcmotor\`\` 와 내부 동작이 같다. 단, 의도가 다를 때 코드 가독성을 위해 두 이름을 구분해 쓰는 게 좋다.`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# 외부 LED 페이드인
for v in range(0, 1024, 32):
    bb.analog_write(bb.pin.P1, v)
    wait(40)

# 페이드아웃
for v in range(1023, -1, -32):
    bb.analog_write(bb.pin.P1, v)
    wait(40)

bb.disconnect()`},{name:"bb.analog_read(pin)",summary:"핀의 아날로그 입력 값을 0~1023 정수로 읽는다.",details:'가변저항(포텐쇼미터), CDS(빛), 토양 수분 센서 등 "값이 연속적으로 변하는" 센서를 읽을 때 사용한다.\n\nArgs:\n  pin (int): 입력 핀.\nReturns:\n  int | None: 0~1023 정수. 응답이 깨지면 ``None``.\n\n값을 0~100 같이 직관적인 범위로 환산하려면 ``int(v / 1023 * 100)`` 형태로 매핑한다.',example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        v = bb.analog_read(bb.pin.P0)
        if v is None:
            wait(30); continue

        percent = int(v / 1023 * 100)
        print(f"raw={v:4d}  ({percent}%)")
        wait(200)
finally:
    bb.disconnect()`},{name:"bb.ultrasonic(trig, echo)",summary:"HC-SR04 호환 초음파 센서로 앞쪽 거리를 cm 단위로 측정한다.",details:`두 핀(트리거 / 에코)을 사용한다. 트리거 핀에서 짧은 펄스를 보내면 센서가 초음파를 쏘고, 반사파가 돌아온 시간을 에코 핀에서 측정한다.

Args:
  trig (int): 트리거 신호 출력 핀.
  echo (int): 에코 신호 입력 핀.
Returns:
  int | None: 측정된 거리(cm). 응답이 깨지면 \`\`None\`\`.

센서 시야각은 좁고 측정 범위는 보통 2cm ~ 200cm 정도다. 너무 가깝거나 너무 멀면 잡음이 섞이므로, 임계값 기반 판단(예: 30cm 이하면 경고)에 적합하다.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        d = bb.ultrasonic(bb.pin.P7, bb.pin.P11)
        if d is None:
            wait(30); continue

        print(f"{d} cm")
        if d < 10:
            bb.display.color(COLOR.RED)
        elif d < 30:
            bb.display.color(COLOR.YELLOW)
        else:
            bb.display.color(COLOR.GREEN)
        wait(100)
finally:
    bb.disconnect()`},{name:"bb.dht11(pin)",summary:"DHT11 센서로 온도(°C)와 습도(%) 를 한 번에 읽는다.",details:"DHT11은 1선 통신을 쓰는 저렴한 온습도 센서다. 한 번 읽으면 두 값이 동시에 돌아오므로, 따로따로 호출하지 않는다.\n\nArgs:\n  pin (int): 데이터 라인이 연결된 핀.\nReturns:\n  tuple[int, int] | None: ``(temp, humi)`` 정수. 응답이 깨지면 ``None``.\n\nDHT11은 응답이 느리다. 1초에 한 번 정도가 적당하고, 너무 빨리 호출하면 직전 값을 다시 받을 수 있다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.dht11(bb.pin.P2)
        if result is None:
            wait(30); continue

        temp, humi = result
        print(f"{temp}°C  {humi}%")
        wait(2000)
finally:
    bb.disconnect()`}]},{id:"rccar",title:"9. BB-Car (RC카)",description:"비비카 주행 · 회전 · 거리 · 라인트레이싱",icon:"directions_car",entries:[{name:"bb.rccar_init() (개념)",summary:"BB-Car 모드를 초기화하고, 주행 명령을 부를 ``RCCar`` 컨트롤러를 돌려받는다.",details:"비비카(BB-Car)는 BitBlock 본체를 차체에 끼워서 만드는 주행 모듈이다. 본체 입장에서 보면 양쪽 바퀴와 라인 센서, 거리 센서, 후면 서보가 추가로 달리는 셈이다.\n\n주행 명령은 ``Bitblock`` 객체에 직접 부르지 않고, ``rccar_init()`` 가 돌려준 별도 컨트롤러(보통 ``car`` 변수)에 부른다.\n  ``bb`` ─ 본체(LED, 부저, 본체 센서)\n  ``car`` ─ 차체(바퀴, 라인 센서, 거리 센서, 후면 서보)\n\nReturns:\n  Bitblock.RCCar: BB-Car 모드 컨트롤러.\n\n안전하게 ``car.stop()`` 을 ``finally:`` 절에 넣어 두면 코드 중간 오류로 빠져나오더라도 모터가 멈추므로 차가 책상 밖으로 굴러가는 사고를 막을 수 있다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.move_forward(120)
    wait(1000)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.move_forward(speed) / move_backward(speed)",summary:"양쪽 바퀴를 같은 속도로 전진/후진.",details:`Args:
  speed (int): 0~255 범위의 속도. 기본값 100. 음수를 줘도 절대값으로 보정된다.
Returns:
  None

속도 100~150 정도가 책상 위 시연에 적당하다. 너무 크면 멈출 때 관성으로 미끄러진다.`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.move_forward(120);  wait(1000)
    car.stop();             wait(500)
    car.move_backward(120); wait(1000)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.turn_left(speed) / turn_right(speed)",summary:"한쪽 바퀴 속도를 절반으로 줄여 호선(곡선)을 그리며 회전.",details:"두 바퀴 모두 전진하지만 한쪽이 더 느리게 돌아 자연스러운 호선 주행이 만들어진다. 회전 반경은 ``speed`` 가 클수록 커진다.\n\nArgs:\n  speed (int): 기준 속도(0~255). 안쪽 바퀴는 ``speed/2`` 로 자동 설정.\nReturns:\n  None",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    # S자 주행
    car.turn_left(150);  wait(800)
    car.turn_right(150); wait(800)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.pivot_left(speed) / pivot_right(speed)",summary:"제자리에서 회전(한쪽 전진 + 다른쪽 후진).",details:"한 바퀴를 전진, 반대쪽을 후진시켜 차체가 거의 한 자리에서 돈다. 좁은 곳에서 방향을 바꾸거나 90도 회전이 필요할 때 쓴다.\n\nArgs:\n  speed (int): 회전 속도(0~255). 기본값 100.\nReturns:\n  None\n\n90도 / 180도 회전은 ``speed`` 와 ``wait`` 시간을 실험으로 정한다(예: ``pivot_left(120)`` + ``wait(450)``).",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    # 제자리에서 한 바퀴 (대략)
    car.pivot_left(150);  wait(1800)
    car.stop();           wait(500)
    car.pivot_right(150); wait(1800)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.wheels(left, right)",summary:"좌우 바퀴 속도를 부호 있는 값으로 직접 지정한다.",details:"음수 속도는 그 바퀴를 역회전시킨다. 한쪽만 음수로 두면 ``pivot_*`` 와 비슷한 동작을, 두 값의 차이를 조절하면 ``turn_*`` 보다 정밀한 호선 주행을 만들 수 있다.\n\nArgs:\n  left (int): 왼쪽 바퀴 속도. -255~255.\n  right (int): 오른쪽 바퀴 속도. -255~255.\nReturns:\n  None\n\n곡률 반경을 직접 만들고 싶을 때 가장 유연한 명령이다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.wheels(150, 80);   wait(1000)   # 완만한 우회전
    car.wheels(80, 150);   wait(1000)   # 완만한 좌회전
    car.wheels(120, -120); wait(800)    # 제자리 우회전
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.stop()",summary:"양쪽 바퀴를 즉시 정지한다.",details:"주행 마무리는 항상 ``stop()`` 으로 끝낸다. 마지막 명령이 ``move_forward`` 인 채로 프로그램이 끝나면 모터가 계속 돌 수 있다.\n\nReturns:\n  None\n\nPyodide 환경에서는 코드를 강제 종료해도 시리얼 포트가 잠시 살아 있을 수 있으므로, ``try/finally`` 로 ``stop()`` 호출을 보장하는 습관이 안전하다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.move_forward(120)
    wait(1500)
finally:
    car.stop()       # 어떤 경로로 끝나도 반드시 정지
    bb.disconnect()`},{name:"car.distance()",summary:"BB-Car 앞쪽 초음파 센서로 장애물까지 거리(cm)를 측정한다.",details:"차체 전방의 초음파 센서를 읽는다. 본체 메서드 ``bb.ultrasonic`` 와 비슷하지만, 핀 번호를 따로 적지 않아도 펌웨어가 RC카 표준 핀(P7/P9)을 자동으로 사용한다.\n\nReturns:\n  int | None: 앞쪽 거리(cm). 응답이 깨지면 ``None``.\n\n거리 측정은 보통 100ms마다 한 번이면 충분하다. 너무 자주 호출하면 음파 간섭으로 값이 들쭉날쭉할 수 있다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    while True:
        d = car.distance()
        if d is None:
            wait(50); continue

        if d < 15:                # 장애물 가까이 → 정지
            car.stop()
        else:
            car.move_forward(120)
        wait(100)
finally:
    car.stop()
    bb.disconnect()`},{name:"car.line()",summary:"하부 3채널 라인 센서 값을 (왼쪽, 중간, 오른쪽) 으로 읽는다.",details:"차체 아래쪽 IR 센서 3개의 값을 한 번에 읽는다. 어두운 라인을 만나면 그 채널의 값이 떨어지는 것이 일반적이다.\n\nReturns:\n  tuple[int, int, int] | None: ``(L, C, R)`` 세 정수. 응답이 깨지면 ``None``.\n\n센서 값과 임계값은 바닥 색상·조명에 따라 달라진다. 실제 환경에서 라인 위/밖에 차를 두고 ``print(car.line())`` 으로 값을 미리 측정해 보고, 그 사이의 적당한 값을 임계값으로 쓰는 것이 좋다.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

THRESHOLD = 500   # 환경에 맞춰 조정

try:
    while True:
        result = car.line()
        if result is None:
            wait(20); continue
        l, c, r = result

        on_l = l < THRESHOLD
        on_c = c < THRESHOLD
        on_r = r < THRESHOLD

        if on_c and not on_l and not on_r:
            car.move_forward(100)         # 직진
        elif on_l and not on_r:
            car.wheels(40, 120)           # 왼쪽으로 보정
        elif on_r and not on_l:
            car.wheels(120, 40)           # 오른쪽으로 보정
        else:
            car.stop()                    # 라인을 잃었거나 교차로

        wait(30)
finally:
    car.stop()
    bb.disconnect()`},{name:"car.servo(pin, angle)",summary:"BB-Car 후면 커넥터에 연결된 서보를 회전시킨다.",details:"차체 뒷쪽 P3(또는 P4) 커넥터에 꽂은 서보의 각도를 설정한다. 각도는 내부에서 ``clamp(value, 0, 180)`` 으로 자동 보정되므로 범위 밖 값을 줘도 안전하다.\n\nArgs:\n  pin (int): 서보 연결 핀. 보통 ``bb.pin.P3`` 또는 ``bb.pin.P4``.\n  angle (int): 0~180 범위의 각도(범위 밖이면 자동 클램프).\nReturns:\n  None",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.servo(bb.pin.P3, 0);   wait(800)
    car.servo(bb.pin.P3, 90);  wait(800)
    car.servo(bb.pin.P3, 180); wait(800)
    car.servo(bb.pin.P3, 90)
finally:
    car.stop()
    bb.disconnect()`}]},{id:"advanced",title:"10. 응용 — 스레드와 AI 결합",description:"백그라운드 스레드 + HelloAI 손동작 인식과 BitBlock 결합",icon:"psychology",entries:[{name:"왜 스레드가 필요한가 (개념)",summary:"센서 폴링이나 AI 추론은 길게 걸린다 — 메인 흐름과 분리하면 보드는 즉각 반응한다.",details:"지금까지 작성한 BitBlock 코드는 모두 한 줄씩 차례로 실행되는 단일 흐름이었다.\n\n문제는 카메라 프레임 처리, 손/얼굴 인식, 외부 데이터 수신처럼 느린 작업이 끼어들면 그 동안 LED · 부저 · 모터가 모두 멈춘다는 점이다. 보드 동작과 AI 추론을 별도 스레드로 분리하면, AI 결과는 공유 변수로 전달하고 보드는 자기 페이스대로 즉시 반응할 수 있다.\n\nPyodide 환경에서도 ``threading.Thread`` 는 정상 동작한다. 다만 모든 시리얼 명령은 한 스레드에서만 호출하는 것이 안전하다 — 보드 응답을 기다리는 메서드(``button``, ``touch``, ``ultrasonic`` 등)가 다른 스레드의 명령과 섞이면 응답 패킷이 엇갈려 ``WRONG_PACKET_INDEX`` 오류가 난다.\n\n권장 패턴: AI 추론을 백그라운드 스레드에서 돌리고 결과를 공유 변수에 쓴다. 메인 스레드는 그 변수만 읽어서 보드를 제어한다.",example:`import threading
from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

state = {"active": True, "value": 0}

def background():
    """무거운 작업을 흉내낸 백그라운드 루프 (실제로는 AI 추론)."""
    counter = 0
    while state["active"]:
        # 시간이 걸리는 작업
        counter = (counter + 1) % 5
        state["value"] = counter
        wait(500)

t = threading.Thread(target=background, daemon=True)
t.start()

try:
    palette = [COLOR.RED, COLOR.YELLOW, COLOR.GREEN, COLOR.BLUE, COLOR.WHITE]
    while True:
        bb.display.color(palette[state["value"]])
        wait(50)
finally:
    state["active"] = False
    bb.display.clear()
    bb.disconnect()`},{name:"HelloAI 손동작 인식 + LED 색 (예제)",summary:"카메라로 손 펴기/주먹을 감지해 BitBlock LED 색을 바꾼다.",details:"이 IDE에는 ``helloai`` 라는 AI 헬퍼 패키지가 함께 들어 있다. 손동작 인식은 그중 ``Hand`` 모듈을 사용하면 된다. (자세한 손 감지 API는 별도 AI 레퍼런스를 참고)\n\n핵심 구조:\n  1) 백그라운드 스레드에서 카메라 프레임을 받고 손가락 개수를 세서 공유 변수에 저장한다.\n  2) 메인 스레드는 그 값만 읽어 LED 색을 바꾼다.\n\n아래 예제는 큰 틀만 보여주고, ``count_fingers(frame)`` 자리는 실제 ``helloai.Hand`` 호출로 대체하면 된다. 손가락 0개 = 빨강 / 1~2개 = 노랑 / 3개 이상 = 초록.",example:`import threading
from pycombb import Bitblock, COLOR, wait

# from helloai import Camera, Hand   # 실제 사용 시 주석 해제

bb = Bitblock()
bb.connect()

shared = {"running": True, "fingers": 0}

def vision_loop():
    # cam = Camera()
    # detector = Hand()
    while shared["running"]:
        # frame = cam.read()
        # hands = detector.find_hands(frame)
        # shared["fingers"] = count_fingers(hands)
        wait(80)         # 카메라 한 프레임 분량을 흉내

worker = threading.Thread(target=vision_loop, daemon=True)
worker.start()

try:
    while True:
        n = shared["fingers"]
        if n == 0:
            bb.display.color(COLOR.RED)
        elif n <= 2:
            bb.display.color(COLOR.YELLOW)
        else:
            bb.display.color(COLOR.GREEN)
        wait(50)
finally:
    shared["running"] = False
    bb.display.clear()
    bb.disconnect()`},{name:"자동 정지 — 거리 + 라인 통합 제어",summary:"BB-Car의 거리 센서와 라인 센서를 동시에 보면서, 보드 LED로 상태를 표시한다.",details:"센서 두 개를 같이 보는 것은 단순히 ``while True:`` 안에 두 번 호출하면 된다. 다만 두 호출 모두 응답을 기다리므로 한 사이클 시간이 길어진다. 너무 느리면 한쪽 폴링 주기를 줄이거나(예: 거리 100ms마다, 라인 30ms마다), 큰 변화가 있을 때만 LED를 갱신해 통신 부담을 줄인다.\n\n아래 예제는 라인을 따라 가다가 앞쪽 15cm 안에 장애물이 들어오면 즉시 정지하고 LED를 빨강으로 바꾼다.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

LINE_THRESHOLD = 500
DISTANCE_STOP  = 15

last_color = None
def set_led(color):
    global last_color
    if color != last_color:
        bb.display.color(color)
        last_color = color

try:
    cycle = 0
    while True:
        cycle += 1

        # 거리 측정은 3사이클(약 90ms)마다 1번
        if cycle % 3 == 0:
            d = car.distance()
            if d is not None and d < DISTANCE_STOP:
                car.stop()
                set_led(COLOR.RED)
                wait(30)
                continue

        result = car.line()
        if result is None:
            wait(30); continue
        l, c, r = result

        on_l = l < LINE_THRESHOLD
        on_c = c < LINE_THRESHOLD
        on_r = r < LINE_THRESHOLD

        if on_c and not on_l and not on_r:
            car.move_forward(100); set_led(COLOR.GREEN)
        elif on_l and not on_r:
            car.wheels(40, 120);   set_led(COLOR.YELLOW)
        elif on_r and not on_l:
            car.wheels(120, 40);   set_led(COLOR.YELLOW)
        else:
            car.stop();            set_led(COLOR.BLUE)

        wait(30)
finally:
    car.stop()
    bb.display.clear()
    bb.disconnect()`}]},{id:"virtual-keyboard",title:"11. 가상 키보드 — IDE 키로 BitBlock 조종",description:"VirtualKeyboard 모듈로 키 입력을 받아 LED · 부저 · RC카를 실시간 제어",icon:"keyboard",entries:[{name:"VirtualKeyboard 모듈 (개념)",summary:"툴바의 가상 키보드를 동기적으로 읽어 BitBlock 동작과 묶을 수 있다.",details:'IDE 툴바의 키보드 버튼을 누르면 화면에 작은 가상 키보드 창이 뜬다. 이 창의 버튼(혹은 그 창이 포커스를 가진 상태의 실제 키보드)을 누르면 키 코드가 ``VirtualKeyboard`` 모듈로 흘러 들어온다.\n\n용도는 단순하다 — BitBlock 코드 안에서 키 입력을 받아 LED 색을 바꾸거나, RC카를 운전하거나, 부저를 울리는 등 **실시간 제어**를 손쉽게 만들 수 있다. ``input()`` 처럼 한 줄을 통째로 입력받고 엔터를 기다리는 방식이 아니라, 키 **한 개씩** 그때그때 받아 처리하는 게 핵심이다.\n\n핵심 특징:\n  • ``import VirtualKeyboard as kb`` 한 줄로 사용한다(관례적으로 ``kb`` 별칭).\n  • 함수는 ``kb.wait_key(ms)`` 한 개뿐이다. ``ms`` 만큼 기다리고, 키가 없으면 ``-1`` 을 돌려준다.\n  • 알파벳/숫자 키는 소문자 ASCII 코드, ESC/Enter/Space 등은 표준 ASCII 코드, 화살표는 ``0x80~0x83`` 의 커스텀 코드.\n  • ``cv2.waitKey()`` 와 **독립된 큐**를 쓰므로 imshow 창이 떠 있어도 두 입력이 섞이지 않는다.\n\n즉 BitBlock 의 ``button()`` / ``touch()`` 와 같은 결로 쓸 수 있는 "PC 키보드 입력" 채널이라고 생각하면 된다.',example:`import VirtualKeyboard as kb
from pycombb import Bitblock

bb = Bitblock()
bb.connect()

# 툴바의 키보드 아이콘을 눌러 가상 키보드 창을 먼저 띄워 두자.
print("아무 키나 눌러 보세요 (ESC 로 종료)")

try:
    while True:
        key = kb.wait_key(0)        # 0 = 키가 눌릴 때까지 무한 대기
        if key == kb.ESC:
            break
        print("받은 키 코드:", key)
finally:
    bb.disconnect()`},{name:"kb.wait_key(ms)",summary:"다음 키 한 개를 기다린다. ``ms`` 이내에 안 들어오면 ``-1``.",details:"Args:\n  ms (int): 대기 시간(밀리초). ``0`` 이하이면 키가 눌릴 때까지 **무한 대기**한다.\nReturns:\n  int: 눌린 키의 코드. 타임아웃이면 ``-1``.\n\n두 가지 사용 패턴이 있다.\n\n  1) **블로킹 모드** (``ms=0``): 키가 들어올 때까지 멈춘다. 메뉴 선택처럼 한 번에 한 키만 받으면 되는 경우에 깔끔하다.\n  2) **논블로킹 모드** (``ms`` 작은 양수, 예: ``20``): 짧게만 기다려 보고 키가 없으면 ``-1`` 을 돌려준다. 게임 루프처럼 키 입력과 별개로 LED/모터를 갱신해야 할 때 쓴다.",example:`import VirtualKeyboard as kb
from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        key = kb.wait_key(20)        # 20ms만 기다리고 즉시 다음 줄로
        if key == kb.ESC:
            break

        # 키가 들어왔든 안 들어왔든, 매 사이클 LED를 갱신한다.
        if key == kb.SPACE:
            bb.display.color(COLOR.RED)
        elif key != -1:
            bb.display.color(COLOR.BLUE)

        wait(10)
finally:
    bb.display.clear()
    bb.disconnect()`},{name:"키 코드 상수표",summary:"문자 키는 소문자 ASCII, 특수 키는 모듈 상수로 비교한다.",details:'키 비교는 숫자 코드를 외우는 대신 ``kb.ESC`` 처럼 모듈에 정의된 상수를 쓰면 읽기 쉽다.\n\n문자/숫자 (소문자 ASCII 코드):\n  ``kb.A`` ~ ``kb.Z``      = 알파벳 (`ord("a")` ~ `ord("z")`)\n  ``kb.NUM_0`` ~ ``kb.NUM_9`` = 숫자 (`ord("0")` ~ `ord("9")`)\n\n제어/공용 키 (표준 ASCII):\n  ``kb.BACKSPACE`` = 8\n  ``kb.TAB``       = 9\n  ``kb.ENTER``     = 13\n  ``kb.ESC``       = 27\n  ``kb.SPACE``     = 32\n\n화살표 (ASCII 와 충돌을 피하려고 0x80+ 커스텀 코드):\n  ``kb.ARROW_LEFT``  = 0x80\n  ``kb.ARROW_UP``    = 0x81\n  ``kb.ARROW_RIGHT`` = 0x82\n  ``kb.ARROW_DOWN``  = 0x83\n\n주의: 알파벳 상수는 모두 **소문자** 코드다. 가상 키보드는 Shift 입력을 따로 전달하지 않으므로 ``kb.A`` 한 가지로 비교하면 된다. 직접 비교가 필요하면 ``ord("a")`` 같은 식으로 적어도 동일하다.',example:`import VirtualKeyboard as kb
from pycombb import Bitblock, COLOR

bb = Bitblock()
bb.connect()

# 자주 쓰는 키 → 색 매핑 테이블
color_map = {
    kb.NUM_1: COLOR.RED,
    kb.NUM_2: COLOR.GREEN,
    kb.NUM_3: COLOR.BLUE,
    kb.NUM_4: COLOR.YELLOW,
    kb.SPACE: COLOR.WHITE,
}

try:
    print("1~4 키 = 색 변경, SPACE = 흰색, ESC = 종료")
    while True:
        key = kb.wait_key(0)
        if key == kb.ESC:
            break
        if key in color_map:
            bb.display.color(color_map[key])
finally:
    bb.display.clear()
    bb.disconnect()`},{name:"예제: 화살표 키로 LED 그림 그리기",summary:"커서를 화살표로 움직이면서 SPACE 로 칠해 5x5 LED 매트릭스에 그림을 그린다.",details:'가상 키보드의 위력은 "키 한 개 = 한 동작" 이 즉시 BitBlock 에 반영된다는 점이다. 아래 예제는 5x5 LED 위에 커서를 두고:\n  • 화살표 → 커서 이동\n  • SPACE  → 현재 위치 켜기\n  • C      → 전체 지우기\n  • ESC    → 종료\n식으로 동작한다.\n\n구현 핵심은 두 가지다. 첫째, 커서 위치를 ``(x, y)`` 변수로 들고 다닌다. 둘째, 매 키 입력 후 ``bb.display.clear()`` 로 화면을 비우고 "켠 점들" + "커서" 를 다시 그린다(가장 단순한 이중 버퍼). 점을 켜는 색과 커서 색을 다르게 두면 커서가 어디 있는지 한눈에 보인다.\n\n``kb.wait_key(0)`` 으로 블로킹 모드를 썼다 — 키를 누르기 전까지 LED 가 깜빡일 일이 없고, 누른 순간에만 화면이 바뀌어 매우 부드럽다.',example:`import VirtualKeyboard as kb
from pycombb import Bitblock, COLOR

bb = Bitblock()
bb.connect()

W, H = 5, 5
pixels = set()        # 켜진 점들의 (x, y) 좌표
cx, cy = 2, 2         # 커서 시작 위치 (가운데)

def redraw():
    bb.display.clear()
    for x, y in pixels:
        bb.display.xy(x, y, COLOR.YELLOW)
    bb.display.xy(cx, cy, COLOR.RED)        # 커서

try:
    redraw()
    print("화살표=이동, SPACE=칠하기, C=전체 지우기, ESC=종료")
    while True:
        key = kb.wait_key(0)
        if key == kb.ESC:
            break
        elif key == kb.ARROW_LEFT  and cx > 0:     cx -= 1
        elif key == kb.ARROW_RIGHT and cx < W - 1: cx += 1
        elif key == kb.ARROW_UP    and cy > 0:     cy -= 1
        elif key == kb.ARROW_DOWN  and cy < H - 1: cy += 1
        elif key == kb.SPACE:
            pixels.add((cx, cy))
        elif key == kb.C:
            pixels.clear()
        redraw()
finally:
    bb.display.clear()
    bb.disconnect()`},{name:"예제: WASD 로 RC카 운전",summary:"PC 키보드로 BB-Car 를 실시간 조종한다. 키가 들어오는 동안만 움직인다.",details:'RC카 조종은 "키가 눌린 동안만 움직이고, 떼면 멈춘다" 가 자연스럽다. 가상 키보드는 "키 한 개" 단위로만 이벤트를 주기 때문에, **키를 받는 즉시 시작 → 짧은 시간 후 자동 정지** 패턴을 쓴다. 너무 짧으면 끊겨 보이고, 너무 길면 반응이 둔해지므로 200~300ms 정도가 무난하다.\n\n핵심은 ``kb.wait_key(ms)`` 의 ``ms`` 값이다. 작은 값(예: 30ms)을 주면 사이클이 빨라 키 누름에 즉각 반응하고, 키가 안 들어오면 자동 정지로 흐른다.\n\n키 매핑:\n  • W / S          : 전진 / 후진\n  • A / D          : 제자리 좌/우 회전\n  • SPACE          : 즉시 정지\n  • 1 / 2 / 3      : 속도 80 / 130 / 200\n  • ESC            : 종료\n\n``finally:`` 절에서 반드시 ``car.stop()`` 을 호출해 두자. 예외나 ESC 로 빠져나가도 차가 굴러가지 않는다.',example:`import VirtualKeyboard as kb
from pycombb import Bitblock

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

speed = 130

ACTIONS = {
    kb.W: lambda: car.move_forward(speed),
    kb.S: lambda: car.move_backward(speed),
    kb.A: lambda: car.pivot_left(speed),
    kb.D: lambda: car.pivot_right(speed),
    kb.SPACE: lambda: car.stop(),
}

try:
    print("W/A/S/D = 주행, SPACE = 정지, 1/2/3 = 속도, ESC = 종료")
    while True:
        key = kb.wait_key(30)        # 30ms 마다 키 확인
        if key == kb.ESC:
            break

        # 속도 변경 키
        if key == kb.NUM_1:   speed = 80
        elif key == kb.NUM_2: speed = 130
        elif key == kb.NUM_3: speed = 200

        action = ACTIONS.get(key)
        if action:
            action()
        elif key == -1:
            # 키가 안 들어오면 안전을 위해 자동 정지
            car.stop()
finally:
    car.stop()
    bb.disconnect()`}]}];export{n as BITBLOCK_TUTORIAL};
