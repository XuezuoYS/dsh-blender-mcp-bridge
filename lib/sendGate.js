/**
 * FIFO gate that caps how many Blender socket requests are in flight.
 *
 * The official add-on listens with a fixed backlog (`_LISTEN_BACKLOG = 5` in
 * `mcp_to_blender_server.py` for Blender 5.2), so a burst of parallel tool
 * calls can overflow the listen queue and come back as `ECONNREFUSED`. This
 * gate keeps the plugin's own bursts inside that budget; the limit comes from
 * settings and may change between calls.
 *
 * A waiter gives up after `acquireTimeoutMs` instead of queueing behind a long
 * render, and an aborted call leaves the queue immediately. The gate is fair:
 * slots are handed over in arrival order.
 *
 * @module lib/sendGate
 */

/** Gate failure with a stable reason code. */
export class SendGateError extends Error {
  /**
   * @param {'busy'|'aborted'} kind - why the slot was not granted
   * @param {string} message - readable explanation
   */
  constructor(kind, message) {
    super(message)
    this.name = 'SendGateError'
    this.kind = kind
  }
}

/** @typedef {{ resolve: (release: () => void) => void, reject: (error: SendGateError) => void, timer: ReturnType<typeof setTimeout> | null, onAbort: (() => void) | null, cleanup: () => void, settled: boolean }} Waiter */

/**
 * Build one gate. Every tool instance shares one gate, so the cap applies to
 * the whole plugin process rather than to a single tool.
 *
 * @default acquireTimeoutMs = 2500
 * @param {object} options - gate options
 * @param {() => number} options.limitOf - current limit; read before each acquisition
 * @param {number} [options.acquireTimeoutMs] - longest wait for a free slot
 * @returns {{ run: <T>(task: () => Promise<T>, signal?: AbortSignal) => Promise<T>, stats: () => { active: number, waiting: number, peak: number, limit: number } }} gate
 */
export function createSendGate({ limitOf, acquireTimeoutMs = 2500 }) {
  if (typeof limitOf !== 'function') throw new Error('limitOf must be a function.')
  if (!Number.isInteger(acquireTimeoutMs) || acquireTimeoutMs <= 0) {
    throw new Error('acquireTimeoutMs must be a positive integer.')
  }

  let active = 0
  let peak = 0
  /** @type {Waiter[]} */
  const waiting = []

  /**
   * @returns {number} effective limit, never below one
   */
  const limit = () => {
    const value = Number(limitOf())
    return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
  }

  /**
   * @returns {() => void} release function that frees the slot exactly once
   */
  const makeRelease = () => {
    let released = false
    return () => {
      if (released) return
      released = true
      const next = waiting.shift()
      if (next === undefined) {
        active -= 1
        return
      }
      // Hand the slot over: `active` stays the same.
      next.settled = true
      next.cleanup()
      next.resolve(makeRelease())
    }
  }

  /**
   * @param {AbortSignal} [signal] - caller cancellation
   * @returns {Promise<() => void>} resolves with the release function
   */
  const acquire = (signal) => {
    if (signal?.aborted === true) {
      return Promise.reject(new SendGateError('aborted', 'The call was cancelled.'))
    }
    if (active < limit()) {
      active += 1
      if (active > peak) peak = active
      return Promise.resolve(makeRelease())
    }
    return new Promise((resolve, reject) => {
      /** @type {Waiter} */
      const waiter = { resolve, reject, timer: null, onAbort: null, cleanup: () => {}, settled: false }
      /**
       * @param {SendGateError} error - why the wait ended
       * @returns {void}
       */
      const fail = (error) => {
        if (waiter.settled) return
        waiter.settled = true
        waiter.cleanup()
        const index = waiting.indexOf(waiter)
        if (index !== -1) waiting.splice(index, 1)
        reject(error)
      }
      waiter.cleanup = () => {
        if (waiter.timer !== null) {
          clearTimeout(waiter.timer)
          waiter.timer = null
        }
        if (waiter.onAbort !== null && signal !== undefined) {
          signal.removeEventListener('abort', waiter.onAbort)
          waiter.onAbort = null
        }
      }
      waiter.timer = setTimeout(() => {
        fail(
          new SendGateError(
            'busy',
            `No free Blender connection slot within ${String(acquireTimeoutMs)} ms (limit ${String(limit())}). ` +
              'Retry shortly or raise the concurrency limit in settings.',
          ),
        )
      }, acquireTimeoutMs)
      if (signal !== undefined) {
        waiter.onAbort = () => fail(new SendGateError('aborted', 'The call was cancelled.'))
        signal.addEventListener('abort', waiter.onAbort, { once: true })
      }
      waiting.push(waiter)
    })
  }

  /**
   * Run one task while holding a slot.
   *
   * @template T
   * @param {() => Promise<T>} task - the send to run
   * @param {AbortSignal} [signal] - caller cancellation
   * @returns {Promise<T>} task result
   */
  const run = (task, signal) =>
    acquire(signal).then((release) =>
      Promise.resolve()
        .then(task)
        .then(
          (value) => {
            release()
            return value
          },
          (error) => {
            release()
            throw error
          },
        ),
    )

  return {
    run,
    /** @returns {{ active: number, waiting: number, peak: number, limit: number }} gate snapshot */
    stats: () => ({ active, waiting: waiting.length, peak, limit: limit() }),
  }
}
