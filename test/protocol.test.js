/**
 * Transport tests: framing, timeouts and failure classification.
 *
 * These run offline; no Blender is involved.
 */

import assert from 'node:assert/strict'
import net from 'node:net'
import { test } from 'node:test'
import { ProtocolError, sendExecute } from '../lib/protocol.js'

/**
 * Start a one-shot TCP server that replies with the given bytes.
 *
 * @param {Buffer} responseBytes - bytes to send to the first client
 * @returns {Promise<{ port: number, close: () => Promise<void> }>} server handle
 */
function startServer(responseBytes) {
  const srv = net.createServer((socket) => {
    socket.on('error', () => {})
    socket.once('data', () => {
      socket.end(responseBytes)
    })
  })
  return new Promise((resolve, reject) => {
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const address = srv.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('no port'))
        return
      }
      resolve({
        port: address.port,
        close: () =>
          new Promise((done) => {
            srv.close(() => done(undefined))
          }),
      })
    })
  })
}

test('sendExecute resolves with the parsed NUL-terminated reply', { timeout: 5000 }, async () => {
  const reply = Buffer.from(`${JSON.stringify({ status: 'ok', result: { value: 1 } })}\u0000`)
  const server = await startServer(reply)
  try {
    const result = await sendExecute({
      host: '127.0.0.1',
      port: server.port,
      code: 'result = {"value": 1}',
      connectTimeoutMs: 2000,
      responseTimeoutMs: 2000,
    })
    assert.deepEqual(result.response, { status: 'ok', result: { value: 1 } })
    assert.equal(result.bytes, reply.length - 1)
  } finally {
    await server.close()
  }
})

test('a refused connection reports connect-refused', { timeout: 5000 }, async () => {
  // Grab a free port, then close the listener so nothing is listening.
  const server = await startServer(Buffer.alloc(0))
  const port = server.port
  await server.close()
  await assert.rejects(
    sendExecute({ host: '127.0.0.1', port, code: '', connectTimeoutMs: 2000, responseTimeoutMs: 2000 }),
    (error) => error instanceof ProtocolError && error.code === 'connect-refused',
  )
})

test('a silent peer reports response-timeout', { timeout: 5000 }, async () => {
  const srv = net.createServer((socket) => {
    socket.on('error', () => {})
    socket.on('data', () => {})
  })
  const port = await new Promise((resolve, reject) => {
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const address = srv.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('no port'))
        return
      }
      resolve(address.port)
    })
  })
  try {
    await assert.rejects(
      sendExecute({ host: '127.0.0.1', port, code: '', connectTimeoutMs: 2000, responseTimeoutMs: 100 }),
      (error) => error instanceof ProtocolError && error.code === 'response-timeout',
    )
  } finally {
    await new Promise((done) => srv.close(() => done(undefined)))
  }
})

test('a non-JSON frame reports malformed', { timeout: 5000 }, async () => {
  const server = await startServer(Buffer.from('not json\u0000'))
  try {
    await assert.rejects(
      sendExecute({
        host: '127.0.0.1',
        port: server.port,
        code: '',
        connectTimeoutMs: 2000,
        responseTimeoutMs: 2000,
      }),
      (error) => error instanceof ProtocolError && error.code === 'malformed',
    )
  } finally {
    await server.close()
  }
})

test('a complete frame over the cap reports too-large', { timeout: 5000 }, async () => {
  const reply = Buffer.from(`${JSON.stringify({ status: 'ok', result: 'x'.repeat(200) })}\u0000`)
  const server = await startServer(reply)
  try {
    await assert.rejects(
      sendExecute({
        host: '127.0.0.1',
        port: server.port,
        code: '',
        connectTimeoutMs: 2000,
        responseTimeoutMs: 2000,
        maxResponseChars: 50,
      }),
      (error) => error instanceof ProtocolError && error.code === 'too-large',
    )
  } finally {
    await server.close()
  }
})

