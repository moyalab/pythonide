const e=[{id:"setup",title:"[EN] 환경설정",description:"[EN] USB 동글 드라이버 설치 안내",icon:"settings",setup:{intro:"[EN] 카미봇과 PC를 시리얼 포트로 연결하려면 USB 동글 드라이버를 먼저 설치해야 합니다. 아래 절차를 따라 드라이버 설치를 진행해 주세요.",steps:['아래 "드라이버 다운로드" 버튼을 눌러 설치 파일(CDM21228_Setup.zip)을 내려받습니다.','내려받은 zip 파일을 마우스 오른쪽 버튼으로 클릭하고 "압축 풀기"를 선택해 압축을 해제합니다.',"압축 해제된 폴더 안의 CDM21228_Setup.exe 파일을 실행해 안내에 따라 드라이버를 설치합니다.","설치가 끝나면 USB 동글을 PC에 꽂고 카미봇 본체의 전원을 켜 연결을 확인합니다."],note:"[EN] 설치 후에도 포트가 인식되지 않으면 PC를 재부팅하거나 다른 USB 포트에 연결해 주세요.",download:{href:"/drivers/CDM21228_Setup.zip",filename:"CDM21228_Setup.zip",label:"[EN] 드라이버 다운로드 (CDM21228_Setup.zip)"},pairing:{title:"[EN] 동글과 로봇 연결하기",intro:"[EN] 드라이버 설치가 끝나면 카미봇 본체와 USB 동글(카미봇 동글)을 다음 절차로 페어링합니다.",steps:["카미봇 본체와 카미봇 동글을 준비합니다.","카미봇 본체의 전원을 켭니다. 본체의 LED가 켜지고 여러 색상으로 바뀝니다.","카미봇 동글을 PC의 USB 포트에 꽂고, 카미봇 본체를 동글에 최대한 가까이 가져갑니다.","카미봇 동글의 버튼을 누릅니다.","카미봇 본체의 LED가 파란색으로 바뀌면 하드웨어 연결이 완료된 상태입니다."]}}},{id:"getting-started",title:"[EN] 시작하기",description:"[EN] 연결, 정지, 대기 등 기본 명령",icon:"play_circle",entries:[{name:"[EN] KamibotPi(port)",summary:"[EN] 카미봇과 시리얼 포트로 연결합니다.",details:`[EN] Args:
  port (str): 시리얼 포트 (예: COM3, /dev/ttyUSB0)
  baud (int): 통신 속도, 기본 57600
  timeout (int): 응답 대기 시간(초), 기본 2

Note 상수(예: Note.C4)도 함께 import 해두면 멜로디에서 바로 사용할 수 있습니다.`,example:`from pibot import KamibotPi, Note

bot = KamibotPi()`},{name:"[EN] bot.close()",summary:"[EN] 연결을 종료하고 프로그램을 끝냅니다.",details:`[EN] 시리얼 포트를 닫은 뒤 sys.exit(0)을 호출합니다.
Returns: None`,example:"bot.close()"},{name:"[EN] bot.disconnect()",summary:"[EN] 연결만 끊고 프로그램은 계속 실행합니다.",details:`[EN] 시리얼 포트를 닫지만 프로그램을 종료하지는 않습니다.
Returns: None`,example:"bot.disconnect()"},{name:"[EN] bot.init()",summary:"[EN] 로봇을 초기 상태로 되돌립니다.",details:`[EN] 내부 상태를 리셋합니다.
Returns: None`,example:"bot.init()"},{name:"[EN] bot.delay(sec)",summary:"[EN] 주어진 시간(초)만큼 기다립니다.",details:`[EN] Args:
  sec (float): 초
Returns: None`,example:"bot.delay(1.5)"},{name:"[EN] bot.delayms(ms)",summary:"[EN] 주어진 시간(밀리초)만큼 기다립니다.",details:`[EN] Args:
  ms (int): 밀리초
Returns: None`,example:"bot.delayms(500)"},{name:"[EN] bot.wait(ms)",summary:"[EN] delayms와 동일하게 밀리초 단위로 기다립니다.",details:`[EN] Args:
  ms (int): 밀리초
Returns: None`,example:"bot.wait(200)"},{name:"[EN] bot.stop()",summary:"[EN] 이동 중인 로봇을 멈춥니다.",details:`[EN] Args: 없음
Returns: None`,example:"bot.stop()"}]},{id:"sound",title:"[EN] 소리",description:"[EN] 비프음과 음계 연주",icon:"music_note",entries:[{name:"[EN] bot.beep(sec=0.2)",summary:'[EN] "삐" 소리를 냅니다. 재생 시간을 초 단위로 지정할 수 있습니다.',details:`[EN] Args:
  sec (float): 재생 시간(초). 생략 시 0.2초. 범위 0.1 ~ 25.5초
Returns: None

60번 음계(C4, 중간 도)를 sec 초 동안 재생합니다.`,example:`bot.beep()       # 0.2초
bot.beep(1)      # 1초
bot.beep(0.5)    # 0.5초`},{name:"[EN] bot.melody(scale, sec)",summary:"[EN] 지정한 음계를 주어진 시간만큼 재생합니다.",details:`[EN] Args:
  scale (int): 음계 (0 ~ 83). Note.C4 같은 상수도 사용 가능
  sec (int): 재생 시간(초)
Returns: None

Note 상수를 쓰려면 from pibot import Note 가 필요합니다.
샵: Cs4 (=C♯4)  /  플랫: Db4 (=D♭4)  ← 같은 음을 가리키는 별칭`,example:`from pibot import KamibotPi, Note

bot = KamibotPi()
bot.melody(Note.C4, 1)
bot.melody(Note.E4, 1)
bot.melody(Note.G4, 1)`}],tables:[{title:"[EN] 음계 ↔ scale 매핑 (Octave 4 기준, 중간 도 = Note.C4 = 60)",headers:["음","자연음/샵","플랫 별칭","scale 값"],rows:[["C","C4","—","60"],["C♯","Cs4","Db4","61"],["D","D4","—","62"],["D♯","Ds4","Eb4","63"],["E","E4","—","64"],["F","F4","—","65"],["F♯","Fs4","Gb4","66"],["G","G4","—","67"],["G♯","Gs4","Ab4","68"],["A","A4","—","69"],["A♯","As4","Bb4","70"],["B","B4","—","71"]],note:"[EN] 다른 옥타브는 각 행의 scale 값에 ±12 하면 됩니다. 예: C5 = 60 + 12 = 72,  C3 = 60 − 12 = 48. 전체 범위는 Note.CM1(=0) ~ Note.B5(=83)."}],entriesAfter:[{name:"[EN] 예제: 경찰차 사이렌",summary:'[EN] 두 음을 빠르게 번갈아 재생해 "삐-뽀 삐-뽀" 사이렌을 흉내냅니다.',details:`[EN] 경찰차 사이렌은 두 개의 음을 빠르게 교대로 내는 아주 단순한 패턴입니다.
melody 함수와 반복문(for)을 익히기에 좋은 첫 예제입니다.

[1] from pibot import KamibotPi, Note
   카미봇과 음계 상수 Note를 함께 불러옵니다.

[2] bot = KamibotPi()
   카미봇 객체를 만듭니다.

[4–6] HI, LO, T
   HI = Note.D5 (scale=74): 사이렌의 높은 톤
   LO = Note.A4 (scale=69): 낮은 톤. 두 음의 차이는 완전 4도(+5)입니다.
   T  = 0.3 : 한 음의 길이(초). 경찰차는 "빠르게" 교대하므로 짧게 둡니다.

[8–10] for _ in range(6):
   "높은 음 → 낮은 음" 한 쌍을 6번 반복합니다 (약 3.6초). 
   range의 횟수만 바꾸면 사이렌 길이를 조절할 수 있습니다.

[12] bot.close()
   시리얼 포트를 닫고 종료합니다.`,example:`# Import the robot driver and the Note table.
from pibot import KamibotPi, Note

bot = KamibotPi()

# Police siren: two tones alternating quickly ("삐-뽀 삐-뽀").
# A short tone length and a perfect-4th interval keeps it bright and urgent.
HI = Note.D5   # higher tone
LO = Note.A4   # lower tone (perfect 4th below HI)
T  = 0.3       # length of each tone in seconds

# Play the HI/LO pair 6 times (~3.6 s total).
# Increase the range count to make the siren last longer.
for _ in range(6):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`},{name:"[EN] 예제: 병원 앰뷸런스 사이렌",summary:'[EN] 경찰차보다 느리게 두 음을 교대해 "니-노 니-노" 사이렌을 만듭니다.',details:`[EN] 앰뷸런스 사이렌도 두 음 교대 방식이지만, 경찰차에 비해 더 느립니다.
같은 패턴이라도 한 음의 길이(T)와 사용하는 음역만 바꾸면 분위기가 완전히 달라진다는 점에 주목하세요.

[1] from pibot import KamibotPi, Note
   카미봇과 Note 상수를 함께 불러옵니다.

[2] bot = KamibotPi()
   카미봇 객체를 만듭니다.

[4–6] HI, LO, T
   HI = Note.A5 (scale=81): 사이렌의 높은 톤
   LO = Note.E5 (scale=76): 낮은 톤. 두 음의 차이는 완전 4도(+5)입니다.
   T  = 0.9 : 한 음의 길이(초). 앰뷸런스는 "천천히" 교대하므로 길게 둡니다.

[8–10] for _ in range(4):
   "높은 음 → 낮은 음" 한 쌍을 4번 반복합니다 (약 7.2초).

[12] bot.close()
   시리얼 포트를 닫고 종료합니다.

※ 비교 포인트: 경찰차는 T=0.3초로 빠르게, 앰뷸런스는 T=0.9초로 느리게. 같은 "두 음 교대" 패턴이라도 시간만 바꾸면 전혀 다른 사이렌이 됩니다.`,example:`# Import the robot driver and the Note table.
from pibot import KamibotPi, Note

bot = KamibotPi()

# Ambulance siren: two tones alternating slowly ("니-노 니-노").
# A longer tone length than a police siren makes it feel calmer but still urgent.
HI = Note.A5   # higher tone
LO = Note.E5   # lower tone (perfect 4th below HI)
T  = 0.9       # length of each tone in seconds — slower than a police car

# Play the HI/LO pair 4 times (~7.2 s total).
for _ in range(4):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`},{name:"[EN] 예제: 엘리제를 위하여 (Für Elise) 연주",summary:'[EN] 베토벤 "엘리제를 위하여" 도입부 4마디 + 여린내기 (3/8박자, 가단조).',details:`[EN] 한 줄씩 코드를 따라가며 살펴봅시다.

[1] from pibot import KamibotPi, Note
   카미봇을 조종하는 KamibotPi 클래스와, 음계 상수를 모아둔 Note를 함께 불러옵니다.

[2] bot = KamibotPi()
   카미봇 객체를 만듭니다. 이후 모든 명령은 bot.xxx() 형태로 호출합니다.

[3] S = 0.2   # sixteenth note
   엘리제는 3/8 박자라서 가장 짧은 기본 단위가 16분음표입니다. S에 0.2초를 두었습니다.

[4] EE = 0.4  # eighth note
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
   시리얼 포트를 닫고 프로그램을 종료합니다.`,example:`# Import the robot driver and the Note table.
# KamibotPi sends commands to the robot. Note holds pitch constants (C4, D5, ...).
from pibot import KamibotPi, Note

# Create the robot object. Every command below is sent through this 'bot'.
bot = KamibotPi()

# 3/8 time. Sixteenth note as the base unit.
# Two sixteenths (S) equal one eighth (EE).
# Want it faster/slower? Change only these two numbers.
S = 0.2    # sixteenth note
EE = 0.4   # eighth note

# Note shortcuts (A minor, octaves 4-5)
# The score below repeats these names many times,
# so we copy Note.X4 into a short variable to keep each line readable.
A4  = Note.A4
B4  = Note.B4
C4  = Note.C4
C5  = Note.C5
D5  = Note.D5
Ds5 = Note.Ds5   # D#5
E4  = Note.E4
E5  = Note.E5
Gs4 = Note.Gs4   # G#4

# Score: Für Elise (Beethoven), 3/8, A minor — first 4 measures + pickup
# The music is stored as plain data: a list of (note, duration) pairs.
# note=None means rest (silence). The loop below will read this list and play it.
score = [
    # Pickup: E5 D#5
    (E5, S), (Ds5, S),

    # M1: E5 D#5 E5 B4 D5 C5
    (E5, S), (Ds5, S), (E5, S), (B4, S), (D5, S), (C5, S),

    # M2: A4 — rest — C4 E4 A4
    (A4, EE), (None, S), (C4, S), (E4, S), (A4, S),

    # M3: B4 — rest — E4 G#4 B4
    (B4, EE), (None, S), (E4, S), (Gs4, S), (B4, S),

    # M4: C5 — rest — E4 E5 D#5
    (C5, EE), (None, S), (E4, S), (E5, S), (Ds5, S),
]

# Walk through the score one pair at a time and play it.
# 'note, dur' unpacks each tuple: the pitch goes into 'note', the length into 'dur'.
for note, dur in score:
    if note is None:
        bot.delay(dur)        # Rest: do nothing for 'dur' seconds.
    else:
        bot.melody(note, dur) # Play 'note' for 'dur' seconds.

# Always close the serial port when finished, so the next program can use it.
bot.close()`},{name:"[EN] 예제: 학교종 연주",summary:'[EN] 동요 "학교종"을 melody로 재생하는 예제 (4/4박자).',details:`[EN] 숫자보 → 계명 매핑: 1=도(C), 2=레(D), 3=미(E), 5=솔(G), 6=라(A).
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

score 리스트는 (음, 길이) 튜플의 나열입니다. 음이 None이면 쉼표로 처리되어 bot.delay(길이)가 호출됩니다.`,example:`from pibot import KamibotPi, Note

bot = KamibotPi()

# Note durations (seconds) at moderate tempo
Q = 0.4    # quarter note
H = 0.8    # half note
REST = 0.4 # quarter rest

# Number-notation -> Western note (octave 4)
DO = Note.C4   # 1
RE = Note.D4   # 2
MI = Note.E4   # 3
SOL = Note.G4  # 5
LA = Note.A4   # 6

# Score: 학교종 (School Bell), 4/4
# (note, duration). note=None means rest.
score = [
    # M1: sol sol la la (학 교 종 이)
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M2: sol sol mi + rest (땡 땡 땡)
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M3: sol sol mi mi (어 서 모 이)
    (SOL, Q), (SOL, Q), (MI, Q), (MI, Q),
    # M4: re (half) + half rest (자 ─)
    (RE, H), (None, H),

    # M5: sol sol la la (선 생 님 이)
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M6: sol sol mi + rest (우 리 를)
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M7: sol mi re mi (기 다 리 신)
    (SOL, Q), (MI, Q), (RE, Q), (MI, Q),
    # M8: do (half) + half rest (다 ─)
    (DO, H), (None, H),
]

for note, dur in score:
    if note is None:
        bot.delay(dur)
    else:
        bot.melody(note, dur)

bot.close()`}]},{id:"led",title:"[EN] LED",description:"[EN] 컬러 LED 제어",icon:"lightbulb",entries:[{name:"[EN] bot.turn_led(r, g, b)",summary:"[EN] LED를 RGB 값으로 켭니다.",details:`[EN] Args:
  rval (int): 0 ~ 255 빨강
  gval (int): 0 ~ 255 초록
  bval (int): 0 ~ 255 파랑
Returns: None`,example:"bot.turn_led(255, 0, 0)"},{name:"[EN] bot.turn_led_idx(idx)",summary:"[EN] 색상 인덱스로 LED를 켭니다.",details:`[EN] Args:
  idx (int): 0:red, 1:orange, 2:yellow, 3:green, 4:blue, 5:skyblue, 6:purple, 7:white
Returns: None`,example:"bot.turn_led_idx(3)"}],tables:[{title:"[EN] SOS 모스 부호 패턴",headers:["글자","모스 부호"],rows:[["S","· · ·"],["O","— — —"],["S","· · ·"]],note:"[EN] 모스 부호는 짧은 신호(점 ·)와 긴 신호(대시 —)의 조합으로 글자를 표현합니다. SOS는 국제 조난 신호로, 단순하고 알아보기 쉬운 패턴이라 긴급 상황에서 사용됩니다. LED를 점은 짧게, 대시는 길게 켜는 방식으로 표현할 수 있습니다."},{title:"[EN] 모스 부호 타이밍 규칙",headers:["요소","길이","설명"],rows:[["점 (·)","1 단위","LED를 짧게 켜기"],["대시 (—)","3 단위","LED를 길게 켜기"],["부호 사이","1 단위","같은 글자 안의 점/대시 사이 간격"],["글자 사이","3 단위","S와 O, O와 S 사이 간격"],["신호 사이","7 단위","SOS 한 번이 끝나고 다시 시작할 때까지"]],note:'[EN] "1 단위(unit)"는 직접 정하면 됩니다. 아래 예제에서는 1 단위 = 0.2초로 사용했습니다. 단위를 줄이면 신호가 빨라지고, 늘리면 느려집니다.'}],entriesAfter:[{name:"[EN] 예제: 빨간 LED로 SOS 신호 보내기",summary:"[EN] 빨간색 LED를 모스 부호 SOS(· · · — — — · · ·) 패턴으로 깜빡여 조난 신호를 표현합니다.",details:`[EN] 동작 순서:
  1. S = 짧게-짧게-짧게 (점 3번)
  2. O = 길게-길게-길게 (대시 3번)
  3. S = 짧게-짧게-짧게 (점 3번)
  4. 잠시 쉰 뒤 처음부터 반복

코드 구성:
  - blink(units): 한 부호(점 또는 대시)를 켰다 끄고, 부호 사이 간격(1 단위)까지 대기
  - send(pattern): "..."이나 "---" 같은 한 글자를 보내고 글자 사이 간격을 추가
  - try/finally: 중간에 멈춰도 LED를 반드시 끄고 포트를 닫음`,example:`from pibot import KamibotPi

# 1 unit = 0.2 sec — change to make signal faster or slower
UNIT = 0.2
RED = (255, 0, 0)
OFF = (0, 0, 0)


def blink(bot, units):
    bot.turn_led(*RED)
    bot.delay(UNIT * units)
    bot.turn_led(*OFF)
    bot.delay(UNIT)  # gap between symbols inside a letter


def send(bot, pattern):
    for symbol in pattern:
        blink(bot, 1 if symbol == "." else 3)
    bot.delay(UNIT * 2)  # extend symbol gap (1) to letter gap (3)


bot = KamibotPi()

try:
    for _ in range(3):
        send(bot, "...")   # S
        send(bot, "---")   # O
        send(bot, "...")   # S
        bot.delay(UNIT * 4)  # extend letter gap (3) to word gap (7)
finally:
    bot.turn_led(*OFF)
    bot.close()`}]},{id:"speed-control",title:"[EN] 속도 제어",description:"[EN] 바퀴 속도를 직접 지정해 이동",icon:"speed",entries:[{name:"[EN] bot.go_forward_speed(lspeed, rspeed)",summary:"[EN] 두 바퀴 속도를 지정해 앞으로 이동합니다.",details:`[EN] Args:
  lspeed (int): 왼쪽 바퀴 속도
  rspeed (int): 오른쪽 바퀴 속도
Returns: None`,example:"bot.go_forward_speed(100, 100)"},{name:"[EN] bot.go_backward_speed(lspeed, rspeed)",summary:"[EN] 두 바퀴 속도를 지정해 뒤로 이동합니다.",details:`[EN] Args:
  lspeed (int): 왼쪽 바퀴 속도
  rspeed (int): 오른쪽 바퀴 속도
Returns: None`,example:"bot.go_backward_speed(80, 80)"},{name:"[EN] bot.go_left_speed(speed)",summary:"[EN] 왼쪽으로 회전합니다 (오른쪽 바퀴만 회전).",details:`[EN] Args:
  speed (int): 회전 속도
Returns: None`,example:"bot.go_left_speed(100)"},{name:"[EN] bot.go_right_speed(speed)",summary:"[EN] 오른쪽으로 회전합니다 (왼쪽 바퀴만 회전).",details:`[EN] Args:
  speed (int): 회전 속도
Returns: None`,example:"bot.go_right_speed(100)"},{name:"[EN] bot.go_dir_speed(ldir, lspeed, rdir, rspeed)",summary:"[EN] 두 바퀴의 방향과 속도를 각각 지정합니다.",details:`[EN] Args:
  ldir (str): "f" 앞으로, "b" 뒤로
  lspeed (int): 왼쪽 속도
  rdir (str): "f" 앞으로, "b" 뒤로
  rspeed (int): 오른쪽 속도
Returns: None`,example:'bot.go_dir_speed("f", 100, "b", 100)'}],entriesAfter:[{name:"[EN] 예제: 앞으로 2초 가기",summary:"[EN] 두 바퀴를 같은 속도로 굴려 2초 동안 직진한 뒤 멈춥니다.",details:`[EN] go_forward_speed는 모터를 "켜기만" 합니다. stop()을 부르기 전까지 계속 굴러가므로, 원하는 시간만큼 delay로 기다린 다음 멈춰야 합니다.

[1] from pibot import KamibotPi
   카미봇 클래스를 불러옵니다.

[2] bot = KamibotPi()
   카미봇 객체를 만듭니다.

[4] bot.go_forward_speed(100, 100)
   왼·오 바퀴를 모두 속도 100으로 앞으로 굴립니다. 같은 속도라서 똑바로 직진합니다.

[5] bot.delay(2)
   2초 동안 그대로 굴러가도록 기다립니다. 이 시간이 곧 이동 시간입니다.

[6] bot.stop()
   두 모터를 멈춥니다. 이 줄이 없으면 카미봇이 계속 직진합니다.

[7] bot.close()
   시리얼 포트를 닫고 종료합니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Drive both wheels forward at the same speed (straight line).
# go_forward_speed only turns the motors ON — they keep running until stop().
bot.go_forward_speed(100, 100)
bot.delay(2)   # keep going for 2 seconds
bot.stop()     # turn the motors off

bot.close()`},{name:"[EN] 예제: 뒤로 2초 가기",summary:"[EN] 두 바퀴를 같은 속도로 굴려 2초 동안 후진한 뒤 멈춥니다.",details:`[EN] "앞으로 2초 가기"와 똑같은 패턴이고, go_forward_speed만 go_backward_speed로 바뀐 것입니다.
이렇게 한 단어만 바꿔서 동작이 달라지는 것을 직접 확인해 보세요.

[4] bot.go_backward_speed(100, 100)
   왼·오 바퀴를 모두 속도 100으로 뒤로 굴립니다.

[5] bot.delay(2)
   2초 동안 그대로 후진합니다.

[6] bot.stop()
   두 모터를 멈춥니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Same pattern as the "forward 2 seconds" example,
# only the command changes from go_forward_speed to go_backward_speed.
bot.go_backward_speed(100, 100)
bot.delay(2)
bot.stop()

bot.close()`},{name:"[EN] 예제: 제자리에서 돌기",summary:"[EN] 왼쪽 바퀴는 앞으로, 오른쪽 바퀴는 뒤로 굴려 제자리에서 회전합니다.",details:`[EN] 두 바퀴를 같은 속도로 "서로 반대 방향"으로 굴리면 카미봇은 앞으로 나아가지 않고 제자리에서 빙글 돌게 됩니다. go_dir_speed 한 줄이면 됩니다.

[4] bot.go_dir_speed("f", 100, "b", 100)
   왼쪽: "f"(앞으로) 속도 100, 오른쪽: "b"(뒤로) 속도 100.
   두 바퀴가 반대로 돌기 때문에 몸체가 자리를 떠나지 않고 회전합니다.

[5] bot.delay(2)
   2초 동안 회전을 유지합니다. 시간을 늘리면 더 많이 돕니다.

[6] bot.stop()
   회전을 멈춥니다.

※ 반대 방향으로 돌리고 싶으면 ldir과 rdir을 서로 바꾸면 됩니다 (예: "b", 100, "f", 100).`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Spin in place: left wheel forward, right wheel backward.
# When the two wheels turn in opposite directions at the same speed,
# the body rotates without moving its position.
bot.go_dir_speed("f", 100, "b", 100)
bot.delay(2)   # spin for 2 seconds
bot.stop()

bot.close()`},{name:"[EN] 예제: S자로 움직이기",summary:"[EN] 왼쪽 커브와 오른쪽 커브를 번갈아가며 진행해 S자 모양으로 이동합니다.",details:`[EN] S자 곡선은 "왼쪽으로 휘기 → 오른쪽으로 휘기"를 번갈아 한 묶음입니다.
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

bot = KamibotPi()

# An S-curve = "curve left, then curve right" repeated.
# go_left_speed makes the robot curve to the left (only one wheel turns),
# and go_right_speed makes it curve to the right.
T = 1.0  # seconds per curve segment — bigger T = bigger S

for _ in range(2):
    bot.go_left_speed(100)   # curve to the left
    bot.delay(T)
    bot.go_right_speed(100)  # curve to the right
    bot.delay(T)

bot.stop()
bot.close()`}]},{id:"precision",title:"[EN] 정밀 제어 (cm/초/스텝)",description:"[EN] 단위를 지정해 정확하게 이동",icon:"straighten",entries:[{name:"[EN] bot.move_forward_unit(value, opt, speed)",summary:"[EN] 앞으로 지정 단위만큼 이동합니다.",details:`[EN] Args:
  value (int): 이동값
  opt (str): "-l" cm, "-t" 초, "-s" 스텝
  speed (int): 속도
Returns: None`,example:'bot.move_forward_unit(20, "-l", 50)'},{name:"[EN] bot.move_backward_unit(value, opt, speed)",summary:"[EN] 뒤로 지정 단위만큼 이동합니다.",details:`[EN] Args:
  value (int): 이동값
  opt (str): "-l" cm, "-t" 초, "-s" 스텝
  speed (int): 속도
Returns: None`,example:'bot.move_backward_unit(20, "-l", 50)'},{name:"[EN] bot.move_left_unit(value, opt, speed)",summary:"[EN] 왼쪽으로 지정 단위만큼 이동합니다.",details:`[EN] Args:
  value (int): 이동값
  opt (str): "-l" cm, "-t" 초, "-s" 스텝
  speed (int): 속도
Returns: None`,example:'bot.move_left_unit(10, "-l", 50)'},{name:"[EN] bot.move_right_unit(value, opt, speed)",summary:"[EN] 오른쪽으로 지정 단위만큼 이동합니다.",details:`[EN] Args:
  value (int): 이동값
  opt (str): "-l" cm, "-t" 초, "-s" 스텝
  speed (int): 속도
Returns: None`,example:'bot.move_right_unit(10, "-l", 50)'},{name:"[EN] bot.turn_left_speed(value, speed)",summary:"[EN] 제자리에서 왼쪽으로 회전합니다.",details:`[EN] Args:
  value (int): 회전각도
  speed (int): 속도
Returns: None`,example:"bot.turn_left_speed(90, 50)"},{name:"[EN] bot.turn_right_speed(value, speed)",summary:"[EN] 제자리에서 오른쪽으로 회전합니다.",details:`[EN] Args:
  value (int): 회전각도
  speed (int): 속도
Returns: None`,example:"bot.turn_right_speed(90, 50)"},{name:"[EN] bot.move_step(ldir, lstep, rdir, rstep)",summary:"[EN] 두 모터의 방향과 스텝수를 각각 지정합니다.",details:`[EN] Args:
  ldir, rdir (str): "f" 앞으로 / "b" 뒤로
  lstep, rstep (int): 스텝수
Returns: None`,example:'bot.move_step("f", 200, "f", 200)'},{name:"[EN] bot.move_time(ldir, lsec, rdir, rsec)",summary:"[EN] 두 모터의 방향과 작동 시간을 각각 지정합니다.",details:`[EN] Args:
  ldir, rdir (str): "f" 앞으로 / "b" 뒤로
  lsec, rsec (int): 작동 시간(초)
Returns: None`,example:'bot.move_time("f", 2, "f", 2)'},{name:"[EN] bot.turn_continous(dir, speed)",summary:"[EN] 지정 방향으로 계속 회전합니다.",details:`[EN] Args:
  dir (str): "l" 왼쪽 / "r" 오른쪽
  speed (int): 속도
Returns: None`,example:'bot.turn_continous("r", 100)'}],entriesAfter:[{name:"[EN] 예제 1: 30cm 갔다가 돌아오기",summary:'[EN] "-l" 옵션으로 정확히 30cm를 직진하고, 180°로 돌아 다시 출발점으로 돌아옵니다. 단위·각도의 기본을 익히는 첫 예제입니다.',details:`[EN] 학습 포인트:
  · "-l"은 length(길이) 옵션으로 value를 cm로 해석합니다. ("-t"=초, "-s"=스텝)
  · 속도(speed)는 0~100 사이 값. 50은 중간 속도입니다.
  · turn_right_speed(180, 50) = 제자리에서 반 바퀴(180°) 회전.

코드 흐름:
  1) 앞으로 30cm 이동
  2) 제자리에서 180° 회전
  3) 다시 30cm 이동 → 처음 자리
  4) bot.close()로 통신 포트 닫기

