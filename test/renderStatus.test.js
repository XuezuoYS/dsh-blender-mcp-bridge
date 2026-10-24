/**
 * Render timeout and render-status flows with a fake Blender transport.
 *
 * These tests prove the two halves of report 4.3: a render that outlives its
 * tool call returns a determinate `timeout`/`running` value, and
 * `blender_mcp_render_status` collects the finished PNG from the status file
 * without touching the socket.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, utimes, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { ProtocolError } from '../lib/protocol.js'
import { createRenderStats } from '../lib/renderStats.js'
import {
  findRenderJob,
  isRenderJobId,
  listRenderJobs,
  readRenderStatusFile,
  renderJobIdFor,
  renderJobIdFromStatusName,
  renderStatusPathFor,
} from '../lib/renderStatus.js'
import { createSnapshotTracker } from '../lib/snapshotPolicy.js'
import { ensureTaskDir } from '../lib/taskDir.js'
import { makeTools } from '../lib/tools.js'
import { createTestHelperEnv } from './support/testPython.js'

/**
 * Minimal valid PNG header with the given dimensions.
 *
 * @param {number} width - pixel width
 * @param {number} height - pixel height
 * @returns {Buffer} fake PNG bytes
 */
function pngStub(width, height) {
  const buffer = Buffer.alloc(33)
  buffer[0] = 0x89
  buffer[1] = 0x50
  buffer[2] = 0x4e
  buffer[3] = 0x47
  buffer[4] = 0x0d
  buffer[5] = 0x0a
  buffer[6] = 0x1a
  buffer[7] = 0x0a
  buffer.writeUInt32BE(13, 8)
  buffer.write('IHDR', 12, 'latin1')
  buffer.writeUInt32BE(width, 16)
  buffer.writeUInt32BE(height, 20)
  return buffer
}

/**
 * @param {string} blendPath - fake .blend path
 * @returns {Record<string, unknown>} add-on handshake envelope
 */
function handshakeEnvelope(blendPath) {
  return {
    status: 'ok',
    result: {
      blenderVersion: '5.2.2 LTS',
      versionMajorMinor: '5.2',
      filePath: blendPath,
      isDirty: false,
      background: false,
      objectCount: 1,
      activeScene: 'Scene',
      mode: 'OBJECT',
      undoStepLimit: 32,
      pythonVersion: '3.13.13',
      onlineAccess: true,
      renderSettings: {
        engine: 'BLENDER_EEVEE',
        width: 1920,
        height: 1080,
        resolutionPercentage: 100,
        samples: 64,
        fileFormat: 'PNG',
      },
    },
  }
}

/**
 * @typedef {object} RenderSetup
 * @property {string} blendPath - fake .blend path
 * @property {string} workspaceDir - workspace fallback
 * @property {'ok'|'timeout'|'finish-then-timeout'|'error'} [outcome] - fake render outcome
 * @property {number} [renderDelayMs] - slow the fake render down
 */

/**
 * Build a bridge whose fake Blender writes the render status file.
 *
 * @param {RenderSetup} setup - setup values
 * @returns {{ tools: any[], sentOptions: Record<string, unknown>[], sends: () => number, taskDir: () => string }} bridge pieces
 */
