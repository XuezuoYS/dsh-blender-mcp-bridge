/**
 * End-to-end exec pipeline tests with a fake Blender transport.
 *
 * These exercise: handshake → task dir → snapshot → L1 → guarded payload →
 * result mapping → audit, without a running Blender.
 */

import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { access, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { ProtocolError } from '../lib/protocol.js'
import { createRenderStats } from '../lib/renderStats.js'
import { SendGateError } from '../lib/sendGate.js'
import { createSnapshotTracker } from '../lib/snapshotPolicy.js'
import { makeTools } from '../lib/tools.js'
import { createTestHelperEnv } from './support/testPython.js'

/** Payload marker the guard writes for user code; also covers script mode. */
const USER_CODE_MARKER = /<dsh-(?:user-code|script:[^>]*)>/

/**
 * Session context every tool call uses in these tests.
 *
 * @returns {{ agent: { session: { id: string } } }} fake execution context
 */
function execContext() {
  return { agent: { session: { id: 's1' } } }
}

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
 * @param {'turn'|'write'|'adaptive'} [setup.snapshotOn] - snapshot cadence
 * @param {number} [setup.everyWrites] - writes between automatic snapshots
 * @param {boolean} [setup.onDestructive] - extra snapshot before delete-like code
 * @param {(inner: Record<string, unknown>) => Record<string, unknown>} [setup.execResult] - inner envelope override
 * @param {Record<string, unknown>} [setup.inspectResult] - inspect payload result override
 * @param {boolean} [setup.inspectFails] - make the inspect payload report an error
 * @param {() => Promise<boolean>} [setup.imageSupport] - model image capability
 * @param {(filePath: string, mediaType: string, name: string) => Promise<unknown | null>} [setup.attachImage] - attachment stub
 * @param {() => string[]} [setup.nextObjectNames] - object-name snapshots per call
 * @param {boolean} [setup.background] - handshake reports background mode
 * @param {boolean} [setup.timeoutWarning] - report a stale timeout note
 * @param {boolean} [setup.noBlender] - fail the transport, proving it is unused
 * @param {string} [setup.knownFilePath] - last known .blend path for Python helpers
 * @param {boolean} [setup.timeoutOnExec] - make the exec request time out
 * @param {boolean} [setup.probeUnreachable] - make the liveness probe fail to connect
 * @param {number} [setup.initialPushes] - undo steps already pushed this session
 * @param {boolean} [setup.busyGate] - make the read-slot gate reject with a busy error
 * @param {boolean} [setup.storeCode] - store the executed code in the audit log (default true)
 * @returns {{ tools: ToolLike[], sent: string[], sentOptions: Record<string, unknown>[], snapshotFiles: string[], inspectParams: Record<string, unknown>[], slotCalls: () => number, pushes: () => number }} bridge pieces
 */
function makeBridge(setup) {
  /** @type {string[]} */
  const sent = []
  /** @type {Record<string, unknown>[]} */
  const sentOptions = []
  /** @type {string[]} */
  const snapshotFiles = []
  /** @type {Record<string, unknown>[]} */
  const inspectParams = []
  let pushes = setup.initialPushes ?? 0
  let slotCalls = 0
  const snapshotState = createSnapshotTracker({
    enabled: setup.snapshotEnabled !== false,
    on: setup.snapshotOn ?? 'adaptive',
    everyWrites: setup.everyWrites ?? 10,
    onDestructive: setup.onDestructive !== false,
  })
  const send = async (/** @type {string} */ code, /** @type {Record<string, unknown>} */ options = {}) => {
    sent.push(code)
    sentOptions.push(options)
    if (code.includes('"ping"')) {
      if (setup.probeUnreachable === true) throw new ProtocolError('connect-refused', 'probe refused')
      return { response: { status: 'ok', result: { ping: true } } }
    }
    if (setup.timeoutOnExec === true && USER_CODE_MARKER.test(code)) {
      throw new ProtocolError('response-timeout', 'exec timed out')
    }
    if (setup.noBlender === true) throw new Error('transport should not be used')
    if (code.includes('versionMajorMinor')) {
      return { response: handshakeEnvelope(setup.blendPath, setup.background === true) }
    }
    if (code.includes('bpy.data.objects][:500]')) {
      const names = setup.nextObjectNames ? setup.nextObjectNames() : ['Cube']
      return { response: { status: 'ok', result: { names, total: names.length } } }
    }
    if (USER_CODE_MARKER.test(code)) {
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
      return { response: { status: 'ok', result: { written: filePath, filepathUnchanged: true, dirtyBefore: false, dirtyAfter: false } } }
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
    if (code.includes('_dsh_inspect_params')) {
      const encoded = /b64decode\('([A-Za-z0-9+/=]+)'\)/.exec(code)?.[1]
      assert.ok(encoded, 'inspect code must carry base64 arguments')
      inspectParams.push(JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')))
      if (setup.inspectFails === true) return { response: { status: 'error', message: 'boom' } }
      return {
        response: {
          status: 'ok',
          result: setup.inspectResult ?? {
            scope: 'summary',
            scene: 'Scene',
            totalObjects: 1,
            applied: {},
            summary: {
              typeCounts: { MESH: 1 },
              collections: { total: 0, master: 1, unassigned: 0, top: [] },
              materials: 0,
              lights: 0,
              cameras: 0,
            },
            paging: { totalMatched: 1, returned: 1, offset: 0, nextOffset: null, truncated: false },
            items: [{ name: 'Cube', type: 'MESH' }],
          },
        },
      }
    }
    throw new Error(`unexpected code sent to Blender: ${code.slice(0, 40)}`)
  }

  const { helperEnv } = createTestHelperEnv()
  /** @type {import('../lib/tools.js').BridgeOptions} */
  const options = {
    host: '127.0.0.1',
    port: 9876,
    connectTimeoutMs: 1000,
    responseTimeoutMs: 1000,
    captureTimeoutMs: 1000,
    renderTimeoutMs: 1000,
    maxResponseChars: 200000,    snapshot: {
      enabled: setup.snapshotEnabled !== false,
      generations: 3,
      on: setup.snapshotOn ?? 'adaptive',
      everyWrites: setup.everyWrites ?? 10,
      onDestructive: setup.onDestructive !== false,
      compress: true,
      timeoutMs: 1000,
    },
    guard: { enabled: true },
    audit: { enabled: true, storeCode: setup.storeCode !== false },
    taskRoot: '',
    taskRootMode: 'blendFile',
    send,
    warn() {},
    resolveSession: () => ({ sessionId: 's1', workspaceDir: setup.workspaceDir, turn: 3 }),
    knownFilePath: () => setup.knownFilePath ?? '',
    noteFilePath() {},
    snapshotState,
    undoPushCount: () => pushes,
    noteUndoPush() {
      pushes += 1
    },
    withWriteLock: (task) => task(),
    withSendSlot: (task) => {
      slotCalls += 1
      if (setup.busyGate === true) return Promise.reject(new SendGateError('busy', 'no free slot'))
      return task()
    },
    imageSupport: setup.imageSupport ?? (async () => false),
    attachImage: setup.attachImage ?? (async () => null),
    renderStats: createRenderStats(),
    timeoutWarning: () => setup.timeoutWarning === true,
    noteTimeout() {},
    clearTimeoutNote() {},
    helpersDir: path.resolve('helpers'),
    helperEnv,
    helperTimeoutMs: 120000,
    helperMaxOutputChars: 200000,
    enableMaintenanceHelpers: false,
  }
  return {
    tools: /** @type {ToolLike[]} */ (makeTools(options)),
    sent,
    sentOptions,
    snapshotFiles,
    inspectParams,
    slotCalls: () => slotCalls,
    pushes: () => pushes,
  }
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
  assert.equal(value.snapshot?.name, '3-000001.blend')
  assert.equal(snapshotFiles.length, 1)
  await access(path.join(blendDir, '.dsh-blender-lamp', 'snapshots', '3-000001.blend'))
  assert.ok(sent.some((code) => code.includes('_dsh_install(')))
  const auditLines = (await readFile(path.join(blendDir, '.dsh-blender-lamp', 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[0])
  assert.equal(audit.status, 'ok')
  assert.equal(audit.task, 'lamp')
  assert.match(audit.snapshot, /3-000001\.blend$/)
  assert.equal(audit.snapshotReason, 'turn')
  assert.equal(audit.writesSinceSnapshot, 1)
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

test('L1 warnings ride along with a successful exec and reach the audit log', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'import ctypes\nresult = {"ok": true}', task: 'lamp' }, execContext())

  assert.equal(value.status, 'ok')
  const warnings = /** @type {string[]} */ (value.warnings)
  assert.ok(warnings.some((warning) => warning.includes('ctypes')))
  assert.equal(value.policyWarnings.length, 1)
  assert.match(value.policyWarnings[0], /^line 1: ctypes/)
  assert.ok(sent.some((code) => USER_CODE_MARKER.test(code)), 'the call must still run')
  const text = String(execTool.output?.render({}, value)[0].text)
  assert.ok(text.includes('Warning: line 1: ctypes'))
  const auditLines = (await readFile(path.join(blendDir, '.dsh-blender-lamp', 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[0])
  assert.equal(audit.status, 'ok')
  assert.deepEqual(audit.policyWarnings, value.policyWarnings)
})

test('scriptPath runs a task-directory script and records its hash', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  // The first call claims `.dsh-blender-lamp` and writes its owner marker.
  await execTool.execute({ code: 'result = {}', task: 'lamp' }, execContext())
  const taskDir = path.join(blendDir, '.dsh-blender-lamp')
  await mkdir(path.join(taskDir, 'scripts'), { recursive: true })
  const source = 'marker = "script-ran"\nresult = {"marker": marker}\n'
  await writeFile(path.join(taskDir, 'scripts', 'make.py'), source)

  const value = await execTool.execute({ scriptPath: 'scripts/make.py', task: 'lamp' }, execContext())

  assert.equal(value.status, 'ok')
  const sha256 = createHash('sha256').update(source).digest('hex')
  assert.deepEqual(value.script, { path: 'scripts/make.py', sha256, bytes: Buffer.byteLength(source) })
  assert.ok(sent.some((code) => code.includes('script-ran') && code.includes('<dsh-script:scripts/make.py>')))
  const text = String(execTool.output?.render({}, value)[0].text)
  assert.ok(text.includes('Script: scripts/make.py'))
  const auditLines = (await readFile(path.join(taskDir, 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[auditLines.length - 1])
  assert.equal(audit.status, 'ok')
  assert.equal(audit.scriptPath, 'scripts/make.py')
  assert.equal(audit.scriptSha256, sha256)
  assert.equal(audit.codeSha256, sha256)
})

test('the script hash is audited even when storeCode is off', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, storeCode: false })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, execContext())
  const taskDir = path.join(blendDir, '.dsh-blender-lamp')
  const source = 'result = {"ran": true}\n'
  await writeFile(path.join(taskDir, 'make.py'), source)

  const value = await execTool.execute({ scriptPath: 'make.py', task: 'lamp' }, execContext())
  assert.equal(value.status, 'ok')
  const auditLines = (await readFile(path.join(taskDir, 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[auditLines.length - 1])
  assert.equal(audit.scriptPath, 'make.py')
  assert.equal(audit.scriptSha256, createHash('sha256').update(source).digest('hex'))
  assert.equal(audit.code, undefined)
})

test('a banned call inside a script is blocked before anything is sent', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, execContext())
  const taskDir = path.join(blendDir, '.dsh-blender-lamp')
  await writeFile(path.join(taskDir, 'bad.py'), 'bpy.ops.wm.save_mainfile()\n')
  const payloadsBefore = sent.filter((code) => USER_CODE_MARKER.test(code)).length

  const value = await execTool.execute({ scriptPath: 'bad.py', task: 'lamp' }, execContext())

  assert.equal(value.status, 'blocked')
  assert.equal(value.blocked[0].rule, 'blocked-operator')
  assert.equal(value.script.path, 'bad.py')
  assert.equal(sent.filter((code) => USER_CODE_MARKER.test(code)).length, payloadsBefore, 'no payload may be sent')
  const auditLines = (await readFile(path.join(taskDir, 'audit.jsonl'), 'utf8')).trim().split('\n')
  const audit = JSON.parse(auditLines[auditLines.length - 1])
  assert.equal(audit.status, 'blocked')
  assert.equal(audit.scriptPath, 'bad.py')
})

test('a script that changed after the scan is refused without running', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const taskDir = path.join(blendDir, '.dsh-blender-lamp')
  const scriptPath = path.join(taskDir, 'make.py')
  let changedSource = ''
  const { tools, sent } = makeBridge({
    blendPath,
    workspaceDir: root,
    nextObjectNames: () => {
      if (changedSource !== '') writeFileSync(scriptPath, changedSource, 'utf8')
      return ['Cube']
    },
  })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, execContext())
  await writeFile(scriptPath, 'result = {"version": 1}\n')
  const payloadsBefore = sent.filter((code) => USER_CODE_MARKER.test(code)).length
  changedSource = 'result = {"version": 2}\n'

  const value = await execTool.execute({ scriptPath: 'make.py', task: 'lamp' }, execContext())

  assert.equal(value.status, 'refused')
  assert.equal(value.error.kind, 'script-changed')
  assert.equal(sent.filter((code) => USER_CODE_MARKER.test(code)).length, payloadsBefore, 'no payload may be sent')
  const auditLines = (await readFile(path.join(taskDir, 'audit.jsonl'), 'utf8')).trim().split('\n')
  assert.equal(JSON.parse(auditLines[auditLines.length - 1]).status, 'refused')
})

