const t=[{id:"setup",title:"1. 환경설정",description:"USB 동글 드라이버 설치 안내",icon:"settings",setup:{intro:"카미봇과 PC를 시리얼 포트로 연결하려면 **USB 동글 드라이버**를 먼저 설치해야 합니다. 아래 절차를 따라 드라이버 설치를 진행해 주세요.",steps:['아래 "드라이버 다운로드" 버튼을 눌러 설치 파일(CDM21228_Setup.zip)을 내려받아서 압축을 해제합니다.',"압축 해제된 폴더 안의 CDM21228_Setup.exe 파일을 실행해 안내에 따라 드라이버를 설치합니다. 필요에 따라 PC를 재부팅이 필요할 수 있습니다.","설치가 끝나면 USB 동글을 PC에 꽂고 카미봇 본체의 전원을 켜 연결합니다."],note:"설치 후에도 포트가 인식되지 않으면 PC를 재부팅하거나 다른 USB 포트에 연결해 주세요.",download:{href:"/drivers/CDM21228_Setup.zip",filename:"CDM21228_Setup.zip",label:"드라이버 다운로드 (CDM21228_Setup.zip)"},pairing:{title:"동글과 로봇 연결하기",intro:"드라이버 설치가 끝나면 카미봇 본체와 USB 동글(카미봇 동글)을 다음 절차로 페어링(하드웨어적으로 연결)합니다.",steps:["카미봇 본체와 카미봇 동글을 준비합니다.","카미봇 본체의 전원을 켭니다. 본체의 LED가 켜지고 여러 색상으로 바뀝니다.","카미봇 동글을 PC의 USB 포트에 꽂고, 카미봇 본체를 동글에 최대한 가까이 가져갑니다. (동글과 가장 가까이에 있는 로봇과 연결이 됩니다)","카미봇 동글의 버튼을 누릅니다.","카미봇 본체의 LED가 파란색으로 바뀌면 하드웨어 연결이 완료된 상태입니다."]}},notice:"이 서비스(Python IDE for KAMIBO)는 PC와 크롬북(Chrom OS)에서 정상적으로 동작합니다. 안드로이드 태블릿이나 안드로이드 폰에서 동작하지 않습니다."},{id:"getting-started",title:"2. 시작하기",description:"카미봇 연결 · 종료 · 대기 등 가장 기본이 되는 명령",icon:"play_circle",entries:[{name:"KamibotPi(port)",summary:"카미봇 본체와 시리얼 포트를 열어 컨트롤러 객체를 만든다.",details:'`KamibotPi`는 카미봇 한 대를 다루는 메인 SDK 클래스다.\n인스턴스를 만드는 순간 시리얼 포트가 열리고, 이후 모든 명령은 ``bot.xxx(...)`` 형태로 보낸다.\n\nArgs:\n  port (str): 시리얼 포트 이름. Windows는 ``"COM5"``, Linux/Mac은 ``"/dev/ttyUSB0"`` 같이 적는다. ``None``이면 즉시 종료된다.\n  baud (int): 통신 속도. 펌웨어 기본값인 ``57600``을 그대로 쓰면 된다.\n  timeout (int | float): 응답 대기 시간(초). 기본 ``2``.\n  verbose (bool): ``True``이면 명령마다 디버깅 메시지를 출력한다. 기본 ``False``.\n\n관례적으로 변수 이름은 ``bot``을 쓴다. 멜로디를 연주할 거라면 ``Note`` 상수도 함께 import해 두면 편하다.',example:`from pibot import KamibotPi

# 시리얼 포트를 열고 카미봇과 연결
bot = KamibotPi("COM85")  # 예시 포트
print(bot)

bot.close()`},{name:"bot.close()",summary:"시리얼 포트를 정리하고 프로세스를 종료한다.",details:"포트가 열려 있으면 버퍼를 비우고 닫은 뒤 ``sys.exit(0)``으로 프로세스를 끝낸다.\n프로그램 마지막에 호출해 두면 다음 프로그램이 같은 포트를 다시 잡을 수 있다.\n\nReturns:\n  None\n\n종료 없이 포트만 닫고 싶다면 ``bot.disconnect()``를 사용한다.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 본 작업 (LED, 모터, 센서 등)
bot.beep(0.3)

# 항상 마지막에 close — 포트를 깨끗이 닫음
bot.close()`},{name:"bot.init()",summary:"카미봇 내부 상태를 초기 값으로 되돌린다.",details:`여러 명령을 보낸 뒤 출발 상태로 다시 맞추고 싶을 때 사용한다.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 다양한 명령 실행 후 깨끗한 상태로 되돌리기
bot.turn_led(255, 0, 0)
bot.delay(1)
bot.init()

bot.close()`},{name:"bot.delay(sec)",summary:"주어진 시간(초)만큼 프로그램을 멈춘다.",details:"내부적으로는 ``time.sleep``을 호출한다. 1초보다 짧게 기다리려면 ``0.5``처럼 소수점을 쓴다.\n\nArgs:\n  sec (float): 대기할 시간(초).\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_led(0, 255, 0)   # 초록 LED 켜기
bot.delay(1.5)            # 1.5초 동안 유지
bot.turn_led(0, 0, 0)     # LED 끄기

bot.close()`},{name:"bot.delayms(ms)",summary:"주어진 시간(밀리초)만큼 프로그램을 멈춘다.",details:`\`\`delay\`\`의 밀리초 단위 버전이다. 보드 동작은 millisecond 단위로 다루는 일이 많아 단위 환산 없이 자연스럽게 쓸 수 있다.

Args:
  ms (int | float): 대기할 시간(밀리초). 500을 주면 0.5초 대기.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

for i in range(3):
    bot.beep(0.05)
    bot.delayms(300)   # 0.3초 대기

bot.close()`},{name:"bot.wait(ms)",summary:"delayms와 똑같이 밀리초 단위로 기다린다.",details:"다른 보드 라이브러리와 인터페이스를 맞추기 위해 같은 동작을 ``wait``라는 이름으로도 노출한다. ``delayms``와 동작이 완전히 같으니 둘 중 어느 쪽을 써도 무방하다.\n\nArgs:\n  ms (int | float): 대기할 시간(밀리초).\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_led(0, 0, 255)   # 파란 LED
bot.wait(800)             # 0.8초 대기
bot.turn_led(0, 0, 0)

bot.close()`},{name:"bot.stop()",summary:"이동 중인 카미봇을 즉시 멈춘다.",details:'``go_forward_speed``, ``go_backward_speed``처럼 "굴리기 시작" 형태의 명령은 ``stop``을 부르기 전까지 계속 굴러간다. 지정한 시간만큼 이동한 뒤에는 반드시 ``stop()``으로 모터를 꺼야 한다.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 두 바퀴를 굴리고 2초 후 정지
bot.go_forward_speed(80, 80)
bot.delay(2)
bot.stop()

bot.close()`}]},{id:"sound",title:"3. 소리",description:"비프음과 음계 연주",icon:"music_note",entries:[{name:"bot.beep(sec=0.2)",summary:'"삐" 소리를 잠깐 내준다. 재생 시간을 초 단위로 지정할 수 있다.',details:"내부적으로는 60번 음계(C4, 가운데 도)를 ``sec`` 초 동안 ``melody``로 재생한다.\n동작 알림이나 버튼 누름 피드백처럼 짧은 신호음으로 가장 편하게 쓸 수 있다.\n\nArgs:\n  sec (float): 재생 시간(초). 생략 시 0.2초. 범위 0.1 ~ 25.5.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 길이를 다르게 세 번 비프
bot.beep()       # 0.2초 (기본값)
bot.delay(0.3)
bot.beep(1)      # 1초
bot.delay(0.3)
bot.beep(0.5)    # 0.5초

bot.close()`},{name:"bot.melody(scale, sec)",summary:"지정한 음계를 주어진 시간만큼 재생한다.",details:"음 한 개를 ``sec`` 초 동안 부저로 낸다. ``scale``에 정수(0~83)를 줘도 되고, ``Note.C4`` 같은 상수를 줘도 된다.\n여러 번 호출해 짧은 멜로디를 만들 수 있다.\n\nArgs:\n  scale (int): 음계 (0 ~ 83). ``Note.C4`` 같은 상수도 사용 가능.\n  sec (float): 재생 시간(초).\n\nReturns:\n  None",example:`from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 도 - 미 - 솔 (C 메이저 분산)
bot.melody(Note.C4, 0.4)
bot.melody(Note.E4, 0.4)
bot.melody(Note.G4, 0.4)

bot.close()`,warning2:`Note 상수를 쓰려면 from pibot import Note 가 필요합니다.
샵: Cs4 (=C♯4)  /  플랫: Db4 (=D♭4)  ← 같은 음을 가리키는 별칭`,warning2Type:"info"}],tables:[{title:"음계 ↔ scale 매핑 (Octave 4 기준, 중간 도 = Note.C4 = 60)",headers:["음","자연음/샵","플랫 별칭","scale 값"],rows:[["C","C4","—","60"],["C♯","Cs4","Db4","61"],["D","D4","—","62"],["D♯","Ds4","Eb4","63"],["E","E4","—","64"],["F","F4","—","65"],["F♯","Fs4","Gb4","66"],["G","G4","—","67"],["G♯","Gs4","Ab4","68"],["A","A4","—","69"],["A♯","As4","Bb4","70"],["B","B4","—","71"]],note:"다른 옥타브는 각 행의 scale 값에 ±12 하면 됩니다. 예: C5 = 60 + 12 = 72,  C3 = 60 − 12 = 48. 전체 범위는 Note.CM1(=0) ~ Note.B5(=83)."}],entriesAfter:[{name:"예제: 경찰차 사이렌",summary:'두 음을 빠르게 번갈아 재생해 "삐-뽀 삐-뽀" 사이렌을 흉내냅니다.',example:{description:`경찰차 사이렌은 두 개의 음을 빠르게 교대로 내는 아주 단순한 패턴입니다.
melody 함수와 반복문(for)을 익히기에 좋은 첫 예제입니다.

[1] from pibot import KamibotPi, Note
   카미봇과 음계 상수 Note를 함께 불러옵니다.

[2] bot = KamibotPi("COM85")
   카미봇 객체를 만듭니다.

[4–6] HI, LO, T
   HI = Note.D5 (scale=74): 사이렌의 높은 톤
   LO = Note.A4 (scale=69): 낮은 톤. 두 음의 차이는 완전 4도(+5)입니다.
   T  = 0.3 : 한 음의 길이(초). 경찰차는 "빠르게" 교대하므로 짧게 둡니다.

[8–10] for _ in range(6):
   "높은 음 → 낮은 음" 한 쌍을 6번 반복합니다 (약 3.6초). 
   range의 횟수만 바꾸면 사이렌 길이를 조절할 수 있습니다.

[12] bot.close()
   시리얼 포트를 닫고 종료합니다.`,code:`# 카미봇 드라이버와 Note 상수표를 가져옵니다.
from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 경찰차 사이렌: 두 음을 빠르게 교대 ("삐-뽀 삐-뽀").
# 짧은 음 길이와 완전 4도 간격이 밝고 다급한 느낌을 줍니다.
HI = Note.D5   # 높은 음
LO = Note.A4   # 낮은 음 (HI보다 완전 4도 아래)
T  = 0.3       # 한 음의 길이(초)

# HI/LO 한 쌍을 6번 재생 (총 약 3.6초).
# range 횟수를 늘리면 사이렌이 더 길어집니다.
for _ in range(6):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`}},{name:"예제: 병원 앰뷸런스 사이렌",summary:'경찰차보다 느리게 두 음을 교대해 "니-노 니-노" 사이렌을 만듭니다.',example:{description:`앰뷸런스 사이렌도 두 음 교대 방식이지만, 경찰차에 비해 더 느립니다.
같은 패턴이라도 한 음의 길이(T)와 사용하는 음역만 바꾸면 분위기가 완전히 달라진다는 점에 주목하세요.

[1] from pibot import KamibotPi, Note
   카미봇과 Note 상수를 함께 불러옵니다.

[2] bot = KamibotPi("COM85")
   카미봇 객체를 만듭니다.

[4–6] HI, LO, T
   HI = Note.A5 (scale=81): 사이렌의 높은 톤
   LO = Note.E5 (scale=76): 낮은 톤. 두 음의 차이는 완전 4도(+5)입니다.
   T  = 0.9 : 한 음의 길이(초). 앰뷸런스는 "천천히" 교대하므로 길게 둡니다.

[8–10] for _ in range(4):
   "높은 음 → 낮은 음" 한 쌍을 4번 반복합니다 (약 7.2초).

[12] bot.close()
   시리얼 포트를 닫고 종료합니다.

※ 비교 포인트: 경찰차는 T=0.3초로 빠르게, 앰뷸런스는 T=0.9초로 느리게. 같은 "두 음 교대" 패턴이라도 시간만 바꾸면 전혀 다른 사이렌이 됩니다.`,code:`# 카미봇 드라이버와 Note 상수표를 가져옵니다.
from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 앰뷸런스 사이렌: 두 음을 느리게 교대 ("니-노 니-노").
# 경찰차보다 긴 음 길이라 차분하지만 다급한 느낌은 유지됩니다.
HI = Note.A5   # 높은 음
LO = Note.E5   # 낮은 음 (HI보다 완전 4도 아래)
T  = 0.9       # 한 음의 길이(초) — 경찰차보다 느림

# HI/LO 한 쌍을 4번 재생 (총 약 7.2초).
for _ in range(4):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`}},{name:"예제: 엘리제를 위하여 (Für Elise) 연주",summary:'베토벤 "엘리제를 위하여" 도입부 4마디 + 여린내기 (3/8박자, 가단조).',example:{description:`한 줄씩 코드를 따라가며 살펴봅시다.

[1] from pibot import KamibotPi, Note
   카미봇을 조종하는 KamibotPi 클래스와, 음계 상수를 모아둔 Note를 함께 불러옵니다.

[2] bot = KamibotPi("COM85")
   카미봇 객체를 만듭니다. 이후 모든 명령은 bot.xxx() 형태로 호출합니다.

[3] S = 0.2   # 16분음표
   엘리제는 3/8 박자라서 가장 짧은 기본 단위가 16분음표입니다. S에 0.2초를 두었습니다.

[4] EE = 0.4  # 8분음표
   16분음표 두 개 길이가 8분음표 하나입니다. 템포를 바꾸려면 S, EE 두 값만 조정하면 됩니다.

[5–13] A4, B4, C4 … Ds5, Gs4
   Note.C4 처럼 매번 길게 쓰지 않도록 짧은 변수에 담아둡니다.
   Ds5 = D♯5(레#), Gs4 = G♯4(솔#) 입니다.

[15] score = [ ... ]
   연주할 악보. 각 원소는 (음, 길이) 튜플이고, 음이 None이면 쉼표로 처리됩니다.

[17] (E5, S), (Ds5, S)
   여린내기(픽업). 마디 시작 직전에 16분음표 두 개(미5 → 레♯5)로 시작합니다.

[20] M1: 미5 레♯5 미5 시4 레5 도5 — 모두 16분음표
   엘리제에서 가장 유명한 도입 라인입니다.

[23] M2: 라4(8분) — 쉼표(16분) — 도4 미4 라4 (16분)
   원곡에선 오른손이 라4를 길게, 왼손이 베이스로 도-미-라를 짚습니다.
   카미봇은 한 번에 한 음만 내므로 두 손 패턴을 한 줄로 합쳤습니다.

[26] M3: 시4(8분) — 쉼 — 미4 솔♯4 시4
   M2와 같은 모양으로 한 음 위로 진행합니다.

[29] M4: 도5(8분) — 쉼 — 미4 미5 레♯5
   선율이 정점 부근으로 올라가며 다음 프레이즈를 준비합니다.

[33–37] for note, dur in score: ...
   리스트를 차례로 꺼내, 음이면 bot.melody(음, 길이)로 연주하고,
   None이면 bot.delay(길이)로 같은 시간만큼 쉽니다.

[39] bot.close()
   시리얼 포트를 닫고 프로그램을 종료합니다.`,code:`# 카미봇 드라이버와 Note 상수표를 가져옵니다.
# KamibotPi가 카미봇에 명령을 보내고, Note는 음계 상수(C4, D5, ...)를 가집니다.
from pibot import KamibotPi, Note

# 카미봇 객체 생성. 아래 모든 명령은 이 'bot'을 통해 전송됩니다.
bot = KamibotPi("COM85")  # 예시 포트

# 3/8박자. 기본 단위는 16분음표.
# 16분음표(S) 두 개가 8분음표(EE) 하나입니다.
# 빠르게/느리게 하려면? 이 두 숫자만 바꾸면 됩니다.
S = 0.2    # 16분음표
EE = 0.4   # 8분음표

# Note 단축 변수 (가단조, 옥타브 4-5)
# 아래 악보에서 이 이름들이 여러 번 반복되므로,
# Note.X4를 짧은 변수에 담아 각 줄을 읽기 쉽게 만듭니다.
A4  = Note.A4
B4  = Note.B4
C4  = Note.C4
C5  = Note.C5
D5  = Note.D5
Ds5 = Note.Ds5   # D#5 (레#5)
E4  = Note.E4
E5  = Note.E5
Gs4 = Note.Gs4   # G#4 (솔#4)

# 악보: 엘리제를 위하여 (베토벤), 3/8박자, 가단조 — 도입 4마디 + 여린내기
# 악보는 (음, 길이) 튜플의 리스트로 데이터처럼 저장합니다.
# note=None이면 쉼표(소리 없음). 아래 반복문이 리스트를 읽으며 연주합니다.
score = [
    # 여린내기: 미5 레#5
    (E5, S), (Ds5, S),

    # M1: 미5 레#5 미5 시4 레5 도5
    (E5, S), (Ds5, S), (E5, S), (B4, S), (D5, S), (C5, S),

    # M2: 라4 — 쉼 — 도4 미4 라4
    (A4, EE), (None, S), (C4, S), (E4, S), (A4, S),

    # M3: 시4 — 쉼 — 미4 솔#4 시4
    (B4, EE), (None, S), (E4, S), (Gs4, S), (B4, S),

    # M4: 도5 — 쉼 — 미4 미5 레#5
    (C5, EE), (None, S), (E4, S), (E5, S), (Ds5, S),
]

# 악보를 한 쌍씩 꺼내며 연주합니다.
# 'note, dur'로 각 튜플을 풀어 음높이는 'note'에, 길이는 'dur'에 담습니다.
for note, dur in score:
    if note is None:
        bot.delay(dur)        # 쉼표: 'dur'초 동안 아무것도 하지 않음.
    else:
        bot.melody(note, dur) # 'note'를 'dur'초 동안 연주.

# 끝나면 시리얼 포트를 꼭 닫아야 다음 프로그램이 사용할 수 있습니다.
bot.close()`}},{name:"예제: 학교종 연주",summary:'동요 "학교종"을 melody로 재생하는 예제 (4/4박자).',example:{description:`숫자보 → 계명 매핑: 1=도(C), 2=레(D), 3=미(E), 5=솔(G), 6=라(A).
아래 옥타브 4 기준 Note 상수를 사용합니다.

리듬 단위(초):
  Q = 0.4   # 4분음표
  H = 0.8   # 2분음표
  REST = 0.4 # 4분쉼표
템포를 바꾸려면 Q, H 두 값만 조정하면 됩니다.

마디 구성 (총 8마디):
  M1 솔솔라라  (학교종이)
  M2 솔솔미 _  (땡땡땡 + 쉼)
  M3 솔솔미미  (어서모이)
  M4 레— _    (자, 2분음표 + 2분쉼표)
  M5 솔솔라라  (선생님이)
  M6 솔솔미 _  (우리를 + 쉼)
  M7 솔미레미  (기다리신)
  M8 도— _    (다, 2분음표 + 2분쉼표)

score 리스트는 (음, 길이) 튜플의 나열입니다. 음이 None이면 쉼표로 처리되어 bot.delay(길이)가 호출됩니다.`,code:`from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 음 길이(초) — 보통 빠르기 기준
Q = 0.4    # 4분음표
H = 0.8    # 2분음표
REST = 0.4 # 4분쉼표

# 숫자보 -> 서양 음계 (옥타브 4)
DO = Note.C4   # 1 (도)
RE = Note.D4   # 2 (레)
MI = Note.E4   # 3 (미)
SOL = Note.G4  # 5 (솔)
LA = Note.A4   # 6 (라)

# 악보: 학교종, 4/4박자
# (음, 길이) 형식. 음이 None이면 쉼표.
score = [
    # M1: 솔 솔 라 라 (학 교 종 이)
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M2: 솔 솔 미 + 쉼 (땡 땡 땡)
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M3: 솔 솔 미 미 (어 서 모 이)
    (SOL, Q), (SOL, Q), (MI, Q), (MI, Q),
    # M4: 레(2분음표) + 2분쉼표 (자 ─)
    (RE, H), (None, H),

    # M5: 솔 솔 라 라 (선 생 님 이)
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M6: 솔 솔 미 + 쉼 (우 리 를)
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M7: 솔 미 레 미 (기 다 리 신)
    (SOL, Q), (MI, Q), (RE, Q), (MI, Q),
    # M8: 도(2분음표) + 2분쉼표 (다 ─)
    (DO, H), (None, H),
]

for note, dur in score:
    if note is None:
        bot.delay(dur)
    else:
        bot.melody(note, dur)

bot.close()`}}]},{id:"led",title:"4. LED",description:"본체 컬러 LED를 RGB 값 또는 색상 인덱스로 켜기",icon:"lightbulb",entries:[{name:"bot.turn_led(r, g, b)",summary:"본체 LED를 RGB 값(0~255 각 채널)으로 켠다.",details:`세 채널의 밝기 값을 직접 지정해 임의의 색을 만들 수 있다. 모두 0이면 LED가 꺼진다.

Args:
  rval (int): 빨강 채널, 0 ~ 255.
  gval (int): 초록 채널, 0 ~ 255.
  bval (int): 파랑 채널, 0 ~ 255.

Returns:
  None

미리 정의된 9가지 색만 쓸 거라면 \`\`turn_led_idx\`\` 또는 \`\`LED\`\` dict가 더 짧다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 빨강 → 초록 → 파랑 → 흰색
bot.turn_led(255, 0, 0)
bot.delay(0.5)
bot.turn_led(0, 255, 0)
bot.delay(0.5)
bot.turn_led(0, 0, 255)
bot.delay(0.5)
bot.turn_led(255, 255, 255)
bot.delay(0.5)
bot.turn_led(0, 0, 0)     # 끄기

bot.close()`},{name:"bot.turn_led_idx(idx)",summary:"미리 정의된 색상 인덱스(0~7)로 LED를 켠다.",details:`자주 쓰는 색을 인덱스로 미리 등록해 둔 단축 함수다. RGB 숫자를 외울 필요 없이 색 번호만 적어주면 된다.

Args:
  idx (int): 색 번호. 0=빨강, 1=주황, 2=노랑, 3=초록, 4=파랑, 5=하늘, 6=보라, 7=흰색.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 0번부터 7번까지 색을 차례로 켜보기
for idx in range(8):
    bot.turn_led_idx(idx)
    bot.delay(0.4)

bot.turn_led(0, 0, 0)   # 끄기
bot.close()`,table:{headers:["idx","색","RGB 값"],rows:[["0","빨강 (red)","[255, 0, 0]"],["1","주황 (orange)","[255, 165, 0]"],["2","노랑 (yellow)","[255, 255, 0]"],["3","초록 (green)","[0, 255, 0]"],["4","파랑 (blue)","[0, 0, 255]"],["5","하늘 (skyblue)","[0, 255, 255]"],["6","보라 (purple)","[128, 0, 128]"],["7","흰색 (white)","[255, 255, 255]"]]}},{name:"LED (모듈 상수)",summary:"색 이름 → RGB 리스트로 매핑된 dict. 키 이름으로 색을 꺼내 ``turn_led``에 풀어 줄 수 있다.",details:'pibot 모듈에 미리 정의된 9가지 색의 RGB 리스트 사전이다.\n함수에 인자로 직접 풀어 주려면 ``*LED["red"]``처럼 unpack하거나, ``r, g, b = LED["green"]``으로 받아 쓴다.\n\n키 목록:\n  ``"off"``, ``"red"``, ``"orange"``, ``"yellow"``, ``"green"``, ``"blue"``, ``"skyblue"``, ``"purple"``, ``"white"``\n\n인덱스 기반으로 0~8 순회하고 싶다면 같은 정보가 들어 있는 ``LED_COLOR`` 리스트(인덱스 0~8)를 쓴다.',example:`from pibot import KamibotPi, LED

bot = KamibotPi("COM85")  # 예시 포트

# 키 이름으로 색을 꺼내 사용
bot.turn_led(*LED["red"])
bot.delay(0.5)
bot.turn_led(*LED["green"])
bot.delay(0.5)
bot.turn_led(*LED["blue"])
bot.delay(0.5)
bot.turn_led(*LED["off"])

bot.close()`}],tables:[{title:"SOS 모스 부호 패턴",headers:["글자","모스 부호"],rows:[["S","· · ·"],["O","— — —"],["S","· · ·"]],note:"모스 부호는 짧은 신호(점 ·)와 긴 신호(대시 —)의 조합으로 글자를 표현합니다. SOS는 국제 조난 신호로, 단순하고 알아보기 쉬운 패턴이라 긴급 상황에서 사용됩니다. LED를 점은 짧게, 대시는 길게 켜는 방식으로 표현할 수 있습니다."},{title:"모스 부호 타이밍 규칙",headers:["요소","길이","설명"],rows:[["점 (·)","1 단위","LED를 짧게 켜기"],["대시 (—)","3 단위","LED를 길게 켜기"],["부호 사이","1 단위","같은 글자 안의 점/대시 사이 간격"],["글자 사이","3 단위","S와 O, O와 S 사이 간격"],["신호 사이","7 단위","SOS 한 번이 끝나고 다시 시작할 때까지"]],note:'"1 단위(unit)"는 직접 정하면 됩니다. 아래 예제에서는 1 단위 = 0.2초로 사용했습니다. 단위를 줄이면 신호가 빨라지고, 늘리면 느려집니다.'}],entriesAfter:[{name:"예제: 빨간 LED로 SOS 신호 보내기",summary:"빨간색 LED를 모스 부호 SOS(· · · — — — · · ·) 패턴으로 깜빡여 조난 신호를 표현합니다.",details:`동작 순서:
  1. S = 짧게-짧게-짧게 (점 3번)
  2. O = 길게-길게-길게 (대시 3번)
  3. S = 짧게-짧게-짧게 (점 3번)
  4. 잠시 쉰 뒤 처음부터 반복

코드 구성:
  - blink(units): 한 부호(점 또는 대시)를 켰다 끄고, 부호 사이 간격(1 단위)까지 대기
  - send(pattern): "..."이나 "---" 같은 한 글자를 보내고 글자 사이 간격을 추가
  - try/finally: 중간에 멈춰도 LED를 반드시 끄고 포트를 닫음`,example:`from pibot import KamibotPi

# 1 단위 = 0.2초 — 신호를 빠르게/느리게 하려면 이 값을 바꾸세요
UNIT = 0.2
RED = (255, 0, 0)
OFF = (0, 0, 0)


def blink(bot, units):
    bot.turn_led(*RED)
    bot.delay(UNIT * units)
    bot.turn_led(*OFF)
    bot.delay(UNIT)  # 한 글자 안에서 부호 사이 간격


def send(bot, pattern):
    for symbol in pattern:
        blink(bot, 1 if symbol == "." else 3)
    bot.delay(UNIT * 2)  # 부호 간격(1)을 글자 간격(3)으로 확장


bot = KamibotPi("COM85")  # 예시 포트

try:
    for _ in range(3):
        send(bot, "...")   # S
        send(bot, "---")   # O
        send(bot, "...")   # S
        bot.delay(UNIT * 4)  # 글자 간격(3)을 단어 간격(7)으로 확장
finally:
    bot.turn_led(*OFF)
    bot.close()`}]},{id:"speed-control",title:"5. 속도 제어",description:"두 바퀴 속도(0~100)를 직접 정해 직진/곡선/제자리 회전 만들기",icon:"speed",entries:[{name:"bot.go_forward_speed(lspeed, rspeed)",summary:"두 바퀴 속도를 지정해 앞으로 굴린다. 멈추기 전까지 계속 이동한다.",details:'왼·오 두 바퀴를 동시에 앞으로 굴린다. 두 속도가 같으면 직진, 한쪽이 더 빠르면 느린 쪽으로 휘어진다.\n이 함수는 모터를 "켜기만" 한다 — 원하는 시간만큼 ``delay``로 기다린 뒤 ``stop()``으로 꺼야 한다.\n\nArgs:\n  lspeed (int): 왼쪽 바퀴 속도. 0 ~ 100.\n  rspeed (int): 오른쪽 바퀴 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.go_forward_speed(80, 80)   # 같은 속도 → 직진
bot.delay(2)
bot.stop()

bot.close()`},{name:"bot.go_backward_speed(lspeed, rspeed)",summary:"두 바퀴 속도를 지정해 뒤로 굴린다.",details:"``go_forward_speed``의 후진 버전이다. 사용 패턴(굴리기 → 대기 → ``stop()``)도 같다.\n\nArgs:\n  lspeed (int): 왼쪽 바퀴 속도. 0 ~ 100.\n  rspeed (int): 오른쪽 바퀴 속도. 0 ~ 100.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.go_backward_speed(80, 80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_left_speed(speed)",summary:"왼쪽으로 휘면서 전진한다 (오른쪽 바퀴만 굴린다).",details:`오른쪽 바퀴만 굴려서 왼쪽으로 큰 호를 그린다. 제자리 회전이 아니라 "왼쪽으로 휘는 곡선"이다.

Args:
  speed (int): 회전 속도. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.go_left_speed(80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_right_speed(speed)",summary:"오른쪽으로 휘면서 전진한다 (왼쪽 바퀴만 굴린다).",details:`왼쪽 바퀴만 굴려서 오른쪽으로 큰 호를 그린다. \`\`go_left_speed\`\`와 짝지어 S자 코스를 만들 수 있다.

Args:
  speed (int): 회전 속도. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.go_right_speed(80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_dir_speed(ldir, lspeed, rdir, rspeed)",summary:"두 바퀴의 방향과 속도를 따로 지정한다 — 자유도가 가장 높은 속도 명령.",details:'왼·오 바퀴 각각에 대해 "앞/뒤" 방향과 속도를 따로 정한다. 양쪽을 반대 방향, 같은 속도로 돌리면 제자리 회전이 된다.\n\nArgs:\n  ldir (str): 왼쪽 바퀴 방향. ``"f"`` 앞으로 / ``"b"`` 뒤로.\n  lspeed (int): 왼쪽 바퀴 속도. 0 ~ 100.\n  rdir (str): 오른쪽 바퀴 방향. ``"f"`` / ``"b"``.\n  rspeed (int): 오른쪽 바퀴 속도. 0 ~ 100.\n\nReturns:\n  None\n\n제자리 시계 방향 회전 = 왼쪽 ``"f"``, 오른쪽 ``"b"`` (같은 속도).',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 제자리에서 시계 방향 회전
bot.go_dir_speed("f", 80, "b", 80)
bot.delay(1.5)
bot.stop()

bot.close()`}],entriesAfter:[{name:"예제: 앞으로 2초 가기",summary:"두 바퀴를 같은 속도로 굴려 2초 동안 직진한 뒤 멈춥니다.",details:`go_forward_speed는 모터를 "켜기만" 합니다. stop()을 부르기 전까지 계속 굴러가므로, 원하는 시간만큼 delay로 기다린 다음 멈춰야 합니다.

[1] from pibot import KamibotPi
   카미봇 클래스를 불러옵니다.

[2] bot = KamibotPi("COM85")
   카미봇 객체를 만듭니다.

[4] bot.go_forward_speed(100, 100)
   왼·오 바퀴를 모두 속도 100으로 앞으로 굴립니다. 같은 속도라서 똑바로 직진합니다.

[5] bot.delay(2)
   2초 동안 그대로 굴러가도록 기다립니다. 이 시간이 곧 이동 시간입니다.

[6] bot.stop()
   두 모터를 멈춥니다. 이 줄이 없으면 카미봇이 계속 직진합니다.

[7] bot.close()
   시리얼 포트를 닫고 종료합니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 두 바퀴를 같은 속도로 굴려 직진합니다.
# go_forward_speed는 모터를 켜기만 함 — stop()을 부를 때까지 계속 동작.
bot.go_forward_speed(100, 100)
bot.delay(2)   # 2초 동안 계속 진행
bot.stop()     # 모터 끄기

bot.close()`},{name:"예제: 뒤로 2초 가기",summary:"두 바퀴를 같은 속도로 굴려 2초 동안 후진한 뒤 멈춥니다.",details:`"앞으로 2초 가기"와 똑같은 패턴이고, go_forward_speed만 go_backward_speed로 바뀐 것입니다.
이렇게 한 단어만 바꿔서 동작이 달라지는 것을 직접 확인해 보세요.

[4] bot.go_backward_speed(100, 100)
   왼·오 바퀴를 모두 속도 100으로 뒤로 굴립니다.

[5] bot.delay(2)
   2초 동안 그대로 후진합니다.

[6] bot.stop()
   두 모터를 멈춥니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# "앞으로 2초 가기" 예제와 같은 패턴이며,
# 명령만 go_forward_speed에서 go_backward_speed로 바뀝니다.
bot.go_backward_speed(100, 100)
bot.delay(2)
bot.stop()

bot.close()`},{name:"예제: 제자리에서 돌기",summary:"왼쪽 바퀴는 앞으로, 오른쪽 바퀴는 뒤로 굴려 제자리에서 회전합니다.",details:`두 바퀴를 같은 속도로 "서로 반대 방향"으로 굴리면 카미봇은 앞으로 나아가지 않고 제자리에서 빙글 돌게 됩니다. go_dir_speed 한 줄이면 됩니다.

[4] bot.go_dir_speed("f", 100, "b", 100)
   왼쪽: "f"(앞으로) 속도 100, 오른쪽: "b"(뒤로) 속도 100.
   두 바퀴가 반대로 돌기 때문에 몸체가 자리를 떠나지 않고 회전합니다.

[5] bot.delay(2)
   2초 동안 회전을 유지합니다. 시간을 늘리면 더 많이 돕니다.

[6] bot.stop()
   회전을 멈춥니다.

※ 반대 방향으로 돌리고 싶으면 ldir과 rdir을 서로 바꾸면 됩니다 (예: "b", 100, "f", 100).`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 제자리 회전: 왼쪽 바퀴는 앞으로, 오른쪽 바퀴는 뒤로.
# 두 바퀴가 같은 속도로 반대 방향으로 돌면
# 자리를 떠나지 않고 몸체가 회전합니다.
bot.go_dir_speed("f", 100, "b", 100)
bot.delay(2)   # 2초 동안 회전
bot.stop()

bot.close()`},{name:"예제: S자로 움직이기",summary:"왼쪽 커브와 오른쪽 커브를 번갈아가며 진행해 S자 모양으로 이동합니다.",details:`S자 곡선은 "왼쪽으로 휘기 → 오른쪽으로 휘기"를 번갈아 한 묶음입니다.
go_left_speed는 왼쪽으로, go_right_speed는 오른쪽으로 휘게 합니다(한쪽 바퀴만 굴림).
반복문(for)으로 두 동작을 교대시키면 자연스럽게 S 모양 경로가 만들어집니다.

[4] T = 1.0
   한 커브의 지속 시간(초). 값을 키우면 큰 S, 줄이면 작은 S가 됩니다.

[6] for _ in range(2):
   "왼쪽 커브 + 오른쪽 커브" 한 쌍을 2번 반복합니다 (총 S 두 번).

[7] bot.go_left_speed(100)
   왼쪽으로 휘게 굴립니다.

[8] bot.delay(T)
   T초 동안 왼쪽 커브를 유지합니다.

[9] bot.go_right_speed(100)
   곧이어 오른쪽으로 휘게 굴립니다.

[10] bot.delay(T)
   T초 동안 오른쪽 커브를 유지합니다.

[12] bot.stop()
   마지막 커브가 끝나면 두 모터를 멈춥니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# S자 곡선 = "왼쪽 커브 → 오른쪽 커브"를 반복.
# go_left_speed는 왼쪽으로(한쪽 바퀴만 굴림),
# go_right_speed는 오른쪽으로 휘게 합니다.
T = 1.0  # 한 커브의 지속 시간(초) — T가 크면 큰 S

for _ in range(2):
    bot.go_left_speed(100)   # 왼쪽으로 휘기
    bot.delay(T)
    bot.go_right_speed(100)  # 오른쪽으로 휘기
    bot.delay(T)

bot.stop()
bot.close()`}]},{id:"precision",title:"6. 정밀 제어 (cm/초/스텝)",description:"단위(cm·초·스텝)나 각도를 지정해 정확하게 이동",icon:"straighten",entries:[{name:"bot.move_forward_unit(value, opt, speed)",summary:"단위(cm·초·스텝)를 지정해 앞으로 정확하게 이동한다.",details:'시간 기반(``delay``)이 아니라 펌웨어가 단위에 맞게 거리를 보장한다. 다 가면 자동으로 멈추므로 ``stop()``을 따로 부를 필요가 없다.\n\nArgs:\n  value (int): 이동값.\n  opt (str): ``"-l"`` 길이(cm) / ``"-t"`` 시간(초) / ``"-s"`` 스텝수.\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 정확히 20cm 직진
bot.move_forward_unit(20, "-l", 50)

bot.close()`},{name:"bot.move_backward_unit(value, opt, speed)",summary:"단위(cm·초·스텝)를 지정해 뒤로 정확하게 이동한다.",details:'``move_forward_unit``의 후진 버전. 다 가면 자동으로 멈춘다.\n\nArgs:\n  value (int): 이동값.\n  opt (str): ``"-l"`` cm / ``"-t"`` 초 / ``"-s"`` 스텝.\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.move_backward_unit(20, "-l", 50)

bot.close()`},{name:"bot.move_left_unit(value, opt, speed)",summary:"왼쪽으로 단위만큼 평행 이동(스트레이프)한다.",details:'두 바퀴를 다른 방향으로 굴려 본체가 왼쪽으로 미끄러지듯 움직인다. 회전이 아니라 측면 이동이다.\n\nArgs:\n  value (int): 이동값.\n  opt (str): ``"-l"`` cm / ``"-t"`` 초 / ``"-s"`` 스텝.\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.move_left_unit(10, "-l", 50)

bot.close()`},{name:"bot.move_right_unit(value, opt, speed)",summary:"오른쪽으로 단위만큼 평행 이동(스트레이프)한다.",details:'``move_left_unit``의 반대 방향 버전.\n\nArgs:\n  value (int): 이동값.\n  opt (str): ``"-l"`` cm / ``"-t"`` 초 / ``"-s"`` 스텝.\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.move_right_unit(10, "-l", 50)

bot.close()`},{name:"bot.turn_left_speed(value, speed)",summary:"제자리에서 왼쪽으로 지정한 각도만큼 회전한다.",details:`본체를 떠나지 않고 왼쪽으로 회전한다. 회전이 끝나면 자동으로 멈춘다.

Args:
  value (int): 회전 각도(도).
  speed (int): 회전 속도. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_left_speed(90, 50)   # 왼쪽 90°

bot.close()`},{name:"bot.turn_right_speed(value, speed)",summary:"제자리에서 오른쪽으로 지정한 각도만큼 회전한다.",details:"``turn_left_speed``의 반대 방향. 도형 그리기에 자주 쓰인다 — 정n각형에서는 매 코너에서 ``360 / n`` 도씩 회전.\n\nArgs:\n  value (int): 회전 각도(도).\n  speed (int): 회전 속도. 0 ~ 100.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_right_speed(90, 50)   # 오른쪽 90°

bot.close()`},{name:"bot.move_step(ldir, lstep, rdir, rstep)",summary:"두 바퀴 모터의 방향과 스텝수를 각각 지정한다 — 곡선·회전을 자유롭게 조합.",details:'한쪽은 앞으로 200스텝, 다른 쪽은 뒤로 100스텝처럼 자유롭게 조합할 수 있다. 양쪽이 같은 방향·같은 스텝이면 직진/후진, 한쪽이 더 많이 돌면 곡선, 서로 반대면 제자리 회전이 된다.\n\nArgs:\n  ldir (str): 왼쪽 바퀴 방향. ``"f"`` / ``"b"``.\n  lstep (int): 왼쪽 바퀴 스텝수.\n  rdir (str): 오른쪽 바퀴 방향. ``"f"`` / ``"b"``.\n  rstep (int): 오른쪽 바퀴 스텝수.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 양쪽 200스텝 → 직진
bot.move_step("f", 200, "f", 200)

bot.close()`},{name:"bot.move_time(ldir, lsec, rdir, rsec)",summary:"두 바퀴 모터의 방향과 작동 시간(초)을 각각 지정한다.",details:'``move_step``의 시간 기반 버전. 양쪽 시간을 똑같이 주면 직진/후진, 한쪽만 길게 주면 그쪽이 더 많이 굴러 곡선이 된다.\n\nArgs:\n  ldir (str): 왼쪽 바퀴 방향. ``"f"`` / ``"b"``.\n  lsec (int | float): 왼쪽 바퀴 작동 시간(초).\n  rdir (str): 오른쪽 바퀴 방향.\n  rsec (int | float): 오른쪽 바퀴 작동 시간(초).\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 양쪽 2초간 전진
bot.move_time("f", 2, "f", 2)

bot.close()`},{name:"bot.turn_continous(dir, speed)",summary:"지정한 방향으로 멈출 때까지 계속 제자리 회전한다.",details:'회전을 켜기만 하는 명령이라 ``stop()``을 부르기 전까지 계속 돈다. 시간 제어가 필요하면 ``delay`` + ``stop`` 조합으로 만든다.\n\nArgs:\n  dir (str): 방향. ``"l"`` 왼쪽 / ``"r"`` 오른쪽.\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_continous("r", 80)
bot.delay(2)
bot.stop()

bot.close()`}],entriesAfter:[{name:"예제 1: 30cm 갔다가 돌아오기",summary:'"-l" 옵션으로 정확히 30cm를 직진하고, 180°로 돌아 다시 출발점으로 돌아옵니다. 단위·각도의 기본을 익히는 첫 예제입니다.',details:`학습 포인트:
  · "-l"은 length(길이) 옵션으로 value를 cm로 해석합니다. ("-t"=초, "-s"=스텝)
  · 속도(speed)는 0~100 사이 값. 50은 중간 속도입니다.
  · turn_right_speed(180, 50) = 제자리에서 반 바퀴(180°) 회전.

코드 흐름:
  1) 앞으로 30cm 이동
  2) 제자리에서 180° 회전
  3) 다시 30cm 이동 → 처음 자리
  4) bot.close()로 통신 포트 닫기

※ 스스로 해보기: 30을 50으로 바꿔보고, 자가 거리 측정한 값과 비교해 보세요. 바닥 재질에 따라 실제 이동 거리가 살짝 달라질 수 있습니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 정확히 30cm 앞으로 이동.
# "-l"은 값(30)이 거리(센티미터, length) 단위라는 뜻.
# 속도 50은 적당한 중간 속도(0-100).
bot.move_forward_unit(30, "-l", 50)

# 제자리에서 180° 회전 → 출발점 방향을 다시 향함.
bot.turn_right_speed(180, 50)

# 다시 앞으로 — 출발 지점으로 돌아갑니다.
bot.move_forward_unit(30, "-l", 50)

bot.close()`},{name:"예제 2: 정사각형 그리기",summary:"한 변 20cm짜리 정사각형을 for 반복문으로 그립니다. 변 길이와 속도는 변수로 빼서 한 곳만 바꿔도 크기/속도가 바뀌도록 만들었습니다.",details:`학습 포인트:
  · 정사각형은 변 4개 + 직각(90°) 4개로 이루어집니다.
  · "직진 → 90° 회전"을 4번 반복하면 출발점으로 돌아옵니다.
  · 반복되는 패턴은 항상 for 루프로 묶는 습관을 들이세요.

코드 흐름:
  · SIDE / SPEED 두 상수를 위에 모아둠 → 한 군데만 바꾸면 전체가 바뀜
  · for _ in range(4): 같은 동작을 4번 반복
  · 각 반복: 앞으로 SIDE cm → 오른쪽 90° 회전

※ 스스로 해보기:
  · SIDE = 10으로 줄이면 작은 사각형, SIDE = 40이면 큰 사각형.
  · turn_right_speed → turn_left_speed로 바꾸면 어떻게 될까요? (반시계 방향)`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 20    # 한 변의 길이(cm)
SPEED = 50   # 0 ~ 100

# 정사각형은 같은 길이의 변 4개와 직각(90°) 모서리 4개로 이루어집니다.
# 패턴: 한 변 직진 → 오른쪽 90° 회전. 이를 4번 반복.
for _ in range(4):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(90, SPEED)

bot.close()`},{name:"예제 3: 정삼각형 그리기 (외각 개념)",summary:"한 변 25cm짜리 정삼각형을 그립니다. 핵심은 회전 각도가 60°가 아니라 120°라는 것!",details:`학습 포인트 — "외각"이 핵심입니다:
  · 카미봇은 코너에서 "내각(60°)"이 아니라 "외각"만큼 회전합니다.
  · 정n각형의 외각 = 360 / n
      - 정삼각형: 360 / 3 = 120°
      - 정사각형: 360 / 4 =  90°  (예제 2)
      - 정육각형: 360 / 6 =  60°
  · n각형 한 바퀴를 다 돌면 회전 합이 360° = 한 바퀴라는 사실에서 나옵니다.

코드 흐름은 예제 2와 거의 똑같습니다.
바뀐 곳은 "회전 각도"와 "반복 횟수"뿐입니다. 두 코드를 나란히 비교해 보세요.

※ 스스로 해보기:
  · TURN = 360 // 5, 반복 5번 → 정오각형
  · TURN = 360 // 6, 반복 6번 → 정육각형`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 25
SPEED = 50

# 카미봇은 코너에서 내각이 아니라 "외각"만큼 회전합니다.
# 정n각형의 외각 = 360 / 변의 수.
# 정삼각형 => 360 / 3 = 120°.
SIDES = 3
TURN = 360 // SIDES   # = 120

for _ in range(SIDES):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"예제 4: 5각 별(★) 한 붓 그리기",summary:"연필을 떼지 않고 별을 그리는 방법 그대로, 카미봇이 5개 꼭짓점을 144°씩 꺾으며 별을 그립니다.",details:`학습 포인트 — 왜 144°일까?
  · 별을 한 붓 그리기로 그릴 때, 시작점에 돌아오면 카미봇은 두 바퀴(720°)를 돌게 됩니다.
  · 꼭짓점이 5개이므로 한 점에서 회전 = 720 / 5 = 144°.
  · 정n각형 공식(360 / n)과 다른 이유: 별은 같은 점을 두 번 가로지르며 한 붓에 그리기 때문에 두 바퀴를 돕니다.

코드는 예제 3과 같은 모양입니다 — 회전 각도와 반복 횟수만 다릅니다.
같은 패턴(직진 → 회전 → 반복)으로 도형이 얼마나 다양해지는지 비교해 보세요.

※ 스스로 해보기:
  · 7각 별을 그리려면? 점 사이를 두 칸씩 건너뛰면 회전합 = 720°이므로 720 / 7 ≈ 103°.
  · SIDE를 너무 크게 하면 공간 부족! 30~40cm 정도가 적당합니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 30
SPEED = 50

# 5각 별은 꼭짓점을 한 칸씩 건너뛰며 한 붓에 그립니다.
# 완성하면 카미봇은 총 720°(두 바퀴)를 회전합니다.
# 720° / 꼭짓점 5개 = 한 점에서 144° 회전.
POINT_TURN = 144

for _ in range(5):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(POINT_TURN, SPEED)

bot.close()`},{name:"예제 5: 두 바퀴 따로 굴려 곡선·회전 만들기",summary:"move_step으로 좌·우 모터 스텝수를 따로 지정해 직진 → 오른쪽 호 → 제자리 회전을 차례대로 시연합니다.",details:`학습 포인트 — move_step의 4개 인자:
  bot.move_step(ldir, lstep, rdir, rstep)
    · ldir/rdir: 왼쪽/오른쪽 모터 방향 ("f" 앞 / "b" 뒤)
    · lstep/rstep: 왼쪽/오른쪽 모터의 스텝 수

세 가지 규칙만 기억하면 됩니다:
  1) 양쪽 같은 방향 + 같은 스텝수  → 똑바로 직진/후진
  2) 한쪽이 더 많이 돌면          → 적게 돈 쪽으로 휘는 곡선
  3) 양쪽이 서로 반대 방향        → 제자리에서 회전

코드는 세 동작을 차례로 보여줍니다:
  · (f200, f200) → 직진
  · (f300, f150) → 왼쪽이 더 많이 돌므로 오른쪽으로 휘는 호
  · (f200, b200) → 왼쪽 앞 + 오른쪽 뒤 → 제자리 시계 방향 회전
delay(0.5)는 동작 사이의 짧은 쉼으로, 카미봇이 다음 명령을 분명히 받게 해줍니다.

※ 스스로 해보기:
  · (f300, f150)을 (f250, f200)으로 바꾸면 호가 더 커집니다(덜 휨).
  · 작은 원을 그리고 싶다면? (f400, f200)을 여러 번 반복해 보세요.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# move_step(왼쪽 방향, 왼쪽 스텝, 오른쪽 방향, 오른쪽 스텝)
# 세 가지 간단한 규칙:
#   1) 같은 방향 + 같은 스텝   -> 직진
#   2) 한쪽이 더 많이 돌면     -> 적게 돈 쪽으로 휘는 곡선
#   3) 서로 반대 방향          -> 제자리에서 회전

# 1) 직진: 두 바퀴 모두 앞으로 200 스텝.
bot.move_step("f", 200, "f", 200)
bot.delay(0.5)

# 2) 오른쪽으로 휘기: 왼쪽 바퀴가 오른쪽보다 더 많이 회전.
bot.move_step("f", 300, "f", 150)
bot.delay(0.5)

# 3) 시계 방향 제자리 회전: 왼쪽 앞 + 오른쪽 뒤.
bot.move_step("f", 200, "b", 200)

bot.close()`}]},{id:"top-motor",title:"7. 탑 모터",description:"상단 스텝 모터(펜대 등)의 각도·시간·회전수 제어",icon:"rotate_right",entries:[{name:"bot.top_motor_degree(dir, value, speed)",summary:"탑 모터를 지정 각도만큼 회전시킨다 (현재 위치 기준 상대 회전).",details:'카미봇 머리에 달린 스텝 모터를 "지금 자리에서 ``value`` 도만큼 더" 돌린다.\n바퀴 모터의 ``"f"/"b"``와 다르게 탑 모터 방향은 ``"l"/"r"``이니 주의.\n\nArgs:\n  dir (str): 회전 방향. ``"l"`` 왼쪽 / ``"r"`` 오른쪽.\n  value (int): 회전 각도(도).\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None\n\n"지금 어디에 있든 정확히 N도 자리로" 이동하려면 ``top_motor_abspos``를 쓴다.',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.top_motor_degree("r", 90, 50)   # 오른쪽 90°
bot.delay(0.5)
bot.top_motor_degree("l", 90, 50)   # 왼쪽 90° → 원위치

bot.close()`},{name:"bot.top_motor_abspos(degree, speed)",summary:"탑 모터를 절대 각도 위치로 이동시킨다 (0°을 기준으로).",details:`"지금 자리에 N도 더해라"가 아니라 "정확히 N도 위치로 이동해라"이다.
여러 번 반복해도 누적 오차가 없다는 게 장점이다.

Args:
  degree (int): 절대 각도. 0 ~ 65000.
  speed (int): 속도. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.top_motor_abspos(180, 50)   # 정확히 180°로
bot.delay(1)
bot.top_motor_abspos(0, 50)     # 정확히 0°로 복귀

bot.close()`},{name:"bot.top_motor_time(dir, value, speed)",summary:"탑 모터를 지정한 시간(초) 동안 회전시킨다.",details:'각도가 아니라 시간 기준으로 돌릴 때 사용. 속도와 시간이 함께 회전량을 결정한다.\n\nArgs:\n  dir (str): 방향. ``"l"`` / ``"r"``.\n  value (int | float): 회전 시간(초).\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.top_motor_time("l", 3, 50)   # 왼쪽으로 3초간 회전

bot.close()`},{name:"bot.top_motor_round(dir, value, speed)",summary:"탑 모터를 지정한 회전수만큼 돌린다 (한 바퀴 = 360°).",details:'각도 대신 "몇 바퀴"로 지정한다. 1을 주면 한 바퀴, 2를 주면 두 바퀴.\n\nArgs:\n  dir (str): 방향. ``"l"`` / ``"r"``.\n  value (int): 회전수(바퀴 수).\n  speed (int): 속도. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.top_motor_round("r", 1, 50)   # 오른쪽으로 한 바퀴

bot.close()`},{name:"bot.top_motor_stop()",summary:"회전 중인 탑 모터를 즉시 멈춘다.",details:"``top_motor_time``처럼 미리 지정한 동작을 중간에 끊고 싶을 때 사용한다.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 5초간 돌리려다 1초 후 강제 정지
bot.top_motor_time("r", 5, 50)
bot.delay(1)
bot.top_motor_stop()

bot.close()`}],entriesAfter:[{name:"예제 1: 펜 90° 들어올렸다가 다시 내리기",summary:"오른쪽으로 90° 돌렸다가, 잠깐 쉰 뒤 왼쪽으로 90° 돌려서 정확히 처음 자리로 돌아옵니다. 탑 모터를 처음 다룰 때 가장 안전한 출발점입니다.",details:`학습 포인트:
  · top_motor_degree(dir, value, speed) — 방향, 각도, 속도 3가지를 정해줍니다.
  · dir = "r" 오른쪽 / "l" 왼쪽. (바퀴 모터의 "f"/"b"와 다르니 주의!)
  · 같은 각도를 반대 방향으로 돌리면 → 원래 위치로 돌아옵니다.
  · 두 동작 사이에 delay(0.5)를 두면 모터가 충분히 멈춘 뒤 다음 명령을 받습니다.

코드 흐름:
  1) 오른쪽으로 90° 회전 (펜 들어올리기 같은 동작)
  2) 0.5초 쉬기
  3) 왼쪽으로 90° 회전 → 처음 자세 복귀

※ 스스로 해보기:
  · 90을 45나 180으로 바꿔보기 — 회전량이 그대로 보입니다.
  · 속도(50)를 20으로 줄이면 천천히, 100으로 올리면 빠르게 돕니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 탑 모터를 오른쪽으로 90° 회전 (예: 펜 들어올리기).
# 인자: 방향 ("r"/"l"), 각도(도), 속도 (0-100).
bot.top_motor_degree("r", 90, 50)

# 다음 동작 전에 모터가 완전히 멈추도록 잠깐 쉽니다.
bot.delay(0.5)

# 왼쪽으로 90° 되돌리기 — 원래 시작 위치로 복귀.
bot.top_motor_degree("l", 90, 50)

bot.close()`},{name:"예제 2: 절대 위치로 정확히 이동하기",summary:'top_motor_abspos는 "지금 어디에 있든 → 정확히 이 각도로" 이동합니다. 0° → 180° → 0°을 순서대로 시연합니다.',details:`학습 포인트 — 상대 회전 vs 절대 위치:
  · top_motor_degree("r", 90, ...) = "지금 자리에서 오른쪽으로 90° 더" (상대)
  · top_motor_abspos(180, ...)     = "0°을 기준으로 180° 위치로 이동" (절대)
  · 절대 위치는 누적 오차가 없어, 여러 번 반복해도 항상 같은 자리에 멈춥니다.
  · 각도 범위는 0~65000까지 가능합니다.

코드 흐름:
  1) abspos(180) → 절대 180° 자리로 회전
  2) 1초 쉬기
  3) abspos(0)   → 다시 0° 자리(시작점)로 복귀

※ 스스로 해보기:
  · 180을 90, 270 등으로 바꾸며 차이를 비교해 보기.
  · 같은 abspos 값을 두 번 연속 부르면? — 이미 그 자리이므로 거의 안 움직입니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# abspos = "absolute position(절대 위치)" — 지금 어디에 있든 정확히 이 각도로 이동.
# 현재 자세에 각도를 더하는 top_motor_degree와 다릅니다.
bot.top_motor_abspos(180, 50)

bot.delay(1)

# 시작 기준점(0°)으로 복귀.
bot.top_motor_abspos(0, 50)

bot.close()`},{name:"예제 3: 좌우로 5번 흔들기 (반복문 활용)",summary:"for 반복문으로 오른쪽 30° → 왼쪽 30°을 5번 반복합니다. 매번 좌우가 짝을 이루므로 결국 처음 자리로 돌아옵니다.",details:`학습 포인트:
  · "오른쪽 N° → 왼쪽 N°"이 짝지어 반복되면 누적 회전이 0이 됩니다.
  · 그래서 끝나도 시작 자세 그대로! — 반복 시연·테스트에 유용합니다.
  · ANGLE / TIMES 같은 상수는 위에 모아두면 한 군데만 바꿔도 동작이 달라집니다.
  · 동작 사이에 delay(0.3)을 둬서 흔들리는 모습이 잘 보이게 합니다.

코드 흐름:
  · range(TIMES) 만큼 반복
  · 한 번 반복할 때: 오른쪽 ANGLE° → 잠깐 쉼 → 왼쪽 ANGLE° → 잠깐 쉼

※ 스스로 해보기:
  · TIMES = 10으로 늘려 더 오래 흔들어 보기.
  · ANGLE을 10으로 줄이면 미세하게 떨리는 느낌, 60으로 키우면 큰 스윙.
  · "왼쪽 → 오른쪽" 순서로 바꾸면? 동작은 같지만 출발 방향이 반대가 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

ANGLE = 30   # 한 번 흔들리는 각도(도)
TIMES = 5    # 좌우 왕복 횟수
SPEED = 60

# 매 반복마다 같은 각도로 오른쪽 → 왼쪽으로 흔들리므로,
# 모터는 결국 처음 자리에서 끝납니다.
for _ in range(TIMES):
    bot.top_motor_degree("r", ANGLE, SPEED)
    bot.delay(0.3)
    bot.top_motor_degree("l", ANGLE, SPEED)
    bot.delay(0.3)

bot.close()`}]},{id:"shapes",title:"8. 도형 그리기",description:"삼각형, 사각형, 별, 원, 호 등 미리 만들어 둔 도형 자동 그리기",icon:"category",entries:[{name:"bot.draw_tri(len)",summary:"한 변의 길이를 지정해 삼각형을 그린다.",details:`직진 + 외각(120°) 회전을 펌웨어가 자동으로 묶어 한 바퀴 그려준다. 그리기가 끝나면 시작점·시작 방향으로 돌아온다.

Args:
  len (int): 한 변의 길이(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_tri(20)   # 한 변 20cm 삼각형

bot.close()`},{name:"bot.draw_rect(len)",summary:"한 변의 길이를 지정해 정사각형을 그린다.",details:`직진 + 90° 회전을 4번 반복하는 동작을 한 줄로 캡슐화한 것. 그리기가 끝나면 시작점으로 돌아온다.

Args:
  len (int): 한 변의 길이(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_rect(20)   # 한 변 20cm 사각형

bot.close()`},{name:"bot.draw_penta(len)",summary:"한 변의 길이를 지정해 정오각형을 그린다.",details:`외각 \`\`360 / 5 = 72°\`\`로 5번 회전한다. 끝나면 시작점으로 돌아온다.

Args:
  len (int): 한 변의 길이(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_penta(20)

bot.close()`},{name:"bot.draw_hexa(len)",summary:"한 변의 길이를 지정해 정육각형을 그린다.",details:`외각 \`\`360 / 6 = 60°\`\`로 6번 회전한다. 끝나면 시작점으로 돌아온다.

Args:
  len (int): 한 변의 길이(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_hexa(20)

bot.close()`},{name:"bot.draw_star(len)",summary:"한 변의 길이를 지정해 5각 별(★)을 한 붓 그리기로 그린다.",details:`꼭짓점에서 144°씩 꺾으며 5번 직진한다. 한 붓 그리기라 카미봇이 총 720°(두 바퀴)를 돌게 된다.

Args:
  len (int): 한 변의 길이(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_star(20)

bot.close()`},{name:"bot.draw_circle(len)",summary:"반지름을 지정해 원을 그린다.",details:`두 바퀴 속도 차로 호를 만든 뒤 한 바퀴(360°) 돌아 원을 완성한다. 그리기가 끝나면 시작점으로 돌아온다.

Args:
  len (int): 반지름(cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_circle(15)   # 반지름 15cm 원

bot.close()`},{name:'bot.draw_semicircle(len, side="l")',summary:"반원(180° 호)을 그린다. 끝나도 시작점으로 돌아오지 않는다.",details:'왼쪽/오른쪽으로 휘는 반원을 그린다. ``draw_circle``과 달리 끝났을 때 카미봇이 반원의 반대편 끝에 가 있다는 점에 주의.\n"왼쪽 반원 → 오른쪽 반원" 패턴으로 부르면 자연스럽게 S자 곡선이 된다.\n\nArgs:\n  len (int): 반지름(cm).\n  side (str): 휘는 방향. ``"l"`` 왼쪽 / ``"r"`` 오른쪽.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# S자 곡선
bot.draw_semicircle(15, "l")
bot.draw_semicircle(15, "r")

bot.close()`},{name:"bot.draw_arc(radius, value, mode=0)",summary:"시간 또는 각도 단위로 호(弧)를 그린다.",details:'반지름과 함께 "얼마나 그릴지"를 시간(초) 또는 각도(도)로 지정한다.\n``mode=0``일 때는 ``value`` 가 그리는 시간(초), ``mode=1``일 때는 호의 중심각(도)이 된다.\n\nArgs:\n  radius (int): 반지름(cm).\n  value (int): mode에 따라 시간(초) 또는 각도(도).\n  mode (int): ``0`` 시간 기준 / ``1`` 각도 기준. 기본 0.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.draw_arc(15, 2, 0)    # 반지름 15cm, 2초간 호 그리기
bot.delay(0.5)
bot.draw_arc(15, 90, 1)   # 반지름 15cm, 90° 호 그리기

bot.close()`}],entriesAfter:[{name:"예제 1: 도형 4총사 (삼·사·오·육각형 줄지어 그리기)",summary:"draw_tri / draw_rect / draw_penta / draw_hexa를 차례로 호출해 변의 수가 다른 네 가지 도형을 한 줄에 늘어놓습니다.",details:`학습 포인트:
  · draw_xxx(len) 함수들은 한 변(또는 반지름) 길이만 정해주면 도형 한 개를 자동으로 그려줍니다.
  · 도형 그리기가 끝나면 카미봇은 시작점·시작 방향으로 돌아옵니다 — 그래서 다음 도형 전에 옆으로 이동시켜 줘야 도형이 겹치지 않습니다.
  · 변의 수가 늘어날수록(3 → 4 → 5 → 6) 도형은 점점 원에 가까워집니다.

코드 흐름:
  1) 삼각형(변 20cm) 그리기
  2) 앞으로 25cm 이동 → 다음 자리 비우기
  3) 사각형 그리기 → 다시 이동
  4) 같은 방식으로 오각형, 육각형까지

※ 스스로 해보기:
  · SIDE를 15로 줄이면 작게, 30으로 키우면 크게 그려집니다.
  · 마지막 줄에 draw_circle(10)을 더 붙여서 "다각형 → 원"의 흐름을 직접 확인해 보세요.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 20      # 한 변의 길이(cm)
SPEED = 50
GAP = 25       # 도형 사이 간격

# 1) 삼각형: 변 3개
bot.draw_tri(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 2) 사각형: 변 4개
bot.draw_rect(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 3) 오각형: 변 5개
bot.draw_penta(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 4) 육각형: 변 6개 — 벌써 원에 가까워 보입니다!
bot.draw_hexa(SIDE)

bot.close()`},{name:"예제 2: 사각형 풍차 (회전을 반복해 꽃 모양 만들기)",summary:"사각형 한 개를 그릴 때마다 제자리에서 30°씩 회전합니다. 12번 반복하면 360°를 한 바퀴 다 돌아 사각형 12개가 겹친 풍차/꽃 모양이 됩니다.",details:`학습 포인트 — "도형 + 회전"의 조합:
  · draw_rect는 한 번 그리면 시작점·시작 각도로 돌아옵니다.
  · 매번 30°씩 더 돌면 다음 사각형은 30°만큼 기울어진 자리에서 그려집니다.
  · 360 / 30 = 12 → 정확히 12번 반복하면 한 바퀴를 채워 패턴이 닫힙니다.

코드 흐름:
  · for _ in range(12): 같은 동작을 12번
  · 한 번 반복: 사각형 그리기 → 오른쪽으로 30° 회전

※ 스스로 해보기:
  · TURN을 60°(반복 6번), 45°(반복 8번)로 바꿔 꽃잎 수를 조절해 보세요.
  · draw_rect를 draw_tri로 바꾸면 삼각형 풍차가 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 15
SPEED = 50
TURN = 30                # 도형 사이마다 회전할 각도(도)
PETALS = 360 // TURN     # = 12 — 정확히 한 바퀴에 맞음

# 같은 사각형을 여러 번 그리되, 매번 살짝 회전합니다.
# PETALS번 반복하면 누적 회전이 360° → 꽃 완성.
for _ in range(PETALS):
    bot.draw_rect(SIDE)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"예제 3: 점점 커지는 삼각형 (리스트로 크기 바꾸기)",summary:"변 길이를 10, 15, 20, 25로 키워가며 삼각형 4개를 차례로 그립니다. 같은 함수에 다른 값을 넣으면 결과가 어떻게 달라지는지 한눈에 보여줍니다.",details:`학습 포인트 — "리스트로 값을 차례차례 넘겨주기":
  · 같은 동작을 다른 값으로 반복할 때는 리스트가 깔끔합니다.
  · sizes = [10, 15, 20, 25]처럼 미리 적어두고 for로 하나씩 꺼내 사용.
  · 값을 추가/변경하기도 쉬워, 코드 본문은 거의 손대지 않고 결과만 바꿀 수 있습니다.

코드 흐름:
  · sizes 리스트를 만든다
  · for size in sizes: 삼각형(size) 그리기 → 옆으로 이동

※ 스스로 해보기:
  · sizes = [25, 20, 15, 10]으로 뒤집으면 점점 작아지는 효과가 됩니다.
  · draw_tri 자리에 draw_penta를 넣으면 오각형 4개 시리즈로 바뀝니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SPEED = 50
GAP = 30

# 변 길이 리스트 — 같은 도형, 다른 크기.
sizes = [10, 15, 20, 25]

for size in sizes:
    bot.draw_tri(size)                        # 이 크기로 삼각형 그리기
    bot.move_forward_unit(GAP, "-l", SPEED)   # 다음 자리로 이동

bot.close()`},{name:"예제 4: 곡선 길 만들기 (원과 반원 조합)",summary:"draw_circle로 원 하나를 그리고, 그다음 draw_semicircle을 좌·우로 번갈아 호출해 S자 모양 길을 이어 그립니다.",details:`학습 포인트 — 곡선 도형 함수들:
  · draw_circle(r)         — 반지름 r짜리 원 한 개. 시작점으로 돌아옵니다.
  · draw_semicircle(r, "l") — 왼쪽으로 휘는 반원
  · draw_semicircle(r, "r") — 오른쪽으로 휘는 반원
  · 반원은 끝나도 시작점으로 돌아오지 않고, 카미봇이 반대편 끝에 가 있습니다.
  · "l"과 "r"을 번갈아 호출하면 S자(또는 물결) 모양 길이 만들어집니다.

코드 흐름:
  1) 원 한 개 그리기 → 출발점 그대로
  2) 살짝 직진해 자리 비우기
  3) 왼쪽 반원 → 오른쪽 반원 → 왼쪽 반원 (S자 패턴)

※ 스스로 해보기:
  · R 값을 10이나 20으로 바꾸며 곡률(휘는 정도)을 비교해 보세요.
  · "l", "r"을 모두 같은 글자로 통일하면 같은 방향으로 큰 원을 도는 길이 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

R = 12          # 원과 반원 모두 같은 반지름
SPEED = 50

# 1) 원 한 개 — 카미봇은 시작점으로 돌아옵니다.
bot.draw_circle(R)

# 곡선이 원과 겹치지 않도록 살짝 앞으로 이동.
bot.move_forward_unit(20, "-l", SPEED)

# 2) S자 곡선: 왼쪽 반원 → 오른쪽 반원 → 왼쪽 반원.
# 반원은 시작점으로 돌아오지 않고 반대편에서 끝납니다.
bot.draw_semicircle(R, "l")
bot.draw_semicircle(R, "r")
bot.draw_semicircle(R, "l")

bot.close()`},{name:"예제 5: 별 3개 일렬로 (도형 + 이동의 반복)",summary:"draw_star로 별을 그린 뒤 옆으로 살짝 이동, 다시 별을 그립니다. for 반복문으로 같은 동작을 3번 반복하면 별 3개가 일렬로 늘어섭니다.",details:`학습 포인트 — "그리기 + 이동" 한 묶음을 반복하기:
  · draw_star(SIDE)는 별 한 개를 그리고 시작점으로 돌아옵니다.
  · 별 사이에 간격을 두려면 별을 그린 뒤 직진으로 GAP만큼 이동해 줘야 합니다.
  · "도형 그리기 + 이동"을 한 묶음으로 보고 for로 반복하면, 같은 도형이 일정 간격으로 반복되는 패턴이 됩니다.

코드 흐름:
  · for _ in range(STARS): 별 그리기 → 앞으로 GAP cm 이동

※ 스스로 해보기:
  · STARS = 5로 늘려 별을 더 많이 그리려면 GAP·SIDE를 더 작게 잡아야 공간 안에 들어갑니다.
  · 매 반복마다 turn_right_speed(60, SPEED)를 추가하면 별이 부채꼴로 펼쳐집니다.
  · draw_star를 draw_penta로 바꾸면 오각형이 일렬로 늘어선 모양이 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SIDE = 12       # 별의 한 변 길이(cm)
GAP = 25        # 별 사이 간격
STARS = 3
SPEED = 50

# 패턴: 별 그리기 → 옆으로 이동 → 다음 별.
for _ in range(STARS):
    bot.draw_star(SIDE)
    bot.move_forward_unit(GAP, "-l", SPEED)

bot.close()`}]},{id:"sensors",title:"9. 센서",description:"물체·라인·컬러 센서 값 읽기 — 카미봇이 보고 있는 세상을 코드로 가져오기",icon:"sensors",entries:[{name:"bot.get_object_detect(opt=True)",summary:"좌·우 물체 감지 센서 값을 한 번에 읽어 (left, right) 튜플로 돌려준다.",details:"본체 앞쪽 좌·우 IR 센서 값을 동시에 읽는다. 각 값은 정수형으로, 가까이 물체가 있으면 큰 값(또는 1)이 나온다.\n\nArgs:\n  opt (bool): ``True``이면 측정 후에도 모터/LED를 그대로 두고, ``False``이면 명령 후 정지시키는 옵션.\n\nReturns:\n  tuple[int, int]: ``(left, right)`` 좌·우 센서 값.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 좌·우 물체 감지 값을 5초 동안 매 0.5초마다 읽기
for _ in range(10):
    left, right = bot.get_object_detect()
    print("left =", left, "right =", right)
    bot.delay(0.5)

bot.close()`},{name:"bot.get_line_sensor(opt=True)",summary:"왼쪽·중앙·오른쪽 라인 센서 값을 한 번에 읽어 (left, center, right) 튜플로 돌려준다.",details:"바닥에 있는 검은 라인 위에 센서가 있으면 ``1``, 흰 바닥에 있으면 ``0`` 으로 읽힌다(보드/조명에 따라 반대일 수 있다).\n세 값을 함께 비교해 라인이 어느 쪽에 있는지 판단하는 게 일반적이다.\n\nArgs:\n  opt (bool): ``True``/``False`` 옵션 (동작 유지/정지).\n\nReturns:\n  tuple[int, int, int]: ``(left, center, right)``.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 5초 동안 0.5초마다 라인 센서 읽기
for _ in range(10):
    l, c, r = bot.get_line_sensor()
    print("L/C/R =", l, c, r)
    bot.delay(0.5)

bot.close()`},{name:"bot.get_color_sensor(opt=True)",summary:"컬러 센서로 색상 인덱스(int) 한 개를 읽어 돌려준다.",details:"센서가 보고 있는 색을 ``turn_led_idx``와 같은 색 인덱스(0=빨강, 1=주황, … 7=흰색)로 분류해 정수 한 개로 돌려준다.\n인식 가능한 색 외라면 보드 펌웨어가 가장 가까운 색의 인덱스로 보고한다.\n\nArgs:\n  opt (bool): ``True``/``False`` 옵션.\n\nReturns:\n  int: 색상 인덱스 (0~8).",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 종이 색을 1초 간격으로 10번 읽어 출력
for _ in range(10):
    color = bot.get_color_sensor()
    print("color index =", color)
    bot.delay(1)

bot.close()`},{name:"bot.get_color_elements(opt=True)",summary:"컬러 센서가 보고 있는 RGB 값을 (r, g, b) 튜플로 돌려준다.",details:"인덱스가 아니라 RGB 원본 값을 그대로 받고 싶을 때 사용한다. 받은 값을 그대로 ``turn_led``에 넘기면 카미봇이 본 색을 LED로 따라할 수 있다.\n\nArgs:\n  opt (bool): ``True``/``False`` 옵션.\n\nReturns:\n  tuple[int, int, int]: ``(r, g, b)`` 각 채널 0~255.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 센서가 본 색을 그대로 LED에 출력 (10초)
for _ in range(10):
    r, g, b = bot.get_color_elements()
    print("RGB =", r, g, b)
    bot.turn_led(r, g, b)
    bot.delay(1)

bot.turn_led(0, 0, 0)
bot.close()`}],entriesAfter:[{name:"예제 1: 물체를 만나면 멈추기 (장애물 감지)",summary:"카미봇이 천천히 직진하면서 앞쪽 물체 센서를 계속 확인합니다. 좌·우 어느 쪽이든 물체가 감지되면 즉시 멈추고 빨간 LED를 켭니다.",details:`학습 포인트 — "센서를 반복해서 확인하기":
  · get_object_detect()는 (left, right) 두 값을 한 번에 돌려줍니다.
  · 값이 1(또는 0이 아닌 값)이면 "물체가 가까이 있다"는 뜻입니다.
  · while True 루프 안에서 센서를 계속 읽으면, 매 순간의 상황에 맞춰 동작을 결정할 수 있습니다.
  · or 연산: "왼쪽이 감지되거나 OR 오른쪽이 감지되면" → 둘 중 하나만 참이어도 멈춥니다.

코드 흐름:
  1) 초록 LED 켜기 (안전 이동 중)
  2) 천천히 직진 시작
  3) while 루프: 센서값을 읽어 물체가 있으면 break
  4) 모터 정지 + 빨간 LED + 비프음