function makeBridge(setup) {
  /** @type {Record<string, unknown>[]} */
  const sentOptions = []
  let sends = 0
  /** @type {string} */
  let currentTaskDir = ''
  const send = async (/** @type {string} */ code, /** @type {Record<string, unknown>} */ options = {}) => {
    sends += 1
    sentOptions.push(options)
    if (code.includes('versionMajorMinor')) return { response: handshakeEnvelope(setup.blendPath) }
    if (code.includes('render.render')) {
      const fileMatch = /render\.filepath = ("(?:\\.|[^"\\])*")/.exec(code)
      const statusMatch = /_status_path = ("(?:\\.|[^"\\])*")/.exec(code)
      const jobMatch = /'jobId': ("(?:\\.|[^"\\])*")/.exec(code)
      assert.ok(fileMatch, 'render code must carry a filepath')
      assert.ok(statusMatch, 'render code must carry a status path')
      assert.ok(jobMatch, 'render code must carry a job id')
      const filePath = JSON.parse(fileMatch[1])
      const statusPath = JSON.parse(statusMatch[1])
      const jobId = JSON.parse(jobMatch[1])
      const width = Number(/resolution_x = (\d+)/.exec(code)?.[1] ?? 0)
      const height = Number(/resolution_y = (\d+)/.exec(code)?.[1] ?? 0)
      const samples = Number(/taa_render_samples = (\d+)/.exec(code)?.[1] ?? 0)
      const timeoutMs = Number(/'timeoutMs': (\d+)/.exec(code)?.[1] ?? 0)
      currentTaskDir = path.dirname(path.dirname(statusPath))
      /** @type {Record<string, unknown>} */
      const record = {
        version: 1,
        jobId,
        path: filePath,
        state: 'running',
        startedAtMs: Date.now() - 50,
        finishedAtMs: null,
        width,
        height,
        resolutionPercentage: 100,
        samples,
        engine: 'BLENDER_EEVEE',
        timeoutMs,
        background: /'background': True/.test(code),
        bytes: 0,
        error: null,
      }
      await writeFile(statusPath, JSON.stringify(record))
      if (setup.renderDelayMs !== undefined && setup.renderDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, setup.renderDelayMs))
      }
      if (setup.outcome === 'finish-then-timeout') {
        await writeFile(filePath, pngStub(width, height))
        await writeFile(
          statusPath,
          JSON.stringify({ ...record, state: 'done', finishedAtMs: Date.now(), bytes: 33 }),
        )
        throw new ProtocolError('response-timeout', 'render reply lost')
      }
      if (setup.outcome === 'timeout') throw new ProtocolError('response-timeout', 'render timed out')
      if (setup.outcome === 'error') return { response: { status: 'error', message: 'Cannot render, no camera' } }
      await writeFile(filePath, pngStub(width, height))
      await writeFile(
        statusPath,
        JSON.stringify({ ...record, state: 'done', finishedAtMs: Date.now(), bytes: 33 }),
      )
      return {
        response: {
          status: 'ok',
          result: { path: filePath, bytes: 33, engine: 'BLENDER_EEVEE', samples, width, height, resolutionPercentage: 100 },
        },
      }
    }
    throw new Error(`unexpected code sent to Blender: ${code.slice(0, 40)}`)
  }

  const snapshotState = createSnapshotTracker({ enabled: false, on: 'turn', everyWrites: 10, onDestructive: false })
  /** @type {import('../lib/tools.js').BridgeOptions} */
  const options = {
    host: '127.0.0.1',
    port: 9876,
    connectTimeoutMs: 1000,
    responseTimeoutMs: 30000,
    captureTimeoutMs: 1000,
    renderTimeoutMs: 120000,
    maxResponseChars: 200000,
    snapshot: {
      enabled: false,
      generations: 3,
      on: 'turn',
      everyWrites: 10,
      onDestructive: false,
      compress: true,
      timeoutMs: 1000,
    },
    guard: { enabled: true },
    audit: { enabled: true, storeCode: false },
    taskRoot: '',
    taskRootMode: 'blendFile',
    send,
    warn() {},
    resolveSession: () => ({ sessionId: 's1', workspaceDir: setup.workspaceDir, turn: 1 }),
    knownFilePath: () => setup.blendPath,
    noteFilePath() {},
    snapshotState,
    undoPushCount: () => 0,
    noteUndoPush() {},
    withWriteLock: (task) => task(),
    imageSupport: async () => true,
    attachImage: async (filePath, mediaType, name) => ({ path: filePath, mediaType, name }),
    renderStats: createRenderStats(),
    timeoutWarning: () => false,
    noteTimeout() {},
    clearTimeoutNote() {},
    helpersDir: path.resolve('helpers'),
    helperEnv: createTestHelperEnv().helperEnv,
    helperTimeoutMs: 120000,
    helperMaxOutputChars: 200000,
    enableMaintenanceHelpers: false,
  }
  return {
    tools: /** @type {any[]} */ (makeTools(options)),
    sentOptions,
    sends: () => sends,
    taskDir: () => currentTaskDir,
  }
}

/**
 * @returns {Promise<{ root: string, blendDir: string, blendPath: string }>} fake project
 */
async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-render-'))
  const blendDir = path.join(root, 'project')
  await mkdir(blendDir, { recursive: true })
  const blendPath = path.join(blendDir, 'scene.blend')
  await writeFile(blendPath, 'BLEND')
  return { root, blendDir, blendPath }
}

/**
 * @param {any[]} tools - tool list
 * @param {string} name - tool name
 * @returns {any} tool
 */
