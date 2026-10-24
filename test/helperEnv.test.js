/**
 * Managed helper environment tests.
 *
 * A fake process runner simulates venv creation, pip and the import probe, so
 * the state machine runs offline. The base interpreter is the local test
 * Python used for the real version probe only.
 */

import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { listHelpers, getHelper } from '../lib/helperCatalog.js'
import { computeReadiness, createHelperEnv, helperEnvPaths } from '../lib/helperEnv.js'
import { findTestPython } from './support/testPython.js'

const LOCK = [
  '# test lock',
  'numpy==2.5.4',
  'Pillow==12.3.0',
  'opencv-python-headless==4.14.0.94',
  'scipy==1.18.1',
  '',
].join('\n')

const ALL_PACKAGES = {
  numpy: '2.5.4',
  Pillow: '12.3.0',
  'opencv-python-headless': '4.14.0.94',
  scipy: '1.18.1',
}

/**
 * @returns {{ code: number, signal: null, stdout: string, stderr: string, timedOut: boolean, aborted: boolean }} success result
 */
function ok(stdout = '') {
  return { code: 0, signal: null, stdout, stderr: '', timedOut: false, aborted: false }
}

/**
 * @param {string} stderr - error text
 * @returns {{ code: number, signal: null, stdout: string, stderr: string, timedOut: boolean, aborted: boolean }} failure result
 */
function failed(stderr) {
  return { code: 1, signal: null, stdout: '', stderr, timedOut: false, aborted: false }
}

/**
 * Build an environment manager with a fake process runner.
 *
 * @param {object} [setup] - overrides
 * @param {boolean} [setup.noBase] - leave the base Python empty
 * @param {boolean} [setup.failPip] - make pip fail
 * @param {Record<string, string | null>} [setup.packages] - probe packages
 * @param {string} [setup.lock] - lock content
 * @returns {Promise<{ env: any, dshHome: string, pluginRoot: string, calls: string[], state: any, paths: any, python: any }>} fixture
 */
async function makeEnv(setup = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-helper-env-'))
  const dshHome = path.join(root, 'home')
  const pluginRoot = path.join(root, 'plugin')
  await mkdir(pluginRoot, { recursive: true })
  await writeFile(path.join(pluginRoot, 'requirements-analysis.lock.txt'), setup.lock ?? LOCK, 'utf8')
  const python = await findTestPython()
  const paths = helperEnvPaths(dshHome, pluginRoot)
  const state = {
    packages: setup.packages ?? { ...ALL_PACKAGES },
    failPip: setup.failPip === true,
  }
  /** @type {string[]} */
  const calls = []
  /**
   * @param {string} command - executable
   * @param {string[]} args - arguments
   * @param {{ onLine?: (line: string, stream: 'stdout'|'stderr') => void }} [options] - run options
   * @returns {Promise<any>} fake result
   */
  const fakeRun = async (command, args, options = {}) => {
    calls.push(`${command} ${args.join(' ')}`)
    if (args.includes('venv')) {
      const target = args[args.indexOf('venv') + 1]
      const pythonPath =
        process.platform === 'win32'
          ? path.join(target, 'Scripts', 'python.exe')
          : path.join(target, 'bin', 'python3')
      await mkdir(path.dirname(pythonPath), { recursive: true })
      await writeFile(pythonPath, '')
      return ok('')
    }
    if (args.includes('pip')) {
      options.onLine?.('Looking in indexes: https://user:pass@example.invalid/simple', 'stdout')
      if (state.failPip) {
        state.packages = { numpy: null, Pillow: null, 'opencv-python-headless': null, scipy: null }
        return failed('pip could not reach the index')
      }
      options.onLine?.('Successfully installed', 'stdout')
      return ok('')
    }
    if (args.includes('-c')) {
      return ok(JSON.stringify({ version: '3.13.13', packages: state.packages }))
    }
    return ok('')
  }
  const env = createHelperEnv({
    dshHome,
    pluginRoot,
    packageVersion: 'test',
    getConfig: () => ({ basePython: setup.noBase === true ? '' : python?.command ?? '', pipIndexUrl: '' }),
    runProcess: fakeRun,
  })
  return { env, dshHome, pluginRoot, calls, state, paths, python }
}

