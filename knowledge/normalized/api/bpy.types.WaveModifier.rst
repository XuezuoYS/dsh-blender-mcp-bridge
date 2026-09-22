<!-- source: api/bpy.types.WaveModifier.rst -->

base classes --- :class:`bpy_struct`, :class:`Modifier`

### class `bpy.types.WaveModifier`

Wave effect modifier

### attribute `bpy.types.WaveModifier.damping_time`

Number of frames in which the wave damps out after it dies (in [-1.04857e+06, 1.04857e+06], default 10.0)

:type: float

### attribute `bpy.types.WaveModifier.falloff_radius`

Distance after which it fades out (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.WaveModifier.height`

Height of the wave (in [-inf, inf], default 0.5)

:type: float

### attribute `bpy.types.WaveModifier.invert_vertex_group`

Invert vertex group influence (default False)

:type: bool

### attribute `bpy.types.WaveModifier.lifetime`

Lifetime of the wave in frames, zero means infinite (in [-1.04857e+06, 1.04857e+06], default 0.0)

:type: float

### attribute `bpy.types.WaveModifier.narrowness`

Distance between the top and the base of a wave, the higher the value, the more narrow the wave (in [0, inf], default 1.5)

:type: float

### attribute `bpy.types.WaveModifier.speed`

Speed of the wave, towards the starting point when negative (in [-inf, inf], default 0.25)

:type: float

### attribute `bpy.types.WaveModifier.start_position_object`

Object which defines the wave center

:type: :class:`Object` | None

### attribute `bpy.types.WaveModifier.start_position_x`

X coordinate of the start position (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.WaveModifier.start_position_y`

Y coordinate of the start position (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.WaveModifier.texture`

:type: :class:`Texture` | None

### attribute `bpy.types.WaveModifier.texture_coords`

(default ``'LOCAL'``)

- ``LOCAL``
  Local -- Use the local coordinate system for the texture coordinates.
- ``GLOBAL``
  Global -- Use the global coordinate system for the texture coordinates.
- ``OBJECT``
  Object -- Use the linked object's local coordinate system for the texture coordinates.
- ``UV``
  UV -- Use UV coordinates for the texture coordinates.

:type: Literal['LOCAL', 'GLOBAL', 'OBJECT', 'UV']

### attribute `bpy.types.WaveModifier.texture_coords_bone`

Bone to set the texture coordinates (default "", never None)

:type: str

### attribute `bpy.types.WaveModifier.texture_coords_object`

Object to set the texture coordinates

:type: :class:`Object` | None

### attribute `bpy.types.WaveModifier.time_offset`

Either the starting frame (for positive speed) or ending frame (for negative speed) (in [-1.04857e+06, 1.04857e+06], default 0.0)

:type: float

### attribute `bpy.types.WaveModifier.use_cyclic`

Cyclic wave effect (default True)

:type: bool

### attribute `bpy.types.WaveModifier.use_normal`

Displace along normals (default False)

:type: bool

### attribute `bpy.types.WaveModifier.use_normal_x`

Enable displacement along the X normal (default True)

:type: bool

### attribute `bpy.types.WaveModifier.use_normal_y`

Enable displacement along the Y normal (default True)

:type: bool

### attribute `bpy.types.WaveModifier.use_normal_z`

Enable displacement along the Z normal (default True)

:type: bool

### attribute `bpy.types.WaveModifier.use_x`

X axis motion (default True)

:type: bool

### attribute `bpy.types.WaveModifier.use_y`

Y axis motion (default True)

:type: bool

### attribute `bpy.types.WaveModifier.uv_layer`

UV map name (default "", never None)

:type: str

### attribute `bpy.types.WaveModifier.vertex_group`

Vertex group name for modulating the wave (default "", never None)

:type: str

### attribute `bpy.types.WaveModifier.width`

Distance between the waves (in [0, inf], default 1.5)

:type: float

### classmethod `bpy.types.WaveModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.WaveModifier.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Modifier.name`
- :class:`Modifier.type`
- :class:`Modifier.show_viewport`
- :class:`Modifier.show_render`
- :class:`Modifier.show_in_editmode`
- :class:`Modifier.show_on_cage`
- :class:`Modifier.show_expanded`
- :class:`Modifier.is_active`
- :class:`Modifier.use_pin_to_last`
- :class:`Modifier.is_override_data`
- :class:`Modifier.use_apply_on_spline`
- :class:`Modifier.execution_time`
- :class:`Modifier.persistent_uid`

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
- :class:`Modifier.bl_rna_get_subclass`
- :class:`Modifier.bl_rna_get_subclass_py`
