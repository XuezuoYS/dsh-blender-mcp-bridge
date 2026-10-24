/**
 * Plugin-owned settings storage.
 *
 * Settings live under `DSH_HOME/dsh-blender-mcp-bridge/` as several small JSON
 * files instead of the DSH profile patch. Each file is a fragment of the same
 * schema, carries its own `schemaVersion`, and is written atomically. The
 * profile values are used once (when a file is missing) so an existing install
 * keeps its settings; after that these files are the only source of truth.
 *
 * @module lib/settingsStore
 */

import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Config, pickKnown } from './config.js'

/** Settings schema version written into every file. */
export const SETTINGS_SCHEMA = 1
/** Minimum delay between disk-change checks. */
const RELOAD_THROTTLE_MS = 1000
/** Maximum number of operations in one save. */
const MAX_OPS = 100

/** Config keys owned by each settings file. */
export const SETTINGS_FILES = {
  connection: [
    'host',
    'port',
    'maxConcurrentSends',
    'connectTimeoutMs',
    'responseTimeoutMs',
    'captureTimeoutMs',
    'renderTimeoutMs',
    'maxResponseChars',
  ],
  snapshot: ['snapshot'],
  safety: ['guard', 'audit'],
  task: ['taskRootMode', 'taskRoot'],
  helper: ['helper'],
}

/** File name for each settings file. */
export const SETTINGS_FILE_NAMES = {
  connection: 'connection.json',
  snapshot: 'snapshot.json',
  safety: 'safety.json',
  task: 'task.json',
  helper: 'helper.json',
}

/** Settings storage or validation failure. */
export class SettingsStoreError extends Error {
  /**
   * @param {'invalid'|'write-failed'|'read-failed'} kind - stable reason code
   * @param {string} message - readable explanation
   */
  constructor(kind, message) {
    super(message)
    this.name = 'SettingsStoreError'
    this.kind = kind
  }
}

/** @typedef {'connection'|'snapshot'|'safety'|'task'|'helper'} SettingsFileName */

/**
 * @typedef {object} SettingsStore
 * @property {{ dir: string, files: Record<string, string> }} paths
 * @property {() => any} get
 * @property {() => any} getDefaults
 * @property {() => string} getRevision
 * @property {() => string} getUpdatedAt
 * @property {() => boolean} isLoaded
 * @property {(ops: { op: string, path: string[], value: any }[], expectedRevision: string) => { ok: boolean, conflict?: boolean, value: any, revision: string, updatedAt: string }} update
 * @property {() => boolean} reload
 */

/** Every settings file name in a fixed order. @type {SettingsFileName[]} */
const FILE_NAMES = /** @type {SettingsFileName[]} */ (Object.keys(SETTINGS_FILES))

/**
 * @param {string} dshHome - DSH storage root
 * @returns {string} plugin data directory
 */
export function settingsDir(dshHome) {
  return path.join(dshHome, 'dsh-blender-mcp-bridge')
}

/**
 * @param {any} value - plain settings
 * @returns {string} stable revision hash
 */
function revisionOf(value) {
  return `sha256:${createHash('sha256').update(JSON.stringify(value)).digest('hex')}`
}

/**
 * Build the settings store for one plugin instance.
 *
 * @param {object} options - store options
 * @param {string} options.dshHome - DSH storage root
 * @param {any} options.defaults - plain schema defaults
 * @param {any} [options.legacy] - one-time values from the DSH profile
 * @param {(message: string) => void} [options.warn] - warning sink
 * @param {() => Date} [options.now] - clock override for tests
 * @returns {SettingsStore} store
 */
