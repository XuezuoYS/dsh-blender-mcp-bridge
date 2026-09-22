<!-- source: api/bpy.types.CopyRotationConstraint.rst -->

base classes --- :class:`bpy_struct`, :class:`Constraint`

### class `bpy.types.CopyRotationConstraint`

Copy the rotation of the target

### attribute `bpy.types.CopyRotationConstraint.euler_order`

Explicitly specify the euler rotation order (default ``'AUTO'``)

- ``AUTO``
  Default -- Euler using the default rotation order.
- ``XYZ``
  XYZ Euler -- Euler using the XYZ rotation order.
- ``XZY``
  XZY Euler -- Euler using the XZY rotation order.
- ``YXZ``
  YXZ Euler -- Euler using the YXZ rotation order.
- ``YZX``
  YZX Euler -- Euler using the YZX rotation order.
- ``ZXY``
  ZXY Euler -- Euler using the ZXY rotation order.
- ``ZYX``
  ZYX Euler -- Euler using the ZYX rotation order.

:type: Literal['AUTO', 'XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX']

### attribute `bpy.types.CopyRotationConstraint.invert_x`

Invert the X rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.invert_y`

Invert the Y rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.invert_z`

Invert the Z rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.mix_mode`

Specify how the copied and existing rotations are combined (default ``'REPLACE'``)

- ``REPLACE``
  Replace -- Replace the original rotation with copied.
- ``ADD``
  Add -- Add euler component values together.
- ``BEFORE``
  Before Original -- Apply copied rotation before original, as if the constraint target is a parent.
- ``AFTER``
  After Original -- Apply copied rotation after original, as if the constraint target is a child.
- ``OFFSET``
  Offset (Legacy) -- Combine rotations like the original Offset checkbox. Does not work well for multiple axis rotations..

:type: Literal['REPLACE', 'ADD', 'BEFORE', 'AFTER', 'OFFSET']

### attribute `bpy.types.CopyRotationConstraint.subtarget`

Armature bone, mesh or lattice vertex group, ... (default "", never None)

:type: str

### attribute `bpy.types.CopyRotationConstraint.target`

Target object

:type: :class:`Object` | None

### attribute `bpy.types.CopyRotationConstraint.use_offset`

DEPRECATED: Add original rotation into copied rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.use_x`

Copy the target's X rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.use_y`

Copy the target's Y rotation (default False)

:type: bool

### attribute `bpy.types.CopyRotationConstraint.use_z`

Copy the target's Z rotation (default False)

:type: bool

### classmethod `bpy.types.CopyRotationConstraint.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.CopyRotationConstraint.bl_rna_get_subclass_py`

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
