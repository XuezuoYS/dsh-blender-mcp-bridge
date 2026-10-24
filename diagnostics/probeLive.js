/**
 * Live probe: run the critical checks against a real Blender session.
 *
 * It briefly adds one cube (then undoes it), writes snapshots/screenshots/renders
 * under a temp directory, and never saves the user's .blend. Run it only when
 * you are ready to have a cube appear and disappear in the open session.
 *
 * Usage:
 *   node diagnostics/probeLive.js
 *   set DSH_BLENDER_PORT=9877 && node diagnostics/probeLive.js
 */

import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { captureCode, readPngSize } from '../lib/capture.js'
import { wrapWithGuard } from '../lib/guardPayload.js'
import { handshake } from '../lib/handshake.js'
import { sendExecute } from '../lib/protocol.js'
import { renderCode } from '../lib/render.js'
import { snapshotCode } from '../lib/snapshot.js'

const host = process.env.DSH_BLENDER_HOST ?? '127.0.0.1'
const port = Number(process.env.DSH_BLENDER_PORT ?? 9876)
const workDir = mkdtempSync(path.join(tmpdir(), 'dsh-blender-probe-'))
const guardRoot = path.join(workDir, 'task')
/** @type {{ name: string, ok: boolean, detail?: string }[]} */
const results = []

/**
 * @param {string} name - check name
 * @param {boolean} ok - outcome
 * @param {string} [detail] - extra detail
 * @returns {void}
 */
function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`)
}

/**
 * @param {string} code - Python
 * @param {number} [timeoutMs] - reply budget
 * @returns {Promise<Record<string, any>>} add-on envelope
 */
async function send(code, timeoutMs = 60000) {
  const reply = await sendExecute({ host, port, code, connectTimeoutMs: 5000, responseTimeoutMs: timeoutMs })
  return /** @type {Record<string, any>} */ (reply.response)
}

console.log(`target ${host}:${port}`)
console.log(`temp ${workDir}`)
console.log('note: the undo check briefly adds and removes one cube in the open session')

let info
try {
  info = await handshake({ host, port, connectTimeoutMs: 5000, responseTimeoutMs: 10000 })
} catch (error) {
  console.log(`SKIP ${error instanceof Error ? error.message : String(error)}`)
  process.exit(0)
}
console.log(`connected Blender ${info.blenderVersion}; file ${info.filePath || '(unsaved)'}`)

const userFile = info.filePath
const beforeStat = userFile !== '' && existsSync(userFile) ? statSync(userFile) : null
const baselineObjects = info.objectCount

// 1) undo: one push, one Ctrl+Z step
try {
  const create = await send(`import bpy
bpy.ops.mesh.primitive_cube_add()
bpy.ops.ed.undo_push(message='dsh-probe')
result = {'count': len(bpy.data.objects), 'dirty': bool(bpy.data.is_dirty)}
`)
  const createdCount = create.result?.count
  const undo = await send(`import bpy
bpy.ops.ed.undo()
result = {'count': len(bpy.data.objects)}
`)
  const afterCount = undo.result?.count
  record(
    'undo pushes exactly one step',
    createdCount === baselineObjects + 1 && afterCount === baselineObjects,
    `objects ${baselineObjects} -> ${createdCount} -> ${afterCount}`,
  )
} catch (error) {
  record('undo pushes exactly one step', false, String(error))
}

// 2) read-only exec: nothing changed, so no undo step is pushed
try {
  const readOnly = wrapWithGuard('result = {"objects": len(bpy.data.objects)}', {
    taskRoot: guardRoot,
    undoMessage: 'dsh-probe-readonly',
    readOnly: true,
  })
  const reply = await send(readOnly)
  const inner = reply.result ?? {}
  const undo = inner.undo ?? {}
  record(
    'read-only exec pushes no undo step',
    inner.status === 'ok' && undo.pushed === false && undo.reason === 'read-only',
    `pushed=${String(undo.pushed)} reason=${String(undo.reason)}`,
  )
} catch (error) {
  record('read-only exec pushes no undo step', false, String(error))
}

// 3) guard blocks a real save attempt
try {
  const guarded = wrapWithGuard('import bpy\nbpy.ops.wm.save_mainfile()', {
    taskRoot: guardRoot,
    undoMessage: 'dsh-probe-guard',
  })
  const reply = await send(guarded)
  const inner = reply.result ?? {}
  const blocked = Array.isArray(inner.guard?.blocked) ? inner.guard.blocked.length : 0
  const fileUntouched = userFile === '' || !existsSync(userFile) || (beforeStat !== null && statSync(userFile).mtimeMs === beforeStat.mtimeMs)
  record('save operator is blocked', reply.status === 'ok' && inner.status !== 'ok' && blocked > 0, `blocked=${blocked}`)
  record('user .blend untouched', fileUntouched)
} catch (error) {
  record('save operator is blocked', false, String(error))
}

// 4) snapshot leaves filepath and dirty flag alone
try {
  const snapPath = path.join(workDir, 'probe-snapshot.blend')
  const reply = await send(snapshotCode(snapPath, true), 60000)
  const inner = reply.result ?? {}
  const unchanged = inner.filepathUnchanged === true
  const dirtyAfter = inner.dirtyAfter
  record('snapshot copy written', reply.status === 'ok' && existsSync(snapPath), `bytes=${existsSync(snapPath) ? statSync(snapPath).size : 0}`)
  record('snapshot keeps filepath', unchanged === true)
  if (typeof dirtyAfter === 'boolean') record('snapshot keeps dirty flag', dirtyAfter === info.isDirty)
} catch (error) {
  record('snapshot copy written', false, String(error))
}

// 5) whole-window screenshot
try {
  const shotPath = path.join(workDir, 'probe-shot.png')
  const reply = await send(captureCode(shotPath), 30000)
  const size = existsSync(shotPath) ? statSync(shotPath).size : 0
  const png = size > 0 ? await readPngSize(shotPath) : { width: 0, height: 0 }
  record('window screenshot', reply.status === 'ok' && size > 0 && png.width > 1 && png.height > 1, `${png.width}x${png.height}, ${size} bytes`)
} catch (error) {
  record('window screenshot', false, String(error))
}

// 6) preview render and full restore
try {
  const setup = await send(`import bpy
