/**
 * Plugin display metadata: the Plugins settings card reads its title,
 * description, and icon from exported resources without running the plugin.
 *
 * The Chinese UI shows the localized name, the English UI keeps the package
 * name, and both descriptions come from the matching locale file.
 */

import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)

/**
 * Read one JSON file from the package root.
 *
 * @param {string} name package-relative path
 * @returns {any} parsed JSON
 */
function readJson(name) {
  return JSON.parse(readFileSync(new URL(name, root), 'utf8'))
}

test('the locale exports carry the bilingual settings title', () => {
  const manifest = readJson('package.json')
  assert.equal(manifest.exports['./locale/*.json'], './locale/*.json')
  assert.ok(manifest.files.includes('locale'))

  const en = readJson('locale/en.json')
  const zh = readJson('locale/zh.json')
  assert.equal(en.meta.title, 'dsh-blender-mcp-bridge')
  assert.equal(zh.meta.title, 'Blender MCP 插件桥')
  assert.ok(en.meta.description.length > 0)
  assert.ok(zh.meta.description.length > 0)
  assert.notEqual(en.meta.description, zh.meta.description)
})

test('the settings icon is a small SVG inside the package', () => {
  const manifest = readJson('package.json')
  assert.equal(manifest.icon, './icon.svg')
  assert.equal(manifest.exports['./icon'], './icon.svg')
  assert.ok(manifest.files.includes('icon.svg'))

  const file = new URL(manifest.icon, root)
  const stat = statSync(file)
  const svg = readFileSync(file, 'utf8')
  assert.ok(stat.isFile())
  assert.ok(stat.size <= 256 * 1024)
  assert.match(svg, /^<svg[\s>]/)
  assert.match(svg, /<\/svg>\s*$/)
})
