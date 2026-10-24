/**
 * Run the generated read-only payload against a fake `bpy` module.
 *
 * This is the only test that executes the fingerprint Python: it proves that a
 * read-only call with no change skips the undo step, while a detected change or
 * a broken check still pushes one. It needs a local Python 3.10+ interpreter
 * and is skipped when none is found.
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { wrapWithGuard } from '../lib/guardPayload.js'
import { resolvePython } from '../lib/pythonRuntime.js'

/** Minimal fake Blender with enough state for the guard and the fingerprint. */
const DRIVER = `import json
import sys
import types
import traceback

root = sys.argv[1]
payload_path = sys.argv[2]
out_path = sys.argv[3]


class _FakeMesh:
    def __init__(self):
        self.name = 'FakeMesh'
        self.vertices = [None, None, None]
        self.polygons = [None]
        self.materials = []


class _FakeObject:
    def __init__(self, name):
        self.name = name
        self.type = 'MESH'
        self.parent = None
        self.data = _FakeMesh()
        self.location = (0.0, 0.0, 0.0)
        self.rotation_mode = 'XYZ'
        self.rotation_euler = (0.0, 0.0, 0.0)
        self.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
        self.scale = (1.0, 1.0, 1.0)
        self.hide_viewport = False
        self.hide_render = False
        self.modifiers = []


class _OpsStub:
    def __init__(self):
        self._op_create_function = self._create
        self.ed = types.SimpleNamespace(undo_push=lambda *args, **kwargs: None)
        self.wm = types.SimpleNamespace()

    def _create(self, module, func):
        def op(*args, **kwargs):
            return None
        return op


bpy = types.ModuleType('bpy')
bpy.ops = _OpsStub()
bpy.data = types.SimpleNamespace(
    objects=[_FakeObject('Cube')],
    meshes=[],
    materials=[],
    lights=[],
    cameras=[],
    collections=[],
    images=[],
    node_groups=[],
    worlds=[],
    scenes=[],
    texts=[],
    curves=[],
    armatures=[],
    actions=[],
    grease_pencils=[],
    volumes=[],
    pointclouds=[],
    is_dirty=False,
    libraries=types.SimpleNamespace(write=lambda *args, **kwargs: None),
)
prefs = types.SimpleNamespace(
    edit=types.SimpleNamespace(undo_steps=32, undo_memory_limit=0, use_global_undo=True),
    filepaths=types.SimpleNamespace(use_auto_save_temporary_files=True, auto_save_time=10, save_version=2),
)
scene = types.SimpleNamespace(
    name='Scene',
    frame_current=1,
    frame_start=1,
    frame_end=250,
    camera=None,
    world=None,
    render=types.SimpleNamespace(
        resolution_x=1920,
        resolution_y=1080,
        resolution_percentage=100,
        engine='BLENDER_EEVEE',
        filepath='',
    ),
)
bpy.context = types.SimpleNamespace(
    scene=scene,
    mode='OBJECT',
    active_object=None,
    selected_objects=[],
    view_layer=types.SimpleNamespace(name='View Layer'),
    preferences=prefs,
)
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
with open(out_path, 'w', encoding='utf-8') as fh:
    json.dump(result, fh, default=str)
`

/** Payload counter so each run gets its own files. */
let payloadSeq = 0

/**
 * @returns {Promise<import('../lib/pythonRuntime.js').PythonRuntime | null>} interpreter or null
 */
async function findTestPython() {
  try {
    return await resolvePython({ analysisPython: '', autoDetectPython: true })
  } catch {
    return null
  }
}

/**
 * @param {import('../lib/pythonRuntime.js').PythonRuntime} python - interpreter
 * @param {string} workDir - directory with the driver
 * @param {string} code - user Python
 * @param {{ readOnly?: boolean, guardEnabled?: boolean }} options - payload options
 * @returns {Promise<Record<string, any>>} payload result (`result = {...}`)
 */
async function runPayload(python, workDir, code, options) {
  payloadSeq += 1
  const payloadPath = path.join(workDir, `payload-${payloadSeq}.py`)
  const outPath = path.join(workDir, `out-${payloadSeq}.json`)
  const payload = wrapWithGuard(code, {
    taskRoot: path.join(workDir, 'task'),
    undoMessage: 'dsh-blender: test',
    ...options,
  })
  await writeFile(payloadPath, payload, 'utf8')
  const run = spawnSync(python.command, [...python.args, path.join(workDir, 'driver.py'), path.join(workDir, 'task'), payloadPath, outPath], {
    encoding: 'utf8',
  })
  assert.equal(run.status, 0, run.stderr || run.stdout)
  return JSON.parse(await readFile(outPath, 'utf8'))
}

test('the default payload always pushes one undo step', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-readonly-'))
  await writeFile(path.join(workDir, 'driver.py'), DRIVER, 'utf8')

  const value = await runPayload(python, workDir, 'result = {"ok": True}', {})
  assert.equal(value.status, 'ok')
  assert.equal(value.undo.pushed, true)
  assert.equal(value.undo.reason, undefined)
})

test('a read-only payload with no scene change skips the undo step', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-readonly-'))
  await writeFile(path.join(workDir, 'driver.py'), DRIVER, 'utf8')

  const value = await runPayload(python, workDir, 'result = {"objects": len(bpy.data.objects)}', { readOnly: true })
  assert.equal(value.status, 'ok')
  assert.equal(value.undo.pushed, false)
  assert.equal(value.undo.reason, 'read-only')
  assert.equal(value.undo.checkError, undefined)

  const unguarded = await runPayload(python, workDir, 'result = {}', { readOnly: true, guardEnabled: false })
  assert.equal(unguarded.status, 'ok')
  assert.equal(unguarded.undo.pushed, false)
  assert.equal(unguarded.undo.reason, 'read-only')
})

test('a read-only payload that changed the scene pushes the undo step', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-readonly-'))
  await writeFile(path.join(workDir, 'driver.py'), DRIVER, 'utf8')

  const moved = await runPayload(python, workDir, 'bpy.data.objects[0].location = (3.0, 0.0, 0.0)\nresult = {"ok": True}', {
    readOnly: true,
  })
  assert.equal(moved.status, 'ok')
  assert.equal(moved.undo.pushed, true)
  assert.equal(moved.undo.reason, 'read-only-changed')

  const partial = await runPayload(
    python,
    workDir,
    'bpy.data.objects[0].location = (4.0, 0.0, 0.0)\nraise RuntimeError("boom")',
    { readOnly: true },
  )
  assert.equal(partial.status, 'error')
  assert.equal(partial.undo.pushed, true)
  assert.equal(partial.undo.reason, 'read-only-changed')
})

test('a read-only payload with a broken change check still pushes undo', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-readonly-'))
  await writeFile(path.join(workDir, 'driver.py'), DRIVER, 'utf8')

  const value = await runPayload(python, workDir, 'del bpy.data.objects\nresult = {}', { readOnly: true })
  assert.equal(value.undo.pushed, true)
  assert.equal(value.undo.reason, 'read-only-unverified')
  assert.match(String(value.undo.checkError), /AttributeError/)
})
