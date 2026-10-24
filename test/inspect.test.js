/**
 * Queryable inspect: argument normalization, payload builder, reply bounding,
 * model-facing formatting, and the generated Python against a fake `bpy`.
 *
 * The Python half is the only place the query logic runs without Blender, so
 * it covers filters, paging, aggregation and every scope in one spawn. It is
 * skipped when no local Python 3.10+ interpreter is available.
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  boundInspectValue,
  formatInspect,
  INSPECT_INCLUDES,
  INSPECT_LIMIT_MAX,
  INSPECT_MAX_CHARS,
  INSPECT_SCOPES,
  inspectCode,
  normalizeInspectArgs,
} from '../lib/inspect.js'
import { findTestPython } from './support/testPython.js'

/**
 * Build a small but complete fake scene, then run every query payload.
 *
 * Data model: 3 meshes, 1 empty, 2 lights, 2 cameras; collections
 * `TJ_Library` (children `TJ_Detail`) and `Props`; one mesh outside every
 * collection; one hidden mesh; two materials (one node-based, one not).
 */
const DRIVER = `import json
import sys
import traceback
import types

queries_path = sys.argv[1]
out_path = sys.argv[2]


class FakeIDList(list):
    def get(self, name, default=None):
        for item in self:
            if item.name == name:
                return item
        return default


class FakeCollection:
    def __init__(self, name):
        self.name = name
        self.children = []
        self.objects = []
        self.hide_render = False

    @property
    def all_objects(self):
        found = list(self.objects)
        for child in self.children:
            found.extend(child.all_objects)
        return found


class FakeData:
    def __init__(self, name):
        self.name = name


class FakeMesh(FakeData):
    def __init__(self, name, vertices=0, polygons=0, materials=None):
        FakeData.__init__(self, name)
        self.vertices = [None] * vertices
        self.polygons = [None] * polygons
        self.materials = materials or []


class FakeModifier:
    def __init__(self, name, modifier_type):
        self.name = name
        self.type = modifier_type


class FakeObject:
    def __init__(self, name, object_type='MESH', data=None, collections=None):
        self.name = name
        self.type = object_type
        self.data = data
        self.users_collection = collections or []
        self.parent = None
        self.modifiers = []
        self.rotation_mode = 'XYZ'
        self.rotation_euler = (0.0, 0.0, 0.0)
        self.location = (0.0, 0.0, 0.0)
        self.scale = (1.0, 1.0, 1.0)
        self.dimensions = (1.0, 1.0, 1.0)
        self.hide_viewport = False
        self.hide_render = False


class FakeMaterial:
    def __init__(self, name, users, use_nodes, nodes=0):
        self.name = name
        self.users = users
        self.use_nodes = use_nodes
        self.node_tree = types.SimpleNamespace(nodes=[None] * nodes) if use_nodes else None


class FakeLight(FakeData):
    def __init__(self, name, light_type, energy, color):
        FakeData.__init__(self, name)
        self.type = light_type
        self.energy = energy
        self.color = color


class FakeCamera(FakeData):
    def __init__(self, name, camera_type='PERSP', lens=50.0, sensor_width=36.0, ortho_scale=10.0):
        FakeData.__init__(self, name)
        self.type = camera_type
        self.lens = lens
        self.sensor_width = sensor_width
        self.ortho_scale = ortho_scale


mesh_wall = FakeMesh('MeshWall', vertices=3, polygons=1)
mesh_hidden = FakeMesh('MeshHidden', vertices=8, polygons=6)
mesh_loose = FakeMesh('MeshLoose', vertices=1, polygons=0)
wood = FakeMaterial('Wood', 3, True, nodes=4)
metal = FakeMaterial('Metal', 1, False)
mesh_wall.materials = [wood]
mesh_hidden.materials = [metal, None]
point_light = FakeLight('Lamp', 'POINT', 100.0, (1.0, 0.8, 0.6))
sun_light = FakeLight('Sun', 'SUN', 3.0, (1.0, 1.0, 1.0))
camera_data = FakeCamera('CameraData')
ortho_data = FakeCamera('OrthoData', camera_type='ORTHO', ortho_scale=12.0)

library = FakeCollection('TJ_Library')
detail = FakeCollection('TJ_Detail')
props = FakeCollection('Props')
master = FakeCollection('Scene Collection')
library.children.append(detail)

root = FakeObject('TJ_Root', 'EMPTY', None, [library])
wall = FakeObject('TJ_Wall', 'MESH', mesh_wall, [library])
wall.parent = root
wall.location = (1.0, 2.0, 3.0)
wall.dimensions = (2.0, 1.0, 0.5)
wall.modifiers.append(FakeModifier('Bevel', 'BEVEL'))
hidden = FakeObject('TJ_Hidden', 'MESH', mesh_hidden, [detail])
hidden.hide_viewport = True
loose = FakeObject('Loose', 'MESH', mesh_loose, [])
lamp_a = FakeObject('Lamp_A', 'LIGHT', point_light, [props])
lamp_b = FakeObject('Lamp_B', 'LIGHT', sun_light, [props])
camera_object = FakeObject('Camera', 'CAMERA', camera_data, [master])
ortho_object = FakeObject('OrthoCam', 'CAMERA', ortho_data, [master])

library.objects.extend([root, wall])
detail.objects.append(hidden)
props.objects.extend([lamp_a, lamp_b])
master.objects.extend([camera_object, ortho_object])

scene = types.SimpleNamespace(name='Scene', collection=master, camera=camera_object)

bpy = types.ModuleType('bpy')
bpy.context = types.SimpleNamespace(scene=scene, mode='OBJECT')
bpy.data = types.SimpleNamespace(
    objects=FakeIDList([wall, root, hidden, loose, lamp_a, lamp_b, camera_object, ortho_object]),
    collections=FakeIDList([library, detail, props]),
    materials=FakeIDList([wood, metal]),
    lights=FakeIDList([point_light, sun_light]),
    cameras=FakeIDList([camera_data, ortho_data]),
)
sys.modules['bpy'] = bpy

if len(sys.argv) > 3 and sys.argv[3] == 'empty':
    bpy.data.objects = FakeIDList()
    bpy.data.collections = FakeIDList()
    bpy.data.materials = FakeIDList()
    bpy.data.lights = FakeIDList()
    bpy.data.cameras = FakeIDList()
    scene.camera = None
    scene.collection = types.SimpleNamespace(name='Scene Collection', objects=[])

with open(queries_path, 'r', encoding='utf-8') as handle:
    queries = json.load(handle)

answers = {}
for query in queries:
    namespace = {}
    try:
        exec(compile(query['code'], query['name'], 'exec'), namespace)
        value = namespace.get('result', {})
    except BaseException as exc:
        value = {'status': 'py-crash', 'error': repr(exc), 'traceback': traceback.format_exc()}
    answers[query['name']] = value

with open(out_path, 'w', encoding='utf-8') as handle:
    json.dump(answers, handle, default=str)
`