test('scriptPath rejects bad paths before touching Blender', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, execContext())
  const payloadsBefore = sent.filter((code) => USER_CODE_MARKER.test(code)).length
  for (const badPath of ['../outside.py', 'notes.txt', 'missing.py']) {
    const value = await execTool.execute({ scriptPath: badPath, task: 'lamp' }, execContext())
    assert.equal(value.status, 'error', badPath)
    assert.equal(value.error.kind, 'invalid-script', badPath)
  }
  assert.equal(sent.filter((code) => USER_CODE_MARKER.test(code)).length, payloadsBefore)
})

test('code, batch and scriptPath cannot be combined', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  for (const args of [
    { code: 'result = {}', scriptPath: 'make.py', task: 'lamp' },
    { batch: ['result = {}'], scriptPath: 'make.py', task: 'lamp' },
    { task: 'lamp' },
  ]) {
    const value = await execTool.execute(args, execContext())
    assert.equal(value.status, 'error')
    assert.equal(value.error.kind, 'invalid-arguments')
  }
  assert.equal(sent.length, 0)
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
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_status')
  assert.ok(execTool)
  assert.ok(statusTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(snapshotFiles.length, 0)

  const status = await statusTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(status.snapshotPolicy.enabled, false)
  assert.ok(String(statusTool.output?.render({}, status)[0].text).includes('Snapshot policy: disabled'))
})

