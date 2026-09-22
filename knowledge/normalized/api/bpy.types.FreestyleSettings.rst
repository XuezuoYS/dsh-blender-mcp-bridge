<!-- source: api/bpy.types.FreestyleSettings.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.FreestyleSettings`

Freestyle settings for a ViewLayer data-block

### attribute `bpy.types.FreestyleSettings.as_render_pass`

Renders Freestyle output to a separate pass instead of overlaying it on the Combined pass (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.crease_angle`

Angular threshold for detecting crease edges (in [0, 3.14159], default 0.0)

:type: float

### attribute `bpy.types.FreestyleSettings.kr_derivative_epsilon`

Kr derivative epsilon for computing suggestive contours (in [-1000, 1000], default 0.0)

:type: float

### data `bpy.types.FreestyleSettings.linesets`

(default None, readonly)

:type: :class:`Linesets`\ [:class:`FreestyleLineSet`]

### attribute `bpy.types.FreestyleSettings.mode`

Select the Freestyle control mode (default ``'SCRIPT'``)

- ``SCRIPT``
  Python Scripting -- Advanced mode for using style modules written in Python.
- ``EDITOR``
  Parameter Editor -- Basic mode for interactive style parameter editing.

:type: Literal['SCRIPT', 'EDITOR']

### data `bpy.types.FreestyleSettings.modules`

A list of style modules (to be applied from top to bottom) (default None, readonly)

:type: :class:`FreestyleModules`\ [:class:`FreestyleModuleSettings`]

### attribute `bpy.types.FreestyleSettings.sphere_radius`

Sphere radius for computing curvatures (in [0, 1000], default 1.0)

:type: float

### attribute `bpy.types.FreestyleSettings.use_culling`

If enabled, out-of-view edges are ignored (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.use_material_boundaries`

Enable material boundaries (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.use_ridges_and_valleys`

Enable ridges and valleys (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.use_smoothness`

Take face smoothness into account in view map calculation (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.use_suggestive_contours`

Enable suggestive contours (default False)

:type: bool

### attribute `bpy.types.FreestyleSettings.use_view_map_cache`

Keep the computed view map and avoid recalculating it if mesh geometry is unchanged (default False)

:type: bool

### classmethod `bpy.types.FreestyleSettings.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.FreestyleSettings.bl_rna_get_subclass_py`

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

- :class:`ViewLayer.freestyle_settings`
