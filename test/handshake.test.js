/**
 * Handshake tests with a fake transport: version gate, peer identification and
 * transport error classification.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { classifyTransportError, docsUrlFor, handshake, HandshakeError } from '../lib/handshake.js'
import { ProtocolError } from '../lib/protocol.js'

/**
 * Build a handshake transport returning one envelope.
 *
 * @param {unknown} envelope - add-on reply envelope
 * @returns {(code: string) => Promise<{ response: unknown }>} fake sender
 */
function sender(envelope) {
  return async () => ({ response: envelope })
}

/**
 * @param {Partial<Record<string, unknown>>} [overrides] - result fields
 * @returns {Record<string, unknown>} result payload
 */
function facts(overrides = {}) {
  return {
    blenderVersion: '5.2.2 LTS',
    versionMajorMinor: '5.2',
    filePath: 'C:/proj/scene.blend',
    isDirty: true,
    background: false,
    objectCount: 3,
    activeScene: 'Scene',
    mode: 'OBJECT',
    undoStepLimit: 32,
    pythonVersion: '3.13.13',
    onlineAccess: true,
    renderSettings: {
      engine: 'BLENDER_EEVEE',
      width: 1920,
      height: 1080,
      resolutionPercentage: 100,
      samples: 64,
      fileFormat: 'PNG',
    },
    ...overrides,
  }
}

test('handshake normalizes facts and builds the manual URL', async () => {
  const info = await handshake({ host: '127.0.0.1', port: 9876, send: sender({ status: 'ok', result: facts() }) })
  assert.equal(info.blenderVersion, '5.2.2 LTS')
  assert.equal(info.versionMajorMinor, '5.2')
  assert.equal(info.filePath, 'C:/proj/scene.blend')
  assert.equal(info.isDirty, true)
  assert.equal(info.objectCount, 3)
  assert.equal(info.renderSettings.engine, 'BLENDER_EEVEE')
  assert.equal(info.docs.manualEn, 'https://docs.blender.org/manual/en/5.2/')
  assert.equal(docsUrlFor('5.2'), 'https://docs.blender.org/manual/en/5.2/')
})

test('older Blender versions are refused', async () => {
  await assert.rejects(
    handshake({
      host: '127.0.0.1',
      port: 9876,
      send: sender({ status: 'ok', result: facts({ blenderVersion: '4.2.0 LTS', versionMajorMinor: '4.2' }) }),
    }),
    (error) => error instanceof HandshakeError && error.kind === 'version-too-old',
  )
})

test('a non-Blender peer is identified, not guessed', async () => {
  await assert.rejects(
    handshake({ host: '127.0.0.1', port: 9876, send: sender({ status: 'ok', result: { hello: 'world' } }) }),
    (error) => error instanceof HandshakeError && error.kind === 'foreign-peer',
  )
})

test('transport failures map to actionable kinds', () => {
  assert.equal(
    classifyTransportError(new ProtocolError('connect-refused', 'ECONNREFUSED')).kind,
    'port-not-listening',
  )
  assert.equal(classifyTransportError(new ProtocolError('response-timeout', 'slow')).kind, 'response-timeout')
  assert.equal(classifyTransportError(new ProtocolError('malformed', 'bad json')).kind, 'foreign-peer')
  const closed = classifyTransportError(new ProtocolError('closed', 'connection closed'))
  assert.equal(closed.kind, 'closed')
  assert.ok(closed.actions.some((action) => /crashed|closed/i.test(action)))
  const socket = classifyTransportError(new ProtocolError('socket-error', 'reset'))
  assert.equal(socket.kind, 'socket-error')
  assert.ok(socket.actions.length > 0)
  assert.equal(classifyTransportError(new Error('boom')).kind, 'socket-error')
})