test('adaptive snapshots appear at the turn start and every N writes', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, everyWrites: 4 })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  /** @type {string[]} */
  const reasons = []
  /** @type {string[]} */
  const names = []
  for (let index = 0; index < 10; index += 1) {
    /** @type {Record<string, any>} */
    const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
    assert.equal(value.status, 'ok')
    reasons.push(value.snapshot === undefined ? '' : String(value.snapshot.reason))
    if (value.snapshot !== undefined) names.push(String(value.snapshot.name))
  }

  assert.equal(bridge.snapshotFiles.length, 3)
  assert.deepEqual(reasons, ['turn', '', '', '', 'everyWrites', '', '', '', 'everyWrites', ''])
  assert.deepEqual(names, ['3-000001.blend', '3-000002.blend', '3-000003.blend'])
})

test('a 30-write turn produces several automatic snapshots with the defaults', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool?.output)

  /** @type {number[]} */
  const snapshotCalls = []
  /** @type {string} */
  let snapshotText = ''
  for (let index = 0; index < 30; index += 1) {
    const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
    if (value.snapshot !== undefined) {
      snapshotCalls.push(index + 1)
      snapshotText = String(execTool.output.render({}, value)[0].text)
    }
  }

  assert.deepEqual(snapshotCalls, [1, 11, 21])
  assert.equal(bridge.snapshotFiles.length, 3)
  assert.ok(snapshotText.includes('never restores a snapshot'))
  assert.ok(snapshotText.includes('3-000003.blend'))
})

