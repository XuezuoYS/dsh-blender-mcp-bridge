/**
 * Task-directory script reading: containment, size, encoding and change checks.
 */

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { assertScriptUnchanged, readTaskScript, SCRIPT_MAX_BYTES, ScriptError } from '../lib/scriptFile.js'

/**
 * Build one empty task directory with a `scripts` subdirectory.
 *
 * @returns {Promise<string>} absolute task directory
 */
async function makeTaskDir() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-script-'))
  const taskDir = path.join(root, '.dsh-blender-lamp')
  await mkdir(path.join(taskDir, 'scripts'), { recursive: true })
  return taskDir
}

/**
 * Assert that one call fails with the expected ScriptError code.
 *
 * @param {() => Promise<unknown>} call - call under test
 * @param {string} code - expected ScriptError code
 * @returns {Promise<void>} nothing
 */
async function expectScriptError(call, code) {
  await assert.rejects(call, (error) => {
    assert.ok(error instanceof ScriptError, `expected a ScriptError, got ${String(error)}`)
    assert.equal(error.code, code)
    assert.ok(error.message.length > 0)
    return true
  })
}

test('reads a script and reports its relative path, size and hash', async () => {
  const taskDir = await makeTaskDir()
  const source = 'result = {"ok": true}\n'
  await writeFile(path.join(taskDir, 'scripts', 'make.py'), source)

  const script = await readTaskScript({ taskDir, scriptPath: 'scripts/make.py' })

  assert.equal(script.relPath, 'scripts/make.py')
  assert.equal(script.absPath, path.join(taskDir, 'scripts', 'make.py'))
  assert.equal(script.content, source)
  assert.equal(script.bytes, Buffer.byteLength(source))
  assert.equal(script.sha256, createHash('sha256').update(source, 'utf8').digest('hex'))
})

test('accepts an absolute path that stays inside the task directory', async () => {
  const taskDir = await makeTaskDir()
  const source = 'result = {}\n'
  const absPath = path.join(taskDir, 'make.py')
  await writeFile(absPath, source)

  const script = await readTaskScript({ taskDir, scriptPath: absPath })

  assert.equal(script.relPath, 'make.py')
  assert.equal(script.content, source)
})

test('drops one leading byte-order mark', async () => {
  const taskDir = await makeTaskDir()
  await writeFile(path.join(taskDir, 'make.py'), '\uFEFFresult = {}\n')

  const script = await readTaskScript({ taskDir, scriptPath: 'make.py' })

  assert.ok(!script.content.startsWith('\uFEFF'))
  assert.equal(script.bytes, Buffer.byteLength('result = {}\n'))
})

test('rejects paths outside the task directory', async () => {
  const taskDir = await makeTaskDir()
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: '../outside.py' }), 'outside-task')
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: path.join(taskDir, '..', 'outside.py') }), 'outside-task')
})

test('rejects anything that is not a plain .py file', async () => {
  const taskDir = await makeTaskDir()
  await writeFile(path.join(taskDir, 'notes.txt'), 'x')
  await mkdir(path.join(taskDir, 'folder.py'))
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: 'notes.txt' }), 'not-python')
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: 'missing.py' }), 'not-found')
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: 'folder.py' }), 'not-a-file')
})

test('rejects an empty script', async () => {
  const taskDir = await makeTaskDir()
  await writeFile(path.join(taskDir, 'empty.py'), '  \n\n')
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: 'empty.py' }), 'empty')
})

test('rejects a script above the size limit', async () => {
  const taskDir = await makeTaskDir()
  await writeFile(path.join(taskDir, 'big.py'), 'a'.repeat(SCRIPT_MAX_BYTES + 1))
  await expectScriptError(() => readTaskScript({ taskDir, scriptPath: 'big.py' }), 'too-large')
})

test('accepts a script at exactly the size limit', async () => {
  const taskDir = await makeTaskDir()
  await writeFile(path.join(taskDir, 'edge.py'), 'a'.repeat(SCRIPT_MAX_BYTES))
  const script = await readTaskScript({ taskDir, scriptPath: 'edge.py' })
  assert.equal(script.bytes, SCRIPT_MAX_BYTES)
})

test('detects a file that changed or vanished after the scan', async () => {
  const taskDir = await makeTaskDir()
  const filePath = path.join(taskDir, 'make.py')
  await writeFile(filePath, 'result = {"version": 1}\n')
  const script = await readTaskScript({ taskDir, scriptPath: 'make.py' })

  await assertScriptUnchanged(script)

  await writeFile(filePath, 'result = {"version": 2}\n')
  await expectScriptError(() => assertScriptUnchanged(script), 'changed')

  await writeFile(filePath, 'result = {"version": 1}\n')
  await assertScriptUnchanged(script)

  await rm(filePath)
  await expectScriptError(() => assertScriptUnchanged(script), 'changed')
})
