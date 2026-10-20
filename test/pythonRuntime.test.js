/**
 * Python runtime tests: interpreter discovery, dependency probing and process
 * limits. These run against the local Python, not Blender.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { getHelper } from '../lib/helperCatalog.js'
import { runPythonHelper } from '../lib/helperRunner.js'
import { missingDependencies, resolvePython, runProcess } from '../lib/pythonRuntime.js'
import { ensureTaskDir } from '../lib/taskDir.js'

const PYTHON_CONFIG = { analysisPython: '', autoDetectPython: true }

test('a Python 3.10+ interpreter is found and cached', async () => {
  const first = await resolvePython(PYTHON_CONFIG)
  const second = await resolvePython(PYTHON_CONFIG)
  assert.equal(first.command, second.command)
  assert.match(first.version, /^\d+\.\d+$/)
  const [major, minor] = first.version.split('.').map(Number)
  assert.ok(major > 3 || (major === 3 && minor >= 10), `unexpected Python ${first.version}`)
})

test('modules are probed independently across dependency sets', async () => {
  const python = await resolvePython(PYTHON_CONFIG)
  await missingDependencies(python, ['json'])
  const second = await missingDependencies(python, ['math'])
  assert.deepEqual(second, [])
})

test('dependency probing reports unknown packages as missing', async () => {
  const python = await resolvePython(PYTHON_CONFIG)
  const missing = await missingDependencies(python, ['definitely-not-a-package'])
  assert.deepEqual(missing, ['definitely-not-a-package'])
})

test('process timeout stops the child and truncation caps the output', async () => {
  const python = await resolvePython(PYTHON_CONFIG)
  const slow = await runProcess(
    python.command,
    [...python.args, '-c', 'import time; time.sleep(5)'],
    { timeoutMs: 400, maxOutputChars: 1000 },
  )
  assert.equal(slow.timedOut, true)

  const loud = await runProcess(
    python.command,
    [...python.args, '-c', 'print("x" * 500)'],
    { timeoutMs: 10000, maxOutputChars: 100 },
  )
  assert.ok(loud.stdout.includes('[truncated]'))
  assert.ok(loud.stdout.length < 200)
})

test('a helper with missing dependencies fails with an install hint', async (t) => {
  const python = await resolvePython(PYTHON_CONFIG)
  const missing = await missingDependencies(python, ['opencv-python-headless'])
  if (missing.length === 0) {
    t.skip('opencv is installed on this machine')
    return
  }
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-pydeps-'))
  const workspaceDir = path.join(root, 'workspace')
  await mkdir(workspaceDir, { recursive: true })
  const taskDirInfo = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const helper = /** @type {import('../lib/helperCatalog.js').HelperSpec} */ (getHelper('atlas-region-detector'))
  await assert.rejects(
    runPythonHelper({
      helper,
      args: { image: 'atlas.png' },
      roots: { workspaceDir, blendDir: '', taskDir: taskDirInfo.dir },
      helpersDir: path.resolve('helpers'),
      pythonConfig: PYTHON_CONFIG,
      timeoutMs: 10000,
      maxOutputChars: 10000,
    }),
    /Missing Python packages.*node scripts\/setupAnalysis\.js/,
  )
})
