<!-- source: api/bpy.types.EffectorWeights.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.EffectorWeights`

Effector weights for physics simulation

### attribute `bpy.types.EffectorWeights.all`

All effector's weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.apply_to_hair_growing`

Use force fields when growing hair (default False)

:type: bool

### attribute `bpy.types.EffectorWeights.boid`

Boid effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.charge`

Charge effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.collection`

Limit effectors to this collection

:type: :class:`Collection` | None

### attribute `bpy.types.EffectorWeights.curve_guide`

Curve guide effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.drag`

Drag effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.force`

Force effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.gravity`

Global gravity weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.harmonic`

Harmonic effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.lennardjones`

Lennard-Jones effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.magnetic`

Magnetic effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.smokeflow`

Fluid Flow effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.texture`

Texture effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.turbulence`

Turbulence effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.vortex`

Vortex effector weight (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.EffectorWeights.wind`

Wind effector weight (in [-200, 200], default 0.0)

:type: float

### classmethod `bpy.types.EffectorWeights.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.EffectorWeights.bl_rna_get_subclass_py`

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

- :class:`ClothSettings.effector_weights`
- :class:`DynamicPaintSurface.effector_weights`
- :class:`FluidDomainSettings.effector_weights`
- :class:`ParticleSettings.effector_weights`
- :class:`RigidBodyWorld.effector_weights`
- :class:`SoftBodySettings.effector_weights`
