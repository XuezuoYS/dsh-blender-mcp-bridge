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
