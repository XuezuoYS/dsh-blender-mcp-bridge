<!-- source: api/bpy.types.Lattice.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Lattice`

Lattice data-block defining a grid for deforming other objects

### data `bpy.types.Lattice.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.Lattice.interpolation_type_u`

(default ``'KEY_BSPLINE'``)

:type: Literal['KEY_LINEAR', 'KEY_CARDINAL', 'KEY_CATMULL_ROM', 'KEY_BSPLINE']

### attribute `bpy.types.Lattice.interpolation_type_v`

(default ``'KEY_BSPLINE'``)

:type: Literal['KEY_LINEAR', 'KEY_CARDINAL', 'KEY_CATMULL_ROM', 'KEY_BSPLINE']

### attribute `bpy.types.Lattice.interpolation_type_w`

(default ``'KEY_BSPLINE'``)

:type: Literal['KEY_LINEAR', 'KEY_CARDINAL', 'KEY_CATMULL_ROM', 'KEY_BSPLINE']

### data `bpy.types.Lattice.is_editmode`

True when used in editmode (default False, readonly)

:type: bool

### data `bpy.types.Lattice.points`

Points of the lattice (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`LatticePoint`]

### attribute `bpy.types.Lattice.points_u`

Points in U direction (cannot be changed when there are shape keys) (in [1, 64], default 0)

:type: int

### attribute `bpy.types.Lattice.points_v`

Points in V direction (cannot be changed when there are shape keys) (in [1, 64], default 0)

:type: int

### attribute `bpy.types.Lattice.points_w`

Points in W direction (cannot be changed when there are shape keys) (in [1, 64], default 0)

:type: int

### data `bpy.types.Lattice.shape_keys`

(readonly)

:type: :class:`Key` | None

### attribute `bpy.types.Lattice.use_outside`

Only display and take into account the outer vertices (default False)

:type: bool

### attribute `bpy.types.Lattice.vertex_group`

Vertex group to apply the influence of the lattice (default "", never None)

:type: str

### method `bpy.types.Lattice.transform`

Transform lattice by a matrix

:param matrix: Matrix (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]
:param shape_keys: Transform Shape Keys (optional)
:type shape_keys: bool

### method `bpy.types.Lattice.update_gpu_tag`

update_gpu_tag

### method `bpy.types.Lattice.unit_test_compare`

unit_test_compare

:param lattice: Lattice to compare to (optional)
:type lattice: :class:`Lattice` | None
:param threshold: Threshold, Comparison tolerance threshold (in [0, inf], optional)
:type threshold: float
:return: Return value, String description of result of comparison (never None)
:rtype: str

### classmethod `bpy.types.Lattice.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Lattice.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`ID.name`
- :class:`ID.name_full`
- :class:`ID.id_type`
- :class:`ID.session_uid`
- :class:`ID.is_evaluated`
- :class:`ID.original`
- :class:`ID.users`
- :class:`ID.use_fake_user`
- :class:`ID.use_extra_user`
- :class:`ID.is_embedded_data`
- :class:`ID.is_linked_packed`
- :class:`ID.is_missing`
- :class:`ID.is_runtime_data`
- :class:`ID.is_editable`
- :class:`ID.tag`
- :class:`ID.is_library_indirect`
- :class:`ID.library`
- :class:`ID.library_weak_reference`
- :class:`ID.asset_data`
- :class:`ID.override_library`
- :class:`ID.preview`

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
- :class:`ID.bl_system_properties_get`
- :class:`ID.rename`
- :class:`ID.evaluated_get`
- :class:`ID.copy`
- :class:`ID.asset_mark`
- :class:`ID.asset_clear`
- :class:`ID.asset_generate_preview`
- :class:`ID.override_create`
- :class:`ID.override_hierarchy_create`
- :class:`ID.user_clear`
- :class:`ID.user_remap`
- :class:`ID.make_local`
- :class:`ID.user_of_id`
- :class:`ID.animation_data_create`
- :class:`ID.animation_data_clear`
- :class:`ID.update_tag`
- :class:`ID.preview_ensure`
- :class:`ID.bl_rna_get_subclass`
- :class:`ID.bl_rna_get_subclass_py`

:columns: 2

- :mod:`bpy.context.lattice`
- :class:`BlendData.lattices`
- :class:`BlendDataLattices.new`
- :class:`BlendDataLattices.remove`
- :class:`Lattice.unit_test_compare`
