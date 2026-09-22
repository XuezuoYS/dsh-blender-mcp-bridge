<!-- source: api/bpy.types.Constraint.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Constraint`

:caption: Subclasses
:maxdepth: 1

bpy.types.ActionConstraint.rst
bpy.types.ArmatureConstraint.rst
bpy.types.CameraSolverConstraint.rst
bpy.types.ChildOfConstraint.rst
bpy.types.ClampToConstraint.rst
bpy.types.CopyLocationConstraint.rst
bpy.types.CopyRotationConstraint.rst
bpy.types.CopyScaleConstraint.rst
bpy.types.CopyTransformsConstraint.rst
bpy.types.DampedTrackConstraint.rst
bpy.types.FloorConstraint.rst
bpy.types.FollowPathConstraint.rst
bpy.types.FollowTrackConstraint.rst
bpy.types.GeometryAttributeConstraint.rst
bpy.types.KinematicConstraint.rst
bpy.types.LimitDistanceConstraint.rst
bpy.types.LimitLocationConstraint.rst
bpy.types.LimitRotationConstraint.rst
bpy.types.LimitScaleConstraint.rst
bpy.types.LockedTrackConstraint.rst
bpy.types.MaintainVolumeConstraint.rst
bpy.types.ObjectSolverConstraint.rst
bpy.types.PivotConstraint.rst
bpy.types.ShrinkwrapConstraint.rst
bpy.types.SplineIKConstraint.rst
bpy.types.StretchToConstraint.rst
bpy.types.TrackToConstraint.rst
bpy.types.TransformCacheConstraint.rst
bpy.types.TransformConstraint.rst
Constraint modifying the transformation of objects and bones

### attribute `bpy.types.Constraint.active`

Constraint is the one being edited (default False)

:type: bool

### attribute `bpy.types.Constraint.enabled`

Use the results of this constraint (default True)

:type: bool

### data `bpy.types.Constraint.error_location`

Amount of residual error in Blender space unit for constraints that work on position (in [-inf, inf], default 0.0, readonly)

:type: float

### data `bpy.types.Constraint.error_rotation`

Amount of residual error in radians for constraints that work on orientation (in [-inf, inf], default 0.0, readonly)

:type: float

### attribute `bpy.types.Constraint.influence`

Amount of influence constraint will have on the final solution (in [0, 1], default 0.0)

:type: float

### data `bpy.types.Constraint.is_override_data`

In a local override object, whether this constraint comes from the linked reference object, or is local to the override (default True, readonly)

:type: bool

### data `bpy.types.Constraint.is_valid`

Constraint has valid settings and can be evaluated (default True, readonly)

:type: bool

### attribute `bpy.types.Constraint.mute`

Enable/Disable Constraint (default False)

:type: bool

### attribute `bpy.types.Constraint.name`

Constraint name (default "", never None)

:type: str

### attribute `bpy.types.Constraint.owner_space`

Space that owner is evaluated in (default ``'WORLD'``)

- ``WORLD``
  World Space -- The constraint is applied relative to the world coordinate system.
- ``CUSTOM``
  Custom Space -- The constraint is applied in local space of a custom object/bone/vertex group.
- ``POSE``
  Pose Space -- The constraint is applied in Pose Space, the object transformation is ignored.
- ``LOCAL_WITH_PARENT``
  Local With Parent -- The constraint is applied relative to the rest pose local coordinate system of the bone, thus including the parent-induced transformation.
- ``LOCAL``
  Local Space -- The constraint is applied relative to the local coordinate system of the object.

:type: Literal['WORLD', 'CUSTOM', 'POSE', 'LOCAL_WITH_PARENT', 'LOCAL']

### attribute `bpy.types.Constraint.show_expanded`

Constraint's panel is expanded in UI (default False)

:type: bool

### attribute `bpy.types.Constraint.space_object`

Object for Custom Space

:type: :class:`Object` | None

### attribute `bpy.types.Constraint.space_subtarget`

Armature bone, mesh or lattice vertex group, ... (default "", never None)

:type: str

### attribute `bpy.types.Constraint.target_space`

Space that target is evaluated in (default ``'WORLD'``)

- ``WORLD``
  World Space -- The transformation of the target is evaluated relative to the world coordinate system.
- ``CUSTOM``
  Custom Space -- The transformation of the target is evaluated relative to a custom object/bone/vertex group.
- ``POSE``
  Pose Space -- The transformation of the target is only evaluated in the Pose Space, the target armature object transformation is ignored.
- ``LOCAL_WITH_PARENT``
  Local With Parent -- The transformation of the target bone is evaluated relative to its rest pose local coordinate system, thus including the parent-induced transformation.
- ``LOCAL``
  Local Space -- The transformation of the target is evaluated relative to its local coordinate system.
- ``LOCAL_OWNER_ORIENT``
  Local Space (Owner Orientation) -- The transformation of the target bone is evaluated relative to its local coordinate system, followed by a correction for the difference in target and owner rest pose orientations. When applied as local transform to the owner produces the same global motion as the target if the parents are still in rest pose..

:type: Literal['WORLD', 'CUSTOM', 'POSE', 'LOCAL_WITH_PARENT', 'LOCAL', 'LOCAL_OWNER_ORIENT']

### data `bpy.types.Constraint.type`

(default ``'CAMERA_SOLVER'``, readonly)

:type: Literal[:ref:`rna_enum_constraint_type_items`]

### classmethod `bpy.types.Constraint.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Constraint.bl_rna_get_subclass_py`

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

- :class:`Object.constraints`
- :class:`ObjectConstraints.active`
- :class:`ObjectConstraints.copy`
- :class:`ObjectConstraints.copy`
- :class:`ObjectConstraints.new`
- :class:`ObjectConstraints.remove`
- :class:`Panel.custom_data`
- :class:`PoseBone.constraints`
- :class:`PoseBoneConstraints.active`
- :class:`PoseBoneConstraints.copy`
- :class:`PoseBoneConstraints.copy`
- :class:`PoseBoneConstraints.new`
- :class:`PoseBoneConstraints.remove`
- :class:`UILayout.template_constraint_header`
