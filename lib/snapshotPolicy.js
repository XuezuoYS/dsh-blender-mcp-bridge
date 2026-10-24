/**
 * Automatic snapshot cadence.
 *
 * The plugin decides *before* every write whether to take a copy of the open
 * session, so a long turn gets more than one safety net:
 *
 * - `turn`: the first write of a turn, plus delete-like calls;
 * - `write`: before every write call (expensive; opt-in);
 * - `adaptive`: the first write of a turn, every `everyWrites` writes, and
 *   delete-like calls.
 *
 * Delete-like is a text check on the code that is about to run. It can miss a
 * real deletion; that only costs the extra pre-delete copy, never the undo
 * step. A false positive only costs one more snapshot.
 *
 * @module lib/snapshotPolicy
 */

import path from 'node:path'

/** @typedef {'turn'|'write'|'adaptive'} SnapshotMode */

/** @typedef {object} SnapshotPolicy
 * @property {boolean} enabled - automatic snapshots are on
 * @property {SnapshotMode} on - cadence
 * @property {number} everyWrites - writes between two automatic snapshots
 * @property {boolean} onDestructive - take one more before delete-like code
 */

/** @typedef {object} SnapshotRecord
 * @property {string} name - file name such as `3-000004.blend`
 * @property {string} path - absolute path
 * @property {number} bytes - file size
 * @property {number} tookMs - how long the copy took
 * @property {string} reason - `turn`, `everyWrites`, `destructive`, `write` or `manual`
 */

/** @typedef {'turn'|'everyWrites'|'destructive'|'write'|'disabled'|'none'} AutoSnapshotReason */

/** @typedef {object} AutoSnapshotDecision
 * @property {boolean} take - write a snapshot before this call
 * @property {AutoSnapshotReason} reason - why, or why not
 * @property {number} writesSinceSnapshot - writes since the latest snapshot, before this call
 */

/** @typedef {object} AutoSnapshotState
 * @property {number} writesSinceSnapshot - writes since the latest snapshot
 * @property {boolean} snapshotTakenThisTurn - a snapshot (automatic or explicit) already covers this turn
 * @property {boolean} longTurnWarned - the turn-mode warning was already shown this turn
 * @property {SnapshotRecord | null} lastSnapshot - newest snapshot this process knows about
 * @property {number} seq - last sequence number used inside the task directory
 */

/** @typedef {object} SnapshotGap
 * @property {number} writesSinceSnapshot - writes since the latest snapshot
 * @property {SnapshotRecord | null} lastSnapshot - newest snapshot this process knows about
 */

/** @typedef {object} SnapshotTracker
 * @property {(sessionId: string, taskDir: string, options: { destructive: boolean }) => AutoSnapshotDecision} decide
 * @property {(sessionId: string, taskDir: string) => void} noteWrite
 * @property {(sessionId: string, taskDir: string, record: SnapshotRecord) => void} noteSnapshot
 * @property {(sessionId: string, taskDir: string) => number} nextSeq
 * @property {(sessionId: string) => void} startTurn
 * @property {(sessionId: string) => void} clearSession
 * @property {(sessionId: string, taskDir: string) => SnapshotGap | null} gapFor
 * @property {(sessionId: string, taskDir: string) => string} consumeLongTurnWarning
 */

/**
 * Patterns that usually remove data or whole objects.
 *
 * This is a text hint, not a parser: comments and strings can match too.
 */
