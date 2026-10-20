/**
 * Curated helper catalog: names, scripts, parameters and output defaults.
 *
 * The data comes from the upstream create-3d-model argparse definitions; this
 * module adds validation, path direction and deterministic output paths under
 * the task directory.
 *
 * @module lib/helperCatalog
 */

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { HELPERS } from './helperCatalogData.js'
import { isInsideTask } from './taskDir.js'

/** @typedef {'string'|'integer'|'number'|'boolean'} ScalarType */
/** @typedef {{ type: ScalarType } | { type: 'array', items: { type: ScalarType } }} ParamType */

/**
 * @typedef {object} HelperParam
 * @property {string} name
 * @property {string | null} flag
 * @property {boolean} positional
 * @property {ParamType} type
 * @property {boolean} required
 * @property {'in'|'out'|'in-dir'|'out-dir'|'none'} path
 * @property {boolean} [defaultOutput]
 */

/**
 * @typedef {object} HelperSpec
 * @property {string} name
 * @property {string} script
 * @property {'python'|'blender'} runtime
 * @property {boolean} maintenance
 * @property {string[]} dependencies
 * @property {HelperParam[]} params
 */

/** @type {HelperSpec[]} */
export const HELPER_SPECS = /** @type {HelperSpec[]} */ (HELPERS)

/** Invalid helper arguments. */
export class HelperArgsError extends Error {
  /**
   * @param {string} message - readable explanation
   */
  constructor(message) {
    super(message)
    this.name = 'HelperArgsError'
  }
}

/**
 * List helpers; maintenance helpers stay hidden unless enabled.
 *
 * @default includeMaintenance = false
 * @param {boolean} [includeMaintenance] - include maintenance helpers
 * @returns {HelperSpec[]} visible helpers
 */
export function listHelpers(includeMaintenance = false) {
  return HELPER_SPECS.filter((helper) => includeMaintenance || !helper.maintenance)
}

/**
 * Find one helper by name.
 *
 * @param {string} name - helper name
 * @returns {HelperSpec | undefined} helper spec
 */
export function getHelper(name) {
  return HELPER_SPECS.find((helper) => helper.name === name)
}

/**
 * Validate arguments and fill deterministic outputs.
 *
 * @param {HelperSpec} helper - helper spec
 * @param {Record<string, unknown>} args - model arguments
 * @param {string} taskDir - task directory
 * @returns {Promise<{ argv: string[], outputs: { param: string, path: string, kind: string }[] }>} command parts
 */
export async function buildHelperCommand(helper, args, taskDir) {
  const values = validateHelperArgs(helper, args)
  const outputs = []
  for (const param of helper.params) {
    if (param.path !== 'out' && param.path !== 'out-dir') continue
    let value = values.get(param.name)
    if (value === undefined) {
      if (!param.defaultOutput) continue
      value = defaultOutputPath(helper, param, taskDir)
      values.set(param.name, value)
    }
    const resolved = path.isAbsolute(String(value)) ? String(value) : path.join(taskDir, String(value))
    if (!isInsideTask(resolved, taskDir)) {
      throw new HelperArgsError(`Output "${param.name}" must stay inside the task directory: ${resolved}`)
    }
    if (param.path === 'out-dir') await mkdir(resolved, { recursive: true })
    else await mkdir(path.dirname(resolved), { recursive: true })
    values.set(param.name, resolved)
    outputs.push({ param: param.name, path: resolved, kind: param.path })
  }

  const argv = []
  for (const param of helper.params) {
    const value = values.get(param.name)
    if (value === undefined || value === null) continue
    if (param.positional) {
      if (Array.isArray(value)) {
        for (const item of value) assertSafeArgvValue(helper, param, item)
        argv.push(...value.map(String))
      } else {
        assertSafeArgvValue(helper, param, value)
        argv.push(String(value))
      }
      continue
    }
    if (param.type.type === 'boolean') {
      if (value === true && param.flag !== null) argv.push(param.flag)
      continue
    }
    if (param.flag === null) continue
    if (Array.isArray(value)) {
      for (const item of value) assertSafeArgvValue(helper, param, item)
      argv.push(param.flag, ...value.map(String))
    } else {
      assertSafeArgvValue(helper, param, value)
      argv.push(param.flag, String(value))
    }
  }
  return { argv, outputs }
}

/**
 * Type of one scalar value described by a helper parameter.
 *
 * @param {HelperParam} param - parameter metadata
 * @returns {ScalarType} scalar type (array item type for arrays)
 */
