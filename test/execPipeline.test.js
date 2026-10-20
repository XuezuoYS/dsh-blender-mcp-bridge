/**
 * End-to-end exec pipeline tests with a fake Blender transport.
 *
 * These exercise: handshake → task dir → snapshot → L1 → guarded payload →
 * result mapping → audit, without a running Blender.
 */

import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { makeTools } from '../lib/tools.js'

/** @typedef {{ name: string, execute: (args: any, exec: any) => Promise<any>, output?: { render: (args: any, value: any) => any[] } }} ToolLike */

/**
 * @param {string} blendPath - fake .blend path
 * @param {boolean} [background] - background mode flag
 * @returns {Record<string, unknown>} add-on handshake envelope
 */
function handshakeEnvelope(blendPath, background = false) {
  return {
    status: 'ok',
    result: {
      blenderVersion: '5.2.2 LTS',
      versionMajorMinor: '5.2',
      filePath: blendPath,
      isDirty: false,
      background,
      objectCount: 1,
      activeScene: 'Scene',
      mode: 'OBJECT',
      undoSteps: 32,
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
 * Build a bridge with a fake Blender.
 *
 * @param {object} setup - setup values
 * @param {string} setup.blendPath - fake .blend path
 * @param {string} setup.workspaceDir - workspace fallback
 * @param {boolean} [setup.snapshotEnabled] - enable snapshots
 * @param {(inner: Record<string, unknown>) => Record<string, unknown>} [setup.execResult] - inner envelope override
 * @param {() => Promise<boolean>} [setup.imageSupport] - model image capability
 * @param {(filePath: string, mediaType: string, name: string) => Promise<unknown | null>} [setup.attachImage] - attachment stub
 * @param {() => string[]} [setup.nextObjectNames] - object-name snapshots per call
 * @param {boolean} [setup.background] - handshake reports background mode
 * @param {boolean} [setup.timeoutWarning] - report a stale timeout note
 * @param {boolean} [setup.noBlender] - fail the transport, proving it is unused
 * @returns {{ tools: ToolLike[], sent: string[], snapshotFiles: string[] }} bridge pieces
 */
function makeBridge(setup) {
  /** @type {string[]} */
  const sent = []
  /** @type {string[]} */
  const snapshotFiles = []
  const send = async (/** @type {string} */ code) => {
    sent.push(code)
    if (setup.noBlender === true) throw new Error('transport should not be used')
    if (code.includes('versionMajorMinor')) {
      return { response: handshakeEnvelope(setup.blendPath, setup.background === true) }
    }
    if (code.includes('bpy.data.objects][:500]')) {
      const names = setup.nextObjectNames ? setup.nextObjectNames() : ['Cube']
      return { response: { status: 'ok', result: { names, total: names.length } } }
    }
    if (code.includes('<dsh-user-code>')) {
      const inner = setup.execResult
        ? setup.execResult({})
        : {
            status: 'ok',
            result: { added: true },
            undo: { pushed: true, message: 'dsh-blender: lamp' },
            guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
            warnings: [],
          }
      return { response: { status: 'ok', result: inner } }
    }
    if (code.includes('_before_filepath')) {
      const match = /filepath=("(?:\\.|[^"\\])*")/.exec(code)
      assert.ok(match, 'snapshot code must carry a filepath')
      const filePath = JSON.parse(match[1])
      await writeFile(filePath, 'BLEND')
      snapshotFiles.push(filePath)
      return { response: { status: 'ok', result: { written: filePath } } }
    }
    if (code.includes('screen.screenshot')) {
      const match = /_path = ("(?:\\.|[^"\\])*")/.exec(code)
      assert.ok(match, 'capture code must carry a filepath')
      const filePath = JSON.parse(match[1])
      await writeFile(filePath, pngStub(64, 32))
      return { response: { status: 'ok', result: { path: filePath, bytes: 33 } } }
    }
    if (code.includes('render.render')) {
      const match = /render\.filepath = ("(?:\\.|[^"\\])*")/.exec(code)
      assert.ok(match, 'render code must carry a filepath')
      const filePath = JSON.parse(match[1])
      const width = Number(/resolution_x = (\d+)/.exec(code)?.[1] ?? 0)
      const height = Number(/resolution_y = (\d+)/.exec(code)?.[1] ?? 0)
      const samples = Number(/taa_render_samples = (\d+)/.exec(code)?.[1] ?? 0)
      await writeFile(filePath, pngStub(width, height))
      return {
        response: {
          status: 'ok',
          result: { path: filePath, bytes: 33, engine: 'BLENDER_EEVEE', samples, width, height, resolutionPercentage: 100 },
        },
      }
    }
    throw new Error(`unexpected code sent to Blender: ${code.slice(0, 40)}`)
  }

  /** @type {import('../lib/tools.js').BridgeOptions} */
  const options = {
    host: '127.0.0.1',
    port: 9876,
    connectTimeoutMs: 1000,
    responseTimeoutMs: 1000,
    captureTimeoutMs: 1000,
    renderTimeoutMs: 1000,
    maxResponseChars: 200000,
    snapshot: { enabled: setup.snapshotEnabled !== false, generations: 3, on: 'turn', compress: true, timeoutMs: 1000 },
    guard: { enabled: true },
    audit: { enabled: true, storeCode: true },
    taskRoot: '',
    taskRootMode: 'blendFile',
    send,
    warn() {},
    resolveSession: () => ({ sessionId: 's1', workspaceDir: setup.workspaceDir, turn: 3 }),
    snapshotState: {
      shouldSnapshot: () => setup.snapshotEnabled !== false,
      markSnapshot() {},
      nextSeq: () => 1,
    },
    withWriteLock: (task) => task(),
    imageSupport: setup.imageSupport ?? (async () => false),
    attachImage: setup.attachImage ?? (async () => null),
    timeoutWarning: () => setup.timeoutWarning === true,
    noteTimeout() {},
    clearTimeoutNote() {},
    helpersDir: path.resolve('helpers'),
    pythonConfig: { analysisPython: '', autoDetectPython: true },
    helperTimeoutMs: 120000,
    helperMaxOutputChars: 200000,
    enableMaintenanceHelpers: false,
  }
  return { tools: /** @type {ToolLike[]} */ (makeTools(options)), sent, snapshotFiles }
}

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-pipeline-'))
  const blendDir = path.join(root, 'project')
  await mkdir(blendDir, { recursive: true })
  const blendPath = path.join(blendDir, 'scene.blend')
  await writeFile(blendPath, 'BLEND')
  return { root, blendDir, blendPath }
}

