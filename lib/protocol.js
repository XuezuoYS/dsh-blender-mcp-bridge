// SPDX-License-Identifier: GPL-3.0-or-later
// 传输层：add-on 私有套接字协议的帧编解码、持续 drain 读循环、三类超时。
//
// 这不是安全边界，只负责把请求送达并如实带回结果（../docs/contract.md#guard）。
// 副作用边界：只打开一条到 loopback 的 TCP 连接，不写任何文件、不常驻连接。

import { connect } from 'node:net'

/** 帧定界符（../docs/contract.md#transport：UTF-8 JSON + 单字节 0x00）。 */
export const DELIMITER = 0x00

/** 客户端读缓冲（与上游 server 一致；add-on 侧单次 recv 是 4096，不是协议上限）。 */
const READ_BUFFER_BYTES = 64 * 1024

/** 请求超上限时 add-on 直接拒绝、不截断执行（10 MiB）。 */
const MAX_REQUEST_BYTES = 10 * 1024 * 1024

/**
 * 带分级码的错误。
 *
 * @typedef {Error & {code?: string}} CodedError
 */

/**
 * 造一个带分级码的错误。
 *
 * 用集中构造而不是给 `error.code` 赋值：后者在 `checkJs` 下会报
 * `Property 'code' does not exist on type 'Error'`（实测）。
 *
 * @param {string} code 分级码。
 * @param {string} message 说明。
 * @returns {CodedError} 错误对象。
 */
function codedError(code, message) {
  return Object.assign(new Error(message), { code })
}

/**
 * 由配置构造传输端点参数。
 *
 * 集中一处，避免每个调用点各写一遍 host/port/超时（那正是漂移的来源：
 * 此前 `index.js` 与 `lib/tools.js` 各有一份逐字相同的实现）。
 *
 * `discoveredPort` 承载**端口扫描实际握手成功的那个端口**：`allowPortScan` 打开后，
 * 找到的对端可能不在配置端口上；后续所有请求必须走同一个端口，否则会打到
 * 配置端口上的**另一个服务**（../docs/contract.md#discovery）。
 *
 * @default options = {}
 * @param {import('../index.js').ResolvedConfig} config 生效配置。
 * @param {{discoveredPort?: number|undefined}} [options] 覆盖项。
 * @returns {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} 端点。
 */
export function endpointOf(config, { discoveredPort } = {}) {
  const valid = Number.isInteger(discoveredPort) && /** @type {number} */ (discoveredPort) > 0
    && /** @type {number} */ (discoveredPort) <= 65_535
  return {
    host: config.host,
    port: valid ? /** @type {number} */ (discoveredPort) : config.port,
    connectTimeoutMs: config.connectTimeoutMs,
    responseTimeoutMs: config.responseTimeoutMs,
  }
}

/**
 * 对端返回的错误信封（../docs/contract.md#transport）。
 *
 * @typedef {object} ExecEnvelope
 * @property {'ok'|'error'} status
 * @property {unknown} [result]
 * @property {string} [message]
 * @property {string} [stdout]
 * @property {string} [stderr]
 */

/**
 * 发一次 `execute` 并读回完整信封。
 *
 * 每次请求开一条新连接：add-on 发完响应就主动关闭，同连接再发会得到
 * `ConnectionAbortedError [WinError 10053]`（**实测**）。
 *
 * **延迟响应要走两段读取**（../docs/contract.md#transport-deferred）：代码里定义了
 * `check_is_finished` 时，add-on 先回一个不带 `result` 的信封，之后在**同一条连接**上
 * 异步给出最终结果。因此读到空信封后必须继续读，窗口用 `deferredTimeoutMs`。
 *
 * @default strictJson = true
 * @param {object} options 请求参数。
 * @param {{host: string, port: number, connectTimeoutMs: number, responseTimeoutMs: number}} options.endpoint 端点与超时。
 * @param {string} options.code 要送进 Blender 执行的 Python 源码。
 * @param {boolean} [options.strictJson] `strict_json`；必须是 bool（缺失会被拒）。
 * @param {AbortSignal} [options.signal] 取消信号。
 * @param {number} [options.deferredTimeoutMs] 延迟响应的额外等待上限；不给则不做第二段读取。
 * @returns {Promise<ExecEnvelope>} add-on 返回的信封。
 * @throws {Error} 连接失败、超时、帧不合法时抛出；错误带 `code` 字段便于分级诊断。
 */