function scalarTypeOf(param) {
  return param.type.type === 'array' ? param.type.items.type : param.type.type
}

/**
 * Refuse a string value that argparse could read as an option.
 *
 * The helper catalog turns model-supplied arrays into argv, so a value such as
 * `--out` would otherwise become a new option and override the resolved output
 * path. Numeric values may legitimately start with "-" (negative coordinates),
 * and output paths are always absolute by this point.
 *
 * @param {HelperSpec} helper - helper metadata
 * @param {HelperParam} param - parameter metadata
 * @param {unknown} value - one value about to enter argv
 * @returns {void}
 */
function assertSafeArgvValue(helper, param, value) {
  if (scalarTypeOf(param) !== 'string') return
  const text = String(value)
  if (text.startsWith('-')) {
    throw new HelperArgsError(
      `Parameter "${param.name}" of "${helper.name}" must not start with "-": ${text}`,
    )
  }
}

/**
 * Check names and value types without touching the file system.
 *
 * @param {HelperSpec} helper - helper spec
 * @param {Record<string, unknown>} args - model arguments
 * @returns {Map<string, unknown>} validated values by parameter name
 */
export function validateHelperArgs(helper, args) {
  if (typeof args !== 'object' || args === null || Array.isArray(args)) {
    throw new HelperArgsError('args must be an object keyed by helper parameter name.')
  }
  const byName = new Map(helper.params.map((param) => [param.name, param]))
  for (const key of Object.keys(args)) {
    if (!byName.has(key)) {
      throw new HelperArgsError(`Unknown parameter "${key}" for helper "${helper.name}".`)
    }
  }
  /** @type {Map<string, unknown>} */
  const values = new Map()
  for (const param of helper.params) {
    const value = args[param.name]
    if (value === undefined) {
      if (param.required && param.path !== 'out' && param.path !== 'out-dir') {
        throw new HelperArgsError(`Missing required parameter "${param.name}" for helper "${helper.name}".`)
      }
      continue
    }
    values.set(param.name, checkType(helper, param, value))
  }
  return values
}

/**
 * @param {HelperSpec} helper - helper spec
 * @param {HelperParam} param - parameter
 * @param {unknown} value - candidate value
 * @returns {unknown} validated value
 */
function checkType(helper, param, value) {
  if (param.type.type === 'array') {
    if (!Array.isArray(value)) {
      throw new HelperArgsError(`Parameter "${param.name}" of "${helper.name}" must be an array.`)
    }
    const itemType = param.type.items.type
    for (const item of value) checkScalar(helper, param, itemType, item)
    return value
  }
  checkScalar(helper, param, param.type.type, value)
  return value
}

/**
 * @param {HelperSpec} helper - helper spec
 * @param {HelperParam} param - parameter
 * @param {ScalarType} type - expected scalar type
 * @param {unknown} value - candidate value
 * @returns {void}
 */
function checkScalar(helper, param, type, value) {
  const ok =
    type === 'string'
      ? typeof value === 'string'
      : type === 'integer'
        ? typeof value === 'number' && Number.isInteger(value)
        : type === 'number'
          ? typeof value === 'number' && Number.isFinite(value)
          : typeof value === 'boolean'
  if (!ok) {
    throw new HelperArgsError(`Parameter "${param.name}" of "${helper.name}" must be ${type}.`)
  }
}

/**
 * Deterministic output path used when the model omits an output parameter.
 *
 * @param {HelperSpec} helper - helper spec
 * @param {HelperParam} param - output parameter
 * @param {string} taskDir - task directory
 * @returns {string} absolute path
 */
function defaultOutputPath(helper, param, taskDir) {
  const extension =
    param.path === 'out-dir'
      ? ''
      : param.name === 'out-image' || param.name === 'overlay' || param.name === 'mask-out'
        ? '.png'
        : param.name === 'blender-script'
          ? '.py'
          : param.name === 'method-md'
            ? '.md'
            : '.json'
  const stem = `${helper.name}-${param.name.replace(/[^a-z0-9]+/g, '-')}`
  return path.join(taskDir, 'outputs', `${stem}${extension}`)
}

/**
 * Compact parameter summary for `blender_mcp_helpers`.
 *
 * @param {HelperSpec} helper - helper spec
 * @returns {Record<string, unknown>[]} parameter summaries
 */
export function summarizeParams(helper) {
  return helper.params.map((param) => ({
    name: param.name,
    type: param.type.type,
    required: param.required,
    path: param.path,
    ...(param.defaultOutput === true ? { defaultOutput: true } : {}),
  }))
}