test('a fresh environment is missing and only the fixed venv is probed', async (t) => {
  const { env, calls, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  const status = await env.status()
  assert.equal(status.state, 'missing')
  assert.equal(status.usable, false)
  assert.equal(status.base.valid, true)
  assert.equal(status.venvPath.endsWith(path.join('dsh-blender-mcp-bridge', 'python', 'venv')), true)
  assert.equal(calls.length, 0, 'status must not spawn the fake venv runner when the venv is absent')
  const readiness = computeReadiness(status, listHelpers(false))
  assert.equal(readiness.total, 23)
  assert.equal(readiness.ready, 8, '7 dependency-free helpers plus the Blender-runtime helper')
  assert.equal(readiness.baseOnly, 7)
})

test('dependency-free helpers run on Blender Python, dependency helpers need the venv', async (t) => {
  const { env, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  const depFree = getHelper('fit-repair-queue')
  const withDeps = getHelper('atlas-region-detector')
  assert.ok(depFree)
  assert.ok(withDeps)
  const runtime = await env.runtimeFor(depFree)
  assert.equal(runtime.source, 'base')
  await assert.rejects(env.runtimeFor(withDeps), (error) => {
    assert.equal(/** @type {any} */ (error).kind, 'helper-env-missing')
    return true
  })
})

test('install creates the venv, installs the lock, verifies and writes the marker', async (t) => {
  const { env, dshHome, calls, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  /** @type {string[]} */
  const lines = []
  const final = await env.install('install', { onLog: (/** @type {string} */ line) => lines.push(line) })
  assert.equal(final.state, 'ready')
  assert.equal(final.usable, true)
  assert.deepEqual(final.missing, [])
  assert.equal(final.packages.numpy, '2.5.4')
  assert.equal(final.install.state, 'idle')
  assert.ok(calls.some((call) => call.includes('pip install')))
  const markerPath = path.join(dshHome, 'dsh-blender-mcp-bridge', 'python', 'venv.json')
  const marker = JSON.parse(await readFile(markerPath, 'utf8'))
  assert.equal(marker.packages.scipy, '1.18.1')
  assert.match(marker.requirementsHash, /^sha256:/)
  assert.ok(lines.some((line) => line.includes('[pip] Successfully installed')))
  assert.ok(lines.every((line) => !line.includes('user:pass')), 'log lines must redact inline credentials')
})

test('an incomplete venv is reported and not usable', async (t) => {
  const { env, state, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  await env.install('install')
  state.packages = { ...ALL_PACKAGES, scipy: null }
  const status = await env.status({ refresh: true })
  assert.equal(status.state, 'incomplete')
  assert.equal(status.usable, false)
  assert.deepEqual(status.missing, ['scipy'])
})

test('a changed lock marks the environment outdated but still usable', async (t) => {
  const { env, pluginRoot, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  await env.install('install')
  await writeFile(path.join(pluginRoot, 'requirements-analysis.lock.txt'), `${LOCK}numpy==9.9.9\n`, 'utf8')
  const status = await env.status({ refresh: true })
  assert.equal(status.state, 'outdated')
  assert.equal(status.usable, true)
  assert.equal(status.requirements.matches, false)
})

test('a missing venv interpreter with a marker is broken', async (t) => {
  const { env, paths, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  await env.install('install')
  const venvPython = existsSync(paths.venvPython)
    ? paths.venvPython
    : path.join(paths.venvDir, 'bin', 'python')
  await rm(venvPython, { force: true })
  const status = await env.status({ refresh: true })
  assert.equal(status.state, 'broken')
  assert.equal(status.usable, false)
})

test('a failed pip install records the failure and leaves no marker', async (t) => {
  const { env, dshHome, python } = await makeEnv({ failPip: true })
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  const final = await env.install('install')
  assert.equal(final.install.state, 'failed')
  assert.equal(final.usable, false)
  assert.equal(final.state, 'incomplete')
  assert.match(String(final.install.error?.message), /pip install failed/)
  assert.equal(existsSync(path.join(dshHome, 'dsh-blender-mcp-bridge', 'python', 'venv.json')), false)
})

test('no base Python means no install and no probing', async () => {
  const { env, calls } = await makeEnv({ noBase: true })
  const status = await env.status()
  assert.equal(status.base.valid, false)
  assert.equal(status.state, 'missing')
  assert.equal(calls.length, 0)
  await assert.rejects(env.install('install'), (error) => {
    assert.equal(/** @type {any} */ (error).kind, 'base-unavailable')
    return true
  })
  const depFree = getHelper('fit-repair-queue')
  assert.ok(depFree)
  await assert.rejects(env.runtimeFor(depFree), (error) => {
    assert.equal(/** @type {any} */ (error).kind, 'helper-env-missing')
    return true
  })
})

test('a fresh install lock refuses a second install', async (t) => {
  const { env, dshHome, python } = await makeEnv()
  if (python === null) {
    t.skip('no local Python 3.12+ interpreter')
    return
  }
  const lockPath = path.join(dshHome, 'dsh-blender-mcp-bridge', 'python', 'install.lock')
  await mkdir(path.dirname(lockPath), { recursive: true })
  await writeFile(lockPath, JSON.stringify({ pid: process.pid, startedAt: Date.now() }), 'utf8')
  await assert.rejects(env.startInstall('install'), (error) => {
    assert.equal(/** @type {any} */ (error).kind, 'busy')
    return true
  })
})

test('a stale running state is reported as interrupted', async () => {
  const { env, dshHome } = await makeEnv()
  const statePath = path.join(dshHome, 'dsh-blender-mcp-bridge', 'python', 'install-state.json')
  await mkdir(path.dirname(statePath), { recursive: true })
  await writeFile(
    statePath,
    JSON.stringify({
      schema: 1,
      state: 'running',
      phase: 'installing',
      startedAt: Date.now() - 60 * 60 * 1000,
      action: 'install',
    }),
    'utf8',
  )
  const status = await env.status()
  assert.equal(status.install.state, 'interrupted')
  assert.equal(status.usable, false)
})
