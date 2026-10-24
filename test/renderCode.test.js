/**
 * Run the generated render payload against a fake `bpy` module.
 *
 * This is the only test that executes the render Python: it proves that the
 * status file says `running` before the render, ends `done`/`failed`, and that
 * every touched setting is restored even when the render raises. It needs a
 * local Python 3.10+ interpreter and is skipped when none is found.
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { renderCode } from '../lib/render.js'
import { resolvePython } from '../lib/pythonRuntime.js'
import { renderStatusPathFor } from '../lib/renderStatus.js'

/** Fake Blender with just enough state for the render payload. */
const DRIVER = `import json
import os
import struct
import sys
import traceback
import types

payload_path = sys.argv[1]
out_path = sys.argv[2]
status_path = sys.argv[3]
fail_render = sys.argv[4] == '1'

state = {'renders': 0, 'statusDuringRender': None}


def png_stub(width, height):
    return b'\\x89PNG\\r\\n\\x1a\\n' + struct.pack('>I', 13) + b'IHDR' + struct.pack('>II', int(width), int(height)) + b'\\x08\\x02\\x00\\x00\\x00'


camera = types.SimpleNamespace(name='Camera', type='CAMERA')
scene = types.SimpleNamespace(
    render=types.SimpleNamespace(
        resolution_x=1920,
        resolution_y=1080,
        resolution_percentage=80,
        engine='BLENDER_EEVEE',
        filepath='//old-render.png',
        image_settings=types.SimpleNamespace(file_format='JPEG'),
    ),
    camera=camera,
    eevee=types.SimpleNamespace(taa_render_samples=64),
    cycles=types.SimpleNamespace(samples=2048, use_denoising=True),
)


def fake_render(*args, **kwargs):
    try:
        with open(status_path, 'r', encoding='utf-8') as handle:
            state['statusDuringRender'] = json.load(handle)
    except Exception:
        state['statusDuringRender'] = None
    if fail_render:
        raise RuntimeError('Cannot render, no camera')
    render = scene.render
    target = render.filepath
    directory = os.path.dirname(target)
    if directory and not os.path.isdir(directory):
        os.makedirs(directory, exist_ok=True)
    with open(target, 'wb') as handle:
        handle.write(png_stub(render.resolution_x, render.resolution_y))
    state['renders'] += 1


bpy = types.ModuleType('bpy')
bpy.context = types.SimpleNamespace(scene=scene)
bpy.data = types.SimpleNamespace(objects=types.SimpleNamespace(get=lambda name: camera if name == 'Camera' else None))
bpy.ops = types.SimpleNamespace(render=types.SimpleNamespace(render=fake_render))
bpy.app = types.SimpleNamespace(background=False)
sys.modules['bpy'] = bpy


def snapshot():
    render = scene.render
    return {
        'resolution_x': int(render.resolution_x),
        'resolution_y': int(render.resolution_y),
        'resolution_percentage': int(render.resolution_percentage),
        'filepath': render.filepath,
        'file_format': render.image_settings.file_format,
        'engine': render.engine,
        'camera': getattr(scene.camera, 'name', None),
        'eevee_samples': int(scene.eevee.taa_render_samples),
        'cycles_samples': int(scene.cycles.samples),
        'cycles_denoise': bool(scene.cycles.use_denoising),
    }


before = snapshot()
with open(payload_path, 'r', encoding='utf-8') as handle:
    code = handle.read()

payload_error = None
trace = None
ns = {}
try:
    exec(compile(code, payload_path, 'exec'), ns)
except BaseException as exc:
    payload_error = '{}: {}'.format(type(exc).__name__, exc)
    trace = traceback.format_exc()
after = snapshot()
with open(out_path, 'w', encoding='utf-8') as handle:
    json.dump(
        {
            'payloadError': payload_error,
            'traceback': trace,
            'result': ns.get('result', {}),
            'before': before,
            'after': after,
            'state': state,
        },
        handle,
        default=str,
    )
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
 * @param {string} workDir - directory with the driver
 * @param {import('../lib/render.js').RenderCodeOptions} options - render code options
 * @param {boolean} [failRender] - make the fake render raise
 * @returns {Promise<Record<string, any>>} driver output and final status record
 */
async function runRenderPayload(workDir, options, failRender = false) {
  const python = await findTestPython()
  assert.ok(python, 'test must only run when a Python interpreter exists')
  payloadSeq += 1
  const payloadPath = path.join(workDir, `payload-${payloadSeq}.py`)
  const outPath = path.join(workDir, `out-${payloadSeq}.json`)
  const statusPath = renderStatusPathFor(options.filePath)
  await writeFile(payloadPath, renderCode(options), 'utf8')
  const run = spawnSync(
    python.command,
    [...python.args, path.join(workDir, 'driver.py'), payloadPath, outPath, statusPath, failRender ? '1' : '0'],
    { encoding: 'utf8' },
  )
  assert.equal(run.status, 0, run.stderr || run.stdout)
  const output = JSON.parse(await readFile(outPath, 'utf8'))
  const status = JSON.parse(await readFile(statusPath, 'utf8'))
  return { output, status }
}

/**
 * @returns {Promise<string>} temp work directory with the driver
 */
async function makeWorkDir() {
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-render-code-'))
  await writeFile(path.join(workDir, 'driver.py'), DRIVER, 'utf8')
  await mkdir(path.join(workDir, 'task', 'renders'), { recursive: true })
  return workDir
}

test('the render payload writes running→done and restores every setting', async (t) => {
  if ((await findTestPython()) === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await makeWorkDir()
  const filePath = path.join(workDir, 'task', 'renders', 'preview.png')
  const { output, status } = await runRenderPayload(workDir, {
    filePath,
    width: 640,
    height: 360,
    samples: 16,
    engine: 'CYCLES',
    timeoutMs: 9000,
  })

  assert.equal(output.payloadError, null)
  assert.equal(output.result.path, filePath)
  assert.equal(output.result.engine, 'CYCLES')
  assert.equal(output.result.samples, 16)
  assert.equal(output.result.width, 640)
  assert.equal(output.result.height, 360)
  assert.equal(output.result.resolutionPercentage, 100)
  assert.ok(output.result.bytes > 0)
  assert.equal(output.state.renders, 1)

  assert.deepEqual(output.after, output.before, 'every touched setting must be restored')
  assert.equal(output.state.statusDuringRender.state, 'running')
  assert.equal(output.state.statusDuringRender.jobId, 'preview')
  assert.equal(output.state.statusDuringRender.path, filePath)
  assert.equal(output.state.statusDuringRender.engine, 'CYCLES')
  assert.equal(output.state.statusDuringRender.samples, 16)
  assert.equal(output.state.statusDuringRender.timeoutMs, 9000)
  assert.equal(output.state.statusDuringRender.background, false)

  assert.equal(status.state, 'done')
  assert.equal(status.error, null)
  assert.equal(status.bytes, output.result.bytes)
  assert.ok(status.startedAtMs > 0)
  assert.ok(status.finishedAtMs >= status.startedAtMs)
})

test('a failing render still restores settings and records the failure', async (t) => {
  if ((await findTestPython()) === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await makeWorkDir()
  const filePath = path.join(workDir, 'task', 'renders', 'broken.png')
  const { output, status } = await runRenderPayload(
    workDir,
    { filePath, width: 320, height: 180, samples: 8, timeoutMs: 5000 },
    true,
  )

  assert.match(String(output.payloadError), /Cannot render, no camera/)
  assert.deepEqual(output.after, output.before, 'settings must be restored on failure too')
  assert.equal(status.state, 'failed')
  assert.match(String(status.error), /Cannot render, no camera/)
  assert.equal(status.path, filePath)
  assert.equal(output.state.statusDuringRender.state, 'running')
})

test('an early render error writes failed without a running phase', async (t) => {
  if ((await findTestPython()) === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await makeWorkDir()
  const filePath = path.join(workDir, 'task', 'renders', 'missing-camera.png')
  const { output, status } = await runRenderPayload(workDir, {
    filePath,
    width: 320,
    height: 180,
    samples: 8,
    camera: 'Missing',
  })

  assert.match(String(output.payloadError), /camera not found/)
  assert.deepEqual(output.after, output.before)
  assert.equal(status.state, 'failed')
  assert.match(String(status.error), /camera not found/)
  assert.equal(output.state.statusDuringRender, null)
})

test('a background start is recorded as such', async (t) => {
  if ((await findTestPython()) === null) {
    t.skip('no Python interpreter found')
    return
  }
  const workDir = await makeWorkDir()
  const filePath = path.join(workDir, 'task', 'renders', 'background.png')
  const { status } = await runRenderPayload(workDir, {
    filePath,
    width: 64,
    height: 36,
    samples: 1,
    background: true,
  })
  assert.equal(status.background, true)
  assert.equal(status.timeoutMs, 0)
  assert.equal(status.state, 'done')
})
