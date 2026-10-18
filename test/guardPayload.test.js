/**
 * Guard payload tests: the generated Python must install, verify and uninstall
 * the runtime hooks, and must always push an undo step.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { wrapWithGuard } from '../lib/guardPayload.js'

test('guarded payload installs hooks, blocks save operators and uninstalls', () => {
  const code = wrapWithGuard('result = {"ok": True}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
  })
  assert.match(code, /_dsh_install\("C:\/proj\/\.dsh-blender-lamp"\)/)
  assert.match(code, /^_dsh_uninstall\(\)/m)
  assert.match(code, /wm\.save_mainfile/)
  assert.match(code, /wm\.open_mainfile/)
  assert.match(code, /bpy\.data\.libraries\.write/)
  assert.match(code, /pathlib\.Path/)
  assert.match(code, /<dsh-user-code>/)
  assert.match(code, /bpy\.ops\.ed\.undo_push/)
  assert.match(code, /dsh-blender: lamp/)
  assert.match(code, /_OpsProxy/)
  assert.match(code, /_op_create_function/)
})

test('guard can be disabled without dropping the undo step', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
    guardEnabled: false,
  })
  assert.doesNotMatch(code, /_dsh_install\(".*"\)/)
  assert.match(code, /bpy\.ops\.ed\.undo_push/)
  assert.match(code, /'enabled': False/)
})

test('thread scope is configurable', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
    threadScope: 'all',
  })
  assert.match(code, /'threadScope': "all"/)
})
