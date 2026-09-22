<!-- source: api/bpy.types.ParticleSettings.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.ParticleSettings`

Particle settings, reusable by multiple particle systems

### data `bpy.types.ParticleSettings.active_instanceweight`

(readonly)

:type: :class:`ParticleDupliWeight` | None

### attribute `bpy.types.ParticleSettings.active_instanceweight_index`

(in [0, inf], default 0)

:type: int

### attribute `bpy.types.ParticleSettings.active_texture`

Active texture slot being displayed

:type: :class:`Texture` | None

### attribute `bpy.types.ParticleSettings.active_texture_index`

Index of active texture slot (in [0, 17], default 0)

:type: int

### attribute `bpy.types.ParticleSettings.adaptive_angle`

How many degrees path has to curve to make another render segment (in [0, 45], default 5)

:type: int

### attribute `bpy.types.ParticleSettings.adaptive_pixel`

How many pixels path has to cover to make another render segment (in [0, 50], default 3)

:type: int

### attribute `bpy.types.ParticleSettings.angular_velocity_factor`

Angular velocity amount (in radians per second) (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.angular_velocity_mode`

What axis is used to change particle rotation with time (default ``'VELOCITY'``)

:type: Literal['NONE', 'VELOCITY', 'HORIZONTAL', 'VERTICAL', 'GLOBAL_X', 'GLOBAL_Y', 'GLOBAL_Z', 'RAND']

### data `bpy.types.ParticleSettings.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.ParticleSettings.apply_effector_to_children`

