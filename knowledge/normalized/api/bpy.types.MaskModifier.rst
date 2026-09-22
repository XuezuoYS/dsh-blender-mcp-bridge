<!-- source: api/bpy.types.MaskModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.MaskModifier`

Mask modifier to hide parts of the mesh

### attribute `bpy.types.MaskModifier.armature`

Armature to use as source of bones to mask

:type: :class:`Object` | None

### attribute `bpy.types.MaskModifier.invert_vertex_group`

Use vertices that are not part of region defined (default False)

:type: bool

### attribute `bpy.types.MaskModifier.mode`

(default ``'VERTEX_GROUP'``)

:type: Literal['VERTEX_GROUP', 'ARMATURE']

### attribute `bpy.types.MaskModifier.threshold`

Weights over this threshold remain (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.MaskModifier.use_smooth`

Use vertex group weights to cut faces at the weight contour (default False)

:type: bool

### attribute `bpy.types.MaskModifier.vertex_group`

Vertex group name (default "", never None)

:type: str

### classmethod `bpy.types.MaskModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MaskModifier.bl_rna_get_subclass_py`

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
