<!-- source: api/bpy.types.BoidSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.BoidSettings`

Settings for boid physics

### attribute `bpy.types.BoidSettings.accuracy`

Accuracy of attack (in [0, 1], default 0.0)

:type: float

### data `bpy.types.BoidSettings.active_boid_state`

(readonly)

:type: :class:`BoidRule` | None

### attribute `bpy.types.BoidSettings.active_boid_state_index`

(in [0, inf], default 0)

:type: int

### attribute `bpy.types.BoidSettings.aggression`

Boid will fight this times stronger enemy (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.air_acc_max`

Maximum acceleration in air (relative to maximum speed) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.air_ave_max`

Maximum angular velocity in air (relative to 180 degrees) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.air_personal_space`

Radius of boids personal space in air (% of particle size) (in [0, 10], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.air_speed_max`

Maximum speed in air (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.air_speed_min`

Minimum speed in air (relative to maximum speed) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.bank`

Amount of rotation around velocity vector on turns (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.health`

Initial boid health when born (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.height`

Boid height relative to particle size (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_acc_max`

Maximum acceleration on land (relative to maximum speed) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_ave_max`

Maximum angular velocity on land (relative to 180 degrees) (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_jump_speed`

Maximum speed for jumping (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_personal_space`

Radius of boids personal space on land (% of particle size) (in [0, 10], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_smooth`

How smoothly the boids land (in [0, 10], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_speed_max`

Maximum speed on land (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.land_stick_force`

How strong a force must be to start effecting a boid on land (in [0, 1000], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.pitch`

Amount of rotation around side vector (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.range`

Maximum distance from which a boid can attack (in [0, 100], default 0.0)

:type: float

### data `bpy.types.BoidSettings.states`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`BoidState`]

### attribute `bpy.types.BoidSettings.strength`

Maximum caused damage on attack per second (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.BoidSettings.use_climb`

Allow boids to climb goal objects (default False)

:type: bool

### attribute `bpy.types.BoidSettings.use_flight`

Allow boids to move in air (default False)

:type: bool

### attribute `bpy.types.BoidSettings.use_land`

Allow boids to move on land (default False)

:type: bool

### classmethod `bpy.types.BoidSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.BoidSettings.bl_rna_get_subclass_py`

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

- :class:`ParticleSettings.boids`
