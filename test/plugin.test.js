/**
 * Plugin wiring tests: config defaults, tool registration and prompt text.
 *
 * These run offline. `apply()` is called with a fake cordis context, so the
 * tool definitions are compiled by the real `defineTool`.
 */

import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { apply, Config } from '../index.js'
import { settingsDir } from '../lib/settingsStore.js'
import { wrapExecCode } from '../lib/tools.js'

// The plugin now owns its settings files. Keep every apply() in this file away
// from the real user home.
process.env.DSH_HOME = mkdtempSync(path.join(os.tmpdir(), 'dsh-plugin-test-'))

/** Minimal config matching the schema defaults. */
const CONFIG = /** @type {any} */ (Config({}))

/**
 * @typedef {{ name: string, description: string, parameters: Record<string, unknown> }} RegisteredTool
 */

/**
 * Run `apply()` against a fake context.
 *
 * @param {boolean} [includeSkills] - expose a fake skills service
 * @returns {{ tools: RegisteredTool[], sections: unknown[], skills: any[], routes: any[] }} captured registrations
 */
function runApply(includeSkills = true) {
  /** @type {RegisteredTool[]} */
  const tools = []
  /** @type {unknown[]} */
  const sections = []
  /** @type {any[]} */
  const skills = []
  /** @type {any[]} */
  const routes = []
  const ctx = {
    logger: { warn() {} },
    /** @param {string} name - service name */
    get(name) {
      if (name === 'skills' && includeSkills) {
        return {
          /** @param {any} definition - skill definition */
          register(definition) {
            skills.push(definition)
            return () => {}
          },
        }
      }
      if (name === 'connection') {
        return {
          fetch: {
            /** @param {any} route - fetch route */
            register(route) {
              routes.push(route)
              return () => {}
            },
          },
        }
      }
      return undefined
    },
    on() {
      return () => {}
    },
    /** @param {() => unknown} setup - effect body */
    effect(setup) {
      return setup()
    },
    /**
     * @param {string[]} deps - required services
     * @param {(ctx: any) => void} callback - plugin body
     * @returns {{ then: () => void }} minimal fiber
     */
    inject(deps, callback) {
      if (deps.includes('skills') && includeSkills) callback(ctx)
      if (deps.includes('connection')) callback(ctx)
      return { then() {} }
    },
    tools: {
      /**
       * @param {RegisteredTool} tool - tool definition
       * @returns {() => void} disposer
       */
      register(tool) {
        tools.push(tool)
        return () => {}
      },
    },
    systemPrompt: {
      /**
       * @param {unknown} section - prompt section
       * @returns {() => void} disposer
       */
      section(section) {
        sections.push(section)
        return () => {}
      },
    },
  }
  apply(ctx, CONFIG)
  return { tools, sections, skills, routes }
}

test('config defaults are applied and invalid values fail at load time', () => {
  assert.equal(CONFIG.port.get(), 9876)
  assert.equal(CONFIG.snapshot.generations.get(), 3)
  assert.equal(CONFIG.snapshot.timeoutMs.get(), 120000)
  assert.equal(CONFIG.snapshot.on.get(), 'adaptive')
  assert.equal(CONFIG.snapshot.everyWrites.get(), 10)
  assert.equal(CONFIG.snapshot.onDestructive.get(), true)
  assert.throws(() => Config({ port: 70000 }))
  assert.throws(() => Config({ snapshot: { generations: 99 } }))
  assert.throws(() => Config({ snapshot: { timeoutMs: 0 } }))
  assert.throws(() => Config({ snapshot: { on: 'sometimes' } }))
  assert.throws(() => Config({ snapshot: { everyWrites: 0 } }))
  assert.throws(() => Config({ taskRootMode: 'somewhere' }))
})

