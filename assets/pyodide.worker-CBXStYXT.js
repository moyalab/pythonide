const g="0.27.0",u=`https://cdn.jsdelivr.net/pyodide/v${g}/full/`;let b="";const y=t=>new URL(String(t).replace(/^\//,""),b);let s=null,p=null,a=null,d=null,c=null,m=!1;self.importScripts(u+"pyodide.js");function o(t,e={}){self.postMessage({type:t,...e})}const h={call(t,e){if(!c)throw new Error("mp bridge not initialized (SharedArrayBuffer required)");const i=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;Atomics.store(c.signal,0,0),self.postMessage({type:"mp",method:t,args:i}),Atomics.wait(c.signal,0,0);const r=Atomics.load(c.signal,1),n=Atomics.load(c.signal,2),l=new TextDecoder().decode(c.data.slice(0,r));if(e?.destroy?.(),n)throw new Error(l);return s.toPy(JSON.parse(l))}},w={imshow(t,e,i,r){const n=r.toJs?r.toJs():new Uint8Array(r);self.postMessage({type:"cv2.imshow",name:t,w:e,h:i,bytes:n},[n.buffer]),r.destroy?.()},imshowToken(t,e){self.postMessage({type:"cv2.imshowToken",name:t,token:e})},queueDraw(t,e){const i=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;self.postMessage({type:"cv2.queueDraw",token:t,op:i}),e?.destroy?.()},destroyWindow(t){o("cv2.destroyWindow",{name:t})},destroyAllWindows(){o("cv2.destroyAllWindows")},waitKey(t){return d?(Atomics.store(d.signal,0,0),Atomics.store(d.signal,1,-1),o("cv2.waitKey",{ms:t}),Atomics.wait(d.signal,0,0),Atomics.load(d.signal,1)):-1}},k={isConnected(){return a?(Atomics.store(a.signal,0,0),o("serialStatus"),Atomics.wait(a.signal,0,0),Atomics.load(a.signal,1)===1):!1},write(t){if(!a)return;const e=t.toJs?t.toJs():new Uint8Array(t);self.postMessage({type:"serialWrite",data:e}),t.destroy?.()},readByte(){return!a||(Atomics.store(a.signal,0,0),o("serialRead"),Atomics.wait(a.signal,0,0),Atomics.load(a.signal,2))?0:Atomics.load(a.signal,1)&255},available(){return a?(Atomics.store(a.signal,0,0),o("serialAvailable"),Atomics.wait(a.signal,0,0),Atomics.load(a.signal,1)):0}},S=`
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
`;async function A(){s=await self.loadPyodide({indexURL:u}),s.setStdout({batched:e=>o("stdout",{text:e+`
`})}),s.setStderr({batched:e=>o("stderr",{text:e+`
`})}),s.setStdin({stdin:()=>{if(!p)return o("stderr",{text:`[input() unavailable: SharedArrayBuffer not configured]
`}),"";if(Atomics.store(p.signal,0,0),o("inputRequest",{}),Atomics.wait(p.signal,0,0)==="timed-out")return"";const i=Atomics.load(p.signal,1),r=p.data.slice(0,i);return new TextDecoder().decode(r)}});try{const i=await(await fetch(y("/lib/pibot.py"))).text();s.FS.mkdirTree("/lib"),s.FS.writeFile("/lib/pibot.py",i),s.registerJsModule("_kamiBridge",k),s.runPython(S)}catch(e){o("stderr",{text:`[KAMIBOT init failed] ${e.message||e}
`})}try{const i=await(await fetch(y("/lib/web_cv2.py"))).text();s.FS.writeFile("/lib/web_cv2.py",i),s.registerJsModule("_cv2Bridge",w)}catch(e){o("stderr",{text:`[web_cv2 init failed] ${e.message||e}
`})}try{s.registerJsModule("_mpBridge",h),s.FS.mkdirTree("/lib/mediapipe/solutions");const e=["/lib/mediapipe/__init__.py","/lib/mediapipe/_proto.py","/lib/mediapipe/solutions/__init__.py","/lib/mediapipe/solutions/_connections.py","/lib/mediapipe/solutions/hands.py","/lib/mediapipe/solutions/face_mesh.py","/lib/mediapipe/solutions/pose.py","/lib/mediapipe/solutions/drawing_utils.py","/lib/mediapipe/solutions/drawing_styles.py"];for(const i of e){const n=await(await fetch(y(i))).text();s.FS.writeFile(i,n)}}catch(e){o("stderr",{text:`[mediapipe stub init failed] ${e.message||e}
`})}try{s.FS.mkdirTree("/lib/helloai");const e=["/lib/helloai/__init__.py","/lib/helloai/image.py","/lib/helloai/result.py","/lib/helloai/_easyocr.py","/lib/helloai/hands_detector.py","/lib/helloai/face_detector.py","/lib/helloai/pose_detector.py","/lib/helloai/ocr.py","/lib/helloai/qr_reader.py","/lib/helloai/keyboard.py","/lib/helloai/tm_imageproject.py","/lib/helloai/hand_classifier.py","/lib/helloai/face_classifier.py","/lib/helloai/pose_classifier.py","/lib/helloai/image_classifier.py"];for(const i of e){const n=await(await fetch(y(i))).text();s.FS.writeFile(i,n)}}catch(e){o("stderr",{text:`[helloai port init failed] ${e.message||e}
`})}try{s.FS.mkdirTree("/lib/pycombb/bitblock");const e=["/lib/pycombb/__init__.py","/lib/pycombb/bitblock/__init__.py","/lib/pycombb/bitblock/bitblock.py","/lib/pycombb/bitblock/constants.py","/lib/pycombb/bitblock/utils.py"];for(const i of e){const r=await fetch(y(i));if(!r.ok)throw new Error(`${i} → HTTP ${r.status}`);const n=await r.text();s.FS.writeFile(i,n)}s.runPython(`
import sys, importlib
if '/lib/pycombb' not in sys.path:
    sys.path.insert(0, '/lib/pycombb')
importlib.invalidate_caches()
`)}catch(e){o("stderr",{text:`[pycombb init failed] ${e.message||e}
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
`)}catch(e){o("stderr",{text:`[syntax linter init failed] ${e.message||e}
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
`);t=JSON.parse(e)}catch(e){o("stderr",{text:`[availableModules init failed] ${e.message||e}
`})}o("ready",{pythonVersion:s.runPython("import sys; sys.version.split()[0]"),availableModules:t})}function B(t){const e=s.FS;try{const r=e.readdir("/work").filter(n=>n!=="."&&n!=="..");for(const n of r){const l=`/work/${n}`;try{const f=e.stat(l);e.isDir(f.mode)?e.rmdir(l):e.unlink(l)}catch{}}}catch{e.mkdir("/work")}const i=new Set;for(const r of Object.keys(t)){const n=r.split("/");n.pop();let l="";for(const f of n)l=l?`${l}/${f}`:f,i.add(l)}for(const r of[...i].sort()){const n=`/work/${r}`;try{e.mkdir(n)}catch{}}for(const[r,n]of Object.entries(t))e.writeFile(`/work/${r}`,n??"")}async function _(){m||(await s.loadPackage("micropip"),m=!0)}async function x(t){try{await _()}catch(i){o("installProgress",{package:"(micropip)",status:"fail",error:String(i.message||i)}),o("installDone",{});return}const e=s.pyimport("micropip");for(const i of t){o("installProgress",{package:i,status:"start"});try{await e.install(i),o("installProgress",{package:i,status:"ok"})}catch(r){o("installProgress",{package:i,status:"fail",error:String(r.message||r)})}}e.destroy?.(),o("installDone",{})}async function v(){try{await _();const t=s.pyimport("micropip"),e=t.list(),i=String(e);e.destroy?.(),t.destroy?.(),o("listResult",{text:i})}catch(t){o("listResult",{text:"",error:String(t.message||t)})}}const F=/^\s*(?:import|from)\s+(?:web_cv2|helloai)\b/m;async function M({entryPath:t,files:e}){const i=performance.now();try{B(e),s.runPython(`
import sys, os
os.chdir('/work')
entry_dir = os.path.dirname('${t}') or '.'
if entry_dir not in sys.path:
    sys.path.insert(0, entry_dir)
`);const r=e[t]??"";await s.loadPackagesFromImports(r),F.test(r)&&await s.loadPackage("numpy"),await s.runPythonAsync(r),o("done",{exitCode:0,durationMs:Math.round(performance.now()-i)})}catch(r){o("stderr",{text:String(r.message||r)+`
`}),o("done",{exitCode:1,durationMs:Math.round(performance.now()-i)})}}self.onmessage=async t=>{const e=t.data;e.type==="init"?(b=e.assetBase||self.location.origin+"/",p=e.inputBuffer?{signal:new Int32Array(e.inputBuffer.signal),data:new Uint8Array(e.inputBuffer.data)}:null,a=e.serialBuffer?{signal:new Int32Array(e.serialBuffer.signal)}:null,d=e.waitKeyBuffer?{signal:new Int32Array(e.waitKeyBuffer.signal)}:null,c=e.mpBuffer?{signal:new Int32Array(e.mpBuffer.signal),data:new Uint8Array(e.mpBuffer.data)}:null,await A()):e.type==="run"?await M(e):e.type==="install"?await x(e.packages||[]):e.type==="list"?await v():e.type==="syntaxCheck"&&E(e.code,e.requestId)};function E(t,e){if(!s){o("syntaxResult",{requestId:e,errors:[]});return}try{s.globals.set("_lint_src",t??"");const i=s.runPython("_check_syntax(_lint_src)");s.globals.delete("_lint_src"),o("syntaxResult",{requestId:e,errors:JSON.parse(i)})}catch{o("syntaxResult",{requestId:e,errors:[]})}}
