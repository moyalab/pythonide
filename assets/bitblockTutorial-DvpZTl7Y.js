const e=[{id:"setup",title:"1. Setup",description:"Preparing the BitBlock board connection (Web Serial)",icon:"settings",setup:{intro:"This IDE communicates with the BitBlock board over **Web Serial**. No separate driver installation is required — connect the board to your PC as below, then pick the port from the IDE.",steps:["Get the BitBlock board and the USB dongle ready. Make sure batteries are inserted in the board, and turn it on.","Plug the USB dongle into a USB port on the PC.","Bring the BitBlock board close to the dongle, then press the small button on the dongle once to wirelessly pair the board with the dongle.",`Click the "Connect" button at the top right of the IDE; the browser will open the serial port chooser. Select the dongle's port and click "Connect".`,"After connecting, ``Bitblock(port)`` in your code sends commands to that port. The port name (e.g., COM5, /dev/ttyUSB0) can be written directly in the code."],note:"Web Serial only works on Chromium-based browsers (Chrome, Edge, Opera). Safari, Firefox, and Android mobile browsers do not support Web Serial — please use a PC or Chromebook."},notice:"If the board's LED color does not change when you press the dongle button, the board may be powered off, or it may already be paired with a different dongle. Power-cycle the board and press the dongle button just once."},{id:"getting-started",title:"2. Getting started",description:"The most basic commands: connect, disconnect, and wait",icon:"play_circle",entries:[{name:"Bitblock(port)",summary:"Create a BitBlock board object. (The port is not opened yet at this point.)",details:'`Bitblock` is the controller class for handling a single BitBlock board.\nCreating an instance does not open the serial port immediately — it only stores the port info, and the actual connection is started when you call ``connect()``.\n\nArgs:\n  port (str): Serial port name. On Windows like "COM5"; on Linux/Mac like "/dev/ttyUSB0".\n  timeout (float): Maximum time (seconds) to wait for a board response. Default 5.\n  baud (int): Communication speed. Use the firmware default 57600.\n\nBy convention, the variable is named ``bb``, ``board``, or ``bot``. This tutorial uses ``bb`` consistently.',example:`from pycombb import Bitblock

# At this stage the port is not yet open — only "ready to connect".
bb = Bitblock()
print(bb)`},{name:"bb.connect()",summary:"Open the serial connection to the stored port.",details:`You must call this on the object created by \`\`Bitblock(port)\`\` for communication with the board to start.
Calling it again after a successful connect is ignored (already open).

Returns:
  bool: True if a new connection was opened, False if it was already connected or the port is empty (no-op).

When connection fails, common causes are 1) wrong port name, 2) another program is holding the same port, 3) the dongle is not paired with the board. Re-check the steps in the Setup topic.`,example:`from pycombb import Bitblock

bb = Bitblock()

ok = bb.connect()
print("connection result:", ok)`},{name:"bb.disconnect()",summary:"Safely close the open serial connection.",details:`Call it at the end of the program so another program can pick up the same port.
It is also safe to call when no connection has been opened yet, or when it has already been closed — it just passes through.

Returns:
  None

Wrapping it in a try/finally pattern guarantees the port is closed even if an error occurs in the middle.`,example:`from pycombb import Bitblock

bb = Bitblock()
bb.connect()

try:
    # Turn LEDs on or read sensors here.
    pass
finally:
    bb.disconnect()`},{name:"delay(sec)",summary:"Pause the program for the given number of seconds.",details:"Internally calls ``time.sleep``. To wait for less than a second, use a decimal like 0.5.\nImport the function with ``from pycombb.bitblock import delay``, or after a star import (``from pycombb.bitblock import *``) just call ``delay(...)``.\n\nArgs:\n  sec (float): Wait time in seconds.\nReturns:\n  None",example:`from pycombb import Bitblock, delay

bb = Bitblock()
bb.connect()

print("waiting 1 second...")
delay(1)
print("done")

bb.disconnect()`},{name:"delayms(ms)",summary:"Pause the program for the given number of milliseconds.",details:`A millisecond version of \`\`delay\`\`. Board operations are often expressed in milliseconds, so this is exposed as a separate function for natural use without unit conversion.

Args:
  ms (float): Wait time in milliseconds. 500 means a 0.5-second wait.
Returns:
  None`,example:`from pycombb import Bitblock, delayms

bb = Bitblock()
bb.connect()

for i in range(3):
    print("tick", i)
    delayms(500)   # Wait 0.5 seconds

bb.disconnect()`},{name:"wait(ms)",summary:"Waits in milliseconds, just like delayms.",details:"A name commonly used in BitBlock wiki examples. The same behavior is exposed under the name ``wait`` to match the interface of other board libraries. Behavior is exactly the same as ``delayms`` — use whichever you prefer.\n\nArgs:\n  ms (float): Wait time in milliseconds.\nReturns:\n  None",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

print("waiting 1 second...")
wait(1000)
print("done")

bb.disconnect()`},{name:"End-to-end example",summary:"The smallest possible code: connect → brief wait → disconnect.",details:"BitBlock code almost always follows these 4 steps:\n  1) Create the object with ``Bitblock(port)``\n  2) Open the port with ``bb.connect()``\n  3) Main work (turn on LEDs, beep the buzzer, read sensors, etc.)\n  4) Close the port with ``bb.disconnect()``\n\nMemorize this shape and you can follow examples from the rest of the topics directly.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# Main-work spot. From the next topic, LED/buzzer code goes here.
wait(500)

bb.disconnect()`}]},{id:"display-basic",title:"3. LED display — basics",description:"Fill the 5x5 matrix with one color, one letter, or one digit",icon:"grid_on",entries:[{name:"Color formats (concept)",summary:"BitBlock accepts colors in three forms — hex string, [R, G, B] list, or COLOR preset.",details:'Almost every display method (``color``, ``symbol``, ``row``, ``char``, ``num``, ``xy``) takes a color as the last argument. Any of these three forms works the same way:\n\n  1) Hex string: ``"#RRGGBB"`` — same notation as web colors. e.g., ``"#ff0000"``.\n  2) [R, G, B] list (or tuple): each channel 0~255. e.g., ``[255, 0, 0]``.\n  3) COLOR constants: frequently used colors with predefined names. ``COLOR.RED``, ``COLOR.BLUE``, etc.\n\nAn invalid format (e.g., ``"red"``, ``[300, 0, 0]``) raises ``ValueError``. See the table at the bottom of this topic for the full COLOR list.',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# The same red expressed three ways
bb.display.color("#ff0000");   wait(500)
bb.display.color([255, 0, 0]); wait(500)
bb.display.color(COLOR.RED);   wait(500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.color(color)",summary:"Fill all 25 pixels of the 5x5 LED matrix with the same color.",details:'The simplest display command. Fills the entire matrix with one color.\n\nArgs:\n  color (str | list | tuple): See "Color formats" above.\nReturns:\n  None\n\nTo turn the LEDs off, pass ``"#000000"``, or more concisely call ``bb.display.clear()``.',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.color(COLOR.GREEN)
wait(1000)
bb.display.color(COLOR.BLUE)
wait(1000)
bb.display.clear()

bb.disconnect()`},{name:"bb.display.clear()",summary:"Turn off every LED.",details:'Internally equivalent to ``bb.display.color("#000000")``.\nIt is the shortest no-argument form, so call it freely whenever you need to wipe the screen.\n\nReturns:\n  None',example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.color(COLOR.RED)
wait(500)
bb.display.clear()

bb.disconnect()`},{name:"bb.display.bright(level)",summary:"Adjust matrix brightness in the 0~255 range.",details:`The display LEDs are quite bright by default. Lowering brightness is nicer in dark rooms, at night, or when filming with a camera.

Args:
  level (int): 0 (fully off) ~ 255 (max brightness). The firmware maps this to a PWM duty cycle.
Returns:
  None

Once set, it persists for subsequent commands. Cycling board power resets it to the default.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.bright(30)            # Dim
bb.display.color(COLOR.WHITE)
wait(1500)

bb.display.bright(255)           # Bright again
wait(1500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.char(letter, color)",summary:"Display a single alphabet letter on the matrix.",details:`Draws a single letter using the firmware's built-in 5x5 font.

Args:
  letter (str): Length-1 string (e.g., \`\`"A"\`\`). The ASCII code indexes into the firmware's glyph table.
  color (str | list | tuple): Letter color.
Returns:
  None

If you pass two or more letters at once, only the first is shown. To display a word, use a \`\`for\`\` loop with the pattern: show one letter briefly → wait → show the next.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

for letter in "HELLO":
    bb.display.char(letter, COLOR.YELLOW)
    wait(500)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.num(digit, color)",summary:"Display a single 0~9 digit on the matrix.",details:"Draws a single digit (0~9). Like letters, the 5x5 font is used.\n\nArgs:\n  digit (int | str): The digit to show. A string is converted with ``int(...)``.\n  color (str | list | tuple): Digit color.\nReturns:\n  None\n\nTwo-digit values cannot be shown at once. To make a countdown, use a ``for`` loop: show one digit → wait → show next digit.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# 5-second countdown
for i in range(5, 0, -1):
    bb.display.num(i, COLOR.RED)
    wait(1000)

bb.display.clear()
bb.disconnect()`},{name:"Combined example — traffic light",summary:"A mini traffic light that loops through red → yellow → green.",details:"You can build a small simulation with just ``color`` / ``clear`` / ``wait``. Use ``while True:`` for an infinite loop and ``Ctrl+C`` to stop.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        bb.display.color(COLOR.RED);    wait(2000)
        bb.display.color(COLOR.YELLOW); wait(800)
        bb.display.color(COLOR.GREEN);  wait(2000)
        bb.display.clear();             wait(400)
finally:
    bb.disconnect()`}],tables:[{title:"COLOR presets (representative colors)",headers:["Name","RGB","COLOR.* constant"],rows:[["Red","[255, 0, 0]","COLOR.RED"],["Green","[0, 128, 0]","COLOR.GREEN"],["Blue","[0, 0, 255]","COLOR.BLUE"],["Yellow","[255, 255, 0]","COLOR.YELLOW"],["Orange","[255, 165, 0]","COLOR.ORANGE"],["Violet","[181, 126, 220]","COLOR.VIOLET"],["Cyan","[0, 255, 255]","COLOR.CYAN"],["White","[255, 255, 255]","COLOR.WHITE"],["Black","[0, 0, 0]","COLOR.BLACK"],["Gray","[128, 128, 128]","COLOR.GRAY"]],note:"Additional presets: NAVYBLUE, ROYALBLUE, MEDIUMBLUE, AZURE, AQUAMARINE, TEAL, FORESTGREEN, OLIVE, LIME, GOLD, SALMON, HOTPINK, FUCHSIA, INDIGO, MAROON, CRIMSON, PLUM, SILVER, KHAKI, BEIGE, IVORY, and over 30 more are defined."}]},{id:"display-advanced",title:"4. LED display — advanced",description:"Single pixel · single row · 5x5 bitmap · built-in effects",icon:"auto_awesome",entries:[{name:"bb.display.xy(x, y, color)",summary:"Light up a single pixel of the matrix. (0,0) is top-left, (4,4) is bottom-right.",details:`Changes the color of one cell on the 5x5 grid. Other pixels keep their previous state, so calling it many times accumulates dots into a drawing.

Args:
  x (int): X coordinate, 0 (left) ~ 4 (right).
  y (int): Y coordinate, 0 (top) ~ 4 (bottom).
  color (str | list | tuple): Pixel color.
Returns:
  None

Out-of-range coordinates lead to undefined firmware behavior — only use values inside \`\`range(5)\`\` or \`\`0 <= n < 5\`\`.`,example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# Draw a diagonal
bb.display.clear()
for i in range(5):
    bb.display.xy(i, i, COLOR.GREEN)
    wait(200)

wait(1500)
bb.display.clear()
bb.disconnect()`},{name:"bb.display.row(row, mask, color)",summary:"Light up one row using a 5-bit bit-mask pattern.",details:"Sets the state of all 5 LEDs in one row at once. Each bit corresponds to one pixel: 1 = on, 0 = off.\n\nArgs:\n  row (int): Row index, 0 (top) ~ 4 (bottom).\n  mask (int): 5-bit integer in 0~31. ``0b11111`` lights the whole row; ``0b10001`` lights only the two ends.\n  color (str | list | tuple): Color for the lit pixels.\nReturns:\n  None\n\nThe leftmost bit is the MSB. So ``0b10000`` lights the leftmost pixel of that row.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

bb.display.clear()

# A "scanline" that flows from top to bottom
for r in range(5):
    bb.display.clear()
    bb.display.row(r, 0b11111, COLOR.BLUE)
    wait(300)

bb.display.clear()
bb.disconnect()`},{name:"bb.display.symbol(rows, color)",summary:"Draw the entire 5x5 matrix at once using 5 row bit-masks.",details:"Sends a 5x5 bitmap as one packet, instead of calling ``row`` five times. ``rows`` is a length-5 sequence of integers, each one being one row's bit-mask (0~31).\n\nArgs:\n  rows (Sequence[int]): A length-5 list of integers. Each element is one row's 5-bit mask.\n  color (str | list | tuple): Color of the lit pixels.\nReturns:\n  None\n\nDefining the bitmap as a variable makes the code read like a picture — the 1s show exactly where the lit pixels go.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

# Heart-shaped bitmap
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
bb.disconnect()`},{name:"bb.display.effect(no)",summary:"Play a built-in firmware animation by number.",details:`Triggers a pre-built animation in the firmware with one call. Some effects keep running until they finish, so the next command may not take effect immediately — give a brief \`\`wait\`\` before drawing again to be safe.

Args:
  no (int): 0=rainbow, 1=waterfall, 2=wiper.
Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.display.effect(0)   # Rainbow
wait(3000)
bb.display.effect(1)   # Waterfall
wait(3000)
bb.display.effect(2)   # Wiper
wait(3000)

bb.display.clear()
bb.disconnect()`}],tables:[{title:"Built-in effect numbers",headers:["Number","Effect"],rows:[["0","Rainbow"],["1","Waterfall"],["2","Wiper"]]}]},{id:"sound",title:"5. Sound — buzzer",description:"Beeps, single notes, and built-in melodies",icon:"music_note",entries:[{name:"bb.beep()",summary:"Sound a short beep once. No arguments.",details:`Note length and pitch use firmware defaults. The easiest way to signal "done" or give the user immediate feedback.

Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.beep()
wait(300)
bb.beep()

bb.disconnect()`},{name:"bb.note(note, ms)",summary:"Play a single note for ms milliseconds.",details:'The "Do/Re/Mi" you hear is expressed as integer constants like ``NOTE.C4``, ``NOTE.D4``, ``NOTE.E4``. This function takes such an integer and a duration (milliseconds) and plays the buzzer.\n\nArgs:\n  note (int): A note constant like NOTE.C4, NOTE.D4 (integer in 0~85).\n  ms (int): Duration to hold the note (milliseconds). 0~65535.\nReturns:\n  None\n\nThe call returns immediately (non-blocking). If you call the next note right away, the firmware plays them seamlessly — slip a small ``wait`` between notes for an audible separation.',example:`from pycombb import Bitblock, NOTE, wait

bb = Bitblock()
bb.connect()

bb.note(NOTE.C4, 300); wait(350)
bb.note(NOTE.E4, 300); wait(350)
bb.note(NOTE.G4, 300); wait(350)
bb.note(NOTE.C5, 600); wait(700)

bb.disconnect()`},{name:"bb.melody(index)",summary:"Play a firmware-built-in melody by number.",details:"Plays a predefined short tune at once. A convenience for cases where you do not want to compose a tune by calling ``note`` repeatedly.\n\nArgs:\n  index (int): 0-based melody number. The number of tunes can vary by firmware build.\nReturns:\n  None\n\nSending the next command before playback ends will cut the tune. If you have nothing to do next, give a long enough ``wait``.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

bb.melody(0)
wait(5000)         # Wait until the tune finishes

bb.disconnect()`},{name:"Combined example — play a scale",summary:"Build a (note, duration) sequence as a list and play it with a ``for`` loop.",details:"Build a list of ``(note, duration)`` tuples and call ``note`` in order with a ``for`` loop to compose a short tune. Add a ``wait`` of the same length between notes for a natural separation.\n\nThe example below plays a C-major scale Do→Re→Mi→Fa→Sol→La→Ti→Do, going up and then back down.",example:`from pycombb import Bitblock, NOTE, wait

bb = Bitblock()
bb.connect()

# C major scale (up and down)
scale_up   = [NOTE.C4, NOTE.D4, NOTE.E4, NOTE.F4,
              NOTE.G4, NOTE.A4, NOTE.B4, NOTE.C5]
scale_down = list(reversed(scale_up))

for n in scale_up + scale_down:
    bb.note(n, 250)
    wait(280)

bb.disconnect()`}],tables:[{title:"NOTE constants (octave 4 — starting from middle C)",headers:["Note","Constant","Value"],rows:[["Do (C4)","NOTE.C4","37"],["Do♯ (C#4)","NOTE.CS4","38"],["Re (D4)","NOTE.D4","39"],["Re♯ (D#4)","NOTE.DS4","40"],["Mi (E4)","NOTE.E4","41"],["Fa (F4)","NOTE.F4","42"],["Fa♯ (F#4)","NOTE.FS4","43"],["Sol (G4)","NOTE.G4","44"],["Sol♯ (G#4)","NOTE.GS4","45"],["La (A4)","NOTE.A4","46"],["La♯ (A#4)","NOTE.AS4","47"],["Ti (B4)","NOTE.B4","48"],["Do (C5)","NOTE.C5","49"]],note:"The full range is defined from ``NOTE.B0(=0)`` to ``NOTE.DS8(=85)``. Up an octave is NOTE.C5/D5/E5...; down an octave is NOTE.C3/D3/E3..."}]},{id:"inputs",title:"6. Input sensors",description:"Read button, touch, tilt, light, and microphone",icon:"sensors",entries:[{name:"Sensors are synchronous (concept)",summary:'Sensor methods are "blocking" calls that send a request and wait for the response.',details:'Unlike LED/buzzer commands which only "send", sensor methods (``button``, ``touch``, ``tilt``, ``light``, ``mic``) send a query to the board and wait until a response comes back. So as soon as the call returns, you have the value at that moment in your hands.\n\nTo monitor a sensor continuously, call the method repeatedly inside ``while True:`` and add a small ``wait(20)`` at the end of each iteration so the board is not polled too aggressively.\n\nWhen a response is broken (sequence index mismatch), the method returns ``None``. The safe pattern is to check for ``None`` immediately after receiving the value and skip that iteration.',example:`from pycombb import Bitblock, wait

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
    bb.disconnect()`},{name:"bb.button()",summary:"Tells you whether the body's A and B buttons are pressed.",details:"Reads the current pressed state of buttons A and B printed on the body, simultaneously.\n\nReturns:\n  tuple[bool, bool] | None: ``(A pressed, B pressed)`` as two booleans. ``None`` if the response is broken.\n\nUnpacking into two variables (``a, b = bb.button()``) makes the code easier to read.",example:`from pycombb import Bitblock, COLOR, wait

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
    bb.disconnect()`},{name:"bb.touch()",summary:"Tells you whether the three capacitive touch pins P0, P1, P2 are touched.",details:"Reads the three capacitive touch pads on the side of the body simultaneously. A channel becomes ``True`` when a finger contacts it.\n\nReturns:\n  tuple[bool, bool, bool] | None: ``(P0, P1, P2)`` as three booleans. ``None`` if the response is broken.",example:`from pycombb import Bitblock, COLOR, wait

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
    bb.disconnect()`},{name:"bb.tilt()",summary:"Tells you which way the body is tilted using the 6-axis IMU.",details:"Returns the tilt the on-board IMU measures, simplified into 4 boolean flags (left / right / forward / backward). Two directions can be ``True`` at the same time (e.g., tilted left + forward).\n\nReturns:\n  tuple[bool, bool, bool, bool] | None: ``(left, right, fwd, back)``. ``None`` if the response is broken.",example:`from pycombb import Bitblock, COLOR, wait

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
    bb.disconnect()`},{name:"bb.light()",summary:"Read the left and right light sensors as integers in 0~1023.",details:`Reads both light sensors on the sides of the body at once and returns two integers. Smaller values mean darker; larger values mean brighter.

Returns:
  tuple[int, int] | None: \`\`(left, right)\`\`, each in 0~1023.

Comparing the two lets you estimate which side the light comes from (e.g., where a flashlight is pointing).`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        result = bb.light()
        if result is None:
            wait(30); continue
        left, right = result

        if left > right + 100:
            print("light from the left")
        elif right > left + 100:
            print("light from the right")
        else:
            print("about equal:", left, right)
        wait(200)
finally:
    bb.disconnect()`},{name:"bb.mic()",summary:"Read the current microphone input level as an integer in 0~1023.",details:`Reads the instantaneous loudness of the single-channel microphone. To detect short loud sounds (like a clap), set a threshold and react when the value exceeds it.

Returns:
  int | None: integer 0~1023. \`\`None\`\` if the response is broken.

Ambient noise often sits around 200~300, so set the threshold by measuring in your actual environment.`,example:`from pycombb import Bitblock, COLOR, wait

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
    bb.disconnect()`}]},{id:"actuators",title:"7. Outputs — servo and DC motor",description:"Control the on-board servo angle and drive the DC motor with PWM",icon:"tune",entries:[{name:"Pin mapping — bb.pin (concept)",summary:"Pin numbers are typically referred to via instance mappings like ``bb.pin.SERVO`` or ``bb.pin.P0``.",details:"The pin labels printed on the main board (SERVO, DCMOTOR, P0~P12) are different from the actual GPIO numbers. Mappings can change across firmware builds, so user code should prefer the ``pin`` attribute on the ``Bitblock`` instance.\n\ne.g., ``bb.pin.SERVO``, ``bb.pin.DCMOTOR``, ``bb.pin.P0``\n\nThere is also a class-level ``PIN`` constant (``from pycombb.bitblock import PIN``), but it may not auto-track firmware updates — instance mapping is recommended.",example:`from pycombb import Bitblock

bb = Bitblock()
bb.connect()

print("SERVO   ->", bb.pin.SERVO)
print("DCMOTOR ->", bb.pin.DCMOTOR)
print("P0      ->", bb.pin.P0)

bb.disconnect()`},{name:"bb.servo(pin, angle)",summary:"Rotate a servo to an angle between 0 and 180 degrees.",details:"Controls the main board's built-in servo (``bb.pin.SERVO``) or an external servo plugged into an extension pin with the same method. The firmware picks the right command set based on the pin number.\n\nArgs:\n  pin (int): Servo pin (typically ``bb.pin.SERVO``).\n  angle (int): An integer angle in 0~180. Out-of-range values may be clipped by the firmware, so it is fine to pre-trim with something like ``clamp(value, 0, 180)``.\nReturns:\n  None\n\nJumping the angle suddenly from 0 to 180 strains the servo. For smooth motion, send small steps with ``wait`` between them in a ``for`` loop.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# Slow 0 → 180 → 0 sweep
for angle in range(0, 181, 10):
    bb.servo(bb.pin.SERVO, angle)
    wait(40)

for angle in range(180, -1, -10):
    bb.servo(bb.pin.SERVO, angle)
    wait(40)

bb.disconnect()`},{name:"bb.dcmotor(pin, value)",summary:"Set the DC motor speed as a PWM value in 0~1023.",details:"A DC motor's speed is proportional to the duty cycle of its PWM signal. The larger ``value`` is, the faster it spins.\n\nArgs:\n  pin (int): The pin the motor is connected to (typically ``bb.pin.DCMOTOR`` or an external PWM pin).\n  value (int): An integer in 0 (stop) ~ 1023 (max speed).\nReturns:\n  None\n\nInternally uses the same ANALOG output packet as ``analog_write``. If the driver is single-direction only, you need an H-bridge or similar circuit to spin the other way.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# Slowly accelerate, then stop
for v in range(0, 1024, 100):
    bb.dcmotor(bb.pin.DCMOTOR, v)
    wait(200)

bb.dcmotor(bb.pin.DCMOTOR, 0)   # Stop
bb.disconnect()`}],tables:[{title:"bb.pin mapping (instance level)",headers:["Attribute","Use","Code example"],rows:[["bb.pin.SERVO","On-board servo","bb.servo(bb.pin.SERVO, 90)"],["bb.pin.DCMOTOR","On-board DC motor","bb.dcmotor(bb.pin.DCMOTOR, 512)"],["bb.pin.P0","Extension digital/analog pin","bb.digital_read(bb.pin.P0)"],["bb.pin.P1","Extension pin","bb.analog_read(bb.pin.P1)"],["bb.pin.P2","Extension pin","bb.dht11(bb.pin.P2)"],["bb.pin.P3","Extension pin","—"],["bb.pin.P4","Extension pin","—"],["bb.pin.P7","Extension pin (typically trig)","bb.ultrasonic(bb.pin.P7, bb.pin.P11)"],["bb.pin.P11","Extension pin (typically echo)","—"],["bb.pin.P12","Extension pin","—"]],note:"The actual GPIO numbers can change across firmware builds, so it is safer to use ``bb.pin.*`` names in code rather than raw GPIO numbers."}]},{id:"ext-sensor",title:"8. Extension sensor board",description:"GPIO digital/analog I/O, ultrasonic, temperature/humidity",icon:"developer_board",entries:[{name:"bb.digital_write(pin, value)",summary:"Output HIGH (1) or LOW (0) on a digital pin.",details:`Use this for parts that only have two states (on/off), like LEDs, relays, or transistor gates.

Args:
  pin (int): The pin to write to (e.g., \`\`bb.pin.P0\`\`).
  value (int): 0 (LOW) or 1 (HIGH).
Returns:
  None`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# Blink an external LED (LED on P0)
for _ in range(5):
    bb.digital_write(bb.pin.P0, 1); wait(300)
    bb.digital_write(bb.pin.P0, 0); wait(300)

bb.disconnect()`},{name:"bb.digital_read(pin)",summary:"Read the current level of a digital pin in pull-up mode (0 or 1).",details:"Reads the current level with the pin configured in pull-up mode. With an external push-button wired to GND, you read ``1`` when not pressed and ``0`` when pressed (pull-up behavior).\n\nArgs:\n  pin (int): Pin number.\nReturns:\n  int | None: ``0`` or ``1``. ``None`` if the response is broken.",example:`from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

try:
    while True:
        v = bb.digital_read(bb.pin.P0)
        if v is None:
            wait(30); continue

        if v == 0:                    # Button pressed (pull-up)
            bb.display.color(COLOR.GREEN)
        else:
            bb.display.clear()
        wait(50)
finally:
    bb.disconnect()`},{name:"bb.analog_write(pin, value)",summary:"Output a PWM signal (0~1023) on a pin.",details:`Where digital pins can only do "on/off", analog output adjusts the duty ratio to produce in-between values — LED brightness, motor speed, buzzer volume, and so on.

Args:
  pin (int): Output pin.
  value (int): Integer in 0 (fully OFF) ~ 1023 (fully ON).
Returns:
  None

Internally identical to \`\`bb.dcmotor\`\`. For readability, use the two names according to intent.`,example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()

# Fade-in an external LED
for v in range(0, 1024, 32):
    bb.analog_write(bb.pin.P1, v)
    wait(40)

# Fade-out
for v in range(1023, -1, -32):
    bb.analog_write(bb.pin.P1, v)
    wait(40)

bb.disconnect()`},{name:"bb.analog_read(pin)",summary:"Read the analog input value of a pin as an integer in 0~1023.",details:"Use this for sensors with continuously varying values: potentiometers, CDS (light), soil-moisture, etc.\n\nArgs:\n  pin (int): Input pin.\nReturns:\n  int | None: integer 0~1023. ``None`` if the response is broken.\n\nTo convert to an intuitive range like 0~100, map with something like ``int(v / 1023 * 100)``.",example:`from pycombb import Bitblock, wait

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
    bb.disconnect()`},{name:"bb.ultrasonic(trig, echo)",summary:"Measure the front distance in cm with an HC-SR04 compatible ultrasonic sensor.",details:`Uses two pins (trigger and echo). The trigger pin emits a short pulse so the sensor sends an ultrasonic wave, and the echo pin measures the time it takes for the reflected wave to return.

Args:
  trig (int): Trigger output pin.
  echo (int): Echo input pin.
Returns:
  int | None: Measured distance (cm). \`\`None\`\` if the response is broken.

The sensor field of view is narrow and the typical range is 2cm ~ 200cm. Too close or too far adds noise, so threshold-based decisions (e.g., warn if under 30cm) are appropriate.`,example:`from pycombb import Bitblock, COLOR, wait

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
    bb.disconnect()`},{name:"bb.dht11(pin)",summary:"Read temperature (°C) and humidity (%) from a DHT11 sensor in one call.",details:"DHT11 is an inexpensive 1-wire temperature/humidity sensor. One read returns both values at once, so they are not requested separately.\n\nArgs:\n  pin (int): Pin connected to the data line.\nReturns:\n  tuple[int, int] | None: ``(temp, humi)`` integers. ``None`` if the response is broken.\n\nDHT11 responds slowly. About once per second is appropriate; calling it too quickly may return the previous reading.",example:`from pycombb import Bitblock, wait

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
    bb.disconnect()`}]},{id:"rccar",title:"9. BB-Car (RC car)",description:"BB-Car driving, turning, distance, line tracing",icon:"directions_car",entries:[{name:"bb.rccar_init() (concept)",summary:"Initialize BB-Car mode and get back an ``RCCar`` controller for driving commands.",details:"BB-Car is a driving module built by inserting the BitBlock body into a chassis. From the body's perspective, two wheels and line, distance, and rear servo sensors are added.\n\nDriving commands are NOT called on the ``Bitblock`` object directly — they are called on the separate controller (typically the ``car`` variable) returned by ``rccar_init()``.\n  ``bb`` ─ the body (LED, buzzer, body sensors)\n  ``car`` ─ the chassis (wheels, line sensor, distance sensor, rear servo)\n\nReturns:\n  Bitblock.RCCar: The BB-Car mode controller.\n\nPutting ``car.stop()`` in a ``finally:`` block guarantees the motors stop even if an error breaks out of the code, preventing the car from rolling off the desk.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.move_forward(120)
    wait(1000)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.move_forward(speed) / move_backward(speed)",summary:"Drive both wheels forward / backward at the same speed.",details:`Args:
  speed (int): Speed in 0~255. Default 100. A negative value is corrected to its absolute value.
Returns:
  None

Speeds around 100~150 are good for desktop demos. Too high causes the car to slide on stop.`,example:`from pycombb import Bitblock, wait

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
    bb.disconnect()`},{name:"car.turn_left(speed) / turn_right(speed)",summary:"Turn while driving — slow one wheel by half to follow a curve.",details:"Both wheels still go forward, but one is slower so the car follows a natural arc. The turning radius grows with ``speed``.\n\nArgs:\n  speed (int): Reference speed (0~255). The inner wheel is automatically set to ``speed/2``.\nReturns:\n  None",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    # S-shaped path
    car.turn_left(150);  wait(800)
    car.turn_right(150); wait(800)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.pivot_left(speed) / pivot_right(speed)",summary:"Pivot in place (one wheel forward + the other backward).",details:"One wheel goes forward and the other backward, so the body spins almost in place. Useful for changing direction in a tight space or making a 90° turn.\n\nArgs:\n  speed (int): Rotation speed (0~255). Default 100.\nReturns:\n  None\n\nCalibrate ``speed`` and ``wait`` time experimentally for 90° / 180° turns (e.g., ``pivot_left(120)`` + ``wait(450)``).",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    # One full pivot in place (approximately)
    car.pivot_left(150);  wait(1800)
    car.stop();           wait(500)
    car.pivot_right(150); wait(1800)
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.wheels(left, right)",summary:"Set left/right wheel speeds directly with signed values.",details:"A negative speed reverses that wheel. Make one negative for behavior similar to ``pivot_*``; tune the difference between the two values for a finer arc than ``turn_*``.\n\nArgs:\n  left (int): Left wheel speed. -255~255.\n  right (int): Right wheel speed. -255~255.\nReturns:\n  None\n\nThe most flexible command for crafting a specific curve radius.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.wheels(150, 80);   wait(1000)   # Gentle right curve
    car.wheels(80, 150);   wait(1000)   # Gentle left curve
    car.wheels(120, -120); wait(800)    # In-place right pivot
    car.stop()
finally:
    car.stop()
    bb.disconnect()`},{name:"car.stop()",summary:"Stop both wheels immediately.",details:"Always end driving with ``stop()``. If the program ends with the last command being ``move_forward``, the motors may keep running.\n\nReturns:\n  None\n\nIn Pyodide, even forcefully stopping the code can leave the serial port alive briefly, so it is safest to guarantee ``stop()`` with a ``try/finally`` block.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    car.move_forward(120)
    wait(1500)
finally:
    car.stop()       # Always stop, no matter how we exit
    bb.disconnect()`},{name:"car.distance()",summary:"Measure the distance to an obstacle in front using BB-Car's ultrasonic sensor (cm).",details:"Reads the ultrasonic sensor on the front of the chassis. Similar to the body method ``bb.ultrasonic``, but you do not specify pins — the firmware automatically uses the standard RC car pins (P7/P9).\n\nReturns:\n  int | None: Front distance (cm). ``None`` if the response is broken.\n\nAbout every 100ms is usually enough. Calling too often can produce jittery values from acoustic interference.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

try:
    while True:
        d = car.distance()
        if d is None:
            wait(50); continue

        if d < 15:                # Obstacle close → stop
            car.stop()
        else:
            car.move_forward(120)
        wait(100)
finally:
    car.stop()
    bb.disconnect()`},{name:"car.line()",summary:"Read the bottom 3-channel line sensor as (left, center, right).",details:"Reads three IR sensors on the underside of the chassis at once. A common assumption is that values drop on dark lines.\n\nReturns:\n  tuple[int, int, int] | None: ``(L, C, R)`` integers. ``None`` if the response is broken.\n\nSensor values and threshold depend on floor color and lighting. In your environment, place the car on/off the line and ``print(car.line())`` to find the values, then choose a midpoint as your threshold.",example:`from pycombb import Bitblock, wait

bb = Bitblock()
bb.connect()
car = bb.rccar_init()

THRESHOLD = 500   # Adjust to your environment

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
            car.move_forward(100)         # Straight
        elif on_l and not on_r:
            car.wheels(40, 120)           # Correct to the left
        elif on_r and not on_l:
            car.wheels(120, 40)           # Correct to the right
        else:
            car.stop()                    # Lost the line or at an intersection

        wait(30)
finally:
    car.stop()
    bb.disconnect()`},{name:"car.servo(pin, angle)",summary:"Rotate a servo connected to BB-Car's rear connector.",details:"Sets the angle of a servo plugged into the rear P3 (or P4) connector of the chassis. The angle is auto-corrected internally with ``clamp(value, 0, 180)``, so out-of-range values are safe.\n\nArgs:\n  pin (int): Servo pin. Typically ``bb.pin.P3`` or ``bb.pin.P4``.\n  angle (int): Angle in 0~180 (auto-clamped if out of range).\nReturns:\n  None",example:`from pycombb import Bitblock, wait

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
    bb.disconnect()`}]},{id:"advanced",title:"10. Advanced — threading and AI integration",description:"Background threads + integrating BitBlock with HelloAI hand recognition",icon:"psychology",entries:[{name:"Why threads (concept)",summary:"Sensor polling and AI inference take time — separating them from the main flow keeps the board responsive.",details:"Up to now, BitBlock code was a single flow that ran one line at a time.\n\nThe problem is that when slow work like camera frame processing, hand/face recognition, or external data reception steps in, LEDs, buzzer, and motors all stall during it. By running board operations and AI inference in separate threads, you can pass results through shared variables and the board can react at its own pace.\n\n``threading.Thread`` works fine in Pyodide. The catch: all serial commands should be called from a single thread. Methods that wait for a board response (``button``, ``touch``, ``ultrasonic``, etc.) get tangled with another thread's commands and produce ``WRONG_PACKET_INDEX`` errors.\n\nRecommended pattern: run AI inference in a background thread that writes to a shared variable. The main thread only reads that variable to control the board.",example:`import threading
from pycombb import Bitblock, COLOR, wait

bb = Bitblock()
bb.connect()

state = {"active": True, "value": 0}

def background():
    """Background loop that mimics heavy work (in reality, AI inference)."""
    counter = 0
    while state["active"]:
        # Time-consuming work
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
    bb.disconnect()`},{name:"HelloAI hand recognition + LED color (example)",summary:"Detect open hand / fist with the camera and change the BitBlock LED color.",details:"This IDE ships with the AI helper package ``helloai``. Use its ``Hand`` module for hand recognition. (For the detailed hand detection API, see the separate AI reference.)\n\nCore structure:\n  1) The background thread receives camera frames, counts fingers, and stores the count in a shared variable.\n  2) The main thread only reads that value and changes the LED color.\n\nThe example below shows the overall shape; replace the ``count_fingers(frame)`` placeholder with an actual ``helloai.Hand`` call. 0 fingers = red / 1~2 = yellow / 3+ = green.",example:`import threading
from pycombb import Bitblock, COLOR, wait

# from helloai import Camera, Hand   # Uncomment for actual use

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
        wait(80)         # Mimic the time of one camera frame

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
    bb.disconnect()`},{name:"Auto-stop — combined distance + line control",summary:"Watch BB-Car's distance and line sensors at the same time, and reflect the state on the body LED.",details:"Watching two sensors together is just two calls inside ``while True:``. But each call waits for a response, so one cycle gets long. If too slow, reduce one polling rate (e.g., distance every 100ms, line every 30ms), or only update the LED on big changes to reduce communication load.\n\nThe example below follows a line, but stops immediately and turns the LED red when an obstacle enters within 15cm.",example:`from pycombb import Bitblock, COLOR, wait

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

        # Measure distance once every 3 cycles (about 90ms)
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
    bb.disconnect()`}]}];export{e as BITBLOCK_TUTORIAL};