test('exec writes a snapshot, runs the guarded payload, and audits the call', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools, sent, snapshotFiles } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute(
    { code: 'result = {"added": true}', task: 'lamp' },
    { agent: { session: { id: 's1' } } },
  )

  assert.equal(value.status, 'ok')
  assert.equal(value.snapshot?.name, '3-001.blend')
  assert.equal(snapshotFiles.length, 1)
  await access(path.join(blendDir, '.dsh-blender-lamp', 'snapshots', '3-001.blend'))
  assert.ok(sent.some((code) => code.includes('_dsh_install(')))
  const auditLines = (await readFile(path.join(blendDir, '.dsh-blender-lamp', 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[0])
  assert.equal(audit.status, 'ok')
  assert.equal(audit.task, 'lamp')
  assert.match(audit.snapshot, /3-001\.blend$/)
})

test('L1 refusal never sends the user code to Blender', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'bpy.ops.wm.save_mainfile()', task: 'lamp' }, { agent: { session: { id: 's1' } } })

  assert.equal(value.status, 'blocked')
  assert.ok(value.blocked.length > 0)
  assert.equal(sent.some((code) => code.includes('<dsh-user-code>')), false)
  const auditLines = (await readFile(path.join(blendDir, '.dsh-blender-lamp', 'audit.jsonl'), 'utf8')).trim().split('\n')
  assert.equal(JSON.parse(auditLines[0]).status, 'blocked')
})

