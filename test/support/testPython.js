/**
 * Test-only Python discovery.
 *
 * The plugin itself never searches for an interpreter; these tests still need
 * one to run the guarded payload drivers and the pure-Python helpers. This
 * helper tries the usual command names and skips the test when none works.
 */

import { spawnSync } from 'node:child_process'
import { probeInterpreter } from '../../lib/pythonRuntime.js'

/**
 * @typedef {object} TestPython
 * @property {string} command
 * @property {string[]} args
 * @property {string} version
 * @property {string} source
 */

/** @type {Promise<TestPython | null> | null} */
let pending = null

/**
 * Resolve a command name to an absolute executable for tests.
 *
 * @param {string} command - command name
 * @returns {string} absolute path or the original command
 */
function locate(command) {
  const result = spawnSync(command, ['-c', 'import sys; print(sys.executable)'], { encoding: 'utf8' })
  if (result.status !== 0) return command
  const absolute = result.stdout.trim()
  return absolute === '' ? command : absolute
}

/**
 * Find a local Python 3.10+ interpreter for tests.
 *
 * @returns {Promise<TestPython | null>} interpreter or null
 */
export async function findTestPython() {
  if (pending === null) {
    pending = (async () => {
      const candidates = ['python', 'python3', 'python3.13', 'python3.12']
      for (const command of candidates) {
        const probe = await probeInterpreter(command, { timeoutMs: 5000 })
        if (!probe.ok) continue
        const [major, minor] = probe.version.split('.').map(Number)
        if (major > 3 || (major === 3 && minor >= 10)) {
          return { command: locate(command), args: [], version: probe.version, source: 'test' }
        }
      }
      return null
    })()
  }
  return await pending
}

/**
 * Build a fake helper environment for tool-pipeline tests.
 *
 * The fake always reports a ready environment backed by the local test
 * interpreter, so Blender-independent helper tests keep working offline.
 *
 * @returns {{ helperEnv: any, ready: Promise<boolean> }} options fragment and readiness promise
 */
export function createTestHelperEnv() {
  /** @type {TestPython | null} */
  let python = null
  const ready = findTestPython().then((found) => {
    python = found
    return found !== null
  })
  return {
    ready,
    helperEnv: {
      /** @param {any} info - ignored */
      noteBlenderSession(info) {
        void info
      },
      async status() {
        await ready
        return {
          schema: 1,
          state: python === null ? 'missing' : 'ready',
          usable: python !== null,
          envDir: '',
          venvPath: '',
          venvPython: python === null ? '' : python.command,
          venvVersion: python === null ? '' : python.version,
          base: {
            python: python === null ? '' : python.command,
            version: python === null ? '' : python.version,
            source: 'test',
            blenderVersion: '',
            valid: python !== null,
            installedFrom: null,
          },
          packages: { numpy: '2', Pillow: '12', 'opencv-python-headless': '4', scipy: '1' },
          missing: [],
          requirements: { hash: '', expected: '', matches: false, packages: {} },
          install: { state: 'idle', phase: '', startedAt: 0, elapsedMs: 0, error: null, logTail: [], logPath: '' },
          estimates: { downloadBytes: 0, diskBytes: 0 },
          hints: { installCommand: 'node scripts/setupAnalysis.js', settings: '' },
        }
      },
      /** @param {any} helper - helper spec */
      async runtimeFor(helper) {
        await ready
        if (python === null) throw new Error('test needs a local Python')
        if (helper.runtime !== 'python') throw new Error('not a python helper')
        return { python, source: 'base' }
      },
      beginHelper() {},
      endHelper() {},
      installHint: () => 'node scripts/setupAnalysis.js',
      async dispose() {},
    },
  }
}
