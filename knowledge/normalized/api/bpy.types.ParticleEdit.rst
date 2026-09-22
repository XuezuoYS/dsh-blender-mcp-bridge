<!-- source: api/bpy.types.ParticleEdit.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ParticleEdit`

Properties of particle editing mode

### data `bpy.types.ParticleEdit.brush`

(readonly)

:type: :class:`ParticleBrush` | None

### attribute `bpy.types.ParticleEdit.default_key_count`

How many keys to make new particles with (in [2, 32767], default 5)

:type: int

### attribute `bpy.types.ParticleEdit.display_step`

How many steps to display the path with (in [1, 10], default 2)

:type: int

### attribute `bpy.types.ParticleEdit.emitter_distance`

Distance to keep particles away from the emitter (in [-inf, inf], default 0.25)

:type: float

### attribute `bpy.types.ParticleEdit.fade_frames`

How many frames to fade (in [1, 100], default 2)

:type: int

### data `bpy.types.ParticleEdit.is_editable`

A valid edit mode exists (default False, readonly)

:type: bool

### data `bpy.types.ParticleEdit.is_hair`

Editing hair (default False, readonly)

:type: bool

### data `bpy.types.ParticleEdit.object`

The edited object (readonly)

:type: :class:`Object` | None

### attribute `bpy.types.ParticleEdit.select_mode`

Particle select and display mode (default ``'PATH'``)

- ``PATH``
  Path -- Path edit mode.
- ``POINT``
  Point -- Point select mode.
- ``TIP``
  Tip -- Tip select mode.

:type: Literal['PATH', 'POINT', 'TIP']

### attribute `bpy.types.ParticleEdit.shape_object`

Outer shape to use for tools

:type: :class:`Object` | None

### attribute `bpy.types.ParticleEdit.show_particles`

Display actual particles (default False)

:type: bool

### attribute `bpy.types.ParticleEdit.tool`

(default ``'COMB'``)

- ``COMB``
  Comb -- Comb hairs.
- ``SMOOTH``
  Smooth -- Smooth hairs.
- ``ADD``
  Add -- Add hairs.
- ``LENGTH``
  Length -- Make hairs longer or shorter.
- ``PUFF``
  Puff -- Make hairs stand up.
- ``CUT``
  Cut -- Cut hairs.
- ``WEIGHT``
  Weight -- Weight hair particles.

:type: Literal['COMB', 'SMOOTH', 'ADD', 'LENGTH', 'PUFF', 'CUT', 'WEIGHT']

### attribute `bpy.types.ParticleEdit.type`

(default ``'PARTICLES'``)

:type: Literal['PARTICLES', 'SOFT_BODY', 'CLOTH']

### attribute `bpy.types.ParticleEdit.use_auto_velocity`

Calculate point velocities automatically (default True)

:type: bool

### attribute `bpy.types.ParticleEdit.use_default_interpolate`

Interpolate new particles from the existing ones (default False)

:type: bool

### attribute `bpy.types.ParticleEdit.use_emitter_deflect`

Keep paths from intersecting the emitter (default True)

:type: bool

### attribute `bpy.types.ParticleEdit.use_fade_time`

Fade paths and keys further away from current frame (default False)

:type: bool

### attribute `bpy.types.ParticleEdit.use_preserve_length`

Keep path lengths constant (default True)

:type: bool

### attribute `bpy.types.ParticleEdit.use_preserve_root`

Keep root keys unmodified (default True)

:type: bool

### classmethod `bpy.types.ParticleEdit.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ParticleEdit.bl_rna_get_subclass_py`

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

- :class:`ToolSettings.particle_edit`
