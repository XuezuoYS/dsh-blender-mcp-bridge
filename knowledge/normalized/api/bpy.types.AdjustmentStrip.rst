<!-- source: api/bpy.types.AdjustmentStrip.rst -->

base classes --- :class:`bpy_struct`, :class:`Strip`, :class:`EffectStrip`

### class `bpy.types.AdjustmentStrip`

Sequence strip to perform filter adjustments to layers below

### attribute `bpy.types.AdjustmentStrip.animation_offset_end`

Animation end offset (trim end) (in [0, inf], default 0)

### attribute `bpy.types.AdjustmentStrip.animation_offset_start`

deprecated: 5.10 removal planned in version 6.0
Replaced by '.content_trim_end'.

:type: int
Animation start offset (trim start) (in [0, inf], default 0)

### attribute `bpy.types.AdjustmentStrip.content_trim_end`

deprecated: 5.10 removal planned in version 6.0
Replaced by '.content_trim_start'.

:type: int
Number of frames to ignore from the end of the underlying source. The source content is trimmed, and future frames are turned into holds (in [0, inf], default 0)

:type: int

### attribute `bpy.types.AdjustmentStrip.content_trim_start`

Number of frames to ignore from the start of the underlying source. The source content is trimmed, and previous frames are turned into holds (in [0, inf], default 0)

:type: int

### data `bpy.types.AdjustmentStrip.input_count`

(in [0, inf], default 0, readonly)

:type: int

### classmethod `bpy.types.AdjustmentStrip.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.AdjustmentStrip.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Strip.name`
- :class:`Strip.type`
- :class:`Strip.select`
- :class:`Strip.select_left_handle`
- :class:`Strip.select_right_handle`
- :class:`Strip.mute`
- :class:`Strip.lock`
- :class:`Strip.frame_final_duration`
- :class:`Strip.duration`
- :class:`Strip.frame_duration`
- :class:`Strip.content_duration`
- :class:`Strip.frame_start`
- :class:`Strip.content_start`
- :class:`Strip.content_end`
- :class:`Strip.frame_final_start`
- :class:`Strip.left_handle`
- :class:`Strip.frame_final_end`
- :class:`Strip.right_handle`
- :class:`Strip.frame_offset_start`
- :class:`Strip.left_handle_offset`
- :class:`Strip.frame_offset_end`
- :class:`Strip.right_handle_offset`
- :class:`Strip.channel`
- :class:`Strip.blend_type`
- :class:`Strip.blend_alpha`
- :class:`Strip.effect_fader`
- :class:`Strip.use_default_fade`
- :class:`Strip.color_tag`
- :class:`Strip.modifiers`
- :class:`Strip.show_retiming_keys`
- :class:`Strip.connections`
- :class:`EffectStrip.use_deinterlace`
- :class:`EffectStrip.alpha_mode`
- :class:`EffectStrip.use_flip_x`
- :class:`EffectStrip.use_flip_y`
- :class:`EffectStrip.use_float`
- :class:`EffectStrip.use_reverse_frames`
- :class:`EffectStrip.color_multiply`
- :class:`EffectStrip.multiply_alpha`
- :class:`EffectStrip.color_saturation`
- :class:`EffectStrip.strobe`
- :class:`EffectStrip.transform`
- :class:`EffectStrip.crop`
- :class:`EffectStrip.use_proxy`
- :class:`EffectStrip.proxy`

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
- :class:`Strip.bl_system_properties_get`
- :class:`Strip.strip_elem_from_frame`
- :class:`Strip.swap`
- :class:`Strip.move_to_meta`
- :class:`Strip.parent_meta`
- :class:`Strip.invalidate_cache`
- :class:`Strip.split`
- :class:`Strip.bl_rna_get_subclass`
- :class:`Strip.bl_rna_get_subclass_py`
- :class:`EffectStrip.bl_rna_get_subclass`
- :class:`EffectStrip.bl_rna_get_subclass_py`
