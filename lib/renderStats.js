/**
 * Rough render-time estimates from earlier renders in the same session.
 *
 * The estimate is a rate (milliseconds per pixel-sample) learned from finished
 * renders of the same engine family. It exists to warn about a budget that is
 * obviously too small; it is not a scheduler. Cold shader compilation, scene
 * complexity and GPU/CPU differences make it a rough guess at best.
 *
 * @module lib/renderStats
 */

/** Engine family names used as separate rate buckets. */
const ENGINE_EEVEE = 'eevee'
const ENGINE_CYCLES = 'cycles'
const ENGINE_OTHER = 'other'

/** New samples contribute this share when smoothing the rate. */
const RATE_NEW_WEIGHT = 0.4

/** How many job ids one session remembers for de-duplication. */
const MAX_RECORDED_JOBS = 200

/**
 * @typedef {object} RenderShape
 * @property {number} width
 * @property {number} height
 * @property {number} [resolutionPercentage]
 * @property {number} samples
 * @property {string} [engine]
 */

/**
 * Bucket an engine name into one rate family.
 *
 * @param {string} [engine] - engine name as reported by Blender
 * @returns {'eevee'|'cycles'|'other'} rate family
 */
export function engineFamily(engine) {
  if (typeof engine !== 'string') return ENGINE_OTHER
  if (engine.startsWith('BLENDER_EEVEE')) return ENGINE_EEVEE
  if (engine.startsWith('CYCLES')) return ENGINE_CYCLES
  return ENGINE_OTHER
}

/**
 * Work units for one render: effective pixels times samples.
 *
 * @param {RenderShape} shape - render settings
 * @returns {number} sample-pixels, at least 1
 */
export function renderCost(shape) {
  const width = Number.isFinite(shape.width) ? Math.max(1, shape.width) : 1
  const height = Number.isFinite(shape.height) ? Math.max(1, shape.height) : 1
  const percentage = Number.isFinite(shape.resolutionPercentage) ? Math.min(100, Math.max(1, shape.resolutionPercentage ?? 100)) : 100
  const samples = Number.isFinite(shape.samples) ? Math.max(1, shape.samples) : 1
  return width * height * (percentage / 100) ** 2 * samples
}

/**
 * @typedef {object} RenderStats
 * @property {(sessionId: string, jobId: string, shape: RenderShape, tookMs: number) => boolean} record
 * @property {(sessionId: string, shape: RenderShape) => number | null} estimateSeconds
 * @property {(sessionId: string) => void} clearSession
 */

/**
 * Create the per-session rate table.
 *
 * `record` de-duplicates by job id, so polling the same finished job with
 * `blender_mcp_render_status` does not distort the average. `estimateSeconds`
 * returns null until one render of the same engine family has finished.
 *
 * @returns {RenderStats} stats instance
 */
export function createRenderStats() {
  /** @type {Map<string, Map<string, number>>} session id -> engine family -> ms per sample-pixel */
  const rates = new Map()
  /** @type {Map<string, Set<string>>} session id -> job ids already recorded */
  const recordedJobs = new Map()

  return {
    record(sessionId, jobId, shape, tookMs) {
      if (typeof sessionId !== 'string' || sessionId === '') return false
      if (!Number.isFinite(tookMs) || tookMs <= 0) return false
      const jobs = recordedJobs.get(sessionId) ?? new Set()
      if (typeof jobId === 'string' && jobId !== '') {
        if (jobs.has(jobId)) return false
        jobs.add(jobId)
        if (jobs.size > MAX_RECORDED_JOBS) {
          const oldest = jobs.values().next()
          if (oldest.done !== true) jobs.delete(oldest.value)
        }
        recordedJobs.set(sessionId, jobs)
      }
      const cost = renderCost(shape)
      const family = engineFamily(shape.engine)
      const sessionRates = rates.get(sessionId) ?? new Map()
      const previous = sessionRates.get(family)
      const rate = tookMs / cost
      sessionRates.set(family, previous === undefined ? rate : previous * (1 - RATE_NEW_WEIGHT) + rate * RATE_NEW_WEIGHT)
      rates.set(sessionId, sessionRates)
      return true
    },

    estimateSeconds(sessionId, shape) {
      const rate = rates.get(sessionId)?.get(engineFamily(shape.engine))
      if (rate === undefined || !Number.isFinite(rate) || rate <= 0) return null
      const seconds = (rate * renderCost(shape)) / 1000
      if (!Number.isFinite(seconds) || seconds <= 0) return null
      return Math.round(seconds * 10) / 10
    },

    clearSession(sessionId) {
      rates.delete(sessionId)
      recordedJobs.delete(sessionId)
    },
  }
}
