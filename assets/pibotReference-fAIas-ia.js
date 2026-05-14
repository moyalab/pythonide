const e=[{id:"setup",title:"1. Setup",description:"USB dongle driver installation guide",icon:"settings",setup:{intro:"To connect KAMIBOT to a PC over a serial port, you must first install the **USB dongle driver**. Follow the steps below to install it.",steps:['Click the "Download driver" button below to download the installer (CDM21228_Setup.zip), then unzip it.',"Run CDM21228_Setup.exe inside the unzipped folder and follow the prompts to install the driver. A PC reboot may be required.","After installation, plug the USB dongle into your PC and turn on the KAMIBOT robot to connect."],note:"If the port is still not recognized after installation, reboot the PC or try a different USB port.",download:{href:"/drivers/CDM21228_Setup.zip",filename:"CDM21228_Setup.zip",label:"Download driver (CDM21228_Setup.zip)"},pairing:{title:"Pairing the dongle and the robot",intro:"Once the driver is installed, pair the KAMIBOT robot and the USB dongle (KAMIBOT dongle) with the following hardware steps.",steps:["Have the KAMIBOT robot and the KAMIBOT dongle ready.","Turn on the KAMIBOT robot. Its LED will turn on and cycle through several colors.","Plug the KAMIBOT dongle into a USB port on the PC, and bring the KAMIBOT robot as close to the dongle as possible. (The robot closest to the dongle will be paired.)","Press the button on the KAMIBOT dongle.","When the KAMIBOT robot LED turns blue, the hardware connection is complete."]}},notice:"This service (Python IDE for KAMIBOT) works on PCs and Chromebooks (Chrome OS). It does not work on Android tablets or Android phones."},{id:"getting-started",title:"2. Getting started",description:"The most basic commands: connect, close, and wait",icon:"play_circle",entries:[{name:"KamibotPi(port)",summary:"Open a serial port to the KAMIBOT robot and create a controller object.",details:'`KamibotPi` is the main SDK class for handling a single KAMIBOT robot.\nThe serial port opens the moment you create the instance, and from then on every command is sent as ``bot.xxx(...)``.\n\nArgs:\n  port (str): Serial port name. On Windows it looks like ``"COM5"``; on Linux/Mac like ``"/dev/ttyUSB0"``. If ``None``, the program exits immediately.\n  baud (int): Communication speed. Use the firmware default ``57600``.\n  timeout (int | float): Response timeout (seconds). Default ``2``.\n  verbose (bool): When ``True``, prints debug messages on every command. Default ``False``.\n\nBy convention, the variable is named ``bot``. If you plan to play melodies, also import the ``Note`` constants for convenience.',example:`from pibot import KamibotPi

# Open the serial port and connect to KAMIBOT
bot = KamibotPi()
print(bot)

bot.close()`},{name:"bot.close()",summary:"Clean up the serial port and exit the process.",details:"If the port is open, it is flushed and closed, then the process is ended with ``sys.exit(0)``.\nCalling it at the end of your program lets the next program reopen the same port.\n\nReturns:\n  None\n\nIf you want to close the port without exiting, use ``bot.disconnect()``.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Main work (LED, motors, sensors, etc.)
bot.beep(0.3)

# Always close at the end — closes the port cleanly
bot.close()`},{name:"bot.init()",summary:"Reset KAMIBOT's internal state to its initial values.",details:`Use this when you want to return to the starting state after issuing several commands.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Reset to a clean state after running various commands
bot.turn_led(255, 0, 0)
bot.delay(1)
bot.init()

bot.close()`},{name:"bot.delay(sec)",summary:"Pause the program for the given number of seconds.",details:"Internally calls ``time.sleep``. To wait for less than a second, use a decimal like ``0.5``.\n\nArgs:\n  sec (float): Wait time in seconds.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_led(0, 255, 0)   # Turn on the green LED
bot.delay(1.5)            # Hold for 1.5 seconds
bot.turn_led(0, 0, 0)     # Turn off the LED

bot.close()`},{name:"bot.delayms(ms)",summary:"Pause the program for the given number of milliseconds.",details:`A millisecond version of \`\`delay\`\`. Board-side actions are often expressed in milliseconds, so you can use this without manual unit conversion.

Args:
  ms (int | float): Wait time in milliseconds. 500 means a 0.5-second wait.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

for i in range(3):
    bot.beep(0.05)
    bot.delayms(300)   # Wait 0.3 seconds

bot.close()`},{name:"bot.wait(ms)",summary:"Waits in milliseconds, just like delayms.",details:"To match the interface of other board libraries, the same behavior is also exposed under the name ``wait``. Behavior is identical to ``delayms`` — use whichever you prefer.\n\nArgs:\n  ms (int | float): Wait time in milliseconds.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_led(0, 0, 255)   # Blue LED
bot.wait(800)             # Wait 0.8 seconds
bot.turn_led(0, 0, 0)

bot.close()`},{name:"bot.stop()",summary:"Immediately stops a moving KAMIBOT.",details:"Commands like ``go_forward_speed`` and ``go_backward_speed`` keep rolling until you call ``stop``. After moving for the desired duration, you must turn the motors off with ``stop()``.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

# Roll both wheels and stop after 2 seconds
bot.go_forward_speed(80, 80)
bot.delay(2)
bot.stop()

bot.close()`}]},{id:"sound",title:"3. Sound",description:"Beeps and musical notes",icon:"music_note",entries:[{name:"bot.beep(sec=0.2)",summary:'Play a short "beep". You can specify the duration in seconds.',details:"Internally plays note 60 (C4, middle C) as a ``melody`` for ``sec`` seconds.\nIt is the easiest way to give a quick signal — for example, an action notice or a button-press feedback.\n\nArgs:\n  sec (float): Play duration in seconds. Defaults to 0.2 if omitted. Range 0.1 to 25.5.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

# Beep three times with different lengths
bot.beep()       # 0.2 seconds (default)
bot.delay(0.3)
bot.beep(1)      # 1 second
bot.delay(0.3)
bot.beep(0.5)    # 0.5 seconds

bot.close()`},{name:"bot.melody(scale, sec)",summary:"Play the given note for the given duration.",details:"Plays a single note through the buzzer for ``sec`` seconds. ``scale`` can be an integer (0~83) or a constant like ``Note.C4``.\nCall it several times to build a short melody.\n\nArgs:\n  scale (int): Note (0 ~ 83). Constants like ``Note.C4`` also work.\n  sec (float): Play duration in seconds.\n\nReturns:\n  None",example:`from pibot import KamibotPi, Note

bot = KamibotPi()

# C - E - G (C major arpeggio)
bot.melody(Note.C4, 0.4)
bot.melody(Note.E4, 0.4)
bot.melody(Note.G4, 0.4)

bot.close()`,warning2:`To use the Note constants you need: from pibot import Note.
Sharp: Cs4 (=C♯4)  /  Flat: Db4 (=D♭4)  ← aliases that point to the same note`,warning2Type:"info"}],tables:[{title:"Note ↔ scale mapping (octave 4 reference, middle C = Note.C4 = 60)",headers:["Note","Natural/Sharp","Flat alias","scale value"],rows:[["C","C4","—","60"],["C♯","Cs4","Db4","61"],["D","D4","—","62"],["D♯","Ds4","Eb4","63"],["E","E4","—","64"],["F","F4","—","65"],["F♯","Fs4","Gb4","66"],["G","G4","—","67"],["G♯","Gs4","Ab4","68"],["A","A4","—","69"],["A♯","As4","Bb4","70"],["B","B4","—","71"]],note:"For other octaves, add or subtract 12 from the scale value of each row. e.g., C5 = 60 + 12 = 72,  C3 = 60 − 12 = 48. The full range is Note.CM1(=0) ~ Note.B5(=83)."}],entriesAfter:[{name:"Example: police siren",summary:'Alternates two notes quickly to mimic a "wee-woo wee-woo" siren.',example:{description:`A police siren is the very simple pattern of alternating two notes quickly.
It is a great first example for getting comfortable with the melody function and a for loop.

[1] from pibot import KamibotPi, Note
   Import KAMIBOT and the Note scale constants together.

[2] bot = KamibotPi()
   Create the KAMIBOT object.

[4–6] HI, LO, T
   HI = Note.D5 (scale=74): the high tone of the siren
   LO = Note.A4 (scale=69): the low tone. The interval between the two is a perfect fourth (+5).
   T  = 0.3 : duration of one note (seconds). A police siren alternates "quickly", so keep it short.

[8–10] for _ in range(6):
   Repeats the "high → low" pair 6 times (about 3.6 seconds).
   Change the range count to control how long the siren lasts.

[12] bot.close()
   Close the serial port and exit.`,code:`# Import the KAMIBOT driver and the Note constants table.
from pibot import KamibotPi, Note

bot = KamibotPi()

# Police siren: alternate two notes quickly ("wee-woo wee-woo").
# A short note length and a perfect-fourth interval feel bright and urgent.
HI = Note.D5   # High note
LO = Note.A4   # Low note (a perfect fourth below HI)
T  = 0.3       # Duration of one note (seconds)

# Play the HI/LO pair 6 times (about 3.6 seconds total).
# Increasing the range count lengthens the siren.
for _ in range(6):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`}},{name:"Example: ambulance siren",summary:'Alternates two notes more slowly than the police siren to make a "nee-naw nee-naw" sound.',example:{description:`An ambulance siren also alternates two notes, but more slowly than a police siren.
Notice that with the same pattern, just changing the duration of one note (T) and the register completely changes the mood.

[1] from pibot import KamibotPi, Note
   Import KAMIBOT and the Note constants together.

[2] bot = KamibotPi()
   Create the KAMIBOT object.

[4–6] HI, LO, T
   HI = Note.A5 (scale=81): the high tone of the siren
   LO = Note.E5 (scale=76): the low tone. The interval between the two is a perfect fourth (+5).
   T  = 0.9 : duration of one note (seconds). An ambulance alternates "slowly", so keep it long.

[8–10] for _ in range(4):
   Repeats the "high → low" pair 4 times (about 7.2 seconds).

[12] bot.close()
   Close the serial port and exit.

※ Comparison: police siren uses T=0.3 (fast); ambulance uses T=0.9 (slow). The same "two-note alternation" pattern becomes a totally different siren just by changing the timing.`,code:`# Import the KAMIBOT driver and the Note constants table.
from pibot import KamibotPi, Note

bot = KamibotPi()

# Ambulance siren: alternate two notes slowly ("nee-naw nee-naw").
# Notes are longer than the police siren — calmer, but still urgent.
HI = Note.A5   # High note
LO = Note.E5   # Low note (a perfect fourth below HI)
T  = 0.9       # Duration of one note (seconds) — slower than the police siren

# Play the HI/LO pair 4 times (about 7.2 seconds total).
for _ in range(4):
    bot.melody(HI, T)
    bot.melody(LO, T)

bot.close()`}},{name:'Example: play "Für Elise"',summary:`The opening 4 bars + pickup of Beethoven's "Für Elise" (3/8 time, A minor).`,example:{description:`Walk through the code line by line.

[1] from pibot import KamibotPi, Note
   Import the KamibotPi class that controls KAMIBOT, together with the Note class that bundles all the scale constants.

[2] bot = KamibotPi()
   Create the KAMIBOT object. From here on, every command is invoked as bot.xxx().

[3] S = 0.2   # 16th note
   Für Elise is in 3/8 time, so the smallest base unit is the 16th note. We set S to 0.2 seconds.

[4] EE = 0.4  # 8th note
   Two 16th notes make one 8th note. To change the tempo, just adjust S and EE.

[5–13] A4, B4, C4 … Ds5, Gs4
   To avoid writing Note.C4 over and over, store them in short variables.
   Ds5 = D♯5, Gs4 = G♯4.

[15] score = [ ... ]
   The score to play. Each element is a (note, duration) tuple; if note is None, it is treated as a rest.

[17] (E5, S), (Ds5, S)
   Pickup. Just before the first bar, two 16th notes (E5 → D♯5) lead in.

[20] M1: E5 D♯5 E5 B4 D5 C5 — all 16th notes
   The most famous opening line of Für Elise.

[23] M2: A4 (8th) — rest (16th) — C4 E4 A4 (16th)
   In the original, the right hand sustains A4 while the left hand plays the bass C-E-A.
   KAMIBOT can only sound one note at a time, so the two-hand pattern is merged into one line.

[26] M3: B4 (8th) — rest — E4 G♯4 B4
   Same shape as M2, but moved up one note.

[29] M4: C5 (8th) — rest — E4 E5 D♯5
   The melody climbs toward its peak, preparing the next phrase.

[33–37] for note, dur in score: ...
   Take items from the list one by one, play with bot.melody(note, dur) for notes,
   or bot.delay(dur) for rests (None).

[39] bot.close()
   Close the serial port and end the program.`,code:`# Import the KAMIBOT driver and the Note constants table.
# KamibotPi sends commands to KAMIBOT, and Note holds scale constants (C4, D5, ...).
from pibot import KamibotPi, Note

# Create the KAMIBOT object. Every command below is sent through this 'bot'.
bot = KamibotPi()

# 3/8 time. The base unit is the 16th note.
# Two 16th notes (S) make one 8th note (EE).
# To play faster/slower, just change these two numbers.
S = 0.2    # 16th note
EE = 0.4   # 8th note

# Note shortcuts (A minor, octaves 4-5)
# These names appear many times in the score below,
# so we store Note.X4 in short variables to make each line easy to read.
A4  = Note.A4
B4  = Note.B4
C4  = Note.C4
C5  = Note.C5
D5  = Note.D5
Ds5 = Note.Ds5   # D#5
E4  = Note.E4
E5  = Note.E5
Gs4 = Note.Gs4   # G#4

# Score: Für Elise (Beethoven), 3/8 time, A minor — opening 4 bars + pickup
# The score is stored as a list of (note, duration) tuples, like data.
# When note=None, that is a rest (no sound). The loop below reads the list and plays it.
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

# Pull pairs from the score and play them.
# 'note, dur' unpacks each tuple — pitch into 'note', duration into 'dur'.
for note, dur in score:
    if note is None:
        bot.delay(dur)        # Rest: do nothing for 'dur' seconds.
    else:
        bot.melody(note, dur) # Play 'note' for 'dur' seconds.

# When done, always close the serial port so the next program can use it.
bot.close()`}},{name:'Example: play "School Bell"',summary:`An example that plays the children's song "School Bell" with melody (4/4 time).`,example:{description:`Number-score → solfège mapping: 1=Do(C), 2=Re(D), 3=Mi(E), 5=Sol(G), 6=La(A).
Use the Note constants in octave 4 below.

Rhythm units (seconds):
  Q = 0.4   # quarter note
  H = 0.8   # half note
  REST = 0.4 # quarter rest
To change the tempo, just adjust Q and H.

Bar layout (8 bars total):
  M1 Sol Sol La La  (the school bell rings)
  M2 Sol Sol Mi _   (ding ding ding + rest)
  M3 Sol Sol Mi Mi  (let us all gather)
  M4 Re— _          (now, half note + half rest)
  M5 Sol Sol La La  (our teacher)
  M6 Sol Sol Mi _   (is for us + rest)
  M7 Sol Mi Re Mi   (waiting and waiting)
  M8 Do— _          (for us, half note + half rest)

The score list is a sequence of (note, duration) tuples. When the note is None, it is treated as a rest and bot.delay(duration) is called.`,code:`from pibot import KamibotPi, Note

bot = KamibotPi()

# Note durations (seconds) — moderate tempo
Q = 0.4    # quarter note
H = 0.8    # half note
REST = 0.4 # quarter rest

# Number score -> Western notes (octave 4)
DO = Note.C4   # 1 (Do)
RE = Note.D4   # 2 (Re)
MI = Note.E4   # 3 (Mi)
SOL = Note.G4  # 5 (Sol)
LA = Note.A4   # 6 (La)

# Score: School Bell, 4/4 time
# (note, duration) format. None for a rest.
score = [
    # M1: Sol Sol La La
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M2: Sol Sol Mi + rest
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M3: Sol Sol Mi Mi
    (SOL, Q), (SOL, Q), (MI, Q), (MI, Q),
    # M4: Re (half note) + half rest
    (RE, H), (None, H),

    # M5: Sol Sol La La
    (SOL, Q), (SOL, Q), (LA, Q), (LA, Q),
    # M6: Sol Sol Mi + rest
    (SOL, Q), (SOL, Q), (MI, Q), (None, REST),
    # M7: Sol Mi Re Mi
    (SOL, Q), (MI, Q), (RE, Q), (MI, Q),
    # M8: Do (half note) + half rest
    (DO, H), (None, H),
]

for note, dur in score:
    if note is None:
        bot.delay(dur)
    else:
        bot.melody(note, dur)

bot.close()`}}]},{id:"led",title:"4. LED",description:"Turn on the body color LED with RGB values or a color index",icon:"lightbulb",entries:[{name:"bot.turn_led(r, g, b)",summary:"Turn on the body LED with RGB values (each channel 0~255).",details:`Set the brightness of the three channels directly to make any color. All zero turns the LED off.

Args:
  rval (int): Red channel, 0 ~ 255.
  gval (int): Green channel, 0 ~ 255.
  bval (int): Blue channel, 0 ~ 255.

Returns:
  None

If you only need the 9 predefined colors, \`\`turn_led_idx\`\` or the \`\`LED\`\` dict is shorter.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Red → Green → Blue → White
bot.turn_led(255, 0, 0)
bot.delay(0.5)
bot.turn_led(0, 255, 0)
bot.delay(0.5)
bot.turn_led(0, 0, 255)
bot.delay(0.5)
bot.turn_led(255, 255, 255)
bot.delay(0.5)
bot.turn_led(0, 0, 0)     # Off

bot.close()`},{name:"bot.turn_led_idx(idx)",summary:"Turn on the LED using a predefined color index (0~7).",details:`A shortcut function with frequently used colors registered by index. You only need a number — no need to remember RGB values.

Args:
  idx (int): Color number. 0=red, 1=orange, 2=yellow, 3=green, 4=blue, 5=skyblue, 6=purple, 7=white.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Cycle through indexes 0 to 7
for idx in range(8):
    bot.turn_led_idx(idx)
    bot.delay(0.4)

bot.turn_led(0, 0, 0)   # Off
bot.close()`,table:{headers:["idx","Color","RGB"],rows:[["0","red","[255, 0, 0]"],["1","orange","[255, 165, 0]"],["2","yellow","[255, 255, 0]"],["3","green","[0, 255, 0]"],["4","blue","[0, 0, 255]"],["5","skyblue","[0, 255, 255]"],["6","purple","[128, 0, 128]"],["7","white","[255, 255, 255]"]]}},{name:"LED (module constant)",summary:"A dict mapping color names to RGB lists. Pull a color out by its key and unpack it into ``turn_led``.",details:'A dictionary of RGB lists for the 9 predefined colors in the pibot module.\nTo pass it directly as function arguments, unpack like ``*LED["red"]``, or unpack into variables: ``r, g, b = LED["green"]``.\n\nKeys:\n  ``"off"``, ``"red"``, ``"orange"``, ``"yellow"``, ``"green"``, ``"blue"``, ``"skyblue"``, ``"purple"``, ``"white"``\n\nIf you want to iterate by index 0~8, use the ``LED_COLOR`` list (indexes 0~8) which holds the same data.',example:`from pibot import KamibotPi, LED

bot = KamibotPi()

# Pull colors out by key name
bot.turn_led(*LED["red"])
bot.delay(0.5)
bot.turn_led(*LED["green"])
bot.delay(0.5)
bot.turn_led(*LED["blue"])
bot.delay(0.5)
bot.turn_led(*LED["off"])

bot.close()`}],tables:[{title:"SOS Morse code pattern",headers:["Letter","Morse code"],rows:[["S","· · ·"],["O","— — —"],["S","· · ·"]],note:"Morse code expresses letters as combinations of short signals (dots ·) and long signals (dashes —). SOS is the international distress signal — a simple, recognizable pattern used in emergencies. You can express it by blinking the LED short for a dot and long for a dash."},{title:"Morse code timing rules",headers:["Element","Length","Description"],rows:[["Dot (·)","1 unit","Short LED on"],["Dash (—)","3 units","Long LED on"],["Between symbols","1 unit","Gap between dots/dashes within the same letter"],["Between letters","3 units","Gap between S and O, O and S"],["Between signals","7 units","After one full SOS, before starting again"]],note:'You decide what "1 unit" means. The example below uses 1 unit = 0.2 seconds. Make the unit smaller for a faster signal or larger for a slower one.'}],entriesAfter:[{name:"Example: send SOS with the red LED",summary:"Blink the red LED in the Morse SOS pattern (· · · — — — · · ·) to express a distress signal.",details:`Sequence:
  1. S = short-short-short (3 dots)
  2. O = long-long-long (3 dashes)
  3. S = short-short-short (3 dots)
  4. Pause briefly, then repeat from the start

Code structure:
  - blink(units): turn the LED on and off for one symbol, then wait the inter-symbol gap (1 unit)
  - send(pattern): send a single letter like "..." or "---" and add the inter-letter gap
  - try/finally: even if interrupted, make sure to turn off the LED and close the port`,example:`from pibot import KamibotPi

# 1 unit = 0.2 seconds — change this to make the signal faster/slower
UNIT = 0.2
RED = (255, 0, 0)
OFF = (0, 0, 0)


def blink(bot, units):
    bot.turn_led(*RED)
    bot.delay(UNIT * units)
    bot.turn_led(*OFF)
    bot.delay(UNIT)  # Inter-symbol gap within a letter


def send(bot, pattern):
    for symbol in pattern:
        blink(bot, 1 if symbol == "." else 3)
    bot.delay(UNIT * 2)  # Extend symbol gap (1) to letter gap (3)


bot = KamibotPi()

try:
    for _ in range(3):
        send(bot, "...")   # S
        send(bot, "---")   # O
        send(bot, "...")   # S
        bot.delay(UNIT * 4)  # Extend letter gap (3) to word gap (7)
finally:
    bot.turn_led(*OFF)
    bot.close()`}]},{id:"speed-control",title:"5. Speed control",description:"Set the two wheel speeds (0~100) directly to drive straight, curve, or spin in place",icon:"speed",entries:[{name:"bot.go_forward_speed(lspeed, rspeed)",summary:"Drive forward with the two given wheel speeds. Keeps moving until stopped.",details:'Drives the left and right wheels forward at the given speeds. Equal speeds go straight; if one is faster, the robot curves toward the slower side.\nThis function only "turns the motors on" — wait the desired time with ``delay`` and then turn them off with ``stop()``.\n\nArgs:\n  lspeed (int): Left wheel speed. 0 ~ 100.\n  rspeed (int): Right wheel speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.go_forward_speed(80, 80)   # Same speed → straight ahead
bot.delay(2)
bot.stop()

bot.close()`},{name:"bot.go_backward_speed(lspeed, rspeed)",summary:"Drive backward with the two given wheel speeds.",details:"The reverse version of ``go_forward_speed``. The pattern (start rolling → wait → ``stop()``) is the same.\n\nArgs:\n  lspeed (int): Left wheel speed. 0 ~ 100.\n  rspeed (int): Right wheel speed. 0 ~ 100.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

bot.go_backward_speed(80, 80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_left_speed(speed)",summary:"Curves forward to the left (drives only the right wheel).",details:`Drives only the right wheel, drawing a wide arc to the left. This is not an in-place rotation but a "curve to the left".

Args:
  speed (int): Rotation speed. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.go_left_speed(80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_right_speed(speed)",summary:"Curves forward to the right (drives only the left wheel).",details:`Drives only the left wheel, drawing a wide arc to the right. Pair with \`\`go_left_speed\`\` to make S-shaped courses.

Args:
  speed (int): Rotation speed. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.go_right_speed(80)
bot.delay(1.5)
bot.stop()

bot.close()`},{name:"bot.go_dir_speed(ldir, lspeed, rdir, rspeed)",summary:"Set each wheel's direction and speed independently — the most flexible speed command.",details:'Set the "forward/backward" direction and speed for each wheel separately. Spinning both wheels in opposite directions at the same speed gives an in-place rotation.\n\nArgs:\n  ldir (str): Left wheel direction. ``"f"`` forward / ``"b"`` backward.\n  lspeed (int): Left wheel speed. 0 ~ 100.\n  rdir (str): Right wheel direction. ``"f"`` / ``"b"``.\n  rspeed (int): Right wheel speed. 0 ~ 100.\n\nReturns:\n  None\n\nIn-place clockwise rotation = left ``"f"``, right ``"b"`` (same speed).',example:`from pibot import KamibotPi

bot = KamibotPi()

# Spin clockwise in place
bot.go_dir_speed("f", 80, "b", 80)
bot.delay(1.5)
bot.stop()

bot.close()`}],entriesAfter:[{name:"Example: forward 2 seconds",summary:"Drive both wheels at the same speed straight forward for 2 seconds, then stop.",details:`go_forward_speed only "turns the motors on". The robot keeps moving until you call stop(), so you must wait the desired time with delay before stopping.

[1] from pibot import KamibotPi
   Import the KAMIBOT class.

[2] bot = KamibotPi()
   Create the KAMIBOT object.

[4] bot.go_forward_speed(100, 100)
   Drive both wheels forward at speed 100. Same speed = straight ahead.

[5] bot.delay(2)
   Wait 2 seconds while the robot keeps rolling. This time becomes the travel duration.

[6] bot.stop()
   Stop both motors. Without this line, KAMIBOT would keep going forever.

[7] bot.close()
   Close the serial port and exit.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Drive both wheels at the same speed for a straight run.
# go_forward_speed only turns the motors on — they keep going until stop().
bot.go_forward_speed(100, 100)
bot.delay(2)   # Keep moving for 2 seconds
bot.stop()     # Turn the motors off

bot.close()`},{name:"Example: backward 2 seconds",summary:"Drive both wheels at the same speed backward for 2 seconds, then stop.",details:`Same pattern as "Forward 2 seconds" — just go_forward_speed swapped for go_backward_speed.
See for yourself how changing one word changes the behavior.

[4] bot.go_backward_speed(100, 100)
   Drive both wheels backward at speed 100.

[5] bot.delay(2)
   Keep going backward for 2 seconds.

[6] bot.stop()
   Stop both motors.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Same pattern as the "forward 2 seconds" example,
# only the command changes from go_forward_speed to go_backward_speed.
bot.go_backward_speed(100, 100)
bot.delay(2)
bot.stop()

bot.close()`},{name:"Example: spin in place",summary:"Drive the left wheel forward and the right wheel backward to spin in place.",details:`When the two wheels turn at the same speed but in "opposite directions", KAMIBOT does not move forward — it spins in place. A single go_dir_speed call is enough.

[4] bot.go_dir_speed("f", 100, "b", 100)
   Left: "f" (forward) at speed 100, right: "b" (backward) at speed 100.
   Because the wheels go in opposite directions, the body stays put and rotates.

[5] bot.delay(2)
   Hold the rotation for 2 seconds. Increase the time to spin more.

[6] bot.stop()
   Stop the rotation.

※ To rotate the other way, swap ldir and rdir (e.g., "b", 100, "f", 100).`,example:`from pibot import KamibotPi

bot = KamibotPi()

# In-place rotation: left wheel forward, right wheel backward.
# When the two wheels move at the same speed in opposite directions,
# the body rotates without leaving its spot.
bot.go_dir_speed("f", 100, "b", 100)
bot.delay(2)   # Spin for 2 seconds
bot.stop()

bot.close()`},{name:"Example: drive an S-shape",summary:"Alternate left and right curves to move in an S shape.",details:`An S-curve is one "left curve → right curve" pair.
go_left_speed curves to the left and go_right_speed curves to the right (driving only one wheel).
Alternating the two with a for loop naturally produces an S-shaped path.

[4] T = 1.0
   Duration of one curve (seconds). Increase for a larger S, decrease for a smaller S.

[6] for _ in range(2):
   Repeat the "left curve + right curve" pair twice (two full S-shapes).

[7] bot.go_left_speed(100)
   Curve to the left.

[8] bot.delay(T)
   Hold the left curve for T seconds.

[9] bot.go_right_speed(100)
   Then curve to the right.

[10] bot.delay(T)
   Hold the right curve for T seconds.

[12] bot.stop()
   When the last curve ends, stop both motors.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# S-curve = repeat "left curve → right curve".
# go_left_speed curves to the left (drives only one wheel),
# go_right_speed curves to the right.
T = 1.0  # Duration of one curve (seconds) — larger T = larger S

for _ in range(2):
    bot.go_left_speed(100)   # Curve left
    bot.delay(T)
    bot.go_right_speed(100)  # Curve right
    bot.delay(T)

bot.stop()
bot.close()`}]},{id:"precision",title:"6. Precision control (cm/sec/step)",description:"Move precisely by specifying a unit (cm, sec, step) or angle",icon:"straighten",entries:[{name:"bot.move_forward_unit(value, opt, speed)",summary:"Move forward precisely by the given unit (cm, sec, step).",details:'Instead of being time-based (``delay``), the firmware guarantees the distance for the given unit. It stops automatically when done — no need to call ``stop()``.\n\nArgs:\n  value (int): The amount to move.\n  opt (str): ``"-l"`` length (cm) / ``"-t"`` time (seconds) / ``"-s"`` step count.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

# Drive exactly 20cm forward
bot.move_forward_unit(20, "-l", 50)

bot.close()`},{name:"bot.move_backward_unit(value, opt, speed)",summary:"Move backward precisely by the given unit (cm, sec, step).",details:'The reverse version of ``move_forward_unit``. Stops automatically when done.\n\nArgs:\n  value (int): The amount to move.\n  opt (str): ``"-l"`` cm / ``"-t"`` sec / ``"-s"`` step.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.move_backward_unit(20, "-l", 50)

bot.close()`},{name:"bot.move_left_unit(value, opt, speed)",summary:"Strafe (slide) the body to the left by the given unit.",details:'Drives the wheels in opposite directions so the body slides to the left. This is sideways motion, not rotation.\n\nArgs:\n  value (int): The amount to move.\n  opt (str): ``"-l"`` cm / ``"-t"`` sec / ``"-s"`` step.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.move_left_unit(10, "-l", 50)

bot.close()`},{name:"bot.move_right_unit(value, opt, speed)",summary:"Strafe (slide) the body to the right by the given unit.",details:'The opposite-direction version of ``move_left_unit``.\n\nArgs:\n  value (int): The amount to move.\n  opt (str): ``"-l"`` cm / ``"-t"`` sec / ``"-s"`` step.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.move_right_unit(10, "-l", 50)

bot.close()`},{name:"bot.turn_left_speed(value, speed)",summary:"Rotate left in place by the given angle.",details:`Rotates left without leaving its spot. Stops automatically when the rotation finishes.

Args:
  value (int): Rotation angle (degrees).
  speed (int): Rotation speed. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_left_speed(90, 50)   # Left 90°

bot.close()`},{name:"bot.turn_right_speed(value, speed)",summary:"Rotate right in place by the given angle.",details:"The opposite-direction version of ``turn_left_speed``. Often used for drawing shapes — for a regular n-gon, rotate ``360 / n`` degrees at each corner.\n\nArgs:\n  value (int): Rotation angle (degrees).\n  speed (int): Rotation speed. 0 ~ 100.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_right_speed(90, 50)   # Right 90°

bot.close()`},{name:"bot.move_step(ldir, lstep, rdir, rstep)",summary:"Specify direction and step count for each wheel separately — combine curves and rotations freely.",details:'Mix freely — for example, 200 steps forward on one side and 100 steps backward on the other. Same direction and same steps drive straight; one side stepping more curves; opposite directions rotate in place.\n\nArgs:\n  ldir (str): Left wheel direction. ``"f"`` / ``"b"``.\n  lstep (int): Left wheel step count.\n  rdir (str): Right wheel direction. ``"f"`` / ``"b"``.\n  rstep (int): Right wheel step count.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

# 200 steps on each side → straight ahead
bot.move_step("f", 200, "f", 200)

bot.close()`},{name:"bot.move_time(ldir, lsec, rdir, rsec)",summary:"Specify direction and run time (seconds) for each wheel separately.",details:'A time-based version of ``move_step``. Equal times on both sides drive straight or backward; one side longer makes that wheel turn more, producing a curve.\n\nArgs:\n  ldir (str): Left wheel direction. ``"f"`` / ``"b"``.\n  lsec (int | float): Left wheel run time (seconds).\n  rdir (str): Right wheel direction.\n  rsec (int | float): Right wheel run time (seconds).\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

# Forward 2 seconds on both sides
bot.move_time("f", 2, "f", 2)

bot.close()`},{name:"bot.turn_continous(dir, speed)",summary:"Rotate in place in the given direction continuously, until stopped.",details:'This command only "turns rotation on" — it keeps spinning until you call ``stop()``. For timed control, combine with ``delay`` + ``stop``.\n\nArgs:\n  dir (str): Direction. ``"l"`` left / ``"r"`` right.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_continous("r", 80)
bot.delay(2)
bot.stop()

bot.close()`}],entriesAfter:[{name:"Example 1: 30cm there and back",summary:'Drive exactly 30 cm forward with the "-l" option, turn 180°, and return to the starting point. A first example for getting comfortable with units and angles.',details:`Learning points:
  · "-l" is the length option that interprets value as cm. ("-t"=seconds, "-s"=steps)
  · Speed is between 0 and 100. 50 is moderate.
  · turn_right_speed(180, 50) = a half-turn (180°) in place.

Code flow:
  1) Move 30 cm forward
  2) Rotate 180° in place
  3) Move 30 cm again → back to the start
  4) bot.close() to close the port

※ Try it: change 30 to 50 and compare with the actual measured distance. Floor surface can affect the real travel distance slightly.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Move exactly 30 cm forward.
# "-l" means the value (30) is in centimeters (length).
# Speed 50 is a moderate middle speed (0-100).
bot.move_forward_unit(30, "-l", 50)

# Rotate 180° in place → now facing the start.
bot.turn_right_speed(180, 50)

# Move forward again — back to the starting point.
bot.move_forward_unit(30, "-l", 50)

bot.close()`},{name:"Example 2: draw a square",summary:"Draw a square with 20 cm sides using a for loop. Side length and speed are in variables, so changing one place changes the size or speed.",details:`Learning points:
  · A square has 4 sides and 4 right angles (90°).
  · Repeating "go straight → turn 90°" 4 times brings you back to the start.
  · Make a habit of wrapping repeated patterns in a for loop.

Code flow:
  · SIDE / SPEED are constants at the top — change one place, change everything
  · for _ in range(4): repeat the same action 4 times
  · Each iteration: forward SIDE cm → turn right 90°

※ Try it:
  · SIDE = 10 makes a small square; SIDE = 40 makes a big one.
  · What if you change turn_right_speed → turn_left_speed? (counterclockwise)`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 20    # Side length (cm)
SPEED = 50   # 0 ~ 100

# A square has 4 equal sides and 4 right-angle (90°) corners.
# Pattern: go forward one side → turn right 90°. Repeat 4 times.
for _ in range(4):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(90, SPEED)

bot.close()`},{name:"Example 3: draw an equilateral triangle (the exterior angle)",summary:"Draw an equilateral triangle with 25 cm sides. The key is that the rotation angle is 120°, not 60°!",details:`Learning points — "exterior angle" is the key:
  · KAMIBOT rotates by the "exterior angle", not the interior (60°), at each corner.
  · Exterior angle of a regular n-gon = 360 / n
      - Triangle: 360 / 3 = 120°
      - Square:   360 / 4 =  90°  (Example 2)
      - Hexagon:  360 / 6 =  60°
  · This comes from the fact that going around an n-gon adds up to 360° = one full turn.

The code is almost the same as Example 2.
Only the "rotation angle" and "loop count" change. Compare the two side by side.

※ Try it:
  · TURN = 360 // 5, repeat 5 times → regular pentagon
  · TURN = 360 // 6, repeat 6 times → regular hexagon`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 25
SPEED = 50

# At each corner, KAMIBOT rotates by the "exterior angle", not the interior.
# Exterior angle of a regular n-gon = 360 / number of sides.
# Triangle => 360 / 3 = 120°.
SIDES = 3
TURN = 360 // SIDES   # = 120

for _ in range(SIDES):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"Example 4: draw a 5-point star (★) without lifting the pen",summary:"Just like drawing a star without lifting the pen, KAMIBOT bends 144° at each of the 5 points to draw a star.",details:`Learning point — why 144°?
  · When you draw a star without lifting the pen, by the time you return to the start KAMIBOT has rotated two full turns (720°).
  · There are 5 points, so the rotation at each point = 720 / 5 = 144°.
  · Why this differs from the regular n-gon formula (360 / n): a star crosses each point twice in a single stroke, so it makes two full turns.

The code looks just like Example 3 — only the rotation angle and the loop count differ.
See how varied the shapes get with the same pattern (forward → turn → repeat).

※ Try it:
  · For a 7-point star, skipping every other point gives a total rotation of 720°, so 720 / 7 ≈ 103°.
  · Too large a SIDE runs out of space! 30~40 cm works well.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 30
SPEED = 50

# A 5-point star is drawn in one stroke by skipping every other point.
# When complete, KAMIBOT has rotated a total of 720° (two full turns).
# 720° / 5 points = 144° rotation at each point.
POINT_TURN = 144

for _ in range(5):
    bot.move_forward_unit(SIDE, "-l", SPEED)
    bot.turn_right_speed(POINT_TURN, SPEED)

bot.close()`},{name:"Example 5: drive each wheel separately to make curves and rotations",summary:"Use move_step to set left/right motor steps independently and demonstrate straight, right arc, and in-place rotation in order.",details:`Learning points — the 4 arguments of move_step:
  bot.move_step(ldir, lstep, rdir, rstep)
    · ldir/rdir: left/right motor direction ("f" forward / "b" backward)
    · lstep/rstep: left/right motor step counts

Just remember three rules:
  1) Same direction + same steps    → straight forward/backward
  2) One side steps more            → curves toward the side stepping less
  3) Opposite directions on each side → in-place rotation

The code shows three actions in order:
  · (f200, f200) → straight
  · (f300, f150) → left wheel turns more, so the robot curves to the right
  · (f200, b200) → left forward + right backward → in-place clockwise rotation
delay(0.5) is a short pause between actions so KAMIBOT clearly receives the next command.

※ Try it:
  · Change (f300, f150) to (f250, f200) and the arc gets larger (less curvature).
  · For a small circle, try repeating (f400, f200) several times.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# move_step(left direction, left steps, right direction, right steps)
# Three simple rules:
#   1) Same direction + same steps -> straight
#   2) One side steps more         -> curve toward the side that stepped less
#   3) Opposite directions         -> in-place rotation

# 1) Straight: both wheels forward 200 steps.
bot.move_step("f", 200, "f", 200)
bot.delay(0.5)

# 2) Curve to the right: the left wheel turns more than the right.
bot.move_step("f", 300, "f", 150)
bot.delay(0.5)

# 3) In-place clockwise rotation: left forward + right backward.
bot.move_step("f", 200, "b", 200)

bot.close()`}]},{id:"top-motor",title:"7. Top motor",description:"Control angle, time, and rotations of the top stepper motor (e.g., pen holder)",icon:"rotate_right",entries:[{name:"bot.top_motor_degree(dir, value, speed)",summary:"Rotate the top motor by the given angle (relative rotation from the current position).",details:'Rotates the stepper motor on KAMIBOT\'s head "by ``value`` degrees more from where it is now".\nNote: top motor direction is ``"l"/"r"``, unlike wheel direction (``"f"/"b"``).\n\nArgs:\n  dir (str): Rotation direction. ``"l"`` left / ``"r"`` right.\n  value (int): Rotation angle (degrees).\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None\n\nTo go to "exactly N degrees regardless of where you are now", use ``top_motor_abspos``.',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.top_motor_degree("r", 90, 50)   # Right 90°
bot.delay(0.5)
bot.top_motor_degree("l", 90, 50)   # Left 90° → back to the start

bot.close()`},{name:"bot.top_motor_abspos(degree, speed)",summary:"Move the top motor to an absolute angular position (relative to 0°).",details:`Not "add N degrees from here" but "go to exactly N degrees".
The advantage is no accumulated error even when called many times.

Args:
  degree (int): Absolute angle. 0 ~ 65000.
  speed (int): Speed. 0 ~ 100.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.top_motor_abspos(180, 50)   # Exactly to 180°
bot.delay(1)
bot.top_motor_abspos(0, 50)     # Exactly back to 0°

bot.close()`},{name:"bot.top_motor_time(dir, value, speed)",summary:"Rotate the top motor for the given time (seconds).",details:'Use this to drive by time instead of by angle. Speed and time together determine the amount of rotation.\n\nArgs:\n  dir (str): Direction. ``"l"`` / ``"r"``.\n  value (int | float): Rotation time (seconds).\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.top_motor_time("l", 3, 50)   # Rotate left for 3 seconds

bot.close()`},{name:"bot.top_motor_round(dir, value, speed)",summary:"Rotate the top motor by the given number of full rotations (1 rotation = 360°).",details:'Specify "how many turns" instead of degrees. 1 means one full turn; 2 means two.\n\nArgs:\n  dir (str): Direction. ``"l"`` / ``"r"``.\n  value (int): Number of rotations.\n  speed (int): Speed. 0 ~ 100.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.top_motor_round("r", 1, 50)   # One full turn to the right

bot.close()`},{name:"bot.top_motor_stop()",summary:"Immediately stop a rotating top motor.",details:"Use this to interrupt a pre-set action, like one started with ``top_motor_time``.\n\nReturns:\n  None",example:`from pibot import KamibotPi

bot = KamibotPi()

# Try a 5-second rotation but force-stop after 1 second
bot.top_motor_time("r", 5, 50)
bot.delay(1)
bot.top_motor_stop()

bot.close()`}],entriesAfter:[{name:"Example 1: lift the pen 90° and put it down again",summary:"Rotate 90° to the right, pause briefly, then 90° to the left to return precisely to the starting position. The safest first step when working with the top motor.",details:`Learning points:
  · top_motor_degree(dir, value, speed) — set direction, angle, and speed.
  · dir = "r" right / "l" left. (Different from wheel motors' "f"/"b" — be careful!)
  · Rotating the same angle in the opposite direction → returns to the original position.
  · A delay(0.5) between two actions lets the motor settle before the next command.

Code flow:
  1) Rotate 90° to the right (like lifting a pen)
  2) Rest 0.5 seconds
  3) Rotate 90° to the left → back to the start

※ Try it:
  · Replace 90 with 45 or 180 — the rotation amount changes accordingly.
  · Reduce the speed (50) to 20 to slow down, or raise it to 100 to speed up.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# Rotate the top motor 90° to the right (e.g., lift a pen).
# Args: direction ("r"/"l"), angle (degrees), speed (0-100).
bot.top_motor_degree("r", 90, 50)

# Brief pause so the motor stops cleanly before the next command.
bot.delay(0.5)

# Rotate 90° back to the left — return to the starting position.
bot.top_motor_degree("l", 90, 50)

bot.close()`},{name:"Example 2: move to an exact absolute position",summary:'top_motor_abspos goes "to exactly this angle, no matter where you are now". Demonstrates 0° → 180° → 0° in order.',details:`Learning points — relative rotation vs absolute position:
  · top_motor_degree("r", 90, ...) = "from here, 90° more to the right" (relative)
  · top_motor_abspos(180, ...)     = "go to exactly 180° relative to 0°" (absolute)
  · Absolute positions have no accumulated error, so repeated calls always end up in the same place.
  · The angle range can go from 0 to 65000.

Code flow:
  1) abspos(180) → rotate to absolute 180°
  2) Wait 1 second
  3) abspos(0)   → return to 0° (start)

