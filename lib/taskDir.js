/**
 * Task directories: `<blend dir>/.dsh-blender-<task>/`.
 *
 * A task directory is the only place this plugin ever writes. It carries an
 * owner marker so two sessions never share one by accident, and it is never
 * deleted automatically.
 *
 * @module lib/taskDir
 */

import { realpathSync } from 'node:fs'
import { mkdir, readFile, readdir, realpath, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** Owner marker file name. */
export const MARKER_FILE = '.dsh-blender-task.json'

/** Marker format version. */
export const MARKER_VERSION = 1

/** Subdirectories created inside every task directory. */
export const TASK_SUBDIRS = ['snapshots', 'captures', 'renders', 'exports']

/** Windows device names that may not be used as a directory name. */
const WINDOWS_RESERVED = new Set(
  ['CON', 'PRN', 'AUX', 'NUL', ...Array.from({ length: 9 }, (_, i) => `COM${i + 1}`), ...Array.from({ length: 9 }, (_, i) => `LPT${i + 1}`)].map(
    (name) => name.toLowerCase(),
  ),
)

/** @typedef {object} TaskMarker
 * @property {number} version
 * @property {string} sessionId
 * @property {string} task
 * @property {string} createdAt
 */

/** @typedef {object} TaskDir
 * @property {string} dir - absolute task directory
 * @property {string} name - directory name such as `.dsh-blender-lamp`
 * @property {TaskMarker} marker
 * @property {boolean} created - whether this call created the directory
 */

/**
 * Turn a task name into a safe directory slug.
 *
 * Keeps CJK, letters, digits, `-` and `_`; replaces everything else with `-`.
 * Reserved Windows device names are prefixed with `_`; the result is at most
 * 48 characters and falls back to `task`.
 *
 * @default maxLength = 48
 * @param {string} task - model-supplied task name
 * @param {number} [maxLength] - maximum slug length
 * @returns {string} safe slug
 */
export function slugifyTaskName(task, maxLength = 48) {
  let slug = ''
  for (const char of String(task)) {
    if (/[\p{L}\p{N}_-]/u.test(char)) slug += char
    else if (char === ' ' || char === '.') slug += '-'
    else slug += '-'
  }
  slug = slug.replace(/-+/g, '-').replace(/^[-_.]+|[-_.]+$/g, '').toLowerCase()
  if (slug === '') slug = 'task'
  if (WINDOWS_RESERVED.has(slug.toLowerCase())) slug = `_${slug}`
  return slug.slice(0, maxLength).replace(/[-_.]+$/g, '') || 'task'
}

/**
 * Directory name for one task slug.
 *
 * @param {string} task - model-supplied task name
 * @returns {string} `.dsh-blender-<slug>`
 */
export function taskDirName(task) {
  return `.dsh-blender-${slugifyTaskName(task)}`
}

/**
 * Decide where task directories live.
 *
 * `taskRoot` wins when non-empty; otherwise `taskRootMode` decides between the
 * open `.blend` directory and the session workspace (unsaved file).
 *
 * @default config.taskRootMode = 'blendFile'
 * @param {object} options - root options
 * @param {string} options.filePath - current `.blend` path, empty when unsaved
 * @param {string} options.workspaceDir - absolute session workspace
 * @param {string} [options.taskRoot] - fixed root override
 * @param {string} [options.taskRootMode] - `blendFile` or `workspace`
 * @returns {{ root: string, reason: string }} absolute root and why it was chosen
 */
export function resolveTaskRoot({ filePath, workspaceDir, taskRoot, taskRootMode = 'blendFile' }) {
  if (taskRoot && taskRoot.trim() !== '') {
    const root = path.resolve(workspaceDir, taskRoot.trim())
    return { root, reason: 'config.taskRoot' }
  }
  if (taskRootMode === 'workspace') return { root: path.resolve(workspaceDir), reason: 'taskRootMode=workspace' }
  if (filePath && filePath.trim() !== '') {
    return { root: path.dirname(path.resolve(filePath)), reason: 'blendFile' }
  }
  return { root: path.resolve(workspaceDir), reason: 'unsaved-file' }
}

/**
 * Create (or reuse) one task directory and its owner marker.
 *
 * Existing directories without a marker, or with another session's marker,
 * are treated as someone else's data and skipped via `-2`, `-3`, ...
 *
 * @param {object} options - task options
 * @param {string} options.root - absolute task root
 * @param {string} options.task - model-supplied task name
 * @param {string} options.sessionId - owning session
 * @returns {Promise<TaskDir>} claimed task directory
 */
export async function ensureTaskDir({ root, task, sessionId }) {
  const base = taskDirName(task)
  const resolvedRoot = path.resolve(root)
  const realRoot = await realpath(resolvedRoot).catch(() => resolvedRoot)
  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const name = attempt === 1 ? base : `${base}-${attempt}`
    const dir = path.join(root, name)
    const createdPath = await mkdir(dir, { recursive: true })
    const realDir = await realpath(dir).catch(() => path.resolve(dir))
    if (!isInsideResolved(realDir, realRoot)) {
      throw new Error(`Task directory escapes its root through a link: ${dir}`)
    }
    if (createdPath === undefined) {
      // The directory already existed. Reuse only when it carries our own
      // marker and the same logical task; an unmarked or foreign directory
      // belongs to someone else.
      const existing = await readTaskMarker(dir)
      if (existing && existing.sessionId === sessionId && slugifyTaskName(existing.task) === slugifyTaskName(task)) {
        await ensureTaskSubdirs(dir)
        return { dir, name, marker: existing, created: false }
      }
      continue
    }
    const marker = {
      version: MARKER_VERSION,
      sessionId,
      task,
      createdAt: new Date().toISOString(),
    }
    await writeFile(path.join(dir, MARKER_FILE), `${JSON.stringify(marker, null, 2)}\n`, { flag: 'wx' })
    await ensureTaskSubdirs(dir)
    return { dir, name, marker, created: true }
  }
  throw new Error(`Could not claim a task directory for "${task}" under ${root} (50 candidates used).`)
}