※ 스스로 해보기:
  · \`or\`를 \`and\`로 바꾸면 양쪽 모두 감지될 때만 멈춥니다 — 좁은 통로 통과용.
  · \`delay(0.05)\` 값을 줄이면 더 빠르게 반응하지만 CPU 부하가 늘어납니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SPEED = 30   # 천천히 직진하는 속도 (0-100)

try:
    bot.turn_led(0, 255, 0)              # 초록 = "안전, 이동 중"
    bot.go_forward_speed(SPEED, SPEED)   # 두 바퀴 앞으로

    while True:
        left, right = bot.get_object_detect()
        if left or right:                # 어느 쪽이든 물체 감지
            break
        bot.delay(0.05)                  # 초당 약 20번 확인

    bot.stop()
    bot.turn_led(255, 0, 0)              # 빨강 = "정지, 장애물!"
    bot.beep()
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"예제 2: 컬러 센서가 본 색을 LED로 그대로 따라하기",summary:"get_color_elements로 (R, G, B) 값을 읽어 turn_led에 그대로 넘겨주면 카미봇이 본 색을 LED로 똑같이 표현합니다. 종이 색을 바꾸면 LED 색도 바뀝니다.",details:`학습 포인트 — "센서값을 다른 함수의 인자로 흘려보내기":
  · get_color_elements()는 (r, g, b) 튜플을 돌려줍니다.
  · 그 값을 변수로 받아 turn_led(r, g, b)에 그대로 넘기면 끝.
  · 별도의 변환·계산 없이 "센서 → 출력"으로 값이 흐르는 가장 단순한 패턴입니다.
  · 1초 간격으로 반복하면 종이를 바꿀 때마다 LED가 따라옵니다.

