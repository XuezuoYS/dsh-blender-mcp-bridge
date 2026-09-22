<!-- source: api/bpy.types.Particle.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Particle`

Particle in a particle system

### attribute `bpy.types.Particle.alive_state`

(default ``'DEAD'``)

:type: Literal['DEAD', 'UNBORN', 'ALIVE', 'DYING']

### attribute `bpy.types.Particle.angular_velocity`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Particle.birth_time`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Particle.die_time`

(in [-inf, inf], default 0.0)

:type: float

### data `bpy.types.Particle.hair_keys`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ParticleHairKey`]

### data `bpy.types.Particle.is_exist`

(default True, readonly)

:type: bool

### data `bpy.types.Particle.is_visible`

(default True, readonly)

:type: bool

### attribute `bpy.types.Particle.lifetime`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Particle.location`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### data `bpy.types.Particle.particle_keys`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ParticleKey`]

### attribute `bpy.types.Particle.prev_angular_velocity`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Particle.prev_location`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Particle.prev_rotation`

(array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`mathutils.Quaternion`

### attribute `bpy.types.Particle.prev_velocity`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Particle.rotation`

(array of 4 items, in [-inf, inf], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`mathutils.Quaternion`

### attribute `bpy.types.Particle.size`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Particle.velocity`

(array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### method `bpy.types.Particle.uv_on_emitter`

Obtain UV coordinates for a particle on an evaluated mesh.

:param modifier: Particle modifier from an evaluated object (never None)
:type modifier: :class:`ParticleSystemModifier` | None
:return: uv, (array of 2 items, in [-inf, inf])
:rtype: :class:`mathutils.Vector`

### classmethod `bpy.types.Particle.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Particle.bl_rna_get_subclass_py`

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

- :class:`ParticleHairKey.co_object`
- :class:`ParticleHairKey.co_object_set`
- :class:`ParticleSystem.mcol_on_emitter`
- :class:`ParticleSystem.particles`
- :class:`ParticleSystem.uv_on_emitter`
