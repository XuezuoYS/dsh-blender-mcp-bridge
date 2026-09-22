<!-- source: api/bpy.types.StripCrop.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.StripCrop`

Cropping parameters for a sequence strip

### attribute `bpy.types.StripCrop.max_x`

Number of pixels to crop from the right side (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.StripCrop.max_y`

Number of pixels to crop from the top (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.StripCrop.min_x`

Number of pixels to crop from the left side (in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.StripCrop.min_y`

Number of pixels to crop from the bottom (in [-inf, inf], default 0)

:type: int

### classmethod `bpy.types.StripCrop.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.StripCrop.bl_rna_get_subclass_py`

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

- :class:`EffectStrip.crop`
- :class:`ImageStrip.crop`
- :class:`MaskStrip.crop`
- :class:`MetaStrip.crop`
- :class:`MovieClipStrip.crop`
- :class:`MovieStrip.crop`
- :class:`SceneStrip.crop`