test('a delete-like call takes an extra snapshot before it runs', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(bridge.snapshotFiles.length, 1)

  const removed = await execTool.execute(
    { code: 'bpy.data.objects.remove(bpy.data.objects[0])', task: 'lamp' },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(removed.status, 'ok')
  assert.equal(removed.snapshot?.reason, 'destructive')
  assert.equal(bridge.snapshotFiles.length, 2)

  const first = await execTool.execute(
    { code: 'bpy.data.objects.remove(bpy.data.objects[0])', task: 'lamp', readOnly: true },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(first.snapshot, undefined)
  assert.equal(bridge.snapshotFiles.length, 2)
})

test('turn mode warns once when the turn runs past everyWrites', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, snapshotOn: 'turn', everyWrites: 3 })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  /** @type {string[]} */
  const warnings = []
  for (let index = 0; index < 5; index += 1) {
    const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
    warnings.push((Array.isArray(value.warnings) ? value.warnings : []).join('\n'))
  }

  assert.equal(bridge.snapshotFiles.length, 1)
  assert.equal(warnings.filter((text) => text.includes('Long turn')).length, 1)
  assert.ok(warnings[2].includes('3 writes since the last automatic snapshot'))
})

test('an explicit snapshot covers the turn and resets the interval', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, everyWrites: 1 })
  const snapshotTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_snapshot')
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(snapshotTool)
  assert.ok(execTool)

  const explicit = await snapshotTool.execute({ task: 'lamp', label: 'checkpoint' }, { agent: { session: { id: 's1' } } })
  assert.equal(explicit.status, 'ok')
  assert.equal(explicit.name, '3-000001.blend')
  assert.equal(explicit.writesSincePrevious, 0)
  assert.equal(explicit.tookMs >= 0, true)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.snapshot, undefined)
  assert.equal(bridge.snapshotFiles.length, 1)
})

