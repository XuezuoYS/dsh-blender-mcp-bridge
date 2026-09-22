<!-- source: api/bpy.types.VolumeDisplaceModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### attribute `bpy.types.VolumeDisplaceModifier.strength`

Strength of the displacement (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.VolumeDisplaceModifier.texture`

:type: :class:`Texture` | None

### attribute `bpy.types.VolumeDisplaceModifier.texture_map_mode`

(default ``'LOCAL'``)

- ``LOCAL``
  Local -- Use the local coordinate system for the texture coordinates.
- ``GLOBAL``
  Global -- Use the global coordinate system for the texture coordinates.
- ``OBJECT``
  Object -- Use the linked object's local coordinate system for the texture coordinates.

:type: Literal['LOCAL', 'GLOBAL', 'OBJECT']

### attribute `bpy.types.VolumeDisplaceModifier.texture_map_object`

Object to use for texture mapping

:type: :class:`Object` | None

### attribute `bpy.types.VolumeDisplaceModifier.texture_mid_level`

Subtracted from the texture color to get a displacement vector (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.VolumeDisplaceModifier.texture_sample_radius`

Smaller values result in better performance but might cut off the volume (in [0, inf], default 0.0)

:type: float

### classmethod `bpy.types.VolumeDisplaceModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.VolumeDisplaceModifier.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Modifier.name`
- :class:`Modifier.type`
- :class:`Modifier.show_viewport`
- :class:`Modifier.show_render`
- :class:`Modifier.show_in_editmode`
- :class:`Modifier.show_on_cage`
- :class:`Modifier.show_expanded`
- :class:`Modifier.is_active`
- :class:`Modifier.use_pin_to_last`
- :class:`Modifier.is_override_data`
- :class:`Modifier.use_apply_on_spline`
- :class:`Modifier.execution_time`
- :class:`Modifier.persistent_uid`

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
- :class:`Modifier.bl_rna_get_subclass`
- :class:`Modifier.bl_rna_get_subclass_py`