※ 스스로 해보기: 30을 50으로 바꿔보고, 자가 거리 측정한 값과 비교해 보세요. 바닥 재질에 따라 실제 이동 거리가 살짝 달라질 수 있습니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Go forward exactly 30 cm.
# "-l" tells the robot the value (30) is in centimeters (length).
# Speed 50 is a comfortable mid-range speed (0-100).
bot.move_forward_unit(30, "-l", 50)

# Spin in place 180 degrees so the robot faces back home.
bot.turn_right_speed(180, 50)

# Go forward again — the robot returns to the starting spot.
bot.move_forward_unit(30, "-l", 50)

bot.close()`},{name:"[EN] 예제 2: 정사각형 그리기",summary:"[EN] 한 변 20cm짜리 정사각형을 for 반복문으로 그립니다. 변 길이와 속도는 변수로 빼서 한 곳만 바꿔도 크기/속도가 바뀌도록 만들었습니다.",details:`[EN] 학습 포인트:
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

bot = KamibotPi()

SIDE = 20    # length of one side in cm
SPEED = 50   # 0 to 100

# A square has 4 equal sides and 4 right-angle (90°) corners.
# Pattern: go forward one side, then turn 90° right. Repeat 4 times.
for _ in range(4):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(90, SPEED)

bot.close()`},{name:"[EN] 예제 3: 정삼각형 그리기 (외각 개념)",summary:"[EN] 한 변 25cm짜리 정삼각형을 그립니다. 핵심은 회전 각도가 60°가 아니라 120°라는 것!",details:`[EN] 학습 포인트 — "외각"이 핵심입니다:
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