※ Try it:
  · Compare 180 with 90, 270, etc.
  · What happens if you call the same abspos value twice? — the motor barely moves because it is already there.`,example:`from pibot import KamibotPi

bot = KamibotPi()

# abspos = "absolute position" — go to exactly this angle, regardless of where you are now.
# Different from top_motor_degree, which adds an angle to the current position.
bot.top_motor_abspos(180, 50)

bot.delay(1)

# Return to the reference (0°).
bot.top_motor_abspos(0, 50)

bot.close()`},{name:"Example 3: shake left/right 5 times (using a loop)",summary:"Use a for loop to repeat right 30° → left 30° five times. Each pair cancels out, so it ends back at the starting position.",details:`Learning points:
  · When "right N° → left N°" is paired and repeated, the cumulative rotation is 0.
  · So even after the loop, the motor is back at the starting position — handy for demos and tests.
  · Constants like ANGLE / TIMES at the top let you change the behavior in one place.
  · A delay(0.3) between actions makes the shaking visible.

Code flow:
  · Repeat range(TIMES) times
  · One iteration: right ANGLE° → brief pause → left ANGLE° → brief pause

※ Try it:
  · TIMES = 10 to shake longer.
  · ANGLE = 10 for tiny tremors; ANGLE = 60 for big swings.
  · What if you swap the order to "left → right"? Same motion but starts in the opposite direction.`,example:`from pibot import KamibotPi

