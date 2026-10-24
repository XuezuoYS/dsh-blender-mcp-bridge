/**
 * Settings-card route handler tests. No HTTP server: the handlers take a Web
 * Request and return a Web Response.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { listHelpers } from '../lib/helperCatalog.js'
import { HelperEnvError } from '../lib/helperEnv.js'
import { createHelperEnvHandlers, HELPER_ENV_PATH } from '../lib/helperEnvRoutes.js'

/** Minimal status that makes every helper ready. */
const READY = {
  schema: 1,
  state: 'ready',
  usable: true,
  envDir: 'C:/dsh/dsh-blender-mcp-bridge/python',
  venvPath: 'C:/dsh/dsh-blender-mcp-bridge/python/venv',
  venvPython: 'C:/dsh/dsh-blender-mcp-bridge/python/venv/Scripts/python.exe',
  venvVersion: '3.13.13',
  base: {
    python: 'C:/Blender/5.2/python/bin/python.exe',
    version: '3.13.13',
    source: 'blender',
    blenderVersion: '5.2.2',
    valid: true,
    installedFrom: { python: 'C:/Blender/5.2/python/bin/python.exe', version: '3.13.13' },
  },
  packages: { numpy: '2.5.4', Pillow: '12.3.0', 'opencv-python-headless': '4.14.0.94', scipy: '1.18.1' },
  missing: [],
  requirements: { hash: 'sha256:x', expected: 'sha256:x', matches: true, packages: {} },
  install: { state: 'idle', phase: '', startedAt: 0, elapsedMs: 0, error: null, logTail: [], logPath: 'C:/log' },
  estimates: { downloadBytes: 104000000, diskBytes: 350000000 },
  hints: { installCommand: 'node "C:/plugin/scripts/setupAnalysis.js"', settings: 'Settings' },
}

/**
 * @param {object} [overrides] - status overrides
 * @param {Error | null} [installError] - make startInstall throw this
 * @returns {{ env: any, handlers: any, probes: number[] }} fixture
 */
function makeHandlers(overrides = {}, installError = null) {
  /** @type {any[]} */
  const statusCalls = []
  /** @type {number[]} */
  /** @type {number[]} */
  const probes = []
  /** @type {any} */
  const env = {
    /** @param {any} options - status options */
    async status(options) {
      statusCalls.push(options)
      return { ...READY, ...overrides }
    },
    /** @param {string} action - install action */
    async startInstall(action) {
      if (installError !== null) throw installError
      void action
      return { state: 'running' }
    },
    statusCalls,
  }
  const handlers = createHelperEnvHandlers({
    env,
    getHelpers: () => listHelpers(false),
    probeBlenderFacts: async () => {
      probes.push(1)
    },
  })
  return { env, handlers, probes }
}

test('GET returns status plus helper counts and passes refresh through', async () => {
  const { env, handlers } = makeHandlers()
  const response = await handlers.status(new Request(`http://localhost${HELPER_ENV_PATH}?refresh=1`))
  assert.equal(response.status, 200)
  const body = await response.json()
  assert.equal(body.state, 'ready')
  assert.equal(body.helpers.total, 23)
  assert.equal(body.helpers.ready, 23)
  assert.deepEqual(env.statusCalls, [{ refresh: true }])
})

test('POST requires JSON, a valid action, and a POST method', async () => {
  const { handlers } = makeHandlers()
  const get = await handlers.install(new Request(`http://localhost${HELPER_ENV_PATH}`))
  assert.equal(get.status, 405)

  const wrongType = await handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, { method: 'POST', body: '{"action":"install"}' }),
  )
  assert.equal(wrongType.status, 415)

  const badJson = await handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json',
    }),
  )
  assert.equal(badJson.status, 400)

  const badAction = await handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"action":"rm -rf"}',
    }),
  )
  assert.equal(badAction.status, 400)
  const badBody = await badAction.json()
  assert.equal(badBody.error.kind, 'invalid-action')
})

test('POST install probes Blender first and returns 202', async () => {
  const { handlers, probes } = makeHandlers()
  const response = await handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"action":"install"}',
    }),
  )
  assert.equal(response.status, 202)
  const body = await response.json()
  assert.equal(body.state, 'running')
  assert.equal(probes.length, 1)
})

test('a busy or base-less environment returns 409', async () => {
  const busy = makeHandlers({}, new HelperEnvError('busy', 'already running'))
  const busyResponse = await busy.handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"action":"install"}',
    }),
  )
  assert.equal(busyResponse.status, 409)
  const busyBody = await busyResponse.json()
  assert.equal(busyBody.error.kind, 'busy')

  const noBase = makeHandlers({}, new HelperEnvError('base-unavailable', 'no Blender'))
  const noBaseResponse = await noBase.handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"action":"rebuild"}',
    }),
  )
  assert.equal(noBaseResponse.status, 409)
  const noBaseBody = await noBaseResponse.json()
  assert.equal(noBaseBody.error.kind, 'base-unavailable')
})

test('a probe failure does not fail the install request', async () => {
  const { env, probes } = makeHandlers()
  const handlers = createHelperEnvHandlers({
    env,
    getHelpers: () => listHelpers(false),
    probeBlenderFacts: async () => {
      probes.push(1)
      throw new Error('Blender is not connected')
    },
  })
  const response = await handlers.install(
    new Request(`http://localhost${HELPER_ENV_PATH}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"action":"install"}',
    }),
  )
  assert.equal(response.status, 202)
  assert.equal(probes.length, 1)
})
