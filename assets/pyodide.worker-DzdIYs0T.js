const h="0.27.0",b=`https://cdn.jsdelivr.net/pyodide/v${h}/full/`;let _="";const p=t=>new URL(String(t).replace(/^\//,""),_);let s=null,d=null,n=null,y=null,f=null,c=null,u=!1;self.importScripts(b+"pyodide.js");function r(t,e={}){self.postMessage({type:t,...e})}const w={call(t,e){if(!c)throw new Error("mp bridge not initialized (SharedArrayBuffer required)");const i=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;Atomics.store(c.signal,0,0),self.postMessage({type:"mp",method:t,args:i}),Atomics.wait(c.signal,0,0);const o=Atomics.load(c.signal,1),a=Atomics.load(c.signal,2),l=new TextDecoder().decode(c.data.slice(0,o));if(e?.destroy?.(),a)throw new Error(l);return s.toPy(JSON.parse(l))}},k={imshow(t,e,i,o){const a=o.toJs?o.toJs():new Uint8Array(o);self.postMessage({type:"cv2.imshow",name:t,w:e,h:i,bytes:a},[a.buffer]),o.destroy?.()},imshowToken(t,e){self.postMessage({type:"cv2.imshowToken",name:t,token:e})},queueDraw(t,e){const i=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;self.postMessage({type:"cv2.queueDraw",token:t,op:i}),e?.destroy?.()},destroyWindow(t){r("cv2.destroyWindow",{name:t})},destroyAllWindows(){r("cv2.destroyAllWindows")},waitKey(t){return y?(Atomics.store(y.signal,0,0),Atomics.store(y.signal,1,-1),r("cv2.waitKey",{ms:t}),Atomics.wait(y.signal,0,0),Atomics.load(y.signal,1)):-1}},S={waitKey(t){return f?(Atomics.store(f.signal,0,0),Atomics.store(f.signal,1,-1),r("vkey.waitKey",{ms:t}),Atomics.wait(f.signal,0,0),Atomics.load(f.signal,1)):-1}},A={isConnected(){return n?(Atomics.store(n.signal,0,0),r("serialStatus"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,1)===1):!1},write(t){if(!n)return;const e=t.toJs?t.toJs():new Uint8Array(t);self.postMessage({type:"serialWrite",data:e}),t.destroy?.()},readByte(){return!n||(Atomics.store(n.signal,0,0),r("serialRead"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,2))?0:Atomics.load(n.signal,1)&255},available(){return n?(Atomics.store(n.signal,0,0),r("serialAvailable"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,1)):0}},B=`
import sys, types
import _kamiBridge

_serial = types.ModuleType('serial')

class _Serial:
    def __init__(self, port=None, baud=57600, timeout=None, **kwargs):
        if not _kamiBridge.isConnected():
            raise RuntimeError(
                "Hardware is not connected. Click the Connect button in the toolbar first."
            )

    def write(self, data):
        _kamiBridge.write(bytes(data))

    def flush(self):
        pass

    def read(self):
        return bytes([_kamiBridge.readByte()])

    def inWaiting(self):
        return _kamiBridge.available()

    @property
    def is_open(self):
        return True

    def close(self):
        pass

_serial.Serial = _Serial
sys.modules['serial'] = _serial

_termcolor = types.ModuleType('termcolor')

def _cprint(*args, **kwargs):
    # termcolor's cprint takes (text, color=..., ...). Print the message only.
    if args:
        print(args[0])

_termcolor.cprint = _cprint
sys.modules['termcolor'] = _termcolor

if '/lib' not in sys.path:
    sys.path.insert(0, '/lib')

# pibot.py rejects KamibotPi(port=None). Inject a placeholder so users can
# call KamibotPi() — the WebSerial port from the toolbar is the real backend.
import pibot as _pibot
_orig_init = _pibot.KamibotPi.__init__
def _patched_init(self, port=None, baud=57600, timeout=2, verbose=False):
    _orig_init(self, port or 'WEBSERIAL', baud, timeout, verbose)
_pibot.KamibotPi.__init__ = _patched_init

# pibot.close() ends with sys.exit(0), which surfaces as SystemExit in the
# browser. Swallow it so user scripts can finish normally.
_orig_close = _pibot.KamibotPi.close
def _patched_close(self):
    try:
        _orig_close(self)
    except SystemExit:
        pass
_pibot.KamibotPi.close = _patched_close
`;async function v(){s=await self.loadPyodide({indexURL:b}),s.setStdout({batched:e=>r("stdout",{text:e+`
`})}),s.setStderr({batched:e=>r("stderr",{text:e+`
`})}),s.setStdin({stdin:()=>{if(!d)return r("stderr",{text:`[input() unavailable: SharedArrayBuffer not configured]
`}),"";if(Atomics.store(d.signal,0,0),r("inputRequest",{}),Atomics.wait(d.signal,0,0)==="timed-out")return"";const i=Atomics.load(d.signal,1),o=d.data.slice(0,i);return new TextDecoder().decode(o)}});try{const i=await(await fetch(p("/lib/pibot.py"))).text();s.FS.mkdirTree("/lib"),s.FS.writeFile("/lib/pibot.py",i),s.registerJsModule("_kamiBridge",A),s.runPython(B)}catch(e){r("stderr",{text:`[KAMIBOT init failed] ${e.message||e}
`})}try{const i=await(await fetch(p("/lib/web_cv2.py"))).text();s.FS.writeFile("/lib/web_cv2.py",i),s.registerJsModule("_cv2Bridge",k)}catch(e){r("stderr",{text:`[web_cv2 init failed] ${e.message||e}
`})}try{const i=await(await fetch(p("/lib/VirtualKeyboard.py"))).text();s.FS.writeFile("/lib/VirtualKeyboard.py",i),s.registerJsModule("_vkeyBridge",S)}catch(e){r("stderr",{text:`[VirtualKeyboard init failed] ${e.message||e}
`})}try{s.registerJsModule("_mpBridge",w),s.FS.mkdirTree("/lib/mediapipe/solutions");const e=["/lib/mediapipe/__init__.py","/lib/mediapipe/_proto.py","/lib/mediapipe/solutions/__init__.py","/lib/mediapipe/solutions/_connections.py","/lib/mediapipe/solutions/hands.py","/lib/mediapipe/solutions/face_mesh.py","/lib/mediapipe/solutions/pose.py","/lib/mediapipe/solutions/drawing_utils.py","/lib/mediapipe/solutions/drawing_styles.py"];for(const i of e){const a=await(await fetch(p(i))).text();s.FS.writeFile(i,a)}}catch(e){r("stderr",{text:`[mediapipe stub init failed] ${e.message||e}
`})}try{s.FS.mkdirTree("/lib/helloai");const e=["/lib/helloai/__init__.py","/lib/helloai/image.py","/lib/helloai/result.py","/lib/helloai/_easyocr.py","/lib/helloai/hands_detector.py","/lib/helloai/face_detector.py","/lib/helloai/pose_detector.py","/lib/helloai/ocr.py","/lib/helloai/qr_reader.py","/lib/helloai/keyboard.py","/lib/helloai/tm_imageproject.py","/lib/helloai/hand_classifier.py","/lib/helloai/face_classifier.py","/lib/helloai/pose_classifier.py","/lib/helloai/image_classifier.py"];for(const i of e){const a=await(await fetch(p(i))).text();s.FS.writeFile(i,a)}}catch(e){r("stderr",{text:`[helloai port init failed] ${e.message||e}
`})}try{s.FS.mkdirTree("/lib/pycombb/bitblock");const e=["/lib/pycombb/__init__.py","/lib/pycombb/bitblock/__init__.py","/lib/pycombb/bitblock/bitblock.py","/lib/pycombb/bitblock/constants.py","/lib/pycombb/bitblock/utils.py"];for(const i of e){const o=await fetch(p(i));if(!o.ok)throw new Error(`${i} → HTTP ${o.status}`);const a=await o.text();s.FS.writeFile(i,a)}s.runPython(`
import sys, importlib
if '/lib/pycombb' not in sys.path:
    sys.path.insert(0, '/lib/pycombb')
importlib.invalidate_caches()
`)}catch(e){r("stderr",{text:`[pycombb init failed] ${e.message||e}
`})}try{s.runPython(`
import json as _json
def _check_syntax(src):
    try:
        compile(src, '<editor>', 'exec')
        return _json.dumps([])
    except SyntaxError as e:
        return _json.dumps([{
            'lineno': e.lineno or 1,
            'offset': e.offset or 1,
            'end_lineno': e.end_lineno or e.lineno or 1,
            'end_offset': e.end_offset or (e.offset or 1) + 1,
            'msg': e.msg or 'syntax error',
        }])
`)}catch(e){r("stderr",{text:`[syntax linter init failed] ${e.message||e}
`})}let t=[];try{const e=s.runPython(`
import sys, os, json as _json
mods = set(sys.stdlib_module_names) | set(sys.builtin_module_names)
mods |= {'serial', 'termcolor', 'bitblock'}
try:
    for entry in os.listdir('/lib'):
        if entry.startswith('_'):
            continue
        if entry.endswith('.py'):
            mods.add(entry[:-3])
        elif os.path.isdir('/lib/' + entry):
            mods.add(entry)
except FileNotFoundError:
    pass
_json.dumps(sorted(mods))
`);t=JSON.parse(e)}catch(e){r("stderr",{text:`[availableModules init failed] ${e.message||e}
`})}r("ready",{pythonVersion:s.runPython("import sys; sys.version.split()[0]"),availableModules:t})}function x(t){const e=s.FS;try{const o=e.readdir("/work").filter(a=>a!=="."&&a!=="..");for(const a of o){const l=`/work/${a}`;try{const m=e.stat(l);e.isDir(m.mode)?e.rmdir(l):e.unlink(l)}catch{}}}catch{e.mkdir("/work")}const i=new Set;for(const o of Object.keys(t)){const a=o.split("/");a.pop();let l="";for(const m of a)l=l?`${l}/${m}`:m,i.add(l)}for(const o of[...i].sort()){const a=`/work/${o}`;try{e.mkdir(a)}catch{}}for(const[o,a]of Object.entries(t))e.writeFile(`/work/${o}`,a??"")}async function g(){u||(await s.loadPackage("micropip"),u=!0)}async function F(t){try{await g()}catch(i){r("installProgress",{package:"(micropip)",status:"fail",error:String(i.message||i)}),r("installDone",{});return}const e=s.pyimport("micropip");for(const i of t){r("installProgress",{package:i,status:"start"});try{await e.install(i),r("installProgress",{package:i,status:"ok"})}catch(o){r("installProgress",{package:i,status:"fail",error:String(o.message||o)})}}e.destroy?.(),r("installDone",{})}async function M(){try{await g();const t=s.pyimport("micropip"),e=t.list(),i=String(e);e.destroy?.(),t.destroy?.(),r("listResult",{text:i})}catch(t){r("listResult",{text:"",error:String(t.message||t)})}}const R=/^\s*(?:import|from)\s+(?:web_cv2|helloai)\b/m;async function E({entryPath:t,files:e}){const i=performance.now();try{x(e),s.runPython(`
import sys, os
os.chdir('/work')
entry_dir = os.path.dirname('${t}') or '.'
if entry_dir not in sys.path:
    sys.path.insert(0, entry_dir)
`);const o=e[t]??"";await s.loadPackagesFromImports(o),R.test(o)&&await s.loadPackage("numpy"),await s.runPythonAsync(o),r("done",{exitCode:0,durationMs:Math.round(performance.now()-i)})}catch(o){r("stderr",{text:String(o.message||o)+`
`}),r("done",{exitCode:1,durationMs:Math.round(performance.now()-i)})}}self.onmessage=async t=>{const e=t.data;e.type==="init"?(_=e.assetBase||self.location.origin+"/",d=e.inputBuffer?{signal:new Int32Array(e.inputBuffer.signal),data:new Uint8Array(e.inputBuffer.data)}:null,n=e.serialBuffer?{signal:new Int32Array(e.serialBuffer.signal)}:null,y=e.waitKeyBuffer?{signal:new Int32Array(e.waitKeyBuffer.signal)}:null,f=e.vkeyBuffer?{signal:new Int32Array(e.vkeyBuffer.signal)}:null,c=e.mpBuffer?{signal:new Int32Array(e.mpBuffer.signal),data:new Uint8Array(e.mpBuffer.data)}:null,await v()):e.type==="run"?await E(e):e.type==="install"?await F(e.packages||[]):e.type==="list"?await M():e.type==="syntaxCheck"&&j(e.code,e.requestId)};function j(t,e){if(!s){r("syntaxResult",{requestId:e,errors:[]});return}try{s.globals.set("_lint_src",t??"");const i=s.runPython("_check_syntax(_lint_src)");s.globals.delete("_lint_src"),r("syntaxResult",{requestId:e,errors:JSON.parse(i)})}catch{r("syntaxResult",{requestId:e,errors:[]})}}
