/**
 * Install or repair the plugin-managed helper environment.
 *
 * This is the command-line door for clients without the settings page. It uses
 * the same manager as the Host route: Blender's bundled Python is the base,
 * the venv lives under the DSH home, and only the locked packages are installed.
 *
 * Usage:
 *   node scripts/setupAnalysis.js
 *   node scripts/setupAnalysis.js --python "<Blender>/5.2/python/bin/python.exe"
 *   node scripts/setupAnalysis.js --dry-run
 *   node scripts/setupAnalysis.js --home "D:/custom-dsh-home" --mirror "https://pypi.example/simple"
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHelperEnv, defaultDshHome, HelperEnvError } from '../lib/helperEnv.js'
import { handshake } from '../lib/handshake.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const pluginRoot = path.resolve(scriptDir, '..')

/**
 * @typedef {object} CliOptions
 * @property {string} python
 * @property {string} home
 * @property {string} mirror
 * @property {string} host
 * @property {number} port
 * @property {boolean} dryRun
 * @property {boolean} rebuild
 * @property {boolean} help
 */

/**
 * @param {string[]} argv - arguments after the script path
 * @returns {CliOptions} parsed options
 */
function parseOptions(argv) {
  /** @type {CliOptions} */
  const options = {
    python: '',
    home: '',
    mirror: '',
    host: process.env.DSH_BLENDER_HOST ?? '127.0.0.1',
    port: Number(process.env.DSH_BLENDER_PORT ?? 9876),
    dryRun: false,
    rebuild: false,
    help: false,
  }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--python') options.python = argv[++index] ?? ''
    else if (arg === '--home') options.home = argv[++index] ?? ''
    else if (arg === '--mirror') options.mirror = argv[++index] ?? ''
    else if (arg === '--host') options.host = argv[++index] ?? '127.0.0.1'
    else if (arg === '--port') options.port = Number(argv[++index] ?? 9876)
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--rebuild') options.rebuild = true
    else if (arg === '--help' || arg === '-h') options.help = true
    else throw new Error(`unknown argument "${arg}"`)
  }
  if (!Number.isInteger(options.port) || options.port <= 0) throw new Error('--port must be a positive integer')
  return options
}

/**
 * @param {import('../lib/helperEnv.js').HelperEnvStatus} status - environment status
 * @returns {string} human-readable summary
 */
function describeStatus(status) {
  const lines = [
    `state: ${status.state}`,
    `venv: ${status.venvPath}`,
    `python: ${status.venvPython}${status.venvVersion === '' ? '' : ` (${status.venvVersion})`}`,
    `base: ${status.base.valid ? `${status.base.python} (${status.base.version})` : 'unknown'}`,
    `packages: ${Object.entries(status.packages)
      .map(([name, version]) => `${name}=${version ?? 'missing'}`)
      .join(', ')}`,
    `install: ${status.install.state}${status.install.phase === '' ? '' : ` (${status.install.phase})`}`,
  ]
  if (status.install.error !== null) lines.push(`error: ${status.install.error.message}`)
  if (!status.usable) lines.push(`fix: ${status.hints.installCommand}`)
  return lines.join('\n')
}

async function main() {
  const options = parseOptions(process.argv.slice(2))
  if (options.help) {
    console.log('Usage: node scripts/setupAnalysis.js [--python <exe>] [--home <dir>] [--mirror <url>] [--host <host>] [--port <port>] [--rebuild] [--dry-run]')
    return
  }
  const env = createHelperEnv({
    dshHome: options.home === '' ? defaultDshHome() : path.resolve(options.home),
    pluginRoot,
    packageVersion: '',
    getConfig: () => ({ basePython: options.python, pipIndexUrl: options.mirror }),
    warn: (message) => console.error(message),
  })

  if (options.dryRun) {
    const status = await env.status({ refresh: true })
    console.log(describeStatus(status))
    if (status.usable) {
      console.log(
        status.state === 'outdated'
          ? 'plan: the environment is usable but outdated; run without --dry-run to update it'
          : 'plan: the environment is already usable; nothing to install',
      )
    } else {
      console.log(
        `plan: create the venv from ${status.base.valid ? status.base.python : '<connect Blender or pass --python>'} and install ` +
          `${Object.entries(status.requirements.packages)
            .map(([name, version]) => `${name}==${version}`)
            .join(', ')}`,
      )
      console.log(`estimates: ~${Math.round(status.estimates.downloadBytes / 1e6)} MB download, ~${Math.round(status.estimates.diskBytes / 1e6)} MB disk`)
    }
    return
  }

  if (options.python === '') {
    try {
      const info = await handshake({
        host: options.host,
        port: options.port,
        connectTimeoutMs: 5000,
        responseTimeoutMs: 15000,
        maxResponseChars: 200000,
      })
      env.noteBlenderSession(info)
      console.log(`[env] Blender ${info.blenderVersion} -> ${info.pythonExecutable || 'no Python path'} (Python ${info.pythonVersion})`)
    } catch (error) {
      console.error(
        `[env] could not reach Blender at ${options.host}:${options.port}: ${error instanceof Error ? error.message : String(error)}`,
      )
      console.error('[env] continuing with a saved base Python or helper.basePython, if one exists')
    }
  }

  try {
    const final = await env.install(options.rebuild ? 'rebuild' : 'install', { onLog: (line) => console.log(line) })
    console.log('')
    console.log(describeStatus(final))
    process.exitCode = final.usable ? 0 : 1
  } catch (error) {
    if (error instanceof HelperEnvError) {
      console.error(`${error.kind}: ${error.message}`)
    } else {
      console.error(error instanceof Error ? error.message : String(error))
    }
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