코드 흐름:
  · for 반복문으로 20번 측정 (총 약 20초)
  · 매번: RGB 읽기 → 콘솔에 출력 → LED 같은 색으로 켜기 → 1초 대기

※ 스스로 해보기:
  · \`for _ in range(20)\`을 \`while True\`로 바꾸면 무한 반복.
  · turn_led(r, g, b)를 turn_led(g, r, b)로 바꾸면 빨강·초록이 뒤바뀐 "색맹 모드"가 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

try:
    for _ in range(20):
        # 컬러 센서가 지금 보고 있는 RGB를 읽습니다.
        r, g, b = bot.get_color_elements()
        print("sensor RGB =", r, g, b)

        # 같은 값을 그대로 LED에 전달합니다.
        bot.turn_led(r, g, b)

        bot.delay(1)
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"예제 3: 색깔 신호등 (색상 인덱스로 다른 동작)",summary:"get_color_sensor가 돌려주는 색상 인덱스로 if/elif 분기. 빨강이면 정지, 초록이면 직진, 파랑이면 제자리 회전 — 종이 신호등으로 카미봇 조종.",details:`학습 포인트 — "if/elif/else로 분기 처리":
  · get_color_sensor()는 색상 인덱스 한 개를 돌려줍니다.
  · LED 인덱스 표(0:red, 1:orange, 2:yellow, 3:green, 4:blue, 5:skyblue, 6:purple, 7:white)와 동일.
  · "이 값이면 이 동작" 형태의 분기는 if/elif/else가 가장 자연스럽습니다.
  · 매 분기마다 LED도 같은 색으로 켜주면 카미봇이 "지금 무슨 신호를 보고 있는지" 한눈에 확인 가능.

