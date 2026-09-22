<!-- source: api/bpy.types.DynamicPaintSurface.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.DynamicPaintSurface`

A canvas surface layer

### attribute `bpy.types.DynamicPaintSurface.brush_collection`

Only use brush objects from this collection

:type: :class:`Collection` | None

### attribute `bpy.types.DynamicPaintSurface.brush_influence_scale`

Adjust influence brush objects have on this surface (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.brush_radius_scale`

Adjust radius of proximity brushes or particles for this surface (in [0, 10], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.color_dry_threshold`

The wetness level when colors start to shift to the background (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.color_spread_speed`

How fast colors get mixed within wet paint (in [0, 2], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.depth_clamp`

Maximum level of depth intersection in object space (use 0.0 to disable) (in [0, 50], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.displace_factor`

Strength of displace when applied to the mesh (in [-50, 50], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.displace_type`

(default ``'DISPLACE'``)

:type: Literal['DISPLACE', 'DEPTH']

### attribute `bpy.types.DynamicPaintSurface.dissolve_speed`

Approximately in how many frames should dissolve happen (in [1, 10000], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.drip_acceleration`

How much surface acceleration affects dripping (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.drip_velocity`

How much surface velocity affects dripping (in [-200, 200], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.dry_speed`

Approximately in how many frames should drying happen (in [1, 10000], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.effect_ui`

(default ``'SPREAD'``)

:type: Literal['SPREAD', 'DRIP', 'SHRINK']

### data `bpy.types.DynamicPaintSurface.effector_weights`

(readonly)

:type: :class:`EffectorWeights` | None

### attribute `bpy.types.DynamicPaintSurface.frame_end`

Simulation end frame (in [1, 1048574], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.frame_start`

Simulation start frame (in [1, 1048574], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.frame_substeps`

Do extra frames between scene frames to ensure smooth motion (in [0, 20], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.image_fileformat`

(default ``'PNG'``)

:type: Literal['PNG', 'OPENEXR']

### attribute `bpy.types.DynamicPaintSurface.image_output_path`

Directory to save the textures (default "", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.DynamicPaintSurface.image_resolution`

Output image resolution (in [16, 4096], default 0)

:type: int

### attribute `bpy.types.DynamicPaintSurface.init_color`

Initial color of the surface (array of 4 items, in [0, inf], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.DynamicPaintSurface.init_color_type`

(default ``'NONE'``)

:type: Literal['NONE', 'COLOR', 'TEXTURE', 'VERTEX_COLOR']

### attribute `bpy.types.DynamicPaintSurface.init_layername`

(default "", never None)

:type: str

### attribute `bpy.types.DynamicPaintSurface.init_texture`

:type: :class:`Texture` | None

### attribute `bpy.types.DynamicPaintSurface.is_active`

Toggle whether surface is processed or ignored (default False)

:type: bool

### data `bpy.types.DynamicPaintSurface.is_cache_user`

(default False, readonly)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.name`

Surface name (default "", never None)

:type: str

### attribute `bpy.types.DynamicPaintSurface.output_name_a`

Name used to save output from this surface (default "", never None)

:type: str

### attribute `bpy.types.DynamicPaintSurface.output_name_b`

Name used to save output from this surface (default "", never None)

:type: str

### data `bpy.types.DynamicPaintSurface.point_cache`

(readonly, never None)

:type: :class:`PointCache`

### attribute `bpy.types.DynamicPaintSurface.shrink_speed`

How fast shrink effect moves on the canvas surface (in [0.001, 10], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.spread_speed`

How fast spread effect moves on the canvas surface (in [0.001, 10], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.surface_format`

Surface Format (default ``'VERTEX'``)

:type: Literal['VERTEX', 'IMAGE']

### attribute `bpy.types.DynamicPaintSurface.surface_type`

Surface Type (default ``'PAINT'``)

:type: Literal['PAINT']

### attribute `bpy.types.DynamicPaintSurface.use_antialiasing`

Use 5× multisampling to smooth paint edges (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_dissolve`

Enable to make surface changes disappear over time (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_dissolve_log`

Use logarithmic dissolve (makes high values to fade faster than low values) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_drip`

Process drip effect (drip wet paint to gravity direction) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_dry_log`

Use logarithmic drying (makes high values to dry faster than low values) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_drying`

Enable to make surface wetness dry over time (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_incremental_displace`

New displace is added cumulatively on top of existing (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_output_a`

Save this output layer (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_output_b`

Save this output layer (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_premultiply`

Multiply color by alpha (recommended for Blender input) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_shrink`

Process shrink effect (shrink paint areas) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_spread`

Process spread effect (spread wet paint around surface) (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.use_wave_open_border`

Pass waves through mesh edges (default False)

:type: bool

### attribute `bpy.types.DynamicPaintSurface.uv_layer`

UV map name (default "", never None)

:type: str

### attribute `bpy.types.DynamicPaintSurface.wave_damping`

Wave damping factor (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.wave_smoothness`

Limit maximum steepness of wave slope between simulation points (use higher values for smoother waves at expense of reduced detail) (in [0, 10], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.wave_speed`

Wave propagation speed (in [0.01, 5], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.wave_spring`

Spring force that pulls water level back to zero (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.DynamicPaintSurface.wave_timescale`

Wave time scaling factor (in [0.01, 3], default 0.0)

:type: float

### method `bpy.types.DynamicPaintSurface.output_exists`

Checks if surface output layer of given name exists

:param object: (never None)
:type object: :class:`Object` | None
:param index: Index, (in [0, 1])
:type index: int
:rtype: bool

### classmethod `bpy.types.DynamicPaintSurface.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.DynamicPaintSurface.bl_rna_get_subclass_py`

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

- :class:`DynamicPaintCanvasSettings.canvas_surfaces`
- :class:`DynamicPaintSurfaces.active`
