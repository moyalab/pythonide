# -*-coding:utf-8-*-
"""컴블럭(Bitblock) 메인보드 제어용 사용자 진입 클래스 모듈.

이 모듈은 컴블럭과 시리얼(UART) 로 주고받는 20바이트 고정 길이 패킷을
사람 친화적인 메서드 호출로 감싸는 :class:`Bitblock` 클래스를 정의합니다.
사용자는 보통 다음과 같이 한 줄로 시작합니다::

    from pycombb.bitblock import Bitblock, COLOR

    bot = Bitblock()
    bot.connect()
    bot.display.color(COLOR.RED)
    a, b = bot.button()
    bot.disconnect()

내부 구조 요약:

* :class:`Bitblock` — 시리얼 연결, 패킷 송수신, 그리고 사용자에게 노출
  되는 모든 고수준 메서드(부저, 버튼, 터치, 기울기, 빛/소리 센서, 디지털
  ·아날로그 입출력, 서보, DC 모터, 초음파, DHT11)를 보유합니다.
* :class:`Bitblock.Display` — 5x5 LED 매트릭스 출력 전용 헬퍼. 색상,
  심볼, 행 단위, 좌표, 밝기, 효과 모드를 모두 노출합니다.
* :class:`Bitblock.PIN` — 인스턴스 단위 핀 매핑(``bot.pin.P0`` 형태로
  접근). 클래스 단위 :class:`pycombb.bitblock.PIN` 과 값이 다른 항목이
  있을 수 있으므로, 사용자 코드는 인스턴스 매핑을 우선 사용합니다.
* :class:`Bitblock.RCCar` — :meth:`Bitblock.rccar_init` 으로 진입하는
  RC카 모드 컨트롤러. 전·후진, 회전, 제자리 돌기, 라인/거리 센서, 후면
  서보 핀을 한 곳에서 제공합니다.

웹 IDE 환경에서는 ``serial`` / ``termcolor`` 패키지가 폴리필 형태로 제공됩니다.
"""
import serial
import time
from .constants import *
from .utils import *
from termcolor import cprint

__all__ = [
    "Bitblock",
]

