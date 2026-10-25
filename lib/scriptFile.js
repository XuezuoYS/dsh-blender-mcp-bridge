/**
 * One `.py` script from a task directory, ready to be scanned and run.
 *
 * The model may keep long snippets in files instead of one tool argument. This
 * module is the only place that reads such a file: it refuses anything outside
 * the task directory, keeps the text it scanned, and can re-check right before
 * the call is sent that the bytes on disk did not move.
 *
 * @module lib/scriptFile
 */

import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { isInsideTask } from './taskDir.js'

/** Largest script accepted; its text rides inside one guarded payload. */
export const SCRIPT_MAX_BYTES = 256 * 1024

/** @typedef {'not-python'|'outside-task'|'not-found'|'not-a-file'|'too-large'|'empty'|'read-failed'|'changed'} ScriptErrorCode */

/** @typedef {object} ScriptFile
 * @property {string} relPath - path relative to the task directory, `/` separated
 * @property {string} absPath - absolute path on disk
 * @property {string} content - decoded text that was scanned (BOM removed)
 * @property {string} sha256 - sha256 of `content`
 * @property {number} bytes - byte length of `content`
 */

/**
 * A script path or script text that cannot be used.
 *
 * 契约摘要：`code` 是稳定分类，`message` 直接给模型看；调用方按 `code` 决定返回
 * `invalid-script` 还是 `refused`，不要把这条错误当成 Blender 的回复。
 *
 * 常用入口：
 * - `readTaskScript`: 读取并校验任务目录里的 `.py`
 * - `assertScriptUnchanged`: 发送前确认文件没被改
 */
export class ScriptError extends Error {
  /**
   * @param {ScriptErrorCode} code - stable classification
   * @param {string} message - model-facing explanation
   */
  constructor(code, message) {
    super(message)
    this.name = 'ScriptError'
    this.code = code
  }
}

/**
 * Read one `.py` script from a task directory.
 *
 * @param {object} options - read options
 * @param {string} options.taskDir - absolute task directory
 * @param {string} options.scriptPath - absolute path, or a path relative to `taskDir`
 * @returns {Promise<ScriptFile>} validated script
 */
export async function readTaskScript({ taskDir, scriptPath }) {
  const raw = String(scriptPath).trim()
  if (path.extname(raw).toLowerCase() !== '.py') {
    throw new ScriptError('not-python', `scriptPath must point at a .py file: "${raw}".`)
  }
  if (!isInsideTask(raw, taskDir)) {
    throw new ScriptError('outside-task', `scriptPath must stay inside the task directory "${taskDir}": "${raw}".`)
  }
  const absPath = path.resolve(taskDir, raw)
  let info
  try {
    info = await stat(absPath)
  } catch {
    throw new ScriptError('not-found', `No script file at "${absPath}". Write the .py file under "${taskDir}" first.`)
  }
  if (!info.isFile()) {
    throw new ScriptError('not-a-file', `"${absPath}" is not a regular file.`)
  }
  if (info.size > SCRIPT_MAX_BYTES) {
    throw new ScriptError(
      'too-large',
      `The script "${absPath}" is ${String(info.size)} bytes; the limit is ${String(SCRIPT_MAX_BYTES)}. Split it or send the snippets with batch.`,
    )
  }
  let text
  try {
    text = await readFile(absPath, 'utf8')
  } catch (error) {
    throw new ScriptError('read-failed', `Could not read "${absPath}": ${messageOf(error)}`)
  }
  const content = stripBom(text)
  if (content.trim() === '') {
    throw new ScriptError('empty', `The script "${absPath}" is empty.`)
  }
  return {
    relPath: path.relative(path.resolve(taskDir), absPath).split(path.sep).join('/'),
    absPath,
    content,
    sha256: sha256Hex(content),
    bytes: Buffer.byteLength(content, 'utf8'),
  }
}

/**
 * Fail when the file on disk no longer matches the text that was scanned.
 *
 * Called as late as possible before the payload is sent; a file that vanished
 * counts as changed, because the plugin cannot prove what would run.
 *
 * @param {ScriptFile} script - script returned by `readTaskScript`
 * @returns {Promise<void>} nothing when the file still matches
 */
export async function assertScriptUnchanged(script) {
  let text
  try {
    text = await readFile(script.absPath, 'utf8')
  } catch (error) {
    throw new ScriptError('changed', `The script "${script.absPath}" could not be re-read before sending: ${messageOf(error)}`)
  }
  if (stripBom(text) !== script.content) {
    throw new ScriptError(
      'changed',
      `The script "${script.absPath}" changed after it was scanned. Nothing ran; read the file again and resend it with scriptPath.`,
    )
  }
}

/**
 * Remove one leading byte-order mark, which `compile()` would reject.
 *
 * @param {string} text - decoded file text
 * @returns {string} text without a leading BOM
 */
function stripBom(text) {
  return text.startsWith('\uFEFF') ? text.slice(1) : text
}

/**
 * @param {string} text - script text
 * @returns {string} sha256 in lowercase hex
 */
function sha256Hex(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

/**
 * @param {unknown} error - thrown value
 * @returns {string} readable message
 */
function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}
