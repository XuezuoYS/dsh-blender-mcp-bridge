<!-- source: api/bpy.types.View3DShading.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.View3DShading`

Settings for shading in the 3D viewport

### attribute `bpy.types.View3DShading.aov_name`

Name of the active Shader AOV (default "", never None)

:type: str

### attribute `bpy.types.View3DShading.background_color`

Color for custom background color (array of 3 items, in [0, 1], default (0.05, 0.05, 0.05))

:type: :class:`mathutils.Color`

### attribute `bpy.types.View3DShading.background_type`

Way to display the background (default ``'THEME'``)

- ``THEME``
  Theme -- Use the theme for background color.
- ``WORLD``
  World -- Use the world for background color.
- ``VIEWPORT``
  Custom -- Use a custom color limited to this viewport only.

:type: Literal['THEME', 'WORLD', 'VIEWPORT']

### attribute `bpy.types.View3DShading.cavity_ridge_factor`

Factor for the cavity ridges (in [0, 250], default 1.0)

:type: float

### attribute `bpy.types.View3DShading.cavity_type`

Way to display the cavity shading (default ``'SCREEN'``)

- ``WORLD``
  World -- Cavity shading computed in world space, useful for larger-scale occlusion.
- ``SCREEN``
  Screen -- Curvature-based shading, useful for making fine details more visible.
- ``BOTH``
  Both -- Use both effects simultaneously.

:type: Literal['WORLD', 'SCREEN', 'BOTH']

### attribute `bpy.types.View3DShading.cavity_valley_factor`

Factor for the cavity valleys (in [0, 250], default 1.0)

:type: float

### attribute `bpy.types.View3DShading.color_type`

Color Type (default ``'MATERIAL'``)

- ``MATERIAL``
  Material -- Show material color.
- ``OBJECT``
  Object -- Show object color.
- ``RANDOM``
  Random -- Show random object color.
- ``VERTEX``
  Attribute -- Show active color attribute.
- ``TEXTURE``
  Texture -- Show the texture from the active image texture node using the active UV map coordinates.
- ``SINGLE``
  Custom -- Show scene in a single custom color.

:type: Literal['MATERIAL', 'OBJECT', 'RANDOM', 'VERTEX', 'TEXTURE', 'SINGLE']

### attribute `bpy.types.View3DShading.curvature_ridge_factor`

Factor for the curvature ridges (in [0, 2], default 1.0)

:type: float

### attribute `bpy.types.View3DShading.curvature_valley_factor`

Factor for the curvature valleys (in [0, 2], default 1.0)

:type: float

### attribute `bpy.types.View3DShading.light`

Lighting Method for Solid/Texture Viewport Shading (default ``'STUDIO'``)

- ``STUDIO``
  Studio -- Display using studio lighting.
- ``MATCAP``
  MatCap -- Display using matcap material and lighting.
- ``FLAT``
  Flat -- Display using flat lighting.

:type: Literal['STUDIO', 'MATCAP', 'FLAT']

### attribute `bpy.types.View3DShading.object_outline_color`

Color for object outline (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.View3DShading.render_pass`

Render Pass to show in the viewport (default ``'COMBINED'``)

:type: Literal['COMBINED', 'EMISSION', 'ENVIRONMENT', 'AO', 'SHADOW', 'TRANSPARENT', 'DIFFUSE_LIGHT', 'DIFFUSE_COLOR', 'SPECULAR_LIGHT', 'SPECULAR_COLOR', 'VOLUME_LIGHT', 'POSITION', 'NORMAL', 'MIST', 'CryptoObject', 'CryptoAsset', 'CryptoMaterial', 'AOV']

### data `bpy.types.View3DShading.selected_studio_light`

Selected StudioLight (readonly)

:type: :class:`StudioLight` | None

### attribute `bpy.types.View3DShading.shadow_intensity`