코드 흐름:
  · 30번 반복하며 색을 읽음
  · 0(red): 정지, 3(green): 짧게 직진, 4(blue): 제자리 회전
  · 그 외 색: 아무것도 안 함 (대기)

※ 스스로 해보기:
  · 색을 더 늘려 보세요 — 2(yellow)에서 후진, 6(purple)에서 비프 등.
  · 종이 신호등 카드를 만들어 카미봇 앞에 차례로 보여주면 자동으로 코스를 도는 놀이가 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 색 인덱스 → 의미
RED, GREEN, BLUE = 0, 3, 4

try:
    for _ in range(30):
        color = bot.get_color_sensor()
        print("sensor color index =", color)

        if color == RED:
            bot.stop()
            bot.turn_led_idx(RED)
        elif color == GREEN:
            bot.turn_led_idx(GREEN)
            bot.move_forward_unit(5, "-l", 40)   # 짧게 5cm 직진
        elif color == BLUE:
            bot.turn_led_idx(BLUE)
            bot.turn_right_speed(45, 40)         # 제자리 회전
        else:
            bot.turn_led(0, 0, 0)                # 알 수 없는 색 → LED 끄기

        bot.delay(0.3)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"예제 4: 라인 따라가기 (3센서 라인트레이서)",summary:"왼쪽·중앙·오른쪽 라인 센서를 동시에 보고 미세 좌·우 회전으로 검은 라인을 따라갑니다. 라인이 가운데에 있으면 직진, 한쪽으로 치우치면 그 방향으로 살짝 보정.",details:`학습 포인트 — "다중 센서로 폐루프 제어":
  · get_line_sensor()는 (left, center, right) 세 값을 돌려줍니다.
  · 검은 라인 위에 있는 센서가 1, 흰 바닥 위에 있는 센서가 0이라고 가정.
  · "센서를 보고 → 동작을 정하고 → 다시 센서를 본다"의 짧은 사이클이 폐루프 제어입니다.
  · 미세 회전(turn_left/right_speed의 작은 각도)을 쓰면 부드럽게 라인을 따라갑니다.

제어 규칙:
  · 가운데만 라인 위 → 똑바로 (초록 LED)
  · 왼쪽이 라인 위  → 살짝 왼쪽 (파란 LED)
  · 오른쪽이 라인 위 → 살짝 오른쪽 (노란 LED)
  · 셋 다 라인 밖    → 정지 (빨간 LED)

※ 스스로 해보기:
  · 회전 각도(15)를 8로 줄이면 더 부드럽게, 30으로 키우면 급격하게 보정.
  · 검은 라인이 1이 아니라 0으로 읽힌다면, l/c/r 비교를 \`== 0\`으로 뒤집으세요.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

STEP = 3      # 한 루프에 전진할 거리(cm)
SPEED = 35
TURN = 15     # 작은 보정 회전 각도

try:
    for _ in range(60):
        l, c, r = bot.get_line_sensor()
        print("line L/C/R =", l, c, r)

        if c and not l and not r:
            bot.turn_led_idx(3)                       # 초록 = 라인 위 (정상)
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif l and not r:
            bot.turn_led_idx(4)                       # 파랑 = 오른쪽으로 치우침, 왼쪽으로 보정
            bot.turn_left_speed(TURN, SPEED)
        elif r and not l:
            bot.turn_led_idx(2)                       # 노랑 = 왼쪽으로 치우침, 오른쪽으로 보정
            bot.turn_right_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                       # 빨강 = 라인을 놓침
            bot.stop()
            break
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"예제 5: 장애물 피해가기 (좌·우 물체 센서 비교)",summary:"좌·우 물체 센서를 비교해 비어 있는 쪽으로 피합니다. 왼쪽에 물체 → 오른쪽 회전, 오른쪽에 물체 → 왼쪽 회전, 양쪽 다 막히면 후진 후 큰 회전.",details:`학습 포인트 — "두 센서값을 비교해 동작 선택":
  · get_object_detect()의 (left, right) 두 값을 4가지 경우로 나눠 처리합니다.
  · 4가지 경우: (0,0) 비어있음 / (1,0) 왼쪽만 / (0,1) 오른쪽만 / (1,1) 양쪽 다
  · "둘 다 막힘"은 단순 회전으로 못 빠져나오므로 "후진 후 회전"으로 탈출 동작을 따로 만듭니다.
  · LED 색을 상태별로 다르게 하면 카미봇이 지금 어떤 상황인지 눈으로 추적할 수 있습니다.