export async function sendExecute({ endpoint, code, strictJson = true, signal, deferredTimeoutMs }) {
  const payload = Buffer.from(
    JSON.stringify({ type: 'execute', strict_json: Boolean(strictJson), code }),
    'utf8',
  )

  if (payload.byteLength > MAX_REQUEST_BYTES) {
    throw codedError(
      'request-too-large',
      `请求体 ${payload.byteLength} 字节超过 add-on 上限 ${MAX_REQUEST_BYTES}；它会被直接拒绝，不会截断执行`,
    )
  }

  const socket = await openSocket(endpoint, signal)
  // 帧缓冲必须挂在**连接**上，而不是每次 readFrame 各建一个：
  // deferred 模式下两帧可能在同一个 recv 里合并到达（loopback 上很快），
  // 若第二段读用全新缓冲，第一帧之后的字节就被丢掉，随后 end 触发 truncated-response，
  // 而 Blender 侧任务仍在跑——调用方最自然的反应是重试，于是同一个有副作用的长任务跑两遍（实测）。
  const reader = new FrameReader(socket, signal)
  try {
    await writeFrame(socket, payload, signal)
    const first = await reader.read(endpoint.responseTimeoutMs)
    if (deferredTimeoutMs === undefined || !looksDeferred(first)) return first
    // 第二段：最终结果会在同一个 tick 循环里发出来；剩余字节已在 reader 里
    const final = await reader.read(deferredTimeoutMs)
    return final
  } finally {
    reader.close()
    socket.destroy()
  }
}

/**
 * 判断信封是否是"延迟响应已受理"的那个空信封。
 *
 * 判据是**结构性的**：没有 `result`、也不是错误——不去匹配文案。
 *
 * @param {ExecEnvelope} envelope 信封。
 * @returns {boolean} 是否是延迟受理信封。
 */
function looksDeferred(envelope) {
  return envelope.status === 'ok' && envelope.result === undefined
}

/**
 * 建立连接（含连接超时与取消）。
 *
 * @param {{host: string, port: number, connectTimeoutMs: number}} endpoint 端点。
 * @param {AbortSignal} [signal] 取消信号。
 * @returns {Promise<import('node:net').Socket>} 已连接的套接字。
 * @throws {Error} 连接失败或超时。
 */
function openSocket(endpoint, signal) {
  return new Promise((resolve, reject) => {
    /** @type {import('node:net').Socket} */
    const socket = connect({ host: endpoint.host, port: endpoint.port })
    /** @type {NodeJS.Timeout | undefined} */
    let timer

    const cleanup = () => {
      if (timer !== undefined) clearTimeout(timer)
      socket.off('connect', onConnect)
      socket.off('error', onError)
      signal?.removeEventListener('abort', onAbort)
    }

    const onConnect = () => {
      cleanup()
      resolve(socket)
    }
    /** @param {Error & {code?: string}} error 连接错误。 */
    const onError = (error) => {
      cleanup()
      reject(error)
    }
    const onAbort = () => {
      cleanup()
      socket.destroy()
      const error = codedError("aborted", '请求在连接阶段被取消')
      reject(error)
    }

    socket.once('connect', onConnect)
    socket.once('error', onError)
    signal?.addEventListener('abort', onAbort, { once: true })

    timer = setTimeout(() => {
      cleanup()
      socket.destroy()
      const error = codedError("connect-timeout", `连接 ${endpoint.host}:${endpoint.port} 超时（${endpoint.connectTimeoutMs} ms）`)
      reject(error)
    }, endpoint.connectTimeoutMs)
  })
}

