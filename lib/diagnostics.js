// SPDX-License-Identifier: GPL-3.0-or-later
// 握手与分级诊断：端点指纹、扩展清单只读解析、版本门控。
//
// 只读：向 add-on 发一段**不写盘、不改场景、不联网**的 Python，并在 Node 侧只读一个 toml 文件。
// 不创建任务目录（I14）。进程枚举在某些环境下不可用，此时降级为"无法确认"而不是猜（I4）。

import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { sendExecute } from './protocol.js'

const run = promisify(execFile)

/** 进程枚举的等待上限：受限环境里 `tasklist` 可能很慢甚至被拒。 */
const PROCESS_PROBE_TIMEOUT_MS = 3000

/** 握手用的只读 Python：不写盘、不改场景、不联网，只读回环境事实。 */
const HANDSHAKE_CODE = `
import json, os, sys
import bpy

try:
    import numpy as _numpy
    _numpy_version = getattr(_numpy, "__version__", "unknown")
except Exception:
    _numpy_version = None

try:
    _extensions_root = bpy.utils.user_resource('EXTENSIONS') or None
except Exception:
    _extensions_root = None

result = {
    "blenderVersion": bpy.app.version_string,
    "blenderVersionTuple": list(bpy.app.version),
    "pythonVersion": sys.version.split()[0],
    "moduleKey": __name__ if __name__.startswith("bl_ext") else None,
    "pid": os.getpid(),
    "background": bool(bpy.app.background),
    "onlineAccess": bool(getattr(bpy.app, "online_access", False)),
    "numpyVersion": _numpy_version,
    "cwd": os.getcwd(),
    "extensionsRoot": _extensions_root,
}
`

/**
 * 端点指纹。
 *
 * @typedef {object} Fingerprint
 * @property {string} blenderVersion Blender 版本串。
 * @property {number[]} blenderVersionTuple 版本数组。
 * @property {string} pythonVersion Python 版本。
 * @property {number} pid 进程 id。
 * @property {boolean} background 是否后台模式。
 * @property {boolean} onlineAccess `bpy.app.online_access`。
 * @property {string|null} numpyVersion numpy 版本（不可用为 null）。
 * @property {string} cwd Blender 进程 cwd（**不是** workspace）。
 * @property {string|null} extensionsRoot 扩展根目录。
 */

/**
 * 扩展清单里的版本信息。
 *
 * @typedef {object} ExtensionManifest
 * @property {string|undefined} version 扩展版本。
 * @property {string|undefined} blenderVersionMin 最低 Blender 版本。
 * @property {string} path 清单文件路径。
 */

/**
 * 诊断结果。
 *
 * @typedef {object} Diagnosis
 * @property {'ok'|'no-blender-process'|'port-not-listening'|'foreign-peer'|'version-too-old'|'timeout'|'unknown-process-state'|'handshake-failed'} kind 分级结果。
 * @property {string} summary 一句话结论。
 * @property {string[]} actions 可操作的下一步。
 * @property {Fingerprint|undefined} fingerprint 指纹。
 * @property {ExtensionManifest|undefined} manifest 扩展清单。
 * @property {{required: string, actual: string|undefined}} [versionGate] 版本门控细节。
 * @property {number} [activePort] 实际握手成功的端口（仅 `ok` 时）。
 * @property {number[]} [attemptedPorts] 尝试过的端口（诊断第 2 级要说清试过哪些）。
 */

/**
 * 跑一次完整诊断（只读）。
 *
 * 分级顺序见 ../docs/contract.md#discovery-diagnostics：
 * 无进程 → 端口未监听 → 外来对端 → 版本过旧 → 超时。
 *
 * @param {object} options 参数。
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} options.endpoint 端点。
 * @param {string} options.requireVersionMin 最低 Blender 版本。
 * @param {boolean} options.rejectForeignPeer 指纹不符时是否拒绝继续。
 * @param {boolean} [options.skipProcessProbe] 跳过进程枚举（探针用，避免受沙箱限制）。
 * @param {boolean} [options.allowPortScan] 主端口连不上时是否试候选端口。
 * @param {number[]} [options.portCandidates] 候选端口。
 * @returns {Promise<Diagnosis>} 诊断结果。
 */
