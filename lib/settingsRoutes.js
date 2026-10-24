/**
 * Host-side HTTP handlers for the plugin's own settings files.
 *
 * The browser half used to edit the DSH profile through `configForms`; it now
 * talks to this route so the JSON files under `DSH_HOME/dsh-blender-mcp-bridge/`
 * are the only source of truth. The route is registered through
 * `ctx.connection.fetch.register` (owner-authenticated, like `/api/file`).
 *
 * @module lib/settingsRoutes
 */

import { SettingsStoreError } from './settingsStore.js'

/** Route path used by the settings page. */
export const SETTINGS_PATH = '/api/blender-bridge/settings'
/** Largest accepted JSON request body. */
const MAX_BODY_CHARS = 64 * 1024
/** Largest accepted operation list. */
const MAX_OPS = 100

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
 * @param {any} store - settings store
 * @returns {Record<string, unknown>} configForms-like snapshot
 */
function snapshot(store) {
  return {
    status: 'ready',
    value: store.get(),
    base: store.getDefaults(),
    revision: store.getRevision(),
    writable: true,
    updatedAt: store.getUpdatedAt(),
  }
}

/**
 * @param {unknown} error - failure
 * @returns {{ kind: string, message: string }} JSON-safe error
 */
function describe(error) {
  if (error instanceof SettingsStoreError) return { kind: error.kind, message: error.message }
  return { kind: 'settings-error', message: error instanceof Error ? error.message : String(error) }
}

/**
 * Build the GET/POST handlers for the settings page.
 *
 * @param {{ store: any }} options - handler options
 * @returns {{ get: () => Promise<Response>, post: (request: Request) => Promise<Response> }} handlers
 */
export function createSettingsHandlers({ store }) {
  return {
    /**
     * @returns {Promise<Response>} current settings
     */
    async get() {
      try {
        return json(200, snapshot(store))
      } catch (error) {
        return json(500, { ok: false, error: describe(error) })
      }
    },

    /**
     * @param {Request} request - POST request
     * @returns {Promise<Response>} save result
     */
    async post(request) {
      if (request.method !== 'POST') return json(405, { ok: false, error: { kind: 'method', message: 'Use POST to save settings.' } })
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
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return json(400, { ok: false, error: { kind: 'body', message: 'Request body must be an object.' } })
      }
      const record = /** @type {Record<string, unknown>} */ (body)
      const ops = record.ops
      const expectedRevision = record.expectedRevision
      if (!Array.isArray(ops) || ops.length === 0 || ops.length > MAX_OPS) {
        return json(400, { ok: false, error: { kind: 'invalid', message: `ops must be an array of 1..${MAX_OPS} changes.` } })
      }
      if (typeof expectedRevision !== 'string' || expectedRevision === '') {
        return json(400, { ok: false, error: { kind: 'invalid', message: 'expectedRevision is required.' } })
      }
      try {
        const result = store.update(
          /** @type {{ op: string, path: string[], value: any }[]} */ (ops),
          expectedRevision,
        )
        if (result.ok !== true) {
          return json(409, { ...snapshot(store), ok: false, conflict: true })
        }
        return json(200, { ...snapshot(store), ok: true })
      } catch (error) {
        const failure = describe(error)
        const status = failure.kind === 'write-failed' ? 500 : 400
        return json(status, { ok: false, error: failure })
      }
    },
  }
}