bot = KamibotPi()

ANGLE = 30   # Angle of one swing (degrees)
TIMES = 5    # Number of left/right round trips
SPEED = 60

# Each iteration shakes the same angle right then left,
# so the motor ends up at the starting position.
for _ in range(TIMES):
    bot.top_motor_degree("r", ANGLE, SPEED)
    bot.delay(0.3)
    bot.top_motor_degree("l", ANGLE, SPEED)
    bot.delay(0.3)

bot.close()`}]},{id:"shapes",title:"8. Drawing shapes",description:"Auto-draw built-in shapes: triangle, square, star, circle, arc, etc.",icon:"category",entries:[{name:"bot.draw_tri(len)",summary:"Draw a triangle by specifying the side length.",details:`Firmware bundles forward + 120° (exterior) rotation automatically and traces the shape. When done, KAMIBOT returns to the starting point and heading.

Args:
  len (int): Side length (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_tri(20)   # 20 cm-side triangle

bot.close()`},{name:"bot.draw_rect(len)",summary:"Draw a square by specifying the side length.",details:`Encapsulates "go forward + turn 90° four times" into one line. Returns to the starting point when done.

Args:
  len (int): Side length (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_rect(20)   # 20 cm-side square

bot.close()`},{name:"bot.draw_penta(len)",summary:"Draw a regular pentagon by specifying the side length.",details:`Rotates 5 times by exterior angle \`\`360 / 5 = 72°\`\`. Returns to the starting point when done.

Args:
  len (int): Side length (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_penta(20)

bot.close()`},{name:"bot.draw_hexa(len)",summary:"Draw a regular hexagon by specifying the side length.",details:`Rotates 6 times by exterior angle \`\`360 / 6 = 60°\`\`. Returns to the starting point when done.

Args:
  len (int): Side length (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_hexa(20)

bot.close()`},{name:"bot.draw_star(len)",summary:"Draw a 5-point star (★) in one stroke by specifying the side length.",details:`Bends 144° at each point and goes straight 5 times. Because it is one stroke, KAMIBOT rotates a total of 720° (two full turns).

Args:
  len (int): Side length (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_star(20)

bot.close()`},{name:"bot.draw_circle(len)",summary:"Draw a circle by specifying the radius.",details:`Forms an arc by speed difference between the two wheels and completes a full 360° turn. Returns to the starting point when done.

Args:
  len (int): Radius (cm).

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_circle(15)   # Circle with 15 cm radius

bot.close()`},{name:'bot.draw_semicircle(len, side="l")',summary:"Draw a semicircle (180° arc). Does NOT return to the starting point.",details:'Draws a left- or right-curving semicircle. Unlike ``draw_circle``, when done KAMIBOT is at the opposite end of the arc — be aware.\nA pattern of "left semicircle → right semicircle" naturally produces an S-curve.\n\nArgs:\n  len (int): Radius (cm).\n  side (str): Curve direction. ``"l"`` left / ``"r"`` right.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

# S-curve
bot.draw_semicircle(15, "l")
bot.draw_semicircle(15, "r")

bot.close()`},{name:"bot.draw_arc(radius, value, mode=0)",summary:"Draw an arc by time or by angle.",details:'Specify both the radius and "how much" — either as time (seconds) or angle (degrees).\nWhen ``mode=0``, ``value`` is the duration (seconds); when ``mode=1``, it is the central angle (degrees).\n\nArgs:\n  radius (int): Radius (cm).\n  value (int): Time (sec) or angle (deg) depending on mode.\n  mode (int): ``0`` time-based / ``1`` angle-based. Default 0.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.draw_arc(15, 2, 0)    # Radius 15 cm, draw arc for 2 seconds
bot.delay(0.5)
bot.draw_arc(15, 90, 1)   # Radius 15 cm, draw a 90° arc

bot.close()`}],entriesAfter:[{name:"Example 1: the shape quartet (triangle, square, pentagon, hexagon in a row)",summary:"Call draw_tri / draw_rect / draw_penta / draw_hexa in sequence to line up four shapes with different numbers of sides.",details:`Learning points:
  · The draw_xxx(len) functions automatically draw a single shape from just the side (or radius) length.
  · After a draw, KAMIBOT returns to the starting point and heading — you must move it sideways before the next shape so they do not overlap.
  · As the number of sides grows (3 → 4 → 5 → 6), the shape gets closer to a circle.

Code flow:
  1) Draw the triangle (20 cm side)
  2) Move forward 25 cm → make space for the next
  3) Draw a square → move again
  4) Same for pentagon and hexagon

※ Try it:
  · SIDE = 15 makes them small; SIDE = 30 makes them big.
  · Add draw_circle(10) at the end to see "polygon → circle" progression.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 20      # Side length (cm)
SPEED = 50
GAP = 25       # Gap between shapes

# 1) Triangle: 3 sides
bot.draw_tri(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 2) Square: 4 sides
bot.draw_rect(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 3) Pentagon: 5 sides
bot.draw_penta(SIDE)
bot.move_forward_unit(GAP, "-l", SPEED)

# 4) Hexagon: 6 sides — already looks close to a circle!
bot.draw_hexa(SIDE)

bot.close()`},{name:"Example 2: square pinwheel (repeat rotation to make a flower shape)",summary:"Rotate 30° in place each time you draw a square. Repeating 12 times completes a full 360° turn for a pinwheel/flower made of 12 overlapping squares.",details:`Learning points — combining shape + rotation:
  · draw_rect returns to the starting point and heading after one draw.
  · Rotating 30° each iteration tilts the next square by another 30°.
  · 360 / 30 = 12 → exactly 12 iterations close the pattern.

Code flow:
  · for _ in range(12): repeat the same action 12 times
  · Each iteration: draw a square → turn right 30°

※ Try it:
  · Set TURN to 60° (6 iterations) or 45° (8 iterations) to control the petal count.
  · Replace draw_rect with draw_tri to get a triangle pinwheel.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 15
SPEED = 50
TURN = 30                # Rotation angle between shapes (degrees)
PETALS = 360 // TURN     # = 12 — fits exactly one full turn

# Draw the same square many times, rotating slightly each time.
# After PETALS iterations the cumulative rotation is 360° → flower complete.
for _ in range(PETALS):
    bot.draw_rect(SIDE)
    bot.turn_right_speed(TURN, SPEED)

bot.close()`},{name:"Example 3: growing triangles (using a list of sizes)",summary:"Draw four triangles with sides 10, 15, 20, 25 in order. Shows at a glance how the result changes when you pass different values to the same function.",details:`Learning points — feeding values one at a time from a list:
  · A list is the cleanest way to repeat the same action with different values.
  · Predefine sizes = [10, 15, 20, 25] and pull values out with a for loop.
  · Easy to add or modify values; the body of the code barely changes when the result changes.

Code flow:
  · Build the sizes list
  · for size in sizes: draw triangle(size) → move sideways

※ Try it:
  · sizes = [25, 20, 15, 10] reverses the effect for a shrinking series.
  · Replace draw_tri with draw_penta to get a series of four pentagons.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SPEED = 50
GAP = 30

# List of side lengths — same shape, different sizes.
sizes = [10, 15, 20, 25]

for size in sizes:
    bot.draw_tri(size)                        # Draw a triangle with this size
    bot.move_forward_unit(GAP, "-l", SPEED)   # Move to the next position

bot.close()`},{name:"Example 4: curve-y path (combining circles and semicircles)",summary:"Draw one circle with draw_circle, then alternate left/right semicircles with draw_semicircle to make an S-shaped path.",details:`Learning points — the curve drawing functions:
  · draw_circle(r)         — one circle of radius r. Returns to the start.
  · draw_semicircle(r, "l") — semicircle curving left
  · draw_semicircle(r, "r") — semicircle curving right
  · A semicircle does NOT return to the start; KAMIBOT ends up at the opposite end.
  · Alternating "l" and "r" produces an S-shaped (or wavy) path.

Code flow:
  1) Draw one circle → starting point unchanged
  2) Move slightly forward to clear space
  3) Left semicircle → right semicircle → left semicircle (S pattern)

※ Try it:
  · Compare R = 10 vs 20 to see different curvature.
  · Use the same letter ("l", "l", "l") to make a long curve in one direction.`,example:`from pibot import KamibotPi

bot = KamibotPi()

R = 12          # Same radius for the circle and all semicircles
SPEED = 50

# 1) One circle — KAMIBOT returns to the start.
bot.draw_circle(R)

# Move slightly forward so the next curve does not overlap the circle.
bot.move_forward_unit(20, "-l", SPEED)

# 2) S-curve: left semicircle → right semicircle → left semicircle.
# Semicircles do not return to the start; they end at the opposite side.
bot.draw_semicircle(R, "l")
bot.draw_semicircle(R, "r")
bot.draw_semicircle(R, "l")

bot.close()`},{name:"Example 5: three stars in a line (repeat draw + move)",summary:"Draw a star with draw_star, move sideways slightly, draw another. With a for loop, three stars line up.",details:`Learning points — repeating "draw + move" as a unit:
  · draw_star(SIDE) draws one star and returns to the starting point.
  · To leave a gap between stars, move forward by GAP after drawing.
  · Treating "draw + move" as a unit and looping it produces evenly spaced shapes.

Code flow:
  · for _ in range(STARS): draw star → move forward GAP cm

※ Try it:
  · STARS = 5 to draw more stars — you may need smaller GAP and SIDE to fit.
  · Add turn_right_speed(60, SPEED) each iteration to fan the stars out radially.
  · Replace draw_star with draw_penta for a row of pentagons.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SIDE = 12       # Side length of one star (cm)
GAP = 25        # Gap between stars
STARS = 3
SPEED = 50

# Pattern: draw star → move sideways → draw next star.
for _ in range(STARS):
    bot.draw_star(SIDE)
    bot.move_forward_unit(GAP, "-l", SPEED)

bot.close()`}]},{id:"sensors",title:"9. Sensors",description:"Read object, line, and color sensor values — bring KAMIBOT's view of the world into your code",icon:"sensors",entries:[{name:"bot.get_object_detect(opt=True)",summary:"Read both left and right object detection sensors at once and return them as a (left, right) tuple.",details:"Reads both front IR sensors (left and right) at the same time. Each value is an integer; a higher value (or 1) means an object is close.\n\nArgs:\n  opt (bool): When ``True``, leaves motors/LEDs as-is after the read; when ``False``, stops them after the command.\n\nReturns:\n  tuple[int, int]: ``(left, right)`` sensor values.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Read object detection every 0.5 sec for 5 seconds
for _ in range(10):
    left, right = bot.get_object_detect()
    print("left =", left, "right =", right)
    bot.delay(0.5)

bot.close()`},{name:"bot.get_line_sensor(opt=True)",summary:"Read left, center, and right line sensors at once and return as a (left, center, right) tuple.",details:"A sensor over a black line on the floor reads ``1``; over a white floor it reads ``0`` (this may be inverted depending on the board/lighting).\nYou typically compare the three values to decide which side the line is on.\n\nArgs:\n  opt (bool): ``True``/``False`` option (keep running / stop).\n\nReturns:\n  tuple[int, int, int]: ``(left, center, right)``.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Read the line sensor every 0.5 sec for 5 seconds
for _ in range(10):
    l, c, r = bot.get_line_sensor()
    print("L/C/R =", l, c, r)
    bot.delay(0.5)

bot.close()`},{name:"bot.get_color_sensor(opt=True)",summary:"Read a single color index (int) from the color sensor.",details:"Classifies the color the sensor sees into the same color index used by ``turn_led_idx`` (0=red, 1=orange, … 7=white) and returns one integer.\nFor colors outside the recognizable range, the firmware reports the index of the closest color.\n\nArgs:\n  opt (bool): ``True``/``False`` option.\n\nReturns:\n  int: Color index (0~8).",example:`from pibot import KamibotPi

bot = KamibotPi()

# Read the paper color 10 times at 1-second intervals
for _ in range(10):
    color = bot.get_color_sensor()
    print("color index =", color)
    bot.delay(1)

bot.close()`},{name:"bot.get_color_elements(opt=True)",summary:"Return the RGB the color sensor sees as an (r, g, b) tuple.",details:"Use this when you want raw RGB values instead of a color index. Pass them straight to ``turn_led`` to make the LED mimic what KAMIBOT sees.\n\nArgs:\n  opt (bool): ``True``/``False`` option.\n\nReturns:\n  tuple[int, int, int]: ``(r, g, b)`` per channel, 0~255.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Mirror the sensed color on the LED for 10 seconds
for _ in range(10):
    r, g, b = bot.get_color_elements()
    print("RGB =", r, g, b)
    bot.turn_led(r, g, b)
    bot.delay(1)

bot.turn_led(0, 0, 0)
bot.close()`}],entriesAfter:[{name:"Example 1: stop when an object is detected (obstacle detection)",summary:"Drive slowly forward while continuously checking the front object sensors. As soon as an object is detected on either side, stop and turn on the red LED.",details:`Learning points — repeated sensor checking:
  · get_object_detect() returns (left, right) at once.
  · A value of 1 (or anything non-zero) means "an object is close".
  · Reading the sensor inside a while True loop lets the robot react in real time.
  · or operator: "if left detected OR right detected" → stops if either is true.

Code flow:
  1) Turn on green LED ("safe, moving")
  2) Start moving slowly forward
  3) while loop: read sensors and break when an object is detected
  4) Stop motors + red LED + beep

