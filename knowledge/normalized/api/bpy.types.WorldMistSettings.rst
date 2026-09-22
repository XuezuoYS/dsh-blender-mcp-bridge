<!-- source: api/bpy.types.WorldMistSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.WorldMistSettings`

Mist settings for a World data-block

### attribute `bpy.types.WorldMistSettings.depth`

Distance over which the mist effect fades in (in [0, inf], default 25.0)

:type: float

### attribute `bpy.types.WorldMistSettings.falloff`

Type of transition used to fade mist (default ``'QUADRATIC'``)

- ``QUADRATIC``
  Quadratic -- Use quadratic progression.
- ``LINEAR``
  Linear -- Use linear progression.
- ``INVERSE_QUADRATIC``
  Inverse Quadratic -- Use inverse quadratic progression.

:type: Literal['QUADRATIC', 'LINEAR', 'INVERSE_QUADRATIC']

### attribute `bpy.types.WorldMistSettings.height`

Control how much mist density decreases with height (in [0, 100], default 0.0)

:type: float

### attribute `bpy.types.WorldMistSettings.intensity`

Overall minimum intensity of the mist effect (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.WorldMistSettings.start`

Starting distance of the mist, measured from the camera (in [0, inf], default 5.0)

:type: float

### attribute `bpy.types.WorldMistSettings.use_mist`

Occlude objects with the environment color as they are further away (default False)

:type: bool

### classmethod `bpy.types.WorldMistSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.WorldMistSettings.bl_rna_get_subclass_py`

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

- :class:`World.mist_settings`
