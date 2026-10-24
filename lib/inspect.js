/**
 * Queryable, read-only scene inspection.
 *
 * `blender_mcp_inspect` used to return the first 200 objects no matter what was
 * asked. This module turns it into a scoped query: pick a `scope`, filter by
 * name/type/collection, page with `limit`/`offset`, and ask for extra per-object
 * fields with `include`. It is pure — no transport, no files — so the payload
 * builder and the model-facing formatter can be tested offline.
 *
 * The Python payload carries its arguments as base64(JSON): the add-on's socket
 * only accepts one `code` string, and encoding avoids the quoting and escaping
 * bugs that come with pasting Python literals.
 *
 * @module lib/inspect
 */

/**
 * Scopes accepted by `blender_mcp_inspect`.
 *
 * @typedef {'summary'|'objects'|'collections'|'materials'|'lights'|'cameras'} InspectScope
 */

/**
 * Extra per-object fields accepted by `include`.
 *
 * @typedef {'transform'|'bounds'|'materials'|'modifiers'|'meshStats'|'parent'|'collections'|'visibility'|'data'} InspectInclude
 */

/** @type {readonly InspectScope[]} */
export const INSPECT_SCOPES = ['summary', 'objects', 'collections', 'materials', 'lights', 'cameras']

/** @type {readonly InspectInclude[]} */
export const INSPECT_INCLUDES = [
  'transform',
  'bounds',
  'materials',
  'modifiers',
  'meshStats',
  'parent',
  'collections',
  'visibility',
  'data',
]

/** Largest page accepted in one call. */
export const INSPECT_LIMIT_MAX = 200

/** Reply budget in bytes; the transport cap (200k) is far above this. */
export const INSPECT_MAX_CHARS = 60000

/**
 * Default page size per scope.
 *
 * @type {Record<InspectScope, number>}
 */
export const INSPECT_DEFAULT_LIMIT = { summary: 20, objects: 20, collections: 20, materials: 50, lights: 50, cameras: 50 }

/**
 * Model-facing section title per scope.
 *
 * @type {Record<InspectScope, string>}
 */
const INSPECT_TITLES = {
  summary: 'Sample objects',
  objects: 'Objects',
  collections: 'Collections',
  materials: 'Materials',
  lights: 'Lights',
  cameras: 'Cameras',
}

/**
 * @typedef {object} InspectParams
 * @property {InspectScope} scope - which domain to read
 * @property {string} name - glob for the item name, empty for no filter
 * @property {string} type - upper-case object type filter, empty for no filter
 * @property {string} collection - collection name filter, empty for no filter
 * @property {boolean} collectionDeep - include objects in child collections
 * @property {InspectInclude[]} include - extra per-object fields
 * @property {number} limit - page size
 * @property {number} offset - items to skip
 */

/**
 * Validate and normalize `blender_mcp_inspect` arguments.
 *
 * `defineTool` already enforces the declared schema for tool calls; this runs
 * again so direct callers (tests, diagnostics) get the same guarantees. Bad
 * arguments throw before anything reaches Blender.
 *
 * @param {unknown} args - raw tool arguments
 * @returns {InspectParams} normalized parameters
 */
export function normalizeInspectArgs(args) {
  const record = isRecord(args) ? args : {}
  const scope = normalizeScope(record.scope)
  const name = optionalString(record.name, 'name')
  const type = optionalString(record.type, 'type').trim().toUpperCase()
  const collection = optionalString(record.collection, 'collection')
  const collectionDeep = normalizeCollectionDeep(record.collectionDeep)
  const include = normalizeInclude(record.include)
  const limit = normalizeLimit(record.limit, scope)
  const offset = normalizeOffset(record.offset)
  return { scope, name, type, collection, collectionDeep, include, limit, offset }
}

/**
 * Build the read-only Python payload for one normalized query.
 *
 * @param {unknown} params - arguments, normalized here
 * @returns {string} Python snippet that assigns `result`
 */
