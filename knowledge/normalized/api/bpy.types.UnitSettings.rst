<!-- source: api/bpy.types.UnitSettings.rst -->

base class --- :class:`bpy_struct`

### attribute `bpy.types.UnitSettings.length_unit`

Unit that will be used to display length values (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.UnitSettings.mass_unit`

Unit that will be used to display mass values (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.UnitSettings.scale_length`

Scale to use when converting between Blender units and dimensions. When working at microscopic or astronomical scale, a small or large unit scale respectively can be used to avoid numerical precision problems (in [1e-09, inf], default 0.0)

:type: float

### attribute `bpy.types.UnitSettings.system`

The unit system to use for user interface controls (default ``'NONE'``)

:type: Literal['NONE', 'METRIC', 'IMPERIAL']

### attribute `bpy.types.UnitSettings.system_rotation`

Unit to use for displaying/editing rotation values (default ``'DEGREES'``)

- ``DEGREES``
  Degrees -- Use degrees for measuring angles and rotations.
- ``RADIANS``
  Radians.

:type: Literal['DEGREES', 'RADIANS']

### attribute `bpy.types.UnitSettings.temperature_unit`

Unit that will be used to display temperature values (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.UnitSettings.time_unit`

Unit that will be used to display time values (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.UnitSettings.use_separate`

Display units in pairs (e.g. 1m 0cm) (default False)

:type: bool

### classmethod `bpy.types.UnitSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.UnitSettings.bl_rna_get_subclass_py`

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

- :class:`Scene.unit_settings`