test('status reports the snapshot policy and the gap since the last snapshot', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, everyWrites: 5 })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  const statusTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_status')
  assert.ok(execTool)
  assert.ok(statusTool?.output)

  await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })

  const value = await statusTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(value.snapshotPolicy.on, 'adaptive')
  assert.equal(value.snapshotPolicy.everyWrites, 5)
  assert.equal(value.snapshotPolicy.onDestructive, true)
  assert.equal(value.taskDirs[0].writesSinceSnapshot, 2)

  const text = String(statusTool.output.render({}, value)[0].text)
  assert.ok(text.includes('Snapshot policy: adaptive;'))
  assert.ok(text.includes('2 writes since 3-000001.blend'))
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

test('render uses the live scene settings when dimensions are omitted', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  assert.ok(renderTool)

  const value = await renderTool.execute({ task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(value.width, 1920)
  assert.equal(value.height, 1080)
  assert.equal(value.samples, 64)
  assert.ok(sent.some((code) => code.includes('resolution_x = 1920') && code.includes('taa_render_samples = 64')))
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

test('render forwards the per-call timeout and falls back to the configured one', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sentOptions } = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  assert.ok(renderTool)
  const exec = { agent: { session: { id: 's1' } } }

  await renderTool.execute({ task: 'lamp', timeoutMs: 777000 }, exec)
  assert.equal(sentOptions.at(-1)?.responseTimeoutMs, 777000)

  await renderTool.execute({ task: 'lamp' }, exec)
  assert.equal(sentOptions.at(-1)?.responseTimeoutMs, 1000)
})

test('render rejects a timeout outside the accepted range or combined with background', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sentOptions } = makeBridge({ blendPath, workspaceDir: root })
  const renderTool = tools.find((tool) => tool.name === 'blender_mcp_render')
  assert.ok(renderTool)
  const exec = { agent: { session: { id: 's1' } } }
  const before = sentOptions.length

  await assert.rejects(renderTool.execute({ task: 'lamp', timeoutMs: 500 }, exec), /timeoutMs/)
  await assert.rejects(renderTool.execute({ task: 'lamp', timeoutMs: 1800001 }, exec), /timeoutMs/)
  await assert.rejects(renderTool.execute({ task: 'lamp', background: true, timeoutMs: 1000 }, exec), /omit it with background/)
  assert.equal(sentOptions.length, before, 'invalid arguments must not reach Blender')
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
  assert.equal(value.taskDirs[0].snapshotDetails.length, 1)
  assert.equal(value.taskDirs[0].snapshotDetails[0].name, '3-000001.blend')
  assert.equal(value.taskDirs[0].snapshotDetails[0].bytes, 5)
  assert.match(value.taskDirs[0].snapshotDetails[0].modifiedAt, /^\d{4}-\d{2}-\d{2}T/)
  const blocks = statusTool.output.render({}, value)
  assert.ok(String(blocks[0].text).includes('docs.blender.org'))
  assert.ok(String(blocks[0].text).includes('3-000001.blend (5 bytes'))
})

