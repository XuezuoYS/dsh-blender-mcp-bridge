<!-- source: api/bpy.types.NodesModifierBake.rst -->

base class --- :class:`bpy_struct`

### data `bpy.types.NodesModifierBake.bake_id`

Identifier for this bake which remains unchanged even when the bake node is renamed, grouped or ungrouped (in [-inf, inf], default 0, readonly)

:type: int

### attribute `bpy.types.NodesModifierBake.bake_mode`

(default ``'ANIMATION'``)

- ``ANIMATION``
  Animation -- Bake a frame range.
- ``STILL``
  Still -- Bake a single frame.

:type: Literal['ANIMATION', 'STILL']

### attribute `bpy.types.NodesModifierBake.bake_target`

Where to store the baked data (default ``'INHERIT'``)

- ``INHERIT``
  Inherit from Modifier -- Use setting from the modifier.
- ``PACKED``
  Packed -- Pack the baked data into the .blend file.
- ``DISK``
  Disk -- Store the baked data in a directory on disk.

:type: Literal['INHERIT', 'PACKED', 'DISK']

### data `bpy.types.NodesModifierBake.data_blocks`

(default None, readonly)

:type: :class:`NodesModifierBakeDataBlocks`\ [:class:`NodesModifierDataBlock`]

### attribute `bpy.types.NodesModifierBake.directory`

Location on disk where the bake data is stored (default "", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.NodesModifierBake.frame_end`

Frame where the baking ends (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.NodesModifierBake.frame_start`

Frame where the baking starts (in [-inf, inf], default 0)

:type: int

### data `bpy.types.NodesModifierBake.node`

Bake node or simulation output node that corresponds to this bake. This node may be deeply nested in the modifier node group. It can be none in some cases like missing linked data blocks. (readonly)

:type: :class:`Node` | None

### attribute `bpy.types.NodesModifierBake.use_custom_path`

Specify a path where the baked data should be stored manually (default False)

:type: bool

### attribute `bpy.types.NodesModifierBake.use_custom_simulation_frame_range`

Override the simulation frame range from the scene (default False)

:type: bool

### classmethod `bpy.types.NodesModifierBake.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NodesModifierBake.bl_rna_get_subclass_py`

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

- :class:`NodesModifier.bakes`
