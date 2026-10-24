/**
 * Render job status files ("sidecars") and their read-only lookup.
 *
 * Every render writes `<renders>/<stem>.render.json` twice: `running` just
 * before `bpy.ops.render.render`, then `done` or `failed` in the same finally
 * block that restores the render settings. The file survives a lost reply or a
 * plugin restart, so `blender_mcp_render_status` can collect a render that
 * outlived its tool call without talking to Blender at all.
 *
 * @module lib/renderStatus
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { isInsideTask } from './taskDir.js'

/** File suffix for one render's status record. */
export const RENDER_STATUS_SUFFIX = '.render.json'

/** How many jobs `listRenderJobs` returns. */
export const MAX_RECENT_JOBS = 20

/**
 * @typedef {object} RenderStatusRecord
 * @property {number} version
 * @property {string} jobId
 * @property {string} path absolute PNG path
 * @property {'running'|'done'|'failed'} state
 * @property {number} startedAtMs epoch milliseconds
 * @property {number|null} finishedAtMs epoch milliseconds, null while running
 * @property {number} width requested width
 * @property {number} height requested height
 * @property {number} resolutionPercentage requested resolution scale
 * @property {number} samples requested samples
 * @property {string} engine engine used for the render
 * @property {number} timeoutMs foreground budget recorded by the plugin; 0 for background starts
 * @property {boolean} background whether the render was started in background mode
 * @property {number} bytes output size reported by Blender, 0 until done
 * @property {string} error failure text, empty unless the render failed
 */

/**
 * @typedef {object} RenderJobSummary
 * @property {string} statusPath absolute status path
 * @property {string} name status file name
 * @property {number} modifiedAtMs file modification time
 * @property {RenderStatusRecord|null} record parsed record, null when unreadable
 */

/**
 * Status path that belongs to a render PNG.
 *
 * @param {string} filePath - absolute `.png` path
 * @returns {string} absolute `.render.json` path
 */
export function renderStatusPathFor(filePath) {
  return filePath.replace(/\.png$/i, RENDER_STATUS_SUFFIX)
}

/**
 * Job id that belongs to a render PNG: the file stem.
 *
 * @param {string} filePath - absolute `.png` path
 * @returns {string} job id such as `render-20261024123456789`
 */
export function renderJobIdFor(filePath) {
  return path.basename(filePath).replace(/\.png$/i, '')
}

/**
 * Job id encoded in a status file name.
 *
 * @param {string} name - status file name
 * @returns {string} job id
 */
export function renderJobIdFromStatusName(name) {
  return name.endsWith(RENDER_STATUS_SUFFIX) ? name.slice(0, -RENDER_STATUS_SUFFIX.length) : name
}

/**
 * Whether a model-supplied job id may be joined into a path.
 *
 * @param {string} jobId - candidate job id
 * @returns {boolean} true when it is a bare file stem
 */
export function isRenderJobId(jobId) {
  if (typeof jobId !== 'string' || jobId === '') return false
  if (jobId.includes('..') || jobId.includes('/') || jobId.includes('\\')) return false
  if (path.basename(jobId) !== jobId) return false
  return /^[\p{L}\p{N}_-][\p{L}\p{N}_.-]*$/u.test(jobId)
}

/**
 * Read and validate one status file.
 *
 * @param {string} statusPath - absolute status path
 * @returns {Promise<{ kind: 'ok', record: RenderStatusRecord } | { kind: 'missing' } | { kind: 'invalid', message: string }>} read result
 */
export async function readRenderStatusFile(statusPath) {
  let text
  try {
    text = await readFile(statusPath, 'utf8')
  } catch {
    return { kind: 'missing' }
  }
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { kind: 'invalid', message: 'The render status file is not complete JSON yet.' }
  }
  const record = normalizeRenderStatus(parsed)
  if (record === null) {
    return { kind: 'invalid', message: 'The render status file does not carry a usable record.' }
  }
  return { kind: 'ok', record }
}

/**
 * List status files inside `<taskDir>/renders`, newest first.
 *
 * @param {string} taskDir - task directory
 * @returns {Promise<RenderJobSummary[]>} recent jobs, at most `MAX_RECENT_JOBS`
 */
