<!-- source: api/bpy.types.MaterialLineArt.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.MaterialLineArt.intersection_priority`

The intersection line will be included into the object with the higher intersection priority value (in [0, 255], default 0)

:type: int

### attribute `bpy.types.MaterialLineArt.mat_occlusion`

Faces with this material will behave as if it has set number of layers in occlusion (in [0, 255], default 1)

:type: int

### attribute `bpy.types.MaterialLineArt.use_intersection_priority_override`

Override object and collection intersection priority value (default False)

:type: bool

### attribute `bpy.types.MaterialLineArt.use_material_mask`

Use material masks to filter out occluded strokes (default False)

:type: bool

### attribute `bpy.types.MaterialLineArt.use_material_mask_bits`

(array of 8 items, default (False, False, False, False, False, False, False, False))

:type: :class:`bpy_prop_array`\ [bool]

### classmethod `bpy.types.MaterialLineArt.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MaterialLineArt.bl_rna_get_subclass_py`

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

- :class:`Material.lineart`
