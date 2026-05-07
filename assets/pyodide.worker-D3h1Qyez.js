const b="0.27.0",u=`https://cdn.jsdelivr.net/pyodide/v${b}/full/`;let _="";const y=t=>new URL(`${_}${t}`,self.location.origin);let i=null,p=null,n=null,d=null,c=null,m=!1;self.importScripts(u+"pyodide.js");function r(t,e={}){self.postMessage({type:t,...e})}const h={call(t,e){if(!c)throw new Error("mp bridge not initialized (SharedArrayBuffer required)");const s=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;Atomics.store(c.signal,0,0),self.postMessage({type:"mp",method:t,args:s}),Atomics.wait(c.signal,0,0);const o=Atomics.load(c.signal,1),a=Atomics.load(c.signal,2),l=new TextDecoder().decode(c.data.slice(0,o));if(e?.destroy?.(),a)throw new Error(l);return i.toPy(JSON.parse(l))}},w={imshow(t,e,s,o){const a=o.toJs?o.toJs():new Uint8Array(o);self.postMessage({type:"cv2.imshow",name:t,w:e,h:s,bytes:a},[a.buffer]),o.destroy?.()},imshowToken(t,e){self.postMessage({type:"cv2.imshowToken",name:t,token:e})},queueDraw(t,e){const s=e?.toJs?e.toJs({dict_converter:Object.fromEntries}):e;self.postMessage({type:"cv2.queueDraw",token:t,op:s}),e?.destroy?.()},destroyWindow(t){r("cv2.destroyWindow",{name:t})},destroyAllWindows(){r("cv2.destroyAllWindows")},waitKey(t){return d?(Atomics.store(d.signal,0,0),Atomics.store(d.signal,1,-1),r("cv2.waitKey",{ms:t}),Atomics.wait(d.signal,0,0),Atomics.load(d.signal,1)):-1}},k={isConnected(){return n?(Atomics.store(n.signal,0,0),r("serialStatus"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,1)===1):!1},write(t){if(!n)return;const e=t.toJs?t.toJs():new Uint8Array(t);self.postMessage({type:"serialWrite",data:e}),t.destroy?.()},readByte(){return!n||(Atomics.store(n.signal,0,0),r("serialRead"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,2))?0:Atomics.load(n.signal,1)&255},available(){return n?(Atomics.store(n.signal,0,0),r("serialAvailable"),Atomics.wait(n.signal,0,0),Atomics.load(n.signal,1)):0}},S=`
import sys, types
import _kamiBridge

_serial = types.ModuleType('serial')

class _Serial:
    def __init__(self, port=None, baud=57600, timeout=None, **kwargs):
        if not _kamiBridge.isConnected():
            raise RuntimeError(
                "KamibotPi is not connected. Click the Connect button in the toolbar first."
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
`;async function A(){i=await self.loadPyodide({indexURL:u}),i.setStdout({batched:e=>r("stdout",{text:e+`
`})}),i.setStderr({batched:e=>r("stderr",{text:e+`
`})}),i.setStdin({stdin:()=>{if(!p)return r("stderr",{text:`[input() unavailable: SharedArrayBuffer not configured]
`}),"";if(Atomics.store(p.signal,0,0),r("inputRequest",{}),Atomics.wait(p.signal,0,0)==="timed-out")return"";const s=Atomics.load(p.signal,1),o=p.data.slice(0,s);return new TextDecoder().decode(o)}});try{const s=await(await fetch(y("/lib/pibot.py"))).text();i.FS.mkdirTree("/lib"),i.FS.writeFile("/lib/pibot.py",s),i.registerJsModule("_kamiBridge",k),i.runPython(S)}catch(e){r("stderr",{text:`[KAMIBOT init failed] ${e.message||e}
`})}try{const s=await(await fetch(y("/lib/web_cv2.py"))).text();i.FS.writeFile("/lib/web_cv2.py",s),i.registerJsModule("_cv2Bridge",w)}catch(e){r("stderr",{text:`[web_cv2 init failed] ${e.message||e}
`})}try{i.registerJsModule("_mpBridge",h),i.FS.mkdirTree("/lib/mediapipe/solutions");const e=["/lib/mediapipe/__init__.py","/lib/mediapipe/_proto.py","/lib/mediapipe/solutions/__init__.py","/lib/mediapipe/solutions/_connections.py","/lib/mediapipe/solutions/hands.py","/lib/mediapipe/solutions/face_mesh.py","/lib/mediapipe/solutions/pose.py","/lib/mediapipe/solutions/drawing_utils.py","/lib/mediapipe/solutions/drawing_styles.py"];for(const s of e){const a=await(await fetch(y(s))).text();i.FS.writeFile(s,a)}}catch(e){r("stderr",{text:`[mediapipe stub init failed] ${e.message||e}
`})}try{i.FS.mkdirTree("/lib/helloai");const e=["/lib/helloai/__init__.py","/lib/helloai/image.py","/lib/helloai/result.py","/lib/helloai/_easyocr.py","/lib/helloai/hands_detector.py","/lib/helloai/face_detector.py","/lib/helloai/pose_detector.py","/lib/helloai/ocr.py","/lib/helloai/qr_reader.py","/lib/helloai/keyboard.py","/lib/helloai/tm_imageproject.py","/lib/helloai/hand_classifier.py","/lib/helloai/face_classifier.py","/lib/helloai/pose_classifier.py","/lib/helloai/image_classifier.py"];for(const s of e){const a=await(await fetch(y(s))).text();i.FS.writeFile(s,a)}}catch(e){r("stderr",{text:`[helloai port init failed] ${e.message||e}
`})}try{i.runPython(`
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
`})}let t=[];try{const e=i.runPython(`
import sys, os, json as _json
mods = set(sys.stdlib_module_names) | set(sys.builtin_module_names)
mods |= {'serial', 'termcolor'}
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
`})}r("ready",{pythonVersion:i.runPython("import sys; sys.version.split()[0]"),availableModules:t})}function B(t){const e=i.FS;try{const o=e.readdir("/work").filter(a=>a!=="."&&a!=="..");for(const a of o){const l=`/work/${a}`;try{const f=e.stat(l);e.isDir(f.mode)?e.rmdir(l):e.unlink(l)}catch{}}}catch{e.mkdir("/work")}const s=new Set;for(const o of Object.keys(t)){const a=o.split("/");a.pop();let l="";for(const f of a)l=l?`${l}/${f}`:f,s.add(l)}for(const o of[...s].sort()){const a=`/work/${o}`;try{e.mkdir(a)}catch{}}for(const[o,a]of Object.entries(t))e.writeFile(`/work/${o}`,a??"")}async function g(){m||(await i.loadPackage("micropip"),m=!0)}async function x(t){try{await g()}catch(s){r("installProgress",{package:"(micropip)",status:"fail",error:String(s.message||s)}),r("installDone",{});return}const e=i.pyimport("micropip");for(const s of t){r("installProgress",{package:s,status:"start"});try{await e.install(s),r("installProgress",{package:s,status:"ok"})}catch(o){r("installProgress",{package:s,status:"fail",error:String(o.message||o)})}}e.destroy?.(),r("installDone",{})}async function v(){try{await g();const t=i.pyimport("micropip"),e=t.list(),s=String(e);e.destroy?.(),t.destroy?.(),r("listResult",{text:s})}catch(t){r("listResult",{text:"",error:String(t.message||t)})}}const F=/^\s*(?:import|from)\s+(?:web_cv2|helloai)\b/m;async function M({entryPath:t,files:e}){const s=performance.now();try{B(e),i.runPython(`
import sys, os
os.chdir('/work')
entry_dir = os.path.dirname('${t}') or '.'
if entry_dir not in sys.path:
    sys.path.insert(0, entry_dir)
`);const o=e[t]??"";await i.loadPackagesFromImports(o),F.test(o)&&await i.loadPackage("numpy"),await i.runPythonAsync(o),r("done",{exitCode:0,durationMs:Math.round(performance.now()-s)})}catch(o){r("stderr",{text:String(o.message||o)+`
`}),r("done",{exitCode:1,durationMs:Math.round(performance.now()-s)})}}self.onmessage=async t=>{const e=t.data;e.type==="init"?(_=(e.assetBase||"/").replace(/\/$/,""),p=e.inputBuffer?{signal:new Int32Array(e.inputBuffer.signal),data:new Uint8Array(e.inputBuffer.data)}:null,n=e.serialBuffer?{signal:new Int32Array(e.serialBuffer.signal)}:null,d=e.waitKeyBuffer?{signal:new Int32Array(e.waitKeyBuffer.signal)}:null,c=e.mpBuffer?{signal:new Int32Array(e.mpBuffer.signal),data:new Uint8Array(e.mpBuffer.data)}:null,await A()):e.type==="run"?await M(e):e.type==="install"?await x(e.packages||[]):e.type==="list"?await v():e.type==="syntaxCheck"&&j(e.code,e.requestId)};function j(t,e){if(!i){r("syntaxResult",{requestId:e,errors:[]});return}try{i.globals.set("_lint_src",t??"");const s=i.runPython("_check_syntax(_lint_src)");i.globals.delete("_lint_src"),r("syntaxResult",{requestId:e,errors:JSON.parse(s)})}catch{r("syntaxResult",{requestId:e,errors:[]})}}
