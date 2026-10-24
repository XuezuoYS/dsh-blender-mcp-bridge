/**
 * The plugin configuration schema and its plain default value.
 *
 * `Config` is exported to the DSH loader (and used as the validation schema for
 * the plugin's own JSON settings files). User values no longer live in the DSH
 * profile: `lib/settingsStore` keeps them in `DSH_HOME/dsh-blender-mcp-bridge/`
 * and `index.js` reads them through the store.
 *
 * @module lib/config
 */

import z from '@deepseek-ai/schemastery'

/**
 * Validated plugin configuration.
 *
 * The fields stay volatile so the DSH loader and the bundled profile patch keep
 * working; the plugin itself uses the settings store, not the volatility.
 */
export const Config = z.object({
  host: z.string().default('127.0.0.1').volatile(),
  port: z.natural().min(1).max(65535).default(9876).volatile(),
  maxConcurrentSends: z
    .natural()
    .min(1)
    .max(20)
    .default(5)
    .description('Concurrent Blender connections; Blender 5.2 tolerates 5 (the add-on listen backlog).')
    .volatile(),
  connectTimeoutMs: z.natural().min(100).default(5000).volatile(),
  responseTimeoutMs: z.natural().min(1000).default(30000).volatile(),
  captureTimeoutMs: z.natural().min(1000).default(30000).volatile(),
  renderTimeoutMs: z.natural().min(1000).default(120000).volatile(),
  maxResponseChars: z
    .natural()
    .min(1000)
    .default(200000)
    .description('Byte cap for one reply; the name is historical.')
    .volatile(),
  taskRootMode: z.union(['blendFile', 'workspace']).default('blendFile').volatile(),
  taskRoot: z.string().default('').volatile(),
  snapshot: z.object({
    enabled: z.boolean().default(true).volatile(),
    generations: z.natural().min(1).max(20).default(3).volatile(),
    on: z.union(['turn', 'write', 'adaptive']).default('adaptive').volatile(),
    everyWrites: z.natural().min(1).max(100).default(10).volatile(),
    onDestructive: z.boolean().default(true).volatile(),
    compress: z.boolean().default(true).volatile(),
    timeoutMs: z.natural().min(1000).default(120000).volatile(),
  }),
  guard: z.object({
    enabled: z.boolean().default(true).volatile(),
  }),
  helper: z.object({
    basePython: z.string().default('').volatile(),
    pipIndexUrl: z.string().default('').volatile(),
    timeoutMs: z.natural().min(1000).default(120000).volatile(),
    maxOutputChars: z.natural().min(1000).default(200000).volatile(),
    enableMaintenanceHelpers: z.boolean().default(false).volatile(),
  }),
  audit: z.object({
    enabled: z.boolean().default(true).volatile(),
    storeCode: z.boolean().default(false).volatile(),
  }),
})

/**
 * Turn a live/volatile config tree into plain values.
 *
 * @param {any} value - config, volatile reference or plain value
 * @returns {any} plain clone
 */
export function unwrapConfig(value) {
  if (Array.isArray(value)) return value.map((item) => unwrapConfig(item))
  if (value !== null && typeof value === 'object') {
    if (typeof value.get === 'function') {
      try {
        return unwrapConfig(value.get())
      } catch {
        // A disposed reference falls through to its own keys.
      }
    }
    /** @type {Record<string, any>} */
    const out = {}
    for (const [key, child] of Object.entries(value)) out[key] = unwrapConfig(child)
    return out
  }
  return value
}

/**
 * Keep only the keys the schema knows, filling missing leaves from the template.
 *
 * Used for both file fragments and the one-time DSH profile migration, so an
 * old `analysisPython` key cannot sneak into the new store.
 *
 * @param {any} value - candidate value
 * @param {any} template - default value with the accepted shape
 * @returns {any} a plain value shaped like the template
 */
export function pickKnown(value, template) {
  if (template === null || typeof template !== 'object') {
    return value === undefined || value === null ? structuredClone(template) : value
  }
  if (Array.isArray(template)) {
    return Array.isArray(value) ? structuredClone(value) : structuredClone(template)
  }
  const source = value !== null && typeof value === 'object' ? value : {}
  /** @type {Record<string, any>} */
  const out = {}
  for (const key of Object.keys(template)) out[key] = pickKnown(source[key], template[key])
  return out
}

/**
 * Plain default settings, built from the schema itself so the two cannot drift.
 *
 * @returns {any} fresh plain defaults
 */
export function defaultSettings() {
  const defaults = unwrapConfig(Config({}))
  return pickKnown(defaults, defaults)
}