코드 흐름:
  · 100번 반복(약 10초): 센서 읽기 → 4가지 분기 중 하나 실행 → 살짝 대기

※ 스스로 해보기:
  · TURN을 30 → 45로 키우면 더 급하게 회피, 15로 줄이면 부드럽게.
  · \`move_backward_unit(5, "-l", 40)\` 뒤에 무작위로 좌·우 회전을 하면 미로 탈출 로봇이 됩니다.
  · 비프음을 추가해 충돌 직전마다 경고하도록 만들어 보세요.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

SPEED = 35
TURN = 30        # 회피 회전 각도(도)
STEP = 4         # 길이 비어 있을 때 전진할 거리(cm)

try:
    for _ in range(100):
        left, right = bot.get_object_detect()
        print("obj L/R =", left, right)

        if not left and not right:
            bot.turn_led_idx(3)                          # 초록 = 길이 비어 있음
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif left and not right:
            bot.turn_led_idx(2)                          # 노랑 = 왼쪽에 장애물
            bot.turn_right_speed(TURN, SPEED)
        elif right and not left:
            bot.turn_led_idx(2)                          # 노랑 = 오른쪽에 장애물
            bot.turn_left_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                          # 빨강 = 양쪽 모두 막힘
            bot.beep()
            bot.move_backward_unit(5, "-l", SPEED)       # 후진
            bot.turn_right_speed(TURN * 3, SPEED)        # 더 크게 회전해 탈출

        bot.delay(0.1)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"예제 6: 라인 따라가다 교차로에서 멈추기",summary:"왼쪽·중앙·오른쪽 라인 센서로 검은 라인을 따라가다가, 세 센서가 모두 라인을 감지하는 지점(굵은 라인·교차로)을 만나면 잠깐 전진 후 제자리에서 90도 회전하고 종료합니다.",details:`학습 포인트 — "라인 추종 + 종료 조건":
  · get_line_sensor()는 (left, center, right) 세 값을 돌려줍니다 (라인 위 = 1, 흰 바닥 = 0 가정).
  · go_forward_speed(왼쪽, 오른쪽)에서 두 바퀴 속도를 다르게 주면 느린 쪽으로 휘어집니다 — 회전 보정의 핵심.
  · while True + break 패턴: 평소엔 라인을 따라가다가 특정 종료 조건을 만나면 루프를 빠져나옵니다.
  · move_step(ldir, lstep, rdir, rstep): "f"/"b"로 방향, 스텝수로 거리·각도 제어. 좌우 반대 방향이면 제자리 회전.

