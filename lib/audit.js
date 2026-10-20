/**
 * Audit trail: one JSONL line per write, plus a before/after fingerprint of the
 * user's `.blend` so a real save never goes unnoticed.
 *
 * @module lib/audit
 */

import { createHash } from 'node:crypto'
import { mkdir, open, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'

/** Rotate the audit file before it grows past this size. */
const AUDIT_MAX_BYTES = 2 * 1024 * 1024

/** @typedef {object} FileFingerprint
 * @property {boolean} exists
 * @property {number} size
 * @property {number} mtimeMs
 */

/**
 * Fingerprint one file without failing when it does not exist.
 *
 * @param {string} filePath - absolute path
 * @returns {Promise<FileFingerprint>} fingerprint
 */
export async function fileFingerprint(filePath) {
  try {
    const info = await stat(filePath)
    return { exists: true, size: info.size, mtimeMs: info.mtimeMs }
  } catch {
    return { exists: false, size: 0, mtimeMs: 0 }
  }
}

/**
 * Whether the user's file changed between two fingerprints.
 *
 * @param {FileFingerprint} before - before the write
 * @param {FileFingerprint} after - after the write
 * @returns {boolean} true when size or mtime moved
 */
export function fileChanged(before, after) {
  return before.exists !== after.exists || before.size !== after.size || before.mtimeMs !== after.mtimeMs
}

/**
 * Append one audit record to `<taskDir>/audit.jsonl`.
 *
 * @default storeCode = false
 * @param {object} options - audit options
 * @param {string} options.taskDir - task directory
 * @param {Record<string, unknown>} options.entry - record fields
 * @param {string} [options.code] - user code to hash and optionally store
 * @param {boolean} [options.storeCode] - store the code text
 * @returns {Promise<string>} sha256 of the code (empty when no code)
 */
export async function appendAudit({ taskDir, entry, code = '', storeCode = false }) {
  const codeSha256 = code === '' ? '' : createHash('sha256').update(code).digest('hex')
  const record = {
    time: new Date().toISOString(),
    ...entry,
    ...(codeSha256 === '' ? {} : { codeSha256 }),
    ...(storeCode && code !== '' ? { code } : {}),
  }
  await mkdir(taskDir, { recursive: true })
  const auditPath = path.join(taskDir, 'audit.jsonl')
  try {
    const info = await stat(auditPath)
    if (info.size >= AUDIT_MAX_BYTES) {
      await rm(`${auditPath}.1`, { force: true })
      await rename(auditPath, `${auditPath}.1`)
    }
  } catch {
    // No previous audit file, or rotation lost a race with another process.
  }
  const handle = await open(auditPath, 'a')
  try {
    await handle.writeFile(`${JSON.stringify(record)}\n`, 'utf8')
  } finally {
    await handle.close()
  }
  return codeSha256
}