scene = bpy.context.scene
_created = False
if scene.camera is None:
    _cam_data = bpy.data.cameras.new('DshProbeCamera')
    _cam = bpy.data.objects.new('DshProbeCamera', _cam_data)
    scene.collection.objects.link(_cam)
    _cam.location = (6.0, -6.0, 4.0)
    _cam.rotation_euler = (1.1, 0.0, 0.8)
    scene.camera = _cam
    _created = True
if 'DshProbeCube' not in bpy.data.objects:
    bpy.ops.mesh.primitive_cube_add(location=(0.0, 0.0, 0.0))
    bpy.context.active_object.name = 'DshProbeCube'
    _created = True
if _created:
    bpy.ops.ed.undo_push(message='dsh-probe-render-setup')
result = {'created': _created, 'camera': scene.camera.name if scene.camera else None, 'count': len(bpy.data.objects)}
`)

  const readSettings = `import bpy
scene = bpy.context.scene
result = {
    'resolution_x': scene.render.resolution_x,
    'resolution_y': scene.render.resolution_y,
    'resolution_percentage': scene.render.resolution_percentage,
    'filepath': scene.render.filepath,
    'file_format': scene.render.image_settings.file_format,
    'engine': scene.render.engine,
    'camera': scene.camera.name if scene.camera else None,
    'eevee': scene.eevee.taa_render_samples if hasattr(scene, 'eevee') else None,
    'cycles': scene.cycles.samples if hasattr(scene, 'cycles') else None,
    'denoise': scene.cycles.use_denoising if hasattr(scene, 'cycles') else None,
}
`
  const before = (await send(readSettings)).result
  const renderPath = path.join(workDir, 'probe-render.png')
  const renderStatusPath = path.join(workDir, 'probe-render.render.json')
  const render = await send(renderCode({ filePath: renderPath, statusPath: renderStatusPath, jobId: 'probe-render', width: 160, height: 90, samples: 8 }), 120000)
  const after = (await send(readSettings)).result
  const same = JSON.stringify(before) === JSON.stringify(after)
  record('preview render', render.status === 'ok' && existsSync(renderPath), `bytes=${existsSync(renderPath) ? statSync(renderPath).size : 0}, engine=${String(after?.engine)}`)
  record('render settings fully restored', same, same ? '' : `before=${JSON.stringify(before)} after=${JSON.stringify(after)}`)
  let renderStatus = null
  try {
    renderStatus = JSON.parse(readFileSync(renderStatusPath, 'utf8'))
  } catch {
    renderStatus = null
  }
  record(
    'render status file ends done',
    renderStatus?.state === 'done' && renderStatus?.path === renderPath,
    renderStatus === null ? 'missing status file' : `state=${String(renderStatus.state)}`,
  )

  if (setup.result?.created === true) {
    const cleanup = await send(`import bpy
bpy.ops.ed.undo()
result = {'count': len(bpy.data.objects)}
`)
    record('render probe cleaned up', cleanup.result?.count === baselineObjects, `objects=${String(cleanup.result?.count)}`)
  }
} catch (error) {
  record('preview render', false, String(error))
}

// 7) user file still untouched at the end
if (userFile !== '' && beforeStat !== null && existsSync(userFile)) {
  const afterStat = statSync(userFile)
  record('user .blend never saved', afterStat.mtimeMs === beforeStat.mtimeMs && afterStat.size === beforeStat.size)
}

try {
  rmSync(workDir, { recursive: true, force: true })
} catch {
  // temp dir cleanup is best-effort
}

const failed = results.filter((entry) => !entry.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length === 0 ? 0 : 1)