※ Try it:
  · Replace \`or\` with \`and\` to stop only when both sides detect — useful for narrow passages.
  · Reducing \`delay(0.05)\` makes it react faster but uses more CPU.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SPEED = 30   # Slow forward speed (0-100)

try:
    bot.turn_led(0, 255, 0)              # Green = "safe, moving"
    bot.go_forward_speed(SPEED, SPEED)   # Both wheels forward

    while True:
        left, right = bot.get_object_detect()
        if left or right:                # Object detected on either side
            break
        bot.delay(0.05)                  # ~20 checks per second

    bot.stop()
    bot.turn_led(255, 0, 0)              # Red = "stopped, obstacle!"
    bot.beep()
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"Example 2: mirror the sensed color on the LED",summary:"Read (R, G, B) with get_color_elements and pass it to turn_led — the LED reproduces what the sensor sees. Change the paper color and the LED follows.",details:`Learning points — pipe sensor values into another function:
  · get_color_elements() returns an (r, g, b) tuple.
  · Receive into variables and pass them straight to turn_led(r, g, b) — done.
  · The simplest "sensor → output" pattern, no math in between.
  · Repeat at 1-second intervals so the LED follows the paper as you change it.

Code flow:
  · for loop: 20 readings (~20 seconds total)
  · Each pass: read RGB → print → light the LED in the same color → wait 1 second

