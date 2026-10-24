/**
 * Read-only Python snippets shared by tools and offline probes.
 *
 * Keeping them out of `lib/tools.js` lets the syntax probe load them without
 * importing the DSH tool SDK (which is not installed in a bare tarball).
 *
 * The scene query for `blender_mcp_inspect` is generated per call and lives in
 * {@link module:lib/inspect}; only the fixed object-name query stays here.
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
