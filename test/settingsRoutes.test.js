/**
 * Settings route tests. The handlers take a Web Request and return a Web
 * Response, so no HTTP server is needed.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defaultSettings } from '../lib/config.js'
import { createSettingsHandlers, SETTINGS_PATH } from '../lib/settingsRoutes.js'
import { SettingsStoreError } from '../lib/settingsStore.js'

const DEFAULTS = defaultSettings()
const VALUE = { ...DEFAULTS, port: 9999 }

/**
 * @param {object} [setup] - overrides
 * @param {'ok'|'conflict'|'invalid'|'write-failed'} [setup.result] - update result
 * @returns {{ handlers: any, store: any }} fixture
 */
function makeHandlers(setup = {}) {
  const result = setup.result ?? 'ok'
  /** @type {any[]} */
  const calls = []
  let revision = 'sha256:1'
  let value = VALUE
  const store = {
    get: () => value,
    getDefaults: () => DEFAULTS,
    getRevision: () => revision,
    getUpdatedAt: () => '2026-01-01T00:00:00.000Z',
    /** @param {any[]} ops - operations @param {string} expectedRevision - expected revision */
    update(ops, expectedRevision) {
      calls.push({ ops, expectedRevision })
      if (result === 'conflict') return { ok: false, conflict: true, value, revision, updatedAt: '2026-01-01T00:00:00.000Z' }
      if (result === 'invalid') throw new SettingsStoreError('invalid', 'port out of range')
      if (result === 'write-failed') throw new SettingsStoreError('write-failed', 'disk is read-only')
      value = { ...VALUE, port: 1234 }
      revision = 'sha256:2'
      return { ok: true, value, revision, updatedAt: '2026-01-01T00:00:01.000Z' }
    },
    calls,
  }
  return { handlers: createSettingsHandlers({ store }), store }
}

test('GET returns a configForms-like snapshot', async () => {
  const { handlers } = makeHandlers()
  const response = await handlers.get()
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.status, 'ready')
  assert.equal(body.value.port, 9999)
  assert.equal(body.base.port, 9876)
  assert.equal(body.revision, 'sha256:1')
  assert.equal(body.writable, true)
})

test('POST saves a revision-checked operation list', async () => {
  const { handlers, store } = makeHandlers()
  const response = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: 1234 }], expectedRevision: 'sha256:1' }),
    }),
  )
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.ok, true)
  assert.equal(body.revision, 'sha256:2')
  assert.equal(body.value.port, 1234)
  assert.equal(store.calls.length, 1)
  assert.deepEqual(store.calls[0].ops, [{ op: 'set', path: ['port'], value: 1234 }])
})

test('a stale revision returns 409 with the current snapshot', async () => {
  const { handlers } = makeHandlers({ result: 'conflict' })
  const response = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: 1234 }], expectedRevision: 'old' }),
    }),
  )
  assert.equal(response.status, 409)
  const body = await response.json()
  assert.equal(body.ok, false)
  assert.equal(body.conflict, true)
  assert.equal(body.revision, 'sha256:1')
})

test('invalid and unwritable changes map to 400 and 500', async () => {
  const invalid = makeHandlers({ result: 'invalid' })
  const invalidResponse = await invalid.handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: 70000 }], expectedRevision: 'sha256:1' }),
    }),
  )
  assert.equal(invalidResponse.status, 400)
  const invalidBody = await invalidResponse.json()
  assert.equal(invalidBody.error.kind, 'invalid')

  const failed = makeHandlers({ result: 'write-failed' })
  const failedResponse = await failed.handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: 1234 }], expectedRevision: 'sha256:1' }),
    }),
  )
  assert.equal(failedResponse.status, 500)
})

test('the route validates method, content type, body and operation list', async () => {
  const { handlers } = makeHandlers()
  const get = await handlers.post(new Request(`http://localhost${SETTINGS_PATH}`))
  assert.equal(get.status, 405)

  const wrongType = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, { method: 'POST', body: '{}' }),
  )
  assert.equal(wrongType.status, 415)

  const badJson = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json',
    }),
  )
  assert.equal(badJson.status, 400)

  const emptyOps = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [], expectedRevision: 'sha256:1' }),
    }),
  )
  assert.equal(emptyOps.status, 400)

  const noRevision = await handlers.post(
    new Request(`http://localhost${SETTINGS_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: 1234 }] }),
    }),
  )
  assert.equal(noRevision.status, 400)
})