※ Try it:
  · Change \`for _ in range(20)\` to \`while True\` to loop forever.
  · turn_led(r, g, b) → turn_led(g, r, b) swaps red and green for a "color-blind" mode.`,example:`from pibot import KamibotPi

bot = KamibotPi()

try:
    for _ in range(20):
        # Read what the color sensor is currently seeing.
        r, g, b = bot.get_color_elements()
        print("sensor RGB =", r, g, b)

        # Pass the same values directly to the LED.
        bot.turn_led(r, g, b)

        bot.delay(1)
finally:
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"Example 3: color traffic light (different actions by color index)",summary:"Branch with if/elif on the index returned by get_color_sensor. Red = stop, green = go, blue = spin in place — control KAMIBOT with a paper traffic light.",details:`Learning points — branching with if/elif/else:
  · get_color_sensor() returns one color index.
  · Same as the LED index table (0:red, 1:orange, 2:yellow, 3:green, 4:blue, 5:skyblue, 6:purple, 7:white).
  · "If this value, do this" branching is most natural with if/elif/else.
  · Lighting the LED with the same color in each branch shows what signal KAMIBOT is seeing.

Code flow:
  · Repeat 30 times reading the color
  · 0(red): stop, 3(green): brief forward, 4(blue): spin in place
  · Other colors: do nothing (idle)

