/**
 * Offline probe: compile every generated Python payload with the interpreter
 * Blender actually ships (or any Python 3 found).
 *
 * A syntax error here would surface as a broken request in Blender, so this
 * runs without a live session.
 *
 * Usage:
 *   node diagnostics/probePythonSyntax.js
 *   set DSH_BLENDER_PYTHON=C:\path\to\python.exe && node diagnostics/probePythonSyntax.js
 */

import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { wrapWithGuard } from '../lib/guardPayload.js'
import { captureCode } from '../lib/capture.js'
import { HANDSHAKE_CODE } from '../lib/handshake.js'
import { renderCode } from '../lib/render.js'
import { snapshotCode } from '../lib/snapshot.js'
import { INSPECT_CODE } from '../lib/pythonSnippets.js'
import { findPython } from './findPython.js'

const python = findPython()
if (python === null) {
  console.log('SKIP no Python interpreter found')
  process.exit(0)
}
console.log(`interpreter ${python}`)

const workDir = mkdtempSync(path.join(tmpdir(), 'dsh-py-syntax-'))
const payloads = [
  ['handshake.py', HANDSHAKE_CODE],
  ['inspect.py', INSPECT_CODE],
  ['snapshot.py', snapshotCode(path.join(workDir, 'snap.blend'), true)],
  ['capture.py', captureCode(path.join(workDir, 'shot.png'))],
  [
    'render.py',
    renderCode({ filePath: path.join(workDir, 'render.png'), width: 640, height: 360, samples: 16 }),
  ],
  [
    'exec-guarded.py',
    wrapWithGuard('result = {"ok": True}', {
      taskRoot: path.join(workDir, 'task'),
      undoMessage: 'dsh-blender: probe',
    }),
  ],
  [
    'exec-unguarded.py',
    wrapWithGuard('result = {"ok": True}', {
      taskRoot: path.join(workDir, 'task'),
      undoMessage: 'dsh-blender: probe',
      guardEnabled: false,
    }),
  ],
  [
    'exec-readonly.py',
    wrapWithGuard('result = {"ok": True}', {
      taskRoot: path.join(workDir, 'task'),
      undoMessage: 'dsh-blender: probe',
      readOnly: true,
    }),
  ],
  [
    'exec-readonly-unguarded.py',
    wrapWithGuard('result = {"ok": True}', {
      taskRoot: path.join(workDir, 'task'),
      undoMessage: 'dsh-blender: probe',
      readOnly: true,
      guardEnabled: false,
    }),
  ],
]

let failed = false
for (const [name, source] of payloads) {
  const file = path.join(workDir, name)
  writeFileSync(file, source, 'utf8')
  const result = spawnSync(python, ['-m', 'py_compile', file], { stdio: 'inherit' })
  if (result.status === 0) {
    console.log(`PASS ${name}`)
  } else {
    failed = true
    console.log(`FAIL ${name}`)
  }
}
process.exit(failed ? 1 : 0)
