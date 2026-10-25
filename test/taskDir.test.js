/**
 * Task directory tests: slug, root selection, claiming and containment.
 */

import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  ensureTaskDir,
  findTaskDir,
  isInsideTask,
  listSnapshots,
  listTaskDirs,
  MARKER_FILE,
  parseSnapshotName,
  resolveTaskRoot,
  slugifyTaskName,
  taskDirName,
} from '../lib/taskDir.js'

test('slugifyTaskName keeps CJK and strips separators', () => {
  assert.equal(slugifyTaskName('灯 lamp/2'), '灯-lamp-2')
  assert.equal(slugifyTaskName('  '), 'task')
  assert.equal(slugifyTaskName('CON'), '_con')
  assert.equal(slugifyTaskName('Lamp'), slugifyTaskName('lamp'))
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

  const sameTaskDifferentCase = await ensureTaskDir({ root, task: 'LAMP', sessionId: 's1' })
  assert.equal(sameTaskDifferentCase.created, false)
  assert.equal(sameTaskDifferentCase.dir, first.dir)
})

test('an unmarked existing directory is treated as someone else data', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  await mkdir(path.join(root, '.dsh-blender-lamp'), { recursive: true })
  const claimed = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  assert.equal(claimed.name, '.dsh-blender-lamp-2')
})

test('findTaskDir finds an owned directory but never creates one', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  assert.equal(await findTaskDir({ root, task: 'lamp', sessionId: 's1' }), null)

  const first = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const found = await findTaskDir({ root, task: 'LAMP', sessionId: 's1' })
  assert.equal(found?.dir, first.dir)
  assert.equal(found?.created, false)
  assert.equal(await findTaskDir({ root, task: 'lamp', sessionId: 's2' }), null)

  const second = await ensureTaskDir({ root, task: 'lamp', sessionId: 's2' })
  const foundSecond = await findTaskDir({ root, task: 'lamp', sessionId: 's2' })
  assert.equal(foundSecond?.dir, second.dir)
  assert.equal(foundSecond?.name, '.dsh-blender-lamp-2')
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

test('listTaskDirs returns complete snapshot metadata', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  await writeFile(path.join(task.dir, 'snapshots', '2-000001.blend'), 'newer')
  await writeFile(path.join(task.dir, 'snapshots', '1-000001.blend'), 'old')
  const listed = await listTaskDirs(root)
  assert.equal(listed[0].snapshots, 2)
  assert.equal(listed[0].newestSnapshot, '2-000001.blend')
  assert.deepEqual(
    listed[0].snapshotDetails.map((snapshot) => [snapshot.name, snapshot.bytes]),
    [
      ['1-000001.blend', 3],
      ['2-000001.blend', 5],
    ],
  )
  for (const snapshot of listed[0].snapshotDetails) assert.match(snapshot.modifiedAt, /^\d{4}-\d{2}-\d{2}T/)
})

test('listSnapshots orders by numeric generation', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  for (const name of ['2-001.blend', '10-001.blend', '9-001.blend']) {
    await writeFile(path.join(task.dir, 'snapshots', name), 'x')
  }
  assert.deepEqual(await listSnapshots(task.dir), ['2-001.blend', '9-001.blend', '10-001.blend'])
})

test('parseSnapshotName reads both snapshot name shapes', () => {
  assert.deepEqual(parseSnapshotName('1-000002_final_261025-105402_s1.blend'), { turn: 1, seq: 2 })
  assert.deepEqual(parseSnapshotName('10-000010.blend'), { turn: 10, seq: 10 })
  assert.equal(parseSnapshotName('render-20260101000000000.png'), null)
  assert.equal(parseSnapshotName('notes.blend'), null)
})

test('snapshot names sort by the numeric prefix, not the label or stamp', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const task = await ensureTaskDir({ root, task: 'lamp', sessionId: 's1' })
  const names = [
    '2-000001_zzz_261025-105402_s1.blend',
    '1-000002_aaa_261024-090000_s2.blend',
    '1-000001_manual_261025-105402_s1.blend',
    '1-000001.blend',
  ]
  for (const name of names) await writeFile(path.join(task.dir, 'snapshots', name), 'x')
  assert.deepEqual(await listSnapshots(task.dir), [
    '1-000001.blend',
    '1-000001_manual_261025-105402_s1.blend',
    '1-000002_aaa_261024-090000_s2.blend',
    '2-000001_zzz_261025-105402_s1.blend',
  ])
})

test('isInsideTask resolves a directory link before deciding', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dsh-task-'))
  const outside = await mkdtemp(path.join(os.tmpdir(), 'dsh-outside-'))
  const taskDir = path.join(root, '.dsh-blender-lamp')
  await mkdir(taskDir, { recursive: true })
  try {
    await symlink(outside, path.join(taskDir, 'link'), 'junction')
  } catch {
    t.skip('creating a directory link is not permitted on this host')
    return
  }
  assert.equal(isInsideTask(path.join(taskDir, 'link', 'x.txt'), taskDir), false)
})

test('isInsideTask stops at the directory boundary', () => {
  const taskDir = path.resolve('C:/proj/.dsh-blender-lamp')
  assert.equal(isInsideTask(path.join(taskDir, 'snapshots', '1-001.blend'), taskDir), true)
  assert.equal(isInsideTask(taskDir, taskDir), true)
  assert.equal(isInsideTask(path.resolve('C:/proj/other.blend'), taskDir), false)
  assert.equal(isInsideTask(path.join(taskDir, '..', 'other.blend'), taskDir), false)
})
