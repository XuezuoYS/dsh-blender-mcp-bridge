/**
 * Visual tool helpers: screenshot and render payloads, PNG header parsing and
 * the trusted write path. No Blender needed.
 */

import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { captureCode, captureFileName, createCapture, readPngSize } from '../lib/capture.js'
import { createRender, renderCode, renderFileName } from '../lib/render.js'
import { ensureTaskDir } from '../lib/taskDir.js'

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
 * Trusted sender that writes the file named in the generated Python.
 *
 * @returns {(code: string) => Promise<{ response: unknown }>} fake sender
 */
function fakeSender() {
  return async (code) => {
    const patterns = [/_path = ("(?:\\.|[^"\\])*")/, /render\.filepath = ("(?:\\.|[^"\\])*")/, /filepath=("(?:\\.|[^"\\])*")/]
    let match
    for (const pattern of patterns) {
      match = pattern.exec(code)
      if (match) break
    }
    assert.ok(match, 'payload must carry a filepath literal')
    const filePath = JSON.parse(match[1])
    await (await import('node:fs/promises')).writeFile(filePath, pngStub(640, 360))
    return {
      response: {
        status: 'ok',
        result: { path: filePath, bytes: 33, engine: 'BLENDER_EEVEE', samples: 16, width: 640, height: 360, resolutionPercentage: 100 },
      },
    }
  }
}

test('capture payload screenshots the window to an absolute PNG path', () => {
  const code = captureCode('C:/proj/.dsh-blender-lamp/captures/window.png')
  assert.match(code, /bpy\.ops\.screen\.screenshot\(filepath=/)
  assert.match(code, /C:\/proj\/\.dsh-blender-lamp\/captures\/window\.png/)
  assert.match(code, /dsh_blender_mcp_guard/)
  assert.match(captureFileName('blockout'), /^blockout-\d{14}\.png$/)
  assert.match(captureFileName(undefined), /^window-\d{14}\.png$/)
})

test('render payload sets and restores every touched setting', () => {
  const code = renderCode({ filePath: 'C:/proj/.dsh-blender-lamp/renders/a.png', width: 640, height: 360, samples: 16 })
  assert.match(code, /render\.resolution_x = 640/)
  assert.match(code, /render\.resolution_y = 360/)
  assert.match(code, /render\.resolution_percentage = 100/)
  assert.match(code, /taa_render_samples = 16/)
  assert.match(code, /bpy\.ops\.render\.render\(write_still=True\)/)
  assert.match(code, /dsh_blender_mcp_guard/)
  for (const restore of ['resolution_x', 'resolution_y', 'resolution_percentage', 'filepath', 'file_format', 'engine', 'camera']) {
    assert.ok(code.includes(`${restore} = _before[`), `missing restore for ${restore}`)
  }
  assert.ok(code.includes("_before['eevee_samples']"))
  assert.ok(code.includes("_before['cycles_samples']"))
  assert.ok(code.includes("_before['cycles_denoise']"))
  assert.match(renderFileName(undefined), /^render-\d{14}\.png$/)
})

test('readPngSize parses IHDR dimensions', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'dsh-png-'))
  const file = path.join(dir, 'a.png')
  const { writeFile } = await import('node:fs/promises')
  await writeFile(file, pngStub(320, 200))
  assert.deepEqual(await readPngSize(file), { width: 320, height: 200 })
})

test('createCapture writes into captures/ and reports dimensions', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-visual-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const result = await createCapture({ taskDir: task.dir, label: 'shot', send: fakeSender(), timeoutMs: 1000 })
  assert.match(result.path, /captures[\\/]shot-\d{14}\.png$/)
  assert.equal(result.width, 640)
  assert.equal(result.height, 360)
  assert.ok(result.bytes > 0)
})

test('createRender writes into renders/ and reports engine and samples', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-visual-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const result = await createRender({
    taskDir: task.dir,
    width: 640,
    height: 360,
    samples: 16,
    send: fakeSender(),
    timeoutMs: 1000,
  })
  assert.match(result.path, /renders[\\/]render-\d{14}\.png$/)
  assert.equal(result.width, 640)
  assert.equal(result.engine, 'BLENDER_EEVEE')
  assert.equal(result.samples, 16)
})

test('a failed capture is reported with a readable error', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-visual-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  await assert.rejects(
    createCapture({
      taskDir: task.dir,
      send: async () => ({ response: { status: 'error', message: 'poll failed' } }),
      timeoutMs: 1000,
    }),
    /poll failed/,
  )
})
