/**
 * Task directory tests: slug, root selection, claiming and containment.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  ensureTaskDir,
  isInsideTask,
  listSnapshots,
  listTaskDirs,
  MARKER_FILE,
  resolveTaskRoot,
  slugifyTaskName,
  taskDirName,
} from '../lib/taskDir.js'

test('slugifyTaskName keeps CJK and strips separators', () => {
  assert.equal(slugifyTaskName('灯 lamp/2'), '灯-lamp-2')
  assert.equal(slugifyTaskName('  '), 'task')
  assert.equal(slugifyTaskName('CON'), '_CON')
  assert.equal(slugifyTaskName('a'.repeat(80)).length, 48)
  assert.equal(slugifyTaskName('a:b*c?'), 'a-b-c')
  assert.equal(taskDirName('灯 lamp/2'), '.dsh-blender-灯-lamp-2')
})

test('resolveTaskRoot follows taskRoot > mode > blend file > workspace', () => {
  const workspace = path.resolve('C:/work/session')
  assert.equal(resolveTaskRoot({ filePath: '', workspaceDir: workspace, taskRoot: 'C:/fixed' }).root, path.resolve('C:/fixed'))
  assert.equal(resolveTaskRoot({ filePath: 'C:/proj/a.blend', workspaceDir: workspace, taskRootMode: 'workspace' }).root, workspace)
  assert.equal(resolveTaskRoot({ filePath: 'C:/proj/a.blend', workspaceDir: workspace }).root, path.dirname(path.resolve('C:/proj/a.blend')))
  assert.equal(resolveTaskRoot({ filePath: '', workspaceDir: workspace }).root, workspace)
})

test('ensureTaskDir claims a marker, reuses its own, and never steals another session', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const first = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  assert.equal(first.created, true)
  assert.equal(first.name, '.dsh-blender-lamp')
  const markerRaw = await readFile(path.join(first.dir, MARKER_FILE), 'utf8')
  assert.match(markerRaw, /"sessionId": "s1"/)

  const again = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  assert.equal(again.created, false)
  assert.equal(again.dir, first.dir)

  const other = await ensureTaskDir({ root, task: 'lamp', sessionId: 's2' })
  assert.equal(other.created, true)
  assert.equal(other.name, '.dsh-blender-lamp-2')
})

test('an unmarked existing directory is treated as someone else data', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  await mkdir(path.join(root, '.dsh-blender-lamp'), { recursive: true })
  const claimed = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  assert.equal(claimed.name, '.dsh-blender-lamp-2')
})

test('listTaskDirs reports markers and snapshot counts without creating anything', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const listed = await listTaskDirs(root)
  assert.equal(listed.length, 1)
  assert.equal(listed[0].name, task.name)
  assert.equal(listed[0].marker?.sessionId, 's1')
  assert.equal(listed[0].snapshots, 0)
})

test('listSnapshots orders by numeric generation', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  for (const name of ['2-001.blend', '10-001.blend', '9-001.blend']) {
    await writeFile(path.join(task.dir, 'snapshots', name), 'x')
  }
  assert.deepEqual(await listSnapshots(task.dir), ['2-001.blend', '9-001.blend', '10-001.blend'])
})

test('isInsideTask stops at the directory boundary', () => {
  const taskDir = path.resolve('C:/proj/.dsh-blender-lamp')
  assert.equal(isInsideTask(path.join(taskDir, 'snapshots', '1-001.blend'), taskDir), true)
  assert.equal(isInsideTask(taskDir, taskDir), true)
  assert.equal(isInsideTask(path.resolve('C:/proj/other.blend'), taskDir), false)
  assert.equal(isInsideTask(path.join(taskDir, '..', 'other.blend'), taskDir), false)
})