/**
 * Find an existing task directory owned by this session without creating one.
 *
 * Read-only tools such as `blender_mcp_render_status` must not claim a new
 * directory just to read a status file. Numbered candidates are checked in
 * order until the attempt limit, so a foreign `-2` does not hide our `-3`.
 *
 * @param {object} options - lookup options
 * @param {string} options.root - absolute task root
 * @param {string} options.task - model-supplied task name
 * @param {string} options.sessionId - owning session
 * @returns {Promise<TaskDir | null>} existing owned directory or null
 */
export async function findTaskDir({ root, task, sessionId }) {
  const base = taskDirName(task)
  const resolvedRoot = path.resolve(root)
  const realRoot = await realpath(resolvedRoot).catch(() => resolvedRoot)
  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const name = attempt === 1 ? base : `${base}-${attempt}`
    const dir = path.join(resolvedRoot, name)
    let info
    try {
      info = await stat(dir)
    } catch {
      continue
    }
    if (!info.isDirectory()) continue
    const realDir = await realpath(dir).catch(() => path.resolve(dir))
    if (!isInsideResolved(realDir, realRoot)) continue
    const marker = await readTaskMarker(dir)
    if (marker && marker.sessionId === sessionId && slugifyTaskName(marker.task) === slugifyTaskName(task)) {
      return { dir, name, marker, created: false }
    }
  }
  return null
}

/**
 * Create the standard subdirectories for one task.
 *
 * @param {string} dir - task directory
 * @returns {Promise<void>} nothing
 */
export async function ensureTaskSubdirs(dir) {
  await Promise.all(TASK_SUBDIRS.map((name) => mkdir(path.join(dir, name), { recursive: true })))
}

/**
 * Read and validate the owner marker.
 *
 * @param {string} dir - task directory
 * @returns {Promise<TaskMarker | null>} marker or null when missing/invalid
 */
export async function readTaskMarker(dir) {
  try {
    const parsed = JSON.parse(await readFile(path.join(dir, MARKER_FILE), 'utf8'))
    if (!isRecord(parsed)) return null
    if (typeof parsed.sessionId !== 'string' || typeof parsed.task !== 'string') return null
    return {
      version: typeof parsed.version === 'number' ? parsed.version : MARKER_VERSION,
      sessionId: parsed.sessionId,
      task: parsed.task,
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : '',
    }
  } catch {
    return null
  }
}

/**
 * @typedef {object} TaskDirSummary
 * @property {string} name
 * @property {string} dir
 * @property {string} modifiedAt
 * @property {TaskMarker | null} marker
 * @property {number} snapshots
 * @property {string | null} newestSnapshot
 * @property {SnapshotInfo[]} snapshotDetails
 */

/**
 * @typedef {object} SnapshotInfo
 * @property {string} name
 * @property {number} bytes
 * @property {string} modifiedAt
 */

/**
 * List sibling task directories for `status`; never creates anything.
 *
 * @param {string} root - task root
 * @returns {Promise<TaskDirSummary[]>} task directories, newest first
 */