/**
 * 写出请求帧；调用方负责在 `drain` 之前不销毁连接。
 *
 * @param {import('node:net').Socket} socket 套接字。
 * @param {Buffer} payload 请求体。
 * @param {AbortSignal} [signal] 取消信号。
 * @returns {Promise<void>} 写完后 resolve。
 * @throws {Error} 写失败或被取消。
 */
function writeFrame(socket, payload, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      const error = codedError("aborted", '请求在写出前被取消')
      reject(error)
      return
    }
    const frame = Buffer.concat([payload, Buffer.from([DELIMITER])])
    socket.write(frame, (error) => {
      if (error != null) reject(error)
      else resolve()
    })
  })
}

/**
 * 连接级帧读取器：持续 drain 直到读到 `0x00` 定界符。
 *
 * **不得在两次 recv 之间 sleep**，也不得读到第一个数据块就当作完整响应：
 * add-on 的响应没有硬上限，只受 30 s 写出窗口与客户端 drain 约束。
 *
 * 与"每次读新建缓冲"的写法的关键区别：**字节累加在连接级缓冲里，定界符之后的部分被保留**，
 * 交给同连接上的下一次 `read()`。deferred 的第二帧因此不会因为"与第一帧合并进同一个
 * data 事件"而被丢掉（否则随后 end 触发 truncated-response，而 Blender 侧任务仍在跑，
 * 调用方最自然的反应是重试——于是同一个有副作用的长任务跑两遍）。
 *
 * 只支持**串行**读取（当前唯一调用方 `sendExecute` 就是串行的）：同时最多挂一个 waiter。
 *
 * **这不是安全边界**，只是帧层的正确性。
 */
class FrameReader {
  /**
   * @param {import('node:net').Socket} socket 已连接的套接字。
   * @param {AbortSignal} [signal] 取消信号。
   */
  constructor(socket, signal) {
    this.socket = socket
    this.signal = signal
    /** @type {Buffer[]} 尚未被定界符切走的字节。 */
    this.pending = []
    /** @type {Error|undefined} 连接级失败；之后的每次 read 都复现它。 */
    this.failure = undefined
    /** @type {{resolve: (v: ExecEnvelope) => void, reject: (e: Error) => void, timer: NodeJS.Timeout}|undefined} */
    this.waiter = undefined

    /** @param {Buffer} chunk 新到达的字节。 */
    this.onData = (chunk) => {
      this.pending.push(chunk)
      this.#pump()
    }
    this.onEnd = () => this.#fail(Object.assign(
      new Error('连接在收到定界符前被对端关闭'),
      { code: 'truncated-response' },
    ))
    /** @param {Error} error 连接错误。 */
    this.onError = (error) => this.#fail(error)
    this.onAbort = () => this.#fail(Object.assign(
      new Error('请求在等待响应时被取消'),
      { code: 'aborted' },
    ))

    socket.on('data', this.onData)
    socket.once('end', this.onEnd)
    socket.once('error', this.onError)
    signal?.addEventListener('abort', this.onAbort, { once: true })
  }

  /**
   * @param {Error} error 失败原因。
   */
  #fail(error) {
    if (this.failure !== undefined) return
    this.failure = error
    const waiter = this.waiter
    if (waiter === undefined) return
    this.waiter = undefined
    clearTimeout(waiter.timer)
    waiter.reject(error)
  }

  /** 缓冲里已有完整帧时把它切出来交给等待中的 read。 */
  #pump() {
    if (this.waiter === undefined) return
    let frame
    try {
      frame = this.#takeFrame()
    } catch (error) {
      this.#fail(/** @type {Error} */ (error))
      return
    }
    if (frame === undefined) return
    const waiter = this.waiter
    this.waiter = undefined
    clearTimeout(waiter.timer)
    waiter.resolve(frame)
  }

  /**
   * 从连接级缓冲切出一帧；没有完整帧时返回 undefined（字节留在缓冲里）。
   *
   * @returns {ExecEnvelope|undefined} 信封。
   * @throws {Error} 帧不是合法 JSON 对象（`bad-envelope`）。
   */
  #takeFrame() {
    if (this.pending.length === 0) return undefined
    const joined = Buffer.concat(this.pending)
    const at = joined.indexOf(DELIMITER)
    if (at === -1) {
      this.pending = [joined]
      return undefined
    }
    // 定界符之后的字节回到缓冲，等下一次 read（deferred 的第二帧可能已经到了）
    this.pending = at + 1 < joined.length ? [joined.subarray(at + 1)] : []
    return parseEnvelope(joined.subarray(0, at).toString('utf8'))
  }

  /**
   * 取下一帧。
   *
   * @param {number} timeoutMs 本帧的等待上限（deferred 由调用方单独放宽）。
   * @returns {Promise<ExecEnvelope>} 解析后的信封。
   * @throws {Error} 超时、被取消、连接中断或帧不合法；错误带 `code` 便于分级诊断。
   */
  read(timeoutMs) {
    return new Promise((resolveP, rejectP) => {
      if (this.failure !== undefined) { rejectP(this.failure); return }
      let frame
      try {
        frame = this.#takeFrame()
      } catch (error) {
        this.#fail(/** @type {Error} */ (error))
        rejectP(this.failure ?? error)
        return
      }
      if (frame !== undefined) { resolveP(frame); return }

      this.waiter = {
        resolve: resolveP,
        reject: rejectP,
        timer: setTimeout(() => this.#fail(Object.assign(
          new Error(
            `等待响应超过 ${timeoutMs} ms。`
            + '若是长任务（例如高采样渲染），不要靠调大超时，'
            + '应改用 deferred 通道：用 INVOKE_DEFAULT 起后台任务并定义 check_is_finished() 轮询'
            + '（见 ../docs/contract.md#transport-deferred）。',
          ),
          { code: 'response-timeout' },
        )), timeoutMs),
      }
    })
  }

  /** 摘掉监听（之后 socket 由调用方销毁）。 */
  close() {
    this.socket.off('data', this.onData)
    this.socket.off('end', this.onEnd)
    this.socket.off('error', this.onError)
    this.signal?.removeEventListener('abort', this.onAbort)
    if (this.waiter !== undefined) {
      clearTimeout(this.waiter.timer)
      this.waiter = undefined
    }
  }
}