const DESTRUCTIVE_PATTERNS = [
  /bpy\.data\.batch_remove\s*\(/,
  /bpy\.data\.[A-Za-z_]\w*\.(?:remove|batch_remove)\s*\(/,
  /bpy\.data\.orphans_purge\b/,
  /bpy\.ops\.object\.delete\b/,
  /bpy\.ops\.mesh\.delete\b/,
  /bpy\.ops\.outliner\.orphans_purge\b/,
  /shutil\.rmtree\s*\(/,
  /os\.(?:remove|unlink|rmdir)\s*\(/,
]

/**
 * Fresh per-session, per-task-directory auto-snapshot state.
 *
 * @returns {AutoSnapshotState} zeroed state
 */
export function createAutoSnapshotState() {
  return {
    writesSinceSnapshot: 0,
    snapshotTakenThisTurn: false,
    longTurnWarned: false,
    lastSnapshot: null,
    seq: 0,
  }
}

/**
 * Plan one automatic snapshot before a write call.
 *
 * Pure: it only reads the state. The caller records the write or the snapshot
 * afterwards, so a failed snapshot retries the same trigger point.
 *
 * @default everyWrites = 10
 * @param {AutoSnapshotState} state - state for this session and task directory
 * @param {SnapshotPolicy} policy - configured cadence
 * @param {{ destructive: boolean }} options - whether the code looks destructive
 * @returns {AutoSnapshotDecision} decision for this call
 */
export function planAutoSnapshot(state, policy, { destructive }) {
  const writesSinceSnapshot = state.writesSinceSnapshot
  if (!policy.enabled) return { take: false, reason: 'disabled', writesSinceSnapshot }
  if (policy.on === 'write') return { take: true, reason: 'write', writesSinceSnapshot }
  if (!state.snapshotTakenThisTurn) return { take: true, reason: 'turn', writesSinceSnapshot }
  if (policy.onDestructive && destructive && writesSinceSnapshot > 0) {
    return { take: true, reason: 'destructive', writesSinceSnapshot }
  }
  if (policy.on === 'adaptive' && writesSinceSnapshot >= Math.max(1, Math.trunc(policy.everyWrites))) {
    return { take: true, reason: 'everyWrites', writesSinceSnapshot }
  }
  return { take: false, reason: 'none', writesSinceSnapshot }
}

/**
 * Count one call that may have changed the scene.
 *
 * @param {AutoSnapshotState} state - state to update
 * @returns {void}
 */
export function noteAutoSnapshotWrite(state) {
  state.writesSinceSnapshot += 1
}

/**
 * Record a snapshot and start a new interval.
 *
 * @param {AutoSnapshotState} state - state to update
 * @param {SnapshotRecord} record - what was written
 * @returns {void}
 */
export function noteAutoSnapshotTaken(state, record) {
  state.writesSinceSnapshot = 0
  state.snapshotTakenThisTurn = true
  state.lastSnapshot = record
}

/**
 * Clear the per-turn flags; the write counter and the sequence keep going.
 *
 * @param {AutoSnapshotState} state - state to update
 * @returns {void}
 */
export function startAutoSnapshotTurn(state) {
  state.snapshotTakenThisTurn = false
  state.longTurnWarned = false
}

/**
 * One warning per turn when `on: 'turn'` lets a long task run without a new
 * snapshot.
 *
 * @default everyWrites = 10
 * @param {AutoSnapshotState} state - state to read and update
 * @param {SnapshotPolicy} policy - configured cadence
 * @returns {string} warning text, or an empty string
 */
export function longTurnWarning(state, policy) {
  if (!policy.enabled || policy.on !== 'turn') return ''
  if (state.longTurnWarned) return ''
  if (state.writesSinceSnapshot < Math.max(1, Math.trunc(policy.everyWrites))) return ''
  state.longTurnWarned = true
  const last = state.lastSnapshot === null ? '' : ` (${state.lastSnapshot.name})`
  return (
    `Long turn: ${state.writesSinceSnapshot} writes since the last automatic snapshot${last}. ` +
    'snapshot.on is "turn", so only one snapshot per turn; call blender_mcp_snapshot before a risky step, ' +
    'or set snapshot.on to "adaptive".'
  )
}

/**
 * Whether the code looks like it removes objects or data.
 *
 * @param {string} source - user Python about to run
 * @returns {boolean} true when a delete-like pattern is present
 */
export function looksDestructive(source) {
  const text = String(source)
  return DESTRUCTIVE_PATTERNS.some((pattern) => pattern.test(text))
}

/**
 * Build the per-plugin snapshot tracker used by the tool pipeline.
 *
 * Keys are `sessionId + task directory`; `startTurn` and `clearSession` touch
 * only that session, and `gapFor` never creates state.
 *
 * @param {SnapshotPolicy} policy - configured cadence
 * @returns {SnapshotTracker} tracker with pure-decision helpers
 */
export function createSnapshotTracker(policy) {
  /** @type {Map<string, AutoSnapshotState>} */
  const states = new Map()

  /**
   * @param {string} sessionId - session id
   * @param {string} taskDir - absolute task directory
   * @returns {string} map key
   */
  const stateKey = (sessionId, taskDir) => `${sessionId}\u0000${path.resolve(taskDir)}`

  /**
   * @param {string} sessionId - session id
   * @param {string} taskDir - absolute task directory
   * @returns {AutoSnapshotState} existing or fresh state
   */
  const stateOf = (sessionId, taskDir) => {
    const key = stateKey(sessionId, taskDir)
    let state = states.get(key)
    if (state === undefined) {
      state = createAutoSnapshotState()
      states.set(key, state)
    }
    return state
  }

  return {
    decide(sessionId, taskDir, options) {
      return planAutoSnapshot(stateOf(sessionId, taskDir), policy, options)
    },
    noteWrite(sessionId, taskDir) {
      noteAutoSnapshotWrite(stateOf(sessionId, taskDir))
    },
    noteSnapshot(sessionId, taskDir, record) {
      noteAutoSnapshotTaken(stateOf(sessionId, taskDir), record)
    },
    nextSeq(sessionId, taskDir) {
      const state = stateOf(sessionId, taskDir)
      state.seq += 1
      return state.seq
    },
    startTurn(sessionId) {
      const prefix = `${sessionId}\u0000`
      for (const [key, state] of states) if (key.startsWith(prefix)) startAutoSnapshotTurn(state)
    },
    clearSession(sessionId) {
      const prefix = `${sessionId}\u0000`
      for (const key of [...states.keys()]) if (key.startsWith(prefix)) states.delete(key)
    },
    gapFor(sessionId, taskDir) {
      const state = states.get(stateKey(sessionId, taskDir))
      if (state === undefined) return null
      return { writesSinceSnapshot: state.writesSinceSnapshot, lastSnapshot: state.lastSnapshot }
    },
    consumeLongTurnWarning(sessionId, taskDir) {
      const state = states.get(stateKey(sessionId, taskDir))
      if (state === undefined) return ''
      return longTurnWarning(state, policy)
    },
  }
}