export async function diagnose({
  endpoint,
  requireVersionMin,
  rejectForeignPeer,
  skipProcessProbe = false,
  allowPortScan = false,
  portCandidates = [],
}) {
  const attempted = [endpoint.port]
  let active = endpoint
  let envelope
  try {
    envelope = await sendExecute({ endpoint: active, code: HANDSHAKE_CODE })
  } catch (error) {
    // 端口扫描**默认关闭**：静默连到别的服务比连不上更危险（../docs/contract.md#discovery）。
    // 只在显式开启时试候选端口，并且仍然要求握手成功才认为找到了对端。
    if (allowPortScan) {
      for (const port of portCandidates) {
        if (!Number.isInteger(port) || port <= 0 || port > 65535 || attempted.includes(port)) continue
        attempted.push(port)
        const candidate = { ...endpoint, port }
        try {
          const probe = await sendExecute({ endpoint: candidate, code: HANDSHAKE_CODE })
          if (probe.status === 'ok') {
            envelope = probe
            active = candidate
            break
          }
        } catch {
          // 这个候选也不行，继续试下一个
        }
      }
    }
    if (envelope === undefined) {
      const diagnosis = await classifyFailure(/** @type {Error & {code?: string}} */ (error), {
        endpoint,
        skipProcessProbe,
      })
      diagnosis.attemptedPorts = attempted
      return diagnosis
    }
  }

  if (envelope.status !== 'ok' || envelope.result === null || typeof envelope.result !== 'object') {
    return {
      kind: 'handshake-failed',
      summary: `端口有响应但握手失败：${envelope.message ?? '返回的不是对象'}`,
      actions: [
        '确认 9876 端口上跑的是 Blender 官方 MCP add-on（扩展 id `mcp`），而不是别的服务',
        '在 add-on 面板里重启一次 Start',
      ],
      fingerprint: undefined,
      manifest: undefined,
      attemptedPorts: attempted,
    }
  }

  const fingerprint = /** @type {Fingerprint} */ (envelope.result)
  const manifest = fingerprint.extensionsRoot === null
    ? undefined
    : await readExtensionManifest(fingerprint.extensionsRoot)

  const actual = manifest?.blenderVersionMin
  if (actual !== undefined && compareVersions(requireVersionMin, actual) > 0 && rejectForeignPeer) {
    return {
      kind: 'version-too-old',
      summary: `对端版本低于要求：需要 Blender >= ${requireVersionMin}，add-on 声明最低 ${actual}`,
      actions: [`把 Blender 升到 ${requireVersionMin} 或更高`, `或把 requireVersionMin 调低到 ${actual}（不推荐）`],
      fingerprint,
      manifest,
      versionGate: { required: requireVersionMin, actual },
      attemptedPorts: attempted,
    }
  }

  return {
    kind: 'ok',
    summary: `已连上 Blender ${fingerprint.blenderVersion}（add-on ${manifest?.version ?? '未知'}）`,
    actions: [],
    fingerprint,
    manifest,
    activePort: active.port,
    attemptedPorts: attempted,
  }
}

/**
 * 把连接失败归类成可操作的分级结果。
 *
 * @param {Error & {code?: string}} error 失败原因。
 * @param {{endpoint: {host: string, port: number}, skipProcessProbe: boolean}} context 上下文。
 * @returns {Promise<Diagnosis>} 诊断结果。
 */
async function classifyFailure(error, context) {
  const port = `${context.endpoint.host}:${context.endpoint.port}`

  if (error.code === 'connect-timeout' || error.code === 'response-timeout') {
    return {
      kind: 'timeout',
      summary: `连上了 ${port} 但等不到响应（${error.code}）`,
      actions: [
        'Blender 主线程正在被占用（执行中的脚本会冻结 GUI 且不接受新连接）',
        '等当前操作结束再试；若是长任务，应改用 deferred 通道',
      ],
      fingerprint: undefined,
      manifest: undefined,
    }
  }

  if (error.code === 'ECONNREFUSED') {
    const processState = context.skipProcessProbe ? 'unknown' : await probeBlenderProcess()
    if (processState === 'running') {
      return {
        kind: 'port-not-listening',
        summary: `${port} 未监听，但检测到 Blender 进程在运行`,
        actions: [
          '在 Blender 的 MCP 面板里按 Start（或打开 Auto Start）',
          '确认「编辑 → 偏好设置 → 系统 → 网络 → 允许联网访问」已开启——关闭时扩展根本不会启动',
          `确认 add-on 的端口与配置一致（当前配置 ${context.endpoint.port}）`,
        ],
        fingerprint: undefined,
        manifest: undefined,
      }
    }
    if (processState === 'none') {
      return {
        kind: 'no-blender-process',
        summary: `没有检测到 Blender 进程，且 ${port} 未监听`,
        actions: ['先启动 Blender，再在 MCP 面板里按 Start'],
        fingerprint: undefined,
        manifest: undefined,
      }
    }
    return {
      kind: 'unknown-process-state',
      summary: `${port} 未监听；**无法确认**是否有 Blender 进程（本环境不允许枚举进程）`,
      actions: [
        '本插件无法枚举进程（受限环境），因此不猜：请自行确认 Blender 是否在运行',
        '若 Blender 在运行：在 MCP 面板里按 Start，并确认已开启联网访问',
      ],
      fingerprint: undefined,
      manifest: undefined,
    }
  }

  return {
    kind: 'handshake-failed',
    summary: `连接 ${port} 失败：${error.message}`,
    actions: ['确认端点配置正确', '确认对端是 Blender 官方 MCP add-on'],
    fingerprint: undefined,
    manifest: undefined,
  }
}

