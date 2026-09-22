<!-- source: api/bpy.types.StripModifier.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.StripModifier`

:caption: Subclasses
:maxdepth: 1

bpy.types.BrightContrastModifier.rst
bpy.types.ColorBalanceModifier.rst
bpy.types.CurvesModifier.rst
bpy.types.EchoModifier.rst
bpy.types.HueCorrectModifier.rst
bpy.types.MaskStripModifier.rst
bpy.types.PitchModifier.rst
bpy.types.SequencerCompositorModifierData.rst
bpy.types.SequencerTonemapModifierData.rst
bpy.types.SoundEqualizerModifier.rst
bpy.types.WhiteBalanceModifier.rst
Modifier for sequence strip

### attribute `bpy.types.StripModifier.enable`

Use modifier during render (default True)

:type: bool

### attribute `bpy.types.StripModifier.input_mask_id`

Mask ID used as mask input for the modifier

:type: :class:`Mask` | None

### attribute `bpy.types.StripModifier.input_mask_strip`

Strip used as mask input for the modifier

:type: :class:`Strip` | None

### attribute `bpy.types.StripModifier.input_mask_type`

Type of input data used for mask (default ``'STRIP'``)

- ``STRIP``
  Strip -- Use sequencer strip as mask input.
- ``ID``
  Mask -- Use mask ID as mask input.

:type: Literal['STRIP', 'ID']

### attribute `bpy.types.StripModifier.is_active`

This modifier is active (default False)

:type: bool

### attribute `bpy.types.StripModifier.mask_time`

Time to use for the Mask animation (default ``'RELATIVE'``)

- ``RELATIVE``
  Relative -- Mask animation is offset to start of strip.
- ``ABSOLUTE``
  Absolute -- Mask animation is in sync with scene frame.

:type: Literal['RELATIVE', 'ABSOLUTE']

### attribute `bpy.types.StripModifier.mute`

Mute this modifier (default False)

:type: bool

### attribute `bpy.types.StripModifier.name`

(default "", never None)

:type: str

### attribute `bpy.types.StripModifier.show_expanded`

Mute expanded settings for the modifier (default False)

:type: bool

### attribute `bpy.types.StripModifier.show_preview`

Display modifier in preview (default False)

:type: bool

### data `bpy.types.StripModifier.type`

(default ``'BRIGHT_CONTRAST'``, readonly)

:type: Literal[:ref:`rna_enum_strip_modifier_type_items`]

### classmethod `bpy.types.StripModifier.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.StripModifier.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.strip_modifier`
- :class:`Strip.modifiers`
- :class:`StripModifiers.active`
- :class:`StripModifiers.new`
- :class:`StripModifiers.remove`
