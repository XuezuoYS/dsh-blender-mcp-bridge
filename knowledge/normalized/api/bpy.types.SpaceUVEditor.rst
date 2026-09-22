<!-- source: api/bpy.types.SpaceUVEditor.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.SpaceUVEditor`

UV editor data for the image editor space

### attribute `bpy.types.SpaceUVEditor.custom_grid_subdivisions`

Number of grid units in UV space that make one UV Unit (array of 2 items, in [1, 5000], default (0, 0))

:type: :class:`bpy_prop_array`\ [int]

### attribute `bpy.types.SpaceUVEditor.display_stretch_type`

Type of stretch to display (default ``'ANGLE'``)

- ``ANGLE``
  Angle -- Angular distortion between UV and 3D angles.
- ``AREA``
  Area -- Area distortion between UV and 3D faces.

:type: Literal['ANGLE', 'AREA']

### attribute `bpy.types.SpaceUVEditor.edge_display_type`

Display style for UV edges (default ``'OUTLINE'``)

- ``OUTLINE``
  Outline -- Display white edges with black outline.
- ``DASH``
  Dash -- Display dashed black-white edges.
- ``BLACK``
  Black -- Display black edges.
- ``WHITE``
  White -- Display white edges.

:type: Literal['OUTLINE', 'DASH', 'BLACK', 'WHITE']

### attribute `bpy.types.SpaceUVEditor.grid_shape_source`

Specify source for the grid shape (default ``'DYNAMIC'``)

- ``DYNAMIC``
  Dynamic -- Dynamic grid.
- ``FIXED``
  Fixed -- Manually set grid divisions.
- ``PIXEL``
  Pixel -- Grid aligns with pixels from image.

:type: Literal['DYNAMIC', 'FIXED', 'PIXEL']

### attribute `bpy.types.SpaceUVEditor.lock_bounds`

Constraint to stay within the image bounds while editing (default False)

:type: bool

### attribute `bpy.types.SpaceUVEditor.pixel_round_mode`

Round UVs to pixels while editing (default ``'DISABLED'``)

- ``DISABLED``
  Disabled -- Don't round to pixels.
- ``CORNER``
  Corner -- Round to pixel corners.
- ``CENTER``
  Center -- Round to pixel centers.

:type: Literal['DISABLED', 'CORNER', 'CENTER']

### attribute `bpy.types.SpaceUVEditor.show_faces`

Display faces over the image (default True)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_grid_over_image`

Show the grid over the image (default True)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_metadata`

Display metadata properties of the image (default False)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_modified_edges`

Display edges after modifiers are applied (default False)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_pixel_coords`

Display UV coordinates in pixels rather than from 0.0 to 1.0 (default True)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_stretch`

Display faces colored according to the difference in shape between UVs and their 3D coordinates (blue for low distortion, red for high distortion) (default False)

:type: bool

### attribute `bpy.types.SpaceUVEditor.show_uv`

Display overlay of UV layer (default True)

:type: bool

### attribute `bpy.types.SpaceUVEditor.stretch_opacity`

Opacity of the UV Stretch overlay (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.SpaceUVEditor.tile_grid_shape`

How many tiles will be shown in the background (array of 2 items, in [1, 100], default (0, 0))

:type: :class:`bpy_prop_array`\ [int]

### attribute `bpy.types.SpaceUVEditor.use_live_unwrap`

Continuously unwrap the selected UV island while transforming pinned vertices (default False)

:type: bool

### attribute `bpy.types.SpaceUVEditor.uv_edge_opacity`

Opacity of edges in UV overlays (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.SpaceUVEditor.uv_face_opacity`

Opacity of faces in UV overlays (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.SpaceUVEditor.uv_opacity`

Opacity of UV overlays (in [0, 1], default 0.0)

:type: float

### classmethod `bpy.types.SpaceUVEditor.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.SpaceUVEditor.bl_rna_get_subclass_py`

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

- :class:`SpaceImageEditor.uv_editor`