function toolNamed(tools, name) {
  const tool = tools.find((item) => item.name === name)
  assert.ok(tool, `missing tool ${name}`)
  return tool
}

/**
 * Finish a timed-out job the way Blender would.
 *
 * @param {string} taskDir - task directory
 * @param {{ jobId: string, path: string, width: number, height: number, samples: number }} job - job values
 * @param {'done'|'failed'} [state] - final state
 * @param {string} [error] - failure text
 * @returns {Promise<void>} nothing
 */
async function finishJob(taskDir, job, state = 'done', error = '') {
  const statusPath = renderStatusPathFor(job.path)
  if (state === 'done') await writeFile(job.path, pngStub(job.width, job.height))
  await writeFile(
    statusPath,
    JSON.stringify({
      version: 1,
      jobId: job.jobId,
      path: job.path,
      state,
      startedAtMs: Date.now() - 2500,
      finishedAtMs: Date.now(),
      width: job.width,
      height: job.height,
      resolutionPercentage: 100,
      samples: job.samples,
      engine: 'BLENDER_EEVEE',
      timeoutMs: 5000,
      background: false,
      bytes: state === 'done' ? 33 : 0,
      error,
    }),
  )
}

test('status files use the render file stem and reject traversal ids', () => {
  const png = path.join(os.tmpdir(), 'proj', 'renders', 'render-20260101000000000.png')
  assert.equal(renderStatusPathFor(png), path.join(os.tmpdir(), 'proj', 'renders', 'render-20260101000000000.render.json'))
  assert.equal(renderJobIdFor(png), 'render-20260101000000000')
  assert.equal(renderJobIdFromStatusName('render-1.render.json'), 'render-1')
  assert.equal(isRenderJobId('render-1'), true)
  assert.equal(isRenderJobId('灯-1'), true)
  assert.equal(isRenderJobId('../escape'), false)
  assert.equal(isRenderJobId('a/b'), false)
  assert.equal(isRenderJobId('a\\b'), false)
  assert.equal(isRenderJobId('..'), false)
  assert.equal(isRenderJobId(''), false)
})

test('readRenderStatusFile distinguishes missing, partial and invalid records', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-render-status-'))
  assert.equal((await readRenderStatusFile(path.join(dir, 'missing.render.json'))).kind, 'missing')

  const partial = path.join(dir, 'partial.render.json')
  await writeFile(partial, '{"state":')
  assert.equal((await readRenderStatusFile(partial)).kind, 'invalid')

  const badState = path.join(dir, 'bad.render.json')
  await writeFile(badState, JSON.stringify({ state: 'paused', path: path.join(dir, 'x.png') }))
  assert.equal((await readRenderStatusFile(badState)).kind, 'invalid')

  const target = path.join(dir, 'good.png')
  const good = path.join(dir, 'good.render.json')
  await writeFile(
    good,
    JSON.stringify({
      jobId: 'good',
      path: target,
      state: 'done',
      startedAtMs: 10,
      finishedAtMs: 20,
      width: 4,
      height: 3,
      resolutionPercentage: 50,
      samples: 2,
      engine: 'CYCLES',
      timeoutMs: 900,
      background: false,
      bytes: 5,
      error: null,
    }),
  )
  const read = await readRenderStatusFile(good)
  assert.equal(read.kind, 'ok')
  if (read.kind === 'ok') {
    assert.equal(read.record.jobId, 'good')
    assert.equal(read.record.state, 'done')
    assert.equal(read.record.engine, 'CYCLES')
    assert.equal(read.record.timeoutMs, 900)
    assert.equal(read.record.finishedAtMs, 20)
  }
})

