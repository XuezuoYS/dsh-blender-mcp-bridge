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

/** @typedef {'connect-refused'|'connect-timeout'|'response-timeout'|'too-large'|'malformed'|'closed'|'socket-error'} ProtocolErrorCode */

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
 * Send one `execute` request and read the complete reply.
 *
 * @default connectTimeoutMs = 5000, responseTimeoutMs = 30000, maxResponseChars = 200000
 * @param {object} options - request options
 * @param {string} options.host - add-on host
 * @param {number} options.port - add-on port
 * @param {string} options.code - Python to execute in Blender
 * @param {number} [options.connectTimeoutMs] - TCP connect budget
 * @param {number} [options.responseTimeoutMs] - budget until the trailing NUL arrives
 * @param {number} [options.maxResponseChars] - cap on the response frame size
 * @returns {Promise<{ response: unknown, text: string, bytes: number }>} parsed reply
 */
export function sendExecute(options) {
  const {
    host,
    port,
    code,
    connectTimeoutMs = 5000,
    responseTimeoutMs = 30000,
    maxResponseChars = 200000,
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
      socket.destroy()
      if (error !== null) reject(error)
      else if (value !== undefined) resolve(value)
      else reject(new ProtocolError('socket-error', 'request finished without a result'))
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
