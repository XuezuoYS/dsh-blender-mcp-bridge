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
})

test('dynamic bypasses are warned about, not claimed as blocked', () => {
  const result = scanRequest('import ctypes', TASK_DIR)
  assert.equal(result.blocks.length, 0)
  assert.ok(result.warnings.some((warning) => warning.includes('ctypes')))
})