test('an aborted request reports aborted and closes the socket', { timeout: 5000 }, async () => {
  const srv = net.createServer((socket) => {
    socket.on('error', () => {})
    socket.on('data', () => {})
  })
  const port = await new Promise((resolve, reject) => {
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const address = srv.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('no port'))
        return
      }
      resolve(address.port)
    })
  })
  const controller = new AbortController()
  try {
    const pending = sendExecute({
      host: '127.0.0.1',
      port,
      code: '',
      connectTimeoutMs: 2000,
      responseTimeoutMs: 2000,
      signal: controller.signal,
    })
    setTimeout(() => controller.abort(), 20)
    await assert.rejects(pending, (error) => error instanceof ProtocolError && error.code === 'aborted')
  } finally {
    await new Promise((done) => srv.close(() => done(undefined)))
  }
})

test('a refused connect is retried when connectRetries is set', { timeout: 5000 }, async () => {
  // Reserve a port, close it so the first attempt is refused, then start the
  // real server while the transport waits before its retry.
  const probe = await startServer(Buffer.alloc(0))
  const port = probe.port
  await probe.close()
  const reply = Buffer.from(`${JSON.stringify({ status: 'ok', result: { retried: true } })}\u0000`)
  /** @type {net.Server | null} */
  let server = null
  const timer = setTimeout(() => {
    server = net.createServer((socket) => {
      socket.on('error', () => {})
      socket.once('data', () => socket.end(reply))
    })
    server.listen(port, '127.0.0.1')
  }, 20)
  try {
    const result = await sendExecute({
      host: '127.0.0.1',
      port,
      code: '',
      connectTimeoutMs: 1000,
      responseTimeoutMs: 1000,
      connectRetries: 2,
    })
    assert.deepEqual(result.response, { status: 'ok', result: { retried: true } })
  } finally {
    clearTimeout(timer)
    if (server !== null) {
      const running = /** @type {net.Server} */ (server)
      await new Promise((done) => running.close(() => done(undefined)))
    }
  }
})

test('retries stop after the configured attempts', { timeout: 5000 }, async () => {
  const probe = await startServer(Buffer.alloc(0))
  const port = probe.port
  await probe.close()
  const started = Date.now()
  await assert.rejects(
    sendExecute({
      host: '127.0.0.1',
      port,
      code: '',
      connectTimeoutMs: 1000,
      responseTimeoutMs: 1000,
      connectRetries: 2,
    }),
    (error) => error instanceof ProtocolError && error.code === 'connect-refused',
  )
  // Two retry delays (60 + 150 ms) must actually have happened.
  assert.ok(Date.now() - started >= 180, `retried for ${String(Date.now() - started)} ms`)
})

test('a response timeout is never retried', { timeout: 5000 }, async () => {
  /** @type {number} */
  let connections = 0
  const srv = net.createServer((socket) => {
    connections += 1
    socket.on('error', () => {})
    socket.on('data', () => {})
  })
  const port = await new Promise((resolve, reject) => {
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const address = srv.address()
      if (address === null || typeof address === 'string') {
        reject(new Error('no port'))
        return
      }
      resolve(address.port)
    })
  })
  try {
    await assert.rejects(
      sendExecute({
        host: '127.0.0.1',
        port,
        code: '',
        connectTimeoutMs: 1000,
        responseTimeoutMs: 80,
        connectRetries: 3,
      }),
      (error) => error instanceof ProtocolError && error.code === 'response-timeout',
    )
    assert.equal(connections, 1, 'a timeout must not open a second connection')
  } finally {
    await new Promise((done) => srv.close(() => done(undefined)))
  }
})

test('aborting during a retry delay reports aborted', { timeout: 5000 }, async () => {
  const probe = await startServer(Buffer.alloc(0))
  const port = probe.port
  await probe.close()
  const controller = new AbortController()
  const pending = sendExecute({
    host: '127.0.0.1',
    port,
    code: '',
    connectTimeoutMs: 1000,
    responseTimeoutMs: 1000,
    connectRetries: 3,
    signal: controller.signal,
  })
  setTimeout(() => controller.abort(), 20)
  await assert.rejects(pending, (error) => error instanceof ProtocolError && error.code === 'aborted')
})
