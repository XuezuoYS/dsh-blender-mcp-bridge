/**
 * Python process helper tests.
 *
 * The plugin no longer discovers interpreters; these tests cover the probes,
 * dependency cache and process limits with a local interpreter.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { getHelper } from '../lib/helperCatalog.js'
import { runPythonHelper } from '../lib/helperRunner.js'
import { missingDependencies, probeInterpreter, runProcess } from '../lib/pythonRuntime.js'
import { ensureTaskDir } from '../lib/taskDir.js'
import { findTestPython } from './support/testPython.js'

test('an interpreter probe reports version, venv and ensurepip', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  const probe = await probeInterpreter(python.command, { args: python.args })
  assert.equal(probe.ok, true)
  assert.match(probe.version, /^\d+\.\d+\.\d+$/)
  assert.equal(typeof probe.venv, 'boolean')
})

test('modules are probed independently across dependency sets', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  await missingDependencies(python, ['json'])
  const second = await missingDependencies(python, ['math'])
  assert.deepEqual(second, [])
})

test('dependency probing reports unknown packages as missing', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  const missing = await missingDependencies(python, ['definitely-not-a-package'])
  assert.deepEqual(missing, ['definitely-not-a-package'])
})

test('process timeout stops the child and truncation caps the output', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  const slow = await runProcess(python.command, [...python.args, '-c', 'import time; time.sleep(5)'], {
    timeoutMs: 400,
    maxOutputChars: 1000,
  })
  assert.equal(slow.timedOut, true)

  const loud = await runProcess(python.command, [...python.args, '-c', 'print("x" * 500)'], {
    timeoutMs: 10000,
    maxOutputChars: 100,
  })
  assert.ok(loud.stdout.includes('[truncated]'))
  assert.ok(loud.stdout.length < 200)
})

test('onLine receives complete stdout lines', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  /** @type {string[]} */
  const lines = []
  await runProcess(python.command, [...python.args, '-c', 'print("a"); print("b")'], {
    timeoutMs: 10000,
    onLine: (line, stream) => {
      if (stream === 'stdout') lines.push(line)
    },
  })
  assert.deepEqual(lines, ['a', 'b'])
})

test('a helper with missing dependencies fails with the install hint', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no local Python 3.10+ interpreter')
    return
  }
  const missing = await missingDependencies(python, ['opencv-python-headless'])
  if (missing.length === 0) {
    t.skip('opencv is installed in the test interpreter')
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
      python,
      installHint: 'node "C:/plugin/scripts/setupAnalysis.js"',
      timeoutMs: 10000,
      maxOutputChars: 10000,
    }),
    /Missing Python packages.*node "C:\/plugin\/scripts\/setupAnalysis\.js"/,
  )
})