test('status warns when autosave moves the .blend path', async () => {
  const { blendPath, root } = await makeProject()
  const oldPath = path.join(root, 'old', 'scene.blend')
  const { tools } = makeBridge({ blendPath, workspaceDir: root, knownFilePath: oldPath })
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_status')
  assert.ok(statusTool)

  const value = await statusTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(value.connected, true)
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('path changed')))
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

test('exec accepts a batch and pushes only one undo step', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute(
    { task: 'lamp', batch: ['result = {"a": 1}', 'result = {"b": 2}'] },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  const payload = sent.find((code) => code.includes('_dsh_batch_steps'))
  assert.ok(payload, 'batch payload missing')
  assert.equal((payload.match(/bpy\.ops\.ed\.undo_push/g) ?? []).length, 1)
})

test('exec passes a per-call timeout to the transport', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sentOptions } = makeBridge({ blendPath, workspaceDir: root })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await execTool.execute({ code: 'result = {}', task: 'lamp', timeoutMs: 1234 }, { agent: { session: { id: 's1' } } })
  assert.ok(sentOptions.some((options) => options.responseTimeoutMs === 1234))
})

test('ten read-only exec calls skip the snapshot, the object diff and the undo step', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({
    blendPath,
    workspaceDir: root,
    execResult: () => ({
      status: 'ok',
      result: { objects: 3174 },
      undo: { pushed: false, message: 'dsh-blender: lamp', reason: 'read-only' },
      guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
      warnings: [],
    }),
  })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  for (let index = 0; index < 10; index += 1) {
    /** @type {Record<string, any>} */
    const value = await execTool.execute(
      { code: 'result = {"objects": len(bpy.data.objects)}', task: 'lamp', readOnly: true },
      { agent: { session: { id: 's1' } } },
    )
    assert.equal(value.status, 'ok')
    assert.equal(value.snapshot, undefined)
    assert.deepEqual(value.changes, { skipped: true, reason: 'read-only' })
    assert.equal(value.undo.pushed, false)
    assert.equal(value.undoUsage.pluginPushes, 0)
    assert.equal(value.undoUsage.stepLimit, 32)
    assert.ok(!(/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('undo step was not pushed')))
  }
  assert.equal(bridge.pushes(), 0)
  assert.equal(bridge.snapshotFiles.length, 0)
  assert.equal(bridge.sent.some((code) => code.includes('bpy.data.objects][:500]')), false)
  assert.ok(bridge.sent.some((code) => code.includes('<dsh-user-code>')))
  assert.ok(bridge.sent.some((code) => code.includes('_dsh_fingerprint')))
})

test('a read-only exec does not use the turn snapshot slot', async () => {
  const { blendPath, root } = await makeProject()
  let calls = 0
  const bridge = makeBridge({
    blendPath,
    workspaceDir: root,
    execResult: () => {
      calls += 1
      return calls === 1
        ? {
            status: 'ok',
            result: {},
            undo: { pushed: false, message: 'dsh-blender: lamp', reason: 'read-only' },
            guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
            warnings: [],
          }
        : {
            status: 'ok',
            result: {},
            undo: { pushed: true, message: 'dsh-blender: lamp' },
            guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
            warnings: [],
          }
    },
  })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const readOnlyValue = await execTool.execute(
    { code: 'result = {}', task: 'lamp', readOnly: true },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(readOnlyValue.snapshot, undefined)
  assert.equal(bridge.snapshotFiles.length, 0)

  const writeValue = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(writeValue.snapshot?.name, '3-000001.blend')
  assert.equal(bridge.snapshotFiles.length, 1)
})

test('a read-only exec that changed the scene still pushes undo and warns', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({
    blendPath,
    workspaceDir: root,
    execResult: () => ({
      status: 'ok',
      result: {},
      undo: { pushed: true, message: 'dsh-blender: lamp', reason: 'read-only-changed' },
      guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
      warnings: [],
    }),
  })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute(
    { code: 'obj.location = (1, 0, 0)', task: 'lamp', readOnly: true },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  assert.equal(value.undo.pushed, true)
  assert.equal(bridge.pushes(), 1)
  assert.equal(value.undoUsage.pluginPushes, 1)
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('readOnly was set')))
})