제어 규칙 (if/elif 순서대로 검사):
  · 좌·중·우 모두 1   → 정지 → 전진(30 스텝) → 제자리 90도 회전 → break (루프 종료)
  · 중앙만 1          → 직진 (양쪽 80)
  · 왼쪽이 1          → 좌회전 보정 (왼쪽 30, 오른쪽 80 → 왼쪽 바퀴를 느리게)
  · 오른쪽이 1        → 우회전 보정 (왼쪽 80, 오른쪽 30)

※ 주의:
  · 코드 첫 줄 주석 "# 빨강"은 표기가 실제 색(초록 (0,255,0))과 다릅니다.
  · elif 우선순위 때문에 중앙이 1이면 좌/우 값은 무시됩니다.
  · 모든 센서가 0(라인 이탈)일 때는 어떤 분기에도 걸리지 않으므로, 마지막 명령이 그대로 유지됩니다 — 복구 로직을 추가해 보세요.

※ 스스로 해보기:
  · move_step("f", 90, "b", 90)을 ("b", 90, "f", 90)으로 바꾸면 반대 방향으로 회전합니다.
  · 90도가 너무 크다면 스텝수를 45로 줄여 보세요.
  · break 대신 90도 회전 후 다시 라인 추종을 시작하도록 만들면 코너에서 방향을 바꾸는 로봇이 됩니다.`,example:`robot = KamibotPi('COM3', 57600)
