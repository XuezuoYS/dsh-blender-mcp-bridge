<!-- source: api/bpy.types.GreasePencilFrame.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.GreasePencilFrame`

A Grease Pencil keyframe

### attribute `bpy.types.GreasePencilFrame.drawing`

A Grease Pencil drawing

:type: :class:`GreasePencilDrawing` | None

### data `bpy.types.GreasePencilFrame.frame_number`

The frame number in the scene (in [-1048574, 1048574], default 0, readonly)

:type: int

### attribute `bpy.types.GreasePencilFrame.keyframe_type`

Type of keyframe (default ``'KEYFRAME'``)

- ``KEYFRAME``
  Keyframe -- Normal keyframe, e.g. for key poses.
- ``BREAKDOWN``
  Breakdown -- A breakdown pose, e.g. for transitions between key poses.
- ``MOVING_HOLD``
  Moving Hold -- A keyframe that is part of a moving hold.
- ``EXTREME``
  Extreme -- An 'extreme' pose, or some other purpose as needed.
- ``JITTER``
  Jitter -- A filler or baked keyframe for keying on ones, or some other purpose as needed.
- ``GENERATED``
  Generated -- A key generated automatically by a tool, not manually created.

:type: Literal['KEYFRAME', 'BREAKDOWN', 'MOVING_HOLD', 'EXTREME', 'JITTER', 'GENERATED']

### attribute `bpy.types.GreasePencilFrame.select`

Frame Selection in the Dope Sheet (default False)

:type: bool

### classmethod `bpy.types.GreasePencilFrame.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilFrame.bl_rna_get_subclass_py`

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

- :class:`GreasePencilFrames.copy`
- :class:`GreasePencilFrames.move`
- :class:`GreasePencilFrames.new`
- :class:`GreasePencilLayer.current_frame`
- :class:`GreasePencilLayer.frames`
- :class:`GreasePencilLayer.get_frame_at`