test('every graphics-settings field is a live volatile reference', () => {
  const fields = [
    CONFIG.host,
    CONFIG.port,
    CONFIG.connectTimeoutMs,
    CONFIG.responseTimeoutMs,
    CONFIG.captureTimeoutMs,
    CONFIG.renderTimeoutMs,
    CONFIG.maxResponseChars,
    CONFIG.taskRootMode,
    CONFIG.taskRoot,
    CONFIG.snapshot.enabled,
    CONFIG.snapshot.generations,
    CONFIG.snapshot.on,
    CONFIG.snapshot.everyWrites,
    CONFIG.snapshot.onDestructive,
    CONFIG.snapshot.compress,
    CONFIG.snapshot.timeoutMs,
    CONFIG.guard.enabled,
    CONFIG.helper.basePython,
    CONFIG.helper.pipIndexUrl,
    CONFIG.helper.timeoutMs,
    CONFIG.helper.maxOutputChars,
    CONFIG.helper.enableMaintenanceHelpers,
    CONFIG.audit.enabled,
    CONFIG.audit.storeCode,
  ]
  for (const field of fields) assert.equal(typeof field?.get, 'function')
})

test('apply registers the full tool surface', () => {
  const { tools } = runApply()
  const names = tools.map((tool) => tool.name).sort()
  assert.deepEqual(names, [
    'blender_mcp_capture',
    'blender_mcp_exec',
    'blender_mcp_helper',
    'blender_mcp_helpers',
    'blender_mcp_inspect',
    'blender_mcp_render',
    'blender_mcp_render_status',
    'blender_mcp_snapshot',
    'blender_mcp_status',
  ])
  for (const tool of tools) {
    assert.match(tool.description, /Blender/i)
  }
})

test('apply registers the helper environment and settings routes', () => {
  const { routes } = runApply()
  assert.equal(routes.length, 2)
  const envRoute = routes.find((route) => route.path === '/api/blender-bridge/helper-env')
  const settingsRoute = routes.find((route) => route.path === '/api/blender-bridge/settings')
  assert.ok(envRoute)
  assert.ok(settingsRoute)
  for (const route of [envRoute, settingsRoute]) {
    assert.deepEqual(route.methods, ['GET', 'POST'])
    assert.equal(route.requestBody, 'buffered')
    assert.equal(typeof route.fetch, 'function')
  }
})

test('the settings route reads and writes the plugin files', async () => {
  const { routes } = runApply()
  const route = routes.find((candidate) => candidate.path === '/api/blender-bridge/settings')
  assert.ok(route)
  const getResponse = await route.fetch(new Request('http://localhost/api/blender-bridge/settings'))
  assert.equal(getResponse.status, 200)
  const snapshot = await getResponse.json()
  assert.equal(snapshot.status, 'ready')
  assert.equal(typeof snapshot.revision, 'string')
  assert.equal(snapshot.base.port, 9876)
  const before = snapshot.value.port
  const next = before === 9876 ? 9877 : 9876
  const postResponse = await route.fetch(
    new Request('http://localhost/api/blender-bridge/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ops: [{ op: 'set', path: ['port'], value: next }], expectedRevision: snapshot.revision }),
    }),
  )
  assert.equal(postResponse.status, 200)
  const saved = await postResponse.json()
  assert.equal(saved.value.port, next)
  const file = path.join(settingsDir(process.env.DSH_HOME ?? ''), 'connection.json')
  assert.equal(existsSync(file), true)
  const parsed = JSON.parse(readFileSync(file, 'utf8'))
  assert.equal(parsed.values.port, next)
  assert.equal(existsSync(path.join(settingsDir(process.env.DSH_HOME ?? ''), 'settings.json')), false)
})

test('apply registers one system prompt section with the no-rollback rule', () => {
  const { sections } = runApply()
  assert.equal(sections.length, 1)
  const section = /** @type {{ name: string, text: string, order: number }} */ (sections[0])
  assert.equal(section.name, 'blender-mcp-bridge')
  assert.match(section.text, /Never try to roll back/)
  assert.match(section.text, /Never save the \.blend/)
  assert.match(section.text, /snapshot/)
  assert.match(section.text, /readOnly/)
  assert.match(section.text, /snapshot policy/)
  assert.match(section.text, /the user opens a snapshot/)
  assert.match(section.text, /Python helper environment/)
  assert.match(section.text, /never run pip install/)
})