robot.turn_led(0, 255, 0)    # 빨강

# 1
while True:
    # 라인 센서 읽기
    left, center, right = robot.get_line_sensor()
    print(left, center, right)

    if left == 1 and center == 1 and right==1:
            robot.stop()
            robot.move_step('f', 30, 'f', 30)
            robot.move_step("f", 90, "b", 90)
            break
    elif center == 1:  # 중앙에 라인
        robot.go_forward_speed(80, 80)
    elif left == 1:  # 왼쪽에 라인
        robot.go_forward_speed(30, 80)  # 좌회전
    elif right == 1:  # 오른쪽에 라인
        robot.go_forward_speed(80, 30)  # 우회전`}]},{id:"misc",title:"10. 라인트레이서 / 정보",description:"라인트레이서 켜고 끄기, 배터리·펌웨어 버전 조회",icon:"route",entries:[{name:"bot.toggle_linetracer(mode, speed=100)",summary:"펌웨어 내장 라인트레이서 기능을 켜거나 끈다.",details:"센서를 직접 읽어 if/else로 분기하지 않아도, 카미봇이 펌웨어 자체 로직으로 라인을 따라가게 한다. 켜 둔 상태에서는 다른 이동 명령 대신 라인을 우선해서 따라간다.\n\nArgs:\n  mode (bool): ``True`` 켜기 / ``False`` 끄기.\n  speed (int): 라인트레이서 속도. 기본 100.\n\nReturns:\n  None\n\n직접 라인 센서를 읽어 동작을 짜고 싶다면 ``bot.get_line_sensor()``를 사용한다.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 라인트레이서 켜고 5초간 라인 따라가기
bot.toggle_linetracer(True, 80)
bot.delay(5)
bot.toggle_linetracer(False)
bot.stop()

bot.close()`},{name:"bot.get_battery()",summary:"현재 배터리 잔량을 정수로 읽어 돌려준다.",details:`내부적으로 응답 패킷의 BATTERY 바이트를 그대로 돌려준다. 펌웨어 매핑에 따라 0~100(%) 또는 다른 단위로 해석된다.

