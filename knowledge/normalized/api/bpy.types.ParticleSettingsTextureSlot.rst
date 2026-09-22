<!-- source: api/bpy.types.ParticleSettingsTextureSlot.rst -->

base classes --- :class:`bpy_struct`, :class:`TextureSlot`

### class `bpy.types.ParticleSettingsTextureSlot`

Texture slot for textures in a Particle Settings data-block

### attribute `bpy.types.ParticleSettingsTextureSlot.clump_factor`

Amount texture affects child clump (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.damp_factor`

Amount texture affects particle damping (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.density_factor`

Amount texture affects particle density (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.field_factor`

Amount texture affects particle force fields (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.gravity_factor`

Amount texture affects particle gravity (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.kink_amp_factor`

Amount texture affects child kink amplitude (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.kink_freq_factor`

Amount texture affects child kink frequency (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.length_factor`

Amount texture affects child hair length (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.life_factor`

Amount texture affects particle life time (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.mapping`

(default ``'FLAT'``)

- ``FLAT``
  Flat -- Map X and Y coordinates directly.
- ``CUBE``
  Cube -- Map using the normal vector.
- ``TUBE``
  Tube -- Map with Z as central axis.
- ``SPHERE``
  Sphere -- Map with Z as central axis.

:type: Literal['FLAT', 'CUBE', 'TUBE', 'SPHERE']

### attribute `bpy.types.ParticleSettingsTextureSlot.mapping_x`

(default ``'X'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.ParticleSettingsTextureSlot.mapping_y`

(default ``'Y'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.ParticleSettingsTextureSlot.mapping_z`

(default ``'Z'``)

:type: Literal['NONE', 'X', 'Y', 'Z']

### attribute `bpy.types.ParticleSettingsTextureSlot.object`

Object to use for mapping with Object texture coordinates

:type: :class:`Object` | None

### attribute `bpy.types.ParticleSettingsTextureSlot.rough_factor`

Amount texture affects child roughness (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.size_factor`

Amount texture affects physical particle size (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.texture_coords`

Texture coordinates used to map the texture onto the background (default ``'UV'``)

- ``GLOBAL``
  Global -- Use global coordinates for the texture coordinates.
- ``OBJECT``
  Object -- Use linked object's coordinates for texture coordinates.
- ``UV``
  UV -- Use UV coordinates for texture coordinates.
- ``ORCO``
  Generated -- Use the original undeformed coordinates of the object.
- ``STRAND``
  Strand / Particle -- Use normalized strand texture coordinate (1D) or particle age (X) and trail position (Y).

:type: Literal['GLOBAL', 'OBJECT', 'UV', 'ORCO', 'STRAND']

### attribute `bpy.types.ParticleSettingsTextureSlot.time_factor`

Amount texture affects particle emission time (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.twist_factor`

Amount texture affects child twist (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_clump`

Affect the child clumping (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_damp`

Affect the particle velocity damping (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_density`

Affect the density of the particles (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_field`

Affect the particle force fields (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_gravity`

Affect the particle gravity (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_kink_amp`

Affect the child kink amplitude (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_kink_freq`

Affect the child kink frequency (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_length`

Affect the child hair length (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_life`

Affect the life time of the particles (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_rough`

Affect the child rough (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_size`

Affect the particle size (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_time`

Affect the emission time of the particles (default True)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_twist`

Affect the child twist (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.use_map_velocity`

Affect the particle initial velocity (default False)

:type: bool

### attribute `bpy.types.ParticleSettingsTextureSlot.uv_layer`

UV map to use for mapping with UV texture coordinates (default "", never None)

:type: str

### attribute `bpy.types.ParticleSettingsTextureSlot.velocity_factor`

Amount texture affects particle initial velocity (in [-inf, inf], default 1.0)

:type: float

### classmethod `bpy.types.ParticleSettingsTextureSlot.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ParticleSettingsTextureSlot.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`TextureSlot.texture`
- :class:`TextureSlot.name`
- :class:`TextureSlot.offset`
- :class:`TextureSlot.scale`
- :class:`TextureSlot.color`
- :class:`TextureSlot.blend_type`
- :class:`TextureSlot.default_value`
- :class:`TextureSlot.output_node`

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
- :class:`TextureSlot.bl_rna_get_subclass`
- :class:`TextureSlot.bl_rna_get_subclass_py`

:columns: 2

- :class:`ParticleSettings.texture_slots`
- :class:`ParticleSettingsTextureSlots.add`
- :class:`ParticleSettingsTextureSlots.create`