export function inspectCode(params) {
  const normalized = normalizeInspectArgs(params)
  const encoded = Buffer.from(JSON.stringify(normalized), 'utf8').toString('base64')
  return `${PAYLOAD_HEAD}${encoded}${PAYLOAD_SETUP}${SCOPE_BODIES[normalized.scope]}${PAYLOAD_TAIL}`
}

/**
 * Keep one reply inside the budget by dropping page items (then collection rows).
 *
 * The original value is not mutated: the copy carries `paging` and optionally
 * `summary` with trimmed tails, plus a hint that says where to resume.
 *
 * @param {unknown} value - payload result
 * @returns {unknown} bounded value
 */
export function boundInspectValue(value) {
  if (!isRecord(value)) return value
  const copy = /** @type {Record<string, unknown>} */ ({ ...value })
  const items = Array.isArray(value.items) ? [...value.items] : []
  copy.items = items
  const paging = isRecord(value.paging) ? /** @type {Record<string, unknown>} */ ({ ...value.paging }) : {}
  copy.paging = paging

  let trimmedItems = false
  while (items.length > 0 && replyBytes(copy) > INSPECT_MAX_CHARS) {
    items.pop()
    trimmedItems = true
  }
  if (trimmedItems) noteTrim(copy, paging, items.length)

  if (replyBytes(copy) > INSPECT_MAX_CHARS) {
    const summary = isRecord(copy.summary) ? /** @type {Record<string, unknown>} */ ({ ...copy.summary }) : null
    const collections = summary !== null && isRecord(summary.collections) ? /** @type {Record<string, unknown>} */ ({ ...summary.collections }) : null
    if (summary !== null && collections !== null && Array.isArray(collections.top)) {
      const top = [...collections.top]
      while (top.length > 0 && replyBytes(withTopRows(copy, summary, collections, top)) > INSPECT_MAX_CHARS) {
        top.pop()
        collections.budgetTrimmed = true
      }
      collections.top = top
      summary.collections = collections
      copy.summary = summary
      if (collections.budgetTrimmed === true && typeof copy.hint !== 'string') {
        copy.hint = 'the collection list was trimmed to stay inside the reply budget'
      }
    }
  }
  return copy
}

/**
 * Model-facing text for one inspect result.
 *
 * One line per item keeps the reply readable in a 3,000-object scene; unknown
 * shapes fall back to JSON so a future field never breaks the render.
 *
 * @param {unknown} value - inspect value
 * @returns {string} model-facing summary
 */
export function formatInspect(value) {
  if (!isRecord(value)) return JSON.stringify(value, null, 2)
  if (value.status === 'error') {
    const error = isRecord(value.error) ? value.error : {}
    return `Inspect failed: ${typeof error.message === 'string' ? error.message : 'unknown error'}`
  }
  const scope = typeof value.scope === 'string' ? value.scope : ''
  if (!isInspectScope(scope)) return JSON.stringify(value, null, 2)

  const paging = isRecord(value.paging) ? value.paging : {}
  const items = Array.isArray(value.items) ? value.items : []
  const scene = typeof value.scene === 'string' ? value.scene : ''
  const totalObjects = typeof value.totalObjects === 'number' ? value.totalObjects : 0
  const lines = [`Scene: ${scene} · ${String(totalObjects)} objects`]

  if (scope === 'summary') {
    const summary = isRecord(value.summary) ? value.summary : {}
    const types = formatTypeCounts(summary.typeCounts)
    if (types !== '') lines.push(`Types: ${types}`)
    const collections = isRecord(summary.collections) ? summary.collections : {}
    lines.push(formatCollectionSummary(collections))
    lines.push(
      `Materials: ${String(numberOr(summary.materials))} · Lights: ${String(numberOr(summary.lights))} · Cameras: ${String(numberOr(summary.cameras))}`,
    )
  }

  const returned = numberOr(paging.returned)
  const totalMatched = numberOr(paging.totalMatched)
  const offset = numberOr(paging.offset)
  const more = paging.truncated === true ? ' — more available' : ''
  lines.push(`${INSPECT_TITLES[scope]} (${String(returned)} of ${String(totalMatched)}, offset ${String(offset)})${more}:`)
  for (const item of items) lines.push(`  - ${formatItem(scope, item)}`)

  const applied = isRecord(value.applied) ? value.applied : {}
  const appliedKeys = Object.keys(applied).sort()
  if (appliedKeys.length > 0) {
    const pairs = appliedKeys.map((key) => `${key}=${JSON.stringify(applied[key])}`)
    lines.push(`Filters: ${pairs.join(', ')}`)
  }
  if (typeof value.hint === 'string' && value.hint !== '') lines.push(`Hint: ${value.hint}`)
  return lines.join('\n')
}

