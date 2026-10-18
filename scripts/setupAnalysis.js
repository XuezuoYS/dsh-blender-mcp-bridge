/**
 * Create `.venv` and install the analysis dependencies.
 *
 * Run this yourself; the plugin never installs packages during a tool call.
 * Usage: node scripts/setupAnalysis.js [--python <exe>]
 */

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const pluginRoot = path.resolve(scriptDir, '..')
const venvDir = path.join(pluginRoot, '.venv')
const requirements = path.join(pluginRoot, 'requirements-analysis.txt')

const args = process.argv.slice(2)
const pythonIndex = args.indexOf('--python')
const basePython = pythonIndex >= 0 && args[pythonIndex + 1] ? args[pythonIndex + 1] : process.env.DSH_BLENDER_PYTHON ?? 'python'

/**
 * Run one command and exit the script when it fails.
 *
 * @param {string} command - executable
 * @param {string[]} commandArgs - arguments
 * @returns {void}
 */
function run(command, commandArgs) {
  console.log(`> ${command} ${commandArgs.join(' ')}`)
  const result = spawnSync(command, commandArgs, { stdio: 'inherit' })
  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (!existsSync(requirements)) {
  console.error(`missing ${requirements}`)
  process.exit(1)
}

if (!existsSync(venvDir)) run(basePython, ['-m', 'venv', venvDir])
const venvPython = process.platform === 'win32' ? path.join(venvDir, 'Scripts', 'python.exe') : path.join(venvDir, 'bin', 'python')
run(venvPython, ['-m', 'pip', 'install', '--upgrade', 'pip'])
run(venvPython, ['-m', 'pip', 'install', '-r', requirements])
console.log(`\nDone. Set helper.analysisPython to:\n${venvPython}`)
