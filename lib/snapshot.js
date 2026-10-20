/**
 * Snapshot files inside the task directory.
 *
 * A snapshot is a full `.blend` written with `save_as_mainfile(copy=True)`: it
 * never changes `bpy.data.filepath` and never clears the dirty flag. Rotation
 * always writes the next generation first and only then removes the oldest, so
 * there is no moment where the newest copy has not landed yet.
 *
 * @module lib/snapshot
 */

import { mkdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { compareSnapshotNames, isInsideTask, listSnapshots } from './taskDir.js'
import { TRUSTED_CLEANUP } from './trustedExec.js'

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

/** @typedef {(code: string, options?: { responseTimeoutMs?: number }) => Promise<{ response: unknown }>} TrustedSend */

/**
 * File name for one snapshot generation.
 *
 * @param {number} turn - turn number
 * @param {number} seq - sequence within the turn
 * @returns {string} `<turn>-<seq>.blend`
 */
export function snapshotFileName(turn, seq) {
  return `${turn}-${String(seq).padStart(3, '0')}.blend`
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
 * @param {object} options - snapshot options
 * @param {string} options.taskDir - task directory
 * @param {number} options.turn - turn number
 * @param {number} options.seq - sequence within the turn
 * @param {TrustedSend} options.send - trusted transport (no guard)
 * @param {boolean} options.compress - write compressed
 * @param {number} options.generations - how many generations to keep (1–20)
 * @param {number} [options.timeoutMs] - reply budget
 * @returns {Promise<{ path: string, name: string, bytes: number, tookMs: number, removed: string[] }>} snapshot result
 */
export async function createSnapshot({ taskDir, turn, seq, send, compress, generations, timeoutMs }) {
  const snapshotsDir = path.join(taskDir, 'snapshots')
  await mkdir(snapshotsDir, { recursive: true })

  const existing = await listSnapshots(taskDir)
  let nextSeq = seq
  let name = snapshotFileName(turn, nextSeq)
  while (existing.includes(name)) {
    nextSeq += 1
    name = snapshotFileName(turn, nextSeq)
  }
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
    reply = await send(snapshotCode(filePath, compress), { responseTimeoutMs: timeoutMs })
  } catch (error) {
    throw new SnapshotError(`Snapshot failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  const envelope = isRecord(reply.response) ? reply.response : {}
  if (envelope.status !== 'ok') {
    const message = typeof envelope.message === 'string' ? envelope.message : 'unknown error'
    throw new SnapshotError(`Snapshot failed: ${message}`)
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