test('the exec contract documents readOnly, the snapshot policy and the undo usage reply', () => {
  const { tools } = runApply()
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)
  assert.match(execTool.description, /readOnly/)
  assert.match(execTool.description, /undoUsage/)
  assert.match(execTool.description, /snapshot policy/)
  const parameters = /** @type {{ properties?: Record<string, unknown> }} */ (execTool.parameters)
  assert.ok(parameters.properties && Object.hasOwn(parameters.properties, 'readOnly'))
})

test('the render contract documents per-call timeouts, background starts and recovery', () => {
  const { tools } = runApply()
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_render_status')
  assert.ok(renderTool)
  assert.ok(statusTool)
  assert.match(renderTool.description, /timeoutMs/)
  assert.match(renderTool.description, /background: true/)
  assert.match(renderTool.description, /blender_mcp_render_status/)
  const parameters = /** @type {{ properties?: Record<string, unknown> }} */ (renderTool.parameters)
  assert.ok(parameters.properties && Object.hasOwn(parameters.properties, 'timeoutMs'))
  assert.ok(parameters.properties && Object.hasOwn(parameters.properties, 'background'))
  assert.match(statusTool.description, /running, finished or failed/)
  assert.doesNotMatch(statusTool.description, /undo step/)
  const statusParameters = /** @type {{ properties?: Record<string, unknown> }} */ (statusTool.parameters)
  assert.ok(statusParameters.properties && Object.hasOwn(statusParameters.properties, 'jobId'))
})

test('the system prompt explains render timeouts and the status recovery tool', () => {
  const { sections } = runApply()
  const section = /** @type {{ text: string }} */ (sections[0])
  assert.match(section.text, /timeoutMs/)
  assert.match(section.text, /blender_mcp_render_status/)
})

test('the inspect contract documents scopes, filters and paging', () => {
  const { tools } = runApply()
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)
  assert.match(inspectTool.description, /scope/)
  assert.match(inspectTool.description, /offset/)
  assert.match(inspectTool.description, /Read-only/)
  assert.doesNotMatch(inspectTool.description, /up to 200 objects/)
  const parameters = /** @type {{ properties?: Record<string, any> }} */ (inspectTool.parameters)
  assert.ok(parameters.properties)
  for (const name of ['scope', 'name', 'type', 'collection', 'collectionDeep', 'include', 'limit', 'offset']) {
    assert.ok(Object.hasOwn(parameters.properties, name), `${name} must be a parameter`)
  }
  assert.deepEqual(parameters.properties.scope.enum, ['summary', 'objects', 'collections', 'materials', 'lights', 'cameras'])
})

test('registers the live-session skill when the skills service exists', () => {
  const { skills } = runApply()
  assert.equal(skills.length, 1)
  const skill = skills[0]
  assert.equal(skill.name, 'blender-live-session')
  assert.equal(skill.source, 'dsh-blender-mcp-bridge')
  assert.ok(skill.description.length > 0)
  assert.match(skill.content, /Never roll back/)
  assert.match(skill.content, /blender_mcp_exec/)
  assert.match(skill.content, /blender_mcp_render_status/)
  assert.equal(skill.resourceBase.kind, 'directory')
  assert.match(skill.resourceBase.path, /skills[\\/]blender-live-session$/)
})

test('apply works without a skills service', () => {
  const { tools, skills } = runApply(false)
  assert.equal(tools.length, 9)
  assert.equal(skills.length, 0)
})

test('the skill resource directory ships its SKILL.md', () => {
  const { skills } = runApply()
  const skill = skills[0]
  assert.ok(existsSync(path.join(skill.resourceBase.path, 'SKILL.md')))
  assert.ok(existsSync(path.join(skill.resourceBase.path, 'references', 'visual-validation.md')))
})

test('the classic exec wrapper still captures result and pushes undo', () => {
  const wrapped = wrapExecCode('result = {"ok": True}', 'lamp')
  assert.match(wrapped, /bpy\.ops\.ed\.undo_push/)
  assert.match(wrapped, /dsh-blender: lamp/)
  assert.match(wrapped, /<dsh-user-code>/)
  assert.match(wrapped, /result = \{/)
  assert.match(wrapped, /_dsh_ns/)
})