test('listRenderJobs sorts newest first and findRenderJob picks it', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-render-jobs-'))
  const taskDir = (await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })).dir
  const renders = path.join(taskDir, 'renders')
  const ids = ['render-20260101000000001', 'render-20260101000000002']
  for (const id of ids) {
    const filePath = path.join(renders, `${id}.png`)
    await writeFile(
      renderStatusPathFor(filePath),
      JSON.stringify({
        jobId: id,
        path: filePath,
        state: 'done',
        startedAtMs: 1,
        finishedAtMs: 2,
        width: 4,
        height: 3,
        resolutionPercentage: 100,
        samples: 1,
        engine: 'BLENDER_EEVEE',
        timeoutMs: 0,
        background: false,
        bytes: 1,
        error: '',
      }),
    )
    const stamp = id === ids[0] ? new Date(Date.now() - 60000) : new Date()
    await utimes(renderStatusPathFor(filePath), stamp, stamp)
  }

  const jobs = await listRenderJobs(taskDir)
  assert.deepEqual(
    jobs.map((job) => job.name),
    [`${ids[1]}.render.json`, `${ids[0]}.render.json`],
  )
  const newest = await findRenderJob(taskDir)
  assert.equal(newest.kind, 'ok')
  if (newest.kind === 'ok') assert.equal(newest.jobId, ids[1])

  const one = await findRenderJob(taskDir, ids[0])
  assert.equal(one.kind, 'ok')
  if (one.kind === 'ok') assert.equal(one.record.path, path.join(renders, `${ids[0]}.png`))

  const missing = await findRenderJob(taskDir, 'render-20200101000000000')
  assert.equal(missing.kind, 'missing')
  assert.ok(missing.recent.length >= 2)
})

test('a foreground render timeout returns a determinate timeout with a job id', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')

  const value = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 5000 },
    { agent: { session: { id: 's1' } } },
  )

  assert.equal(value.status, 'timeout')
  assert.match(value.jobId, /^render-\d{17}$/)
  assert.match(value.path, /renders[\\/]render-\d{17}\.png$/)
  assert.match(value.statusPath, /\.render\.json$/)
  assert.equal(value.state, 'running')
  assert.equal(value.timeoutMs, 5000)
  assert.equal(value.image, undefined)
  assert.ok(value.warnings.some((/** @type {string} */ warning) => warning.includes('blender_mcp_render_status')))
  assert.equal(bridge.sentOptions.at(-1)?.responseTimeoutMs, 5000)
  const audit = (await readFile(path.join(bridge.taskDir(), 'audit.jsonl'), 'utf8')).trim().split('\n')
  assert.equal(JSON.parse(String(audit.at(-1))).status, 'timeout')
})

test('render_status collects the finished image without contacting Blender', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')

  const timedOut = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 5000 },
    { agent: { session: { id: 's1' } } },
  )
  await finishJob(bridge.taskDir(), { jobId: timedOut.jobId, path: timedOut.path, width: 640, height: 360, samples: 16 })

  const before = bridge.sends()
  const value = await statusTool.execute({ task: 'lamp', jobId: timedOut.jobId }, { agent: { session: { id: 's1' } } })
  assert.equal(bridge.sends(), before, 'render_status must not use the Blender socket')
  assert.equal(value.status, 'ok')
  assert.equal(value.jobId, timedOut.jobId)
  assert.equal(value.path, timedOut.path)
  assert.equal(value.width, 640)
  assert.equal(value.height, 360)
  assert.equal(value.bytes, 33)
  assert.ok(value.tookMs >= 0)
  assert.ok(value.image)
  assert.equal(statusTool.output.render({}, value)[0].type, 'text')

  const newest = await statusTool.execute({ task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(newest.status, 'ok')
  assert.equal(newest.jobId, timedOut.jobId)
})

test('render_status reports a running job immediately after a timeout', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')

  const timedOut = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 5000 },
    { agent: { session: { id: 's1' } } },
  )
  const before = bridge.sends()
  const value = await statusTool.execute({ task: 'lamp', jobId: timedOut.jobId }, { agent: { session: { id: 's1' } } })

  assert.equal(bridge.sends(), before)
  assert.equal(value.status, 'running')
  assert.equal(value.state, 'running')
  assert.ok(value.elapsedMs >= 0)
  assert.ok(value.path.endsWith('.png'))
  const blocks = statusTool.output.render({}, value)
  assert.match(String(blocks[0].text), /still running/)
})

test('a timeout whose render already finished is collected, not retried', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'finish-then-timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')

  const value = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 5000 },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  assert.equal(value.state, 'done')
  assert.ok(value.image)
  assert.ok(value.warnings.some((/** @type {string} */ warning) => warning.includes('had already finished')))
})

test('background: true returns as soon as the render started', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')

  const value = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, background: true },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'running')
  assert.equal(value.background, true)
  assert.equal(bridge.sentOptions.at(-1)?.responseTimeoutMs, 3000)
  assert.ok(value.warnings.some((/** @type {string} */ warning) => warning.includes('Blender stays busy')))

  await finishJob(bridge.taskDir(), { jobId: value.jobId, path: value.path, width: 640, height: 360, samples: 16 })
  const done = await statusTool.execute({ task: 'lamp', jobId: value.jobId }, { agent: { session: { id: 's1' } } })
  assert.equal(done.status, 'ok')
  assert.ok(done.image)
})