Returns:
  int: 배터리 값.`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

level = bot.get_battery()
print("battery =", level)

bot.close()`},{name:"bot.get_version()",summary:"펌웨어 버전 정보를 시리얼로 요청한다.",details:`명령 결과는 함수 반환값이 아니라 시리얼 응답 콘솔로 출력된다. 펌웨어 동작이 이상할 때 디버깅용으로 사용한다.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.get_version()   # 응답이 콘솔에 출력됨

bot.close()`}]},{id:"basic-move",title:"11. 기본 이동 (맵보드)",description:"맵보드의 칸 단위로 정확하게 이동·회전",icon:"arrow_forward",notice:"이 기능은 전용 맵보드가 필요합니다.",entries:[{name:'bot.move_forward(value, opt="-l")',summary:"맵보드 한 칸 단위로 앞으로 ``value`` 칸 이동한다.",details:'맵보드의 격자(라인맵 또는 블록맵)를 따라 카미봇이 정확히 ``value``칸 만큼 전진한다.\n\nArgs:\n  value (int): 이동 칸수.\n  opt (str): ``"-l"`` 라인맵보드 / ``"-b"`` 블록맵보드. 기본 ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.move_forward(2)         # 라인맵 기준 2칸
bot.move_forward(3, "-b")   # 블록맵 기준 3칸

bot.close()`},{name:"bot.move_backward(value)",summary:"블록맵보드에서 뒤로 ``value`` 칸 이동한다.",details:`블록맵보드 전용 명령. 라인맵보드에서는 사용할 수 없다.

Args:
  value (int): 이동 칸수.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.move_backward(1)   # 블록맵에서 1칸 후진

bot.close()`},{name:'bot.turn_left(value=1, opt="-l")',summary:"맵보드 위에서 왼쪽으로 회전한다.",details:'라인맵에서는 한 번만 회전(90°)이 보장되고, ``value``는 무시된다. 블록맵에서는 ``value``번 만큼 90° 회전을 누적한다.\n\nArgs:\n  value (int): 회전 횟수. 기본 1.\n  opt (str): ``"-l"`` 라인맵 / ``"-b"`` 블록맵. 기본 ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_left()         # 라인맵 90°
bot.turn_left(2, "-b")  # 블록맵 180° (90° × 2)

bot.close()`},{name:'bot.turn_right(value=1, opt="-l")',summary:"맵보드 위에서 오른쪽으로 회전한다.",details:'``turn_left``의 반대 방향. 라인맵에서는 ``value`` 무시, 블록맵에서는 ``value``번 누적.\n\nArgs:\n  value (int): 회전 횟수. 기본 1.\n  opt (str): ``"-l"`` 라인맵 / ``"-b"`` 블록맵. 기본 ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_right()
bot.turn_right(2, "-b")

bot.close()`},{name:'bot.turn_back(value=1, opt="-l")',summary:"맵보드 위에서 뒤로(180°) 돌아선다.",details:'한 자리에서 반 바퀴 도는 동작. 라인맵에서는 ``value`` 무시.\n\nArgs:\n  value (int): 회전 횟수. 기본 1.\n  opt (str): ``"-l"`` 라인맵 / ``"-b"`` 블록맵.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

bot.turn_back()

bot.close()`}]},{id:"utils",title:"12. 유틸 / 상수",description:"센서값 매핑·각도 계산 같은 보조 함수와 모듈 상수 모음",icon:"functions",entries:[{name:"bot.remap(value, source_range, target_range)",summary:"원본 범위에 있던 값을 같은 비율로 목표 범위에 매핑해 돌려준다 — 센서값 단위 변환에 자주 쓰임.",details:"센서 입력값(예: 0~1023)을 모터 속도 범위(예: 0~100)로 옮길 때처럼 선형 비례 변환이 필요할 때 사용한다.\n\nArgs:\n  value (float | int): 변환할 원본 값.\n  source_range (tuple[float, float]): ``value``가 속한 원본 범위 ``(s0, s1)``.\n  target_range (tuple[float, float]): 매핑할 목표 범위 ``(t0, t1)``.\n\nReturns:\n  float: 같은 비율로 ``target_range`` 안에 옮겨진 값.\n\n예) ``remap(50, (0, 100), (0, 10))`` → ``5.0``.",example:`from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 센서값(0~1023) → 모터 속도(0~100)로 변환
sensor_value = 512
speed = bot.remap(sensor_value, (0, 1023), (0, 100))
print("mapped speed =", speed)

bot.close()`},{name:"KamibotPi.angle3p(p1, p2, p3)",summary:"세 점이 ``p2``에서 만드는 각도(0~360°, 반시계 방향)를 계산한다.",details:"``p1 → p2 → p3`` 순서로 ``p2``를 꼭짓점에 두고, ``p2 p1`` 방향에서 ``p2 p3`` 방향까지 시계 반대 방향으로 돈 각도를 도(degree) 단위로 돌려준다.\n시리얼이 필요 없는 순수 계산이라, 카미봇과 연결하지 않아도 호출할 수 있다.\n\nArgs:\n  p1: 첫 점 ``(x, y, ...)``.\n  p2: 꼭짓점 ``(x, y, ...)``.\n  p3: 끝 점 ``(x, y, ...)``.\n\nReturns:\n  float: 0 ~ 360 사이의 각도(도).\n\n시그니처에 ``self``가 없으므로 클래스로 직접 호출하는 것이 가장 명확하다 — ``KamibotPi.angle3p(p1, p2, p3)``.",example:`from pibot import KamibotPi

# 시리얼 연결 없이도 동작 — 좌표만으로 각도 계산
a = KamibotPi.angle3p((0, 0), (1, 0), (1, 1))
print("angle =", a)   # 약 90.0`},{name:"Note (모듈 상수)",summary:"음계 → MIDI 정수 매핑 상수 모음. ``Note.C4`` 같은 형태로 ``melody`` 인자에 그대로 쓴다.",details:'pibot 모듈에 정의된 음계 상수 클래스. ``CM1``(=0)부터 ``B5``(=83)까지의 정수 상수를 멤버로 가진다.\n가운데 도(C4) = 60. 옥타브가 한 단계 오르면 +12, 내리면 -12.\n\n명명 규칙:\n  ``C4``, ``D4``, ``E4`` … 자연음\n  ``Cs4`` (C♯4), ``Ds4`` (D♯4) … 샵\n  ``Db4`` (=Cs4), ``Eb4`` (=Ds4) … 같은 음의 플랫 별칭\n\n전체 음계 표는 "3. 소리" 토픽 하단의 표를 참고한다.',example:`from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 상수로 음계 직접 지정
print("Note.C4 =", Note.C4)   # 60
print("Note.A4 =", Note.A4)   # 69

# melody 인자로 사용
bot.melody(Note.C4, 0.4)
bot.melody(Note.E4, 0.4)
bot.melody(Note.G4, 0.4)

bot.close()`},{name:"LED_COLOR (모듈 상수)",summary:"인덱스 0~8로 9가지 색을 ``[R, G, B]`` 리스트로 매핑한 리스트 상수. ``turn_led``에 ``*`` 로 풀어서 사용한다.",details:"pibot 모듈에 정의된 9가지 기본 색의 RGB 리스트 모음. ``turn_led_idx(idx)``가 내부적으로 사용하는 표와 같은 데이터다.\n\n인덱스 매핑:\n  0=빨강, 1=주황, 2=노랑, 3=초록, 4=파랑, 5=하늘, 6=보라, 7=흰색, 8=꺼짐\n\n키 이름으로 꺼내고 싶다면 같은 정보가 들어 있는 ``LED`` dict를 쓴다.",example:`from pibot import KamibotPi, LED_COLOR

bot = KamibotPi("COM85")  # 예시 포트

# 모든 색을 인덱스 순서대로 켜보기
for rgb in LED_COLOR:
    bot.turn_led(*rgb)
    bot.delay(0.4)

bot.turn_led(0, 0, 0)
bot.close()`}]},{id:"virtual-keyboard",title:"13. 가상 키보드 — IDE 키로 카미봇 조종",description:"VirtualKeyboard 모듈로 키 입력을 받아 LED · 멜로디 · 주행을 실시간 제어",icon:"keyboard",entries:[{name:"VirtualKeyboard 모듈 (개념)",summary:"툴바의 가상 키보드를 동기적으로 읽어 카미봇 동작과 묶을 수 있다.",details:'IDE 툴바의 키보드 버튼을 누르면 화면에 작은 가상 키보드 창이 뜬다. 이 창의 버튼(혹은 그 창이 포커스를 가진 상태의 실제 키보드)을 누르면 키 코드가 ``VirtualKeyboard`` 모듈로 흘러 들어온다.\n\n용도는 단순하다 — 카미봇 코드 안에서 키 입력을 받아 LED 색을 바꾸거나, 차체를 운전하거나, 멜로디를 울리는 등 **실시간 제어**를 손쉽게 만들 수 있다. ``input()`` 처럼 한 줄을 통째로 입력받고 엔터를 기다리는 방식이 아니라, 키 **한 개씩** 그때그때 받아 처리하는 게 핵심이다.\n\n핵심 특징:\n  • ``import VirtualKeyboard as kb`` 한 줄로 사용한다(관례적으로 ``kb`` 별칭).\n  • 함수는 ``kb.wait_key(ms)`` 한 개뿐이다. ``ms`` 만큼 기다리고, 키가 없으면 ``-1`` 을 돌려준다.\n  • 알파벳/숫자 키는 소문자 ASCII 코드, ESC/Enter/Space 등은 표준 ASCII 코드, 화살표는 ``0x80~0x83`` 의 커스텀 코드.\n  • ``cv2.waitKey()`` 와 **독립된 큐**를 쓰므로 imshow 창이 떠 있어도 두 입력이 섞이지 않는다.\n\n카미봇의 ``get_object_detect()`` · ``get_line_sensor()`` 같은 센서 입력과 같은 결로 쓸 수 있는 "PC 키보드 입력" 채널이라고 생각하면 된다. 센서가 보지 못하는 사용자 의도(시작/정지/색 변경 등)를 즉시 받아 처리할 수 있다.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

# 툴바의 키보드 아이콘을 눌러 가상 키보드 창을 먼저 띄워 두자.
print("아무 키나 눌러 보세요 (ESC 로 종료)")

while True:
    key = kb.wait_key(0)        # 0 = 키가 눌릴 때까지 무한 대기
    if key == kb.ESC:
        break
    print("받은 키 코드:", key)

bot.close()`},{name:"kb.wait_key(ms)",summary:"다음 키 한 개를 기다린다. ``ms`` 이내에 안 들어오면 ``-1``.",details:"Args:\n  ms (int): 대기 시간(밀리초). ``0`` 이하이면 키가 눌릴 때까지 **무한 대기**한다.\nReturns:\n  int: 눌린 키의 코드. 타임아웃이면 ``-1``.\n\n두 가지 사용 패턴이 있다.\n\n  1) **블로킹 모드** (``ms=0``): 키가 들어올 때까지 멈춘다. 메뉴 선택처럼 한 번에 한 키만 받으면 되는 경우에 깔끔하다.\n  2) **논블로킹 모드** (``ms`` 작은 양수, 예: ``20``): 짧게만 기다려 보고 키가 없으면 ``-1`` 을 돌려준다. 주행 루프처럼 키 입력과 별개로 센서 폴링이나 모터 제어를 이어가야 할 때 쓴다.\n\n카미봇 명령은 시리얼 응답을 기다리므로 자체적으로 어느 정도 시간이 걸린다. 따라서 메인 루프에서 ``kb.wait_key`` 의 ``ms`` 는 보통 0~30 정도로 작게 두는 것이 자연스럽다.",example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

while True:
    key = kb.wait_key(20)        # 20ms만 기다리고 즉시 다음 줄로
    if key == kb.ESC:
        break

    # 키가 들어왔을 때만 색을 바꾼다.
    if key == kb.SPACE:
        bot.turn_led(255, 0, 0)
    elif key != -1:
        bot.turn_led(0, 0, 255)

bot.turn_led(0, 0, 0)
bot.close()`},{name:"키 코드 상수표",summary:"문자 키는 소문자 ASCII, 특수 키는 모듈 상수로 비교한다.",details:'키 비교는 숫자 코드를 외우는 대신 ``kb.ESC`` 처럼 모듈에 정의된 상수를 쓰면 읽기 쉽다.\n\n문자/숫자 (소문자 ASCII 코드):\n  ``kb.A`` ~ ``kb.Z``      = 알파벳 (`ord("a")` ~ `ord("z")`)\n  ``kb.NUM_0`` ~ ``kb.NUM_9`` = 숫자 (`ord("0")` ~ `ord("9")`)\n\n제어/공용 키 (표준 ASCII):\n  ``kb.BACKSPACE`` = 8\n  ``kb.TAB``       = 9\n  ``kb.ENTER``     = 13\n  ``kb.ESC``       = 27\n  ``kb.SPACE``     = 32\n\n화살표 (ASCII 와 충돌을 피하려고 0x80+ 커스텀 코드):\n  ``kb.ARROW_LEFT``  = 0x80\n  ``kb.ARROW_UP``    = 0x81\n  ``kb.ARROW_RIGHT`` = 0x82\n  ``kb.ARROW_DOWN``  = 0x83\n\n주의: 알파벳 상수는 모두 **소문자** 코드다. 가상 키보드는 Shift 입력을 따로 전달하지 않으므로 ``kb.A`` 한 가지로 비교하면 된다. 직접 비교가 필요하면 ``ord("a")`` 같은 식으로 적어도 동일하다.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi, LED_COLOR

bot = KamibotPi("COM85")  # 예시 포트

# 숫자키 1~9 → LED_COLOR 의 9가지 색 인덱스 매핑
DIGIT_KEYS = [kb.NUM_1, kb.NUM_2, kb.NUM_3, kb.NUM_4, kb.NUM_5,
              kb.NUM_6, kb.NUM_7, kb.NUM_8, kb.NUM_9]

print("1~9 = 색 인덱스, SPACE = 흰색, ESC = 종료")
while True:
    key = kb.wait_key(0)
    if key == kb.ESC:
        break

    if key in DIGIT_KEYS:
        idx = DIGIT_KEYS.index(key)
        bot.turn_led(*LED_COLOR[idx])
    elif key == kb.SPACE:
        bot.turn_led(255, 255, 255)

bot.turn_led(0, 0, 0)
bot.close()`},{name:"예제: 숫자키로 LED · 멜로디 동시 컨트롤",summary:"키 한 번에 LED 색과 음 한 개가 동시에 바뀌는 미니 악기 / 신호등.",details:`가상 키보드의 위력은 "키 한 개 = 한 동작" 이 즉시 카미봇에 반영된다는 점이다. 아래 예제는 키 한 개로 다음 두 가지를 **동시에** 실행한다.
  1) LED 색을 그 키에 대응되는 색으로 바꾼다.
  2) \`\`bot.melody\`\` 로 그 키에 대응되는 음을 짧게 울린다.

키 → (색, 음) 매핑을 한 곳에 모은 dict 로 두면, 키를 추가하거나 바꿀 때 코드 한 줄만 손대면 된다. 비교문을 길게 늘어 놓는 것보다 훨씬 깔끔하다.

구현 핵심은 \`\`kb.wait_key(0)\`\` 으로 **블로킹 모드**를 쓴 점이다. 키를 누르기 전까지 LED 가 깜빡일 일도 없고, 모터를 잡고 있을 필요도 없어 시리얼 라인이 한가하다. 다음 키가 들어온 순간에만 명령이 한 번씩 오가므로, 통신이 매우 깨끗하다.

키 매핑:
  • 1 → 빨강 + C4
  • 2 → 노랑 + D4
  • 3 → 초록 + E4
  • 4 → 파랑 + F4
  • 5 → 보라 + G4
  • SPACE → 모두 끔 (LED off, 비프 없음)
  • ESC → 종료`,example:`import VirtualKeyboard as kb
from pibot import KamibotPi, Note

bot = KamibotPi("COM85")  # 예시 포트

# 키 → (R, G, B, 음계) 한 곳에 모은 매핑
PALETTE = {
    kb.NUM_1: (255,   0,   0, Note.C4),
    kb.NUM_2: (255, 255,   0, Note.D4),
    kb.NUM_3: (  0, 255,   0, Note.E4),
    kb.NUM_4: (  0,   0, 255, Note.F4),
    kb.NUM_5: (200,   0, 200, Note.G4),
}

print("1~5 = 색+음, SPACE = 끄기, ESC = 종료")
while True:
    key = kb.wait_key(0)
    if key == kb.ESC:
        break

    if key in PALETTE:
        r, g, b, note = PALETTE[key]
        bot.turn_led(r, g, b)
        bot.melody(note, 0.2)
    elif key == kb.SPACE:
        bot.turn_led(0, 0, 0)

bot.turn_led(0, 0, 0)
bot.close()`},{name:"예제: WASD 로 카미봇 운전",summary:"PC 키보드로 카미봇을 실시간 조종한다. 키가 들어오는 동안만 움직인다.",details:'카미봇 조종은 "키가 눌린 동안만 움직이고, 떼면 멈춘다" 가 자연스럽다. 가상 키보드는 "키 한 개" 단위로만 이벤트를 주기 때문에, **키를 받는 즉시 시작 → 짧은 시간 후 자동 정지** 패턴을 쓴다. 너무 짧으면 끊겨 보이고, 너무 길면 반응이 둔해지므로 보통 ``wait_key`` 폴링 주기를 30~50ms 로 잡고, 키가 없을 때는 ``stop`` 으로 떨어지게 둔다.\n\n카미봇 주행 명령은 두 종류 중 고르면 된다.\n  • ``go_forward_speed(L, R)`` / ``go_backward_speed`` — 양쪽 바퀴 속도를 직접 지정. 정밀 제어용.\n  • ``move_forward(value)`` 등 단위 이동 — 한 번 호출하면 끝까지 도는 명령이라 실시간 조종에는 부적합.\n\n실시간 조종에는 첫 번째(``*_speed``)가 알맞다. ``go_dir_speed(ldir, lspeed, rdir, rspeed)`` 로 좌우 방향을 따로 주면 제자리 회전도 깔끔하게 만든다(왼쪽 후진 + 오른쪽 전진 = 좌회전).\n\n키 매핑:\n  • W / S          : 전진 / 후진\n  • A / D          : 제자리 좌/우 회전\n  • SPACE          : 즉시 정지\n  • 1 / 2 / 3      : 속도 40 / 70 / 100\n  • ESC            : 종료\n\n``try/finally`` 로 묶어 두면 예외나 ESC 종료 시에도 ``bot.stop()`` 과 ``bot.close()`` 가 반드시 호출돼 차가 굴러가지 않는다.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi("COM85")  # 예시 포트

speed = 70

ACTIONS = {
    kb.W: lambda: bot.go_forward_speed(speed, speed),
    kb.S: lambda: bot.go_backward_speed(speed, speed),
    kb.A: lambda: bot.go_dir_speed("b", speed, "f", speed),   # 좌회전 (왼쪽 후진+오른쪽 전진)
    kb.D: lambda: bot.go_dir_speed("f", speed, "b", speed),   # 우회전
    kb.SPACE: lambda: bot.stop(),
}

print("W/A/S/D = 주행, SPACE = 정지, 1/2/3 = 속도, ESC = 종료")
try:
    while True:
        key = kb.wait_key(30)        # 30ms 마다 키 확인
        if key == kb.ESC:
            break

        # 속도 변경 키
        if key == kb.NUM_1:   speed = 40
        elif key == kb.NUM_2: speed = 70
        elif key == kb.NUM_3: speed = 100

        action = ACTIONS.get(key)
        if action:
            action()
        elif key == -1:
            # 키가 안 들어오면 안전을 위해 자동 정지
            bot.stop()
finally:
    bot.stop()
    bot.close()`}]}];export{t as REFERENCE};