※ Try it:
  · Add more colors — back up on 2(yellow), beep on 6(purple), etc.
  · Make paper traffic-light cards and present them in sequence to make the robot drive a course.`,example:`from pibot import KamibotPi

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
            bot.move_forward_unit(5, "-l", 40)   # Brief 5 cm forward
        elif color == BLUE:
            bot.turn_led_idx(BLUE)
            bot.turn_right_speed(45, 40)         # Spin in place
        else:
            bot.turn_led(0, 0, 0)                # Unknown color → LED off

        bot.delay(0.3)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"Example 4: line follower (3-sensor line tracer)",summary:"Watch the left, center, and right line sensors and gently steer to follow a black line. Go straight when the line is centered; nudge toward the line when it drifts.",details:`Learning points — closed-loop control with multiple sensors:
  · get_line_sensor() returns three values (left, center, right).
  · Assume sensors over the black line read 1 and over white floor read 0.
  · The short cycle "read sensor → decide action → read again" is closed-loop control.
  · Small steering corrections (small angles in turn_left/right_speed) keep tracking smooth.

Control rules:
  · Center only over line → go straight (green LED)
  · Left over line → slight left correction (blue LED)
  · Right over line → slight right correction (yellow LED)
  · None over line → stop (red LED)

※ Try it:
  · Reduce 15 to 8 for smoother steering, or raise to 30 for sharp corrections.
  · If the black line reads 0 instead of 1, flip the l/c/r comparisons to \`== 0\`.`,example:`from pibot import KamibotPi

bot = KamibotPi()

STEP = 3      # Distance per loop (cm)
SPEED = 35
TURN = 15     # Small correction angle

try:
    for _ in range(60):
        l, c, r = bot.get_line_sensor()
        print("line L/C/R =", l, c, r)

        if c and not l and not r:
            bot.turn_led_idx(3)                       # Green = on the line (normal)
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif l and not r:
            bot.turn_led_idx(4)                       # Blue = drifted right, correct left
            bot.turn_left_speed(TURN, SPEED)
        elif r and not l:
            bot.turn_led_idx(2)                       # Yellow = drifted left, correct right
            bot.turn_right_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                       # Red = lost the line
            bot.stop()
            break
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"Example 5: avoid obstacles (compare left/right object sensors)",summary:"Compare the left/right object sensors and avoid toward the open side. Object on the left → turn right; on the right → turn left; both blocked → back up and turn sharply.",details:`Learning points — pick an action by comparing two sensor values:
  · Handle the (left, right) values from get_object_detect() in 4 cases.
  · 4 cases: (0,0) clear / (1,0) left only / (0,1) right only / (1,1) both blocked
  · "Both blocked" cannot be solved by a simple turn, so use "back up + turn" as a separate escape.
  · Different LED colors per state make it easy to follow KAMIBOT's status visually.