test('a guard refusal maps to blocked with a suggested path', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    execResult: () => ({
      status: 'error',
      result: {},
      undo: { pushed: true },
      guard: {
        enabled: true,
        verified: true,
        opsIntact: true,
        blocked: [{ target: 'C:/Windows/x.txt', action: 'write', kind: 'write' }],
        noted: [],
      },
      warnings: [],
      error: { message: 'blocked', traceback: 'Traceback' },
    }),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'open("C:/Windows/x.txt", "w")', task: 'lamp' }, { agent: { session: { id: 's1' } } })

  assert.equal(value.status, 'blocked')
  assert.ok(value.suggestedPath.includes('.dsh-blender-lamp'))
})

test('snapshot can be disabled and the exec still runs', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, snapshotFiles } = makeBridge({ blendPath, workspaceDir: root, snapshotEnabled: false })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(snapshotFiles.length, 0)
})

test('capture returns an image block when the model supports images', async () => {
  const { blendPath, root } = await makeProject()
  const attachImage = async (/** @type {string} */ filePath, /** @type {string} */ mediaType) => ({
    attachmentId: 'sha256:abc',
    mediaType,
    bytes: 33,
    width: 64,
    height: 32,
    name: 'blockout.png',
  })
  const { tools } = makeBridge({ blendPath, workspaceDir: root, imageSupport: async () => true, attachImage })
  const captureTool = tools.find((tool) => tool.name === 'blender_mcp_capture')
  assert.ok(captureTool?.output)

  const value = await captureTool.execute({ task: 'lamp', label: 'blockout' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(value.width, 64)
  assert.equal(value.height, 32)
  assert.ok(value.image)
  const blocks = captureTool.output.render({}, value)
  assert.ok(blocks.some((block) => block.type === 'image'))
})

test('capture falls back to the saved path when images are unsupported', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const captureTool = tools.find((tool) => tool.name === 'blender_mcp_capture')
  assert.ok(captureTool?.output)

  const value = await captureTool.execute({ task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(value.image, undefined)
  assert.ok(value.warnings.length > 0)
  const blocks = captureTool.output.render({}, value)
  assert.equal(blocks.some((block) => block.type === 'image'), false)
})

test('render passes explicit settings and returns the real dimensions', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  assert.ok(renderTool)

  const value = await renderTool.execute(
    { task: 'lamp', width: 640, height: 360, samples: 16 },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  assert.equal(value.width, 640)
  assert.equal(value.height, 360)
  assert.equal(value.samples, 16)
  assert.equal(value.engine, 'BLENDER_EEVEE')
})

test('render rejects out-of-range dimensions before touching Blender', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  assert.ok(renderTool)

  await assert.rejects(() =>
    renderTool.execute({ task: 'lamp', width: 9000, height: 360, samples: 16 }, { agent: { session: { id: 's1' } } }),
  )
})

test('exec reports the objects added by the call', async () => {
  const { blendPath, root } = await makeProject()
  let calls = 0
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    nextObjectNames: () => (calls++ === 0 ? ['Cube'] : ['Cube', 'Lamp']),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.deepEqual(value.changes.objectsAdded, ['Lamp'])
  assert.equal(value.changes.delta, 1)
})

test('exec render shows the traceback tail', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    snapshotEnabled: false,
    execResult: () => ({
      status: 'error',
      result: {},
      undo: { pushed: true },
      guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
      error: {
        message: 'IndexError: tuple index out of range',
        traceback:
          'Traceback (most recent call last):\n  File "<dsh-user-code>", line 3, in <module>\nIndexError: tuple index out of range',
      },
      warnings: [],
    }),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)
  assert.ok(execTool.output)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  const blocks = execTool.output.render({}, value)
  assert.ok(String(blocks[0].text).includes('Traceback (tail):'))
  assert.ok(String(blocks[0].text).includes('<dsh-user-code>'))
})

