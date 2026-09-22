<!-- source: api/bpy.types.RigidBodyObject.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.RigidBodyObject`

Settings for object participating in Rigid Body Simulation

### attribute `bpy.types.RigidBodyObject.angular_damping`

Amount of angular velocity that is lost over time (in [0, 1], default 0.1)

:type: float

### attribute `bpy.types.RigidBodyObject.collision_collections`

Collision collections rigid body belongs to (array of 20 items, default (False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False))

:type: :class:`bpy_prop_array`\ [bool]

### attribute `bpy.types.RigidBodyObject.collision_margin`

Threshold of distance near surface where collisions are still considered (best results when non-zero) (in [0, 1], default 0.04)

:type: float

### attribute `bpy.types.RigidBodyObject.collision_shape`

Collision Shape of object in Rigid Body Simulations (default ``'BOX'``)

:type: Literal[:ref:`rna_enum_rigidbody_object_shape_items`]

### attribute `bpy.types.RigidBodyObject.deactivate_angular_velocity`

Angular Velocity below which simulation stops simulating object (in [0, inf], default 0.5)

:type: float

### attribute `bpy.types.RigidBodyObject.deactivate_linear_velocity`

Linear Velocity below which simulation stops simulating object (in [0, inf], default 0.4)

:type: float

### attribute `bpy.types.RigidBodyObject.enabled`

Rigid Body actively participates to the simulation (default True)

:type: bool

### attribute `bpy.types.RigidBodyObject.friction`

Resistance of object to movement (in [0, inf], default 0.5)

:type: float

### attribute `bpy.types.RigidBodyObject.kinematic`

Allow rigid body to be controlled by the animation system (default False)

:type: bool

### attribute `bpy.types.RigidBodyObject.linear_damping`

Amount of linear velocity that is lost over time (in [0, 1], default 0.04)

:type: float

### attribute `bpy.types.RigidBodyObject.mass`

How much the object 'weighs' irrespective of gravity (in [0.001, inf], default 1.0)

:type: float

### attribute `bpy.types.RigidBodyObject.mesh_source`

Source of the mesh used to create collision shape (default ``'BASE'``)

- ``BASE``
  Base -- Base mesh.
- ``DEFORM``
  Deform -- Deformations (shape keys, deform modifiers).
- ``FINAL``
  Final -- All modifiers.

:type: Literal['BASE', 'DEFORM', 'FINAL']

### attribute `bpy.types.RigidBodyObject.restitution`

Tendency of object to bounce after colliding with another (0 = stays still, 1 = perfectly elastic) (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.RigidBodyObject.type`

Role of object in Rigid Body Simulations (default ``'ACTIVE'``)

:type: Literal[:ref:`rna_enum_rigidbody_object_type_items`]

### attribute `bpy.types.RigidBodyObject.use_deactivation`

Enable deactivation of resting rigid bodies (increases performance and stability but can cause glitches) (default True)

:type: bool

### attribute `bpy.types.RigidBodyObject.use_deform`

Rigid body deforms during simulation (default False)

:type: bool

### attribute `bpy.types.RigidBodyObject.use_margin`

Use custom collision margin (some shapes will have a visible gap around them) (default False)

:type: bool

### attribute `bpy.types.RigidBodyObject.use_start_deactivated`

Deactivate rigid body at the start of the simulation (default False)

:type: bool

### classmethod `bpy.types.RigidBodyObject.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.RigidBodyObject.bl_rna_get_subclass_py`

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

- :class:`Object.rigid_body`