Apply effectors to children (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.apply_guide_to_children`

(default False)

:type: bool

### attribute `bpy.types.ParticleSettings.bending_random`

Random stiffness of hairs (in [0, 1], default 0.0)

:type: float

### data `bpy.types.ParticleSettings.boids`

(readonly)

:type: :class:`BoidSettings` | None

### attribute `bpy.types.ParticleSettings.branch_threshold`

Threshold of branching (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.brownian_factor`

Amount of random, erratic particle movement (in [0, 200], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_length`

Length of child paths (in [0, 1], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_length_threshold`

Amount of particles left untouched by child path length (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_parting_factor`

Create parting in the children based on parent strands (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_parting_max`

Maximum root to tip angle (tip distance/root distance for long hair) (in [0, 180], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_parting_min`

Minimum root to tip angle (tip distance/root distance for long hair) (in [0, 180], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_percent`

Number of children per parent (in [0, 100000], default 10)

:type: int

### attribute `bpy.types.ParticleSettings.child_radius`

Radius of children around parent (in [0, 100000], default 0.2)

:type: float

### attribute `bpy.types.ParticleSettings.child_roundness`

Roundness of children around parent (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_size`

A multiplier for the child particle size (in [0.001, 100000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_size_random`

Random variation to the size of the child particles (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.child_type`

Create child particles (default ``'NONE'``)

:type: Literal['NONE', 'SIMPLE', 'INTERPOLATED']

### data `bpy.types.ParticleSettings.clump_curve`

Curve defining clump tapering (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.ParticleSettings.clump_factor`

Amount of clumping (in [-1, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.clump_noise_size`

Size of clump noise (in [1e-05, 100000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.clump_shape`

Shape of clumping (in [-0.999, 0.999], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.collision_collection`

Limit colliders to this collection

:type: :class:`Collection` | None

### attribute `bpy.types.ParticleSettings.color_maximum`

Maximum length of the particle color vector (in [0.01, 100], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.count`

Total number of particles (in [0, inf], default 1000)

:type: int

### attribute `bpy.types.ParticleSettings.courant_target`

The relative distance a particle can move before requiring more subframes (target Courant number); 0.01 to 0.3 is the recommended range (in [0.0001, 10], default 0.2)

:type: float

### attribute `bpy.types.ParticleSettings.create_long_hair_children`

Calculate children that suit long hair well (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.damping`

Amount of damping (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.display_color`

Display additional particle data as a color (default ``'MATERIAL'``)

:type: Literal['NONE', 'MATERIAL', 'VELOCITY', 'ACCELERATION']

### attribute `bpy.types.ParticleSettings.display_method`

How particles are displayed in viewport (default ``'RENDER'``)

:type: Literal['NONE', 'RENDER', 'DOT', 'CIRC', 'CROSS', 'AXIS']

### attribute `bpy.types.ParticleSettings.display_percentage`

Percentage of particles to display in 3D view (in [0, 100], default 100)

:type: int

### attribute `bpy.types.ParticleSettings.display_size`

Size of particles on viewport (in [0, 1000], default 0.1)

:type: float

### attribute `bpy.types.ParticleSettings.display_step`

How many steps paths are displayed with (power of 2) (in [0, 10], default 2)

:type: int

### attribute `bpy.types.ParticleSettings.distribution`

How to distribute particles on selected element (default ``'JIT'``)

:type: Literal['JIT', 'RAND', 'GRID']

### attribute `bpy.types.ParticleSettings.drag_factor`

Amount of air drag (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.effect_hair`

Hair stiffness for effectors (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.effector_amount`

How many particles are effectors (0 is all particles) (in [0, 10000], default 0)

:type: int

### data `bpy.types.ParticleSettings.effector_weights`

(readonly)

:type: :class:`EffectorWeights` | None

### attribute `bpy.types.ParticleSettings.emit_from`

Where to emit particles from (default ``'FACE'``)

:type: Literal['VERT', 'FACE', 'VOLUME']

### attribute `bpy.types.ParticleSettings.factor_random`

Give the starting velocity a random variation (in [0, 200], default 0.0)

:type: float

### data `bpy.types.ParticleSettings.fluid`

(readonly)

:type: :class:`SPHFluidSettings` | None

### data `bpy.types.ParticleSettings.force_field_1`

(readonly)

:type: :class:`FieldSettings` | None

### data `bpy.types.ParticleSettings.force_field_2`

(readonly)

:type: :class:`FieldSettings` | None

### attribute `bpy.types.ParticleSettings.frame_end`

Frame number to stop emitting particles (in [-1.04857e+06, 1.04857e+06], default 200.0)

:type: float

### attribute `bpy.types.ParticleSettings.frame_start`

Frame number to start emitting particles (in [-1.04857e+06, 1.04857e+06], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.grid_random`

Add random offset to the grid locations (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.grid_resolution`

The resolution of the particle grid (in [1, 250], default 10)

:type: int

### attribute `bpy.types.ParticleSettings.hair_length`

Length of the hair (in [0, 1000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.hair_step`

Number of hair segments (in [2, 32767], default 5)

:type: int

### attribute `bpy.types.ParticleSettings.hexagonal_grid`

Create the grid in a hexagonal pattern (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.instance_collection`

Show objects in this collection in place of particles

:type: :class:`Collection` | None

### attribute `bpy.types.ParticleSettings.instance_object`

Show this object in place of particles

:type: :class:`Object` | None

### data `bpy.types.ParticleSettings.instance_weights`

Weights for all of the objects in the instance collection (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ParticleDupliWeight`]

### attribute `bpy.types.ParticleSettings.integrator`

Algorithm used to calculate physics, from the fastest to the most stable and accurate: Midpoint, Euler, Verlet, RK4 (default ``'MIDPOINT'``)

:type: Literal['EULER', 'VERLET', 'MIDPOINT', 'RK4']

### attribute `bpy.types.ParticleSettings.invert_grid`

Invert what is considered object and what is not (default False)

:type: bool

### data `bpy.types.ParticleSettings.is_fluid`

Particles were created by a fluid simulation (default False, readonly)

:type: bool

### attribute `bpy.types.ParticleSettings.jitter_factor`

Amount of jitter applied to the sampling (in [0, 2], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.keyed_loops`

Number of times the keys are looped (in [1, 10000], default 1)

:type: int

### attribute `bpy.types.ParticleSettings.keys_step`

(in [0, 32767], default 5)

:type: int

### attribute `bpy.types.ParticleSettings.kink`

Type of periodic offset on the path (default ``'NO'``)

:type: Literal['NO', 'CURL', 'RADIAL', 'WAVE', 'BRAID', 'SPIRAL']

### attribute `bpy.types.ParticleSettings.kink_amplitude`

The amplitude of the offset (in [-100000, 100000], default 0.2)

:type: float

### attribute `bpy.types.ParticleSettings.kink_amplitude_clump`

How much clump affects kink amplitude (in [0, 1], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.kink_amplitude_random`

Random variation of the amplitude (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.kink_axis`

Which axis to use for offset (default ``'Z'``)

:type: Literal[:ref:`rna_enum_axis_xyz_items`]

### attribute `bpy.types.ParticleSettings.kink_axis_random`

Random variation of the orientation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.kink_extra_steps`

Extra steps for resolution of special kink features (in [1, inf], default 4)

:type: int

### attribute `bpy.types.ParticleSettings.kink_flat`

How flat the hairs are (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.kink_frequency`

The frequency of the offset (1/total length) (in [-100000, 100000], default 2.0)

:type: float

### attribute `bpy.types.ParticleSettings.kink_shape`

Adjust the offset to the beginning/end (in [-0.999, 0.999], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.length_random`

Give path length a random variation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.lifetime`

Life span of the particles (in [1, 1.04857e+06], default 50.0)

:type: float

### attribute `bpy.types.ParticleSettings.lifetime_random`

Give the particle life a random variation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.line_length_head`

Length of the line's head (in [0, 100000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.line_length_tail`

Length of the line's tail (in [0, 100000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.lock_boids_to_surface`

Constrain boids to a surface (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.mass`

Mass of the particles (in [1e-08, 100000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.material`

Index of material slot used for rendering particles (in [1, 32767], default 1)

:type: int

### attribute `bpy.types.ParticleSettings.material_slot`

Material slot used for rendering particles (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.ParticleSettings.normal_factor`

Let the surface normal give the particle a starting velocity (in [-1000, 1000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.object_align_factor`

Let the emitter object orientation give the particle a starting velocity (array of 3 items, in [-200, 200], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.ParticleSettings.object_factor`

Let the object give the particle a starting velocity (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.particle_factor`

Let the target particle give the particle a starting velocity (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.particle_size`

The size of the particles (in [0.001, 100000], default 0.05)

:type: float

### attribute `bpy.types.ParticleSettings.path_end`

End time of path (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.path_start`

Starting time of path (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.phase_factor`

Rotation around the chosen orientation axis (in [-1, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.phase_factor_random`

Randomize rotation around the chosen orientation axis (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.physics_type`

Particle physics type (default ``'NEWTON'``)

:type: Literal['NO', 'NEWTON', 'KEYED', 'BOIDS', 'FLUID']

### attribute `bpy.types.ParticleSettings.radius_scale`

Multiplier of diameter properties (in [0, inf], default 0.01)

:type: float

### attribute `bpy.types.ParticleSettings.react_event`

The event of target particles to react on (default ``'DEATH'``)

:type: Literal['DEATH', 'COLLIDE', 'NEAR']

### attribute `bpy.types.ParticleSettings.reactor_factor`

Let the vector away from the target particle's location give the particle a starting velocity (in [-10, 10], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.render_step`

How many steps paths are rendered with (power of 2) (in [0, 20], default 3)

:type: int

### attribute `bpy.types.ParticleSettings.render_type`

How particles are rendered (default ``'HALO'``)

:type: Literal['NONE', 'HALO', 'LINE', 'PATH', 'OBJECT', 'COLLECTION']

### attribute `bpy.types.ParticleSettings.rendered_child_count`

Number of children per parent for rendering (in [0, 100000], default 100)

:type: int

### attribute `bpy.types.ParticleSettings.root_radius`

Strand diameter width at the root (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.rotation_factor_random`

Randomize particle orientation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.rotation_mode`

Particle orientation axis (does not affect Explode modifier's results) (default ``'VEL'``)

:type: Literal['NONE', 'NOR', 'NOR_TAN', 'VEL', 'GLOB_X', 'GLOB_Y', 'GLOB_Z', 'OB_X', 'OB_Y', 'OB_Z']

### attribute `bpy.types.ParticleSettings.roughness_1`

Amount of location dependent roughness (in [0, 100000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.roughness_1_size`

Size of location dependent roughness (in [0.01, 100000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.roughness_2`

Amount of random roughness (in [0, 100000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.roughness_2_size`

Size of random roughness (in [0.01, 100000], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.roughness_2_threshold`

Amount of particles left untouched by random roughness (in [0, 1], default 0.0)

:type: float

### data `bpy.types.ParticleSettings.roughness_curve`

Curve defining roughness (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.ParticleSettings.roughness_end_shape`

Shape of endpoint roughness (in [0, 10], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.roughness_endpoint`

Amount of endpoint roughness (in [0, 100000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.shape`

Strand shape parameter (in [-1, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.show_guide_hairs`

Show guide hairs (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_hair_grid`

Show hair simulation grid (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_health`

Display boid health (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_number`

Show particle number (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_size`

Show particle size (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_unborn`

Show particles before they are emitted (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.show_velocity`

Show particle velocity (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.size_random`

Give the particle size a random variation (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.subframes`

Subframes to simulate for improved stability and finer granularity simulations (dt = timestep / (subframes + 1)) (in [0, 1000], default 0)

:type: int

### attribute `bpy.types.ParticleSettings.tangent_factor`

Let the surface tangent give the particle a starting velocity (in [-1000, 1000], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.tangent_phase`

Rotate the surface tangent (in [-1, 1], default 0.0)

:type: float

### data `bpy.types.ParticleSettings.texture_slots`

Texture slots defining the mapping and influence of textures (default None, readonly)

:type: :class:`ParticleSettingsTextureSlots`\ [:class:`ParticleSettingsTextureSlot`]

### attribute `bpy.types.ParticleSettings.time_tweak`

A multiplier for physics timestep (1.0 means one frame = 1/25 seconds) (in [0, 100], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettings.timestep`

The simulation timestep per frame (seconds per frame) (in [0.0001, 100], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.tip_radius`

Strand diameter width at the tip (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.ParticleSettings.trail_count`

Number of trail particles (in [1, 100000], default 0)

:type: int

### attribute `bpy.types.ParticleSettings.twist`

Number of turns around parent along the strand (in [-100000, 100000], default 0.0)

:type: float

### data `bpy.types.ParticleSettings.twist_curve`

Curve defining twist (readonly)

:type: :class:`CurveMapping` | None

### attribute `bpy.types.ParticleSettings.type`

Particle type (default ``'EMITTER'``)

:type: Literal['EMITTER', 'HAIR']

### attribute `bpy.types.ParticleSettings.use_absolute_path_time`

Path timing is in absolute frames (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_adaptive_subframes`

Automatically set the number of subframes (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_advanced_hair`

Use full physics calculations for growing hair (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_close_tip`

Set tip radius to zero (default True)

:type: bool

### attribute `bpy.types.ParticleSettings.use_clump_curve`

Use a curve to define clump tapering (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_clump_noise`

Create random clumps around the parent (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_collection_count`

Use object multiple times in the same collection (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_collection_pick_random`

Pick objects from collection randomly (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_dead`

Show particles after they have died (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_die_on_collision`

Particles die when they collide with a deflector object (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_dynamic_rotation`

Particle rotations are affected by collisions and effectors (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_emit_random`

Emit in random order of elements (default True)

:type: bool

### attribute `bpy.types.ParticleSettings.use_even_distribution`

Use even distribution from faces based on face areas or edge lengths (default True)

:type: bool

### attribute `bpy.types.ParticleSettings.use_global_instance`

Use object's global coordinates for duplication (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_hair_bspline`

Interpolate hair using B-Splines (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_modifier_stack`

Emit particles from mesh with modifiers applied (must use same subdivision surface level for viewport and render for correct results) (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_multiply_size_mass`

Multiply mass by particle size (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_parent_particles`

Render parent particles (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_react_multiple`

React multiple times (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_react_start_end`

Give birth to unreacted particles eventually (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_regrow_hair`

Regrow hair for each frame (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_render_adaptive`

Display steps of the particle path (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_rotation_instance`

Use object's rotation for duplication (global x-axis is aligned particle rotation axis) (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_rotations`

Calculate particle rotations (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_roughness_curve`

Use a curve to define roughness (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_scale_instance`

Use object's scale for duplication (default True)

:type: bool

### attribute `bpy.types.ParticleSettings.use_self_effect`

Particle effectors affect themselves (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_size_deflect`

Use particle's size in deflection (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_strand_primitive`

Use the strand primitive for rendering (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_twist_curve`

Use a curve to define twist (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_velocity_length`

Multiply line length by particle speed (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.use_whole_collection`

Use whole collection at once (default False)

:type: bool

### attribute `bpy.types.ParticleSettings.userjit`

Emission locations per face (0 = automatic) (in [0, 1000], default 0)

:type: int

### attribute `bpy.types.ParticleSettings.virtual_parents`

Relative amount of virtual parents (in [0, 1], default 0.0)

:type: float

### classmethod `bpy.types.ParticleSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ParticleSettings.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`ID.name`
- :class:`ID.name_full`
- :class:`ID.id_type`
- :class:`ID.session_uid`
- :class:`ID.is_evaluated`
- :class:`ID.original`
- :class:`ID.users`
- :class:`ID.use_fake_user`
- :class:`ID.use_extra_user`
- :class:`ID.is_embedded_data`
- :class:`ID.is_linked_packed`
- :class:`ID.is_missing`
- :class:`ID.is_runtime_data`
- :class:`ID.is_editable`
- :class:`ID.tag`
- :class:`ID.is_library_indirect`
- :class:`ID.library`
- :class:`ID.library_weak_reference`
- :class:`ID.asset_data`
- :class:`ID.override_library`
- :class:`ID.preview`

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
- :class:`ID.bl_system_properties_get`
- :class:`ID.rename`
- :class:`ID.evaluated_get`
- :class:`ID.copy`
- :class:`ID.asset_mark`
- :class:`ID.asset_clear`
- :class:`ID.asset_generate_preview`
- :class:`ID.override_create`
- :class:`ID.override_hierarchy_create`
- :class:`ID.user_clear`
- :class:`ID.user_remap`
- :class:`ID.make_local`
- :class:`ID.user_of_id`
- :class:`ID.animation_data_create`
- :class:`ID.animation_data_clear`
- :class:`ID.update_tag`
- :class:`ID.preview_ensure`
- :class:`ID.bl_rna_get_subclass`
- :class:`ID.bl_rna_get_subclass_py`

:columns: 2

- :mod:`bpy.context.particle_settings`
- :class:`BlendData.particles`
- :class:`BlendDataParticles.new`
- :class:`BlendDataParticles.remove`
- :class:`ParticleSystem.settings`