export async function listRenderJobs(taskDir) {
  const rendersDir = path.join(taskDir, 'renders')
  /** @type {string[]} */
  let entries
  try {
    entries = await readdir(rendersDir)
  } catch {
    return []
  }
  /** @type {RenderJobSummary[]} */
  const jobs = []
  for (const name of entries) {
    if (!name.endsWith(RENDER_STATUS_SUFFIX)) continue
    const statusPath = path.join(rendersDir, name)
    if (!isInsideTask(statusPath, taskDir)) continue
    let info
    try {
      info = await stat(statusPath)
    } catch {
      continue
    }
    if (!info.isFile()) continue
    const read = await readRenderStatusFile(statusPath)
    jobs.push({
      statusPath,
      name,
      modifiedAtMs: info.mtimeMs,
      record: read.kind === 'ok' ? read.record : null,
    })
  }
  jobs.sort((a, b) => b.modifiedAtMs - a.modifiedAtMs)
  return jobs.slice(0, MAX_RECENT_JOBS)
}

/**
 * Locate one render job by id, or the newest one when no id is given.
 *
 * @param {string} taskDir - task directory
 * @param {string} [jobId] - optional job id from an earlier render result
 * @returns {Promise<
 *   | { kind: 'ok', jobId: string, statusPath: string, record: RenderStatusRecord, recent: RenderJobSummary[] }
 *   | { kind: 'missing', jobId: string, statusPath: string, recent: RenderJobSummary[] }
 *   | { kind: 'invalid', jobId: string, message: string, recent: RenderJobSummary[] }
 *   | { kind: 'empty', recent: RenderJobSummary[] }
 * >} lookup result
 */
export async function findRenderJob(taskDir, jobId) {
  const wanted = typeof jobId === 'string' ? jobId.trim() : ''
  if (wanted !== '') {
    if (!isRenderJobId(wanted)) {
      return { kind: 'invalid', jobId: wanted, message: `"${wanted}" is not a valid render job id.`, recent: await listRenderJobs(taskDir) }
    }
    const statusPath = path.join(taskDir, 'renders', `${wanted}${RENDER_STATUS_SUFFIX}`)
    const read = await readRenderStatusFile(statusPath)
    if (read.kind === 'missing') {
      return { kind: 'missing', jobId: wanted, statusPath, recent: await listRenderJobs(taskDir) }
    }
    if (read.kind === 'invalid') {
      return { kind: 'invalid', jobId: wanted, message: read.message, recent: await listRenderJobs(taskDir) }
    }
    if (read.record.jobId !== wanted) {
      return {
        kind: 'invalid',
        jobId: wanted,
        message: `The status file carries job id "${read.record.jobId}", not "${wanted}".`,
        recent: await listRenderJobs(taskDir),
      }
    }
    return { kind: 'ok', jobId: wanted, statusPath, record: read.record, recent: [] }
  }

  const jobs = await listRenderJobs(taskDir)
  if (jobs.length === 0) return { kind: 'empty', recent: [] }
  const newest = jobs[0]
  const derivedId = renderJobIdFromStatusName(newest.name)
  const read = await readRenderStatusFile(newest.statusPath)
  if (read.kind === 'ok') {
    return { kind: 'ok', jobId: derivedId, statusPath: newest.statusPath, record: read.record, recent: jobs }
  }
  return {
    kind: 'invalid',
    jobId: derivedId,
    message: read.kind === 'invalid' ? read.message : 'The newest render status file is missing.',
    recent: jobs,
  }
}

/**
 * Validate and normalize one decoded status object.
 *
 * @param {unknown} value - parsed JSON
 * @returns {RenderStatusRecord | null} normalized record, or null when unusable
 */
function normalizeRenderStatus(value) {
  if (!isRecord(value)) return null
  const state =
    value.state === 'running' || value.state === 'done' || value.state === 'failed' ? value.state : null
  if (state === null) return null
  const target = typeof value.path === 'string' ? value.path : ''
  if (target === '') return null
  const derivedId = renderJobIdFor(target)
  const jobId = typeof value.jobId === 'string' && value.jobId !== '' ? value.jobId : derivedId
  return {
    version: numberOr(value.version, 1),
    jobId,
    path: target,
    state,
    startedAtMs: numberOr(value.startedAtMs, 0),
    finishedAtMs: typeof value.finishedAtMs === 'number' && Number.isFinite(value.finishedAtMs) ? value.finishedAtMs : null,
    width: numberOr(value.width, 0),
    height: numberOr(value.height, 0),
    resolutionPercentage: numberOr(value.resolutionPercentage, 100),
    samples: numberOr(value.samples, 0),
    engine: typeof value.engine === 'string' ? value.engine : '',
    timeoutMs: numberOr(value.timeoutMs, 0),
    background: value.background === true,
    bytes: numberOr(value.bytes, 0),
    error: typeof value.error === 'string' ? value.error : '',
  }
}

/**
 * @param {unknown} value - candidate number
 * @param {number} fallback - value to use when unusable
 * @returns {number} finite number or the fallback
 */
function numberOr(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