/**
 * @param {Record<string, unknown>[]} queries - named payloads
 * @param {'scene'|'empty'} [mode] - fake scene to build
 * @returns {Promise<Record<string, any>>} payload results by name
 */
async function runQueries(queries, mode = 'scene') {
  const python = await findTestPython()
  if (python === null) return {}
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'dsh-inspect-'))
  const driverPath = path.join(workDir, 'driver.py')
  const queriesPath = path.join(workDir, 'queries.json')
  const outPath = path.join(workDir, 'out.json')
  await writeFile(driverPath, DRIVER, 'utf8')
  await writeFile(queriesPath, JSON.stringify(queries), 'utf8')
  const run = spawnSync(python.command, [...python.args, driverPath, queriesPath, outPath, mode], { encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr || run.stdout)
  return JSON.parse(await readFile(outPath, 'utf8'))
}

test('inspect defaults to a bounded summary query', () => {
  assert.deepEqual(normalizeInspectArgs({}), {
    scope: 'summary',
    name: '',
    type: '',
    collection: '',
    collectionDeep: true,
    include: [],
    limit: 20,
    offset: 0,
  })
})

test('inspect normalizes its arguments', () => {
  const value = normalizeInspectArgs({
    scope: 'objects',
    name: 'TJ_*',
    type: 'mesh',
    collection: 'TJ_Library',
    collectionDeep: false,
    include: ['transform', 'transform', 'materials'],
    limit: 200,
    offset: 40,
  })
  assert.equal(value.name, 'TJ_*')
  assert.equal(value.type, 'MESH')
  assert.equal(value.collectionDeep, false)
  assert.deepEqual(value.include, ['transform', 'materials'])
  assert.equal(value.limit, INSPECT_LIMIT_MAX)
  assert.equal(value.offset, 40)
  assert.equal(normalizeInspectArgs({ scope: 'materials' }).limit, 50)
  assert.equal(normalizeInspectArgs({ type: ' mesh ' }).type, 'MESH')
  assert.equal(normalizeInspectArgs({ name: ' TJ ' }).name, ' TJ ', 'names are matched literally, without trimming')
})

