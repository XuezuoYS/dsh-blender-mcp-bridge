/**
 * Locate a Python 3 interpreter, preferring Blender's bundled one.
 *
 * @module diagnostics/findPython
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

/**
 * Find a Python 3 interpreter, preferring Blender's bundled one.
 *
 * @returns {string | null} interpreter path or command name
 */
export function findPython() {
  const configured = process.env.DSH_BLENDER_PYTHON
  if (configured && existsSync(configured)) return configured
  if (process.platform === 'win32') {
    const root = 'C:\\Program Files\\Blender Foundation'
    if (existsSync(root)) {
      for (const release of readdirSync(root).sort().reverse()) {
        const candidate = path.join(root, release, release.replace('Blender ', ''), 'python', 'bin', 'python.exe')
        if (existsSync(candidate)) return candidate
      }
    }
  }
  for (const name of ['python', 'python3']) {
    const probe = spawnSync(name, ['--version'], { stdio: 'ignore' })
    if (probe.status === 0) return name
  }
  return null
}
