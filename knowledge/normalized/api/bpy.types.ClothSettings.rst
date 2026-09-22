<!-- source: api/bpy.types.ClothSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ClothSettings`

Cloth simulation settings for an object

### attribute `bpy.types.ClothSettings.air_damping`

Air has normally some thickness which slows falling things down (in [0, 10], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.bending_damping`

Amount of damping in bending behavior (in [0, 1000], default 0.5)

:type: float

### attribute `bpy.types.ClothSettings.bending_model`

Physical model for simulating bending forces (default ``'ANGULAR'``)

- ``ANGULAR``
  Angular -- Cloth model with angular bending springs.
- ``LINEAR``
  Linear -- Cloth model with linear bending springs (legacy).

:type: Literal['ANGULAR', 'LINEAR']

### attribute `bpy.types.ClothSettings.bending_stiffness`

How much the material resists bending (in [0, 10000], default 0.5)

:type: float

### attribute `bpy.types.ClothSettings.bending_stiffness_max`

Maximum bending stiffness value (in [0, 10000], default 0.5)

:type: float

### attribute `bpy.types.ClothSettings.collider_friction`

(in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.compression_damping`

Amount of damping in compression behavior (in [0, 50], default 5.0)

:type: float

### attribute `bpy.types.ClothSettings.compression_stiffness`

How much the material resists compression (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.compression_stiffness_max`

Maximum compression stiffness value (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.density_strength`

Influence of target density on the simulation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.density_target`

Maximum density of hair (in [0, 10000], default 0.0)

:type: float

### data `bpy.types.ClothSettings.effector_weights`

(readonly)

:type: :class:`EffectorWeights` | None

### attribute `bpy.types.ClothSettings.fluid_density`

Density (kg/l) of the fluid contained inside the object, used to create a hydrostatic pressure gradient simulating the weight of the internal fluid, or buoyancy from the surrounding fluid if negative (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.goal_default`

Default Goal (vertex target position) value, when no Vertex Group used (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.goal_friction`

Goal (vertex target position) friction (in [0, 50], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.goal_max`

Goal maximum, vertex group weights are scaled to match this range (in [0, 1], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.goal_min`

Goal minimum, vertex group weights are scaled to match this range (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.goal_spring`

Goal (vertex target position) spring stiffness (in [0, 0.999], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.gravity`

Gravity or external force vector (array of 3 items, in [-100, 100], default (0.0, 0.0, -9.81))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.ClothSettings.internal_compression_stiffness`

How much the material resists compression (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.internal_compression_stiffness_max`

Maximum compression stiffness value (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.internal_friction`

(in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.internal_spring_max_diversion`

How much the rays used to connect the internal points can diverge from the vertex normal (in [0, 0.785398], default 0.785398)

:type: float

### attribute `bpy.types.ClothSettings.internal_spring_max_length`

The maximum length an internal spring can have during creation. If the distance between internal points is greater than this, no internal spring will be created between these points. A length of zero means that there is no length limit. (in [0, 1000], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.internal_spring_normal_check`

Require the points the internal springs connect to have opposite normal directions (default True)

:type: bool

### attribute `bpy.types.ClothSettings.internal_tension_stiffness`

How much the material resists stretching (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.internal_tension_stiffness_max`

Maximum tension stiffness value (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.mass`

The mass of each vertex on the cloth material (in [0, inf], default 0.3)

:type: float

### attribute `bpy.types.ClothSettings.pin_stiffness`

Pin (vertex target position) spring stiffness (in [0, 50], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.pressure_factor`

Ambient pressure (kPa) that balances out between the inside and outside of the object when it has the target volume (in [0, 10000], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.quality`

Quality of the simulation in steps per frame (higher is better quality but slower) (in [1, inf], default 5)

:type: int

### attribute `bpy.types.ClothSettings.rest_shape_key`

Shape key to use the rest spring lengths from

:type: :class:`ShapeKey` | None

### attribute `bpy.types.ClothSettings.sewing_force_max`

Maximum sewing force (in [0, 10000], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.shear_damping`

Amount of damping in shearing behavior (in [0, 50], default 5.0)

:type: float

### attribute `bpy.types.ClothSettings.shear_stiffness`

How much the material resists shearing (in [0, 10000], default 5.0)

:type: float

### attribute `bpy.types.ClothSettings.shear_stiffness_max`

Maximum shear scaling value (in [0, 10000], default 5.0)

:type: float

### attribute `bpy.types.ClothSettings.shrink_max`

Max amount to shrink cloth by (in [-inf, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.shrink_min`

Factor by which to shrink cloth (in [-inf, 1], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.target_volume`

The mesh volume where the inner/outer pressure will be the same. If set to zero the change in volume will not affect pressure. (in [0, 10000], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.tension_damping`

Amount of damping in stretching behavior (in [0, 50], default 5.0)

:type: float

### attribute `bpy.types.ClothSettings.tension_stiffness`

How much the material resists stretching (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.tension_stiffness_max`

Maximum tension stiffness value (in [0, 10000], default 15.0)

:type: float

### attribute `bpy.types.ClothSettings.time_scale`

Cloth speed is multiplied by this value (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.ClothSettings.uniform_pressure_force`

The uniform pressure that is constantly applied to the mesh, in units of Pressure Scale. Can be negative. (in [-10000, 10000], default 0.0)

:type: float

### attribute `bpy.types.ClothSettings.use_dynamic_mesh`

Make simulation respect deformations in the base mesh (default False)

:type: bool

### attribute `bpy.types.ClothSettings.use_internal_springs`

Simulate an internal volume structure by creating springs connecting the opposite sides of the mesh (default False)

:type: bool

### attribute `bpy.types.ClothSettings.use_pressure`

Simulate pressure inside a closed cloth mesh (default False)

:type: bool

### attribute `bpy.types.ClothSettings.use_pressure_volume`

Use the Target Volume parameter as the initial volume, instead of calculating it from the mesh itself (default False)

:type: bool

### attribute `bpy.types.ClothSettings.use_sewing_springs`

Pulls loose edges together (default False)

:type: bool

### attribute `bpy.types.ClothSettings.vertex_group_bending`

Vertex group for fine control over bending stiffness (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_intern`

Vertex group for fine control over the internal spring stiffness (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_mass`

Vertex Group for pinning of vertices (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_pressure`

Vertex Group for where to apply pressure. Zero weight means no pressure while a weight of one means full pressure. Faces with a vertex that has zero weight will be excluded from the volume calculation. (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_shear_stiffness`

Vertex group for fine control over shear stiffness (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_shrink`

Vertex Group for shrinking cloth (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.vertex_group_structural_stiffness`

Vertex group for fine control over structural stiffness (default "", never None)

:type: str

### attribute `bpy.types.ClothSettings.voxel_cell_size`

Size of the voxel grid cells for interaction effects (in [0.0001, 10000], default 0.1)

:type: float

### classmethod `bpy.types.ClothSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ClothSettings.bl_rna_get_subclass_py`

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

- :class:`ClothModifier.settings`
