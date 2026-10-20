/**
 * Offline L2 guard probe: run the generated guard payload under a fake `bpy`
 * module and check that out-of-task writes and save operators are refused.
 *
 * This does not need Blender; it uses Blender's bundled Python if present.
 * A PASS here proves the Python plumbing, not the real Blender behavior.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'
import { wrapWithGuard } from '../lib/guardPayload.js'
import { findPython } from './findPython.js'

const DRIVER = `import builtins, json, sys, types, traceback

root = sys.argv[1]
payload_path = sys.argv[2]
out_path = sys.argv[3]

class _OpsStub:
    def __init__(self):
        self._op_create_function = self._create
    def _create(self, module, func):
        def op(*args, **kwargs):
            return None
        return op

bpy = types.ModuleType('bpy')
ops = _OpsStub()
ops.ed = types.SimpleNamespace(undo_push=lambda *args, **kwargs: None)
ops.wm = types.SimpleNamespace()
bpy.ops = ops
bpy.data = types.SimpleNamespace(filepath='', is_dirty=False)
bpy.data.libraries = types.SimpleNamespace(write=lambda *a, **k: None)
prefs = types.SimpleNamespace(
    edit=types.SimpleNamespace(undo_steps=32, undo_memory_limit=0, use_global_undo=True),
    filepaths=types.SimpleNamespace(use_auto_save_temporary_files=True, auto_save_time=10, save_version=2),
)
bpy.context = types.SimpleNamespace(scene=types.SimpleNamespace(render=types.SimpleNamespace(filepath='')), preferences=prefs)
sys.modules['bpy'] = bpy

with open(payload_path, 'r', encoding='utf-8') as fh:
    code = fh.read()

ns = {}
try:
    exec(compile(code, payload_path, 'exec'), ns)
    result = ns.get('result', {})
except BaseException as exc:
    result = {'status': 'crash', 'error': repr(exc), 'traceback': traceback.format_exc()}
if not isinstance(result, dict):
    result = {'status': 'crash', 'error': 'payload returned a non-dict result'}
state_mod = sys.modules.get('dsh_blender_mcp_guard')
result['driverState'] = {
    'openHooked': bool(getattr(builtins.open, '__dsh_guard__', False)),
    'hooks': len(getattr(state_mod, 'hooks', [])) if state_mod is not None else 0,
    'installedRoot': getattr(state_mod, 'installed_root', None) if state_mod is not None else None,
}
with open(out_path, 'w', encoding='utf-8') as fh:
    json.dump(result, fh)
`

const python = findPython()
if (python === null) {
  console.log('SKIP no Python interpreter found')
  process.exit(0)
}
console.log(`interpreter ${python}`)

const workDir = mkdtempSync(path.join(tmpdir(), 'dsh-guard-probe-'))
const taskDir = path.join(workDir, '.dsh-blender-probe')
const outsideWrite = path.join(homedir(), '.dsh-guard-probe-outside.txt')
const outsideCopySource = path.join(homedir(), '.dsh-guard-probe-copy-src.txt')
writeFileSync(outsideCopySource, 'copy-source', 'utf8')
mkdirSync(taskDir, { recursive: true })
const driverPath = path.join(workDir, 'driver.py')
writeFileSync(driverPath, DRIVER, 'utf8')

/** @typedef {object} Case
 * @property {string} name
 * @property {string} code
 * @property {(result: Record<string, any>) => string[]} check
 */

