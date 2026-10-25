/**
 * Handshake tests with a fake transport: version gate, peer identification and
 * transport error classification.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { classifyTransportError, docsUrlFor, HANDSHAKE_CODE, handshake, HandshakeError } from '../lib/handshake.js'
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
    performance: {
      engine: 'CYCLES',
      threads: { mode: 'AUTO', count: 0 },
      colorManagement: {
        displayDevice: 'sRGB',
        viewTransform: 'AgX',
        look: 'AgX - Medium High Contrast',
        exposure: 0,
        gamma: 1,
      },
      cycles: {
        deviceType: 'OPTIX',
        deviceCount: 9,
        devices: [
          { name: 'NVIDIA GeForce RTX 4090', type: 'OPTIX', use: true },
          { name: 'AMD Ryzen 9 7950X', type: 'CPU', use: false },
        ],
        devicesTruncated: true,
        samples: 128,
        previewSamples: 8,
        adaptiveSampling: true,
        adaptiveThreshold: 0.01,
        denoising: true,
        denoiser: 'OPENIMAGEDENOISE',
      },
      eevee: { renderSamples: 64, viewportSamples: 16 },
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

test('handshake normalizes the read-only performance block', async () => {
  const info = await handshake({ host: '127.0.0.1', port: 9876, send: sender({ status: 'ok', result: facts() }) })
  assert.equal(info.performance.engine, 'CYCLES')
  assert.equal(info.performance.threads.mode, 'AUTO')
  assert.equal(info.performance.colorManagement?.viewTransform, 'AgX')
  assert.equal(info.performance.colorManagement?.exposure, 0)
  assert.equal(info.performance.cycles?.deviceType, 'OPTIX')
  assert.equal(info.performance.cycles?.deviceCount, 9)
  assert.equal(info.performance.cycles?.devices.length, 2)
  assert.equal(info.performance.cycles?.devices[0]?.use, true)
  assert.equal(info.performance.cycles?.samples, 128)
  assert.equal(info.performance.cycles?.adaptiveThreshold, 0.01)
  assert.equal(info.performance.cycles?.denoiser, 'OPENIMAGEDENOISE')
  assert.equal(info.performance.eevee?.viewportSamples, 16)
  assert.match(HANDSHAKE_CODE, /_dsh_performance\(\)/)
  assert.match(HANDSHAKE_CODE, /compute_device_type/)
})

test('a reply without performance still yields safe defaults', async () => {
  const bare = facts()
  delete bare.performance
  const info = await handshake({ host: '127.0.0.1', port: 9876, send: sender({ status: 'ok', result: bare }) })
  assert.equal(info.performance.engine, '')
  assert.equal(info.performance.cycles, null)
  assert.equal(info.performance.eevee, null)
  assert.equal(info.performance.colorManagement, null)
  assert.equal(info.performance.threads.count, 0)
  assert.deepEqual(info.performance.threads.mode, '')
})

test('device rows are capped and malformed rows are dropped', async () => {
  const devices = Array.from({ length: 12 }, (_, index) => ({ name: `Device ${String(index)}`, type: 'CUDA', use: false }))
  const info = await handshake({
    host: '127.0.0.1',
    port: 9876,
    send: sender({
      status: 'ok',
      result: facts({
        performance: {
          engine: 'CYCLES',
          threads: { mode: 'AUTO', count: 0 },
          colorManagement: null,
          cycles: {
            deviceType: 'CUDA',
            deviceCount: 12,
            devices: [...devices.slice(0, 10), 'junk', null],
            devicesTruncated: true,
            samples: 32,
            previewSamples: 4,
            adaptiveSampling: false,
            adaptiveThreshold: 0,
            denoising: false,
            denoiser: '',
          },
          eevee: null,
        },
      }),
    }),
  })
  assert.equal(info.performance.cycles?.devices.length, 8)
  assert.equal(info.performance.cycles?.devices[0]?.name, 'Device 0')
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
