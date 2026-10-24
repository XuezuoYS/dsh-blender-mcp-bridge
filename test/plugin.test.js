/**
 * Plugin wiring tests: config defaults, tool registration and prompt text.
 *
 * These run offline. `apply()` is called with a fake cordis context, so the
 * tool definitions are compiled by the real `defineTool`.
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { apply, Config } from '../index.js'
import { wrapExecCode } from '../lib/tools.js'

/** Minimal config matching the schema defaults. */
const CONFIG = /** @type {any} */ (Config({}))

/**
 * @typedef {{ name: string, description: string, parameters: Record<string, unknown> }} RegisteredTool
 */

/**
 * Run `apply()` against a fake context.
 *
 * @param {boolean} [includeSkills] - expose a fake skills service
 * @returns {{ tools: RegisteredTool[], sections: unknown[], skills: any[] }} captured registrations
 */
function runApply(includeSkills = true) {
  /** @type {RegisteredTool[]} */
  const tools = []
  /** @type {unknown[]} */
  const sections = []
  /** @type {any[]} */
  const skills = []
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
  return { tools, sections, skills }
}

test('config defaults are applied and invalid values fail at load time', () => {
  assert.equal(CONFIG.port, 9876)
  assert.equal(CONFIG.snapshot.generations, 3)
  assert.equal(CONFIG.snapshot.timeoutMs, 120000)
  assert.equal(CONFIG.snapshot.on, 'adaptive')
  assert.equal(CONFIG.snapshot.everyWrites, 10)
  assert.equal(CONFIG.snapshot.onDestructive, true)
  assert.throws(() => Config({ port: 70000 }))
  assert.throws(() => Config({ snapshot: { generations: 99 } }))
  assert.throws(() => Config({ snapshot: { timeoutMs: 0 } }))
  assert.throws(() => Config({ snapshot: { on: 'sometimes' } }))
  assert.throws(() => Config({ snapshot: { everyWrites: 0 } }))
  assert.throws(() => Config({ taskRootMode: 'somewhere' }))
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
    'blender_mcp_snapshot',
    'blender_mcp_status',
  ])
  for (const tool of tools) {
    assert.match(tool.description, /Blender/i)
  }
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

test('registers the live-session skill when the skills service exists', () => {
  const { skills } = runApply()
  assert.equal(skills.length, 1)
  const skill = skills[0]
  assert.equal(skill.name, 'blender-live-session')
  assert.equal(skill.source, 'dsh-blender-mcp-bridge')
  assert.ok(skill.description.length > 0)
  assert.match(skill.content, /Never roll back/)
  assert.match(skill.content, /blender_mcp_exec/)
  assert.equal(skill.resourceBase.kind, 'directory')
  assert.match(skill.resourceBase.path, /skills[\\/]blender-live-session$/)
})

test('apply works without a skills service', () => {
  const { tools, skills } = runApply(false)
  assert.equal(tools.length, 8)
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
