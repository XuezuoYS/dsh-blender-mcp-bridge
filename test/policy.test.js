/**
 * L1 static refusal tests.
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import { test } from 'node:test'
import { scanRequest } from '../lib/policy.js'

const TASK_DIR = path.resolve('C:/proj/.dsh-blender-lamp')

test('save, open, quit and preference calls are refused', () => {
  const cases = [
    'bpy.ops.wm.save_mainfile()',
    'bpy.ops.wm.save_as_mainfile(filepath="x.blend")',
    'bpy.ops.wm.open_mainfile(filepath="x.blend")',
    'bpy.ops.wm.quit_blender()',
    'bpy.context.preferences.edit.undo_steps = 100',
    'sys.exit(0)',
  ]
  for (const code of cases) {
    const result = scanRequest(code, TASK_DIR)
    assert.ok(result.blocks.length > 0, `expected a block for: ${code}`)
  }
})

test('obvious out-of-task writes are refused with a suggestion', () => {
  const result = scanRequest('open("C:/Windows/Temp/x.txt", "w")', TASK_DIR)
  assert.equal(result.blocks[0].rule, 'write-outside-task')
  assert.ok(result.blocks[0].suggestion?.includes('.dsh-blender-lamp'))
})

test('writes inside the task directory pass', () => {
  const result = scanRequest(`open(${JSON.stringify(path.join(TASK_DIR, 'out.txt'))}, "w")`, TASK_DIR)
  assert.equal(result.blocks.length, 0)
})

test('read-only opens and ordinary code pass', () => {
  const result = scanRequest('obj = bpy.context.active_object\nprint(obj.name)', TASK_DIR)
  assert.equal(result.blocks.length, 0)
  const read = scanRequest('data = open("C:/Users/me/notes.txt").read()', TASK_DIR)
  assert.equal(read.blocks.length, 0)
})

test('forward-slash paths inside the task directory pass', () => {
  const inside = `${TASK_DIR.replace(/\\/g, '/')}/out.png`
  const result = scanRequest(`open("${inside}", "w")`, TASK_DIR)
  assert.equal(result.blocks.length, 0)
})

test('dot-dot escapes, pathlib writes and split preferences are refused', () => {
  const cases = [
    'open("C:\\\\proj\\\\.dsh-blender-lamp\\\\..\\\\..\\\\Users\\\\me\\\\x.blend", "w")',
    'import pathlib\npathlib.Path("C:/Users/me/x.txt").write_text("a")',
    'import pathlib\npathlib.Path("C:/Users/me/x.txt").open("w")',
    'p = bpy.context\np.preferences.theme = 1',
  ]
  for (const code of cases) {
    assert.ok(scanRequest(code, TASK_DIR).blocks.length > 0, `expected a block for: ${code}`)
  }
})

test('dynamic bypasses are warned about, not claimed as blocked', () => {
  const result = scanRequest('import ctypes', TASK_DIR)
  assert.equal(result.blocks.length, 0)
  assert.ok(result.warnings.some((warning) => warning.includes('ctypes')))
})

test('whitelisted preference diagnostics are read-only and allowed', () => {
  const cases = [
    'limit = bpy.context.preferences.edit.undo_steps',
    'memory = bpy.context.preferences.edit.undo_memory_limit',
    'global_undo = bpy.context.preferences.edit.use_global_undo',
    "device = bpy.context.preferences.addons['cycles'].preferences.compute_device_type",
    'device = bpy.context.preferences.addons["cycles"].preferences.compute_device_type',
    "device = bpy.context.preferences.addons.get('cycles').preferences.compute_device_type",
    'if bpy.context.preferences.edit.undo_steps == 32:\n    result = {}',
  ]
  for (const code of cases) {
    assert.equal(scanRequest(code, TASK_DIR).blocks.length, 0, `expected no block for: ${code}`)
  }
})

test('preference writes are refused even on whitelisted paths', () => {
  const cases = [
    'bpy.context.preferences.edit.undo_steps = 100',
    'bpy.context.preferences.edit.undo_steps += 1',
    "setattr(bpy.context.preferences.edit, 'undo_steps', 100)",
    "bpy.context.preferences.addons['cycles'].preferences.compute_device_type = 'CUDA'",
    'del bpy.context.preferences.edit.undo_steps',
  ]
  for (const code of cases) {
    const result = scanRequest(code, TASK_DIR)
    assert.equal(result.blocks[0]?.rule, 'preferences', `expected the write rule for: ${code}`)
  }
})

test('preference reads outside the whitelist point at blender_mcp_status', () => {
  const cases = [
    'theme = bpy.context.preferences.theme',
    'p = bpy.context.preferences',
    'devices = bpy.context.preferences.addons["cycles"].preferences.devices',
    'bpy.context.preferences.addons["cycles"].preferences.devices.clear()',
    'print(bpy.context.preferences.edit.undo_steps, bpy.context.preferences.theme)',
  ]
  for (const code of cases) {
    const result = scanRequest(code, TASK_DIR)
    assert.equal(result.blocks[0]?.rule, 'preferences-read', `expected the read rule for: ${code}`)
    assert.ok(result.blocks[0].suggestion?.includes('blender_mcp_status'))
  }
})

test('script warnings carry the source label and merge repeated lines', () => {
  const source = 'import ctypes\nvalue = 1\nimport ctypes\nimport ctypes'
  const result = scanRequest(source, TASK_DIR, 'script scripts/make.py')
  assert.equal(result.warnings.length, 1)
  assert.equal(result.warnings[0], 'script scripts/make.py lines 1, 3, 4: ctypes can bypass the runtime guard')
})

test('a single warning keeps the original line format', () => {
  const result = scanRequest('import subprocess', TASK_DIR)
  assert.equal(result.warnings[0], 'line 1: subprocess is not covered by the runtime guard')
})

test('long warning line lists are capped with a count', () => {
  const source = Array.from({ length: 9 }, () => 'import ctypes').join('\n')
  const result = scanRequest(source, TASK_DIR)
  assert.equal(result.warnings.length, 1)
  assert.match(result.warnings[0], /^lines 1, 2, 3, 4, 5, 6, \+3 more: ctypes/)
})

test('running code read from a file points at scriptPath', () => {
  const result = scanRequest('exec(open("scripts/make.py").read())', TASK_DIR)
  const text = result.warnings.join('\n')
  assert.match(text, /not covered by this static scan/)
  assert.match(text, /scriptPath/)
  assert.doesNotMatch(text, /exec\(\) can build code/)
})
