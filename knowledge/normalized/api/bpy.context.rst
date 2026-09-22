<!-- source: api/bpy.context.rst -->

The context members available depend on the area of Blender which is currently being accessed.

Note that all context values are read-only,
but may be modified through the data API or by running operators.

### data `bpy.context.context`

Access to the current window-manager and data context.

:type: :class:`bpy.types.Context`
