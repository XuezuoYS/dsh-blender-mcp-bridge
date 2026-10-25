/**
 * Guard payload tests: the generated Python must install, verify and uninstall
 * the runtime hooks, and push one undo step in the default mode. The read-only
 * mode carries the scene fingerprint and pushes only when it sees a change.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { wrapWithGuard } from '../lib/guardPayload.js'

test('guarded payload installs hooks, blocks save operators and uninstalls', () => {
  const code = wrapWithGuard('result = {"ok": True}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
  })
  assert.match(code, /_dsh_handle = _dsh_install\("C:\/proj\/\.dsh-blender-lamp"\)/)
  assert.match(code, /_dsh_uninstall\(_dsh_handle\)/)
  assert.match(code, /finally:/)
  assert.match(code, /preferencesChanged/)
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

test('the read-only payload fingerprints the scene and pushes undo only on change', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
    readOnly: true,
  })
  assert.match(code, /def _dsh_fingerprint\(\):/)
  assert.match(code, /_dsh_fp_before = _dsh_fingerprint\(\)/)
  assert.match(code, /'read-only'/)
  assert.match(code, /'read-only-changed'/)
  assert.match(code, /'read-only-unverified'/)
  assert.equal((code.match(/bpy\.ops\.ed\.undo_push/g) ?? []).length, 1)
  // The fingerprint imports run before the install call replaces open()/bpy.ops.
  assert.ok(code.indexOf('def _dsh_fingerprint()') < code.indexOf('_dsh_handle = _dsh_install('))
})

test('the default payload carries no fingerprint code', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
  })
  assert.doesNotMatch(code, /_dsh_fingerprint/)
  assert.match(code, /bpy\.ops\.ed\.undo_push/)
})

test('a script name replaces the compile() file name in tracebacks', () => {
  const code = wrapWithGuard('result = {}', {
    taskRoot: 'C:/proj/.dsh-blender-lamp',
    undoMessage: 'dsh-blender: lamp',
    codeName: '<dsh-script:scripts/make.py>',
  })
  assert.match(code, /<dsh-script:scripts\/make\.py>/)
  assert.doesNotMatch(code, /<dsh-user-code>/)
})