Code flow:
  · Repeat 100 times (~10 seconds): read sensors → run one of 4 branches → small wait

※ Try it:
  · Increase TURN from 30 to 45 for sharper avoidance, or 15 for smoother.
  · Add a random left/right turn after \`move_backward_unit(5, "-l", 40)\` to make a maze-escape robot.
  · Add a beep just before each collision to give a warning.`,example:`from pibot import KamibotPi

bot = KamibotPi()

SPEED = 35
TURN = 30        # Avoidance turn angle (degrees)
STEP = 4         # Forward distance when path is clear (cm)

try:
    for _ in range(100):
        left, right = bot.get_object_detect()
        print("obj L/R =", left, right)

        if not left and not right:
            bot.turn_led_idx(3)                          # Green = path clear
            bot.move_forward_unit(STEP, "-l", SPEED)
        elif left and not right:
            bot.turn_led_idx(2)                          # Yellow = obstacle on the left
            bot.turn_right_speed(TURN, SPEED)
        elif right and not left:
            bot.turn_led_idx(2)                          # Yellow = obstacle on the right
            bot.turn_left_speed(TURN, SPEED)
        else:
            bot.turn_led_idx(0)                          # Red = both sides blocked
            bot.beep()
            bot.move_backward_unit(5, "-l", SPEED)       # Back up
            bot.turn_right_speed(TURN * 3, SPEED)        # Sharp turn to escape

        bot.delay(0.1)
finally:
    bot.stop()
    bot.turn_led(0, 0, 0)
    bot.close()`},{name:"Example 6: line follower that stops at an intersection",summary:"Follow a black line with three sensors. When all three sensors detect the line at once (a thick line / intersection), nudge forward, spin 90° in place, and end.",details:`Learning points — line tracing + termination condition:
  · get_line_sensor() returns (left, center, right) (line = 1, white floor = 0 assumed).
  · Different speeds in go_forward_speed(left, right) curve toward the slower side — the core of steering correction.
  · while True + break pattern: follow the line normally and break out when the termination condition is met.
  · move_step(ldir, lstep, rdir, rstep): direction with "f"/"b", distance/angle with step counts. Opposite directions = in-place rotation.

Control rules (checked in order):
  · L/C/R all 1 → stop → forward (30 steps) → spin 90° in place → break
  · Center only 1 → straight (both 80)
  · Left 1 → left correction (left 30, right 80 → slow the left wheel)
  · Right 1 → right correction (left 80, right 30)

※ Notes:
  · The first comment "# red" disagrees with the actual color used (green (0,255,0)).
  · Because of elif precedence, when center is 1 the left/right values are ignored.
  · When all sensors are 0 (lost the line), no branch matches and the previous command continues — add recovery logic.

※ Try it:
  · move_step("f", 90, "b", 90) → ("b", 90, "f", 90) rotates the other way.
  · If 90° is too much, reduce the step count to 45.
  · Replace \`break\` with another rotate-and-keep-tracking to make a robot that turns at corners.`,example:`robot = KamibotPi('COM3', 57600)
robot.turn_led(0, 255, 0)    # red

# 1
while True:
    # Read line sensors
    left, center, right = robot.get_line_sensor()
    print(left, center, right)

    if left == 1 and center == 1 and right==1:
            robot.stop()
            robot.move_step('f', 30, 'f', 30)
            robot.move_step("f", 90, "b", 90)
            break
    elif center == 1:  # line in the center
        robot.go_forward_speed(80, 80)
    elif left == 1:  # line on the left
        robot.go_forward_speed(30, 80)  # turn left
    elif right == 1:  # line on the right
        robot.go_forward_speed(80, 30)  # turn right`}]},{id:"misc",title:"10. Line tracer / info",description:"Toggle the line tracer on/off, query battery and firmware version",icon:"route",entries:[{name:"bot.toggle_linetracer(mode, speed=100)",summary:"Turn the firmware-built-in line tracer on or off.",details:"Lets KAMIBOT follow a line using its own firmware logic instead of you reading sensors and branching with if/else. While enabled, line following takes priority over other movement commands.\n\nArgs:\n  mode (bool): ``True`` on / ``False`` off.\n  speed (int): Line tracer speed. Default 100.\n\nReturns:\n  None\n\nIf you want to write your own line-following logic, use ``bot.get_line_sensor()``.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Turn on the line tracer for 5 seconds
bot.toggle_linetracer(True, 80)
bot.delay(5)
bot.toggle_linetracer(False)
bot.stop()

bot.close()`},{name:"bot.get_battery()",summary:"Read and return the current battery level as an integer.",details:`Internally returns the BATTERY byte from the response packet directly. Depending on the firmware mapping, this is interpreted as 0~100(%) or another unit.

Returns:
  int: Battery value.`,example:`from pibot import KamibotPi

bot = KamibotPi()

level = bot.get_battery()
print("battery =", level)

bot.close()`},{name:"bot.get_version()",summary:"Request firmware version info over serial.",details:`The result is printed to the serial response console rather than returned. Useful for debugging when firmware behavior is unexpected.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.get_version()   # Response is printed to the console

bot.close()`}]},{id:"basic-move",title:"11. Basic movement (map board)",description:"Move and rotate accurately by cells on the map board",icon:"arrow_forward",notice:"This feature requires a dedicated map board.",entries:[{name:'bot.move_forward(value, opt="-l")',summary:"Move forward ``value`` cells on the map board.",details:'Moves KAMIBOT exactly ``value`` cells along the map board grid (line map or block map).\n\nArgs:\n  value (int): Number of cells.\n  opt (str): ``"-l"`` line map / ``"-b"`` block map. Default ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.move_forward(2)         # 2 cells on the line map
bot.move_forward(3, "-b")   # 3 cells on the block map

bot.close()`},{name:"bot.move_backward(value)",summary:"Move backward ``value`` cells on the block map board.",details:`Block-map-only command. Cannot be used on a line map board.

Args:
  value (int): Number of cells.

Returns:
  None`,example:`from pibot import KamibotPi

bot = KamibotPi()

bot.move_backward(1)   # Move 1 cell backward on the block map

bot.close()`},{name:'bot.turn_left(value=1, opt="-l")',summary:"Rotate left on the map board.",details:'On the line map only one rotation (90°) is guaranteed and ``value`` is ignored. On the block map, ``value`` cumulative 90° rotations are performed.\n\nArgs:\n  value (int): Number of rotations. Default 1.\n  opt (str): ``"-l"`` line map / ``"-b"`` block map. Default ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_left()         # Line map 90°
bot.turn_left(2, "-b")  # Block map 180° (90° × 2)

bot.close()`},{name:'bot.turn_right(value=1, opt="-l")',summary:"Rotate right on the map board.",details:'The opposite direction of ``turn_left``. On the line map ``value`` is ignored; on the block map ``value`` rotations are accumulated.\n\nArgs:\n  value (int): Number of rotations. Default 1.\n  opt (str): ``"-l"`` line map / ``"-b"`` block map. Default ``"-l"``.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_right()
bot.turn_right(2, "-b")

bot.close()`},{name:'bot.turn_back(value=1, opt="-l")',summary:"Turn around (180°) on the map board.",details:'Half-turn in place. On the line map ``value`` is ignored.\n\nArgs:\n  value (int): Number of rotations. Default 1.\n  opt (str): ``"-l"`` line map / ``"-b"`` block map.\n\nReturns:\n  None',example:`from pibot import KamibotPi

bot = KamibotPi()

bot.turn_back()

bot.close()`}]},{id:"utils",title:"12. Utilities / constants",description:"Helper functions like sensor value mapping or angle calculation, and module constants",icon:"functions",entries:[{name:"bot.remap(value, source_range, target_range)",summary:"Map a value from one range to another with the same proportion — useful for unit conversion of sensor values.",details:"Use this when you need a linear proportional conversion, like turning sensor input (e.g., 0~1023) into a motor speed (e.g., 0~100).\n\nArgs:\n  value (float | int): The original value to convert.\n  source_range (tuple[float, float]): The original range ``(s0, s1)`` that ``value`` belongs to.\n  target_range (tuple[float, float]): The target range ``(t0, t1)`` to map into.\n\nReturns:\n  float: The value mapped proportionally into ``target_range``.\n\ne.g., ``remap(50, (0, 100), (0, 10))`` → ``5.0``.",example:`from pibot import KamibotPi

bot = KamibotPi()

# Convert sensor value (0~1023) → motor speed (0~100)
sensor_value = 512
speed = bot.remap(sensor_value, (0, 1023), (0, 100))
print("mapped speed =", speed)

bot.close()`},{name:"KamibotPi.angle3p(p1, p2, p3)",summary:"Compute the angle (0~360°, counterclockwise) formed at ``p2`` by the three points.",details:"With ``p2`` as the vertex (``p1 → p2 → p3``), returns the counterclockwise angle in degrees from ``p2 p1`` direction to ``p2 p3`` direction.\nIt is a pure calculation that does not need a serial connection, so you can call it without connecting to KAMIBOT.\n\nArgs:\n  p1: First point ``(x, y, ...)``.\n  p2: Vertex ``(x, y, ...)``.\n  p3: End point ``(x, y, ...)``.\n\nReturns:\n  float: Angle in degrees, between 0 and 360.\n\nSince there is no ``self`` in the signature, the clearest call is on the class itself — ``KamibotPi.angle3p(p1, p2, p3)``.",example:`from pibot import KamibotPi

# Works without a serial connection — pure calculation from coordinates
a = KamibotPi.angle3p((0, 0), (1, 0), (1, 1))
print("angle =", a)   # ~90.0`},{name:"Note (module constant)",summary:"A class of note → MIDI integer constants. Use forms like ``Note.C4`` directly as the ``melody`` argument.",details:'A scale-constant class defined in the pibot module. Holds integer constants from ``CM1`` (=0) through ``B5`` (=83).\nMiddle C (C4) = 60. Each octave up adds 12; each octave down subtracts 12.\n\nNaming rules:\n  ``C4``, ``D4``, ``E4`` … natural notes\n  ``Cs4`` (C♯4), ``Ds4`` (D♯4) … sharps\n  ``Db4`` (=Cs4), ``Eb4`` (=Ds4) … flat aliases for the same notes\n\nSee the table at the bottom of the "3. Sound" topic for the full scale.',example:`from pibot import KamibotPi, Note

bot = KamibotPi()

# Use note constants directly
print("Note.C4 =", Note.C4)   # 60
print("Note.A4 =", Note.A4)   # 69

# Use as melody arguments
bot.melody(Note.C4, 0.4)
bot.melody(Note.E4, 0.4)
bot.melody(Note.G4, 0.4)

bot.close()`},{name:"LED_COLOR (module constant)",summary:"A list constant mapping indexes 0~8 to 9 colors as ``[R, G, B]`` lists. Unpack with ``*`` to pass to ``turn_led``.",details:"A list of RGB lists for the 9 default colors defined in the pibot module. Same data table that ``turn_led_idx(idx)`` uses internally.\n\nIndex mapping:\n  0=red, 1=orange, 2=yellow, 3=green, 4=blue, 5=skyblue, 6=purple, 7=white, 8=off\n\nIf you want to look up by key name, use the ``LED`` dict, which holds the same data.",example:`from pibot import KamibotPi, LED_COLOR

bot = KamibotPi()

# Cycle through every color by index order
for rgb in LED_COLOR:
    bot.turn_led(*rgb)
    bot.delay(0.4)

bot.turn_led(0, 0, 0)
bot.close()`}]},{id:"virtual-keyboard",title:"13. Virtual Keyboard — drive KAMIBOT from the IDE keys",description:"Use the VirtualKeyboard module to read key input and control LEDs, melody, and driving in real time",icon:"keyboard",entries:[{name:"VirtualKeyboard module (concept)",summary:"Read the toolbar virtual keyboard synchronously and pair it with KAMIBOT actions.",details:'Pressing the keyboard icon in the IDE toolbar pops up a small virtual keyboard window. Buttons on that window (or the real keyboard while that window is focused) push key codes into the ``VirtualKeyboard`` module.\n\nThe use case is simple — receive key input from inside your KAMIBOT code to switch LED colors, drive the car, play melody notes, etc. for **real-time control**. Unlike ``input()`` which waits for a whole line and Enter, ``VirtualKeyboard`` delivers keys **one at a time** as they happen.\n\nKey points:\n  • Import with ``import VirtualKeyboard as kb`` (``kb`` is the conventional alias).\n  • There is only one function — ``kb.wait_key(ms)``. It waits up to ``ms`` milliseconds and returns ``-1`` if no key arrived.\n  • Letters/digits use lowercase ASCII codes; ESC/Enter/Space use the standard ASCII codes; arrows use custom codes in ``0x80~0x83``.\n  • Uses a queue **independent of** ``cv2.waitKey()``, so input never gets tangled even when an imshow window is open.\n\nThink of it as a "PC keyboard input" channel you can use the same way as KAMIBOT sensors such as ``get_object_detect()`` or ``get_line_sensor()``. It lets you instantly capture user intent (start/stop, color change, etc.) that sensors cannot read.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi()

# Open the virtual keyboard window from the toolbar icon first.
print("Press any key (ESC to quit)")

while True:
    key = kb.wait_key(0)        # 0 = block until a key is pressed
    if key == kb.ESC:
        break
    print("got key code:", key)

bot.close()`},{name:"kb.wait_key(ms)",summary:"Wait for the next single key. Returns ``-1`` if nothing arrived within ``ms``.",details:"Args:\n  ms (int): wait time in milliseconds. ``0`` or less means **block forever** until a key arrives.\nReturns:\n  int: the pressed key code, or ``-1`` on timeout.\n\nTwo usage patterns:\n\n  1) **Blocking mode** (``ms=0``): the call stalls until a key arrives. Clean for menu-style code that only needs one key at a time.\n  2) **Non-blocking mode** (small positive ``ms``, e.g. ``20``): wait briefly and return ``-1`` if nothing arrived. Use this when a driving loop needs to keep polling sensors or driving motors independent of key input.\n\nKAMIBOT commands wait for a serial response, so each call already takes some time. A typical main loop keeps ``kb.wait_key`` short, around 0~30 ms.",example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi()

while True:
    key = kb.wait_key(20)        # wait 20 ms then move on
    if key == kb.ESC:
        break

    # Change color only when a key arrives
    if key == kb.SPACE:
        bot.turn_led(255, 0, 0)
    elif key != -1:
        bot.turn_led(0, 0, 255)

bot.turn_led(0, 0, 0)
bot.close()`},{name:"Key-code constants",summary:"Letters are lowercase ASCII; special keys use module constants for readability.",details:'Rather than memorising numeric codes, compare with the constants exposed on the module — e.g. ``kb.ESC``.\n\nLetters / digits (lowercase ASCII):\n  ``kb.A`` – ``kb.Z``        = letters (`ord("a")` – `ord("z")`)\n  ``kb.NUM_0`` – ``kb.NUM_9`` = digits (`ord("0")` – `ord("9")`)\n\nControl / common keys (standard ASCII):\n  ``kb.BACKSPACE`` = 8\n  ``kb.TAB``       = 9\n  ``kb.ENTER``     = 13\n  ``kb.ESC``       = 27\n  ``kb.SPACE``     = 32\n\nArrows (custom codes in 0x80+ to avoid colliding with printable ASCII):\n  ``kb.ARROW_LEFT``  = 0x80\n  ``kb.ARROW_UP``    = 0x81\n  ``kb.ARROW_RIGHT`` = 0x82\n  ``kb.ARROW_DOWN``  = 0x83\n\nNote: letter constants are all **lowercase** codes. The virtual keyboard does not carry Shift state, so ``kb.A`` is enough; ``ord("a")`` works identically if you prefer a literal.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi, LED_COLOR

bot = KamibotPi()

# Number keys 1~9 → indexes of LED_COLOR (9 preset colors)
DIGIT_KEYS = [kb.NUM_1, kb.NUM_2, kb.NUM_3, kb.NUM_4, kb.NUM_5,
              kb.NUM_6, kb.NUM_7, kb.NUM_8, kb.NUM_9]

print("1-9 = color index, SPACE = white, ESC = quit")
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
bot.close()`},{name:"Example: digit keys drive LED + melody together",summary:"One key press changes the LED color and plays a note at the same time — a mini instrument / signal pad.",details:`The strength of the virtual keyboard is that "one key = one action" reflects on KAMIBOT instantly. The example below performs both of the following at once on a single key press:
  1) Change the LED color to the one mapped to that key.
  2) Use \`\`bot.melody\`\` to briefly play the note mapped to that key.

Putting the key → (color, note) mapping in a single dict means adding or changing a key only requires editing one line. Much cleaner than a long chain of conditionals.

The implementation uses \`\`kb.wait_key(0)\`\` in **blocking mode**. The LEDs never flicker between presses and motors are idle, leaving the serial line quiet. A command is exchanged only at the moment a new key arrives, so the communication stays clean.

Key mapping:
  • 1 → red + C4
  • 2 → yellow + D4
  • 3 → green + E4
  • 4 → blue + F4
  • 5 → purple + G4
  • SPACE → all off (LED off, no beep)
  • ESC → quit`,example:`import VirtualKeyboard as kb
from pibot import KamibotPi, Note

bot = KamibotPi()

# key → (R, G, B, note) in one mapping
PALETTE = {
    kb.NUM_1: (255,   0,   0, Note.C4),
    kb.NUM_2: (255, 255,   0, Note.D4),
    kb.NUM_3: (  0, 255,   0, Note.E4),
    kb.NUM_4: (  0,   0, 255, Note.F4),
    kb.NUM_5: (200,   0, 200, Note.G4),
}

print("1-5 = color+note, SPACE = off, ESC = quit")
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
bot.close()`},{name:"Example: drive KAMIBOT with WASD",summary:"Drive KAMIBOT from the PC keyboard in real time. The car moves only while keys keep coming.",details:'For driving, "moves while a key is held, stops when released" feels natural. Since the virtual keyboard only delivers events one key at a time, the pattern is **start as soon as a key arrives → auto-stop a short time later**. Too short feels jittery, too long feels sluggish — keep ``wait_key`` polling around 30~50 ms, and fall through to ``stop`` when no key arrives.\n\nFor driving you pick from two command families:\n  • ``go_forward_speed(L, R)`` / ``go_backward_speed`` — direct wheel speeds, good for fine-grained control.\n  • ``move_forward(value)`` and other unit-distance moves — runs to completion in one call, not suitable for real-time joystick-style control.\n\nThe first family (``*_speed``) is what we want here. Use ``go_dir_speed(ldir, lspeed, rdir, rspeed)`` to set each wheel direction independently — e.g. left backwards + right forwards = an in-place left pivot.\n\nKey mapping:\n  • W / S          : forward / backward\n  • A / D          : pivot left / pivot right\n  • SPACE          : immediate stop\n  • 1 / 2 / 3      : speed 40 / 70 / 100\n  • ESC            : quit\n\nWrapping in ``try/finally`` guarantees ``bot.stop()`` and ``bot.close()`` run even on exception or ESC quit — so the car never rolls away.',example:`import VirtualKeyboard as kb
from pibot import KamibotPi

bot = KamibotPi()

speed = 70

ACTIONS = {
    kb.W: lambda: bot.go_forward_speed(speed, speed),
    kb.S: lambda: bot.go_backward_speed(speed, speed),
    kb.A: lambda: bot.go_dir_speed("b", speed, "f", speed),   # pivot left (L back + R forward)
    kb.D: lambda: bot.go_dir_speed("f", speed, "b", speed),   # pivot right
    kb.SPACE: lambda: bot.stop(),
}

print("W/A/S/D = drive, SPACE = stop, 1/2/3 = speed, ESC = quit")
try:
    while True:
        key = kb.wait_key(30)        # poll every 30 ms
        if key == kb.ESC:
            break

        # Speed-change keys
        if key == kb.NUM_1:   speed = 40
        elif key == kb.NUM_2: speed = 70
        elif key == kb.NUM_3: speed = 100

        action = ACTIONS.get(key)
        if action:
            action()
        elif key == -1:
            # No key arrived — auto-stop for safety
            bot.stop()
finally:
    bot.stop()
    bot.close()`}]}];export{e as REFERENCE};
