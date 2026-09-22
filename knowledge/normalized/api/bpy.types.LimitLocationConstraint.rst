<!-- source: api/bpy.types.LimitLocationConstraint.rst -->

base classes --- :class:`bpy_struct`, :class:`Constraint`

### class `bpy.types.LimitLocationConstraint`

Limit the location of the constrained object

### attribute `bpy.types.LimitLocationConstraint.max_x`

Highest X value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.max_y`

Highest Y value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.max_z`

Highest Z value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.min_x`

Lowest X value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.min_y`

Lowest Y value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.min_z`

Lowest Z value to allow (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.LimitLocationConstraint.use_max_x`

Use the maximum X value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_max_y`

Use the maximum Y value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_max_z`

Use the maximum Z value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_min_x`

Use the minimum X value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_min_y`

Use the minimum Y value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_min_z`

Use the minimum Z value (default False)

:type: bool

### attribute `bpy.types.LimitLocationConstraint.use_transform_limit`

Transform tools are affected by this constraint as well (default False)

:type: bool

### classmethod `bpy.types.LimitLocationConstraint.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.LimitLocationConstraint.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Constraint.name`
- :class:`Constraint.type`
- :class:`Constraint.is_override_data`
- :class:`Constraint.owner_space`
- :class:`Constraint.target_space`
- :class:`Constraint.space_object`
- :class:`Constraint.space_subtarget`
- :class:`Constraint.mute`
- :class:`Constraint.enabled`
- :class:`Constraint.show_expanded`
- :class:`Constraint.is_valid`
- :class:`Constraint.active`
- :class:`Constraint.influence`
- :class:`Constraint.error_location`
- :class:`Constraint.error_rotation`

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
- :class:`Constraint.bl_rna_get_subclass`
- :class:`Constraint.bl_rna_get_subclass_py`