test('a read-only exec with an unavailable change check pushes undo and warns', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({
    blendPath,
    workspaceDir: root,
    execResult: () => ({
      status: 'ok',
      result: {},
      undo: { pushed: true, message: 'dsh-blender: lamp', reason: 'read-only-unverified', checkError: 'AttributeError: objects' },
      guard: { enabled: true, verified: true, opsIntact: true, blocked: [], noted: [] },
      warnings: [],
    }),
  })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp', readOnly: true }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(value.undo.pushed, true)
  const warnings = /** @type {string[]} */ (value.warnings)
  assert.ok(warnings.some((warning) => warning.includes('scene change check failed')))
  assert.ok(warnings.some((warning) => warning.includes('AttributeError: objects')))
})

test('undo usage counts plugin pushes and warns at the preference limit', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root, initialPushes: 31 })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)
  assert.ok(execTool.output)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'ok')
  assert.equal(bridge.pushes(), 32)
  assert.equal(value.undoUsage.pluginPushes, 32)
  assert.equal(value.undoUsage.stepLimit, 32)
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('preference limit')))
  const text = String(execTool.output.render({}, value)[0].text)
  assert.ok(text.includes('Undo usage: 32 plugin pushes'))
})

test('readOnly must be a boolean', async () => {
  const { blendPath, root } = await makeProject()
  const bridge = makeBridge({ blendPath, workspaceDir: root })
  const execTool = bridge.tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  await assert.rejects(
    () =>
      execTool.execute({ code: 'result = {}', task: 'lamp', readOnly: 'yes' }, { agent: { session: { id: 's1' } } }),
    /readOnly/,
  )
  assert.equal(bridge.sent.length, 0)
})

test('a timed-out exec reports Blender unreachable when the probe cannot connect', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, timeoutOnExec: true, probeUnreachable: true })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.equal(value.error.kind, 'blender-unreachable')
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('crash')))
})

test('a timed-out exec stays timeout when the probe answers', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, timeoutOnExec: true })
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(execTool)

  const value = await execTool.execute({ code: 'result = {}', task: 'lamp' }, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'timeout')
  assert.ok((/** @type {string[]} */ (value.warnings)).some((warning) => warning.includes('crash')))
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

test('a Python helper reuses the last known .blend directory', async () => {
  const { blendDir, blendPath, root } = await makeProject()
  const workspaceDir = path.join(root, 'ws')
  await mkdir(workspaceDir, { recursive: true })
  await writeFile(path.join(blendDir, 'fit.json'), '{"fit": {}}', 'utf8')
  const { tools } = makeBridge({ blendPath, workspaceDir, knownFilePath: blendPath })
  const helperTool = tools.find((tool) => tool.name === 'blender_mcp_helper')
  assert.ok(helperTool)

  const value = await helperTool.execute(
    {
      name: 'fit-repair-queue',
      task: 'lamp',
      args: { 'fit-report': path.join(blendDir, 'fit.json') },
    },
    { agent: { session: { id: 's1' } } },
  )
  assert.equal(value.status, 'ok')
  await access(path.join(blendDir, '.dsh-blender-lamp', 'outputs', 'fit-repair-queue-out.json'))
})

test('inspect sends one scoped query without a handshake or a task directory', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent, inspectParams } = makeBridge({ blendPath, workspaceDir: root })
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)

  const value = await inspectTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(value.scope, 'summary')
  assert.equal(value.paging.returned, 1)
  assert.deepEqual(value.items, [{ name: 'Cube', type: 'MESH' }])
  assert.equal(sent.length, 1, 'inspect must not run a handshake')
  assert.deepEqual(inspectParams, [
    { scope: 'summary', name: '', type: '', collection: '', collectionDeep: true, include: [], limit: 20, offset: 0 },
  ])
  await assert.rejects(access(path.join(blendPath, '..', '.dsh-blender-lamp')))
})