export function createSettingsStore({ dshHome, defaults, legacy = defaults, warn = () => {}, now = () => new Date() }) {
  const dir = settingsDir(dshHome)
  /** @type {Record<SettingsFileName, string>} */
  const filePaths = /** @type {Record<SettingsFileName, string>} */ ({})
  for (const [name, fileName] of Object.entries(SETTINGS_FILE_NAMES)) {
    filePaths[/** @type {SettingsFileName} */ (name)] = path.join(dir, fileName)
  }

  let value = pickKnown(defaults, defaults)
  let revision = revisionOf(value)
  let updatedAt = now().toISOString()
  let lastCheckAt = 0
  /** @type {Map<string, string | null>} */
  const mtimes = new Map()
  let loaded = false

  /**
   * @param {SettingsFileName} name - settings file name
   * @returns {any} fragment template for that file
   */
  const groupTemplate = (name) => {
    /** @type {Record<string, any>} */
    const out = {}
    for (const key of SETTINGS_FILES[name]) out[key] = defaults[key]
    return out
  }

  /**
   * @param {any} source - full settings
   * @param {SettingsFileName} name - settings file name
   * @returns {any} fragment
   */
  const extractGroup = (source, name) => pickKnown(source, groupTemplate(name))

  /**
   * @param {Record<string, any>} groups - per-file fragments
   * @returns {any} merged settings
   */
  const mergeGroups = (groups) => {
    const merged = pickKnown(defaults, defaults)
    for (const name of FILE_NAMES) Object.assign(merged, groups[name])
    return merged
  }

  /**
   * @param {any} candidate - settings to validate
   * @returns {void}
   * @throws {SettingsStoreError} when the schema rejects the value
   */
  const validate = (candidate) => {
    try {
      Config(candidate)
    } catch (error) {
      throw new SettingsStoreError('invalid', error instanceof Error ? error.message : String(error))
    }
  }

  /**
   * @param {SettingsFileName} name - settings file name
   * @returns {void}
   */
  const recordMtime = (name) => {
    try {
      const info = statSync(filePaths[name])
      mtimes.set(name, `${info.mtimeMs}:${info.size}`)
    } catch {
      mtimes.set(name, null)
    }
  }

  /**
   * @param {SettingsFileName} name - settings file name
   * @returns {void}
   */
  const backup = (name) => {
    try {
      copyFileSync(filePaths[name], `${filePaths[name]}.bak`)
    } catch {
      // A missing or unreadable file needs no backup.
    }
  }

  /**
   * @param {SettingsFileName} name - settings file name
   * @param {any} fragment - values to write
   * @param {string} stamp - ISO timestamp
   * @returns {void}
   * @throws {SettingsStoreError} when the write fails
   */
  const writeGroup = (name, fragment, stamp) => {
    const file = filePaths[name]
    const temp = `${file}.${process.pid}.${Date.now()}.tmp`
    try {
      mkdirSync(dir, { recursive: true })
      writeFileSync(
        temp,
        `${JSON.stringify({ schemaVersion: SETTINGS_SCHEMA, updatedAt: stamp, values: fragment }, null, 2)}\n`,
        'utf8',
      )
      try {
        renameSync(temp, file)
      } catch {
        rmSync(file, { force: true })
        renameSync(temp, file)
      }
      recordMtime(name)
    } catch (error) {
      try {
        rmSync(temp, { force: true })
      } catch {
        // Best effort.
      }
      throw new SettingsStoreError(
        'write-failed',
        `Could not write ${file}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * @param {SettingsFileName} name - settings file name
   * @returns {{ found: boolean, values: any, error: string }} read result
   */
  const readGroup = (name) => {
    const file = filePaths[name]
    if (!existsSync(file)) return { found: false, values: null, error: '' }
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf8'))
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('file must contain a JSON object')
      }
      if (typeof parsed.schemaVersion === 'number' && parsed.schemaVersion > SETTINGS_SCHEMA) {
        warn(`${file} uses schemaVersion ${parsed.schemaVersion}; reading it with schema ${SETTINGS_SCHEMA}.`)
      }
      const raw = parsed.values !== undefined ? parsed.values : parsed
      if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
        throw new Error('"values" must be a JSON object')
      }
      return { found: true, values: pickKnown(raw, groupTemplate(name)), error: '' }
    } catch (error) {
      return {
        found: true,
        values: null,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Read every file, migrating missing ones from the profile values.
   *
   * @returns {void}
   */
  const loadInitial = () => {
    /** @type {Record<string, any>} */
    const groups = {}
    for (const name of FILE_NAMES) {
      const read = readGroup(name)
      if (read.found && read.error === '') {
        groups[name] = read.values
        recordMtime(name)
        continue
      }
      if (read.found && read.error !== '') {
        warn(`${filePaths[name]} is invalid (${read.error}); a .bak copy is kept and defaults are used.`)
        backup(name)
      }
      groups[name] = pickKnown(legacy, groupTemplate(name))
      try {
        writeGroup(name, groups[name], now().toISOString())
      } catch (error) {
        warn(error instanceof Error ? error.message : String(error))
      }
    }
    const candidate = mergeGroups(groups)
    try {
      validate(candidate)
      value = candidate
    } catch (error) {
      warn(`settings validation failed (${error instanceof Error ? error.message : String(error)}); using defaults.`)
      value = pickKnown(defaults, defaults)
    }
    revision = revisionOf(value)
    updatedAt = now().toISOString()
    lastCheckAt = Date.now()
    loaded = true
  }

  /**
   * Re-read files changed on disk. External edits apply without a restart.
   *
   * @returns {boolean} whether the in-memory value changed
   */
  const reload = () => {
    try {
      /** @type {Record<string, any>} */
      const groups = {}
      for (const name of FILE_NAMES) {
        const read = readGroup(name)
        if (read.found && read.error !== '') {
          throw new SettingsStoreError('read-failed', `${filePaths[name]} is invalid: ${read.error}`)
        }
        groups[name] = read.found ? read.values : pickKnown(defaults, groupTemplate(name))
        recordMtime(name)
      }
      const candidate = mergeGroups(groups)
      validate(candidate)
      value = candidate
      revision = revisionOf(value)
      updatedAt = now().toISOString()
      lastCheckAt = Date.now()
      return true
    } catch (error) {
      warn(`settings reload failed: ${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  /**
   * Check file mtimes at most once per second.
   *
   * @returns {void}
   */
  const maybeReload = () => {
    if (!loaded) return
    const nowMs = Date.now()
    if (nowMs - lastCheckAt < RELOAD_THROTTLE_MS) return
    lastCheckAt = nowMs
    let changed = false
    for (const name of FILE_NAMES) {
      let key = null
      try {
        const info = statSync(filePaths[name])
        key = `${info.mtimeMs}:${info.size}`
      } catch {
        key = null
      }
      if (key !== (mtimes.get(name) ?? null)) {
        changed = true
        break
      }
    }
    if (changed) reload()
  }

  /**
   * @param {any} target - settings being edited
   * @param {any} template - defaults
   * @param {string[]} keys - path segments
   * @param {any} nextValue - value to set
   * @returns {void}
   * @throws {SettingsStoreError} for an unknown or unsafe path
   */
  const setAtPath = (target, template, keys, nextValue) => {
    if (keys.length === 0 || keys.length > 3) throw new SettingsStoreError('invalid', 'Invalid settings path.')
    let templateNode = template
    let targetNode = target
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index]
      if (
        typeof key !== 'string' ||
        key === '' ||
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype'
      ) {
        throw new SettingsStoreError('invalid', `Unsafe settings key "${String(key)}".`)
      }
      if (templateNode === null || typeof templateNode !== 'object' || !Object.hasOwn(templateNode, key)) {
        throw new SettingsStoreError('invalid', `Unknown settings path "${keys.join('.')}".`)
      }
      if (index === keys.length - 1) {
        targetNode[key] = structuredClone(nextValue)
        return
      }
      if (templateNode[key] === null || typeof templateNode[key] !== 'object') {
        throw new SettingsStoreError('invalid', `Unknown settings path "${keys.join('.')}".`)
      }
      templateNode = templateNode[key]
      if (targetNode[key] === null || typeof targetNode[key] !== 'object') targetNode[key] = {}
      targetNode = targetNode[key]
    }
  }

  /**
   * Apply one save operation list.
   *
   * @param {{ op: string, path: string[], value: any }[]} ops - operations
   * @param {string} expectedRevision - revision the editor saw
   * @returns {{ ok: boolean, conflict?: boolean, value: any, revision: string, updatedAt: string }} result
   * @throws {SettingsStoreError} for invalid operations or a failed write
   */
  const update = (ops, expectedRevision) => {
    // A save must compare against the newest on-disk revision, not a value that
    // may have been cached up to a second ago.
    lastCheckAt = 0
    maybeReload()
    if (typeof expectedRevision !== 'string' || expectedRevision === '') {
      throw new SettingsStoreError('invalid', 'A settings revision is required.')
    }
    if (expectedRevision !== revision) {
      return { ok: false, conflict: true, value, revision, updatedAt }
    }
    if (!Array.isArray(ops) || ops.length === 0) throw new SettingsStoreError('invalid', 'No settings changes were provided.')
    if (ops.length > MAX_OPS) throw new SettingsStoreError('invalid', `At most ${MAX_OPS} settings changes are allowed.`)
    const next = pickKnown(value, defaults)
    for (const op of ops) {
      if (op === null || typeof op !== 'object' || op.op !== 'set' || !Array.isArray(op.path)) {
        throw new SettingsStoreError('invalid', 'Each settings operation must be { op: "set", path, value }.')
      }
      setAtPath(next, defaults, op.path, op.value)
    }
    validate(next)
    const stamp = now().toISOString()
    for (const name of FILE_NAMES) writeGroup(name, extractGroup(next, name), stamp)
    value = next
    revision = revisionOf(value)
    updatedAt = stamp
    lastCheckAt = Date.now()
    return { ok: true, value, revision, updatedAt }
  }

  loadInitial()

  return {
    paths: { dir, files: filePaths },
    /** @returns {any} current settings */
    get() {
      maybeReload()
      return value
    },
    /** @returns {any} fresh default settings */
    getDefaults() {
      return pickKnown(defaults, defaults)
    },
    /** @returns {string} current revision */
    getRevision() {
      maybeReload()
      return revision
    },
    /** @returns {string} current updatedAt */
    getUpdatedAt() {
      return updatedAt
    },
    /** @returns {boolean} whether the files were read at least once */
    isLoaded: () => loaded,
    update,
    reload,
  }
}