export async function listTaskDirs(root) {
  /** @type {TaskDirSummary[]} */
  const result = []
  /** @type {string[]} */
  let entries
  try {
    entries = await readdir(root)
  } catch {
    return result
  }
  for (const name of entries) {
    if (!name.startsWith('.dsh-blender-')) continue
    const dir = path.join(root, name)
    let info
    try {
      info = await stat(dir)
    } catch {
      continue
    }
    if (!info.isDirectory()) continue
    if (!isInsideTask(dir, root)) continue
    const snapshotDetails = await listSnapshotDetails(dir)
    result.push({
      name,
      dir,
      modifiedAt: info.mtime.toISOString(),
      marker: await readTaskMarker(dir),
      snapshots: snapshotDetails.length,
      newestSnapshot: snapshotDetails.at(-1)?.name ?? null,
      snapshotDetails,
    })
  }
  result.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1))
  return result
}

/**
 * Compare snapshot names by numeric generation.
 *
 * Names follow `<turn>-<seq>.blend`; plain lexical order would sort
 * `10-001` before `2-001`. Unrecognised names fall back to lexical order.
 *
 * @param {string} a - first name
 * @param {string} b - second name
 * @returns {number} negative when `a` is older
 */
export function compareSnapshotNames(a, b) {
  const left = /^(\d+)-(\d+)\.blend$/.exec(a)
  const right = /^(\d+)-(\d+)\.blend$/.exec(b)
  if (left === null || right === null) return a < b ? -1 : a > b ? 1 : 0
  const turn = Number(left[1]) - Number(right[1])
  if (turn !== 0) return turn
  return Number(left[2]) - Number(right[2])
}

/**
 * Snapshot metadata inside one task directory, oldest first.
 *
 * Reads directory entries and `stat` only; never opens the `.blend` contents.
 *
 * @param {string} taskDir - task directory
 * @returns {Promise<SnapshotInfo[]>} snapshot names, bytes and mtimes
 */
export async function listSnapshotDetails(taskDir) {
  let entries
  try {
    entries = await readdir(path.join(taskDir, 'snapshots'))
  } catch {
    return []
  }
  /** @type {SnapshotInfo[]} */
  const details = []
  for (const name of entries.filter((entry) => entry.endsWith('.blend')).sort(compareSnapshotNames)) {
    try {
      const info = await stat(path.join(taskDir, 'snapshots', name))
      if (!info.isFile()) continue
      details.push({ name, bytes: info.size, modifiedAt: info.mtime.toISOString() })
    } catch {
      // A snapshot may disappear while status is being read; skip it.
    }
  }
  return details
}

/**
 * Snapshot file names inside one task directory, oldest first.
 *
 * @param {string} taskDir - task directory
 * @returns {Promise<string[]>} `.blend` file names
 */
export async function listSnapshots(taskDir) {
  return (await listSnapshotDetails(taskDir)).map((snapshot) => snapshot.name)
}

/**
 * Whether a path stays inside the task directory, using real paths.
 *
 * @param {string} target - candidate path
 * @param {string} taskDir - task directory
 * @returns {boolean} containment result
 */
export function isInsideTask(target, taskDir) {
  return isInsideResolved(realPathFor(path.resolve(taskDir, target)), realPathFor(path.resolve(taskDir)))
}

/**
 * Compare two already-resolved paths; a drive root contains every child.
 *
 * @param {string} target - resolved candidate
 * @param {string} root - resolved root
 * @returns {boolean} containment result
 */
function isInsideResolved(target, root) {
  const normalizedTarget = normalizeCase(target)
  const normalizedRoot = normalizeCase(root)
  if (normalizedTarget === normalizedRoot) return true
  const prefix = normalizedRoot.endsWith(path.sep) ? normalizedRoot : `${normalizedRoot}${path.sep}`
  return normalizedTarget.startsWith(prefix)
}

/**
 * Resolve a path for comparison without requiring the leaf to exist.
 *
 * @param {string} value - absolute path
 * @returns {string} real path when possible, otherwise a resolved path
 */
function realPathFor(value) {
  const absolute = path.resolve(value)
  try {
    return realpathSync.native(absolute)
  } catch {
    const parent = path.dirname(absolute)
    if (parent === absolute) return absolute
    try {
      return path.join(realpathSync.native(parent), path.basename(absolute))
    } catch {
      return absolute
    }
  }
}

/**
 * Normalize a path for comparison; Windows paths are case-insensitive.
 *
 * @param {string} value - path
 * @returns {string} comparable path
 */
export function normalizeCase(value) {
  return process.platform === 'win32' ? value.toLowerCase() : value
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