test('inspect forwards filters, include and paging', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, inspectParams } = makeBridge({ blendPath, workspaceDir: root })
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)

  await inspectTool.execute(
    {
      scope: 'objects',
      name: 'TJ_*',
      type: 'mesh',
      collection: 'TJ_Library',
      collectionDeep: false,
      include: ['transform', 'materials'],
      limit: 2,
      offset: 3,
    },
    { agent: { session: { id: 's1' } } },
  )
  assert.deepEqual(inspectParams, [
    {
      scope: 'objects',
      name: 'TJ_*',
      type: 'MESH',
      collection: 'TJ_Library',
      collectionDeep: false,
      include: ['transform', 'materials'],
      limit: 2,
      offset: 3,
    },
  ])
})

test('inspect rejects bad arguments before touching Blender', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, sent } = makeBridge({ blendPath, workspaceDir: root })
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)
  const exec = { agent: { session: { id: 's1' } } }

  await assert.rejects(inspectTool.execute({ limit: 0 }, exec), /limit must be an integer between 1 and 200/)
  await assert.rejects(inspectTool.execute({ limit: 201 }, exec), /limit/)
  await assert.rejects(inspectTool.execute({ offset: -1 }, exec), /offset must be an integer >= 0/)
  await assert.rejects(inspectTool.execute({ scope: 'render' }, exec))
  await assert.rejects(inspectTool.execute({ include: ['transform', 'nope'] }, exec))
  assert.equal(sent.length, 0)
})

test('inspect reports a Blender-side error instead of a fake success', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, inspectFails: true })
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)

  const value = await inspectTool.execute({}, { agent: { session: { id: 's1' } } })
  assert.equal(value.status, 'error')
  assert.equal(value.error.message, 'boom')
})

test('inspect renders its reply as compact lines', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root })
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(inspectTool)

  const value = await inspectTool.execute({}, { agent: { session: { id: 's1' } } })
  const blocks = inspectTool.output?.render({}, value) ?? []
  const text = blocks.map((block) => String(block.text)).join('\n')
  assert.match(text, /Scene: Scene · 1 objects/)
  assert.match(text, /Types: MESH 1/)
  assert.match(text, /Sample objects \(1 of 1, offset 0\):/)
  assert.match(text, /- Cube \[MESH\]/)
})

test('read tools send through the concurrency gate, writes do not', async () => {
  const { blendPath, root } = await makeProject()
  const { tools, slotCalls } = makeBridge({ blendPath, workspaceDir: root })
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_status')
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  const execTool = tools.find((tool) => tool.name === 'blender_mcp_exec')
  assert.ok(statusTool)
  assert.ok(inspectTool)
  assert.ok(execTool)
  const exec = { agent: { session: { id: 's1' } } }

  await statusTool.execute({}, exec)
  assert.equal(slotCalls(), 1, 'status takes a read slot')
  await inspectTool.execute({}, exec)
  assert.equal(slotCalls(), 2, 'inspect takes a read slot')
  await execTool.execute({ code: 'result = {}', task: 'lamp' }, exec)
  assert.equal(slotCalls(), 2, 'writes are serialized by the write lock instead')
})

test('a busy gate is reported as a readable status error', async () => {
  const { blendPath, root } = await makeProject()
  const { tools } = makeBridge({ blendPath, workspaceDir: root, busyGate: true })
  const statusTool = tools.find((tool) => tool.name === 'blender_mcp_status')
  const inspectTool = tools.find((tool) => tool.name === 'blender_mcp_inspect')
  assert.ok(statusTool)
  assert.ok(inspectTool)
  const exec = { agent: { session: { id: 's1' } } }

  const status = await statusTool.execute({}, exec)
  assert.equal(status.connected, false)
  assert.equal(status.error.kind, 'busy')
  assert.match(status.error.message, /no free slot/)
  assert.ok(Array.isArray(status.error.actions) && status.error.actions.length > 0)

  const inspect = await inspectTool.execute({}, exec)
  assert.equal(inspect.status, 'error')
  assert.equal(inspect.error.kind, 'busy')
})
