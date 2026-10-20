/**
 * Read-only Python snippets shared by tools and offline probes.
 *
 * Keeping them out of `lib/tools.js` lets the syntax probe load them without
 * importing the DSH tool SDK (which is not installed in a bare tarball).
 *
 * @module lib/pythonSnippets
 */

/** Bounded object-name query used to report added/removed objects. */
export const OBJECT_NAMES_CODE = `import bpy
result = {
    'names': [obj.name for obj in bpy.data.objects][:500],
    'total': len(bpy.data.objects),
}
`

/** Read-only Python that summarizes the scene for `blender_mcp_inspect`. */
export const INSPECT_CODE = `import bpy

scene = bpy.context.scene
counts = {}
objects = []
for obj in bpy.data.objects:
    counts[obj.type] = counts.get(obj.type, 0) + 1
    if len(objects) >= 200:
        continue
    entry = {
        'name': obj.name,
        'type': obj.type,
        'parent': obj.parent.name if obj.parent is not None else None,
        'collections': [c.name for c in obj.users_collection],
        'modifiers': [m.type for m in obj.modifiers],
        'materials': [],
        'vertices': None,
        'polygons': None,
    }
    if obj.type == 'MESH' and obj.data is not None:
        entry['vertices'] = len(obj.data.vertices)
        entry['polygons'] = len(obj.data.polygons)
        entry['materials'] = [m.name for m in obj.data.materials if m is not None]
    objects.append(entry)

result = {
    'scene': scene.name if scene is not None else '',
    'totalObjects': len(bpy.data.objects),
    'typeCounts': counts,
    'collections': [c.name for c in bpy.data.collections],
    'objects': objects,
    'truncated': len(bpy.data.objects) > 200,
}
`