test('render_status reports a failed job with the Blender message', async () => {
  const { root, blendDir, blendPath } = await makeProject()
  const taskDir = (await ensureTaskDir({ root: blendDir, task: 'lamp', sessionId: 's1' })).dir
  const job = { jobId: 'render-20260101000000000', path: path.join(taskDir, 'renders', 'render-20260101000000000.png'), width: 320, height: 180, samples: 8 }
  await finishJob(taskDir, job, 'failed', 'RuntimeError: Cannot render, no camera')
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')

  const value = await statusTool.execute({ task: 'lamp', jobId: job.jobId }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.equal(value.state, 'failed')
  assert.match(String(value.error.message), /no camera/)
})

test('render_status reports an unknown job id and lists recent jobs', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, outcome: 'timeout' })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')
  const timedOut = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 5000 },
    { agent: { session: { id: 's1' } } },
  )

  const wrong = await statusTool.execute({ task: 'lamp', jobId: 'render-20200101000000000' }, { agent: { session: { id: 's1' } } })
  assert.equal(wrong.status, 'unknown')
  assert.equal(wrong.error.kind, 'job-not-found')
  assert.ok(wrong.warnings.some((/** @type {string} */ warning) => warning.includes(timedOut.jobId)))

  const unsafe = await statusTool.execute({ task: 'lamp', jobId: '../escape' }, { agent: { session: { id: 's1' } } })
  assert.equal(unsafe.status, 'error')
  assert.equal(unsafe.error.kind, 'invalid-job')
})

test('render_status reports a missing task directory instead of guessing', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')
  const value = await statusTool.execute({ task: 'other', jobId: 'render-20260101000000000' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'unknown')
  assert.equal(value.error.kind, 'task-not-found')
})

test('a status file that points outside the task directory is refused', async () => {
  const { root, blendDir, blendPath } = await makeProject()
  const taskDir = (await ensureTaskDir({ root: blendDir, task: 'lamp', sessionId: 's1' })).dir
  const jobId = 'render-20260101000000000'
  const outside = path.join(root, 'outside.png')
  await writeFile(outside, pngStub(64, 32))
  await writeFile(
    renderStatusPathFor(path.join(taskDir, 'renders', `${jobId}.png`)),
    JSON.stringify({
      version: 1,
      jobId,
      path: outside,
      state: 'done',
      startedAtMs: 1,
      finishedAtMs: 2,
      width: 64,
      height: 32,
      resolutionPercentage: 100,
      samples: 1,
      engine: 'BLENDER_EEVEE',
      timeoutMs: 0,
      background: false,
      bytes: 33,
      error: null,
    }),
  )
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const statusTool = toolNamed(bridge.tools, 'blender_mcp_render_status')
  const value = await statusTool.execute({ task: 'lamp', jobId }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.match(String(value.error.message), /outside the task directory/)
})

test('render rejects an invalid timeout or a timeout combined with background', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const exec = { agent: { session: { id: 's1' } } }

  await assert.rejects(renderTool.execute({ task: 'lamp', timeoutMs: 999 }, exec), /timeoutMs must be an integer/)
  await assert.rejects(renderTool.execute({ task: 'lamp', timeoutMs: 1800001 }, exec), /timeoutMs must be an integer/)
  await assert.rejects(
    renderTool.execute({ task: 'lamp', background: true, timeoutMs: 60000 }, exec),
    /omit it with background: true/,
  )
})

test('a render that nearly uses its budget warns and reports the earlier estimate', async () => {
  const { root, blendPath } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, renderDelayMs: 850 })
  const renderTool = toolNamed(bridge.tools, 'blender_mcp_render')
  const exec = { agent: { session: { id: 's1' } } }

  const first = await renderTool.execute({ task: 'lamp', width: 640, height: 360, samples: 16 }, exec)
  assert.equal(first.status, 'ok')
  const second = await renderTool.execute({ task: 'lamp', width: 640, height: 360, samples: 16, timeoutMs: 1000 }, exec)
  assert.equal(second.status, 'ok')
  assert.ok(second.warnings.some((/** @type {string} */ warning) => warning.includes('of the 1000 ms budget')))
  assert.equal(typeof second.estimateSeconds, 'number')
})