test('status reports the live facts and lists task directories', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_status')
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(statusTool)
  assert.ok(statusTool.output)
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  const value = await statusTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(value.connected, true)
  assert.equal(value.taskRoot, blendDir)
  assert.equal(value.taskDirs.length, 1)
  assert.equal(value.taskDirs[0].name, '.dsh-blender-lamp')
  assert.equal(value.taskDirs[0].snapshots, 1)
  const blocks = statusTool.output.render({}, value)
  assert.ok(String(blocks[0].text).includes('docs.blender.org'))
})

test('capture refuses background mode with a clear reason', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, background: true })
  const captureTool = tools.find((tool) => tool.name === 'blender_mcp_capture')
  assert.ok(captureTool)

  const value = await captureTool.execute({ task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.equal(value.error.kind, 'background-mode')
})

test('a stale timeout note shows up as a warning on the next exec', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, timeoutWarning: true })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.ok(value.warnings.some((/** @type {string} */ warning) => warning.includes('previous call timed out')))
})

test('helper tool refuses unknown and disabled maintenance helpers', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const helperTool = tools.find((tool) => tool.name === 'blender_mcp_helper')
  assert.ok(helperTool)

  const unknown = await helperTool.execute({ name: 'nope', task: 'lamp', args: {} }, { agent: { session: { id: 's1' } } })
  assert.equal(unknown.error.kind, 'unknown-helper')

  const maintenance = await helperTool.execute(
    { name: 'skill-graph-audit', task: 'lamp', args: {} },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(maintenance.error.kind, 'maintenance-disabled')
})

test('a Python helper runs without a Blender connection', async () => {
  const { blendPath, root } = await makeProject()
  const workspaceDir = path.join(root, 'ws')
  await mkdir(workspaceDir, { recursive: true })
  await writeFile(path.join(workspaceDir, 'fit.json'), '{"fit": {}}', 'utf8')
  const { tools, sent } = makeBridge({ blendPath, workspaceDir, noBlender: true })
  const helperTool = tools.find((tool) => tool.name === 'blender_mcp_helper')
  assert.ok(helperTool)

  const value = await helperTool.execute(
    { name: 'fit-repair-queue', task: 'lamp', args: { 'fit-report': 'fit.json', out: 'queue.json' } },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  assert.equal(sent.length, 0)
})

test('a missing undo step turns the exec into an error', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    snapshotEnabled: false,
    execResult: () => ({
      status: 'ok',
      result: {},
      undo: { pushed: false, error: 'undo disabled' },
      guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
      warnings: [],
    }),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.ok(
    (/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('undo step was not pushed')),
  )
})

test('restored preferences are surfaced as blocked', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    snapshotEnabled: false,
    execResult: () => ({
      status: 'ok',
      result: {},
      undo: { pushed: true },
      guard: {
        enabled: true,
        verified: true,
        opsIntact: true,
        blocked: [{ target: 'edit.undo_steps', action: 'preferences', kind: 'preferences' }],
        noted: [],
        preferencesChanged: ['edit.undo_steps'],
      },
      warnings: [],
    }),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'blocked')
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('Preferences changed')))
})

test('a guard self-check exception is surfaced', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({
    blendPath,
    workspaceDir: root,
    snapshotEnabled: false,
    execResult: () => ({
      status: 'ok',
      result: {},
      undo: { pushed: true },
      guard: {
        enabled: true,
        verified: false,
        hooksIntact: false,
        opsIntact: false,
        blocked: [],
        noted: [],
        verifyError: 'AttributeError: bpy.ops',
      },
      warnings: [],
    }),
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('self-check threw')))
})
