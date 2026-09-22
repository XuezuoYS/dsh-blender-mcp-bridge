<!-- source: api/bpy.types.PropertyGroupItem.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.PropertyGroupItem`

Property that stores arbitrary, user defined properties

### attribute `bpy.types.PropertyGroupItem.bool`

(default False)

:type: bool

### attribute `bpy.types.PropertyGroupItem.bool_array`

(array of 1 items, default (False,))

:type: :class:`bpy_prop_array`\ [bool]

### data `bpy.types.PropertyGroupItem.collection`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`PropertyGroup`]

### attribute `bpy.types.PropertyGroupItem.double`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.PropertyGroupItem.double_array`

(array of 1 items, in [-inf, inf], default (0.0,))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.PropertyGroupItem.enum`

(default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.PropertyGroupItem.float`

(in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.PropertyGroupItem.float_array`

(array of 1 items, in [-inf, inf], default (0.0,))

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.PropertyGroupItem.group`

(readonly)

:type: :class:`PropertyGroup` | None

### attribute `bpy.types.PropertyGroupItem.id`

:type: :class:`ID` | None

### data `bpy.types.PropertyGroupItem.idp_array`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`PropertyGroup`]

### attribute `bpy.types.PropertyGroupItem.int`

(in [-inf, inf], default 0)

:type: int

### attribute `bpy.types.PropertyGroupItem.int_array`

(array of 1 items, in [-inf, inf], default (0,))

:type: :class:`bpy_prop_array`\ [int]

### attribute `bpy.types.PropertyGroupItem.string`

(default "", never None)

:type: str

### classmethod `bpy.types.PropertyGroupItem.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.PropertyGroupItem.bl_rna_get_subclass_py`

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