/**
 * 解析响应 JSON。
 *
 * 响应字节是纯 ASCII（`ensure_ascii=True`），但解码仍按 UTF-8 以兼容未来变化。
 *
 * @param {string} text 定界符之前的文本。
 * @returns {ExecEnvelope} 信封。
 * @throws {Error} 不是 JSON 对象或缺 `status`。
 */
export function parseEnvelope(text) {
  if (text.trim() === '') {
    throw Object.assign(new Error('响应为空帧'), { code: 'bad-envelope' })
  }
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    const head = text.slice(0, 200)
    throw Object.assign(new Error(`响应不是合法 JSON（前 200 字节：${head}）`), { code: 'bad-envelope' })
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw Object.assign(new Error('响应不是 JSON 对象'), { code: 'bad-envelope' })
  }
  if (parsed.status !== 'ok' && parsed.status !== 'error') {
    throw Object.assign(new Error(`响应缺少合法的 status 字段：${JSON.stringify(parsed).slice(0, 200)}`), { code: 'bad-envelope' })
  }
  return /** @type {ExecEnvelope} */ (parsed)
}

/**
 * 把 Python 值编码成可嵌进源码的字面量。
 *
 * 只用于插件自己拼接的固定小程序（握手 / 检查点 / 场景快照），
 * **不用于** `exec` 的用户代码——那条路上源码是直接透传的。
 *
 * @param {unknown} value 待编码的值。
 * @returns {string} Python 字面量。
 */
export function pythonLiteral(value) {
  if (value === null) return 'None'
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'None'
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(pythonLiteral).join(', ')}]`
  if (typeof value === 'object') {
    const entries = Object.entries(/** @type {Record<string, unknown>} */ (value))
    return `{${entries.map(([k, v]) => `${pythonLiteral(k)}: ${pythonLiteral(v)}`).join(', ')}}`
  }
  return 'None'
}
