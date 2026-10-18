/**
 * Snapshot tests: naming, rotation and the trusted write path.
 */

import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { createSnapshot, planRotation, snapshotFileName, SnapshotError } from '../lib/snapshot.js'
import { ensureTaskDir } from '../lib/taskDir.js'

test('snapshot names sort by generation', () => {
  assert.equal(snapshotFileName(3, 7), '3-007.blend')
  assert.ok(snapshotFileName(3, 10) > snapshotFileName(3, 9))
})

test('rotation writes first and drops the oldest generation', () => {
  assert.deepEqual(planRotation([], 3), [])
  assert.deepEqual(planRotation(['1-001.blend'], 3), [])
  assert.deepEqual(planRotation(['1-001.blend', '1-002.blend'], 3), [])
  assert.deepEqual(planRotation(['1-001.blend', '1-002.blend', '1-003.blend'], 3), ['1-001.blend'])
  assert.deepEqual(planRotation(['1-001.blend', '1-002.blend', '1-003.blend', '1-004.blend'], 2), [
    '1-001.blend',
    '1-002.blend',
    '1-003.blend',
  ])
})

/**
 * Fake trusted transport that materializes the snapshot file named in the
 * generated Python.
 *
 * @returns {(code: string) => Promise<{ response: unknown }>} fake sender
 */
function fakeSnapshotSender() {
  return async (code) => {
    assert.match(code, /save_as_mainfile/)
    const match = /filepath=("(?:\\.|[^"\\])*")/.exec(code)
    assert.ok(match, 'snapshot code must carry an absolute filepath literal')
    const filePath = JSON.parse(match[1])
    await writeFile(filePath, 'BLEND')
    return { response: { status: 'ok', result: { written: filePath } } }
  }
}

test('createSnapshot writes the file and rotates after success', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const snapshotsDir = path.join(task.dir, 'snapshots')
  for (const name of ['1-001.blend', '1-002.blend', '1-003.blend']) await writeFile(path.join(snapshotsDir, name), 'old')

  const result = await createSnapshot({
    taskDir: task.dir,
    turn: 1,
    seq: 4,
    send: fakeSnapshotSender(),
    compress: true,
    generations: 3,
    timeoutMs: 1000,
  })

  assert.equal(result.name, '1-004.blend')
  assert.equal(result.bytes, 5)
  assert.deepEqual(
    result.removed.map((entry) => path.basename(entry)),
    ['1-001.blend'],
  )
  assert.equal(await readFile(result.path, 'utf8'), 'BLEND')
})

test('a failed snapshot is refused loudly', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  await assert.rejects(
    createSnapshot({
      taskDir: task.dir,
      turn: 1,
      seq: 1,
      send: async () => ({ response: { status: 'error', message: 'disk full' } }),
      compress: true,
      generations: 3,
      timeoutMs: 1000,
    }),
    (error) => error instanceof SnapshotError && /disk full/.test(error.message),
  )
})
