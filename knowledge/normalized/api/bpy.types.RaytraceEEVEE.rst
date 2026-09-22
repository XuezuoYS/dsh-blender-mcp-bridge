<!-- source: api/bpy.types.RaytraceEEVEE.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.RaytraceEEVEE`

Quality options for the raytracing pipeline

### attribute `bpy.types.RaytraceEEVEE.backface_radiance_scale`

Amount of the front face lighting to reuse for backface lighting approximation (in [0, 1], default 0.25)

:type: float

### attribute `bpy.types.RaytraceEEVEE.denoise_bilateral`

Blur the resolved radiance using a bilateral filter (default True)

:type: bool

### attribute `bpy.types.RaytraceEEVEE.denoise_spatial`

Reuse neighbor pixels' rays (default True)

:type: bool

### attribute `bpy.types.RaytraceEEVEE.denoise_temporal`

Accumulate samples by reprojecting last tracing results (default True)

:type: bool

### attribute `bpy.types.RaytraceEEVEE.resolution_scale`

Determines the number of rays per pixel. Higher resolution uses more memory. (default ``'2'``)

- ``1``
  1:1 -- Full resolution.
- ``2``
  1:2 -- Render this effect at 50% render resolution.
- ``4``
  1:4 -- Render this effect at 25% render resolution.
- ``8``
  1:8 -- Render this effect at 12.5% render resolution.
- ``16``
  1:16 -- Render this effect at 6.25% render resolution.

:type: Literal['1', '2', '4', '8', '16']

### attribute `bpy.types.RaytraceEEVEE.screen_trace_quality`

Precision of the screen space ray-tracing (in [0, 1], default 0.25)

:type: float

### attribute `bpy.types.RaytraceEEVEE.screen_trace_thickness`

Surface thickness used to detect intersection when using screen-tracing (in [1e-06, inf], default 0.1)

:type: float

### attribute `bpy.types.RaytraceEEVEE.trace_max_roughness`

Maximum roughness to use the tracing pipeline for. Higher roughness surfaces will use fast GI approximation. A value of 1 will disable fast GI approximation. (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.RaytraceEEVEE.use_backface_hit`

Consider rays hitting backfaces as valid (default True)

:type: bool

### attribute `bpy.types.RaytraceEEVEE.use_denoise`

Enable noise reduction techniques for raytraced effects (default True)

:type: bool

### classmethod `bpy.types.RaytraceEEVEE.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.RaytraceEEVEE.bl_rna_get_subclass_py`

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

- :class:`SceneEEVEE.ray_tracing_options`
