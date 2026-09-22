<!-- source: api/bpy.types.MetaBall.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.MetaBall`

Metaball data-block to define blobby surfaces

### data `bpy.types.MetaBall.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### data `bpy.types.MetaBall.elements`

Metaball elements (default None, readonly)

:type: :class:`MetaBallElements`\ [:class:`MetaElement`]

### data `bpy.types.MetaBall.is_editmode`

True when used in editmode (default False, readonly)

:type: bool

### data `bpy.types.MetaBall.materials`

(default None, readonly)

:type: :class:`IDMaterials`\ [:class:`Material`]

### attribute `bpy.types.MetaBall.render_resolution`

Polygonization resolution in rendering (in [0.005, 10000], default 0.2)

:type: float

### attribute `bpy.types.MetaBall.resolution`

Polygonization resolution in the 3D viewport (in [0.005, 10000], default 0.4)

:type: float

### attribute `bpy.types.MetaBall.texspace_location`

Texture space location (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MetaBall.texspace_size`

Texture space size (array of 3 items, in [-inf, inf], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.MetaBall.threshold`

Influence of metaball elements (in [0, 5], default 0.6)

:type: float

### attribute `bpy.types.MetaBall.update_method`

Metaball edit update behavior (default ``'UPDATE_ALWAYS'``)

- ``UPDATE_ALWAYS``
  Always -- While editing, update metaball always.
- ``HALFRES``
  Half -- While editing, update metaball in half resolution.
- ``FAST``
  Fast -- While editing, update metaball without polygonization.
- ``NEVER``
  Never -- While editing, don't update metaball at all.

:type: Literal['UPDATE_ALWAYS', 'HALFRES', 'FAST', 'NEVER']

### attribute `bpy.types.MetaBall.use_auto_texspace`

Adjust active object's texture space automatically when transforming object (default True)

:type: bool

### method `bpy.types.MetaBall.transform`

Transform metaball elements by a matrix

:param matrix: Matrix (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]

### method `bpy.types.MetaBall.update_gpu_tag`

update_gpu_tag

### classmethod `bpy.types.MetaBall.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MetaBall.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.meta_ball`
- :class:`BlendData.metaballs`
- :class:`BlendDataMetaBalls.new`
- :class:`BlendDataMetaBalls.remove`
