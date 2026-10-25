/**
 * Snapshot files inside the task directory.
 *
 * A snapshot is a full `.blend` written with `save_as_mainfile(copy=True)`: it
 * never changes `bpy.data.filepath` and never clears the dirty flag. Rotation
 * always writes the next generation first and only then removes the oldest, so
 * there is no moment where the newest copy has not landed yet.
 *
 * A file is named `<turn>-<seq>_<label>_<YYMMDD-HHMMSS>_<session8>.blend`. Only
 * the numeric prefix drives ordering and rotation; the label, local-time stamp
 * and short session key exist so a human can tell snapshots apart in the task
 * directory.
 *
 * @module lib/snapshot
 */

import { mkdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { compareSnapshotNames, isInsideTask, listSnapshots, parseSnapshotName, slugifyTaskName } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

/** Longest label slug kept in a snapshot file name. */
export const SNAPSHOT_LABEL_MAX_LENGTH = 32

/** How much of the session id is kept in a snapshot file name. */
export const SNAPSHOT_SESSION_KEY_LENGTH = 8

/** Snapshot failure that must abort the upcoming write. */
export class SnapshotError extends Error {
  /**
   * @param {string} message - readable explanation
   */
  constructor(message) {
    super(message)
    this.name = 'SnapshotError'
  }
}

/** @typedef {(code: string, options?: { responseTimeoutMs?: number, signal?: AbortSignal }) => Promise<{ response: unknown }>} TrustedSend */

/**
 * Local wall-clock stamp for one snapshot name.
 *
 * Local time on purpose: the stamp is read by the human in front of the
 * machine, next to the clock and the Blender title bar. Ordering never uses it.
 *
 * @default date = new Date()
 * @param {Date} [date] - moment to format
 * @returns {string} `YYMMDD-HHMMSS`
 */
export function localStamp(date = new Date()) {
  /** @param {number} value - number to pad */
  const two = (value) => String(value).padStart(2, '0')
  const day = `${two(date.getFullYear() % 100)}${two(date.getMonth() + 1)}${two(date.getDate())}`
  const clock = `${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}`
  return `${day}-${clock}`
}

/**
 * Label segment of a snapshot name.
 *
 * A model label wins and becomes a slug; automatic copies get
 * `auto-<reason>` and an explicit copy without a label gets `manual`.
 *
 * @default maxLength = SNAPSHOT_LABEL_MAX_LENGTH
 * @param {string} label - model-supplied label, may be empty
 * @param {string} reason - `turn`, `everyWrites`, `destructive`, `write` or `manual`
 * @param {number} [maxLength] - maximum slug length
 * @returns {string} safe label slug
 */
export function snapshotLabel(label, reason, maxLength = SNAPSHOT_LABEL_MAX_LENGTH) {
  const text = String(label ?? '').trim()
  const fallback = reason === 'manual' ? 'manual' : `auto-${String(reason)}`
  return slugifyTaskName(text === '' ? fallback : text, maxLength)
}

/**
 * Session segment of a snapshot name: a short, file-name-safe session key.
 *
 * @default sessionId = '', maxLength = SNAPSHOT_SESSION_KEY_LENGTH
 * @param {string} [sessionId] - owning session id
 * @param {number} [maxLength] - maximum key length
 * @returns {string} short session key
 */
export function snapshotSessionKey(sessionId, maxLength = SNAPSHOT_SESSION_KEY_LENGTH) {
  const text = String(sessionId ?? '').trim()
  if (text === '') return 'session'
  return slugifyTaskName(text, maxLength)
}

/**
 * File name for one snapshot generation.
 *
 * @default label = '', sessionId = '', now = new Date()
 * @param {object} parts - name parts
 * @param {number} parts.turn - turn number
 * @param {number} parts.seq - sequence within the task directory
 * @param {string} [parts.label] - model label, empty for automatic copies
 * @param {string} parts.reason - `turn`, `everyWrites`, `destructive`, `write` or `manual`
 * @param {string} [parts.sessionId] - owning session
 * @param {Date} [parts.now] - moment the copy is written
 * @returns {string} `<turn>-<seq>_<label>_<YYMMDD-HHMMSS>_<session8>.blend`
 */
export function snapshotFileName({ turn, seq, label = '', reason, sessionId = '', now = new Date() }) {
  const prefix = `${turn}-${String(seq).padStart(6, '0')}`
  return `${prefix}_${snapshotLabel(label, reason)}_${localStamp(now)}_${snapshotSessionKey(sessionId)}.blend`
}

/**
 * Decide which snapshot files to drop after writing one more.
 *
 * Names may arrive in any order; they are sorted by (turn, seq) first so a
 * lexical sort can never mistake `10-001` for an older generation than `9-001`.
 *
 * @default generations = 3
 * @param {string[]} names - existing snapshot names
 * @param {number} [generations] - how many files to keep in total
 * @returns {string[]} names to remove, oldest first
 */
export function planRotation(names, generations = 3) {
  const keep = Math.max(1, Math.trunc(generations))
  const ordered = [...names].sort(compareSnapshotNames)
  const excess = ordered.length + 1 - keep
  if (excess <= 0) return []
  return ordered.slice(0, excess)
}

/**
 * Python that writes a copy of the current session to `filePath`.
 *
 * @default compress = true
 * @param {string} filePath - absolute snapshot path
 * @param {boolean} [compress] - write compressed
 * @returns {string} Python snippet
 */
export function snapshotCode(filePath, compress = true) {
  const pathLiteral = JSON.stringify(filePath)
  const compressLiteral = compress ? 'True' : 'False'
  return `${TRUSTED_CLEANUP}import bpy
_before_filepath = bpy.data.filepath
_dirty_before = bool(bpy.data.is_dirty)
bpy.ops.wm.save_as_mainfile(filepath=${pathLiteral}, copy=True, compress=${compressLiteral})
result = {
    'written': ${pathLiteral},
    'filepathUnchanged': bpy.data.filepath == _before_filepath,
    'dirtyBefore': _dirty_before,
    'dirtyAfter': bool(bpy.data.is_dirty),
}
`
}

/**
 * Write one snapshot and rotate older generations.
 *
 * The sequence is bumped past every prefix already used in this turn, so a
 * plugin restart that resets the in-memory counter can never write a duplicate
 * generation.
 *
 * @default label = '', reason = 'manual', sessionId = '', now = new Date()
 * @param {object} options - snapshot options
 * @param {string} options.taskDir - task directory
 * @param {number} options.turn - turn number
 * @param {number} options.seq - sequence within the turn
 * @param {string} [options.label] - model label, empty for automatic copies
 * @param {string} [options.reason] - `turn`, `everyWrites`, `destructive`, `write` or `manual`
 * @param {string} [options.sessionId] - owning session
 * @param {Date} [options.now] - timestamp for the file name
 * @param {TrustedSend} options.send - trusted transport (no guard)
 * @param {boolean} options.compress - write compressed
 * @param {number} options.generations - how many generations to keep (1–20)
 * @param {number} [options.timeoutMs] - reply budget
 * @param {AbortSignal} [options.signal] - caller cancellation signal
 * @returns {Promise<{ path: string, name: string, bytes: number, tookMs: number, removed: string[] }>} snapshot result
 */
export async function createSnapshot({
  taskDir,
  turn,
  seq,
  label = '',
  reason = 'manual',
  sessionId = '',
  now = new Date(),
  send,
  compress,
  generations,
  timeoutMs,
  signal,
}) {
  const snapshotsDir = path.join(taskDir, 'snapshots')
  await mkdir(snapshotsDir, { recursive: true })

  const existing = await listSnapshots(taskDir)
  /** @type {Set<number>} */
  const takenSeqs = new Set()
  for (const existingName of existing) {
    const parsed = parseSnapshotName(existingName)
    if (parsed !== null && parsed.turn === turn) takenSeqs.add(parsed.seq)
  }
  let nextSeq = seq
  while (takenSeqs.has(nextSeq)) nextSeq += 1
  const name = snapshotFileName({ turn, seq: nextSeq, label, reason, sessionId, now })
  const filePath = path.join(snapshotsDir, name)
  if (!isInsideTask(filePath, taskDir)) {
    throw new SnapshotError('Snapshot path escaped the task directory; refusing to write.')
  }
  // Plan the removals against the pre-write list: the new generation must land
  // first, and only then may the oldest files go.
  const removeNames = planRotation(existing, generations)

  const startedAt = Date.now()
  /** @type {{ response: unknown }} */
  let reply
  try {
    reply = await send(snapshotCode(filePath, compress), { responseTimeoutMs: timeoutMs, signal })
  } catch (error) {
    throw new SnapshotError(`Snapshot failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok') {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new SnapshotError(`Snapshot failed: ${message}`)
  }
  const inner = isRecord(envelope.result) ? envelope.result : {}
  if (inner.filepathUnchanged !== true) {
    throw new SnapshotError('Snapshot reported success but changed the open file path; refusing to continue without a clean backup.')
  }

  let bytes
  try {
    const info = await stat(filePath)
    bytes = info.size
  } catch {
    throw new SnapshotError('Snapshot reported success, but the file is missing.')
  }
  if (bytes <= 0) throw new SnapshotError('Snapshot file is empty; refusing to continue without a backup.')

  const removed = []
  for (const stale of removeNames) {
    if (stale === name) continue
    const stalePath = path.join(snapshotsDir, stale)
    try {
      await unlink(stalePath)
      removed.push(stalePath)
    } catch {
      // Rotation is best-effort after the new copy landed; never delete first.
    }
  }

  return { path: filePath, name, bytes, tookMs: Date.now() - startedAt, removed }
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