/** @type {Case[]} */
const cases = [
  {
    name: 'outside write is blocked',
    code: `open(${JSON.stringify(outsideWrite)}, 'w')`,
    check: (result) => {
      const blocked = result.guard?.blocked ?? []
      if (result.status !== 'error') return ['expected status error']
      if (blocked.length === 0) return ['expected blocked evidence']
      if (!String(blocked[0].target).includes('.dsh-guard-probe-outside.txt')) return ['wrong blocked target']
      if (!String(blocked[0].resolved).includes('.dsh-guard-probe-outside.txt')) return ['wrong resolved path']
      if (!String(result.error?.message).includes('resolved:')) return ['message lacks resolved path']
      try { unlinkSync(outsideWrite) } catch {}
      return []
    },
  },
  {
    name: 'inside write is allowed',
    code: `open(${JSON.stringify(path.join(taskDir, 'inside.txt'))}, 'w').write('x')`,
    check: (result) => {
      if (result.status !== 'ok') return [`expected ok, got ${String(result.status)}`]
      if (!existsSync(path.join(taskDir, 'inside.txt'))) return ['inside file missing']
      return []
    },
  },
  {
    name: 'copy from outside into the task directory is allowed',
    code: `import shutil
shutil.copy(${JSON.stringify(outsideCopySource)}, ${JSON.stringify(path.join(taskDir, 'copied.txt'))})`,
    check: (result) => {
      if (result.status !== 'ok') return [`expected ok, got ${String(result.status)}`]
      if (!existsSync(path.join(taskDir, 'copied.txt'))) return ['copied file missing']
      try { unlinkSync(outsideCopySource) } catch {}
      return []
    },
  },
  {
    name: 'os.link outside the task directory is blocked',
    code: `import os
os.link(${JSON.stringify(path.join(taskDir, 'inside.txt'))}, ${JSON.stringify(path.join(homedir(), '.dsh-guard-probe-link.txt'))})`,
    check: (result) => {
      if (result.status !== 'error') return ['expected status error']
      if (!Array.isArray(result.guard?.blocked) || result.guard.blocked.length === 0) return ['expected blocked evidence']
      try { unlinkSync(path.join(homedir(), '.dsh-guard-probe-link.txt')) } catch {}
      return []
    },
  },
  {
    name: 'io.FileIO outside is blocked',
    code: `import io
io.FileIO(${JSON.stringify(outsideWrite)}, 'w')`,
    check: (result) => {
      if (result.status !== 'error') return ['expected status error']
      if (!Array.isArray(result.guard?.blocked) || result.guard.blocked.length === 0) return ['expected blocked evidence']
      try { unlinkSync(outsideWrite) } catch {}
      return []
    },
  },
  {
    name: 'render without write_still is allowed',
    code: 'bpy.ops.render.render(write_still=False)',
    check: (result) => (result.status === 'ok' ? [] : [`expected ok, got ${String(result.status)}`]),
  },
  {
    name: 'blocked evidence keeps a total',
    code: `for _ in range(60):
    try:
        open(${JSON.stringify(outsideWrite)}, 'w')
    except Exception:
        pass`,
    check: (result) => {
      const blocked = result.guard?.blocked ?? []
      if (blocked.length !== 50) return [`expected 50 capped entries, got ${String(blocked.length)}`]
      if (result.guard?.blockedTotal !== 60) return [`expected blockedTotal 60, got ${String(result.guard?.blockedTotal)}`]
      try { unlinkSync(outsideWrite) } catch {}
      return []
    },
  },
  {
    name: 'save operator is blocked',
    code: 'bpy.ops.wm.save_mainfile()',
    check: (result) => {
      const blocked = result.guard?.blocked ?? []
      if (result.status !== 'error') return ['expected status error']
      if (blocked.length === 0) return ['expected blocked evidence']
      if (blocked[0].kind !== 'operator') return ['expected operator evidence']
      return []
    },
  },
  {
    name: 'real ops handle is not exposed',
    code: 'bpy.ops._dsh_real.wm.save_mainfile()',
    check: (result) => (result.status === 'error' ? [] : ['expected status error']),
  },
  {
    name: 'operator factory is not exposed',
    code: "bpy.ops._op_create_function('wm', 'save_mainfile')()",
    check: (result) => (result.status === 'error' ? [] : ['expected status error']),
  },
  {
    name: 'normal operators still work through the proxy',
    code: 'bpy.ops.mesh.primitive_cube_add()',
    check: (result) => (result.status === 'ok' ? [] : [`expected ok, got ${String(result.status)}`]),
  },
  {
    name: 'image.save_as outside is blocked',
    code: `bpy.ops.image.save_as(filepath=${JSON.stringify(path.join(workDir, 'outside.png'))})`,
    check: (result) => {
      const blocked = result.guard?.blocked ?? []
      if (result.status !== 'error') return ['expected status error']
      if (blocked.length === 0 || blocked[0].kind !== 'write') return ['expected write evidence']
      if (!String(blocked[0].target).includes('outside.png')) return ['wrong target']
      return []
    },
  },
  {
    name: 'image.save_as inside is allowed',
    code: `bpy.ops.image.save_as(filepath=${JSON.stringify(path.join(taskDir, 'inside.png'))})`,
    check: (result) => (result.status === 'ok' ? [] : [`expected ok, got ${String(result.status)}`]),
  },
  {
    name: 'image.save without filepath is blocked',
    code: 'bpy.ops.image.save()',
    check: (result) => (result.status === 'error' ? [] : ['expected status error']),
  },
  {
    name: 'screen.screenshot outside is blocked',
    code: `bpy.ops.screen.screenshot(filepath=${JSON.stringify(path.join(workDir, 'shot.png'))})`,
    check: (result) => {
      const blocked = result.guard?.blocked ?? []
      if (result.status !== 'error') return ['expected status error']
      if (blocked.length === 0) return ['expected blocked evidence']
      return []
    },
  },
  {
    name: 'tempfile is allowed inside the OS temp root',
    code: "import os, tempfile\nfd, tmp = tempfile.mkstemp()\nos.close(fd)\nos.remove(tmp)\nresult = {'ok': True}",
    check: (result) => (result.status === 'ok' ? [] : [`expected ok, got ${String(result.status)}`]),
  },
  {
    name: 'deleting bpy.ops still uninstalls the guard',
    code: 'del bpy.ops',
    check: (result) => {
      if (result.driverState?.openHooked === true) return ['guard hooks left installed']
      if (result.guard?.verified !== false) return ['expected verified false']
      return []
    },
  },
  {
    name: 'clearing _D.hooks still uninstalls the guard',
    code: "import sys\nsys.modules['dsh_blender_mcp_guard'].hooks = []",
    check: (result) => {
      if (result.driverState?.openHooked === true) return ['guard hooks left installed']
      return []
    },
  },
  {
    name: 'preference changes are restored and reported',
    code: 'bpy.context.preferences.edit.undo_steps = 99',
    check: (result) => {
      const changed = result.guard?.preferencesChanged ?? []
      if (!Array.isArray(changed) || !changed.includes('edit.undo_steps')) return ['expected preferencesChanged']
      if ((result.guard?.blocked ?? []).length === 0) return ['expected blocked evidence']
      return []
    },
  },
  {
    name: 'ed.undo is blocked',
    code: 'bpy.ops.ed.undo()',
    check: (result) => (result.status === 'error' ? [] : ['expected status error']),
  },
]