test('inspect rejects bad arguments with readable messages', () => {
  const cases = [
    [{ scope: 'render' }, /scope must be one of: summary, objects, collections, materials, lights, cameras/],
    [{ include: 'transform' }, /include must be an array of:/],
    [{ include: ['transform', 'nope'] }, /include must be an array of:/],
    [{ limit: 0 }, /limit must be an integer between 1 and 200/],
    [{ limit: 201 }, /limit must be an integer between 1 and 200/],
    [{ limit: 1.5 }, /limit must be an integer between 1 and 200/],
    [{ offset: -1 }, /offset must be an integer >= 0/],
    [{ offset: 1.5 }, /offset must be an integer >= 0/],
    [{ collectionDeep: 'yes' }, /collectionDeep must be a boolean/],
    [{ name: 5 }, /name must be a string/],
    [{ type: 5 }, /type must be a string/],
    [{ collection: 5 }, /collection must be a string/],
  ]
  for (const [args, pattern] of cases) {
    assert.throws(() => normalizeInspectArgs(args), /** @type {RegExp} */ (pattern))
  }
})

test('inspect embeds its normalized arguments and picks the scope body', () => {
  const code = inspectCode({ scope: 'objects', name: 'TJ_*', include: ['transform'], limit: 5, offset: 2 })
  assert.match(code, /_dsh_inspect_params = json\.loads\(base64\.b64decode\('/)
  const encoded = /b64decode\('([A-Za-z0-9+/=]+)'\)/.exec(code)?.[1]
  assert.ok(encoded)
  assert.deepEqual(JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')), {
    scope: 'objects',
    name: 'TJ_*',
    type: '',
    collection: '',
    collectionDeep: true,
    include: ['transform'],
    limit: 5,
    offset: 2,
  })
  assert.match(code, /_matches_object/)
  for (const scope of INSPECT_SCOPES) {
    const scoped = inspectCode({ scope })
    assert.match(scoped, /result = \{/)
    if (scope === 'materials') assert.match(scoped, /bpy\.data\.materials/)
    if (scope === 'collections') assert.match(scoped, /\.children/)
    if (scope === 'lights') assert.match(scoped, /bpy\.data\.lights/)
    if (scope === 'cameras') assert.match(scoped, /bpy\.data\.cameras/)
    if (scope === 'objects' || scope === 'summary') assert.match(scoped, /_page\(_matched\)/)
  }
})

test('inspect trims an oversized reply and keeps the paging honest', () => {
  const items = Array.from({ length: 200 }, (_, index) => ({
    name: `Object_${String(index).padStart(4, '0')}`,
    type: 'MESH',
    collections: ['TJ_Library'],
    padding: 'x'.repeat(400),
  }))
  const value = {
    scope: 'objects',
    scene: 'Scene',
    totalObjects: 3174,
    applied: {},
    paging: { totalMatched: 3174, returned: 200, offset: 0, nextOffset: 200, truncated: true },
    items,
  }
  const bounded = /** @type {Record<string, any>} */ (boundInspectValue(value))
  assert.ok(Buffer.byteLength(JSON.stringify(bounded), 'utf8') <= INSPECT_MAX_CHARS)
  assert.ok(bounded.items.length < 200)
  assert.equal(bounded.paging.returned, bounded.items.length)
  assert.equal(bounded.paging.nextOffset, bounded.items.length)
  assert.equal(bounded.paging.truncated, true)
  assert.match(String(bounded.hint), /trimmed/)
  assert.equal(value.items.length, 200, 'the original value must not be mutated')
})

test('inspect leaves a small reply untouched', () => {
  const value = {
    scope: 'objects',
    scene: 'Scene',
    totalObjects: 2,
    applied: {},
    paging: { totalMatched: 2, returned: 2, offset: 0, nextOffset: null, truncated: false },
    items: [{ name: 'A', type: 'MESH' }, { name: 'B', type: 'MESH' }],
  }
  const bounded = /** @type {Record<string, any>} */ (boundInspectValue(value))
  assert.deepEqual(bounded, value)
  assert.equal(Object.hasOwn(bounded, 'hint'), false)
})

test('inspect trims the collection list when the summary itself is oversized', () => {
  const top = Array.from({ length: 120 }, (_, index) => ({
    name: `Collection_${String(index).padStart(3, '0')}`,
    objects: 1,
    recursive: 1,
    padding: 'y'.repeat(600),
  }))
  const value = {
    scope: 'summary',
    scene: 'Scene',
    totalObjects: 2,
    applied: {},
    summary: {
      typeCounts: { MESH: 2 },
      collections: { total: 50, master: 0, unassigned: 0, top },
      materials: 0,
      lights: 0,
      cameras: 0,
    },
    paging: { totalMatched: 2, returned: 0, offset: 0, nextOffset: null, truncated: false },
    items: [],
  }
  const bounded = /** @type {Record<string, any>} */ (boundInspectValue(value))
  assert.ok(Buffer.byteLength(JSON.stringify(bounded), 'utf8') <= INSPECT_MAX_CHARS)
  assert.ok(bounded.summary.collections.top.length < 120)
  assert.ok(bounded.summary.collections.top.length > 0)
  assert.equal(bounded.summary.collections.budgetTrimmed, true)
  assert.match(String(bounded.hint), /collection list was trimmed/)
  assert.equal(value.summary.collections.top.length, 120, 'the original value must not be mutated')
})

test('inspect keeps truncated consistent when trimming removes the whole page', () => {
  const value = {
    scope: 'objects',
    scene: 'Scene',
    totalObjects: 1,
    applied: {},
    paging: { totalMatched: 1, returned: 1, offset: 0, nextOffset: null, truncated: false },
    items: [{ name: 'Huge', type: 'MESH', padding: 'z'.repeat(70000) }],
  }
  const bounded = /** @type {Record<string, any>} */ (boundInspectValue(value))
  assert.equal(bounded.items.length, 0)
  assert.equal(bounded.paging.returned, 0)
  assert.equal(bounded.paging.nextOffset, null)
  assert.equal(bounded.paging.truncated, false)
  assert.match(String(bounded.hint), /fewer fields/)
})

test('inspect renders a summary as compact lines', () => {
  const text = formatInspect({
    scope: 'summary',
    scene: 'Scene',
    totalObjects: 3174,
    applied: { name: 'TJ_*' },
    summary: {
      typeCounts: { MESH: 3120, LIGHT: 27, CAMERA: 1, EMPTY: 26 },
      collections: {
        total: 41,
        master: 3,
        unassigned: 0,
        top: [{ name: 'TJ_Library', objects: 812, recursive: 980, children: 3 }],
      },
      materials: 72,
      lights: 27,
      cameras: 1,
    },
    paging: { totalMatched: 3174, returned: 20, offset: 0, nextOffset: 20, truncated: true },
    items: [{ name: 'TJ_Wall_01', type: 'MESH' }],
    hint: 'showing 20 of 3174 from offset 0; pass offset=20 for the next page',
  })
  assert.match(text, /^Scene: Scene · 3174 objects/)
  assert.match(text, /Types: CAMERA 1, EMPTY 26, LIGHT 27, MESH 3120/)
  assert.match(text, /Collections: 41 \(master 3, unassigned 0\) · TJ_Library 812\/980/)
  assert.match(text, /Materials: 72 · Lights: 27 · Cameras: 1/)
  assert.match(text, /Sample objects \(20 of 3174, offset 0\) — more available:/)
  assert.match(text, /- TJ_Wall_01 \[MESH\]/)
  assert.match(text, /Filters: name="TJ_\*"/)
  assert.match(text, /Hint: showing 20 of 3174/)
  assert.ok(text.split('\n').length <= 10)
})

test('inspect renders object fields, errors and unknown shapes', () => {
  const text = formatInspect({
    scope: 'objects',
    scene: 'Scene',
    totalObjects: 8,
    applied: { type: 'MESH' },
    paging: { totalMatched: 1, returned: 1, offset: 0, nextOffset: null, truncated: false },
    items: [
      {
        name: 'TJ_Wall',
        type: 'MESH',
        collections: ['TJ_Library'],
        parent: 'TJ_Root',
        data: 'MeshWall',
        modifiers: ['BEVEL'],
        materials: ['Wood'],
        meshStats: { vertices: 1200, polygons: 800 },
        transform: { location: [1, 2, 3], scale: [1, 1, 1] },
        bounds: { dimensions: [2, 1, 0.5] },
        visibility: { viewport: false, render: true },
      },
    ],
  })
  assert.match(text, /- TJ_Wall \[MESH\] in TJ_Library parent=TJ_Root data=MeshWall mods=BEVEL mats=Wood v=1200 f=800 loc=\(1,2,3\) scale=\(1,1,1\) dim=\(2,1,0.5\) hidden/)

  assert.equal(formatInspect({ status: 'error', error: { message: 'boom' } }), 'Inspect failed: boom')
  assert.match(formatInspect({ unexpected: true }), /"unexpected": true/)
})

test('the generated payload answers every scope against a fake scene', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const queries = [
    { name: 'summary', code: inspectCode({}) },
    { name: 'summary-filtered', code: inspectCode({ name: 'TJ_*', limit: 2 }) },
    { name: 'objects-name', code: inspectCode({ scope: 'objects', name: 'TJ_*' }) },
    { name: 'objects-type', code: inspectCode({ scope: 'objects', type: 'mesh', include: ['collections'] }) },
    { name: 'objects-deep', code: inspectCode({ scope: 'objects', collection: 'TJ_Library' }) },
    { name: 'objects-shallow', code: inspectCode({ scope: 'objects', collection: 'TJ_Library', collectionDeep: false }) },
    { name: 'objects-master-collection', code: inspectCode({ scope: 'objects', collection: 'Scene Collection', collectionDeep: false }) },
    { name: 'objects-missing', code: inspectCode({ scope: 'objects', collection: 'Nope' }) },
    { name: 'objects-paging', code: inspectCode({ scope: 'objects', limit: 2, offset: 1 }) },
    { name: 'objects-past-end', code: inspectCode({ scope: 'objects', limit: 5, offset: 99 }) },
    {
      name: 'objects-include',
      code: inspectCode({ scope: 'objects', name: 'TJ_Wall', include: [...INSPECT_INCLUDES] }),
    },
    {
      name: 'objects-include-empty',
      code: inspectCode({ scope: 'objects', name: 'TJ_Root', include: ['parent', 'materials', 'meshStats', 'data', 'collections'] }),
    },
    { name: 'materials', code: inspectCode({ scope: 'materials', type: 'MESH' }) },
    { name: 'materials-filtered', code: inspectCode({ scope: 'materials', name: 'W*' }) },
    { name: 'lights', code: inspectCode({ scope: 'lights' }) },
    { name: 'lights-filtered', code: inspectCode({ scope: 'lights', name: 'Sun' }) },
    { name: 'cameras', code: inspectCode({ scope: 'cameras' }) },
    { name: 'cameras-filtered', code: inspectCode({ scope: 'cameras', name: 'Ortho*' }) },
    { name: 'collections', code: inspectCode({ scope: 'collections' }) },
    { name: 'summary-limit', code: inspectCode({ scope: 'summary', limit: 2 }) },
  ]
  const answers = await runQueries(queries)
  for (const query of queries) {
    assert.equal(answers[query.name]?.status, undefined, `${query.name} crashed: ${JSON.stringify(answers[query.name])}`)
  }

  const summary = answers.summary
  assert.equal(summary.scope, 'summary')
  assert.equal(summary.scene, 'Scene')
  assert.equal(summary.totalObjects, 8)
  assert.deepEqual(summary.applied, {})
  assert.deepEqual(summary.summary.typeCounts, { MESH: 3, EMPTY: 1, LIGHT: 2, CAMERA: 2 })
  assert.equal(summary.summary.collections.total, 3)
  assert.equal(summary.summary.collections.master, 2)
  assert.equal(summary.summary.collections.unassigned, 1)
  assert.deepEqual(summary.summary.collections.top.map((/** @type {any} */ row) => row.name), ['TJ_Library', 'Props', 'TJ_Detail'])
  assert.equal(summary.summary.collections.top[0].recursive, 3)
  assert.equal(summary.summary.collections.top[0].objects, 2)
  assert.equal(summary.summary.materials, 2)
  assert.equal(summary.summary.lights, 2)
  assert.equal(summary.summary.cameras, 2)
  assert.deepEqual(summary.paging, { totalMatched: 8, returned: 8, offset: 0, nextOffset: null, truncated: false })
  assert.equal(summary.items.length, 8)
  assert.deepEqual(Object.keys(summary.items[0]).sort(), ['name', 'type'])
  assert.equal(summary.hint, undefined)

  const filtered = answers['summary-filtered']
  assert.deepEqual(filtered.applied, { name: 'TJ_*' })
  assert.deepEqual(filtered.summary.typeCounts, { MESH: 2, EMPTY: 1 })
  assert.deepEqual(filtered.paging, { totalMatched: 3, returned: 2, offset: 0, nextOffset: 2, truncated: true })
  assert.match(filtered.hint, /pass offset=2 for the next page/)

  const byName = answers['objects-name']
  assert.deepEqual(byName.items.map((/** @type {any} */ item) => item.name), ['TJ_Hidden', 'TJ_Root', 'TJ_Wall'])

  const byType = answers['objects-type']
  assert.deepEqual(byType.applied, { type: 'MESH' })
  assert.deepEqual(byType.items.map((/** @type {any} */ item) => item.name), ['Loose', 'TJ_Hidden', 'TJ_Wall'])
  assert.deepEqual(byType.items[2].collections, ['TJ_Library'])

  assert.deepEqual(answers['objects-deep'].items.map((/** @type {any} */ item) => item.name), ['TJ_Hidden', 'TJ_Root', 'TJ_Wall'])
  assert.deepEqual(answers['objects-shallow'].items.map((/** @type {any} */ item) => item.name), ['TJ_Root', 'TJ_Wall'])
  assert.equal(answers['objects-shallow'].applied.collectionDeep, false)

  const missing = answers['objects-missing']
  assert.equal(missing.paging.totalMatched, 0)
  assert.match(missing.hint, /no match/)
  assert.match(missing.hint, /scene types: .*MESH 3/)
  assert.match(missing.hint, /collections: Props, TJ_Detail, TJ_Library/)

  const paging = answers['objects-paging']
  assert.deepEqual(paging.paging, { totalMatched: 8, returned: 2, offset: 1, nextOffset: 3, truncated: true })
  assert.deepEqual(paging.items.map((/** @type {any} */ item) => item.name), ['Lamp_A', 'Lamp_B'])

  const pastEnd = answers['objects-past-end']
  assert.deepEqual(pastEnd.paging, { totalMatched: 8, returned: 0, offset: 99, nextOffset: null, truncated: false })
  assert.match(pastEnd.hint, /offset 99 is past the end \(8 matched\)/)

  const included = answers['objects-include'].items[0]
  assert.equal(included.name, 'TJ_Wall')
  assert.equal(included.parent, 'TJ_Root')
  assert.deepEqual(included.collections, ['TJ_Library'])
  assert.deepEqual(included.modifiers, ['BEVEL'])
  assert.deepEqual(included.materials, ['Wood'])
  assert.deepEqual(included.meshStats, { vertices: 3, polygons: 1 })
  assert.deepEqual(included.transform.location, [1, 2, 3])
  assert.deepEqual(included.bounds.dimensions, [2, 1, 0.5])
  assert.deepEqual(included.visibility, { viewport: true, render: true })
  assert.equal(included.data, 'MeshWall')

  const emptyInclude = answers['objects-include-empty'].items[0]
  assert.equal(emptyInclude.name, 'TJ_Root')
  assert.equal(emptyInclude.parent, null)
  assert.deepEqual(emptyInclude.materials, [])
  assert.equal(emptyInclude.meshStats, null)
  assert.equal(emptyInclude.data, null)
  assert.deepEqual(emptyInclude.collections, ['TJ_Library'])

  const masterCollection = answers['objects-master-collection']
  assert.equal(masterCollection.applied.collection, 'Scene Collection')
  assert.deepEqual(masterCollection.items.map((/** @type {any} */ item) => item.name), ['Camera', 'OrthoCam'])

  const limited = answers['summary-limit']
  assert.equal(limited.items.length, 2)
  assert.equal(limited.summary.collections.top.length, 3, 'the aggregate is not paged by limit')

  const hidden = /** @type {any} */ (await runQueries([{ name: 'hidden', code: inspectCode({ scope: 'objects', name: 'TJ_Hidden', include: ['visibility'] }) }])).hidden
  assert.deepEqual(hidden.items[0].visibility, { viewport: false, render: true })

  const materials = answers.materials
  assert.deepEqual(materials.applied, {})
  assert.deepEqual(materials.items, [
    { name: 'Metal', users: 1, nodes: 0 },
    { name: 'Wood', users: 3, nodes: 4 },
  ])

  assert.deepEqual(answers.lights.items, [
    { name: 'Lamp', type: 'POINT', energy: 100, color: [1, 0.8, 0.6] },
    { name: 'Sun', type: 'SUN', energy: 3, color: [1, 1, 1] },
  ])
  assert.deepEqual(answers['materials-filtered'].items.map((/** @type {any} */ item) => item.name), ['Wood'])
  assert.deepEqual(answers['lights-filtered'].items.map((/** @type {any} */ item) => item.name), ['Sun'])

  assert.deepEqual(answers.cameras.items, [
    { name: 'CameraData', type: 'PERSP', lens: 50, sensorWidth: 36, isSceneCamera: true },
    { name: 'OrthoData', type: 'ORTHO', lens: 50, sensorWidth: 36, isSceneCamera: false, orthoScale: 12 },
  ])
  assert.deepEqual(answers['cameras-filtered'].items.map((/** @type {any} */ item) => item.name), ['OrthoData'])

  assert.deepEqual(answers.collections.items.map((/** @type {any} */ row) => row.name), ['TJ_Library', 'Props', 'TJ_Detail'])
  assert.equal(answers.collections.items[0].recursive, 3)
  assert.equal(answers.collections.items[0].children, 1)
  assert.equal(answers.collections.items[0].hideRender, false)
})

test('the generated payload survives an empty scene', async (t) => {
  const python = await findTestPython()
  if (python === null) {
    t.skip('no Python interpreter found')
    return
  }
  const queries = [
    { name: 'summary', code: inspectCode({}) },
    { name: 'objects', code: inspectCode({ scope: 'objects' }) },
    { name: 'collections', code: inspectCode({ scope: 'collections' }) },
    { name: 'materials', code: inspectCode({ scope: 'materials' }) },
    { name: 'lights', code: inspectCode({ scope: 'lights' }) },
    { name: 'cameras', code: inspectCode({ scope: 'cameras' }) },
  ]
  const answers = await runQueries(queries, 'empty')
  for (const query of queries) {
    assert.equal(answers[query.name]?.status, undefined, `${query.name} crashed: ${JSON.stringify(answers[query.name])}`)
  }

  const summary = answers.summary
  assert.equal(summary.scene, 'Scene')
  assert.equal(summary.totalObjects, 0)
  assert.deepEqual(summary.summary.typeCounts, {})
  assert.deepEqual(summary.summary.collections, { total: 0, unassigned: 0, master: 0, top: [] })
  assert.equal(summary.summary.materials, 0)
  assert.equal(summary.summary.lights, 0)
  assert.equal(summary.summary.cameras, 0)
  assert.deepEqual(summary.paging, { totalMatched: 0, returned: 0, offset: 0, nextOffset: null, truncated: false })
  assert.deepEqual(summary.items, [])
  assert.equal(summary.hint, undefined)

  for (const name of ['objects', 'collections', 'materials', 'lights', 'cameras']) {
    assert.deepEqual(answers[name].items, [], name)
    assert.equal(answers[name].paging.totalMatched, 0, name)
    assert.equal(answers[name].paging.truncated, false, name)
    assert.equal(answers[name].hint, undefined, name)
  }
})
