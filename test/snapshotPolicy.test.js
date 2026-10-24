/**
 * Automatic snapshot cadence tests: modes, counters, the destructive hint and
 * the per-session tracker. No Blender and no file system.
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import {
  createAutoSnapshotState,
  createSnapshotTracker,
  looksDestructive,
  longTurnWarning,
  noteAutoSnapshotTaken,
  noteAutoSnapshotWrite,
  planAutoSnapshot,
  startAutoSnapshotTurn,
} from '../lib/snapshotPolicy.js'

/** Policy used by most cases. */
/** @type {import('../lib/snapshotPolicy.js').SnapshotPolicy} */
const POLICY = { enabled: true, on: 'adaptive', everyWrites: 3, onDestructive: true }

/**
 * Fake snapshot record.
 *
 * @param {string} [name] - file name
 * @returns {import('../lib/snapshotPolicy.js').SnapshotRecord} record
 */
function record(name = '3-000001.blend') {
  return { name, path: path.join('snapshots', name), bytes: 5, tookMs: 1, reason: 'turn' }
}

test('a fresh state snapshots before the first write of the turn', () => {
  const state = createAutoSnapshotState()
  assert.deepEqual(planAutoSnapshot(state, POLICY, { destructive: false }), {
    take: true,
    reason: 'turn',
    writesSinceSnapshot: 0,
  })
})

test('adaptive snapshots again only after everyWrites writes', () => {
  const state = createAutoSnapshotState()
  noteAutoSnapshotTaken(state, record())
  for (let index = 0; index < 2; index += 1) {
    assert.equal(planAutoSnapshot(state, POLICY, { destructive: false }).take, false)
    noteAutoSnapshotWrite(state)
  }
  // The counter is now 2; planning does not change it.
  assert.equal(planAutoSnapshot(state, POLICY, { destructive: false }).take, false)
  noteAutoSnapshotWrite(state)
  assert.deepEqual(planAutoSnapshot(state, POLICY, { destructive: false }), {
    take: true,
    reason: 'everyWrites',
    writesSinceSnapshot: 3,
  })
})

test('turn mode stays at one snapshot per turn and flags a long turn once', () => {
  const state = createAutoSnapshotState()
  /** @type {import('../lib/snapshotPolicy.js').SnapshotPolicy} */
  const policy = { ...POLICY, on: 'turn' }
  noteAutoSnapshotTaken(state, record())
  for (let index = 0; index < 2; index += 1) noteAutoSnapshotWrite(state)
  assert.equal(planAutoSnapshot(state, policy, { destructive: false }).take, false)
  assert.equal(longTurnWarning(state, policy), '')
  noteAutoSnapshotWrite(state)
  const warning = longTurnWarning(state, policy)
  assert.match(warning, /3 writes since the last automatic snapshot/)
  assert.match(warning, /3-000001\.blend/)
  assert.equal(longTurnWarning(state, policy), '')
  assert.equal(planAutoSnapshot(state, policy, { destructive: false }).take, false)
})

test('write mode snapshots before every call and never warns', () => {
  const state = createAutoSnapshotState()
  /** @type {import('../lib/snapshotPolicy.js').SnapshotPolicy} */
  const policy = { ...POLICY, on: 'write' }
  noteAutoSnapshotTaken(state, record())
  for (let index = 0; index < 5; index += 1) {
    const decision = planAutoSnapshot(state, policy, { destructive: false })
    assert.equal(decision.take, true)
    assert.equal(decision.reason, 'write')
    noteAutoSnapshotTaken(state, record())
    noteAutoSnapshotWrite(state)
  }
  assert.equal(longTurnWarning(state, policy), '')
})

test('a disabled policy never snapshots and never warns', () => {
  const state = createAutoSnapshotState()
  const policy = { ...POLICY, enabled: false }
  for (let index = 0; index < 5; index += 1) {
    assert.deepEqual(planAutoSnapshot(state, policy, { destructive: true }), {
      take: false,
      reason: 'disabled',
      writesSinceSnapshot: index,
    })
    noteAutoSnapshotWrite(state)
  }
  assert.equal(longTurnWarning(state, policy), '')
})