Darkness of shadows (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.View3DShading.show_backface_culling`

Use back face culling to hide the back side of faces (default False)

:type: bool

### attribute `bpy.types.View3DShading.show_cavity`

Show Cavity (default False)

:type: bool

### attribute `bpy.types.View3DShading.show_object_outline`

Show Object Outline (default False)

:type: bool

### attribute `bpy.types.View3DShading.show_shadows`

Show Shadow (default False)

:type: bool

### attribute `bpy.types.View3DShading.show_specular_highlight`

Render specular highlights (default True)

:type: bool

### attribute `bpy.types.View3DShading.show_xray`

Show whole scene transparent (default False)

:type: bool

### attribute `bpy.types.View3DShading.show_xray_wireframe`

Show whole scene transparent (default True)

:type: bool

### attribute `bpy.types.View3DShading.single_color`

Color for single color mode (array of 3 items, in [0, 1], default (0.8, 0.8, 0.8))

:type: :class:`mathutils.Color`

### attribute `bpy.types.View3DShading.studio_light`

Studio lighting setup (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.View3DShading.studiolight_background_alpha`

Show the studiolight in the background (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.View3DShading.studiolight_background_blur`

Blur the studiolight in the background (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.View3DShading.studiolight_intensity`

Strength of the studiolight (in [0, inf], default 1.0)

:type: float

### attribute `bpy.types.View3DShading.studiolight_rotate_z`

Rotation of the studiolight around the Z-Axis (in [-3.14159, 3.14159], default 0.0)

:type: float

### attribute `bpy.types.View3DShading.type`

Method to display/shade objects in the 3D View (default ``'SOLID'``)

:type: Literal[:ref:`rna_enum_shading_type_items`]

### attribute `bpy.types.View3DShading.use_compositor`

When to preview the compositor output inside the viewport (default ``'DISABLED'``)

- ``DISABLED``
  Disabled -- The compositor is disabled.
- ``CAMERA``
  Camera -- The compositor is enabled only in camera view.
- ``ALWAYS``
  Always -- The compositor is always enabled regardless of the view.

:type: Literal['DISABLED', 'CAMERA', 'ALWAYS']

### attribute `bpy.types.View3DShading.use_dof`

Use depth of field on viewport using the values from the active camera (default False)

:type: bool

### attribute `bpy.types.View3DShading.use_scene_lights`

Render lights and light probes of the scene (default False)

:type: bool

### attribute `bpy.types.View3DShading.use_scene_lights_render`

Render lights and light probes of the scene (default True)

:type: bool

### attribute `bpy.types.View3DShading.use_scene_world`

Use scene world for lighting (default False)

:type: bool

### attribute `bpy.types.View3DShading.use_scene_world_render`

Use scene world for lighting (default True)

:type: bool

### attribute `bpy.types.View3DShading.use_studiolight_view_rotation`

Make the HDR rotation fixed and not follow the camera (default True)

:type: bool

### attribute `bpy.types.View3DShading.use_world_space_lighting`

Make the lighting fixed and not follow the camera (default False)

:type: bool

### attribute `bpy.types.View3DShading.wireframe_color_type`

Wire Color Type (default ``'THEME'``)

- ``THEME``
  Theme -- Show scene wireframes with the theme's wire color.
- ``OBJECT``
  Object -- Show object color on wireframe.
- ``RANDOM``
  Random -- Show random object color on wireframe.

:type: Literal['THEME', 'OBJECT', 'RANDOM']

### attribute `bpy.types.View3DShading.xray_alpha`

Amount of opacity to use (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.View3DShading.xray_alpha_wireframe`

Amount of opacity to use (in [0, 1], default 0.5)

:type: float

### method `bpy.types.View3DShading.bl_system_properties_get`

DEBUG ONLY. Internal access to runtime-defined RNA data storage, intended solely for testing and debugging purposes. Do not access it in regular scripting work, and in particular, do not assume that it contains writable data

:param do_create: Ensure that system properties are created if they do not exist yet (optional)
:type do_create: bool
:return: The system properties root container, or None if there are no system properties stored in this data yet, and its creation was not requested
:rtype: :class:`PropertyGroup`

### classmethod `bpy.types.View3DShading.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.View3DShading.bl_rna_get_subclass_py`

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

- :class:`SceneDisplay.shading`
- :class:`SpaceView3D.shading`
- :class:`XrSessionSettings.shading`
