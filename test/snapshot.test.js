/**
 * Snapshot tests: naming, rotation and the trusted write path.
 */

import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  createSnapshot,
  localStamp,
  planRotation,
  snapshotFileName,
  snapshotLabel,
  snapshotSessionKey,
  SnapshotError,
} from '../lib/snapshot.js'
import { ensureTaskDir } from '../lib/taskDir.js'

/** Fixed moment so snapshot names are reproducible. */
const NOW = new Date(2026, 9, 25, 10, 54, 2)

/**
 * Snapshot name with the test defaults.
 *
 * @param {number} turn - turn number
 * @param {number} [seq] - sequence within the turn
 * @param {string} [label] - model label
 * @returns {string} snapshot file name
 */
function snapshotName(turn, seq = 1, label = '') {
  return snapshotFileName({ turn, seq, label, reason: 'manual', sessionId: 's1', now: NOW })
}

test('snapshot names carry label, local time and a short session key', () => {
  assert.equal(localStamp(NOW), '261025-105402')
  assert.equal(
    snapshotFileName({ turn: 1, seq: 2, label: 'final', reason: 'manual', sessionId: 's1', now: NOW }),
    '1-000002_final_261025-105402_s1.blend',
  )
  assert.ok(snapshotName(3, 10) > snapshotName(3, 9))
})

test('a missing label falls back to manual or auto-<reason>', () => {
  assert.equal(snapshotName(1, 1), '1-000001_manual_261025-105402_s1.blend')
  assert.equal(
    snapshotFileName({ turn: 1, seq: 1, label: '   ', reason: 'everyWrites', sessionId: 's1', now: NOW }),
    '1-000001_auto-everywrites_261025-105402_s1.blend',
  )
  assert.equal(snapshotLabel('final approved!', 'manual'), 'final-approved')
  assert.equal(snapshotLabel('', 'destructive'), 'auto-destructive')
  assert.equal(snapshotLabel('x'.repeat(80), 'manual'), 'x'.repeat(32))
  assert.equal(snapshotLabel('../../etc/passwd', 'manual'), 'etc-passwd')
})

test('the session segment is short, safe and never empty', () => {
  assert.equal(snapshotSessionKey('0f8c1e2a-1234-5678-9abc-def012345678'), '0f8c1e2a')
  assert.equal(snapshotSessionKey('unknown-session'), 'unknown')
  assert.equal(snapshotSessionKey('has space/slash'), 'has-spac')
  assert.equal(snapshotSessionKey(''), 'session')
})

test('rotation keeps the newest generations after turn 10', () => {
  const names = [1, 2, 9, 10, 11].map((turn) => snapshotName(turn))
  // Feed them unsorted on purpose: rotation must sort by (turn, seq) itself.
  assert.deepEqual(
    planRotation([...names].reverse(), 3),
    [1, 2, 9].map((turn) => snapshotName(turn)),
  )
  assert.deepEqual(planRotation(['1-001.blend', '10-001.blend', '2-001.blend', '9-001.blend'], 3), [
    '1-001.blend',
    '2-001.blend',
  ])
})

test('rotation writes first and drops the oldest generation', () => {
  assert.deepEqual(planRotation([], 3), [])
  assert.deepEqual(planRotation([snapshotName(1, 1)], 3), [])
  assert.deepEqual(planRotation([snapshotName(1, 1), snapshotName(1, 2)], 3), [])
  assert.deepEqual(planRotation([snapshotName(1, 1), snapshotName(1, 2), snapshotName(1, 3)], 3), [snapshotName(1, 1)])
  assert.deepEqual(
    planRotation([snapshotName(1, 1), snapshotName(1, 2), snapshotName(1, 3), snapshotName(1, 4)], 2),
    [snapshotName(1, 1), snapshotName(1, 2), snapshotName(1, 3)],
  )
})

test('rotation ignores the label when ordering generations', () => {
  const oldest = snapshotName(1, 1, 'zzz')
  const middle = snapshotName(1, 2, 'aaa')
  const newest = snapshotName(1, 3, 'mmm')
  assert.deepEqual(planRotation([newest, oldest, middle], 3), [oldest])
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
    return { response: { status: 'ok', result: { written: filePath, filepathUnchanged: true, dirtyBefore: false, dirtyAfter: false } } }
  }
}

test('createSnapshot writes the labelled file and rotates after success', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const snapshotsDir = path.join(task.dir, 'snapshots')
  for (const name of ['1-001.blend', '1-002.blend', '1-003.blend']) await writeFile(path.join(snapshotsDir, name), 'old')

  const result = await createSnapshot({
    taskDir: task.dir,
    turn: 1,
    seq: 4,
    label: 'final',
    reason: 'manual',
    sessionId: 's1',
    now: NOW,
    send: fakeSnapshotSender(),
    compress: true,
    generations: 3,
    timeoutMs: 1000,
  })

  assert.equal(result.name, '1-000004_final_261025-105402_s1.blend')
  assert.equal(result.bytes, 5)
  assert.deepEqual(
    result.removed.map((entry) => path.basename(entry)),
    ['1-001.blend'],
  )
  assert.equal(await readFile(result.path, 'utf8'), 'BLEND')
})

test('createSnapshot rotates the oldest turn, not the lexically first name', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const snapshotsDir = path.join(task.dir, 'snapshots')
  for (const name of ['8-008.blend', '9-009.blend', '10-010.blend']) {
    await writeFile(path.join(snapshotsDir, name), 'old')
  }

  const result = await createSnapshot({
    taskDir: task.dir,
    turn: 11,
    seq: 11,
    label: 'bench',
    reason: 'manual',
    sessionId: 's1',
    now: NOW,
    send: fakeSnapshotSender(),
    compress: true,
    generations: 3,
    timeoutMs: 1000,
  })

  assert.equal(result.name, '11-000011_bench_261025-105402_s1.blend')
  assert.deepEqual(result.removed.map((entry) => path.basename(entry)), ['8-008.blend'])
})

test('createSnapshot skips a sequence this turn already used', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const snapshotsDir = path.join(task.dir, 'snapshots')
  // A previous plugin process wrote generation 4, then restarted with seq reset.
  await writeFile(path.join(snapshotsDir, '1-000004_older_261024-090000_aaaaaaa1.blend'), 'old')

  const result = await createSnapshot({
    taskDir: task.dir,
    turn: 1,
    seq: 4,
    label: 'after-restart',
    reason: 'manual',
    sessionId: 's1',
    now: NOW,
    send: fakeSnapshotSender(),
    compress: true,
    generations: 3,
    timeoutMs: 1000,
  })

  assert.equal(result.name, '1-000005_after-restart_261025-105402_s1.blend')
  assert.deepEqual(result.removed, [])
})

test('a snapshot that changes the open file path is refused', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-snap-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  await assert.rejects(
    createSnapshot({
      taskDir: task.dir,
      turn: 1,
      seq: 1,
      send: async () => ({ response: { status: 'ok', result: { filepathUnchanged: false } } }),
      compress: true,
      generations: 3,
      timeoutMs: 1000,
    }),
    (error) => error instanceof SnapshotError && /changed the open file path/.test(error.message),
  )
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
