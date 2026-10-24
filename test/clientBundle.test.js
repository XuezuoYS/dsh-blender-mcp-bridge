/**
 * Browser bundle wiring tests.
 *
 * The Web client loads `client.js` as a lazy-CJS module and calls its `apply`.
 * These checks run the real bundle in a small VM with a fake React and Cordis
 * context, so the registration key, locale namespace, and form lookup are
 * covered without a browser.
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import { Config } from '../index.js'

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8')

/**
 * Execute the bundle and materialize its module exports.
 *
 * @returns {{ definition: any, exports: any }} captured loader row and exports
 */
function loadBundle() {
  /** @type {any} */
  let definition
  const context = vm.createContext({
    window: {
      __ModuleLoader__: {
        /** @param {any} row - loader row */
        load(row) {
          definition = row
        },
      },
    },
    console,
    setTimeout,
    clearTimeout,
    structuredClone,
  })
  new vm.Script(source, { filename: 'client.js' }).runInContext(context)
  assert.ok(definition, 'the bundle registers a loader row')
  const React = {
    createElement: () => null,
    Component: class {},
  }
  const exports = definition.factory((/** @type {string} */ name) => {
    if (name === 'react') return React
    throw new Error(`unexpected require: ${name}`)
  })
  return { definition, exports }
}

test('the client bundle registers the Settings-panel page', () => {
  const { definition, exports } = loadBundle()
  assert.equal(definition.id, 'dsh-blender-mcp-bridge')
  assert.deepEqual(Array.from(exports.inject), ['slots', 'locale'])

  /** @type {{ locale: any[], injected: any[], registered: any[], forms: string[] }} */
  const calls = { locale: [], injected: [], registered: [], forms: [] }
  const ctx = {
    /** @param {() => unknown} setup - effect body */
    effect(setup) {
      return setup()
    },
    locale: {
      /**
       * @param {string} ns - namespace
       * @param {any} dicts - dictionaries
       */
      register(ns, dicts) {
        calls.locale.push({ ns, dicts })
        return () => {}
      },
      /**
       * @param {string} ns - namespace
       * @returns {(key: string) => string} bound translator
       */
      bind(ns) {
        return (/** @type {string} */ key) => {
          const entry = calls.locale.find((candidate) => candidate.ns === ns)
          return entry?.dicts.zh[key] ?? key
        }
      },
    },
    slots: {
      /**
       * @param {string} name - slot
       * @param {() => any} callback - registration
       */
      inject(name, callback) {
        calls.injected.push({ name, callback })
        return () => {}
      },
      /**
       * @param {any} options - registration options
       * @param {any} component - page component
       */
      register(options, component) {
        calls.registered.push({ options, component })
        return () => {}
      },
    },
    configForms: {
      /** @param {string} id - entry id */
      get(id) {
        calls.forms.push(id)
        return {
          getSnapshot: () => ({ status: 'loading' }),
          subscribe: () => () => {},
          mutate: async () => true,
        }
      },
    },
  }

  exports.apply(ctx)
  assert.equal(calls.locale.length, 1)
  assert.equal(calls.locale[0].ns, 'blenderBridge')
  assert.equal(calls.locale[0].dicts.zh.title, 'Blender MCP 插件桥')
  assert.equal(calls.locale[0].dicts.en.title, 'dsh-blender-mcp-bridge')
  assert.deepEqual(Object.keys(calls.locale[0].dicts.zh).sort(), Object.keys(calls.locale[0].dicts.en).sort())
  assert.deepEqual(calls.forms, [])
  assert.equal(calls.injected.length, 1)
  assert.equal(calls.injected[0].name, 'settings.section')

  /** @type {Set<string>} */
  const copyKeys = new Set()
  for (const match of source.matchAll(/\bt\('([A-Za-z][A-Za-z0-9]+)'/g)) copyKeys.add(match[1])
  for (const match of source.matchAll(/\b(?:label|hint|title|placeholder): '([A-Za-z][A-Za-z0-9]+)'/g)) copyKeys.add(match[1])
  for (const key of ['modeAdaptive', 'modeTurn', 'modeWrite', 'taskModeBlend', 'taskModeWorkspace']) copyKeys.add(key)
  for (const key of copyKeys) {
    assert.ok(key in calls.locale[0].dicts.zh, `zh copy is missing ${key}`)
    assert.ok(key in calls.locale[0].dicts.en, `en copy is missing ${key}`)
  }

  const disposer = calls.injected[0].callback()
  assert.equal(calls.registered.length, 1)
  assert.equal(calls.registered[0].options.name, 'settings.section')
  assert.equal(calls.registered[0].options.id, 'blenderBridge')
  assert.equal(calls.registered[0].options.order, 55)
  assert.equal(typeof calls.registered[0].options.label, 'function')
  assert.equal(calls.registered[0].options.label(), 'Blender MCP')
  assert.equal(typeof calls.registered[0].component, 'function')
  assert.equal(typeof disposer, 'function')
  assert.equal(typeof exports.apply, 'function')
})

test('the manifest declares the browser half and ships it', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(manifest.exports['./client'], './client.js')
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.ok(manifest.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-settings'))
  assert.ok(manifest.files.includes('client.js'))
})

test('every settings field path is a live Config field', () => {
  /** @type {any} */
  const config = Config({})
  const paths = [...source.matchAll(/path: \[([^\]]+)\]/g)].map((match) =>
    match[1].split(',').map((part) => part.trim().replace(/^['"]|['"]$/g, '')),
  )
  assert.equal(paths.length, 24)
  for (const path of paths) {
    /** @type {any} */
    let node = config
    for (const key of path) node = node?.[key]
    assert.equal(typeof node?.get, 'function', `missing volatile field ${path.join('.')}`)
  }
})