/**
 * 探测是否有 Blender 进程在运行。
 *
 * 只在**需要区分第 1/2 级诊断时**才跑，且失败即降级为 `unknown`——**不得猜**（I4）。
 *
 * @returns {Promise<'running'|'none'|'unknown'>} 探测结果。
 */
async function probeBlenderProcess() {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await run('tasklist', ['/FI', 'IMAGENAME eq blender.exe', '/NH'], {
        timeout: PROCESS_PROBE_TIMEOUT_MS,
        windowsHide: true,
      })
      return /blender\.exe/iu.test(stdout) ? 'running' : 'none'
    }
    const { stdout } = await run('pgrep', ['-x', 'blender'], { timeout: PROCESS_PROBE_TIMEOUT_MS })
    return stdout.trim() === '' ? 'none' : 'running'
  } catch {
    return 'unknown'
  }
}

/**
 * 只读解析扩展清单 `<extensionsRoot>/user_default/mcp/blender_manifest.toml`。
 *
 * 用行式解析而不是引入 toml 依赖：我们只需要两个字符串字段。
 *
 * @param {string} extensionsRoot `bpy.utils.user_resource('EXTENSIONS')`。
 * @returns {Promise<ExtensionManifest | undefined>} 清单信息；不可读时 undefined。
 */
export async function readExtensionManifest(extensionsRoot) {
  const path = join(extensionsRoot, 'user_default', 'mcp', 'blender_manifest.toml')
  try {
    const text = await readFile(path, 'utf8')
    return {
      version: matchTomlString(text, 'version'),
      blenderVersionMin: matchTomlString(text, 'blender_version_min'),
      path,
    }
  } catch {
    return undefined
  }
}

/**
 * 从 toml 文本里取一个顶层字符串字段。
 *
 * @param {string} text 文件内容。
 * @param {string} key 字段名。
 * @returns {string|undefined} 值；找不到时 undefined。
 */
function matchTomlString(text, key) {
  const match = new RegExp(`^\\s*${key}\\s*=\\s*["']([^"']+)["']`, 'mu').exec(text)
  return match?.[1]
}

/**
 * 比较两个点分版本串。
 *
 * @param {string} left 左版本。
 * @param {string} right 右版本。
 * @returns {number} 左 > 右返回正数，相等返回 0，更小返回负数。
 */
export function compareVersions(left, right) {
  const a = left.split('.').map(part => Number.parseInt(part, 10) || 0)
  const b = right.split('.').map(part => Number.parseInt(part, 10) || 0)
  const length = Math.max(a.length, b.length)
  for (let i = 0; i < length; i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0)
    if (diff !== 0) return diff
  }
  return 0
}

/**
 * 由运行时 Blender 版本与语料版本算漂移等级（../docs/contract.md#discovery-drift / I11）。
 *
 * @param {string|undefined} corpusVersion 语料对应的 Blender 版本。
 * @param {string|undefined} runtimeVersion 会话实际版本。
 * @returns {{corpus: string, runtime: string, level: 'none'|'minor'|'major'|'unknown'}} 漂移描述。
 */
export function computeDrift(corpusVersion, runtimeVersion) {
  if (corpusVersion === undefined || runtimeVersion === undefined) {
    return { corpus: corpusVersion ?? 'unknown', runtime: runtimeVersion ?? 'unknown', level: 'unknown' }
  }
  const corpusMajor = Number.parseInt(corpusVersion.split('.')[0] ?? '', 10)
  const runtimeMajor = Number.parseInt(runtimeVersion.split('.')[0] ?? '', 10)
  if (corpusVersion === runtimeVersion) return { corpus: corpusVersion, runtime: runtimeVersion, level: 'none' }
  if (Number.isNaN(corpusMajor) || Number.isNaN(runtimeMajor)) {
    return { corpus: corpusVersion, runtime: runtimeVersion, level: 'unknown' }
  }
  return {
    corpus: corpusVersion,
    runtime: runtimeVersion,
    level: corpusMajor === runtimeMajor ? 'minor' : 'major',
  }
}
