<!-- source: api/bpy.types.BakeSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.BakeSettings`

Bake data for a Scene data-block

### attribute `bpy.types.BakeSettings.cage_extrusion`

Inflate the active object by the specified distance for baking. This helps matching to points nearer to the outside of the selected object meshes. (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.BakeSettings.cage_object`

Object to use as cage instead of calculating the cage from the active object with cage extrusion

:type: :class:`Object` | None

### attribute `bpy.types.BakeSettings.displacement_space`

Choose displacement space for baking (default ``'OBJECT'``)

- ``OBJECT``
  Object -- Bake the displacement in object space.
- ``TANGENT``
  Tangent -- Bake the displacement in tangent space.

:type: Literal['OBJECT', 'TANGENT']

### attribute `bpy.types.BakeSettings.filepath`

Image filepath to use when saving externally (default "//", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.BakeSettings.height`

Vertical dimension of the baking map (in [4, 10000], default 512)

:type: int

### data `bpy.types.BakeSettings.image_settings`

(readonly, never None)

:type: :class:`ImageFormatSettings`

### attribute `bpy.types.BakeSettings.margin`

Extends the baked result as a post process filter (in [0, 32767], default 16)

:type: int

### attribute `bpy.types.BakeSettings.margin_type`

Algorithm to extend the baked result (default ``'ADJACENT_FACES'``)

:type: Literal[:ref:`rna_enum_bake_margin_type_items`]

### attribute `bpy.types.BakeSettings.max_ray_distance`

The maximum ray distance for matching points between the active and selected objects. If zero, there is no limit. (in [0, inf], default 0.0)

:type: float

### attribute `bpy.types.BakeSettings.normal_b`

Axis to bake in blue channel (default ``'POS_X'``)

:type: Literal[:ref:`rna_enum_normal_swizzle_items`]

### attribute `bpy.types.BakeSettings.normal_g`

Axis to bake in green channel (default ``'POS_X'``)

:type: Literal[:ref:`rna_enum_normal_swizzle_items`]

### attribute `bpy.types.BakeSettings.normal_r`

Axis to bake in red channel (default ``'POS_X'``)

:type: Literal[:ref:`rna_enum_normal_swizzle_items`]

### attribute `bpy.types.BakeSettings.normal_space`

Choose normal space for baking (default ``'TANGENT'``)

:type: Literal[:ref:`rna_enum_normal_space_items`]

### data `bpy.types.BakeSettings.pass_filter`

Passes to include in the active baking pass (default {``'COLOR'``, ``'DIFFUSE'``, ``'DIRECT'``, ``'EMIT'``, ``'GLOSSY'``, ``'INDIRECT'``, ``'TRANSMISSION'``}, readonly)

:type: set[Literal[:ref:`rna_enum_bake_pass_filter_type_items`]]

### attribute `bpy.types.BakeSettings.save_mode`

Where to save baked image textures (default ``'INTERNAL'``)

:type: Literal[:ref:`rna_enum_bake_save_mode_items`]

### attribute `bpy.types.BakeSettings.target`

Where to output the baked map (default ``'IMAGE_TEXTURES'``)

:type: Literal[:ref:`rna_enum_bake_target_items`]

### attribute `bpy.types.BakeSettings.type`

Choose shading information to bake into the image (default ``'NORMALS'``)

- ``NORMALS``
  Normals -- Bake normals.
- ``DISPLACEMENT``
  Displacement -- Bake displacement.
- ``VECTOR_DISPLACEMENT``
  Vector Displacement -- Bake vector displacement.

:type: Literal['NORMALS', 'DISPLACEMENT', 'VECTOR_DISPLACEMENT']

### attribute `bpy.types.BakeSettings.use_automatic_name`

Automatically name the output file with the pass type (external only) (default False)

:type: bool

### attribute `bpy.types.BakeSettings.use_cage`

Cast rays to active object from a cage (default False)

:type: bool

### attribute `bpy.types.BakeSettings.use_clear`

Clear Images before baking (internal only) (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_lores_mesh`

Calculate heights against unsubdivided low resolution mesh (default False)

:type: bool

### attribute `bpy.types.BakeSettings.use_multires`

Bake directly from multires object (default False)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_color`

Color the pass (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_diffuse`

Add diffuse contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_direct`

Add direct lighting contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_emit`

Add emission contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_glossy`

Add glossy contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_indirect`

Add indirect lighting contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_pass_transmission`

Add transmission contribution (default True)

:type: bool

### attribute `bpy.types.BakeSettings.use_selected_to_active`

Bake shading on the surface of selected objects to the active object (default False)

:type: bool

### attribute `bpy.types.BakeSettings.use_split_materials`

Split external images per material (external only) (default False)

:type: bool

### attribute `bpy.types.BakeSettings.view_from`

Source of reflection ray directions (default ``'ABOVE_SURFACE'``)

- ``ABOVE_SURFACE``
  Above Surface -- Cast rays from above the surface.
- ``ACTIVE_CAMERA``
  Active Camera -- Use the active camera's position to cast rays.

:type: Literal['ABOVE_SURFACE', 'ACTIVE_CAMERA']

### attribute `bpy.types.BakeSettings.width`

Horizontal dimension of the baking map (in [4, 10000], default 512)

:type: int

### classmethod `bpy.types.BakeSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.BakeSettings.bl_rna_get_subclass_py`

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

- :class:`RenderSettings.bake`
