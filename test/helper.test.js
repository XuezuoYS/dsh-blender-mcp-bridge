/**
 * Helper catalog and runner tests. The runner test uses the local Python and
 * a pure-Python helper, so no Blender or third-party packages are needed.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { buildHelperCommand, getHelper, listHelpers, validateHelperArgs } from '../lib/helperCatalog.js'
import { runBlenderHelper, runPythonHelper } from '../lib/helperRunner.js'
import { ensureTaskDir } from '../lib/taskDir.js'

const HELPERS_DIR = path.resolve('helpers')

test('catalog has 26 helpers, 23 regular and 3 maintenance', () => {
  const all = listHelpers(true)
  assert.equal(all.length, 26)
  assert.equal(listHelpers(false).length, 23)
  assert.deepEqual(
    listHelpers(false).filter((helper) => helper.maintenance).map((helper) => helper.name),
    [],
  )
  assert.deepEqual(
    all.filter((helper) => helper.maintenance).map((helper) => helper.name).sort(),
    ['release-readiness-check', 'sanitize-skill-contributions', 'skill-graph-audit'],
  )
  assert.ok(all.every((helper) => existsSync(path.join(HELPERS_DIR, helper.script))))
  assert.equal(all.filter((helper) => helper.runtime === 'blender').map((helper) => helper.name)[0], 'surface-texture-coverage-audit')
})

test('helper argument validation rejects unknown, missing and mistyped values', () => {
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('atlas-region-detector'))
  assert.throws(() => validateHelperArgs(helper, { nope: 1 }), /Unknown parameter/)
  assert.throws(() => validateHelperArgs(helper, {}), /Missing required parameter "image"/)
  assert.throws(() => validateHelperArgs(helper, { image: 'a.png', out: 'b.json', 'min-area': 'big' }), /must be integer/)
})

test('outputs default into the task directory and arrays become repeated flags', async () => {
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('animation-contact-sheet'))
  const { argv, outputs } = await buildHelperCommand(helper, { frames: ['a.png', 'b.png'] }, path.resolve('C:/proj/.dsh-blender-lamp'))
  assert.ok(argv.includes('--frames'))
  assert.ok(argv.includes('a.png'))
  assert.ok(argv.includes('b.png'))
  assert.equal(outputs.length, 2)
  for (const output of outputs) assert.match(output.path, /[\\/]\.dsh-blender-lamp[\\/]outputs[\\/]/)
})

test('boolean flags are emitted only when true', async () => {
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('segment-source-parts'))
  const taskDir = path.resolve('C:/proj/.dsh-blender-lamp')
  const off = await buildHelperCommand(helper, { image: 'a.png', 'out-dir': 'parts', watershed: false }, taskDir)
  assert.equal(off.argv.includes('--watershed'), false)
  const on = await buildHelperCommand(helper, { image: 'a.png', 'out-dir': 'parts', watershed: true }, taskDir)
  assert.equal(on.argv.includes('--watershed'), true)
})

test('hand-written wireframe analyzer arguments are positional', async () => {
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('wireframe-analyzer'))
  const taskDir = path.resolve('C:/proj/.dsh-blender-lamp')
  const { argv, outputs } = await buildHelperCommand(helper, { image: 'a.png' }, taskDir)
  assert.equal(argv[0], 'a.png')
  assert.match(argv[1], /[\\/]outputs[\\/]wireframe-analyzer-output\.json$/)
  assert.equal(outputs.length, 1)
})

test('positional image lists are spread in order', async () => {
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('register-orthographic-views'))
  const { argv } = await buildHelperCommand(
    helper,
    { images: ['a.png', 'b.png'] },
    path.resolve('C:/proj/.dsh-blender-lamp'),
  )
  assert.equal(argv[0], 'a.png')
  assert.equal(argv[1], 'b.png')
  assert.ok(argv.includes('--out'))
})

test('a pure-Python helper runs end to end and writes inside the task directory', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-helper-'))
  const workspaceDir = path.join(root, 'workspace')
  const blendDir = path.join(root, 'project')
  await mkdir(workspaceDir, { recursive: true })
  await mkdir(blendDir, { recursive: true })
  const taskDirInfo = await ensureTaskDir({ root: blendDir, task: 'lamp', sessionId: 's1' })
  await writeFile(path.join(workspaceDir, 'fit.json'), '{"fit": {}}', 'utf8')

  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('fit-repair-queue'))
  const result = await runPythonHelper({
    helper,
    args: { 'fit-report': 'fit.json', out: 'queue.json' },
    roots: { workspaceDir, blendDir, taskDir: taskDirInfo.dir },
    helpersDir: HELPERS_DIR,
    pythonConfig: { analysisPython: '', autoDetectPython: true },
    timeoutMs: 30000,
    maxOutputChars: 100000,
  })
  assert.equal(result.status, 'ok')
  const outputs = /** @type {{ path: string }[]} */ (result.outputs)
  assert.ok(outputs.length >= 1)
  for (const output of outputs) assert.ok(output.path.startsWith(taskDirInfo.dir))
  assert.ok(existsSync(outputs[0].path))
})

test('the Blender helper defaults to every mesh in the scene', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-helper-'))
  const taskDirInfo = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('surface-texture-coverage-audit'))
  /** @type {string[]} */
  const sent = []
  const send = async (/** @type {string} */ code) => {
    sent.push(code)
    if (code.includes("obj.type == 'MESH'")) {
      return { response: { status: 'ok', result: { names: ['Cube'] } } }
    }
    return {
      response: {
        status: 'ok',
        result: {
          ok: true,
          stdout: '{"schema": "surface_texture_coverage_audit.v1", "objects": [{"name": "Cube"}]}',
        },
      },
    }
  }
  const result = await runBlenderHelper({
    helper,
    args: {},
    roots: { workspaceDir: root, blendDir: '', taskDir: taskDirInfo.dir },
    helpersDir: HELPERS_DIR,
    send,
    timeoutMs: 10000,
  })
  assert.equal(result.status, 'ok')
  assert.ok(sent[0].includes("obj.type == 'MESH'"))
  assert.equal((/** @type {any} */ (result.report)).objects.length, 1)
})

test('an input outside all allowed roots is refused', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-helper-'))
  const taskDirInfo = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('fit-repair-queue'))
  await assert.rejects(
    runPythonHelper({
      helper,
      args: { 'fit-report': '../../escape.json', out: 'queue.json' },
      roots: { workspaceDir: path.join(root, 'workspace'), blendDir: '', taskDir: taskDirInfo.dir },
      helpersDir: HELPERS_DIR,
      pythonConfig: { analysisPython: '', autoDetectPython: true },
      timeoutMs: 30000,
      maxOutputChars: 100000,
    }),
    /outside the workspace/,
  )
})