let failed = false
for (const item of cases) {
  const payloadPath = path.join(workDir, `payload-${cases.indexOf(item)}.py`)
  const outPath = path.join(workDir, `out-${cases.indexOf(item)}.json`)
  writeFileSync(
    payloadPath,
    wrapWithGuard(item.code, { taskRoot: taskDir, undoMessage: 'dsh-blender: probe' }),
    'utf8',
  )
  const run = spawnSync(python, [driverPath, taskDir, payloadPath, outPath], { stdio: 'inherit' })
  if (run.status !== 0 || !existsSync(outPath)) {
    failed = true
    console.log(`FAIL ${item.name} (driver exit ${String(run.status)})`)
    continue
  }
  const result = JSON.parse(readFileSync(outPath, 'utf8'))
  const problems = item.check(result)
  if (problems.length > 0) {
    failed = true
    console.log(`FAIL ${item.name}: ${problems.join('; ')}`)
  } else if (result.undo?.pushed !== true) {
    failed = true
    console.log(`FAIL ${item.name}: undo step was not pushed`)
  } else {
    console.log(`PASS ${item.name}`)
  }
}

if (existsSync(path.join(taskDir, 'inside.txt'))) {
  // The probe's own artifacts live under the temp dir; nothing to clean inside the repo.
}
process.exit(failed ? 1 : 0)