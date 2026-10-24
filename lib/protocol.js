/**
 * TCP transport for the Blender mcp add-on.
 *
 * Wire format: one UTF-8 JSON request + a single `0x00` byte, one connection
 * per request; the add-on replies with JSON + `0x00` and closes the socket.
 * This module owns framing, timeouts and the response size cap; it knows
 * nothing about Blender or the tool surface.
 *
 * @module lib/protocol
 */

import net from 'node:net'

/** Request/response frame delimiter. */
export const DELIMITER = 0

/** @typedef {'connect-refused'|'connect-timeout'|'response-timeout'|'too-large'|'malformed'|'closed'|'socket-error'|'aborted'} ProtocolErrorCode */

/** Transport failure with a stable reason code. */
export class ProtocolError extends Error {
  /**
   * @param {ProtocolErrorCode} code - stable reason code
   * @param {string} message - readable explanation
   */
  constructor(code, message) {
    super(message)
    this.name = 'ProtocolError'
    this.code = code
  }
}

/**
 * Delays between retries after a refused connect, in milliseconds.
 *
 * The add-on may keep the listen queue full for a few hundred milliseconds
 * (and up to its 1 s idle poll interval), so the backoff has to outlast that.
 */
export const CONNECT_RETRY_DELAYS_MS = [150, 400, 900]

/**
 * @typedef {object} SendOptions
 * @property {string} host - add-on host
 * @property {number} port - add-on port
 * @property {string} code - Python to execute in Blender
 * @property {number} [connectTimeoutMs] - TCP connect budget
 * @property {number} [responseTimeoutMs] - budget until the trailing NUL arrives
 * @property {number} [maxResponseChars] - byte cap on the response frame (the name is historical)
 * @property {number} [connectRetries] - extra attempts after a refused connect
 * @property {AbortSignal} [signal] - cancels the request and destroys the socket
 */

/**
 * Send one `execute` request and read the complete reply, retrying a refused
 * connect when asked to.
 *
 * Only `connect-refused` is retried: the socket never opened, so the request
 * never reached Blender and nothing can run twice. Timeouts, resets and
 * malformed replies are never retried — the code may already have run.
 *
 * @default connectTimeoutMs = 5000, responseTimeoutMs = 30000, maxResponseChars = 200000, connectRetries = 0
 * @param {SendOptions} options - request options
 * @returns {Promise<{ response: unknown, text: string, bytes: number }>} parsed reply
 */
export async function sendExecute(options) {
  const requested = options.connectRetries
  const retries = typeof requested === 'number' && Number.isInteger(requested) && requested > 0 ? requested : 0
  let attempt = 0
  for (;;) {
    try {
      return await sendOnce(options)
    } catch (error) {
      if (attempt >= retries || !isRetryableConnectRefusal(error)) throw error
      const delayMs = CONNECT_RETRY_DELAYS_MS[Math.min(attempt, CONNECT_RETRY_DELAYS_MS.length - 1)]
      await waitBeforeRetry(delayMs, options.signal)
      attempt += 1
    }
  }
}

/**
 * Send one request without retries.
 *
 * @param {SendOptions} options - request options, same shape as `sendExecute`
 * @returns {Promise<{ response: unknown, text: string, bytes: number }>} parsed reply
 */