bot = KamibotPi()

SIDE = 25
SPEED = 50

# Robots turn by the EXTERIOR angle at each corner, not the interior one.
# For any regular polygon: exterior angle = 360 / number_of_sides.
# Triangle => 360 / 3 = 120°.
SIDES = 3
TURN = 360 // SIDES   # = 120

for _ in range(SIDES):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"[EN] 예제 4: 5각 별(★) 한 붓 그리기",summary:"[EN] 연필을 떼지 않고 별을 그리는 방법 그대로, 카미봇이 5개 꼭짓점을 144°씩 꺾으며 별을 그립니다.",details:`[EN] 학습 포인트 — 왜 144°일까?
  · 별을 한 붓 그리기로 그릴 때, 시작점에 돌아오면 카미봇은 두 바퀴(720°)를 돌게 됩니다.
  · 꼭짓점이 5개이므로 한 점에서 회전 = 720 / 5 = 144°.
  · 정n각형 공식(360 / n)과 다른 이유: 별은 같은 점을 두 번 가로지르며 한 붓에 그리기 때문에 두 바퀴를 돕니다.

코드는 예제 3과 같은 모양입니다 — 회전 각도와 반복 횟수만 다릅니다.
같은 패턴(직진 → 회전 → 반복)으로 도형이 얼마나 다양해지는지 비교해 보세요.

※ 스스로 해보기:
  · 7각 별을 그리려면? 점 사이를 두 칸씩 건너뛰면 회전합 = 720°이므로 720 / 7 ≈ 103°.
  · SIDE를 너무 크게 하면 공간 부족! 30~40cm 정도가 적당합니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 30
SPEED = 50

# A 5-pointed star is drawn in one stroke by skipping every other vertex.
# When you finish, the robot has rotated a total of 720° (two full laps).
# 720° / 5 corners = 144° turn at each point.
POINT_TURN = 144

for _ in range(5):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(POINT_TURN, SPEED)

bot.close()`},{name:"[EN] 예제 5: 두 바퀴 따로 굴려 곡선·회전 만들기",summary:"[EN] move_step으로 좌·우 모터 스텝수를 따로 지정해 직진 → 오른쪽 호 → 제자리 회전을 차례대로 시연합니다.",details:`[EN] 학습 포인트 — move_step의 4개 인자:
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

bot = KamibotPi()

# move_step(left_dir, left_steps, right_dir, right_steps)
# Three simple rules:
#   1) same direction, same steps  -> straight line
#   2) one wheel runs more steps   -> curves toward the slower wheel
#   3) opposite directions         -> spins in place

# 1) Straight line: both wheels go forward 200 steps.
bot.move_step("f", 200, "f", 200)
bot.delay(0.5)

# 2) Curve to the right: left wheel runs more than the right.
bot.move_step("f", 300, "f", 150)
bot.delay(0.5)

# 3) Spin in place clockwise: left forward, right backward.
bot.move_step("f", 200, "b", 200)

bot.close()`}]},{id:"top-motor",title:"[EN] 탑 모터",description:"[EN] 상단 스텝 모터(펜대 등) 제어",icon:"rotate_right",entries:[{name:"[EN] bot.top_motor_degree(dir, value, speed)",summary:"[EN] 탑 모터를 지정 각도만큼 회전시킵니다.",details:`[EN] Args:
  dir (str): "l" 왼쪽 / "r" 오른쪽
  value (int): 각도
  speed (int): 속도
Returns: None`,example:'bot.top_motor_degree("r", 90, 50)'},{name:"[EN] bot.top_motor_abspos(degree, speed)",summary:"[EN] 탑 모터를 절대 각도 위치로 이동시킵니다.",details:`[EN] Args:
  degree (int): 절대 각도 (최대 65000)
  speed (int): 속도
Returns: None`,example:"bot.top_motor_abspos(180, 50)"},{name:"[EN] bot.top_motor_time(dir, value, speed)",summary:"[EN] 탑 모터를 지정 시간만큼 회전시킵니다.",details:`[EN] Args:
  dir (str): "l" 왼쪽 / "r" 오른쪽
  value (int): 시간(초)
  speed (int): 속도
Returns: None`,example:'bot.top_motor_time("l", 3, 50)'},{name:"[EN] bot.top_motor_round(dir, value, speed)",summary:"[EN] 탑 모터를 지정 회전수만큼 회전시킵니다.",details:`[EN] Args:
  dir (str): "l" 왼쪽 / "r" 오른쪽
  value (int): 회전수
  speed (int): 속도
Returns: None`,example:'bot.top_motor_round("r", 1, 50)'},{name:"[EN] bot.top_motor_stop()",summary:"[EN] 탑 모터 회전을 정지시킵니다.",details:`[EN] Args: 없음
Returns: None`,example:"bot.top_motor_stop()"}],entriesAfter:[{name:"[EN] 예제 1: 펜 90° 들어올렸다가 다시 내리기",summary:"[EN] 오른쪽으로 90° 돌렸다가, 잠깐 쉰 뒤 왼쪽으로 90° 돌려서 정확히 처음 자리로 돌아옵니다. 탑 모터를 처음 다룰 때 가장 안전한 출발점입니다.",details:`[EN] 학습 포인트:
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

bot = KamibotPi()

# Rotate the top motor 90° to the right (e.g., lift a pen up).
# Args: direction ("r"/"l"), angle in degrees, speed (0-100).
bot.top_motor_degree("r", 90, 50)

# Pause briefly so the motor fully stops before the next move.
bot.delay(0.5)

# Rotate 90° back to the LEFT — this returns to the starting position.
bot.top_motor_degree("l", 90, 50)

bot.close()`},{name:"[EN] 예제 2: 절대 위치로 정확히 이동하기",summary:'[EN] top_motor_abspos는 "지금 어디에 있든 → 정확히 이 각도로" 이동합니다. 0° → 180° → 0°을 순서대로 시연합니다.',details:`[EN] 학습 포인트 — 상대 회전 vs 절대 위치:
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

bot = KamibotPi()

# abspos = "absolute position" — go to this exact angle, no matter where we are.
# Different from top_motor_degree, which adds an angle to the current pose.
bot.top_motor_abspos(180, 50)

bot.delay(1)

# Return to the starting reference (0°).
bot.top_motor_abspos(0, 50)

bot.close()`},{name:"[EN] 예제 3: 좌우로 5번 흔들기 (반복문 활용)",summary:"[EN] for 반복문으로 오른쪽 30° → 왼쪽 30°을 5번 반복합니다. 매번 좌우가 짝을 이루므로 결국 처음 자리로 돌아옵니다.",details:`[EN] 학습 포인트:
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

bot = KamibotPi()

ANGLE = 30   # how far each swing goes (degrees)
TIMES = 5    # how many full left-right cycles
SPEED = 60

# Each iteration swings right then back left by the same angle,
# so the motor finishes exactly where it started.
for _ in range(TIMES):
    bot.top_motor_degree("r", ANGLE, SPEED)
    bot.delay(0.3)
    bot.top_motor_degree("l", ANGLE, SPEED)
    bot.delay(0.3)

bot.close()`}]},{id:"shapes",title:"[EN] 도형 그리기",description:"[EN] 삼각형, 사각형, 별, 원호 등 그리기",icon:"category",entries:[{name:"[EN] bot.draw_tri(len)",summary:"[EN] 한 변의 길이를 지정해 삼각형을 그립니다.",details:`[EN] Args:
  len (int): 한 변의 길이(cm)
Returns: None`,example:"bot.draw_tri(20)"},{name:"[EN] bot.draw_rect(len)",summary:"[EN] 한 변의 길이를 지정해 사각형을 그립니다.",details:`[EN] Args:
  len (int): 한 변의 길이(cm)
Returns: None`,example:"bot.draw_rect(20)"},{name:"[EN] bot.draw_penta(len)",summary:"[EN] 한 변의 길이를 지정해 오각형을 그립니다.",details:`[EN] Args:
  len (int): 한 변의 길이(cm)
Returns: None`,example:"bot.draw_penta(20)"},{name:"[EN] bot.draw_hexa(len)",summary:"[EN] 한 변의 길이를 지정해 육각형을 그립니다.",details:`[EN] Args:
  len (int): 한 변의 길이(cm)
Returns: None`,example:"bot.draw_hexa(20)"},{name:"[EN] bot.draw_star(len)",summary:"[EN] 한 변의 길이를 지정해 별을 그립니다.",details:`[EN] Args:
  len (int): 한 변의 길이(cm)
Returns: None`,example:"bot.draw_star(20)"},{name:"[EN] bot.draw_circle(len)",summary:"[EN] 반지름을 지정해 원을 그립니다.",details:`[EN] Args:
  len (int): 반지름
Returns: None`,example:"bot.draw_circle(15)"},{name:'[EN] bot.draw_semicircle(len, side="l")',summary:"[EN] 반원을 그립니다.",details:`[EN] Args:
  len (int): 반지름
  side (str): "l" 왼쪽 / "r" 오른쪽
Returns: None`,example:'bot.draw_semicircle(15, "l")'},{name:"[EN] bot.draw_arc(radius, value, mode=0)",summary:"[EN] 시간 또는 각도 단위로 원호를 그립니다.",details:`[EN] Args:
  radius (int): 반지름
  value (int): mode가 0이면 시간(초), 1이면 각도
  mode (int): 0 시간 / 1 각도
Returns: None`,example:"bot.draw_arc(15, 2, 0)"}],entriesAfter:[{name:"[EN] 예제 1: 도형 4총사 (삼·사·오·육각형 줄지어 그리기)",summary:"[EN] draw_tri / draw_rect / draw_penta / draw_hexa를 차례로 호출해 변의 수가 다른 네 가지 도형을 한 줄에 늘어놓습니다.",details:`[EN] 학습 포인트:
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

bot = KamibotPi()

SIDE = 20      # length of one side in cm
SPEED = 50
GAP = 25       # space between shapes

# 1) Triangle: 3 sides
bot.draw_tri(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 2) Square: 4 sides
bot.draw_rect(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 3) Pentagon: 5 sides
bot.draw_penta(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 4) Hexagon: 6 sides — already starts to look like a circle!
bot.draw_hexa(SIDE)

bot.close()`},{name:"[EN] 예제 2: 사각형 풍차 (회전을 반복해 꽃 모양 만들기)",summary:"[EN] 사각형 한 개를 그릴 때마다 제자리에서 30°씩 회전합니다. 12번 반복하면 360°를 한 바퀴 다 돌아 사각형 12개가 겹친 풍차/꽃 모양이 됩니다.",details:`[EN] 학습 포인트 — "도형 + 회전"의 조합:
  · draw_rect는 한 번 그리면 시작점·시작 각도로 돌아옵니다.
  · 매번 30°씩 더 돌면 다음 사각형은 30°만큼 기울어진 자리에서 그려집니다.
  · 360 / 30 = 12 → 정확히 12번 반복하면 한 바퀴를 채워 패턴이 닫힙니다.

코드 흐름:
  · for _ in range(12): 같은 동작을 12번
  · 한 번 반복: 사각형 그리기 → 오른쪽으로 30° 회전

※ 스스로 해보기:
  · TURN을 60°(반복 6번), 45°(반복 8번)로 바꿔 꽃잎 수를 조절해 보세요.
  · draw_rect를 draw_tri로 바꾸면 삼각형 풍차가 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 15
SPEED = 50
TURN = 30                # degrees to rotate between shapes
PETALS = 360 // TURN     # = 12 — fits exactly one full lap

# Draw the same square many times, rotating a little each time.
# After PETALS iterations the total rotation is 360° → flower complete.
for _ in range(PETALS):
    bot.draw_rect(SIDE)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"[EN] 예제 3: 점점 커지는 삼각형 (리스트로 크기 바꾸기)",summary:"[EN] 변 길이를 10, 15, 20, 25로 키워가며 삼각형 4개를 차례로 그립니다. 같은 함수에 다른 값을 넣으면 결과가 어떻게 달라지는지 한눈에 보여줍니다.",details:`[EN] 학습 포인트 — "리스트로 값을 차례차례 넘겨주기":
  · 같은 동작을 다른 값으로 반복할 때는 리스트가 깔끔합니다.
  · sizes = [10, 15, 20, 25]처럼 미리 적어두고 for로 하나씩 꺼내 사용.
  · 값을 추가/변경하기도 쉬워, 코드 본문은 거의 손대지 않고 결과만 바꿀 수 있습니다.

코드 흐름:
  · sizes 리스트를 만든다
  · for size in sizes: 삼각형(size) 그리기 → 옆으로 이동

※ 스스로 해보기:
  · sizes = [25, 20, 15, 10]으로 뒤집으면 점점 작아지는 효과가 됩니다.
  · draw_tri 자리에 draw_penta를 넣으면 오각형 4개 시리즈로 바뀝니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SPEED = 50
GAP = 30

# A list of side lengths — same shape, different sizes.
sizes = [10, 15, 20, 25]

for size in sizes:
    bot.draw_tri(size)                        # draw a triangle of this size
    bot.move_forward_unit(GAP, "-l", SPEED)   # move over to the next spot

bot.close()`},{name:"[EN] 예제 4: 곡선 길 만들기 (원과 반원 조합)",summary:"[EN] draw_circle로 원 하나를 그리고, 그다음 draw_semicircle을 좌·우로 번갈아 호출해 S자 모양 길을 이어 그립니다.",details:`[EN] 학습 포인트 — 곡선 도형 함수들:
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

bot = KamibotPi()

R = 12          # radius for both the circle and the semicircles
SPEED = 50

# 1) One full circle — robot returns to its starting point.
bot.draw_circle(R)

# Move forward a bit so the curves don't overlap with the circle.
bot.move_forward_unit(20, "-l", SPEED)

# 2) S-curve: left half-circle, then right, then left again.
# Half-circles do NOT return to the start — they end on the far side.
bot.draw_semicircle(R, "l")
bot.draw_semicircle(R, "r")
bot.draw_semicircle(R, "l")

bot.close()`},{name:"[EN] 예제 5: 별 3개 일렬로 (도형 + 이동의 반복)",summary:"[EN] draw_star로 별을 그린 뒤 옆으로 살짝 이동, 다시 별을 그립니다. for 반복문으로 같은 동작을 3번 반복하면 별 3개가 일렬로 늘어섭니다.",details:`[EN] 학습 포인트 — "그리기 + 이동" 한 묶음을 반복하기:
  · draw_star(SIDE)는 별 한 개를 그리고 시작점으로 돌아옵니다.
  · 별 사이에 간격을 두려면 별을 그린 뒤 직진으로 GAP만큼 이동해 줘야 합니다.
  · "도형 그리기 + 이동"을 한 묶음으로 보고 for로 반복하면, 같은 도형이 일정 간격으로 반복되는 패턴이 됩니다.

코드 흐름:
  · for _ in range(STARS): 별 그리기 → 앞으로 GAP cm 이동

※ 스스로 해보기:
  · STARS = 5로 늘려 별을 더 많이 그리려면 GAP·SIDE를 더 작게 잡아야 공간 안에 들어갑니다.
  · 매 반복마다 turn_right_speed(60, SPEED)를 추가하면 별이 부채꼴로 펼쳐집니다.
  · draw_star를 draw_penta로 바꾸면 오각형이 일렬로 늘어선 모양이 됩니다.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 12       # one side length of the star (cm)
GAP = 25        # spacing between stars
STARS = 3
SPEED = 50

# Pattern: draw a star, move sideways, draw the next one.
for _ in range(STARS):
    bot.draw_star(SIDE)
    bot.move_forward_unit(GAP, "-l", SPEED)

bot.close()`}]},{id:"sensors",title:"[EN] 센서",description:"[EN] 물체·라인·컬러 센서 값 읽기",icon:"sensors",entries:[{name:"[EN] bot.get_object_detect(opt=True)",summary:"[EN] 좌·우 물체 감지 센서 값을 읽습니다.",details:`[EN] Args:
  opt (bool): True 동작 / False 멈춤
Returns:
  (left, right) — 좌·우 감지값`,example:`left, right = bot.get_object_detect()
print(left, right)`},{name:"[EN] bot.get_line_sensor(opt=True)",summary:"[EN] 왼쪽·중앙·오른쪽 라인 센서 값을 읽습니다.",details:`[EN] Args:
  opt (bool): True 동작 / False 멈춤
Returns:
  (left, center, right) — 라인 감지값`,example:`l, c, r = bot.get_line_sensor()
print(l, c, r)`},{name:"[EN] bot.get_color_sensor(opt=True)",summary:"[EN] 컬러 센서로 색상 인덱스를 읽습니다.",details:`[EN] Args:
  opt (bool): True 동작 / False 멈춤
Returns:
  color (int) — 색상 인덱스`,example:`color = bot.get_color_sensor()
print(color)`},{name:"[EN] bot.get_color_elements(opt=True)",summary:"[EN] 컬러 센서로 RGB 값을 읽습니다.",details:`[EN] Args:
  opt (bool): True 동작 / False 멈춤
Returns:
  (r, g, b) — RGB 성분`,example:`r, g, b = bot.get_color_elements()
print(r, g, b)`}],entriesAfter:[{name:"[EN] 예제 1: 물체를 만나면 멈추기 (장애물 감지)",summary:"[EN] 카미봇이 천천히 직진하면서 앞쪽 물체 센서를 계속 확인합니다. 좌·우 어느 쪽이든 물체가 감지되면 즉시 멈추고 빨간 LED를 켭니다.",details:`[EN] 학습 포인트 — "센서를 반복해서 확인하기":
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

bot = KamibotPi()

SPEED = 30   # slow forward speed (0-100)

try:
    bot.turn_led(0, 255, 0)              # green = "all clear, moving"
    bot.go_forward_speed(SPEED, SPEED)   # both wheels forward

    while True:
        left, right = bot.get_object_detect()
        if left or right:                # object on either side
            break
        bot.delay(0.05)                  # check ~20 times per second

    bot.stop()
    bot.turn_led(255, 0, 0)              # red = "stopped, obstacle!"
    bot.beep()
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"[EN] 예제 2: 컬러 센서가 본 색을 LED로 그대로 따라하기",summary:"[EN] get_color_elements로 (R, G, B) 값을 읽어 turn_led에 그대로 넘겨주면 카미봇이 본 색을 LED로 똑같이 표현합니다. 종이 색을 바꾸면 LED 색도 바뀝니다.",details:`[EN] 학습 포인트 — "센서값을 다른 함수의 인자로 흘려보내기":
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

bot = KamibotPi()

try:
    for _ in range(20):
        # Read RGB the color sensor sees right now.
        r, g, b = bot.get_color_elements()
        print("sensor RGB =", r, g, b)

        # Pass the same values straight to the LED.
        bot.turn_led(r, g, b)

        bot.delay(1)
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"[EN] 예제 3: 색깔 신호등 (색상 인덱스로 다른 동작)",summary:"[EN] get_color_sensor가 돌려주는 색상 인덱스로 if/elif 분기. 빨강이면 정지, 초록이면 직진, 파랑이면 제자리 회전 — 종이 신호등으로 카미봇 조종.",details:`[EN] 학습 포인트 — "if/elif/else로 분기 처리":
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

bot = KamibotPi()

# Color index → meaning
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
            bot.move_forward_unit(5, "-l", 40)   # short forward step (5 cm)
        elif color == BLUE:
            bot.turn_led_idx(BLUE)
            bot.turn_right_speed(45, 40)         # spin in place
        else:
            bot.turn_led(0, 0, 0)                # unknown color → LED off

        bot.delay(0.3)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"[EN] 예제 4: 라인 따라가기 (3센서 라인트레이서)",summary:"[EN] 왼쪽·중앙·오른쪽 라인 센서를 동시에 보고 미세 좌·우 회전으로 검은 라인을 따라갑니다. 라인이 가운데에 있으면 직진, 한쪽으로 치우치면 그 방향으로 살짝 보정.",details:`[EN] 학습 포인트 — "다중 센서로 폐루프 제어":
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

bot = KamibotPi()

STEP = 3      # cm to advance per loop
SPEED = 35
TURN = 15     # small correction angle

try:
    for _ in range(60):
        l, c, r = bot.get_line_sensor()
        print("line L/C/R =", l, c, r)

        if c and not l and not r:
            bot.turn_led_idx(3)                       # green = on track
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif l and not r:
            bot.turn_led_idx(4)                       # blue = drifting right, correct left
            bot.turn_left_speed(TURN, SPEED)
        elif r and not l:
            bot.turn_led_idx(2)                       # yellow = drifting left, correct right
            bot.turn_right_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                       # red = lost the line
            bot.stop()
            break
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"[EN] 예제 5: 장애물 피해가기 (좌·우 물체 센서 비교)",summary:"[EN] 좌·우 물체 센서를 비교해 비어 있는 쪽으로 피합니다. 왼쪽에 물체 → 오른쪽 회전, 오른쪽에 물체 → 왼쪽 회전, 양쪽 다 막히면 후진 후 큰 회전.",details:`[EN] 학습 포인트 — "두 센서값을 비교해 동작 선택":
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

bot = KamibotPi()

SPEED = 35
TURN = 30        # avoidance turn angle (degrees)
STEP = 4         # forward step when path is clear (cm)

try:
    for _ in range(100):
        left, right = bot.get_object_detect()
        print("obj L/R =", left, right)

        if not left and not right:
            bot.turn_led_idx(3)                          # green = clear path
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif left and not right:
            bot.turn_led_idx(2)                          # yellow = obstacle on the left
            bot.turn_right_speed(TURN, SPEED)
        elif right and not left:
            bot.turn_led_idx(2)                          # yellow = obstacle on the right
            bot.turn_left_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                          # red = blocked both sides
            bot.beep()
            bot.move_backward_unit(5, "-l", SPEED)       # back up
            bot.turn_right_speed(TURN * 3, SPEED)        # bigger turn to escape

        bot.delay(0.1)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"[EN] 예제 6: 라인 따라가다 교차로에서 멈추기",summary:"[EN] 왼쪽·중앙·오른쪽 라인 센서로 검은 라인을 따라가다가, 세 센서가 모두 라인을 감지하는 지점(굵은 라인·교차로)을 만나면 잠깐 전진 후 제자리에서 90도 회전하고 종료합니다.",details:`[EN] 학습 포인트 — "라인 추종 + 종료 조건":
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
        robot.go_forward_speed(80, 30)  # 우회전`}]},{id:"misc",title:"[EN] 라인트레이서 / 정보",description:"[EN] 라인트레이서 토글, 배터리·버전 조회",icon:"route",entries:[{name:"[EN] bot.toggle_linetracer(mode, speed=100)",summary:"[EN] 라인트레이서 기능을 켜거나 끕니다.",details:`[EN] Args:
  mode (bool): True 켜기 / False 끄기
  speed (int): 라인트레이서 속도
Returns: None`,example:"bot.toggle_linetracer(True, 80)"},{name:"[EN] bot.get_battery()",summary:"[EN] 현재 배터리 잔량을 읽어옵니다.",details:`[EN] Args: 없음
Returns:
  battery (int) — 배터리값`,example:`level = bot.get_battery()
print(level)`},{name:"[EN] bot.get_version()",summary:"[EN] 펌웨어 버전을 조회합니다.",details:`[EN] Args: 없음
Returns: None (출력은 시리얼 응답으로)`,example:"bot.get_version()"}]},{id:"basic-move",title:"[EN] 기본 이동 (맵보드)",description:"[EN] 맵보드 칸 단위로 이동/회전",icon:"arrow_forward",notice:"이 기능은 전용 맵보드가 필요합니다.",entries:[{name:'[EN] bot.move_forward(value, opt="-l")',summary:"[EN] 앞으로 지정한 칸 수만큼 이동합니다.",details:`[EN] Args:
  value (int): 이동 칸수
  opt (str): "-l" 라인맵보드, "-b" 블록맵보드
Returns: None`,example:"bot.move_forward(2)"},{name:"[EN] bot.move_backward(value)",summary:"[EN] 뒤로 지정한 칸 수만큼 이동합니다 (블록맵보드 전용).",details:`[EN] Args:
  value (int): 이동 칸수
Returns: None`,example:"bot.move_backward(1)"},{name:'[EN] bot.turn_left(value=1, opt="-l")',summary:"[EN] 왼쪽으로 회전합니다.",details:`[EN] Args:
  value (int): 회전 횟수 (라인맵에서는 무시되고 1회만 실행)
  opt (str): "-l" 라인맵, "-b" 블록맵
Returns: None`,example:"bot.turn_left()"},{name:'[EN] bot.turn_right(value=1, opt="-l")',summary:"[EN] 오른쪽으로 회전합니다.",details:`[EN] Args:
  value (int): 회전 횟수 (라인맵에서는 무시되고 1회만 실행)
  opt (str): "-l" 라인맵, "-b" 블록맵
Returns: None`,example:"bot.turn_right()"},{name:'[EN] bot.turn_back(value=1, opt="-l")',summary:"[EN] 뒤로 (180도) 회전합니다.",details:`[EN] Args:
  value (int): 회전 횟수 (라인맵에서는 무시되고 1회만 실행)
  opt (str): "-l" 라인맵, "-b" 블록맵
Returns: None`,example:"bot.turn_back()"}]}];export{e as REFERENCE};
