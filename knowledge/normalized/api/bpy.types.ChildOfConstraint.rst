<!-- source: api/bpy.types.ChildOfConstraint.rst -->

base classes --- :class:`bpy_struct`, :class:`Constraint`

### class `bpy.types.ChildOfConstraint`

Create constraint-based parent-child relationship

### attribute `bpy.types.ChildOfConstraint.inverse_matrix`

Transformation matrix to apply before (multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)))

:type: :class:`mathutils.Matrix`

### attribute `bpy.types.ChildOfConstraint.set_inverse_pending`

Set to true to request recalculation of the inverse matrix (default False)

:type: bool

### attribute `bpy.types.ChildOfConstraint.subtarget`

Armature bone, mesh or lattice vertex group, ... (default "", never None)

:type: str

### attribute `bpy.types.ChildOfConstraint.target`

Target object

:type: :class:`Object` | None

### attribute `bpy.types.ChildOfConstraint.use_location_x`

Use X Location of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_location_y`

Use Y Location of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_location_z`

Use Z Location of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_rotation_x`

Use X Rotation of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_rotation_y`

Use Y Rotation of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_rotation_z`

Use Z Rotation of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_scale_x`

Use X Scale of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_scale_y`

Use Y Scale of Parent (default True)

:type: bool

### attribute `bpy.types.ChildOfConstraint.use_scale_z`

Use Z Scale of Parent (default True)

:type: bool

### classmethod `bpy.types.ChildOfConstraint.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ChildOfConstraint.bl_rna_get_subclass_py`

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
