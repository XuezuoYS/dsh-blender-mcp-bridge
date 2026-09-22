<!-- source: api/bpy.types.ShapeKey.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.ShapeKey`

Shape key in a shape keys data-block

### data `bpy.types.ShapeKey.data`

(default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`UnknownType`]

### data `bpy.types.ShapeKey.frame`

Frame for absolute keys (in [-inf, inf], default 0.0, readonly)

:type: float

### attribute `bpy.types.ShapeKey.interpolation`

Interpolation type for absolute shape keys (default ``'KEY_LINEAR'``)

:type: Literal['KEY_LINEAR', 'KEY_CARDINAL', 'KEY_CATMULL_ROM', 'KEY_BSPLINE']

### attribute `bpy.types.ShapeKey.lock_shape`

Protect the shape key from accidental sculpting and editing (default False)

:type: bool

### attribute `bpy.types.ShapeKey.mute`

Toggle this shape key (default False)

:type: bool

### attribute `bpy.types.ShapeKey.name`

Name of Shape Key (default "", never None)

:type: str

### data `bpy.types.ShapeKey.points`

Optimized access to shape keys point data, when using foreach_get/foreach_set accessors. Warning: Does not support legacy Curve shape keys. (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ShapeKeyPoint`]

### attribute `bpy.types.ShapeKey.relative_key`

Shape used as a relative key (never None)

:type: :class:`ShapeKey`

### attribute `bpy.types.ShapeKey.select`

Shape key selection state (default False)

:type: bool

### attribute `bpy.types.ShapeKey.slider_max`

Maximum for slider (in [-10, 10], default 1.0)

:type: float

### attribute `bpy.types.ShapeKey.slider_min`

Minimum for slider (in [-10, 10], default 0.0)

:type: float

### attribute `bpy.types.ShapeKey.value`

Value of shape key at the current frame (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.ShapeKey.vertex_group`

Vertex weight group, to blend with basis shape (default "", never None)

:type: str

### method `bpy.types.ShapeKey.normals_vertex_get`

Compute local space vertices' normals for this shape key

:return: normals, (dynamic array, in [-1, 1])
:rtype: :class:`bpy_prop_array`\ [float]

### method `bpy.types.ShapeKey.normals_polygon_get`

Compute local space faces' normals for this shape key

:return: normals, (dynamic array, in [-1, 1])
:rtype: :class:`bpy_prop_array`\ [float]

### method `bpy.types.ShapeKey.normals_split_get`

Compute local space face corners' normals for this shape key

:return: normals, (dynamic array, in [-1, 1])
:rtype: :class:`bpy_prop_array`\ [float]

### classmethod `bpy.types.ShapeKey.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ShapeKey.bl_rna_get_subclass_py`

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

- :class:`ClothSettings.rest_shape_key`
- :class:`Key.key_blocks`
- :class:`Key.reference_key`
- :class:`Object.active_shape_key`
- :class:`Object.shape_key_add`
- :class:`Object.shape_key_remove`
- :class:`Object.shape_keys_selected`
- :class:`ShapeKey.relative_key`