/**
 * @param {unknown} value - candidate
 * @returns {value is Record<string, unknown>} plain-object test
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * @param {string} value - candidate
 * @returns {value is InspectScope} whether it is a known scope
 */
function isInspectScope(value) {
  return /** @type {readonly string[]} */ (INSPECT_SCOPES).includes(value)
}

/**
 * @param {unknown} value - candidate
 * @returns {InspectScope} normalized scope
 */
function normalizeScope(value) {
  if (value === undefined) return 'summary'
  if (typeof value !== 'string' || !isInspectScope(value)) {
    throw new Error(`scope must be one of: ${INSPECT_SCOPES.join(', ')}.`)
  }
  return value
}

/**
 * Names are taken literally: trimming would make a Blender name with leading
 * or trailing spaces impossible to match.
 *
 * @param {unknown} value - candidate
 * @param {string} field - argument name for the message
 * @returns {string} raw string or empty
 */
function optionalString(value, field) {
  if (value === undefined) return ''
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`)
  return value
}

/**
 * @param {unknown} value - candidate
 * @returns {boolean} deep-collection flag
 */
function normalizeCollectionDeep(value) {
  if (value === undefined) return true
  if (typeof value !== 'boolean') throw new Error('collectionDeep must be a boolean.')
  return value
}

/**
 * @param {unknown} value - candidate
 * @returns {InspectInclude[]} de-duplicated include list
 */
function normalizeInclude(value) {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new Error(`include must be an array of: ${INSPECT_INCLUDES.join(', ')}.`)
  /** @type {InspectInclude[]} */
  const include = []
  for (const entry of value) {
    if (typeof entry !== 'string' || !/** @type {readonly string[]} */ (INSPECT_INCLUDES).includes(entry)) {
      throw new Error(`include must be an array of: ${INSPECT_INCLUDES.join(', ')}.`)
    }
    if (!include.includes(/** @type {InspectInclude} */ (entry))) include.push(/** @type {InspectInclude} */ (entry))
  }
  return include
}

/**
 * @param {unknown} value - candidate
 * @param {InspectScope} scope - scope whose default applies
 * @returns {number} page size
 */
function normalizeLimit(value, scope) {
  if (value === undefined) return INSPECT_DEFAULT_LIMIT[scope]
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > INSPECT_LIMIT_MAX) {
    throw new Error(`limit must be an integer between 1 and ${String(INSPECT_LIMIT_MAX)}.`)
  }
  return value
}

/**
 * @param {unknown} value - candidate
 * @returns {number} items to skip
 */
function normalizeOffset(value) {
  if (value === undefined) return 0
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error('offset must be an integer >= 0.')
  }
  return value
}

/**
 * @param {Record<string, unknown>} copy - value being trimmed
 * @param {Record<string, unknown>} paging - its paging block
 * @param {number} returned - items left after trimming
 * @returns {void}
 */
function noteTrim(copy, paging, returned) {
  const offset = typeof paging.offset === 'number' ? paging.offset : 0
  const totalMatched = typeof paging.totalMatched === 'number' ? paging.totalMatched : null
  paging.returned = returned
  if (returned > 0) {
    const next = offset + returned
    paging.nextOffset = totalMatched !== null && next >= totalMatched ? null : next
    paging.truncated = paging.nextOffset !== null
    copy.hint = `the reply was trimmed to stay inside the reply budget; resume from offset ${String(next)}`
    return
  }
  paging.nextOffset = null
  paging.truncated = false
  copy.hint = 'the reply was too large for the budget; ask for fewer fields (include) or a smaller limit'
}

/**
 * @param {Record<string, unknown>} copy - value being trimmed
 * @param {Record<string, unknown>} summary - its summary block
 * @param {Record<string, unknown>} collections - its collection block
 * @param {unknown[]} top - candidate collection rows
 * @returns {Record<string, unknown>} candidate value
 */
function withTopRows(copy, summary, collections, top) {
  return { ...copy, summary: { ...summary, collections: { ...collections, top } } }
}

/**
 * @param {unknown} value - JSON-serializable value
 * @returns {number} UTF-8 byte size
 */
function replyBytes(value) {
  return Buffer.byteLength(JSON.stringify(value), 'utf8')
}

/**
 * @param {unknown} value - candidate number
 * @returns {number} finite number or 0
 */
function numberOr(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/**
 * @param {unknown} value - candidate type counts
 * @returns {string} `MESH 3120, LIGHT 27`
 */
function formatTypeCounts(value) {
  if (!isRecord(value)) return ''
  return Object.keys(value)
    .sort()
    .map((key) => `${key} ${String(numberOr(value[key]))}`)
    .join(', ')
}

/**
 * @param {Record<string, unknown>} collections - summary collection block
 * @returns {string} one readable line
 */
function formatCollectionSummary(collections) {
  const top = Array.isArray(collections.top) ? collections.top : []
  const entries = top
    .filter((entry) => isRecord(entry))
    .map((entry) => {
      const row = /** @type {Record<string, unknown>} */ (entry)
      return `${String(row.name)} ${String(numberOr(row.objects))}/${String(numberOr(row.recursive))}`
    })
  const head = `Collections: ${String(numberOr(collections.total))} (master ${String(numberOr(collections.master))}, unassigned ${String(numberOr(collections.unassigned))})`
  return entries.length > 0 ? `${head} · ${entries.join(' · ')}` : head
}

/**
 * @param {InspectScope} scope - current scope
 * @param {unknown} item - one page entry
 * @returns {string} one compact line
 */
function formatItem(scope, item) {
  if (!isRecord(item)) return JSON.stringify(item)
  switch (scope) {
    case 'summary':
    case 'objects':
      return formatObjectItem(item)
    case 'collections':
      return [
        String(item.name),
        `objects=${String(numberOr(item.objects))}`,
        `recursive=${String(numberOr(item.recursive))}`,
        `children=${String(numberOr(item.children))}`,
        item.hideRender === true ? 'render-off' : '',
      ]
        .filter((part) => part !== '')
        .join(' ')
    case 'materials':
      return `${String(item.name)} users=${String(numberOr(item.users))} nodes=${String(numberOr(item.nodes))}`
    case 'lights':
      return `${String(item.name)} [${String(item.type)}] energy=${formatNumber(item.energy)} color=${formatVector(item.color)}`
    case 'cameras':
      return [
        String(item.name),
        `[${String(item.type)}]`,
        `lens=${formatNumber(item.lens)}`,
        `sensor=${formatNumber(item.sensorWidth)}`,
        item.isSceneCamera === true ? 'scene-camera' : '',
        typeof item.orthoScale === 'number' ? `ortho=${formatNumber(item.orthoScale)}` : '',
      ]
        .filter((part) => part !== '')
        .join(' ')
    default:
      return JSON.stringify(item)
  }
}

/**
 * @param {Record<string, unknown>} item - object entry
 * @returns {string} one compact line
 */
function formatObjectItem(item) {
  const parts = [String(item.name), `[${String(item.type)}]`]
  const collections = formatList(item.collections)
  if (collections !== '') parts.push(`in ${collections}`)
  if (typeof item.parent === 'string') parts.push(`parent=${item.parent}`)
  if (typeof item.data === 'string') parts.push(`data=${item.data}`)
  const modifiers = formatList(item.modifiers)
  if (modifiers !== '') parts.push(`mods=${modifiers}`)
  const materials = formatList(item.materials)
  if (materials !== '') parts.push(`mats=${materials}`)
  if (isRecord(item.meshStats)) {
    parts.push(`v=${formatNumber(item.meshStats.vertices)} f=${formatNumber(item.meshStats.polygons)}`)
  }
  if (isRecord(item.transform)) {
    parts.push(`loc=${formatVector(item.transform.location)} scale=${formatVector(item.transform.scale)}`)
  }
  if (isRecord(item.bounds)) parts.push(`dim=${formatVector(item.bounds.dimensions)}`)
  if (isRecord(item.visibility)) {
    if (item.visibility.viewport === false) parts.push('hidden')
    if (item.visibility.render === false) parts.push('render-off')
  }
  return parts.join(' ')
}

/**
 * @param {unknown} value - candidate list of names
 * @returns {string} comma-joined names or empty
 */
function formatList(value) {
  if (!Array.isArray(value)) return ''
  return value.map((entry) => String(entry)).join(',')
}

/**
 * @param {unknown} value - candidate number
 * @returns {string} compact number or `?`
 */
function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '?'
  return String(Math.round(value * 1e6) / 1e6)
}

/**
 * @param {unknown} value - candidate vector
 * @returns {string} `(1,2,3)` or `?`
 */
function formatVector(value) {
  if (!Array.isArray(value)) return '?'
  return `(${value.map((entry) => formatNumber(entry)).join(',')})`
}

/** Payload opening: read the base64 argument block. */
const PAYLOAD_HEAD = `import base64
import fnmatch
import json

import bpy

_dsh_inspect_params = json.loads(base64.b64decode('`

/** Payload setup: unpack arguments and define the shared helpers. */
const PAYLOAD_SETUP = `').decode('utf-8'))
_scope = _dsh_inspect_params['scope']
_name = _dsh_inspect_params['name']
_type = _dsh_inspect_params['type']
_collection = _dsh_inspect_params['collection']
_collection_deep = _dsh_inspect_params['collectionDeep']
_include = set(_dsh_inspect_params['include'])
_limit = int(_dsh_inspect_params['limit'])
_offset = int(_dsh_inspect_params['offset'])
_scene = bpy.context.scene
_objects = sorted(bpy.data.objects, key=lambda item: item.name)
_collections = sorted(bpy.data.collections, key=lambda item: item.name)
_top_count = 10
_master = len(_scene.collection.objects) if _scene is not None else 0
_membership_cache = None


def _num(value):
    return round(float(value), 6)


def _vec(value):
    return [_num(item) for item in value]


def _page(sequence):
    total = len(sequence)
    page = sequence[_offset:_offset + _limit]
    next_offset = _offset + _limit
    return page, total, (next_offset if next_offset < total else None)


def _applied_filters():
    applied = {}
    if _name:
        applied['name'] = _name
    if _type and _scope in ('summary', 'objects'):
        applied['type'] = _type
    if _collection and _scope in ('summary', 'objects'):
        applied['collection'] = _collection
        applied['collectionDeep'] = _collection_deep
    return applied


def _allowed_objects():
    if not _collection or _scope not in ('summary', 'objects'):
        return None
    target = bpy.data.collections.get(_collection)
    if target is None and _scene is not None and _scene.collection.name == _collection:
        target = _scene.collection
    if target is None:
        return set()
    source = target.all_objects if _collection_deep else target.objects
    return set(item.name for item in source)


def _membership():
    # Object.users_collection measured at ~120 us per object on a 3k scene
    # (383 ms total), so read the links from the collection side once.
    global _membership_cache
    if _membership_cache is not None:
        return _membership_cache
    membership = {}
    for collection in _collections:
        for obj in collection.objects:
            membership.setdefault(obj.name, []).append(collection.name)
    if _scene is not None:
        for obj in _scene.collection.objects:
            membership.setdefault(obj.name, []).append(_scene.collection.name)
    _membership_cache = membership
    return membership


def _linked_names():
    linked = set()
    for collection in _collections:
        for obj in collection.objects:
            linked.add(obj.name)
    if _scene is not None:
        for obj in _scene.collection.objects:
            linked.add(obj.name)
    return linked


def _unassigned_count():
    linked = _linked_names()
    total = 0
    for obj in _objects:
        if obj.name not in linked:
            total += 1
    return total


def _matches_object(obj):
    if _type and obj.type != _type:
        return False
    if _name and not fnmatch.fnmatchcase(obj.name, _name):
        return False
    if _allowed is not None and obj.name not in _allowed:
        return False
    return True


def _object_entry(obj):
    entry = {'name': obj.name, 'type': obj.type}
    if 'parent' in _include:
        entry['parent'] = obj.parent.name if obj.parent is not None else None
    if 'collections' in _include:
        entry['collections'] = _membership().get(obj.name, [])
    if 'modifiers' in _include:
        entry['modifiers'] = [item.type for item in obj.modifiers]
    if 'materials' in _include:
        if obj.type == 'MESH' and obj.data is not None:
            entry['materials'] = [item.name for item in obj.data.materials if item is not None]
        else:
            entry['materials'] = []
    if 'meshStats' in _include:
        if obj.type == 'MESH' and obj.data is not None:
            entry['meshStats'] = {'vertices': len(obj.data.vertices), 'polygons': len(obj.data.polygons)}
        else:
            entry['meshStats'] = None
    if 'transform' in _include:
        entry['transform'] = {
            'location': _vec(obj.location),
            'rotationMode': obj.rotation_mode,
            'rotationEuler': _vec(obj.rotation_euler),
            'scale': _vec(obj.scale),
        }
    if 'bounds' in _include:
        entry['bounds'] = {'dimensions': _vec(obj.dimensions)}
    if 'visibility' in _include:
        entry['visibility'] = {'viewport': not obj.hide_viewport, 'render': not obj.hide_render}
    if 'data' in _include:
        entry['data'] = obj.data.name if obj.data is not None else None
    return entry


def _collection_rows():
    direct = {}
    for collection in _collections:
        direct[collection.name] = len(collection.objects)
    cache = {}

    def recursive(collection, depth):
        known = cache.get(collection.name)
        if known is not None:
            return known
        total = direct.get(collection.name, 0)
        if depth < 32:
            for child in collection.children:
                total += recursive(child, depth + 1)
        cache[collection.name] = total
        return total

    rows = []
    for collection in _collections:
        rows.append({
            'name': collection.name,
            'objects': direct.get(collection.name, 0),
            'recursive': recursive(collection, 0),
            'children': len(collection.children),
        })
    rows.sort(key=lambda row: (-row['recursive'], row['name']))
    return rows


def _build_hint(paging):
    if paging['totalMatched'] == 0:
        if not _applied:
            return ''
        counts = {}
        for obj in _objects:
            counts[obj.type] = counts.get(obj.type, 0) + 1
        parts = ['no match']
        if counts:
            parts.append('scene types: ' + ', '.join('{} {}'.format(key, counts[key]) for key in sorted(counts)))
        if _collections:
            parts.append('collections: ' + ', '.join(item.name for item in _collections[:8]))
        return '; '.join(parts)
    if paging['nextOffset'] is not None:
        return 'showing {} of {} from offset {}; pass offset={} for the next page'.format(
            paging['returned'], paging['totalMatched'], _offset, paging['nextOffset'])
    if _offset > 0 and paging['returned'] == 0:
        return 'offset {} is past the end ({} matched); start again at offset 0'.format(
            _offset, paging['totalMatched'])
    if _offset > 0:
        return 'showing {} of {} from offset {} (last page)'.format(
            paging['returned'], paging['totalMatched'], _offset)
    return ''


_applied = _applied_filters()
_allowed = _allowed_objects()
_extra = {}
`

/**
 * Per-scope body: sets `_items`, `_total`, `_next` and optionally `_extra`.
 *
 * @type {Record<InspectScope, string>}
 */
const SCOPE_BODIES = {
  summary: `_matched = [obj for obj in _objects if _matches_object(obj)]
_counts = {}
for obj in _matched:
    _counts[obj.type] = _counts.get(obj.type, 0) + 1
_rows = _collection_rows()
_page_items, _total, _next = _page(_matched)
_items = [_object_entry(obj) for obj in _page_items]
_extra = {
    'summary': {
        'typeCounts': _counts,
        'collections': {
            'total': len(_collections),
            'unassigned': _unassigned_count(),
            'master': _master,
            'top': _rows[:_top_count],
        },
        'materials': len(bpy.data.materials),
        'lights': len(bpy.data.lights),
        'cameras': len(bpy.data.cameras),
    }
}
`,
  objects: `_matched = [obj for obj in _objects if _matches_object(obj)]
_page_items, _total, _next = _page(_matched)
_items = [_object_entry(obj) for obj in _page_items]
`,
  collections: `_rows = _collection_rows()
_hidden = {item.name: bool(item.hide_render) for item in _collections}
_entries = []
for _row in _rows:
    if _name and not fnmatch.fnmatchcase(_row['name'], _name):
        continue
    _entries.append({
        'name': _row['name'],
        'objects': _row['objects'],
        'recursive': _row['recursive'],
        'children': _row['children'],
        'hideRender': _hidden.get(_row['name'], False),
    })
_items, _total, _next = _page(_entries)
`,
  materials: `_entries = []
for _material in sorted(bpy.data.materials, key=lambda item: item.name):
    if _name and not fnmatch.fnmatchcase(_material.name, _name):
        continue
    if getattr(_material, 'use_nodes', False) and _material.node_tree is not None:
        _nodes = len(_material.node_tree.nodes)
    else:
        _nodes = 0
    _entries.append({'name': _material.name, 'users': int(_material.users), 'nodes': _nodes})
_items, _total, _next = _page(_entries)
`,
  lights: `_entries = []
for _light in sorted(bpy.data.lights, key=lambda item: item.name):
    if _name and not fnmatch.fnmatchcase(_light.name, _name):
        continue
    _entries.append({
        'name': _light.name,
        'type': _light.type,
        'energy': _num(_light.energy),
        'color': _vec(_light.color),
    })
_items, _total, _next = _page(_entries)
`,
  cameras: `_entries = []
for _camera in sorted(bpy.data.cameras, key=lambda item: item.name):
    if _name and not fnmatch.fnmatchcase(_camera.name, _name):
        continue
    _entry = {
        'name': _camera.name,
        'type': _camera.type,
        'lens': _num(_camera.lens),
        'sensorWidth': _num(_camera.sensor_width),
        'isSceneCamera': bool(_scene is not None and _scene.camera is not None and _scene.camera.data == _camera),
    }
    if _camera.type == 'ORTHO':
        _entry['orthoScale'] = _num(_camera.ortho_scale)
    _entries.append(_entry)
_items, _total, _next = _page(_entries)
`,
}

/** Payload tail: assemble the reply shape, paging and hint. */
const PAYLOAD_TAIL = `_paging = {
    'totalMatched': _total,
    'returned': len(_items),
    'offset': _offset,
    'nextOffset': _next,
    'truncated': _next is not None,
}
result = {
    'scope': _scope,
    'scene': _scene.name if _scene is not None else '',
    'totalObjects': len(_objects),
    'applied': _applied,
    'paging': _paging,
    'items': _items,
}
result.update(_extra)
_hint = _build_hint(_paging)
if _hint:
    result['hint'] = _hint
`
