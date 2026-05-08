import{h as e,f as a,p as t,t as s}from"./tm_export_tfjs-k-0nS32K.js";const r=[{id:"cv2",title:"Image & Camera (web_cv2)",description:"The most basic module for displaying image files or webcam video on screen and drawing lines, rectangles, circles, and text on top. Usage is almost identical to OpenCV (cv2).",icon:"image",entries:[{name:"import web_cv2 as cv2",summary:"Imports this IDE's built-in OpenCV-compatible module. The module name is web_cv2 to distinguish it from standard OpenCV (cv2), and by convention it is aliased as cv2.",example:`# The most basic import that appears at the top of every example
import web_cv2 as cv2

# From now on you can use short names like cv2.imread(...) and cv2.imshow(...).
print(cv2)`,warning:"web_cv2 implements only a subset of standard OpenCV. Unimplemented functions like imwrite raise NotImplementedError when called.",warningType:"info"},{name:"cv2.imread(path) — Load an image from a file",summary:"Reads an image file inside the project and returns it as an image object.",details:`Args:
  path (str): relative path from the project root (e.g. "cat.png")
Returns:
  image: image object on success, None on failure

Maximum uploadable image size is 50MB.`,example:`import web_cv2 as cv2

# Read cat.png from the same folder
frame = cv2.imread('cat.png')

if frame is None:
    # None is returned when the file is missing or has an invalid format
    print('File not found')
else:
    # frame.shape is (height, width, channels)
    print('Image size:', frame.shape)`,warning2:'cv2 and detectors (FaceDetector / HandsDetector etc.) work with the same camera frame but expect different formats.\nJust remember these three rules.\n\n(1) cv2.* functions -> raw frame as is\n```python\nok, frame = cap.read()\ncv2.imshow("camera", frame)\ncv2.rectangle(frame, (10, 10), (100, 100), (0, 255, 0), 2)\n```\n(2) Detector.process() -> wrap the frame with Image()\n```python\nout_img, points = detector.process(Image(frame))\n```\n(3) Use .frame to get the raw frame back from an Image\n```python\ncv2.imshow("face", out_img.frame)\n```',warning2Type:"info"},{name:"cv2.imread(url) — Load an image from a URL",summary:"Loads an image directly from an internet address starting with http(s)://.",details:`Args:
  url (str): image URL starting with "http://" or "https://"
Returns:
  image: image object on success, None on failure (network error, CORS block, etc.)

The target server must allow CORS responses. Otherwise None is returned.`,warning:"Maximum size for remote images is also limited to 50MB.",example:`import web_cv2 as cv2

# Pass the internet image URL directly
url = 'https://example.com/cat.png'
frame = cv2.imread(url)

if frame is None:
    print('Failed to fetch image (CORS / network error)')
else:
    print('Size:', frame.shape)
    cv2.imshow('remote', frame)
    cv2.waitKey(0)              # Press any key to exit
    cv2.destroyAllWindows()`},{name:"cv2.imshow(name, image) — Display an image in a window",summary:"Displays an image in a floating window inside the IDE (non-blocking).",details:`Args:
  name (str): window title. Same name redraws into the same window.
  image: result of cv2.imread / cv2.VideoCapture.read or a numpy array
Returns: none`,example:`import web_cv2 as cv2

# Show one image and wait for a key press
frame = cv2.imread('cat.png')
cv2.imshow('preview', frame)    # Show in 'preview' window
cv2.waitKey(0)                   # Wait until any key is pressed
cv2.destroyAllWindows()          # Close all windows`},{name:"cv2.waitKey(ms=0) — Wait for a key press",summary:"Waits ms (milliseconds) for a key press. Use 0 (wait forever) for static images and 1 for video loops.",details:`Args:
  ms (int): wait time in ms. 0 or less means wait forever until a key is pressed.
Returns:
  int: pressed key code. -1 on timeout or when the window is not focused.`,example:`import web_cv2 as cv2
from helloai import Keyboard

# (A) Static image: keep the window open until a key is pressed
frame = cv2.imread('cat.png')
cv2.imshow('image', frame)
cv2.waitKey(0)                  # 0 = wait forever
cv2.destroyAllWindows()

# (B) Video loop: refresh every frame and exit on ESC
cap = cv2.VideoCapture()
while True:
    ok, frame = cap.read()
    if not ok:
        continue
    cv2.imshow('camera', frame)
    if cv2.waitKey(1) == Keyboard.ESC:   # Wait briefly for 1ms
        break
cap.release()
cv2.destroyAllWindows()`},{name:"cv2.destroyAllWindows() — Close all windows",summary:"Closes all open imshow windows.",details:`Args: none
Returns: none

To close a single window, use cv2.destroyWindow(name).`,example:`import web_cv2 as cv2

# Show one image, wait for a key, then clean up
frame = cv2.imread('cat.png')
cv2.imshow('demo', frame)
cv2.waitKey(0)

# Close all open windows at once
cv2.destroyAllWindows()`},{name:"cv2.VideoCapture(source=0) — Open a webcam",summary:"Opens a webcam. Provides .isOpened() / .read() / .release() methods.",details:`Args:
  source (int, optional): camera index. Default is 0 (default webcam).
    In the browser environment only one camera can be used at a time, so
    cv2.VideoCapture() and cv2.VideoCapture(0) behave identically.
Returns: VideoCapture object

Methods:
  isOpened() -> bool
  read() -> (bool, image): grabs one frame.
  release(): closes the camera.`,example:`import web_cv2 as cv2

# Open the default webcam (source=0 is the default and may be omitted)
cap = cv2.VideoCapture()

# Grab one frame and check its size
ok, frame = cap.read()
if ok:
    print('Frame size:', frame.shape)
else:
    print('Failed to open camera')

cap.release()                   # Release camera resources`},{name:"cv2.line(image, pt1, pt2, color, thickness=1) — Draw a line",summary:"Draws a line on the image.",details:`Args:
  image: target to draw on
  pt1, pt2 ((x, y)): start and end points
  color (B, G, R): BGR order following OpenCV convention. (0, 0, 255) = red.
  thickness (int): line thickness in px
Returns:
  image: same image (for chaining)`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# Draw a red (BGR) line from (0, 0) to (200, 200) with thickness 3
cv2.line(frame, (0, 0), (200, 200), (0, 0, 255), 3)

cv2.imshow('line', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.rectangle(image, pt1, pt2, color, thickness=1) — Draw a rectangle",summary:"Draws a rectangle on the image. With thickness=-1 (or cv2.FILLED) it is filled.",details:`Args:
  image: target to draw on
  pt1 ((x, y)): top-left corner
  pt2 ((x, y)): bottom-right corner
  color (B, G, R): BGR
  thickness (int): line thickness. -1 or cv2.FILLED fills the inside.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# Outline-only green rectangle
cv2.rectangle(frame, (50, 50), (200, 150), (0, 255, 0), 2)
# Filled blue rectangle
cv2.rectangle(frame, (10, 10), (40, 40), (255, 0, 0), cv2.FILLED)

cv2.imshow('rectangle', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.circle(image, center, radius, color, thickness=1) — Draw a circle",summary:"Draws a circle on the image. With thickness=-1 it is filled.",details:`Args:
  image: target to draw on
  center ((x, y)): center coordinates
  radius (int): radius in px
  color (B, G, R): BGR
  thickness (int): line thickness. -1 fills the circle.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# Outline-only purple circle
cv2.circle(frame, (100, 100), 30, (255, 0, 255), 2)
# Filled yellow circle
cv2.circle(frame, (200, 100), 30, (0, 255, 255), -1)

cv2.imshow('circle', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.putText(image, text, org, fontFace, fontScale, color, thickness=1) — Draw text",summary:"Draws text on the image.",details:`Args:
  image: target to draw on
  text (str): the string to display (Korean is supported)
  org ((x, y)): bottom-left anchor of the text
  fontFace: font constant such as cv2.FONT_HERSHEY_SIMPLEX
  fontScale (float): scale factor for text size (~ 14*scale px)
  color (B, G, R): BGR
  thickness (int): line thickness

Note: this IDE renders text approximately using the canvas sans-serif font.
Font constants are accepted but the actual shapes all look similar.`,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')

# Print 'Hello CV2' in white at (20, 40)
cv2.putText(frame, 'Hello CV2', (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

cv2.imshow('putText', frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"cv2.cvtColor(image, code) — Convert color space",summary:"Converts color space (only actually transforms numpy arrays).",details:`Args:
  image: input image
  code: conversion code. Supported: COLOR_BGR2RGB, COLOR_RGB2BGR,
        COLOR_BGR2GRAY, COLOR_GRAY2BGR.
Returns:
  converted image

Limitation: images returned by imread/VideoCapture are already displayed
as RGB on the main thread, so BGR<->RGB conversions have no visible effect.
The actual channel swap only happens for numpy arrays you build yourself.`,example:`import web_cv2 as cv2
import numpy as np

# cvtColor only really runs on a BGR array you build yourself with numpy
arr = np.zeros((100, 100, 3), dtype=np.uint8)
arr[:, :, 0] = 255              # Set the B channel to 255 (blue)

# BGR -> grayscale conversion
gray = cv2.cvtColor(arr, cv2.COLOR_BGR2GRAY)
print(gray.shape)               # (100, 100)`},{name:"cv2.flip(image, axis) — Flip horizontally / vertically",summary:"Flips the image (only actually transforms numpy arrays).",details:`Args:
  image: input image
  axis (int): 0=vertical flip, 1=horizontal flip, -1=both
Returns:
  flipped image`,example:`import web_cv2 as cv2
import numpy as np

# Build a 3x4 array from 12 numbers and flip horizontally
arr = np.arange(12, dtype=np.uint8).reshape(3, 4)
print('Original:\\n', arr)
print('Flipped horizontally:\\n', cv2.flip(arr, 1))`},{name:"Example 1: Display an image file",summary:"Reads an image inside the project and shows it in a window. Press any key to exit.",details:null,example:`import web_cv2 as cv2

# Read cat.png from the same folder and show it on screen
frame = cv2.imread('cat.png')

if frame is None:
    print('Please add cat.png to the project')
else:
    cv2.imshow('image', frame)
    cv2.waitKey(0)              # Press any key to exit
    cv2.destroyAllWindows()`},{name:"Example 2: Display webcam video",summary:"Opens the webcam and shows every frame on screen until ESC is pressed.",details:null,example:`import web_cv2 as cv2
from helloai import Keyboard

cap = cv2.VideoCapture()        # Open the default webcam

while cap.isOpened():
    ok, frame = cap.read()      # Grab one frame
    if not ok:
        continue                # Skip transient failures
    cv2.imshow('camera', frame)
    # Wait 1ms; exit the loop when ESC is pressed
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()                   # Release camera resources
cv2.destroyAllWindows()`},{name:"Example 3: Draw shapes and a label on an image",summary:"Draws a rectangle, circle, line, and text on a static image all at once.",details:null,example:`import web_cv2 as cv2

frame = cv2.imread('cat.png')
if frame is None:
    print('cat.png is required')
else:
    h, w, _ = frame.shape

    # Outer box (green, thickness 3)
    cv2.rectangle(frame, (10, 10), (w - 10, h - 10), (0, 255, 0), 3)

    # Red crosshair at the center of the screen
    cx, cy = w // 2, h // 2
    cv2.line(frame, (cx - 20, cy), (cx + 20, cy), (0, 0, 255), 2)
    cv2.line(frame, (cx, cy - 20), (cx, cy + 20), (0, 0, 255), 2)

    # Filled magenta circle
    cv2.circle(frame, (cx, cy), 8, (255, 0, 255), cv2.FILLED)

    # Label in the top-left
    cv2.putText(frame, 'CENTER', (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

    cv2.imshow('annotated', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"Example 4: Camera feed with a guide box and instructions",summary:"Draws a center guide box and a top instruction line on every frame.",details:null,example:`import web_cv2 as cv2
from helloai import Keyboard

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    h, w, _ = frame.shape

    # Compute the coordinates of a 200x200 guide box at the center
    bx, by, bw, bh = w // 2 - 100, h // 2 - 100, 200, 200

    # Guide box (yellow)
    cv2.rectangle(frame, (bx, by), (bx + bw, by + bh), (0, 255, 255), 2)
    # Top-left instruction text
    cv2.putText(frame, 'Place object inside the box', (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    # Bottom-left exit hint
    cv2.putText(frame, 'Press ESC to quit', (10, h - 15),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow('guide', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Camera + real-time FPS display",summary:"Measures per-frame processing time and draws FPS and frame number in the top-left.",details:null,example:`import web_cv2 as cv2
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

    # Compute FPS from the difference between current and previous time
    now = time.time()
    fps = 1.0 / max(now - prev_t, 1e-6)
    prev_t = now

    # Draw FPS and frame number in the top-left
    label = f'FPS {fps:5.1f}  #{frame_no}'
    cv2.putText(frame, label, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('fps', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand",title:"Hand Detection (HandsDetector)",description:'Finds both hands from a camera/image and returns 21 keypoints (joints) per hand. It also automatically classifies signs like "OK", "V", and "fist".',icon:"sign_language",image:e,entries:[{name:"from helloai import HandsDetector, Image",summary:"Imports the hand detector and image wrapper. Used at the top of every example.",details:"Paste this at the top of your example code as is.",example:`# Import the hand detector together with the Image wrapper
from helloai import HandsDetector, Image`},{name:"Image and frame relationship (please read)",summary:"Pass raw frames to cv2 functions, but wrap them with Image(frame) for HandsDetector. Use the .frame property to get the raw frame back when sending to cv2.",example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()      # Create the hand detector
cap = cv2.VideoCapture()         # Open the webcam

while cap.isOpened():
    ok, frame = cap.read()       # cv2 -> get the raw frame
    if not ok:
        continue

    # Pass to the detector wrapped in Image(frame) -- detect both hands
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # Print 'right'/'left' and the index fingertip (keypoint 8) coordinates
        print(h['handedness'], h['landmarks'][8])

    # cv2.imshow needs a raw frame again -> use .frame
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warningType:"info"},{name:"HandsDetector(draw_label=True) — Create a detector",summary:"Creates a hand detector. Recognizes both hands (left + right) at the same time. On first call it downloads the model (~6MB). When visualized, the right hand connection lines are drawn in light purple and the left hand in gray for easy distinction.",details:`Args:
  draw_label (bool): if True, process() automatically draws a sign label
    like "right: v" / "left: fist" above each wrist on every frame.
    Set to False to disable.
Returns: HandsDetector object`,example:`from helloai import HandsDetector

# Create a detector with default options (auto labels ON)
detector = HandsDetector()

# To turn off automatic label rendering:
# detector = HandsDetector(draw_label=False)`},{name:"detector.process(image, ...) — Detect hands",summary:"Detects both hands in the input image and returns (visualized Image, list of per-hand info).",details:`Args:
  image (Image): an Image object wrapping a camera frame or image
  draw (bool): if True, draws keypoints and connection lines on the result.
  line_width (int): connection line thickness
  circle_radius (int): keypoint circle radius
  show_label (bool|None): if True/False, toggles the label for this call only.
    None follows the constructor's draw_label.

Returns: (Image, list[dict])
  - Image: visualization with keypoints and connection lines drawn
  - list[dict]: one dict per detected hand
    each dict is {"handedness": "left"|"right", "landmarks": [(x,y,z), ...21 items]}`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image

detector = HandsDetector()
img = cv2.imread('hand.jpg')

# Detect both hands and get the result
out_img, hands = detector.process(Image(img))

print('Number of hands detected:', len(hands))   # 0, 1, or 2
for h in hands:
    side = h['handedness']           # 'right' or 'left'
    pts = h['landmarks']             # list of 21 (x, y, z) tuples
    print(f'{side} index fingertip:', pts[8])
    print(f'{side} thumb tip:', pts[4])

cv2.imshow('hands', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`,warning2:`The list length tells you how many hands were detected.
  - 0 hands -> []
  - 1 hand  -> length 1
  - 2 hands -> length 2

Keys in each dict:
  - "handedness" (str): always lowercase "right" or "left"
  - "landmarks" (list): 21 (x, y, z) integer pixel tuples
      0=wrist, 4=thumb tip, 8=index tip, 12=middle tip, 16=ring tip, 20=pinky tip

Note: webcam video is mirrored, so the hand on the right side of the screen may be classified as "left".`,warning2Type:"info"},{name:"detector.fingers_up(side='right') — Check extended fingers",summary:"Returns a 0/1 list in the order [thumb, index, middle, ring, pinky] for the requested hand from the most recent process() result.",details:`Args:
  side (str): 'right' or 'left'. Defaults to 'right'.
Returns:
  list[int]: length 5. 1=extended, 0=folded.
  Returns [0, 0, 0, 0, 0] when the requested hand is not detected.`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # Detect hands every frame (fingers_up must be called after process)
    out_img, _ = detector.process(Image(frame))

    right_fingers = detector.fingers_up('right')
    left_fingers = detector.fingers_up('left')

    # Count extended fingers as the sum of 1s
    print('Right hand:', right_fingers, '(', right_fingers.count(1), 'fingers)')
    print('Left hand :', left_fingers,  '(', left_fingers.count(1),  'fingers)')

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.distance(p1, p2, image, draw=True) — Distance between two points",summary:"Computes the pixel distance between two keypoint coordinates and (optionally) draws a line and circles on screen.",details:`Args:
  p1, p2 ((x, y, z)): coordinate tuples -- pick from the "landmarks" of the dict returned by process
  image (Image): image to draw on
  draw (bool): if True, draws a magenta line plus circles at both ends and the midpoint.
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
        # Measure distance between thumb tip (4) and index tip (8) + draw line
        length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
        print(f'Right thumb-index distance: {length:.1f}px')

    cv2.imshow('distance', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.recognize_sign(lm) — Classify hand sign",summary:'Classifies a hand sign from the 21 keypoints of one hand and returns an ID string (e.g. "OK", "v", "fist").',details:`Args:
  lm (list): list of 21 (x, y, z) pixel tuples for one hand
Returns:
  str | None: the recognized sign ID. None when no match.

process() automatically calls this every frame for both hands, so normally
you do not call it directly -- just read the results from detector.sign["right"]/["left"].`,table:{headers:["Sign ID","Hand shape"],rows:[["OK","Thumb-index ring + other three fingers extended"],["v","Index + middle extended (V / Peace)"],["fist","Fist (all folded)"],["open_hand","All five fingers extended (open palm)"],["thumbs_up","Only thumb extended (like)"],["pointing","Only index extended (pointing)"],["three","Index + middle + ring extended"],["four","Four fingers extended except thumb"],["pinky","Only pinky extended (promise)"],["rock","Index + pinky extended (rock and roll)"],["call_me","Thumb + pinky extended (call / shaka)"],["ily","Thumb + index + pinky extended (ASL 'I love you')"],["L","Thumb + index extended (L shape)"]]},example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # Call the classifier directly (process already populates detector.sign)
        sign = detector.recognize_sign(h['landmarks'])
        print(h['handedness'], '->', sign)

    cv2.imshow('signs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.sign — Per-hand sign dict (auto-updated)",summary:'A read-only property that process() automatically fills with the per-hand sign each frame. Always has the form {"left": ..., "right": ...}.',details:`Value shape:
  detector.sign = {
      'left':  <left-hand sign ID or None>,
      'right': <right-hand sign ID or None>,
  }

None when the hand is not detected or no pattern matches.`,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # detector.sign is updated per hand after process completes
    out_img, _ = detector.process(Image(frame))

    if detector.sign['right'] == 'OK':
        print('Right hand OK sign!')
    if detector.sign['left'] == 'fist':
        print('Left hand fist!')

    cv2.imshow('sign property', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 1: Detect both hands in a static image",summary:"Reads an image file, detects keypoints for both hands, and shows the result.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image

detector = HandsDetector()
img = cv2.imread('hand.jpg')

# Wrap with Image() and pass to the detector
out_img, hands = detector.process(Image(img))

print('Number of hands detected:', len(hands))
for h in hands:
    print(h['handedness'], '-> keypoints:', len(h['landmarks']))

cv2.imshow('hands', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam two-hand tracking",summary:"Opens the webcam and detects both hands every frame. The right hand is visually distinguished by light purple connection lines. Press ESC to exit.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # Both hands are drawn; only right-hand lines are light purple
    out_img, hands = detector.process(Image(frame))
    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 3: Print index fingertip coordinates of both hands",summary:"Logs the index fingertip (keypoint 8) coordinates of both hands to the console in real time.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    for h in hands:
        # 8 = INDEX_FINGER_TIP (index fingertip)
        x, y, _ = h['landmarks'][8]
        print(f"{h['handedness']} index tip: ({x}, {y})")

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Count extended fingers on both hands",summary:"Prints the extended-finger pattern of both hands using fingers_up('right'/'left').",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, hands = detector.process(Image(frame))

    if hands:                   # Only when at least one hand is detected
        right = detector.fingers_up('right')
        left = detector.fingers_up('left')
        print(f'Right: {right} ({right.count(1)} fingers) / '
              f'Left: {left} ({left.count(1)} fingers)')

    cv2.imshow('hands', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Measure thumb-index distance for each hand",summary:"For every detected hand, measures the distance between the thumb (4) and index (8) tips and shows it on screen (zoom-gesture idea).",details:null,example:`import web_cv2 as cv2
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
        # Measure distance between thumb tip (4) and index tip (8)
        length, out_img, _ = detector.distance(pts[4], pts[8], out_img)
        print(f"{h['handedness']} thumb-index: {length:.0f}px")

    cv2.imshow('zoom gesture', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 6: Recognize signs on both hands at once (OK / V etc.)",summary:"Reads the right- and left-hand signs at once via the detector.sign dict and prints them.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    # detector.sign is always a {'left': ..., 'right': ...} dict
    right_sign = detector.sign['right']
    left_sign = detector.sign['left']

    # Example: check whether both hands are showing OK simultaneously
    if right_sign == 'OK' and left_sign == 'OK':
        print('Both hands OK!')
    elif right_sign == 'v' or left_sign == 'v':
        print('V sign detected')
    else:
        if right_sign:
            print('Right:', right_sign)
        if left_sign:
            print('Left :', left_sign)

    cv2.imshow('signs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 7: Catch only sign changes per hand",summary:"Tracks changes in the detector.sign dict and prints only when the sign for each hand actually changes.",details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

detector = HandsDetector()
cap = cv2.VideoCapture()

# Remember the previous frame's per-hand sign
prev = {'left': None, 'right': None}

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    for side in ('right', 'left'):
        cur = detector.sign[side]
        if cur != prev[side]:           # Print only at the moment the sign changes
            if cur:
                print(f'{side} sign changed: {cur}')
            prev[side] = cur

    cv2.imshow('sign change', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 8: Toggle the auto sign label above the wrist",summary:'An example that toggles the auto "right: v" / "left: fist" label drawn by process() with the t key.',details:null,example:`import web_cv2 as cv2
from helloai import HandsDetector, Image, Keyboard

# Default draw_label=True -> sign label drawn automatically above the wrist
detector = HandsDetector()
cap = cv2.VideoCapture()

label_on = True
while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # show_label only toggles for this call. None follows the constructor's draw_label
    out_img, _ = detector.process(Image(frame), show_label=label_on)

    cv2.imshow('auto label', out_img.frame)
    key = cv2.waitKey(1)
    if key == Keyboard.ESC:
        break
    if key == Keyboard.T:           # Toggle label with the 't' key
        label_on = not label_on

cap.release()
cv2.destroyAllWindows()`}]},{id:"face",title:"Face Detection (FaceDetector)",description:"Detects 22 face mesh keypoints (eyebrows, eyes, nose, mouth) and, with an option enabled, also returns 52 facial expression scores (blendshapes) such as smile and jaw open.",icon:"face_4",image:a,entries:[{name:"from helloai import FaceDetector, Image",summary:"Imports the face detector and image wrapper.",details:"Paste this at the top of your example code as is.",example:`# Import the face detector together with the Image wrapper
from helloai import FaceDetector, Image`},{name:"Image and frame relationship (please read)",summary:"Pass raw frames to cv2 functions, but Image(frame) to FaceDetector. Use the .frame property to get the raw frame back when sending to cv2.",example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()       # cv2 -> raw frame
    if not ok:
        continue

    # Pass to the detector wrapped in Image(frame)
    out_img, points = detector.process(Image(frame))

    # cv2.imshow needs a raw frame again -> use .frame
    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceDetector(min_detection_confidence=0.5, expressions=False, draw_label=True)",summary:"Creates a face detector. On first call it downloads the model (~3MB).",details:`Args:
  min_detection_confidence (float): 0~1. Lower catches more but increases false positives.
  expressions (bool): if True, also computes 52 expression (blendshape) coefficients.
    Required to read detector.blendshapes / .expression / .expression_score.
  draw_label (bool): if True, process automatically draws the expression label
    in the top-left (only meaningful together with expressions=True).
Returns: FaceDetector object`,example:`from helloai import FaceDetector

# Default detector (does not compute expressions)
detector = FaceDetector()

# To also see facial expressions, use expressions=True
# detector = FaceDetector(expressions=True)`},{name:"detector.process(img, draw=True, show_label=None) — Detect faces",summary:"Detects the face mesh and returns a list of 22 key keypoints.",details:`Args:
  img (Image): an Image object wrapping the input image
  draw (bool): if True, draws the mesh + 22 points on the result.
  show_label (bool|None): if True/False, toggles the expression label for this call only.
    None follows the constructor's draw_label.

Returns: (Image, list)
  - Image: visualized result
  - list: 22 (x, y, z) tuples (empty list [] when no face is detected)`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image

detector = FaceDetector()
img = cv2.imread('face.jpg')

# Detect face -> get visualization and 22 keypoints
out_img, points = detector.process(Image(img))

if points:
    print('22 face points:', len(points))
    print('Nose tip (15):', points[15])

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"detector.blendshapes — 52 expression coefficients (only when expressions=True)",summary:"A dict[str, float] with 52 expression coefficients from the most recent process() call.",details:`None if the detector was created with expressions=False or no face was detected in the previous frame.

Common categories:
  mouthSmileLeft / mouthSmileRight  -- mouth corners up (smile)
  mouthFrownLeft / mouthFrownRight  -- mouth corners down
  browDownLeft / browDownRight      -- brow down (anger)
  browInnerUp                       -- inner brow raised (surprise)
  eyeBlinkLeft / eyeBlinkRight      -- blink
  jawOpen                           -- mouth open
  cheekPuff                         -- cheek puff
  noseSneerLeft / noseSneerRight    -- nose sneer
  _neutral                          -- degree of neutral expression`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# expressions=True is required to receive blendshapes
detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    bs = detector.blendshapes
    if bs:
        # Average left/right mouth corner scores to measure smile intensity
        smile = (bs.get('mouthSmileLeft', 0) + bs.get('mouthSmileRight', 0)) / 2
        print(f'Smile score: {smile:.2f}')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.expression — Most prominent expression name (only when expressions=True)",summary:'Name of the top blendshape category excluding _neutral. Example: "mouthSmileLeft".',details:`None when no face is detected or all coefficients are _neutral.

When process(draw=True) + expressions=True, the expression value is
drawn automatically in the top-left of the image.`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, _ = detector.process(Image(frame))

    if detector.expression:
        # e.g. 'mouthSmileLeft', 'browDownLeft', 'jawOpen'
        print(detector.expression)

    cv2.imshow('expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.expression_score — Score for the above expression (0.0~1.0)",summary:"Score of the category indicated by detector.expression.",details:"0.0 when no face is detected or expressions=False.",example:`import web_cv2 as cv2
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
    # Trust only when above the 0.5 threshold
    if name and score > 0.5:
        print(f'{name}: {score:.2f}')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 1: Show face mesh on a static image",summary:"Detects a face in an image file and displays the mesh + 22 points.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image

detector = FaceDetector()
img = cv2.imread('face.jpg')

# Detect face -> get the result image with the mesh drawn
out_img, points = detector.process(Image(img))

print('22 points detected:', len(points))
cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam face mesh",summary:"Opens the webcam and draws the face mesh on every frame.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 3: Print nose tip coordinates",summary:"Logs the nose tip (index 15) of the 22 detected points to the console every frame.",details:null,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# points indices: [14]=NOSE 5, [15]=NOSE 4 (tip)
detector = FaceDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, points = detector.process(Image(frame))

    if points:
        x, y, _ = points[15]
        print(f'Nose tip: ({x}, {y})')

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Detect smile via mouth corner distance",summary:'Prints "smile" when the distance between the left (18) and right (20) mouth corners exceeds a threshold.',details:null,example:`import web_cv2 as cv2
import math
from helloai import FaceDetector, Image, Keyboard

# points[18] = LIPS 61 (left), points[20] = LIPS 409 (right)
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
        # Pixel distance between the two points (mouth width)
        width = math.hypot(rx - lx, ry - ly)
        print(f'Mouth width: {width:.0f}px',
              '(smile!)' if width > 80 else '')

    cv2.imshow('smile', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Detect smile / jaw open / blink via blendshapes",summary:"Uses expressions=True to receive expression coefficients and apply thresholds to identify expressions.",details:`With expressions=True, in addition to 478 landmarks, 52 expression coefficients
are computed. You can quantify basic expressions like smile / jaw open / blink
instantly without any trained model (.fcm).`,example:`import web_cv2 as cv2
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
        # Normalize scores by averaging left/right
        smile = (bs.get('mouthSmileLeft', 0) + bs.get('mouthSmileRight', 0)) / 2
        jaw = bs.get('jawOpen', 0)
        blink = (bs.get('eyeBlinkLeft', 0) + bs.get('eyeBlinkRight', 0)) / 2

        # Print expression message when above threshold
        if smile > 0.5:
            print(f'Smile! ({smile:.2f})')
        if jaw > 0.4:
            print(f'Jaw open ({jaw:.2f})')
        if blink > 0.5:
            print(f'Eyes closed ({blink:.2f})')

    cv2.imshow('expressions', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 6: One-line print of the most prominent expression",summary:"Shows the top expression every frame using detector.expression / .expression_score.",details:`Since expression is the top blendshape excluding _neutral, when the face is
expressionless the previous expression may linger weakly or None may appear.
Use a threshold (e.g. 0.4) to reduce noise.`,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 7: Auto expression label overlay",summary:"When expressions=True + draw_label=True (default), the expression is drawn automatically in the top-left every frame.",details:`To draw the expression on screen both must be enabled.
  1) FaceDetector(expressions=True) -- the expression value is computed
  2) draw_label=True (default) -- process automatically calls putText in the top-left

To turn it off for a single call, use process(..., show_label=False).`,example:`import web_cv2 as cv2
from helloai import FaceDetector, Image, Keyboard

# Expression computation must be on for the label to show
detector = FaceDetector(expressions=True)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue

    # Label is drawn automatically in the top-left (no separate putText needed)
    out_img, _ = detector.process(Image(frame))

    cv2.imshow('auto expression', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"pose",title:"Full-body Pose Detection (PoseDetector)",description:'Finds 33 full-body keypoints (head, shoulders, elbows, wrists, hips, knees, ankles) from a camera/image and automatically classifies poses such as "hands up", "T-pose", and "squat".',icon:"directions_run",image:t,entries:[{name:"from helloai import PoseDetector, Image",summary:"Imports the pose detector and image wrapper.",details:"Paste this at the top of your example code as is.",example:`# Import the pose detector together with the Image wrapper
from helloai import PoseDetector, Image`},{name:"Image and frame relationship (please read)",summary:"Pass raw frames to cv2 functions, but Image(frame) to PoseDetector. Use the .frame property to get the raw frame back when sending to cv2.",example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()       # cv2 -> raw frame
    if not ok:
        continue

    # Pass to the detector wrapped in Image(frame)
    out_img, lmlist = detector.process(Image(frame))

    # cv2.imshow needs a raw frame again -> use .frame
    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseDetector(draw_label=True) — Create a detector",summary:"Creates a pose detector. On first call it downloads the model (~5MB).",details:`Args:
  draw_label (bool): if True, process automatically draws the detector.pose label
    in the top-left of the image every frame. Set to False to disable.
Returns: PoseDetector object`,example:`from helloai import PoseDetector

# Create a detector with default options
detector = PoseDetector()`,warning2:`33 keypoint indices: 0=NOSE, 11/12=L/R shoulder, 13/14=L/R elbow,
15/16=L/R wrist, 23/24=L/R hip, 25/26=L/R knee, 27/28=L/R ankle.`,warning2Type:"info"},{name:"detector.process(image, ...) — Detect pose",summary:"Detects a pose and returns a list of 33 keypoint pixel coordinates.",details:`Args:
  image (Image): input image
  draw (bool): if True, draws a purple skeleton.
  line_width (int), circle_radius (int): visualization sizes
  show_label (bool|None): toggles the pose label for this call only.

Returns: (Image, list)
  - Image: visualized result
  - list: 33 (x, y, z) tuples (empty list [] when not detected)`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image

detector = PoseDetector()
img = cv2.imread('pose.jpg')

# Detect pose -> visualization and 33 keypoints
out_img, lmlist = detector.process(Image(img))

if lmlist:
    nose = lmlist[0]            # 0 = nose
    print('Nose coordinates:', nose[:2])

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"detector.calc_angle(image, p1, p2, p3, draw=True) — Angle of three points",summary:"Computes the angle at p2 formed by three points (p1-p2-p3) in degrees.",details:`Args:
  image (Image): image to draw on
  p1, p2, p3 ((x, y, z)): three keypoints
  draw (bool): if True, draws white lines + red circles + the angle text
Returns:
  (angle, Image): an angle between 0 and 360, and the visualized Image`,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # 11=left shoulder, 13=left elbow, 15=left wrist -> elbow angle
        angle, out_img = detector.calc_angle(
            out_img, lmlist[11], lmlist[13], lmlist[15]
        )
        print(f'Left elbow angle: {angle:.0f} deg')

    cv2.imshow('elbow angle', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.distance(p1_idx, p2_idx, image, draw=True) — Distance between two keypoints",summary:"Computes the distance between two keypoint **indices** (the argument format differs from HandsDetector.distance -- it takes index numbers, not coordinates).",details:`Args:
  p1_idx, p2_idx (int): keypoint indices (0~32)
  image (Image): image to draw on
  draw (bool): if True, draws a magenta line + circles
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
        # Pixel distance between index 11 (left shoulder) and 15 (left wrist)
        length, out_img, _ = detector.distance(11, 15, out_img)
        print(f'Shoulder-wrist distance: {length:.0f}px')

    cv2.imshow('distance', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"detector.pose — Automatic pose label",summary:"Returns a string describing the current pose right after process(). None when undetectable / not detected.",details:`Determines a single label by priority using normalized landmark coordinates (in shoulder-width units).
It is updated automatically inside process(), so just read detector.pose afterwards.

When process(draw=True), the detector.pose value is drawn automatically in the top-left.

Notes:
  - Left/right is screen-relative (independent of camera mirror mode).
  - When multiple conditions match in one frame, a single label is chosen by the order in the table below.
  - Thresholds are normalized by shoulder width and therefore do not depend on camera distance.`,table:{headers:["Label","Condition"],rows:[['"lying"',"Body horizontal (shoulders/hips/knees roughly equal y)"],['"arms_crossed"',"Both wrists near opposite shoulders, below the shoulders"],['"hands_up"',"Both wrists above both shoulders (hands up)"],['"t_pose"',"Both arms extended horizontally past the shoulders"],['"left_hand_up"',"Only the screen-left hand above the shoulder"],['"right_hand_up"',"Only the screen-right hand above the shoulder"],['"squat"',"Hips drop to or below the knees"],['"sitting"',"Knee angle around 60-130 deg (legs bent)"],['"bending"',"Shoulders drop close to the hips (waist bent)"],['"standing"',"Shoulders < hips < knees < ankles vertically aligned"],["None","No condition matched or no person detected"]]},example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    # detector.pose is updated automatically after process
    if detector.pose == 'hands_up':
        print('Hands up!')
    elif detector.pose is None:
        print('Cannot recognize the pose')

    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 1: Detect pose on a static image",summary:"Detects the full-body pose on an image file and draws the skeleton.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image

detector = PoseDetector()
img = cv2.imread('pose.jpg')

# Detect pose -> 33 keypoints and visualized image
out_img, lmlist = detector.process(Image(img))

print('Number of keypoints:', len(lmlist))
cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam pose",summary:"Opens the webcam and draws the pose skeleton on every frame.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 3: Print shoulder coordinates",summary:"Logs the left/right shoulder (11, 12) coordinates to the console every frame.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        l = lmlist[11]              # 11 = left shoulder (LEFT_SHOULDER)
        r = lmlist[12]              # 12 = right shoulder (RIGHT_SHOULDER)
        print(f'L shoulder {l[:2]}  R shoulder {r[:2]}')

    cv2.imshow('shoulders', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Measure left elbow angle",summary:"Measures the elbow angle in real time using shoulder (11), elbow (13), wrist (15).",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # The angle at point 13 formed by 11-13-15 = elbow angle
        angle, out_img = detector.calc_angle(
            out_img, lmlist[11], lmlist[13], lmlist[15]
        )
        print(f'Left elbow angle: {angle:.0f} deg')

    cv2.imshow('elbow angle', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Measure shoulder-wrist distance",summary:"Uses distance(p1_idx, p2_idx) to display the left shoulder-wrist distance on screen.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, lmlist = detector.process(Image(frame))

    if lmlist:
        # Pass indices directly (different from HandsDetector.distance!)
        length, out_img, _ = detector.distance(11, 15, out_img)
        print(f'Shoulder-wrist: {length:.0f}px')

    cv2.imshow('reach', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 6: Show automatic pose label (hands up / squat etc.)",summary:"detector.pose is drawn automatically in the top-left every frame. Try hands up / T-pose / squat / sitting / lying yourself.",details:null,example:`import web_cv2 as cv2
from helloai import PoseDetector, Image, Keyboard

# Default draw_label=True -> pose label drawn automatically in the top-left
detector = PoseDetector()
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    # Result with automatic label + skeleton drawn
    out_img, _ = detector.process(Image(frame))

    # Also print the current pose to the console for inspection
    if detector.pose:
        print('Current pose:', detector.pose)

    cv2.imshow('pose label', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"ocr",title:"Text Recognition (OCR)",description:"Reads English/Korean text from images or camera video and returns it as strings (powered by Tesseract.js).",icon:"document_scanner",entries:[{name:"from helloai import OCR, Image",summary:"Imports the OCR class and image wrapper.",details:"Paste this at the top of your example code as is.",example:`# Import the text recognizer together with the Image wrapper
from helloai import OCR, Image`},{name:"OCR() — Create a recognizer",summary:"Creates a Korean/English OCR engine. On first call it downloads the language data (~5-10MB per language).",details:`Args: none (English + Korean fixed)
Returns: OCR object

Internally follows the easyocr.Reader(["en", "ko"]) interface but the
actual inference is routed through the browser's Tesseract.js.`,example:`from helloai import OCR

# Create an OCR instance with simultaneous Korean/English recognition
ocr = OCR()`},{name:"ocr.readtext(img, isdraw=True) — Recognize text",summary:"Recognizes text in the image and returns (result list, visualized Image).",details:`Args:
  img (Image): input image
  isdraw (bool): if True, draws green boxes around recognized words and red labels.
Returns:
  (results, Image): results = [(bbox, text, prob), ...]
    bbox = [TL, TR, BR, BL] 4 points ([[x,y], ...])
    text = recognized string
    prob = 0~1 confidence`,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# Recognize text -> result list and visualized image
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # Print the recognized word together with its confidence
    print(f'{text!r}  prob={prob:.2f}')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 1: English recognition on a static image",summary:"Reads text from an image file and prints the recognition results to the console.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# Text regions and confidences are returned together
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    print(f'{text!r}  ({prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Korean text recognition",summary:"The same code recognizes images containing Korean as well (en+ko supported simultaneously).",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('hangul.png')      # Image containing Korean text

results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # Print line by line with confidence
    print(f'[{prob:.2f}] {text}')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 3: Print only results with prob >= 0.7",summary:"Filters out low-confidence misrecognitions and uses only confident results.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')
results, out_img = ocr.readtext(Image(img))

for (bbox, text, prob) in results:
    # Skip below threshold
    if prob < 0.7:
        continue
    print(f'{text}  (prob {prob:.2f})')

cv2.imshow('ocr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 4: Extract only the box coordinates (turn off visualization)",summary:"Disables box drawing with isdraw=False and uses only the coordinates/text.",details:null,example:`import web_cv2 as cv2
from helloai import OCR, Image

ocr = OCR()
img = cv2.imread('text.png')

# Receive only coordinates without visualization
results, _ = ocr.readtext(Image(img), isdraw=False)

for (bbox, text, prob) in results:
    tl = bbox[0]                # Top-left
    br = bbox[2]                # Bottom-right
    print(f'{text}  TL={tl}  BR={br}')`}]},{id:"qr",title:"QR Code Recognition (QRReader)",description:"Decodes QR codes from camera/image and extracts the text inside. Ready to use immediately without any model download.",icon:"qr_code_scanner",entries:[{name:"from helloai import QRReader, Image",summary:"Imports the QR reader and image wrapper.",details:"Paste this at the top of your example code as is.",example:`# Import the QR reader together with the Image wrapper
from helloai import QRReader, Image`},{name:"QRReader() — Create a reader",summary:"Creates a QR reader. Ready to use immediately without any model download.",details:`Args: none
Returns: QRReader object

Built on the jsQR library (~30KB) -- no extra network downloads.`,example:`from helloai import QRReader

# Create a QR reader instance (ready immediately)
qr = QRReader()`},{name:"qr.process(img, draw=True) — Decode QR",summary:"Decodes QR from the image and returns (result list, visualized Image).",details:`Args:
  img (Image): input image
  draw (bool): if True, draws the QR outline (4 sides) in green and the text in red.
Returns:
  (results, Image): results = [(bbox, data), ...]
    bbox = [TL, TR, BR, BL] 4 points
    data = decoded string

Up to 1 per frame (jsQR limitation).`,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

# Decode QR -> result list and visualized image
results, out_img = qr.process(Image(img))

for (bbox, data) in results:
    print('QR:', data)

cv2.imshow('qr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"qr.read(img) — Extract text only",summary:"Shortcut for process -- returns only the decoded string list (no visualization).",details:`Args:
  img (Image): input image
Returns:
  list[str]: decoded strings (currently up to 1 element)`,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

# Quickly extract only text without visualization
texts = qr.read(Image(img))
if texts:
    print(texts[0])
else:
    print('No QR found')`},{name:"Example 1: Decode QR on a static image",summary:"Reads the QR drawn in an image file at once.",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image

qr = QRReader()
img = cv2.imread('qr.png')

results, out_img = qr.process(Image(img))

for (bbox, data) in results:
    print('QR data:', data)

cv2.imshow('qr', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam scan",summary:"Hold a QR up to the webcam to print the decode result on every frame.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 3: Avoid duplicate output of the same QR",summary:"Prints only once while holding the same code (last-comparison pattern).",details:null,example:`import web_cv2 as cv2
from helloai import QRReader, Image, Keyboard

qr = QRReader()
cap = cv2.VideoCapture()
last = None                         # Remember the previously printed QR text

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    results, out_img = qr.process(Image(frame))

    for (bbox, data) in results:
        # Only treat as a new QR when different from previous and print
        if data != last:
            print('NEW QR:', data)
            last = data

    cv2.imshow('QR', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Print only when it is a URL",summary:"Process only when the decoded data starts with http:// or https://.",details:null,example:`import web_cv2 as cv2
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
        # Check URL format and print only once
        if data != last and data.startswith(('http://', 'https://')):
            print('URL found:', data)
            last = data

    cv2.imshow('QR URL Scanner', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"tm_image",title:"Teachable Machine Model (TMImageModel)",description:"Imports an image classification model trained on the Google Teachable Machine site into the IDE and applies it to camera/images directly.",icon:"category",externalLink:{href:"https://teachablemachine.withgoogle.com/train/image",label:"Open Teachable Machine",icon:"open_in_new"},image:s,imageNote:`To use the API on this page, you need to download a URL or file from the "Tensorflow.js" option of "Export Model" -> "Tensorflow" tab in Teachable Machine after training.
Upload the downloaded model file (.zip) to the File Explorer on the left, then pass that path to load_model() in your code.`,entries:[{name:"from helloai import TMImageModel, Image",summary:"Imports the Teachable Machine image classifier and image wrapper.",details:"Paste this at the top of your example code as is.",example:`# Import the Teachable Machine image model with the Image wrapper
from helloai import TMImageModel, Image`},{name:"TMImageModel() — Create an empty model object",summary:"Creates a Teachable Machine image model object (the model is still empty).",details:`Args: none
Returns: TMImageModel object

Internally, @teachablemachine/image (TensorFlow.js) runs on the main thread,
and a ~1MB library is lazily downloaded on the first load_model() call.`,example:`from helloai import TMImageModel

# Create an empty model instance (actual weights are fetched in load_model)
tm = TMImageModel()`},{name:"tm.load_model(url_or_path) — Load model",summary:"Loads the model from a Teachable Machine URL or an uploaded .zip path.",details:`Args:
  url form (str): a share URL issued via "Upload my model" in the TM "Tensorflow.js" tab.
    e.g. "https://teachablemachine.withgoogle.com/models/VQ9dhejr9/"
  file path (str): relative or absolute path based on /work/.
    Upload the .zip received from "Download my model" in the "Tensorflow.js" tab
    to Explorer and pass that file name.
Returns: True on successful load

Note: the browser TFJS cannot open Keras .h5 files directly. Always use
a URL or .zip exported as "Tensorflow.js".`,example:`from helloai import TMImageModel

tm = TMImageModel()

# Option A: Load model from URL
tm.load_model("https://teachablemachine.withgoogle.com/models/VQ9dhejr9/")

# Option B: Uploaded zip file (when not using option A)
# tm.load_model("my_model.zip")

# Check the trained classes
print('Classes:', tm.labels)`},{name:"tm.process(img) — Classify image",summary:"Classifies the input image and returns the class label string with the highest probability.",details:`Args:
  img (Image): an Image object wrapping a cv2.imread / cap.read result
Returns:
  str: class label with the highest probability. "" if the model is not loaded or input is empty.

The previous call's confidence can be read separately via tm.confidence.`,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')

# Classify -> check label string + confidence
label = tm.process(Image(img))
print('Result:', label, 'Confidence:', tm.confidence)`},{name:"tm.labels — Class name list",summary:"Read-only list of the model's class labels.",details:`Returns:
  list[str]: the list of class names in the order specified in TM.

Available after load_model().`,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

# Trained class names
print(tm.labels)
# e.g. ["Class 1", "Class 2", "Class 3"]`},{name:"tm.confidence — Last classification confidence",summary:"Top class probability of the previous process() call (0.0 ~ 1.0).",details:`Returns:
  float: probability between 0 and 1. Rounded to three decimal places.

None if process() has never been called.`,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')
label = tm.process(Image(img))

# Trust only when above the threshold
if tm.confidence and tm.confidence >= 0.8:
    print('Confident:', label)`},{name:"tm.summary() — Print model info",summary:"Prints the loaded model's class labels to the console.",details:`Args: none
Returns: none

Prints a guide message if the model is not loaded.`,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
tm = TMImageModel()
tm.load_model(URL)

# Print class info to the console
tm.summary()`},{name:"Example 1: Load model + check classes",summary:"Loads a model from URL and checks the class names (the simplest starting point).",details:null,example:`from helloai import TMImageModel

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

# Check the trained class count and names at once
print('Number of classes:', len(tm.labels))
for i, name in enumerate(tm.labels):
    print(f'  {i}: {name}')`},{name:"Example 2: Classify a single static image",summary:"Feeds one image file to the model and prints the label and confidence once.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"

tm = TMImageModel()
tm.load_model(URL)

img = cv2.imread('test.png')
if img is None:
    print('Please add test.png to the project')
else:
    label = tm.process(Image(img))
    print(f'Result: {label}  (confidence {tm.confidence:.2f})')

    cv2.imshow('tm', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"Example 3: Real-time webcam classification",summary:"Classifies the camera feed every frame and prints the label to the console. Press ESC to exit.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 4: Filter by confidence threshold",summary:'Prints "..." when confidence is below 0.8 to ignore noisy classifications.',details:null,example:`import web_cv2 as cv2
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

    # Trust only results above the threshold
    if tm.confidence and tm.confidence >= THRESHOLD:
        print(f'>> {label}  ({tm.confidence:.2f})')
    else:
        print('...')                # Treat as noise

    cv2.imshow('tm', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Overlay label/confidence on screen",summary:"Draws the result label and confidence in the top-left of the image every frame.",details:null,example:`import web_cv2 as cv2
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

    # Build a single line of label and confidence and draw it
    text = f'{label}  {tm.confidence:.2f}' if label else 'no model'
    cv2.putText(frame, text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('tm overlay', frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 6: Print only on label change + per-class count",summary:"Suppresses output while the same label persists, and shows the cumulative count whenever the label changes.",details:null,example:`import web_cv2 as cv2
from helloai import TMImageModel, Image, Keyboard

URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"
THRESHOLD = 0.7

tm = TMImageModel()
tm.load_model(URL)

# Initialize per-class cumulative counter
counts = {name: 0 for name in tm.labels}
last = None                         # Remember the previous label

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    label = tm.process(Image(frame))
    confident = tm.confidence and tm.confidence >= THRESHOLD

    # Only count + print at the moment the label newly changes
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
cv2.destroyAllWindows()`}]},{id:"image_classifier",title:"My Image Classifier (ImageClassifier)",description:"Apply a .fcm image model trained directly in the Classify panel on the left to camera/images (e.g. cup vs book vs empty hand).",icon:"image_search",notice:'Before running, you must train classes in the [Image] tab of the Classify panel on the left and save them as a ".fcm" file. Calling ImageClassifier(...) will raise FileNotFoundError if the model file is missing.',entries:[{name:"from helloai import ImageClassifier, Image",summary:"Imports the image classifier and image wrapper.",details:`Paste this at the top of your example code as is.

ImageClassifier classifies the overall "mood/subject" of an entire photo.
e.g. cup vs book vs empty, mask on vs off, apple vs banana vs grape.
When you collect photos per class and train in the Classify panel, a .fcm file is generated automatically.`,example:`# Import the image classifier together with the Image wrapper
from helloai import ImageClassifier, Image`},{name:"Preparation: Create a .fcm file (please read first)",summary:'Train a model in the Classify panel on the left, save it as a ".fcm" file in the project, then use that path in your code.',details:`ImageClassifier does not train models itself.
Training happens in the IDE's "Classify" panel on the left, and the result is saved as a single .fcm file.

Step by step:

(1) Open the Classify panel from the left sidebar.
(2) Select the [Image] tab and create at least 2 classes (e.g. cup / book / empty)
    that you want to classify, then capture multiple webcam photos for each class.
(3) Press the "Train" button -- when finished, the "Save .fcm" button becomes active.
(4) Save in the project folder with a suitable name (e.g. cup_book.fcm).
(5) Pass that path to ImageClassifier(...) in your code.

Path rule: relative paths from project root like "models/cup_book.fcm" are recommended.
         Absolute paths (/work/...) are also fine.`,example:`# Project folder structure example
# my_project/
#   |- main.py            <- The code you are writing now
#   |- cup_book.fcm       <- Model saved from the Classify panel

from helloai import ImageClassifier, Image

# In the same folder, just pass the file name
clf = ImageClassifier('cup_book.fcm')
print('Trained classes:', clf.labels)`},{name:"Image and frame relationship (same rule as Detector)",summary:"Pass raw frames to cv2 functions, but Image(frame) to ImageClassifier. process() returns the input Image as is.",example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 -> raw frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # Classifier -> wrap in Image
    cv2.imshow('image', out_img.frame)            # cv2.imshow -> .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`,warning2:"ImageClassifier only accepts frames obtained from cv2.imread() or cap.read(). Wrapping a numpy array you built yourself with Image() raises TypeError.",warning2Type:"info"},{name:"ImageClassifier(model_path, draw_label=True) — Create classifier",summary:"Reads a .fcm file and creates a classifier.",details:`Args:
  model_path (str): relative path from project root or absolute path (.fcm file)
  draw_label (bool): if True, process() draws the label and % text in the top-left.
Returns: ImageClassifier object

Internally extracts MobileNetV2's 1280-dimensional features on the main thread,
then runs them through a lightweight classifier head (softmax / MLP / SVM / RandomForest) trained by the Classify panel.
On first call, MobileNet weights (~9MB) are downloaded once and then cached.`,example:`from helloai import ImageClassifier

# Pass the .fcm file path to create the classifier
clf = ImageClassifier('cup_book.fcm')
print('Classes:', clf.labels)`},{name:"clf.process(image, draw=True) — Classify image",summary:"Classifies the input image and returns (Image, Result).",details:`Args:
  image (Image): an Image object wrapping a cv2.imread / cap.read result
  draw (bool): if True and constructor draw_label=True, draws the label text on screen
Returns:
  (Image, Result):
    - Image: same object as the input image (label drawn in-place)
    - Result: see the "Result object" entry below`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')
img = cv2.imread('test.png')

# Classify -> get result object
out_img, result = clf.process(Image(img))
print(result.label, 'Confidence:', f'{result.confidence:.2f}')

cv2.imshow('image', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result object — label / confidence / probabilities / labels",summary:"The classification result object returned by process(). Holds which class was chosen and how confident the model is.",details:`Fields:
  result.label (str): class name with the highest probability. e.g. "cup"
  result.index (int): position in the labels list
  result.confidence (float): 0.0 ~ 1.0 -- probability of the top class
  result.probabilities (list[float]): probabilities for all classes (in labels order)
  result.labels (list[str]): full class name list of the model
  result.landmarks: always None for ImageClassifier
                   (only Face/Hand/Pose classifiers populate keypoint coordinates)`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')
img = cv2.imread('test.png')
out_img, result = clf.process(Image(img))

# Top class result
print(result.label)
print(f'{result.confidence * 100:.1f}%')

# Also check scores for all classes
for name, p in zip(result.labels, result.probabilities):
    print(f'  {name}: {p:.2f}')`},{name:"clf.labels (property) / clf.close()",summary:"labels is the class name list, close() releases memory.",details:`clf.labels: list[str] -- trained class names (read-only)
clf.close(): explicit memory cleanup. After close, the object cannot be used in process() again.`,example:`from helloai import ImageClassifier

clf = ImageClassifier('cup_book.fcm')
print(clf.labels)               # e.g. ['cup', 'book', 'empty']

# Explicitly clean up when no longer needed (optional)
clf.close()`},{name:"Example 1: Classify a single static image",summary:"Reads one image file, prints the most-probable class and its confidence.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image

clf = ImageClassifier('cup_book.fcm')

img = cv2.imread('test.png')
if img is None:
    print('Please add test.png to the project')
else:
    out_img, result = clf.process(Image(img))
    print(f'Result: {result.label}  ({result.confidence * 100:.1f}%)')
    cv2.imshow('image', out_img.frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam classification",summary:"Classifies the camera feed every frame and prints the label to the console. Press ESC to exit.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 3: Filter by confidence threshold",summary:'Prints "..." when confidence is below 0.8 to ignore noisy classifications.',details:`When the camera shakes or scenes the model never saw during training appear,
the model often picks any class with low probability. A threshold reduces flicker.`,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

THRESHOLD = 0.8
clf = ImageClassifier('cup_book.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # Trust only when above the threshold
    if result.confidence >= THRESHOLD:
        print(f'>> {result.label}  ({result.confidence:.2f})')
    else:
        print('...')

    cv2.imshow('image', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Display all class probabilities on screen",summary:"Uses probabilities to draw per-class scores line-by-line in the top-left.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

# Disable auto display since we will draw the labels ourselves
clf = ImageClassifier('cup_book.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # Display per-class scores, one line each
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Print only on label change + cumulative counts",summary:"Suppresses output while the same label persists, and shows per-class counts whenever the label changes.",details:null,example:`import web_cv2 as cv2
from helloai import ImageClassifier, Image, Keyboard

THRESHOLD = 0.7
clf = ImageClassifier('cup_book.fcm')

# Initialize per-class counter
counts = {name: 0 for name in clf.labels}
last = None

cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))
    confident = result.confidence >= THRESHOLD

    # Only act when the label has just changed
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
cv2.destroyAllWindows()`}]},{id:"face_classifier",title:"My Face (Expression) Classifier (FaceClassifier)",description:"Classify expressions using a .fcm face model trained in the Classify panel on the left (e.g. smile vs neutral, eyes closed vs open).",icon:"sentiment_satisfied",image:a,notice:'Before running, you must first train expression/face classes in the [Face] tab of the Classify panel on the left and save them as a ".fcm" file.',entries:[{name:"from helloai import FaceClassifier, Image",summary:"Imports the face classifier and image wrapper.",details:`Paste this at the top of your example code as is.

FaceClassifier is a model that classifies facial expressions/movements.
e.g. smiling vs neutral, eyes closed vs open, mouth open vs closed.
It extracts face keypoints directly from the input frame and feeds them
to the classifier, so you don't need to create a separate FaceDetector.`,example:`# Import the face classifier together with the Image wrapper
from helloai import FaceClassifier, Image`},{name:"Preparation: Create a .fcm file (please read first)",summary:'Train a model in the [Face] tab of the Classify panel on the left, save it as a ".fcm" file in the project, then use that path in your code.',details:`FaceClassifier also does not train models itself.
Training is handled by the [Face] tab of the IDE's "Classify" panel on the left, and the result is saved as a ".fcm".

Step by step:

(1) Left sidebar -> Classify panel -> [Face] tab.
(2) Create classes like "smile / neutral", and for each class show your face
    to the camera and collect samples (30-100 per class recommended).
(3) After "Train", save it to the project folder with "Save .fcm".
(4) Pass that path to FaceClassifier(...) in your code.

Both training and inference extract keypoints with the same MediaPipe FaceLandmarker,
so predictions are made on the same distribution as during training (low error).`,example:`# Project folder example
# my_project/
#   |- main.py
#   |- smile.fcm

from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
print('Trained classes:', clf.labels)`},{name:"Image and frame relationship (same rule as Detector)",summary:"Pass raw frames to cv2 functions, but Image(frame) to FaceClassifier. process() returns the same input Image with the skeleton drawn on it.",details:`Note: only frames obtained from cv2.imread() / cap.read() are accepted.
numpy arrays you build yourself raise TypeError.`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 -> raw frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # Classifier -> wrap in Image
    cv2.imshow('face', out_img.frame)             # cv2.imshow -> .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"FaceClassifier(model_path, draw_label=True) — Create classifier",summary:"Reads a .fcm file and creates a face classifier.",details:`Args:
  model_path (str): relative path from project root or absolute path (.fcm file)
  draw_label (bool): if True, process() draws the label and % text in the top-left.
Returns: FaceClassifier object

Internally, MediaPipe FaceLandmarker extracts only the 82-point subset (out of 478 points)
used during training and feeds them into the classifier head.
On first call, the FaceLandmarker model (~3MB) is downloaded once.`,example:`from helloai import FaceClassifier

# Create the classifier with the .fcm file path
clf = FaceClassifier('smile.fcm')
print('Classes:', clf.labels)`},{name:"clf.process(image, draw=True) — Classify expression",summary:"Detects the face, classifies it, and returns (Image, Result). A gray skeleton is drawn on the same Image.",details:`Args:
  image (Image): an Image object wrapping a cv2.imread / cap.read result
  draw (bool): if True, the detected keypoints and connection lines are drawn on image.frame.
Returns:
  (Image, Result):
    - Image: same object as the input image (skeleton/label drawn in-place)
    - Result: when no face is detected, label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
img = cv2.imread('face.jpg')

# Classify expression -> result object
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('No face visible')

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result object — includes landmarks",summary:"Classification result + face keypoint pixel coordinates.",details:`Fields:
  result.label (str): class name with the highest probability
  result.index (int): index of that class
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): probabilities for all classes (in labels order)
  result.labels (list[str]): full class name list
  result.landmarks (list[(x, y, z)]): the 82 face keypoints (pixel coordinates) used for training
                                     (empty list [] when no face is detected)`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
img = cv2.imread('face.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    print('Number of keypoints:', len(result.landmarks))
    print('First point:', result.landmarks[0])  # (x, y, z)`},{name:"clf.labels (property) / clf.close()",summary:"labels is the class name list, close() releases memory.",details:`clf.labels: list[str] -- trained class names (read-only)
clf.close(): explicit memory cleanup. After close, the object cannot be used in process() again.`,example:`from helloai import FaceClassifier

clf = FaceClassifier('smile.fcm')
print(clf.labels)               # e.g. ['smile', 'neutral']

# Explicit cleanup (optional)
clf.close()`},{name:"Example 1: Classify a single static image",summary:"Finds a face in an image file and prints the expression class and confidence.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image

clf = FaceClassifier('smile.fcm')
img = cv2.imread('face.jpg')

out_img, result = clf.process(Image(img))

if result.label:
    print(f'Result: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('No face detected')

cv2.imshow('face', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam expression classification",summary:"Detects a face every frame, classifies the expression, and draws the label/skeleton.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:'Example 3: Signal only when "smile"',summary:"Shows a message only when a specific class appears with at least a given confidence.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()
last = None                         # Remember previous state

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # Print only when the smile label first appears with confidence >= 0.7
    smiling = (result.label == 'smile' and result.confidence >= 0.7)
    if smiling and last != 'smile':
        print('Smile detected!')
        last = 'smile'
    elif not smiling and last == 'smile':
        last = None

    cv2.imshow('smile detector', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Display per-class probabilities on screen",summary:"Uses probabilities to draw all class scores line-by-line.",details:null,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # Display per-class scores, one line each
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Use landmarks to draw a dot at the face center",summary:"Adds an extra red circle at the first point of result.landmarks.",details:`landmarks are the 82 keypoints used for training. The index meanings
follow the same order as the visualization in the Classify panel [Face] tab.`,example:`import web_cv2 as cv2
from helloai import FaceClassifier, Image, Keyboard

clf = FaceClassifier('smile.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    if result.landmarks:
        # Add a red dot directly at the first keypoint
        x, y, _ = result.landmarks[0]
        cv2.circle(out_img.frame, (x, y), 8, (0, 0, 255), -1)

    cv2.imshow('face', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]},{id:"hand_classifier",title:"My Hand (Gesture) Classifier (HandClassifier)",description:"Classify gestures using a .fcm hand model trained in the Classify panel on the left (e.g. rock/paper/scissors, finger numbers).",icon:"gesture",image:e,notice:'Before running, you must first train hand-shape/gesture classes in the [Hand] tab of the Classify panel on the left and save them as a ".fcm" file.',entries:[{name:"from helloai import HandClassifier, Image",summary:"Imports the hand classifier and image wrapper.",details:`Paste this at the top of your example code as is.

HandClassifier is a model that classifies hand shapes/gestures.
e.g. rock vs paper vs scissors, thumbs up vs neutral, finger numbers 1-5.
It extracts hand keypoints directly from the input frame and feeds them
to the classifier, so you don't need to create a separate HandsDetector.`,example:`# Import the hand classifier together with the Image wrapper
from helloai import HandClassifier, Image`},{name:"Preparation: Create a .fcm file (please read first)",summary:'Train a model in the [Hand] tab of the Classify panel on the left, save it as a ".fcm" file in the project, then use that path in your code.',details:`Step by step:

(1) Left sidebar -> Classify panel -> [Hand] tab.
(2) Create classes like "rock / paper / scissors", and in front of the camera
    show each hand shape and collect samples (30-100 per class recommended).
(3) After "Train", save it to the project folder with "Save .fcm".
(4) Pass that path to HandClassifier(...) in your code.

Both training and inference extract 21 keypoints with the same MediaPipe HandLandmarker,
so predictions are made on the same distribution as during training.`,example:`# Project folder example
# my_project/
#   |- main.py
#   |- rps.fcm     <- Rock/paper/scissors model

from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
print('Trained classes:', clf.labels)`},{name:"Image and frame relationship (same rule as Detector)",summary:"Pass raw frames to cv2 functions, but Image(frame) to HandClassifier. process() returns the same input Image with the skeleton drawn on it.",details:"Note: only cv2.imread() / cap.read() results are accepted. numpy arrays raise TypeError.",example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 -> raw frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # Classifier -> wrap in Image
    cv2.imshow('hand', out_img.frame)             # cv2.imshow -> .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"HandClassifier(model_path, draw_label=True) — Create classifier",summary:"Reads a .fcm file and creates a hand classifier.",details:`Args:
  model_path (str): relative path from project root or absolute path (.fcm file)
  draw_label (bool): if True, process() draws the label and % text in the top-left.
Returns: HandClassifier object

Internally, MediaPipe HandLandmarker extracts 21 hand keypoints and feeds them to the classifier head.
On first call, the HandLandmarker model (~6MB) is downloaded once.`,example:`from helloai import HandClassifier

# Create the classifier with the .fcm file path
clf = HandClassifier('rps.fcm')
print('Classes:', clf.labels)`},{name:"clf.process(image, draw=True) — Classify hand shape",summary:"Detects the hand, classifies it, and returns (Image, Result). A blue skeleton is drawn on the same Image.",details:`Args:
  image (Image): an Image object wrapping a cv2.imread / cap.read result
  draw (bool): if True, the detected keypoints and connection lines are drawn on image.frame.
Returns:
  (Image, Result):
    - Image: same object as the input image (skeleton/label drawn in-place)
    - Result: when no hand is detected, label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
img = cv2.imread('hand.jpg')

# Classify hand shape -> result object
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('No hand visible')

cv2.imshow('hand', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result object — includes landmarks",summary:"Classification result + 21 hand keypoint pixel coordinates.",details:`Fields:
  result.label (str): class name with the highest probability
  result.index (int): index of that class
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): probabilities for all classes (in labels order)
  result.labels (list[str]): full class name list
  result.landmarks (list[(x, y, z)]): 21 hand keypoint pixel coordinates

Common indices (same as HandsDetector):
  0=wrist, 4=thumb tip, 8=index tip, 12=middle tip, 16=ring tip, 20=pinky tip`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
img = cv2.imread('hand.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    thumb = result.landmarks[4]     # Thumb tip
    index = result.landmarks[8]     # Index tip
    print('Thumb tip:', thumb[:2], 'Index tip:', index[:2])`},{name:"clf.labels (property) / clf.close()",summary:"labels is the class name list, close() releases memory.",details:`clf.labels: list[str] -- trained class names (read-only)
clf.close(): explicit memory cleanup. After close, the object cannot be used in process() again.`,example:`from helloai import HandClassifier

clf = HandClassifier('rps.fcm')
print(clf.labels)               # e.g. ['rock', 'paper', 'scissors']
clf.close()`},{name:"Example 1: Classify a single static image",summary:"Classifies the hand shape in an image file once and prints the class/confidence.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image

clf = HandClassifier('rps.fcm')
img = cv2.imread('hand.jpg')

out_img, result = clf.process(Image(img))

if result.label:
    print(f'Result: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('No hand detected')

cv2.imshow('hand', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam rock-paper-scissors",summary:"Classifies the hand shape every frame and prints the label to the console.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:"Example 3: Print only on label change (anti-flicker)",summary:"Prints only once while the same hand shape persists.",details:`Camera shake can briefly flash a different class on the same hand.
Combining a threshold with a label-change comparison keeps the output clean.`,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

THRESHOLD = 0.7
clf = HandClassifier('rps.fcm')
cap = cv2.VideoCapture()
last = None                         # Remember previous label

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
cv2.destroyAllWindows()`},{name:"Example 4: Also measure thumb-index distance",summary:"Uses landmarks directly to also display the distance between the thumb (4) and index (8) tips.",details:null,example:`import web_cv2 as cv2
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
        tx, ty, _ = result.landmarks[4]     # Thumb tip
        ix, iy, _ = result.landmarks[8]     # Index tip
        d = math.hypot(ix - tx, iy - ty)    # Pixel distance
        text = f'{result.label}  d={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('hand', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Draw per-class probability bars",summary:"Uses probabilities to draw each class score as a bar chart.",details:null,example:`import web_cv2 as cv2
from helloai import HandClassifier, Image, Keyboard

clf = HandClassifier('rps.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # One line per class -- compute bar length proportional to score
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
cv2.destroyAllWindows()`}]},{id:"pose_classifier",title:"My Pose Classifier (PoseClassifier)",description:"Classify postures using a .fcm full-body pose model trained in the Classify panel on the left (e.g. standing/sitting, yoga poses A/B/C).",icon:"accessibility_new",image:t,notice:'Before running, you must first train pose classes in the [Pose] tab of the Classify panel on the left and save them as a ".fcm" file.',entries:[{name:"from helloai import PoseClassifier, Image",summary:"Imports the pose classifier and image wrapper.",details:`Paste this at the top of your example code as is.

PoseClassifier is a model that classifies full-body poses.
e.g. standing vs sitting, hands up vs at attention, yoga poses A/B/C.
It extracts pose keypoints directly from the input frame and feeds them
to the classifier, so you don't need to create a separate PoseDetector.`,example:`# Import the pose classifier together with the Image wrapper
from helloai import PoseClassifier, Image`},{name:"Preparation: Create a .fcm file (please read first)",summary:'Train a model in the [Pose] tab of the Classify panel on the left, save it as a ".fcm" file in the project, then use that path in your code.',details:`Step by step:

(1) Left sidebar -> Classify panel -> [Pose] tab.
(2) Create classes like "stand / sit / hands_up", and in front of the camera
    take each pose and collect samples (the full body must be in the frame).
(3) After "Train", save it to the project folder with "Save .fcm".
(4) Pass that path to PoseClassifier(...) in your code.

Both training and inference extract 33 keypoints with the same MediaPipe PoseLandmarker,
so predictions are made on the same distribution as during training.`,example:`# Project folder example
# my_project/
#   |- main.py
#   |- yoga.fcm

from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
print('Trained classes:', clf.labels)`},{name:"Image and frame relationship (same rule as Detector)",summary:"Pass raw frames to cv2 functions, but Image(frame) to PoseClassifier. process() returns the same input Image with the skeleton drawn on it.",details:"Note: only cv2.imread() / cap.read() results are accepted. numpy arrays raise TypeError.",example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image, Keyboard

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()                        # cv2 -> raw frame
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))   # Classifier -> wrap in Image
    cv2.imshow('pose', out_img.frame)             # cv2.imshow -> .frame
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"PoseClassifier(model_path, draw_label=True) — Create classifier",summary:"Reads a .fcm file and creates a pose classifier.",details:`Args:
  model_path (str): relative path from project root or absolute path (.fcm file)
  draw_label (bool): if True, process() draws the label and % text in the top-left.
Returns: PoseClassifier object

Internally, MediaPipe PoseLandmarker extracts 33 keypoints and feeds them to the classifier head.
On first call, the PoseLandmarker model (~5MB) is downloaded once.`,example:`from helloai import PoseClassifier

# Create the classifier with the .fcm file path
clf = PoseClassifier('yoga.fcm')
print('Classes:', clf.labels)`},{name:"clf.process(image, draw=True) — Classify pose",summary:"Detects the pose, classifies it, and returns (Image, Result). A magenta skeleton is drawn on the same Image.",details:`Args:
  image (Image): an Image object wrapping a cv2.imread / cap.read result
  draw (bool): if True, the detected keypoints and connection lines are drawn on image.frame.
Returns:
  (Image, Result):
    - Image: same object as the input image (skeleton/label drawn in-place)
    - Result: when no pose is detected, label="", confidence=0, landmarks=[]`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
img = cv2.imread('pose.jpg')

# Classify pose -> result object
out_img, result = clf.process(Image(img))

if result.label:
    print(result.label, f'{result.confidence:.2f}')
else:
    print('Full body must be in the frame')

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Result object — includes landmarks",summary:"Classification result + 33 pose keypoint pixel coordinates.",details:`Fields:
  result.label (str): class name with the highest probability
  result.index (int): index of that class
  result.confidence (float): 0.0 ~ 1.0
  result.probabilities (list[float]): probabilities for all classes (in labels order)
  result.labels (list[str]): full class name list
  result.landmarks (list[(x, y, z)]): 33 pose keypoint pixel coordinates

Common indices (same as PoseDetector):
  0=NOSE, 11/12=L/R shoulder, 13/14=L/R elbow, 15/16=L/R wrist,
  23/24=L/R hip, 25/26=L/R knee, 27/28=L/R ankle`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
img = cv2.imread('pose.jpg')
out_img, result = clf.process(Image(img))

if result.landmarks:
    nose = result.landmarks[0]      # 0 = nose
    l_wrist = result.landmarks[15]  # 15 = left wrist
    print('Nose:', nose[:2], 'Left wrist:', l_wrist[:2])`},{name:"clf.labels (property) / clf.close()",summary:"labels is the class name list, close() releases memory.",details:`clf.labels: list[str] -- trained class names (read-only)
clf.close(): explicit memory cleanup. After close, the object cannot be used in process() again.`,example:`from helloai import PoseClassifier

clf = PoseClassifier('yoga.fcm')
print(clf.labels)               # e.g. ['stand', 'sit', 'hands_up']
clf.close()`},{name:"Example 1: Classify a single static image",summary:"Classifies the pose in an image file once and prints the class/confidence.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image

clf = PoseClassifier('yoga.fcm')
img = cv2.imread('pose.jpg')

out_img, result = clf.process(Image(img))

if result.label:
    print(f'Result: {result.label}  ({result.confidence * 100:.1f}%)')
else:
    print('No pose detected (full body must be in frame)')

cv2.imshow('pose', out_img.frame)
cv2.waitKey(0)
cv2.destroyAllWindows()`},{name:"Example 2: Real-time webcam pose classification",summary:"Classifies the pose every frame and draws the label/skeleton on screen.",details:null,example:`import web_cv2 as cv2
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
cv2.destroyAllWindows()`},{name:'Example 3: Signal when "hands_up" is held for a while',summary:"Shows a message only when a specific class is held for N consecutive frames (debouncing).",details:`Reacting immediately to a single hands-up easily misfires due to shake.
A consecutive-frame counter lets you trigger reliably.`,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image, Keyboard

TARGET = 'hands_up'
HOLD_FRAMES = 10                # Must hold for ~0.3s to trigger (at 30fps)
THRESHOLD = 0.7

clf = PoseClassifier('yoga.fcm')
cap = cv2.VideoCapture()
streak = 0                      # Consecutive hold frame count

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    if result.label == TARGET and result.confidence >= THRESHOLD:
        streak += 1
        if streak == HOLD_FRAMES:
            print('Hands up detected!')
    else:
        streak = 0              # Reset counter when condition breaks

    cv2.imshow('hands_up trigger', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 4: Display per-class probabilities on screen",summary:"Uses probabilities to draw all class scores line-by-line.",details:null,example:`import web_cv2 as cv2
from helloai import PoseClassifier, Image, Keyboard

clf = PoseClassifier('yoga.fcm', draw_label=False)
cap = cv2.VideoCapture()

while cap.isOpened():
    ok, frame = cap.read()
    if not ok:
        continue
    out_img, result = clf.process(Image(frame))

    # Display per-class scores, one line each
    for i, (name, p) in enumerate(zip(result.labels, result.probabilities)):
        text = f'{name}: {p * 100:5.1f}%'
        cv2.putText(out_img.frame, text, (10, 30 + i * 28),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('probs', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`},{name:"Example 5: Also measure shoulder-wrist distance via landmarks",summary:"Displays the pixel distance between the left shoulder (11) and wrist (15) keypoints alongside the classification result.",details:null,example:`import web_cv2 as cv2
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
        sx, sy, _ = result.landmarks[11]    # Left shoulder
        wx, wy, _ = result.landmarks[15]    # Left wrist
        d = math.hypot(wx - sx, wy - sy)    # Pixel distance
        text = f'{result.label}  L_arm={d:.0f}px'
        cv2.putText(out_img.frame, text, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow('pose', out_img.frame)
    if cv2.waitKey(1) == Keyboard.ESC:
        break

cap.release()
cv2.destroyAllWindows()`}]}];export{r as AI_REFERENCE};
