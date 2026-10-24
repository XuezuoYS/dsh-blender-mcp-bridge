/**
 * Plugin-owned settings storage tests.
 *
 * These exercise the split JSON files without touching the real DSH home.
 */

import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { defaultSettings, pickKnown } from '../lib/config.js'
import {
  createSettingsStore,
  SETTINGS_FILE_NAMES,
  SETTINGS_SCHEMA,
  SettingsStoreError,
  settingsDir,
} from '../lib/settingsStore.js'

/**
 * @param {object} [setup] - overrides
 * @param {any} [setup.legacy] - one-time profile values
 * @param {string} [setup.root] - reuse a directory
 * @returns {{ root: string, store: any, defaults: any, warnings: string[] }} fixture
 */
function makeStore(setup = {}) {
  const root = setup.root ?? mkdtempSync(path.join(os.tmpdir(), 'dsh-settings-'))
  const defaults = defaultSettings()
  /** @type {string[]} */
  const warnings = []
  const legacy =
    setup.legacy === undefined
      ? pickKnown(
          {
            ...defaults,
            port: 9999,
            snapshot: { ...defaults.snapshot, generations: 5 },
            helper: { ...defaults.helper, basePython: 'C:/Blender/python.exe' },
            legacyOnly: 'ignored',
          },
          defaults,
        )
      : pickKnown(setup.legacy, defaults)
  const store = createSettingsStore({
    dshHome: root,
    defaults,
    legacy,
    warn: (message) => warnings.push(message),
    now: () => new Date('2026-01-01T00:00:00.000Z'),
  })
  return { root, store, defaults, warnings }
}

test('first use migrates profile values into split files, never settings.json', () => {
  const { root, store, warnings } = makeStore()
  const dir = settingsDir(root)
  assert.equal(settingsDir(root).endsWith(path.join('dsh-blender-mcp-bridge')), true)
  assert.equal(existsSync(path.join(dir, 'settings.json')), false)
  for (const fileName of Object.values(SETTINGS_FILE_NAMES)) {
    const file = path.join(dir, fileName)
    assert.ok(existsSync(file), `${fileName} exists`)
    const parsed = JSON.parse(readFileSync(file, 'utf8'))
    assert.equal(parsed.schemaVersion, SETTINGS_SCHEMA)
    assert.equal(typeof parsed.updatedAt, 'string')
    assert.equal(typeof parsed.values, 'object')
  }
  assert.equal(store.get().port, 9999)
  assert.equal(store.get().snapshot.generations, 5)
  assert.equal(store.get().helper.basePython, 'C:/Blender/python.exe')
  assert.equal(Object.hasOwn(store.get(), 'legacyOnly'), false)
})

test('an existing file wins over the profile migration value', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'dsh-settings-'))
  const dir = settingsDir(root)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    path.join(dir, 'connection.json'),
    JSON.stringify({ schemaVersion: 1, updatedAt: 'old', values: { port: 1234 } }),
    'utf8',
  )
  const { store } = makeStore({ root, legacy: { port: 9999 } })
  assert.equal(store.get().port, 1234)
  assert.equal(store.get().host, '127.0.0.1', 'missing leaves come from defaults')
})

test('update writes the owning file, keeps the revision and reports conflicts', () => {
  const { root, store } = makeStore()
  const before = store.getRevision()
  const result = store.update([{ op: 'set', path: ['port'], value: 1234 }], before)
  assert.equal(result.ok, true)
  assert.notEqual(result.revision, before)
  assert.equal(store.get().port, 1234)
  const file = path.join(settingsDir(root), 'connection.json')
  const parsed = JSON.parse(readFileSync(file, 'utf8'))
  assert.equal(parsed.values.port, 1234)

  const conflict = store.update([{ op: 'set', path: ['port'], value: 4321 }], before)
  assert.equal(conflict.ok, false)
  assert.equal(conflict.conflict, true)
  assert.equal(store.get().port, 1234)
})

test('invalid and unknown changes are refused without writing', () => {
  const { root, store } = makeStore()
  const before = store.getRevision()
  assert.throws(
    () => store.update([{ op: 'set', path: ['port'], value: 70000 }], before),
    (error) => error instanceof SettingsStoreError && error.kind === 'invalid',
  )
  assert.throws(
    () => store.update([{ op: 'set', path: ['nope'], value: true }], before),
    (error) => error instanceof SettingsStoreError && error.kind === 'invalid',
  )
  assert.equal(store.get().port, 9999)
  const parsed = JSON.parse(readFileSync(path.join(settingsDir(root), 'connection.json'), 'utf8'))
  assert.equal(parsed.values.port, 9999)
})

test('external file edits can be reloaded without a restart', () => {
  const { root, store } = makeStore()
  assert.equal(store.get().port, 9999)
  const file = path.join(settingsDir(root), 'connection.json')
  writeFileSync(
    file,
    JSON.stringify({ schemaVersion: 1, updatedAt: 'new', values: { ...store.get(), port: 4321 } }),
    'utf8',
  )
  assert.equal(store.reload(), true)
  assert.equal(store.get().port, 4321)
})

test('a corrupt file is kept out of the live value and reload fails loudly', () => {
  const { root, store, warnings } = makeStore()
  const file = path.join(settingsDir(root), 'task.json')
  writeFileSync(file, 'not json', 'utf8')
  assert.equal(store.reload(), false)
  assert.equal(store.get().taskRootMode, 'blendFile')
  assert.ok(warnings.some((warning) => warning.includes('settings reload failed')))
})

test('a deleted file falls back to defaults on reload', () => {
  const { root, store } = makeStore()
  const file = path.join(settingsDir(root), 'snapshot.json')
  rmSync(file, { force: true })
  assert.equal(store.reload(), true)
  assert.equal(store.get().snapshot.generations, store.getDefaults().snapshot.generations)
})

test('an invalid file on first use is backed up and replaced', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'dsh-settings-'))
  const dir = settingsDir(root)
  mkdirSync(dir, { recursive: true })
  const file = path.join(dir, 'task.json')
  writeFileSync(file, '{ broken', 'utf8')
  const { store } = makeStore({ root })
  assert.equal(existsSync(`${file}.bak`), true)
  assert.equal(store.get().taskRootMode, 'blendFile')
  const parsed = JSON.parse(readFileSync(file, 'utf8'))
  assert.equal(parsed.schemaVersion, SETTINGS_SCHEMA)
})
