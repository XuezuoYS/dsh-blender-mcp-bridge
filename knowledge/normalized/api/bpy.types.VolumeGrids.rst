<!-- source: api/bpy.types.VolumeGrids.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.VolumeGrids`

3D volume grids

### attribute `bpy.types.VolumeGrids.active_index`

Index of active volume grid (in [0, inf], default 0)

:type: int

### data `bpy.types.VolumeGrids.error_message`

If loading grids failed, error message with details (default "", readonly, never None)

:type: str

### data `bpy.types.VolumeGrids.frame`

Frame number that volume grids will be loaded at, based on scene time and volume parameters (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.VolumeGrids.frame_filepath`

Volume file used for loading the volume at the current frame. Empty if the volume has not be loaded or the frame only exists in memory. (default "", readonly, never None, blend relative ``//`` prefix supported)

:type: str

### data `bpy.types.VolumeGrids.is_loaded`

List of grids and metadata are loaded in memory (default False, readonly)

:type: bool

### method `bpy.types.VolumeGrids.load`

Load list of grids and metadata from file

:return: True if grid list was successfully loaded
:rtype: bool

### method `bpy.types.VolumeGrids.unload`

Unload all grid and voxel data from memory

### method `bpy.types.VolumeGrids.save`

Save grids and metadata to file

:param filepath: File path to save to (never None)
:type filepath: str
:return: True if grid list was successfully loaded
:rtype: bool

### classmethod `bpy.types.VolumeGrids.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.VolumeGrids.bl_rna_get_subclass_py`

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

- :class:`Volume.grids`
