/**
 * Audit tests: fingerprints and the JSONL trail.
 */

import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { appendAudit, fileChanged, fileFingerprint } from '../lib/audit.js'

test('fileFingerprint distinguishes missing, empty and written files', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-audit-'))
  const file = path.join(dir, 'a.blend')
  const missing = await fileFingerprint(file)
  assert.equal(missing.exists, false)
  await writeFile(file, 'x')
  const written = await fileFingerprint(file)
  assert.equal(written.exists, true)
  assert.equal(written.size, 1)
  assert.equal(fileChanged(missing, written), true)
  assert.equal(fileChanged(written, written), false)
})

test('appendAudit writes one JSONL record and hashes the code', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-audit-'))
  await appendAudit({
    taskDir: dir,
    code: 'result = {}',
    storeCode: true,
    entry: { task: 'lamp', status: 'ok', fileChanged: false },
  })
  await appendAudit({
    taskDir: dir,
    code: 'result = {}',
    storeCode: false,
    entry: { task: 'lamp', status: 'blocked', fileChanged: false },
  })
  const lines = (await readFile(path.join(dir, 'audit.jsonl'), 'utf8')).trim().split('\n')
  assert.equal(lines.length, 2)
  const first = JSON.parse(lines[0])
  const second = JSON.parse(lines[1])
  assert.equal(first.task, 'lamp')
  assert.equal(first.code, 'result = {}')
  assert.match(first.codeSha256, /^[0-9a-f]{64}$/)
  assert.equal(second.code, undefined)
  assert.equal(second.codeSha256, first.codeSha256)
})

test('appendAudit keeps hashes but not code by default', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-audit-'))
  await appendAudit({ taskDir: dir, code: 'result = {}', entry: { tool: 'blender_mcp_exec', task: 'lamp' } })
  const record = JSON.parse((await readFile(path.join(dir, 'audit.jsonl'), 'utf8')).trim())
  assert.equal(record.tool, 'blender_mcp_exec')
  assert.equal(record.code, undefined)
  assert.match(record.codeSha256, /^[0-9a-f]{64}$/)
})
