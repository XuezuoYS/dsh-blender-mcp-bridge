/**
 * Host-side HTTP handlers for the helper environment settings card.
 *
 * These run behind `ctx.connection.fetch.register`, so the framework already
 * authenticated the caller and fenced the origin. The handlers only accept
 * fixed actions; package names, paths and index URLs never come from the wire.
 *
 * @module lib/helperEnvRoutes
 */

import { computeReadiness, HelperEnvError } from './helperEnv.js'

/** Route path used by the browser half. */
export const HELPER_ENV_PATH = '/api/blender-bridge/helper-env'
/** Largest accepted JSON request body. */
const MAX_BODY_CHARS = 2048

/**
 * @param {number} status - HTTP status
 * @param {Record<string, unknown>} body - JSON value
 * @returns {Response} JSON response
 */
function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

/**
 * @param {unknown} error - failure
 * @returns {{ kind: string, message: string }} JSON-safe error
 */
function describe(error) {
  if (error instanceof HelperEnvError) return { kind: error.kind, message: error.message }
  return { kind: 'env-error', message: error instanceof Error ? error.message : String(error) }
}

/**
 * Build the GET/POST handlers for the settings card.
 *
 * @param {object} options - handler options
 * @param {any} options.env - environment manager
 * @param {() => import('./helperCatalog.js').HelperSpec[]} options.getHelpers - visible helper specs
 * @param {(signal?: AbortSignal) => Promise<unknown>} [options.probeBlenderFacts] - best-effort live session probe
 * @returns {{ status: (request: Request) => Promise<Response>, install: (request: Request) => Promise<Response> }} handlers
 */
export function createHelperEnvHandlers({ env, getHelpers, probeBlenderFacts }) {
  /**
   * @param {Request} request - GET request
   * @returns {Promise<Response>} status JSON
   */
  const status = async (request) => {
    let refresh = false
    try {
      refresh = new URL(request.url).searchParams.get('refresh') === '1'
    } catch {
      refresh = false
    }
    try {
      const value = await env.status({ refresh })
      const readiness = computeReadiness(value, getHelpers())
      return json(200, {
        ...value,
        helpers: { total: readiness.total, ready: readiness.ready, baseOnly: readiness.baseOnly },
      })
    } catch (error) {
      return json(500, { ok: false, error: describe(error) })
    }
  }

  /**
   * @param {Request} request - POST request
   * @returns {Promise<Response>} accepted/error JSON
   */
  const install = async (request) => {
    if (request.method !== 'POST') return json(405, { ok: false, error: { kind: 'method', message: 'Use POST to install.' } })
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return json(415, { ok: false, error: { kind: 'content-type', message: 'Send application/json.' } })
    }
    let text = ''
    try {
      text = await request.text()
    } catch {
      return json(400, { ok: false, error: { kind: 'body', message: 'Could not read the request body.' } })
    }
    if (text.length > MAX_BODY_CHARS) {
      return json(413, { ok: false, error: { kind: 'body', message: 'Request body is too large.' } })
    }
    /** @type {unknown} */
    let body
    try {
      body = JSON.parse(text)
    } catch {
      return json(400, { ok: false, error: { kind: 'body', message: 'Request body must be JSON.' } })
    }
    const action =
      typeof body === 'object' && body !== null ? /** @type {Record<string, unknown>} */ (body).action : undefined
    if (action !== 'install' && action !== 'rebuild') {
      return json(400, {
        ok: false,
        error: { kind: 'invalid-action', message: 'action must be "install" or "rebuild".' },
      })
    }
    if (probeBlenderFacts !== undefined) {
      try {
        await probeBlenderFacts(request.signal)
      } catch {
        // A missing live session is fine when a saved base exists.
      }
    }
    try {
      await env.startInstall(action)
      return json(202, { ok: true, state: 'running' })
    } catch (error) {
      const failure = describe(error)
      if (failure.kind === 'invalid-action') return json(400, { ok: false, error: failure })
      if (
        failure.kind === 'busy' ||
        failure.kind === 'helpers-running' ||
        failure.kind === 'base-unavailable' ||
        failure.kind === 'home-unwritable'
      ) {
        return json(409, { ok: false, error: failure })
      }
      return json(500, { ok: false, error: failure })
    }
  }

  return { status, install }
}
