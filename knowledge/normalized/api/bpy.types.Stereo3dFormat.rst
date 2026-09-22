<!-- source: api/bpy.types.Stereo3dFormat.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Stereo3dFormat`

Settings for stereo output

### attribute `bpy.types.Stereo3dFormat.anaglyph_type`

(default ``'RED_CYAN'``)

:type: Literal[:ref:`rna_enum_stereo3d_anaglyph_type_items`]

### attribute `bpy.types.Stereo3dFormat.display_mode`

(default ``'ANAGLYPH'``)

- ``ANAGLYPH``
  Anaglyph -- Render views for left and right eyes as two differently filtered colors in a single image (anaglyph glasses are required).
- ``INTERLACE``
  Interlace -- Render views for left and right eyes interlaced in a single image (3D-ready monitor is required).
- ``SIDEBYSIDE``
  Side-by-Side -- Render views for left and right eyes side-by-side.
- ``TOPBOTTOM``
  Top-Bottom -- Render views for left and right eyes one above another.

:type: Literal['ANAGLYPH', 'INTERLACE', 'SIDEBYSIDE', 'TOPBOTTOM']

### attribute `bpy.types.Stereo3dFormat.interlace_type`

(default ``'ROW_INTERLEAVED'``)

:type: Literal[:ref:`rna_enum_stereo3d_interlace_type_items`]

### attribute `bpy.types.Stereo3dFormat.use_interlace_swap`

Swap left and right stereo channels (default False)

:type: bool

### attribute `bpy.types.Stereo3dFormat.use_sidebyside_crosseyed`

Right eye should see left image and vice versa (default False)

:type: bool

### attribute `bpy.types.Stereo3dFormat.use_squeezed_frame`

Combine both views in a squeezed image (default False)

:type: bool

### classmethod `bpy.types.Stereo3dFormat.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Stereo3dFormat.bl_rna_get_subclass_py`

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

- :class:`Image.stereo_3d_format`
- :class:`ImageStrip.stereo_3d_format`
- :class:`MovieStrip.stereo_3d_format`
- :class:`ImageFormatSettings.stereo_3d_format`
- :class:`UILayout.template_image_stereo_3d`