function sendOnce(options) {
  const {
    host,
    port,
    code,
    connectTimeoutMs = 5000,
    responseTimeoutMs = 30000,
    maxResponseChars = 200000,
    signal,
  } = options

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port })
    /** @type {Buffer} */
    let buffer = Buffer.alloc(0)
    let settled = false
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let connectTimer
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let responseTimer
    /** @type {(() => void) | undefined} */
    let onAbort

    /**
     * Settle exactly once and always tear the socket down.
     *
     * @param {Error | null} error - failure to report
     * @param {{ response: unknown, text: string, bytes: number }} [value] - success value
     * @returns {void}
     */
    const finish = (error, value) => {
      if (settled) return
      settled = true
      if (connectTimer !== undefined) clearTimeout(connectTimer)
      if (responseTimer !== undefined) clearTimeout(responseTimer)
      if (signal !== undefined && onAbort !== undefined) signal.removeEventListener('abort', onAbort)
      socket.destroy()
      if (error !== null) reject(error)
      else if (value !== undefined) resolve(value)
      else reject(new ProtocolError('socket-error', 'request finished without a result'))
    }

    onAbort = () => finish(new ProtocolError('aborted', 'The call was cancelled.'))
    if (signal !== undefined) {
      if (signal.aborted) {
        onAbort()
        return
      }
      signal.addEventListener('abort', onAbort, { once: true })
    }

    connectTimer = setTimeout(() => {
      finish(
        new ProtocolError(
          'connect-timeout',
          `Timed out after ${connectTimeoutMs} ms connecting to ${host}:${port}.`,
        ),
      )
    }, connectTimeoutMs)

    socket.once('connect', () => {
      if (connectTimer !== undefined) clearTimeout(connectTimer)
      connectTimer = undefined
      responseTimer = setTimeout(() => {
        finish(
          new ProtocolError(
            'response-timeout',
            `No complete reply from ${host}:${port} within ${responseTimeoutMs} ms. The code may still be running inside Blender.`,
          ),
        )
      }, responseTimeoutMs)
      socket.write(`${JSON.stringify({ type: 'execute', code, strict_json: true })}\u0000`)
    })

    socket.on('data', /** @param {Buffer} chunk */ (chunk) => {
      buffer = Buffer.concat([buffer, chunk])
      const end = buffer.indexOf(DELIMITER)
      if (end === -1) {
        if (buffer.length > maxResponseChars) {
          finish(
            new ProtocolError(
              'too-large',
              `Response exceeded ${maxResponseChars} bytes without a terminator.`,
            ),
          )
        }
        return
      }
      if (end > maxResponseChars) {
        finish(
          new ProtocolError(
            'too-large',
            `Response exceeded ${maxResponseChars} bytes before its terminator.`,
          ),
        )
        return
      }
      const text = buffer.subarray(0, end).toString('utf8')
      /** @type {unknown} */
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        finish(new ProtocolError('malformed', 'The peer replied with a frame that is not JSON.'))
        return
      }
      finish(null, { response: parsed, text, bytes: end })
    })

    socket.on('error', /** @param {Error} error */ (error) => {
      const errorCode = /** @type {NodeJS.ErrnoException} */ (error).code
      const code =
        errorCode === 'ECONNREFUSED'
          ? 'connect-refused'
          : errorCode === 'ECONNRESET'
            ? 'closed'
            : 'socket-error'
      finish(
        new ProtocolError(
          code,
          `${host}:${port} failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      )
    })

    socket.on('close', () => {
      if (!settled) {
        finish(
          new ProtocolError(
            'closed',
            'The connection closed before a complete NUL-terminated reply arrived.',
          ),
        )
      }
    })
  })
}

/**
 * @param {unknown} error - failure from one attempt
 * @returns {boolean} whether a retry is safe
 */
function isRetryableConnectRefusal(error) {
  return error instanceof ProtocolError && error.code === 'connect-refused'
}

/**
 * Wait between attempts, aborting promptly when the caller cancels.
 *
 * @param {number} delayMs - wait length in milliseconds
 * @param {AbortSignal} [signal] - caller cancellation
 * @returns {Promise<void>} resolves after the wait
 */
function waitBeforeRetry(delayMs, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new ProtocolError('aborted', 'The call was cancelled.'))
      return
    }
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timer = null
    /** @type {(() => void) | null} */
    let onAbort = null
    timer = setTimeout(() => {
      if (signal !== undefined && onAbort !== null) signal.removeEventListener('abort', onAbort)
      resolve()
    }, delayMs)
    onAbort = () => {
      if (timer !== null) clearTimeout(timer)
      reject(new ProtocolError('aborted', 'The call was cancelled.'))
    }
    if (signal !== undefined) signal.addEventListener('abort', onAbort, { once: true })
  })
}
