<!-- source: api/bpy.types.ExplodeModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.ExplodeModifier`

Explosion effect modifier based on a particle system

### attribute `bpy.types.ExplodeModifier.invert_vertex_group`

Invert vertex group influence (default False)

:type: bool

### attribute `bpy.types.ExplodeModifier.particle_uv`

UV map to change with particle age (default "", never None)

:type: str

### attribute `bpy.types.ExplodeModifier.protect`

Clean vertex group edges (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ExplodeModifier.show_alive`

Show mesh when particles are alive (default True)

:type: bool

### attribute `bpy.types.ExplodeModifier.show_dead`

Show mesh when particles are dead (default True)

:type: bool

### attribute `bpy.types.ExplodeModifier.show_unborn`

Show mesh when particles are unborn (default True)

:type: bool

### attribute `bpy.types.ExplodeModifier.use_edge_cut`

Cut face edges for nicer shrapnel (default False)

:type: bool

### attribute `bpy.types.ExplodeModifier.use_size`

Use particle size for the shrapnel (default False)

:type: bool

### attribute `bpy.types.ExplodeModifier.vertex_group`

(default "", never None)

:type: str

### classmethod `bpy.types.ExplodeModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ExplodeModifier.bl_rna_get_subclass_py`

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
