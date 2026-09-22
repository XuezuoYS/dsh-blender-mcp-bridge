<!-- source: api/bpy.types.StripElement.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.StripElement`

Sequence strip data for a single frame

### attribute `bpy.types.StripElement.filename`

Name of the source file (default "", never None)

:type: str

### data `bpy.types.StripElement.orig_fps`

Original frames per second (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.StripElement.orig_height`

Original image height (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.StripElement.orig_width`

Original image width (in [-inf, inf], default 0, readonly)

:type: int

### classmethod `bpy.types.StripElement.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.StripElement.bl_rna_get_subclass_py`

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

- :class:`ImageStrip.elements`
- :class:`MovieStrip.elements`
- :class:`Strip.strip_elem_from_frame`
- :class:`StripElements.append`