test('a delete-like call takes a snapshot only when something changed since the last one', () => {
  const state = createAutoSnapshotState()
  noteAutoSnapshotTaken(state, record())
  // Nothing happened since the snapshot: no need for a second, identical copy.
  assert.equal(planAutoSnapshot(state, POLICY, { destructive: true }).reason, 'none')
  noteAutoSnapshotWrite(state)
  assert.deepEqual(planAutoSnapshot(state, POLICY, { destructive: true }), {
    take: true,
    reason: 'destructive',
    writesSinceSnapshot: 1,
  })
  const noTrigger = { ...POLICY, onDestructive: false }
  assert.equal(planAutoSnapshot(state, noTrigger, { destructive: true }).reason, 'none')
})

test('a new turn resets the per-turn flags but keeps the write counter', () => {
  const state = createAutoSnapshotState()
  noteAutoSnapshotTaken(state, record())
  noteAutoSnapshotWrite(state)
  noteAutoSnapshotWrite(state)
  startAutoSnapshotTurn(state)
  assert.equal(state.writesSinceSnapshot, 2)
  assert.deepEqual(planAutoSnapshot(state, POLICY, { destructive: false }), {
    take: true,
    reason: 'turn',
    writesSinceSnapshot: 2,
  })
})

test('looksDestructive catches the usual delete calls', () => {
  const destructive = [
    'bpy.data.objects.remove(bpy.data.objects[0])',
    'bpy.data.meshes.remove(mesh)',
    'bpy.data.batch_remove([object])',
    'bpy.data.orphans_purge(do_local_ids=True)',
    'bpy.ops.object.delete(use_global=False)',
    'bpy.ops.mesh.delete(type="VERT")',
    'bpy.ops.outliner.orphans_purge(do_recursive=True)',
    'shutil.rmtree(path)',
    'os.remove(path)',
    'os.unlink(path)',
    'os.rmdir(path)',
  ]
  for (const source of destructive) assert.equal(looksDestructive(source), true, source)
  const harmless = [
    'cube = bpy.data.objects.new("Cube", None)',
    'bpy.data.collections.new("Props")',
    'obj.name = "remove later"',
    'bpy.ops.mesh.primitive_cube_add()',
    'result = {"objects": len(bpy.data.objects)}',
  ]
  for (const source of harmless) assert.equal(looksDestructive(source), false, source)
})

test('the tracker keeps sessions and task directories apart', () => {
  const tracker = createSnapshotTracker(POLICY)
  const taskA = path.join('C:', 'project', '.dsh-blender-a')
  const taskB = path.join('C:', 'project', '.dsh-blender-b')

  assert.equal(tracker.gapFor('s1', taskA), null)
  assert.equal(tracker.consumeLongTurnWarning('s1', taskA), '')

  assert.deepEqual(tracker.decide('s1', taskA, { destructive: false }), {
    take: true,
    reason: 'turn',
    writesSinceSnapshot: 0,
  })
  tracker.noteSnapshot('s1', taskA, record())
  tracker.noteWrite('s1', taskA)
  tracker.noteWrite('s1', taskA)
  assert.equal(tracker.gapFor('s1', taskA)?.writesSinceSnapshot, 2)
  assert.equal(tracker.gapFor('s1', taskB), null)
  assert.equal(tracker.gapFor('s2', taskA), null)

  tracker.startTurn('s1')
  assert.equal(tracker.decide('s1', taskA, { destructive: false }).reason, 'turn')
  assert.equal(tracker.gapFor('s1', taskB), null)

  tracker.clearSession('s1')
  assert.equal(tracker.gapFor('s1', taskA), null)
})

test('nextSeq counts per session and task directory', () => {
  const tracker = createSnapshotTracker(POLICY)
  const taskA = path.join('C:', 'project', '.dsh-blender-a')
  const taskB = path.join('C:', 'project', '.dsh-blender-b')
  assert.equal(tracker.nextSeq('s1', taskA), 1)
  assert.equal(tracker.nextSeq('s1', taskA), 2)
  assert.equal(tracker.nextSeq('s1', taskB), 1)
  assert.equal(tracker.nextSeq('s2', taskA), 1)
})

test('the long-turn warning is consumed once per tracker state', () => {
  const tracker = createSnapshotTracker({ ...POLICY, on: 'turn', everyWrites: 1 })
  const task = path.join('C:', 'project', '.dsh-blender-a')
  tracker.noteSnapshot('s1', task, record())
  tracker.noteWrite('s1', task)
  assert.match(tracker.consumeLongTurnWarning('s1', task), /Long turn/)
  assert.equal(tracker.consumeLongTurnWarning('s1', task), '')
  tracker.startTurn('s1')
  tracker.noteWrite('s1', task)
  assert.match(tracker.consumeLongTurnWarning('s1', task), /Long turn/)
})
