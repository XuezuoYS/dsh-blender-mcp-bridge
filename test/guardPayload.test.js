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
  assert.match(code, /image\.save_as/)
  assert.match(code, /screen\.screenshot/)
  assert.match(code, /'image\.save'/)
  assert.match(code, /<dsh-user-code>/)
  assert.match(code, /bpy\.ops\.ed\.undo_push/)
  assert.match(code, /dsh-blender: lamp/)
  assert.match(code, /_OpsProxy/)
  assert.match(code, /_op_create_function/)
})

test('the ops proxy keeps the real bpy.ops out of reach', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
  })
  assert.doesNotMatch(code, /__slots__ = \('_dsh_real',\)/)
  assert.doesNotMatch(code, /self\._dsh_real/)
  assert.doesNotMatch(code, /self\._dsh_proxy/)
  assert.match(code, /def _dsh_make_ops_proxy\(real_ops\)/)
  assert.match(code, /if item\.startswith\('_'\):/)
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