class Bitblock():
    """컴블럭 메인보드와의 시리얼 연결을 캡슐화한 컨트롤러 클래스.

    하나의 인스턴스는 하나의 시리얼 포트에 대응합니다. 인스턴스 생성 시점에
    실제로 포트를 열지는 않으며, :meth:`connect` 호출 시점에 ``serial.Serial``
    객체가 만들어집니다. 모든 명령은 :data:`NULL_COMMAND_PACKET` 사본을
    필요한 만큼 채워서 :meth:`__send` 로 내려보내고, 응답이 필요한 명령은
    :meth:`read_data` 로 20바이트를 동기적으로 읽어 옵니다.

    Attributes:
        display (Bitblock.Display): LED 매트릭스 출력 전용 헬퍼.
        pin (Bitblock.PIN): 인스턴스 단위 핀 매핑(``bot.pin.P0`` 등).

    Examples:
        기본 사용 흐름::

            bot = Bitblock()
            bot.connect()
            bot.display.color("#00ff00")
            print(bot.button())
            bot.disconnect()
    """

    def __init__(self, port=None, timeout=5, baud=57600, verbose=False):
        """컨트롤러를 초기화합니다(아직 포트를 열지는 않습니다).

        Args:
            port (str | None): 시리얼 포트 이름(예: Windows ``"COM5"``,
                Linux ``"/dev/ttyUSB0"``). 웹 IDE 환경에서는 생략하면
                툴바의 Connect 버튼으로 선택한 Web Serial 포트가 사용됩니다.
            timeout (float): ``serial.Serial`` 의 read 타임아웃(초).
                기본값 ``5``.
            baud (int): 통신 속도. 컴블럭 펌웨어 기본값인 ``57600``.
            verbose (bool): 내부 디버그 출력 플래그. 현재는 보존만 되고
                동작에는 영향을 주지 않습니다.
        """
        self.__verbose = verbose
        self.__port = port or 'WEBSERIAL'
        self.__timeout = timeout
        self.__baud = baud
        self.__client = None
        self._packetIndex = 1;
        self._pendingIndices = set()    # 송신 후 응답을 못 받은 인덱스들
        self.display = self.Display(self)
        self.pin = self.PIN()

        self.__sensors = {
            'switch': [0, 0],
            'mic': 0,
            'lightSensor': [0, 0],
            'touchSensor': [0, 0, 0],
            'mpuSensor': [0, 0, 0, 0], # left, right, top, bottom
        };

    def connect(self):
        """저장된 포트로 시리얼 연결을 엽니다.

        ``__init__`` 에서 받은 ``port`` / ``baud`` / ``timeout`` 으로
        ``serial.Serial`` 인스턴스를 만들고 출력 버퍼를 비웁니다. 이미 연결
        되어 있거나 ``port`` 가 비어 있으면 아무 일도 하지 않고 ``False`` 를
        반환합니다.

        Returns:
            bool: 새로 연결을 연 경우 ``True``, 그렇지 않으면 ``False``.
        """
        if self.__port and not self.__client:
            cprint(f'👽 Connect {self.__port}', "green")

            self.__client = serial.Serial(self.__port, self.__baud, timeout=self.__timeout)
            self.__client.flush()

            return True
        return False

    def disconnect(self):
        """열려 있는 시리얼 연결을 안전하게 닫습니다.

        포트가 열려 있는 경우에만 ``flush`` 후 ``close`` 를 호출합니다.
        ``serial`` 폴리필이 발생시킬 수 있는 예외는 모두 무시되며, 이미
        닫혀 있거나 ``connect`` 한 적이 없으면 그대로 통과합니다.

        Returns:
            None
        """
        print("💧💧💧")
        print(self.__client)
        print(self.__client)


        if self.__client and self.__client.is_open:
            try:
                cprint(f'🔥 Disconnect {self.__port}', 'red')
                # return asyncio.run(self.__client.disconnect())
                #  에러가 발생해서 호출 안하는 것으로 수정 2024.11.05
                # self._run_async(self.__client.disconnect())

                self.__client.flush()
                self.__client.close()

            except Exception as e:
                pass

    def send_command(self, data):
        """이미 만들어진 명령 패킷(20바이트)을 시리얼로 그대로 전송합니다.

        이 메서드는 외부에서 직접 패킷을 만들어 보낼 때 사용하는 공개 API
        이며, 내부 동작에서는 동등한 ``__send`` 가 사용됩니다.

        Args:
            data (Sequence[int]): 보낼 바이트 시퀀스. 보통 길이 20의 정수
                리스트를 넘깁니다. 내부에서 ``bytes(bytearray(data))`` 로
                변환되어 전송됩니다.

        Returns:
            None
        """
        if self.__client :
            try:
                self.__client.write(bytes(bytearray(data)))
                self.__client.flush()
            except Exception as e:
                print('An Exception occurred!', e)

    def __read_packet_raw(self):
        """동기적으로 20바이트 한 패킷을 모은다(헤더 검사 없음).

        Returns:
            list[int]: 길이 20의 바이트 리스트. 20이 아니면 빈 리스트.
        """
        data = []
        while len(data) < 20:
            if self.__client.inWaiting():
                c = self.__client.read()
                data.append(ord(c))
            else:
                time.sleep(.001)
        return data if len(data) == 20 else []

    def read_data(self):
        """20바이트 응답 패킷을 한 개 반환합니다.

        펌웨어가 100ms 주기로 자발 송신하는 0x66 sensor-report 패킷은
        헤더 검사로 자동 폐기하고 다음 패킷을 읽기 때문에, 호출자는
        0x66 을 절대 보지 않습니다.

        Returns:
            list[int]: 길이 20의 응답 바이트 리스트. 정상이 아닌 경우
            표준출력에 ``"Return data error!"`` 를 찍고 빈 리스트(``[]``)를
            반환합니다.
        """
        while True:
            data = self.__read_packet_raw()
            if not data:
                print('Return data error!')
                return []
            if data[BBRETURN.HEADER_2] == BBRETURN.REPORT_MAGIC:
                continue   # 0x66 보고 패킷 — 폐기하고 다음 패킷
            return data
        
    # def __process_return(self):
    #     data = []
    #     while len(data) < 20:
    #         if self.__client.inWaiting():
    #             c = self.__client.read()
    #             data.append(ord(c))
    #         else:
    #             time.sleep(.1)
    #     # print('return data length {0}'.format(len(data)))
    #     if len(data) == 20:
    #         return data
    #     else:
    #         print('Return data error!') 
    #         return []

    def _drain_serial_nonblocking(self, max_packets=10):
        """시리얼 버퍼에 누적된 패킷을 비차단으로 폐기한다.

        idle 구간에서 펌웨어가 100ms 마다 송신하는 0x66 보고 패킷, 그리고
        fire-and-forget 명령의 늦게 도착한 stale ACK 등을 정리하는 용도다.
        ``inWaiting`` 이 20바이트 이상일 때만 한 패킷을 읽어 폐기하므로
        진행 중인 수신을 가로채지 않는다.

        Args:
            max_packets (int): 한 번 호출에서 폐기할 최대 패킷 수(폭주
                방지). 1초당 보고 패킷이 약 10개이므로 명령 간격이 짧으면
                대부분 0~수 개 폐기로 끝난다.

        Returns:
            int: 실제로 폐기한 패킷 수.
        """
        n = 0
        while n < max_packets and self.__client and self.__client.inWaiting() >= 20:
            for _ in range(20):
                self.__client.read()
            n += 1
        return n

    def __send(self, command):
        """내부 송신 헬퍼: 패킷을 시리얼로 즉시 전송합니다.

        :meth:`send_command` 와 동작은 같지만, ``Bitblock`` 내부 메서드들이
        외부 API 호출 비용 없이 호출하기 위한 사적인 진입점입니다.

        송신 직전에 ``_drain_serial_nonblocking`` 으로 누적된 0x66 보고
        패킷·stale ACK 를 비웁니다. SDK 가 단일 스레드 동기 모델이므로
        직전 명령은 이미 자기 응답을 받고 끝난 상태이며, 남아 있는 데이터는
        모두 폐기 안전한 보고/stale 패킷입니다.

        Args:
            command (Sequence[int]): 길이 20의 명령 패킷.

        Returns:
            None
        """
        if self.__client :
            try:
                self._drain_serial_nonblocking()
            except Exception:
                pass
            try:
                self.__client.write(bytes(bytearray(command)))
                self.__client.flush()
            except Exception as e:
                print('An Exception occurred!', e)

    def __get_index(self):
        """송신용 패킷 인덱스를 1 증가시켜 반환합니다.

        펌웨어가 응답 패킷의 ``BBRETURN.INDEX`` 자리에 같은 값을 돌려주기
        때문에, 이 값은 "어떤 명령에 대한 응답인지" 를 식별하는 시퀀스
        번호 역할을 합니다. 1~255 범위에서 순환하며, 0은 건너뜁니다.

        0을 건너뛰는 이유: transport 가 끊긴 상태에서 ``read_data`` 가
        돌려주는 영바이트 가짜 패킷의 INDEX 자리도 0 이라, 0을 정상 인덱스로
        쓰면 그 시점에 잠깐 끊긴 게 "정상 응답" 으로 오인되어 false 데이터를
        반환할 수 있다. 0을 사용 금지로 두면 모든 INDEX=0 응답을 자연스럽게
        drain 단계에서 폐기할 수 있다.

        발급된 인덱스는 ``_pendingIndices`` 집합에 자동으로 추가되어,
        뒤이은 :meth:`_wait_for_response` 가 순서가 어긋난 응답을
        식별하고 폐기할 수 있게 합니다.

        Returns:
            int: 다음 명령에 사용할 1바이트 시퀀스 번호(1~255).
        """
        self._packetIndex = (self._packetIndex + 1) % 256
        if self._packetIndex == 0:
            self._packetIndex = 1
        self._pendingIndices.add(self._packetIndex)
        return self._packetIndex

    def _send_drop_ack(self, command, *, ack=True):
        """fire-and-forget 명령을 송신하고, 펌웨어 ACK 한 개를 즉시 폐기한다.

        ACK 가 시리얼 버퍼에 stale 로 남아 다음 센서 read 의 응답 매칭을
        방해하는 것을 막기 위함이다. ``read_data`` 가 0x66 보고 패킷은
        이미 자동 폐기하므로 ACK drain 중에도 0x66 혼입에 안전하다.

        Args:
            command (Sequence[int]): 길이 20의 명령 패킷.
            ack (bool): True 면 0.3초 timeout 으로 ACK 1개 폐기 시도.
                펌웨어가 ACK 를 보내지 않는 ``BUZZER_NOTE`` /
                ``BUZZER_CONTINUOUS`` 만 False 로 호출.
        """
        self.__send(command)
        if ack:
            self._wait_for_response(self._packetIndex, timeout=0.3)

    def _wait_for_response(self, expected, timeout=None):
        """``expected`` 인덱스의 응답이 도착할 때까지 다른 패킷을 흘려보낸다.

        BitBlock 펌웨어는 fire-and-forget 명령(``display.*``, ``note``,
        ``digital_write`` 등)에 대해서도 응답 패킷을 돌려보내지만, SDK 의 해당
        메서드들은 그 응답을 읽지 않는다. 그래서 시리얼 버퍼에 stale 응답이
        남고, 다음 센서 호출이 자기 응답 대신 그 응답을 읽어 영구적인
        off-by-one 미스매치가 발생한다. 또한 응답이 송신 순서대로 돌아오지
        않을 수 있는 경우도 같은 메커니즘으로 흡수된다.

        이 메서드는 ``read_data`` 를 반복 호출하면서, 인덱스가 ``expected`` 와
        같은 패킷이 나올 때까지 다른 패킷을 폐기한다. 폐기되는 패킷의
        인덱스가 ``_pendingIndices`` 에 있으면 함께 제거한다(자기 응답이 늦게
        온 fire-and-forget 명령의 마무리 처리).

        Args:
            expected (int): 기다리는 응답 패킷의 INDEX 값.
            timeout (float | None): None 이면 인스턴스 기본값
                (``self.__timeout``) 사용. ACK 폐기처럼 짧게 기다리고 싶을 때
                명시적으로 작은 값을 전달.

        Returns:
            list[int] | None: 매칭된 20바이트 응답 패킷. 타임아웃 안에
            매칭이 안 되거나 ``read_data`` 가 실패하면 ``None``.
        """
        effective_timeout = self.__timeout if timeout is None else timeout
        deadline = time.time() + effective_timeout
        while True:
            packet = self.read_data()
            if not packet:
                self._pendingIndices.discard(expected)
                return None
            idx = packet[BBRETURN.INDEX]
            if idx == expected:
                self._pendingIndices.discard(idx)
                return packet
            # 다른 인덱스 — fire-and-forget 의 ACK 거나 순서가 어긋난 응답.
            self._pendingIndices.discard(idx)
            if time.time() > deadline:
                # 터미널에만 노랑색으로 한 줄 경고(Toast 없음).
                cprint(
                    f"{ERROR.WRONG_PACKET_INDEX} "
                    f"(기다린 인덱스={expected}, timeout {effective_timeout}s)",
                    "yellow",
                )
                self._pendingIndices.discard(expected)
                return None

    class PIN:
        """인스턴스 단위 핀 매핑(``bot.pin.P0`` 형식 접근).

        모듈 수준 :class:`pycombb.bitblock.PIN` 과 일부 핀 번호가 다른
        경우가 있는데, 이는 펌웨어 빌드별로 핀 매핑이 갱신되기 때문입니다.
        사용자 코드는 가능한 한 인스턴스 매핑(``bot.pin.*``)을 사용해
        하드웨어 매핑 변경을 자동으로 따라가도록 합니다.
        """
        def __init__(self):
            """현재 펌웨어 빌드에 맞춰 핀 번호 속성을 채웁니다."""
            self.P0 = 10
            self.P1 = 4
            self.P2 = 8
            self.P3 = 2
            self.P4 = 9
            self.P7 = 39
            self.P11 = 7
            self.P12 = 18
            self.SERVO = 16
            self.DCMOTOR = 46

    # -------------------------------------------------------
    #   DISPLAY (LED MATRIX)
    # -------------------------------------------------------
    class Display():
        """5x5 LED 매트릭스 출력 전용 헬퍼 클래스.

        :class:`Bitblock` 인스턴스 1개당 ``bot.display`` 로 1개가 자동
        생성됩니다. 색상은 모든 메서드에서 ``"#RRGGBB"`` 헥사 문자열,
        ``[R, G, B]`` 리스트/튜플, 또는 :class:`COLOR` 프리셋을 받습니다.

        Examples:
            >>> bot.display.color(COLOR.RED)
            >>> bot.display.symbol([0x04,0x0E,0x1F,0x0E,0x04], "#00ff00")
            >>> bot.display.bright(50)
        """

        def __init__(self, controler=None):
            """``Bitblock`` 인스턴스에 묶인 디스플레이 헬퍼를 만듭니다.

            Args:
                controler (Bitblock): 패킷 송신을 위임할 상위 컨트롤러.
                    인덱스 발급(``__get_index``)과 시리얼 전송(``__send``)에
                    사용됩니다.
            """
            self.__controller = controler

        def __color(self, color):
            """다양한 입력 형식의 색상을 ``(r, g, b)`` 튜플로 정규화합니다.

            Args:
                color (str | list[int] | tuple[int, int, int]): 색상 입력.
                    ``"#RRGGBB"`` 형식의 문자열이거나, 길이 3 의 0~255 정수
                    리스트/튜플이어야 합니다.

            Returns:
                tuple[int, int, int]: 0~255 범위의 ``(r, g, b)`` 튜플.

            Raises:
                ValueError: 문자열이 ``"#RRGGBB"`` 형식이 아니거나, 리스트/
                    튜플 원소가 0~255 범위를 벗어난 경우.
                TypeError: 지원하지 않는 자료형이 전달된 경우.
            """
            if isinstance(color, str):
                r, g, b = (0, 0, 0)
                # Hex 색상 코드인 경우
                if color.startswith("#") and len(color) == 7:
                    r = int(color[1:3], 16)
                    g = int(color[3:5], 16)
                    b = int(color[5:7], 16)
                else:
                    raise ValueError("Invalid color string format. Expected format: '#RRGGBB'")
            elif (isinstance(color, list) or isinstance(color, tuple)) and len(color) == 3:
                # RGB 리스트인 경우
                r, g, b = color
                if not all(0 <= val <= 255 for val in (r, g, b)):
                    raise ValueError("RGB values must be between 0 and 255.")
            else:
                raise TypeError("Color must be a string in '#RRGGBB' format or a list [R, G, B].")
            return r, g, b

        def color(self, color):
            """LED 매트릭스 전체를 한 가지 색으로 채웁니다.

            Args:
                color (str | list[int] | tuple[int, int, int]):
                    ``"#RRGGBB"`` 헥사 문자열, ``[R, G, B]`` 리스트, 또는
                    :class:`COLOR` 프리셋.

            Returns:
                None

            Examples:
                >>> bot.display.color("#ff0000")
                >>> bot.display.color(COLOR.BLUE)
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_COLOR
            command[BBPACKET.DATA1] = r
            command[BBPACKET.DATA2] = g
            command[BBPACKET.DATA3] = b
            self.__controller._send_drop_ack(command)

        def symbol(self, symbol, color):
            """5x5 비트맵을 행 단위 5바이트로 한 번에 그립니다.

            Args:
                symbol (Sequence[int]): 길이 5의 정수 시퀀스. 각 원소는
                    한 행(5비트)을 표현하는 0~31 범위의 비트마스크입니다.
                color (str | list[int] | tuple[int, int, int]): 켜진
                    픽셀에 적용할 색상.

            Returns:
                None

            Examples:
                >>> heart = [0x0A, 0x1F, 0x1F, 0x0E, 0x04]
                >>> bot.display.symbol(heart, COLOR.RED)
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_SYMBOL
            command[BBPACKET.DATA1] = symbol[0]
            command[BBPACKET.DATA2] = symbol[1]
            command[BBPACKET.DATA3] = symbol[2]
            command[BBPACKET.DATA4] = symbol[3]
            command[BBPACKET.DATA5] = symbol[4]
            command[BBPACKET.DATA6] = r
            command[BBPACKET.DATA7] = g
            command[BBPACKET.DATA8] = b
            self.__controller._send_drop_ack(command)

        def row(self, row, symbol, color):
            """매트릭스의 한 행만 비트마스크로 갱신합니다.

            Args:
                row (int): 0(맨 위) ~ 4(맨 아래) 범위의 행 인덱스.
                symbol (int): 해당 행에 적용할 5비트 비트마스크(0~31).
                color (str | list[int] | tuple[int, int, int]): 켜진
                    픽셀에 적용할 색상.

            Returns:
                None

            Examples:
                >>> bot.display.row(0, 0b11111, COLOR.WHITE)
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_ROW
            command[BBPACKET.DATA1] = symbol
            command[BBPACKET.DATA2] = r
            command[BBPACKET.DATA3] = g
            command[BBPACKET.DATA4] = b
            command[BBPACKET.DATA5] = row
            self.__controller._send_drop_ack(command)

        def bright(self, bright):
            """LED 매트릭스의 전체 밝기를 설정합니다.

            Args:
                bright (int): 0(꺼짐) ~ 255(최대) 범위의 밝기 값. 펌웨어가
                    내부적으로 PWM 듀티로 매핑합니다.

            Returns:
                None
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_BRIGHT
            command[BBPACKET.DATA1] = bright
            self.__controller._send_drop_ack(command)

        def char(self, symbol, color):
            """매트릭스에 알파벳 한 글자를 표시합니다.

            Args:
                symbol (str): 길이 1의 문자열(예: ``"A"``). 펌웨어가 내장한
                    글리프 테이블을 ASCII 코드로 인덱스합니다.
                color (str | list[int] | tuple[int, int, int]): 글자 색상.

            Returns:
                None

            Examples:
                >>> bot.display.char("A", COLOR.WHITE)
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_CHAR
            command[BBPACKET.DATA1] = ord(symbol)
            command[BBPACKET.DATA2] = r
            command[BBPACKET.DATA3] = g
            command[BBPACKET.DATA4] = b
            self.__controller._send_drop_ack(command)


        def num(self, symbol, color):
            """매트릭스에 한 자리 숫자(0~9)를 표시합니다.

            Args:
                symbol (int | str): 표시할 숫자. 문자열이면 ``int(symbol)``
                    로 변환되어 전송됩니다.
                color (str | list[int] | tuple[int, int, int]): 숫자 색상.

            Returns:
                None

            Examples:
                >>> bot.display.num(7, COLOR.GREEN)
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED;
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_NUM;
            command[BBPACKET.DATA1] = int(symbol);
            command[BBPACKET.DATA2] = r;
            command[BBPACKET.DATA3] = g;
            command[BBPACKET.DATA4] = b;
            self.__controller._send_drop_ack(command)

        def xy(self, coordX, coordY, color):
            """매트릭스의 한 픽셀만 색을 켭니다.

            Args:
                coordX (int): 0(왼쪽) ~ 4(오른쪽) 범위의 X 좌표.
                coordY (int): 0(위) ~ 4(아래) 범위의 Y 좌표.
                color (str | list[int] | tuple[int, int, int]): 픽셀 색상.

            Returns:
                None

            Examples:
                >>> bot.display.xy(0, 0, COLOR.RED)   # 좌상단을 빨강으로
            """
            r, g, b = self.__color(color)
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED;
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_XY;
            command[BBPACKET.DATA1] = r;
            command[BBPACKET.DATA2] = g;
            command[BBPACKET.DATA3] = b;
            command[BBPACKET.DATA4] = coordX;
            command[BBPACKET.DATA5] = coordY;
            self.__controller._send_drop_ack(command)

        def effect(self, no):
            """미리 정의된 LED 매트릭스 효과를 재생합니다.

            펌웨어가 내장한 애니메이션을 번호로 골라 트리거합니다.

            Args:
                no (int): 효과 번호.
                    * ``0`` — 무지개 효과
                    * ``1`` — 폭포 효과
                    * ``2`` — 와이퍼 효과

            Returns:
                None

            Examples:
                >>> bot.display.effect(0)   # 무지개
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.MATRIX_LED
            command[BBPACKET.DATA0] = ACTION_MODE.DISPLAY_EFFECT
            command[BBPACKET.DATA1] = no
            command[BBPACKET.DATA2] = 1     # 아두이노에서 사용하는 값
            self.__controller._send_drop_ack(command)

        def clear(self):
            """LED 매트릭스를 모두 끕니다(검정으로 채웁니다).

            내부적으로 :meth:`color` 에 ``"#000000"`` 을 넘기는 것과 동일합니다.

            Returns:
                None
            """
            self.color("#000000")
    # --- END OF DIAPLAY ----------------------------------------------
    # -------------------------------------------------------
    # BUZZER
    # -------------------------------------------------------
    def note(self, note, time):
        """부저로 단일 음을 지정한 길이만큼 연주합니다.

        Args:
            note (int): :class:`NOTE` 의 음표 인덱스(예: ``NOTE.C4 = 37``).
            time (int): 음을 유지할 시간(밀리초). 0~65535. 펌웨어에서
                상위/하위 바이트로 분리되어 전송됩니다.

        Returns:
            None

        Examples:
            >>> bot.note(NOTE.C4, 500)   # C4를 0.5초
        """
        # time 은 미리초 단위로 넘어온다.
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.BUZZER;
        command[BBPACKET.DATA0] = ACTION_MODE.BUZZER_NOTE;
        command[BBPACKET.DATA1] = note;

        ah = (time >> 8) & 0xff; # 상위 바이트
        al = time & 0xff;
        command[BBPACKET.DATA2] = ah;
        command[BBPACKET.DATA3] = al;
        self._send_drop_ack(command, ack=False)   # 펌웨어 BUZZER_NOTE 는 ACK 없음

    def melody(self, melody):
        """펌웨어 내장 멜로디를 번호로 재생합니다.

        Args:
            melody (int): 펌웨어에 저장된 멜로디 인덱스.

        Returns:
            None
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.BUZZER;
        command[BBPACKET.DATA0] = ACTION_MODE.BUZZER_MELODY;
        command[BBPACKET.DATA1] = melody;
        self._send_drop_ack(command)

    def beep(self):
        """짧은 비프음을 한 번 울립니다.

        길이/음정은 펌웨어가 정한 기본값을 사용하며, 인자가 없습니다.

        Returns:
            None
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.BUZZER;
        command[BBPACKET.DATA0] = ACTION_MODE.BUZZER_BEEP;
        self._send_drop_ack(command)

    # -------------------------------------------------------
    # BUTTON
    # -------------------------------------------------------
    def button(self):
        """본체의 A/B 버튼이 눌려 있는지 동기적으로 조회합니다.

        명령을 보낸 뒤 :meth:`read_data` 로 응답을 기다리는 블로킹 호출입니다.
        응답 패킷의 시퀀스 인덱스가 송신 시 인덱스와 다르면 표준출력에
        오류를 찍고 ``None`` 을 반환합니다.

        Returns:
            tuple[bool, bool] | None: ``(A 눌림 여부, B 눌림 여부)``.
            잘못된 응답이 오면 ``None``.

        Examples:
            >>> a, b = bot.button()
            >>> if a:
            ...     print("A pressed")
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.BUTTON
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        # print(self._packetIndex, ' ## ', packet[BBRETURN.INDEX])
        # print(split_and_join(packet))
        # A, B 버튼 동시 리턴
        return packet[BBRETURN.DATA1]==1, packet[BBRETURN.DATA2]==1
       

    # -------------------------------------------------------
    # TOUCH SENSOR
    # -------------------------------------------------------    
    # def touch_init(self):
    #     '''사용하지 않음'''
    #     command = NULL_COMMAND_PACKET[:]
    #     command[BBPACKET.INDEX] = self.__get_index()
    #     command[BBPACKET.ACTION] = ACTION_CODE.TOUCH;
    #     command[BBPACKET.DATA0] = ACTION_MODE.TOUCH_INIT;
    #     self.__send(command)

    
    def touch(self):
        """3채널 정전식 터치 센서의 현재 접촉 상태를 조회합니다.

        펌웨어는 16비트 값으로 응답하지만, 사용자에게는 "터치됨/아님" 의
        불리언으로 변환해 반환합니다.

        Returns:
            tuple[bool, bool, bool] | None: ``(P0 터치, P1 터치, P2 터치)``.
            잘못된 응답이 오면 ``None``.

        Examples:
            >>> p0, p1, p2 = bot.touch()
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.TOUCH;
        command[BBPACKET.DATA0] = ACTION_MODE.TOUCH_VALUES;
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return

        # 5, 6
        al = packet[5]
        ah = packet[6]
        p0 = (ah << 8) | al;

        # 7, 8
        al = packet[7]
        ah = packet[8]
        p1 = (ah << 8) | al;

        # 9, 10
        al = packet[9]
        ah = packet[10]
        p2 = (ah << 8) | al;

        return p0==1, p1==1, p2==1

    # -------------------------------------------------------
    # MPU
    # -------------------------------------------------------
    def tilt(self):
        """6축 IMU 기반 기울기 상태(좌/우/앞/뒤)를 조회합니다.

        보드를 기울였을 때 어느 방향으로 기울었는지를 펌웨어가 4개 불리언
        플래그로 알려 줍니다. 두 방향이 동시에 ``True`` 가 될 수도 있습니다.

        Returns:
            tuple[bool, bool, bool, bool] | None:
            ``(왼쪽, 오른쪽, 앞쪽, 뒤쪽)`` 기울임 여부.
            잘못된 응답이 오면 ``None``.

        Examples:
            >>> left, right, fwd, back = bot.tilt()
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.MPU_ACTION;
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        return packet[13]==1,packet[14]==1,packet[15]==1,packet[16]==1
    # -------------------------------------------------------
    # 밝기 센서
    # -------------------------------------------------------
    def light(self):
        """좌/우 두 채널의 빛 센서 값을 조회합니다.

        Returns:
            tuple[int, int] | None: ``(왼쪽 채널, 오른쪽 채널)``. 각 값은
            0~1023 범위의 16비트 정수입니다. 잘못된 응답이 오면 ``None``.

        Examples:
            >>> left, right = bot.light()
        """
        # 0 ~ 1023
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.LIGHT_SENSOR;
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        # 5, 6
        al = packet[5]
        ah = packet[6]
        l1 = (ah << 8) | al;

        # 7, 8
        al = packet[7]
        ah = packet[8]
        l2 = (ah << 8) | al;
        return l1, l2

    # -------------------------------------------------------
    # 소리 센서
    # -------------------------------------------------------
    def mic(self):
        """본체 마이크의 현재 입력 크기를 조회합니다.

        Returns:
            int | None: 0~1023 범위의 16비트 정수 음량값. 잘못된 응답이
            오면 ``None``.

        Examples:
            >>> level = bot.mic()
            >>> if level > 500:
            ...     print("loud!")
        """
       # 0 ~ 1023
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.MIC_SENSOR;
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        # 5, 6
        al = packet[5]
        ah = packet[6]
        val = (ah << 8) | al;
        return val

    # -------------------------------------------------------
    # 디지털 입출력
    # -------------------------------------------------------   
    def digital_write(self, pin, val):
        """지정한 디지털 핀에 HIGH/LOW 를 출력합니다.

        Args:
            pin (int): 외부 핀 번호. ``bot.pin.P0`` 등을 사용합니다.
            val (int): 출력할 디지털 레벨. ``0`` = LOW, ``1`` = HIGH.

        Returns:
            None

        Examples:
            >>> bot.digital_write(bot.pin.P0, 1)   # P0 핀을 HIGH
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.DIGITAL
        command[BBPACKET.DATA0] = ACTION_MODE.DIGITAL_OUTPUT
        command[BBPACKET.DATA1] = pin
        command[BBPACKET.DATA2] = val
        self._send_drop_ack(command)


    def digital_read(self, pin):
        """지정한 디지털 핀의 현재 레벨을 풀업 모드로 읽습니다.

        펌웨어는 핀을 풀업으로 설정한 뒤 현재 레벨을 응답합니다.

        Args:
            pin (int): 외부 핀 번호.

        Returns:
            int | None: ``0`` 또는 ``1``. 잘못된 응답이 오면 ``None``.

        Examples:
            >>> if bot.digital_read(bot.pin.P0) == 0:
            ...     print("pressed")
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.DIGITAL
        command[BBPACKET.DATA0] = ACTION_MODE.DIGITAL_PULLUP    #디지털 풀업
        command[BBPACKET.DATA1] = pin
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        val = packet[5]
        return val

    # -------------------------------------------------------
    # 아날로그 입출력
    # -------------------------------------------------------   
    def analog_write(self, pin, val):
        """지정한 핀에 PWM 아날로그 값을 출력합니다.

        Args:
            pin (int): 외부 핀 번호.
            val (int): 0~1023 범위의 PWM 값. 상위/하위 바이트로 분리되어
                전송되며, 펌웨어가 ``readShort`` 로 다시 합칩니다.

        Returns:
            None

        Examples:
            >>> bot.analog_write(bot.pin.P1, 512)   # 절반 듀티
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.ANALOG;
        command[BBPACKET.DATA0] = ACTION_MODE.ANALOG_OUTPUT;
        command[BBPACKET.DATA1] = pin;

        # 0 ~ 1023
        # val 값을 상위 바이트와 하위 바이트로 분리
        ah = (val >> 8) & 0xff  # 상위 바이트
        al = val & 0xff         # 하위 바이트

        command[BBPACKET.DATA2] = al; # 펌웨어에서 readShort 함수를 사용할려면 상위와 하위를 조심
        command[BBPACKET.DATA3] = ah;
        self._send_drop_ack(command)

    def analog_read(self, pin):
        """지정한 핀의 아날로그 값을 16비트로 읽어 옵니다.

        Args:
            pin (int): 외부 핀 번호.

        Returns:
            int | None: 0~1023 범위의 정수. 잘못된 응답이 오면 ``None``.

        Examples:
            >>> v = bot.analog_read(bot.pin.P0)
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.ANALOG;
        command[BBPACKET.DATA0] = ACTION_MODE.ANALOG_INPUT;
        command[BBPACKET.DATA1] = pin;
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return

        # 5, 6
        al = packet[5]
        ah = packet[6]
        val = (ah << 8) | al;
        return val


    def dcmotor(self, pin, val):
        """DC 모터를 PWM 으로 구동합니다.

        내부적으로는 ``analog_write`` 와 동일한 ANALOG 출력 패킷을 사용해
        모터 드라이버 핀을 흔듭니다.

        Args:
            pin (int): 모터 드라이버에 연결된 외부 핀 번호.
            val (int): 0~1023 범위의 PWM 값. 클수록 빠르게 회전합니다.

        Returns:
            None
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.ANALOG
        command[BBPACKET.DATA0] = ACTION_MODE.ANALOG_OUTPUT
        command[BBPACKET.DATA1] = pin
        # 0 ~ 1023
        ah = (val >> 8) & 0xff      # 상위 바이트
        al = val & 0xff
        command[BBPACKET.DATA2] = al    # 펌웨어에서 readShort 함수를 사용할려면 상위와 하위를 조심
        command[BBPACKET.DATA3] = ah
        self._send_drop_ack(command)

    # 메인보드의 서버도 핀번호로 동작시키자
    def servo(self, pin, val):
        """서보 모터의 각도를 설정합니다.

        ``pin`` 이 메인보드 내장 서보 핀(``self.pin.SERVO``) 이면
        ``MAIN_SERVO`` 명령을, 그 외 핀이면 일반 ``SERVO`` 명령을 전송합니다.

        Args:
            pin (int): 서보가 연결된 핀. 보통 ``bot.pin.SERVO`` 또는
                외부 핀 번호.
            val (int): 0~180 범위의 각도(도).

        Returns:
            None

        Examples:
            >>> bot.servo(bot.pin.SERVO, 90)
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        if pin == self.pin.SERVO:
            command[BBPACKET.ACTION] = ACTION_CODE.MAIN_SERVO
        else:
            command[BBPACKET.ACTION] = ACTION_CODE.SERVO
        command[BBPACKET.DATA0] = pin;
        command[BBPACKET.DATA1] = val;
        self._send_drop_ack(command)


    def ultrasonic(self, trig, echo):
        """HC-SR04 호환 초음파 센서로 앞쪽 거리를 측정합니다.

        Args:
            trig (int): 트리거 신호를 출력할 핀 번호.
            echo (int): 에코 신호를 입력 받을 핀 번호.

        Returns:
            int | None: 측정된 거리(cm). 잘못된 응답이 오면 ``None``.

        Examples:
            >>> dist = bot.ultrasonic(bot.pin.P7, bot.pin.P11)
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.ULTRASONIC
        command[BBPACKET.DATA0] = trig
        command[BBPACKET.DATA1] = echo
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        return packet[5]

    def dht11(self, pin):
        """DHT11 센서로 온도와 습도를 한 번에 측정합니다.

        Args:
            pin (int): DHT11 데이터 라인이 연결된 핀 번호.

        Returns:
            tuple[int, int] | None: ``(온도(°C), 상대 습도(%))``. 잘못된
            응답이 오면 ``None``.

        Examples:
            >>> t, h = bot.dht11(bot.pin.P2)
        """
        command = NULL_COMMAND_PACKET[:]
        command[BBPACKET.INDEX] = self.__get_index()
        command[BBPACKET.ACTION] = ACTION_CODE.TMPHUM
        command[BBPACKET.DATA0] = pin
        self.__send(command)
        packet = self._wait_for_response(self._packetIndex)
        if packet is None:
            return
        temp = packet[5]
        humi = packet[6]
        return temp, humi
    # -----------------------------------------------------------------
    # 🔥 UTIL 함수
    # -----------------------------------------------------------------
    def delay(self, sec):
        """지정한 시간(초)만큼 현재 스레드를 블로킹하는 메서드.

        모듈 함수 :func:`pycombb.bitblock.utils.delay` 와 동작은 같지만,
        ``bot.delay(...)`` 처럼 인스턴스 메서드 형태로도 호출할 수 있게
        편의를 위해 노출되어 있습니다.

        Args:
            sec (float): 대기할 시간(초).

        Returns:
            None
        """
        time.sleep(sec)

    def delayms(self,ms):
        """지정한 시간(밀리초)만큼 현재 스레드를 블로킹합니다.

        :meth:`delay` 의 밀리초 단위 래퍼입니다.

        Args:
            ms (float): 대기할 시간(밀리초).

        Returns:
            None
        """
        self.delay(ms/1000)


    def wait(self, ms):
        """지정한 시간(밀리초)만큼 현재 스레드를 블로킹합니다.

        :meth:`delayms` 의 동의어로, 다른 보드 SDK 와 인터페이스를 맞추기
        위해 같은 동작을 ``wait`` 라는 이름으로도 제공합니다.

        Args:
            ms (float): 대기할 시간(밀리초).

        Returns:
            None
        """
        self.delay(ms/1000)

    # -----------------------------------------------------------------
    # 🔥 Bitblock 내부 클래스로 정의
    # -----------------------------------------------------------------
    def rccar_init(self):
        """RC카 모드를 초기화하고 :class:`Bitblock.RCCar` 컨트롤러를 만듭니다.

        반환된 인스턴스가 RC카 동작 명령(``move_forward``, ``stop``,
        ``distance``, ``line``, ``servo`` 등)의 진입점이 됩니다.

        Returns:
            Bitblock.RCCar: RC카 모드 컨트롤러.

        Examples:
            >>> car = bot.rccar_init()
            >>> car.move_forward(120)
            >>> car.stop()
        """
        return self.RCCar(self)

    class RCCar():
        """RC카 모드 전용 컨트롤러 클래스.

        :meth:`Bitblock.rccar_init` 가 만들어 주며, 생성 시점에 펌웨어로
        RC카 초기화 명령(``RCCAR_INITIALIZE``)을 보냅니다. 이 인스턴스는
        부모 :class:`Bitblock` 의 패킷 송신/수신 인프라를 그대로 빌려
        씁니다.

        Examples:
            >>> car = bot.rccar_init()
            >>> car.turn_left(150)
            >>> print(car.distance())
            >>> car.stop()
        """

        def __init__(self, controler=None):
            """RC카 컨트롤러를 만들고 즉시 초기화 명령을 전송합니다.

            Args:
                controler (Bitblock): 패킷 송신을 위임할 상위 컨트롤러.
            """
            self.__controller = controler
            # print(dir(self.__controller))
            self.__init()

        def __init(self):
            """펌웨어에 RC카 모드 초기화 명령을 1회 송신합니다.

            Returns:
                None
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.RCCAR
            command[BBPACKET.DATA0] = ACTION_MODE.RCCAR_INITIALIZE
            self.__controller._send_drop_ack(command)

        def __rlspeed(self, dir_l, speed_l, dir_r, speed_r):
            """좌/우 바퀴의 방향과 속도를 동시에 설정합니다(내부 헬퍼).

            상위 메서드(:meth:`move_forward`, :meth:`turn_left`, :meth:`wheels`
            등)가 사용자 친화적인 인자를 받아 이 메서드 호출로 변환합니다.

            Args:
                dir_l (int): 왼쪽 바퀴 방향. ``0`` = 전진, ``1`` = 후진.
                speed_l (int): 왼쪽 바퀴 속도. 0~255.
                dir_r (int): 오른쪽 바퀴 방향. ``0`` = 전진, ``1`` = 후진.
                speed_r (int): 오른쪽 바퀴 속도. 0~255.

            Returns:
                None

            Examples:
                >>> self.__rlspeed(dir_l=1, speed_l=50, dir_r=1, speed_r=50)
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.RCCAR
            command[BBPACKET.DATA0] = ACTION_MODE.RCCAR_RLSPEED
            command[BBPACKET.DATA1] = dir_l;
            command[BBPACKET.DATA2] = speed_l;
            command[BBPACKET.DATA3] = dir_r;
            command[BBPACKET.DATA4] = speed_r;
            self.__controller._send_drop_ack(command)

        def move_forward(self, speed=100):
            """양쪽 바퀴를 같은 속도로 전진시킵니다.

            Args:
                speed (int): 전진 속도. 0~255. 음수가 들어와도 절대값으로
                    변환됩니다. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.move_forward(120)
            """
            self.__rlspeed(0, int(abs(speed)), 0, int(abs(speed)))

        def move_backward(self, speed=100):
            """양쪽 바퀴를 같은 속도로 후진시킵니다.

            Args:
                speed (int): 후진 속도. 0~255. 음수가 들어와도 절대값으로
                    변환됩니다. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.move_backward(120)
            """
            self.__rlspeed(1, int(abs(speed)), 1, int(abs(speed)))

        def turn_left(self, speed=100):
            """좌회전합니다(왼쪽 바퀴 속도를 절반으로 줄여 호선 주행).

            Args:
                speed (int): 기준 속도. 0~255. 왼쪽 바퀴 속도는 자동으로
                    ``speed / 2`` 가 됩니다. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.turn_left(150)
            """
            self.__rlspeed(0, int(abs(speed)/2), 0, int(abs(speed)))

        def turn_right(self, speed=100):
            """우회전합니다(오른쪽 바퀴 속도를 절반으로 줄여 호선 주행).

            Args:
                speed (int): 기준 속도. 0~255. 오른쪽 바퀴 속도는 자동으로
                    ``speed / 2`` 가 됩니다. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.turn_right(150)
            """
            self.__rlspeed(0, int(abs(speed)), 0, int(abs(speed)/2))

        def pivot_left(self, speed=100):
            """제자리에서 왼쪽으로 회전합니다(좌 후진 + 우 전진).

            Args:
                speed (int): 회전 속도. 0~255. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.pivot_left(120)
            """
            self.__rlspeed(1, int(abs(speed)), 0, int(abs(speed)))

        def pivot_right(self, speed=100):
            """제자리에서 오른쪽으로 회전합니다(좌 전진 + 우 후진).

            Args:
                speed (int): 회전 속도. 0~255. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.pivot_right(120)
            """
            self.__rlspeed(0, int(abs(speed)), 1, int(abs(speed)))


        def wheels(self, lspeed=100, rspeed=100):
            """좌/우 바퀴 속도를 부호 있는 값으로 한 번에 설정합니다.

            음수 속도는 해당 바퀴를 역회전시킵니다. 따라서 한쪽만 음수로
            주면 자연스럽게 제자리 돌기에 가까운 동작을 만들 수 있습니다.

            Args:
                lspeed (int): 왼쪽 바퀴 속도. -255~255. 기본값 ``100``.
                rspeed (int): 오른쪽 바퀴 속도. -255~255. 기본값 ``100``.

            Returns:
                None

            Examples:
                >>> car.wheels(50, -50)   # 제자리 회전에 가까운 동작
            """
            ldir = 0 if lspeed >= 0 else 1
            rdir = 0 if rspeed >= 0 else 1
            self.__rlspeed(ldir , int(abs(lspeed)), rdir, int(abs(rspeed)))

        def stop(self):
            """양쪽 바퀴를 즉시 정지시킵니다.

            Returns:
                None

            Examples:
                >>> car.stop()
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.RCCAR
            command[BBPACKET.DATA0] = ACTION_MODE.RCCAR_STOP
            self.__controller._send_drop_ack(command)


        def distance(self):
            """RC카 앞쪽 초음파 센서로 장애물까지의 거리를 측정합니다.

            펌웨어에 RC카 모드 전용 거리 측정 명령을 보내고, 응답에서
            거리값을 읽어 옵니다. 응답 인덱스가 일치하지 않으면 표준출력에
            오류를 찍고 ``None`` 을 반환합니다.

            Returns:
                int | None: 앞쪽 장애물까지의 거리(cm). 잘못된 응답이 오면
                ``None``.

            Examples:
                >>> dist = car.distance()
                >>> if dist is not None and dist < 10:
                ...     car.stop()
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.RCCAR
            command[BBPACKET.DATA0] = ACTION_MODE.RCCAR_DISTANCE
            command[BBPACKET.DATA1] = 39 #P7
            command[BBPACKET.DATA2] = 5  #P9
            self.__controller._Bitblock__send(command)
            packet = self.__controller._wait_for_response(self.__controller._packetIndex)
            if packet is None:
                return
            return packet[6]
        

        def line(self):
            """RC카 하부 3채널 라인 센서 값을 한 번에 읽어 옵니다.

            펌웨어는 각 채널을 16비트 값으로 응답하며, 일반적으로 어두운
            라인을 만나면 값이 떨어집니다.

            Returns:
                tuple[int, int, int] | None: ``(왼쪽, 중간, 오른쪽)`` 채널의
                라인 센서 값. 잘못된 응답이 오면 ``None``.

            Examples:
                >>> l, c, r = car.line()
                >>> print(f"L={l}, C={c}, R={r}")
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.RCCAR
            command[BBPACKET.DATA0] = ACTION_MODE.RCCAR_LINESENSOR
            self.__controller._Bitblock__send(command)
            packet = self.__controller._wait_for_response(self.__controller._packetIndex)
            if packet is None:
                return
            # 6, 7
            al = packet[6]
            ah = packet[7]
            l1 = (ah << 8) | al;

            # 8, 9
            al = packet[8]
            ah = packet[9]
            l2 = (ah << 8) | al;

            # 10, 11
            al = packet[10]
            ah = packet[11]
            l3 = (ah << 8) | al;
            return l1, l2, l3

        # 메인보드의 서버도 핀번호로 동작시키자
        def servo(self, pin, val):
            """RC카 뒷쪽 커넥터에 연결된 서보 모터의 각도를 설정합니다.

            각도 값은 :func:`clamp` 로 0~180 범위에 자동으로 잘립니다.

            Args:
                pin (int): 서보가 연결된 핀. 비트블록 1.x 는 ``P3`` 만,
                    2.x 이상은 ``P3``/``P4`` 사용 가능.
                val (int): 설정할 각도(도). 0~180 범위로 클램프됩니다.

            Returns:
                None

            Examples:
                >>> car.servo(bot.pin.P3, 90)
            """
            command = NULL_COMMAND_PACKET[:]
            command[BBPACKET.INDEX] = self.__controller._Bitblock__get_index()
            command[BBPACKET.ACTION] = ACTION_CODE.SERVO
            command[BBPACKET.DATA0] = pin
            command[BBPACKET.DATA1] = clamp(val)
            self.__controller._send_drop_ack(command)

# END CLASS



