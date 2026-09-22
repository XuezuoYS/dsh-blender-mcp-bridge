<!-- source: api/bpy.types.WorkSpaceTool.rst -->

base class --- :class:`bpy_struct`

### data `bpy.types.WorkSpaceTool.brush_type`

If the tool uses brushes and is limited to a specific brush type, the identifier of the brush type (default ``'DEFAULT'``, readonly)

:type: Literal['DEFAULT']

### data `bpy.types.WorkSpaceTool.has_datablock`

(default False, readonly)

:type: bool

### attribute `bpy.types.WorkSpaceTool.idname`

(default "", never None)

:type: str

### attribute `bpy.types.WorkSpaceTool.idname_fallback`

(default "", never None)

:type: str

### data `bpy.types.WorkSpaceTool.index`

(in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.WorkSpaceTool.mode`

(default ``'DEFAULT'``, readonly)

:type: Literal['DEFAULT']

### data `bpy.types.WorkSpaceTool.space_type`

(default ``'EMPTY'``, readonly)

:type: Literal[:ref:`rna_enum_space_type_items`]

### data `bpy.types.WorkSpaceTool.use_brushes`

(default False, readonly)

:type: bool

### data `bpy.types.WorkSpaceTool.use_paint_canvas`

Does this tool use a painting canvas (default False, readonly)

:type: bool

### data `bpy.types.WorkSpaceTool.widget`

(default "", readonly, never None)

:type: str

### method `bpy.types.WorkSpaceTool.setup`

Set the tool settings

:param idname: Identifier, (never None)
:type idname: str
:param cursor: cursor, (optional)
:type cursor: Literal[:ref:`rna_enum_window_cursor_items`]
:param keymap: Key Map, (optional, never None)
:type keymap: str
:param gizmo_group: Gizmo Group, (optional, never None)
:type gizmo_group: str
:param brush_type: Brush Type, Limit this tool to a specific type of brush (optional)
:type brush_type: str
:param data_block: Data Block, (optional, never None)
:type data_block: str
:param operator: Operator, (optional, never None)
:type operator: str
:param index: Index, (in [-inf, inf], optional)
:type index: int
:param options: Tool Options, (optional)

   - ``KEYMAP_FALLBACK``
     Fallback.
   - ``USE_BRUSHES``
     Uses Brushes -- Allow this tool to use brushes via the asset system.
:type options: set[Literal['KEYMAP_FALLBACK', 'USE_BRUSHES']]
:param idname_fallback: Fallback Identifier, (optional, never None)
:type idname_fallback: str
:param keymap_fallback: Fallback Key Map, (optional, never None)
:type keymap_fallback: str

### method `bpy.types.WorkSpaceTool.operator_properties`

operator_properties

:param operator: (never None)
:type operator: str
:return: (never None)
:rtype: :class:`OperatorProperties`

### method `bpy.types.WorkSpaceTool.gizmo_group_properties`

gizmo_group_properties

:param group: (never None)
:type group: str
:return: (never None)
:rtype: :class:`GizmoGroupProperties`

### method `bpy.types.WorkSpaceTool.refresh_from_context`

refresh_from_context

### classmethod `bpy.types.WorkSpaceTool.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.WorkSpaceTool.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`

:columns: 2

- :class:`bpy_struct.as_pointer`
- :class:`bpy_struct.driver_add`
- :class:`bpy_struct.driver_remove`
- :class:`bpy_struct.get`
- :class:`bpy_struct.id_properties_clear`
- :class:`bpy_struct.id_properties_ensure`
- :class:`bpy_struct.id_properties_ui`
- :class:`bpy_struct.is_property_hidden`
- :class:`bpy_struct.is_property_overridable_library`
- :class:`bpy_struct.is_property_readonly`
- :class:`bpy_struct.is_property_set`
- :class:`bpy_struct.items`
- :class:`bpy_struct.keyframe_delete`
- :class:`bpy_struct.keyframe_insert`
- :class:`bpy_struct.keys`
- :class:`bpy_struct.path_from_id`
- :class:`bpy_struct.path_from_module`
- :class:`bpy_struct.path_resolve`
- :class:`bpy_struct.pop`
- :class:`bpy_struct.property_overridable_library_set`
- :class:`bpy_struct.property_unset`
- :class:`bpy_struct.rna_ancestors`
- :class:`bpy_struct.type_recast`
- :class:`bpy_struct.values`

:columns: 2

- :class:`WorkSpace.tools`
- :class:`wmTools.from_space_image_mode`
- :class:`wmTools.from_space_node`
- :class:`wmTools.from_space_sequencer`
- :class:`wmTools.from_space_view3d_mode`
