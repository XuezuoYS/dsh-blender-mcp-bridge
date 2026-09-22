<!-- source: api/bpy.types.Camera.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Camera`

Camera data-block for storing camera settings

### attribute `bpy.types.Camera.angle`

Camera lens field of view (in [0.00640536, 3.01675], default 0.69115)

:type: float

### attribute `bpy.types.Camera.angle_x`

Camera lens horizontal field of view (in [0.00640536, 3.01675], default 0.0)

:type: float

### attribute `bpy.types.Camera.angle_y`

Camera lens vertical field of view (in [0.00640536, 3.01675], default 0.0)

:type: float

### data `bpy.types.Camera.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### data `bpy.types.Camera.background_images`

List of background images (default None, readonly)

:type: :class:`CameraBackgroundImages`\ [:class:`CameraBackgroundImage`]

### attribute `bpy.types.Camera.central_cylindrical_radius`

Radius of the virtual cylinder (in [1e-05, inf], default 1.0)

:type: float

### attribute `bpy.types.Camera.central_cylindrical_range_u_max`

Maximum Longitude value for the central cylindrical lens (in [-inf, inf], default 3.14159)

:type: float

### attribute `bpy.types.Camera.central_cylindrical_range_u_min`

Minimum Longitude value for the central cylindrical lens (in [-inf, inf], default -3.14159)

:type: float

### attribute `bpy.types.Camera.central_cylindrical_range_v_max`

Maximum Height value for the central cylindrical lens (in [-inf, inf], default 1.0)

:type: float

### attribute `bpy.types.Camera.central_cylindrical_range_v_min`

Minimum Height value for the central cylindrical lens (in [-inf, inf], default -1.0)

:type: float

### attribute `bpy.types.Camera.clip_end`

Camera far clipping distance (in [1e-06, inf], default 1000.0)

:type: float

### attribute `bpy.types.Camera.clip_start`

Camera near clipping distance (in [1e-06, inf], default 0.1)

:type: float

### attribute `bpy.types.Camera.composition_guide_color`

Color and alpha for compositional guide overlays (array of 4 items, in [0, inf], default (0.5, 0.5, 0.5, 1.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.Camera.custom_bytecode`

Compiled bytecode of the custom shader (default "", never None)

:type: str

### attribute `bpy.types.Camera.custom_bytecode_hash`

Hash of the compiled bytecode of the custom shader, for quick equality checking (default "", never None)

:type: str

### attribute `bpy.types.Camera.custom_filepath`

Path to the shader defining the custom camera (default "", never None)

:type: str

### attribute `bpy.types.Camera.custom_mode`

(default ``'INTERNAL'``)

- ``INTERNAL``
  Internal -- Use internal text data-block.
- ``EXTERNAL``
  External -- Use external file.

:type: Literal['INTERNAL', 'EXTERNAL']

### attribute `bpy.types.Camera.custom_shader`

Shader defining the custom camera

:type: :class:`Text` | None

### attribute `bpy.types.Camera.display_size`

Apparent size of the Camera object in the 3D View (in [0.01, 1000], default 1.0)

:type: float

### data `bpy.types.Camera.dof`

(readonly)

:type: :class:`CameraDOFSettings` | None

### attribute `bpy.types.Camera.fisheye_fov`

Field of view for the fisheye lens (in [0.1745, 31.4159], default 3.14159)

:type: float

### attribute `bpy.types.Camera.fisheye_lens`

Lens focal length (mm) (in [0.01, 100], default 10.5)

:type: float

### attribute `bpy.types.Camera.fisheye_polynomial_k0`

Coefficient K0 of the lens polynomial (in [-inf, inf], default -1.17351e-05)

:type: float

### attribute `bpy.types.Camera.fisheye_polynomial_k1`

Coefficient K1 of the lens polynomial (in [-inf, inf], default -0.0199887)

:type: float

### attribute `bpy.types.Camera.fisheye_polynomial_k2`

Coefficient K2 of the lens polynomial (in [-inf, inf], default -3.3525e-06)

:type: float

### attribute `bpy.types.Camera.fisheye_polynomial_k3`

Coefficient K3 of the lens polynomial (in [-inf, inf], default 3.0993e-06)

:type: float

### attribute `bpy.types.Camera.fisheye_polynomial_k4`

Coefficient K4 of the lens polynomial (in [-inf, inf], default -2.61e-08)

:type: float

### attribute `bpy.types.Camera.latitude_max`

Maximum latitude (vertical angle) for the equirectangular lens (in [-1.5708, 1.5708], default 1.5708)

:type: float

### attribute `bpy.types.Camera.latitude_min`

Minimum latitude (vertical angle) for the equirectangular lens (in [-1.5708, 1.5708], default -1.5708)

:type: float

### attribute `bpy.types.Camera.lens`

Perspective Camera focal length value in millimeters (in [1, inf], default 50.0)

:type: float

### attribute `bpy.types.Camera.lens_unit`

Unit to edit lens in for the user interface (default ``'MILLIMETERS'``)

- ``MILLIMETERS``
  Millimeters -- Specify focal length of the lens in millimeters.
- ``FOV``
  Field of View -- Specify the lens as the field of view's angle.

:type: Literal['MILLIMETERS', 'FOV']

### attribute `bpy.types.Camera.longitude_max`

Maximum longitude (horizontal angle) for the equirectangular lens (in [-inf, inf], default 3.14159)

:type: float

### attribute `bpy.types.Camera.longitude_min`

Minimum longitude (horizontal angle) for the equirectangular lens (in [-inf, inf], default -3.14159)

:type: float

### attribute `bpy.types.Camera.ortho_scale`

Orthographic Camera scale (similar to zoom) (in [0, inf], default 6.0)

:type: float

### attribute `bpy.types.Camera.panorama_type`

Distortion to use for the calculation (default ``'FISHEYE_EQUISOLID'``)

- ``EQUIRECTANGULAR``
  Equirectangular -- Spherical camera for environment maps, also known as Lat Long panorama.
- ``EQUIANGULAR_CUBEMAP_FACE``
  Equiangular Cubemap Face -- Single face of an equiangular cubemap.
- ``MIRRORBALL``
  Mirror Ball -- Mirror ball mapping for environment maps.
- ``FISHEYE_EQUIDISTANT``
  Fisheye Equidistant -- Ideal for fulldomes, ignore the sensor dimensions.
- ``FISHEYE_EQUISOLID``
  Fisheye Equisolid -- Similar to most fisheye modern lens, takes sensor dimensions into consideration.
- ``FISHEYE_LENS_POLYNOMIAL``
  Fisheye Lens Polynomial -- Defines the lens projection as polynomial to allow real world camera lenses to be mimicked.
- ``CENTRAL_CYLINDRICAL``
  Central Cylindrical -- Projection onto a virtual cylinder from its center, similar as a rotating panoramic camera.

:type: Literal['EQUIRECTANGULAR', 'EQUIANGULAR_CUBEMAP_FACE', 'MIRRORBALL', 'FISHEYE_EQUIDISTANT', 'FISHEYE_EQUISOLID', 'FISHEYE_LENS_POLYNOMIAL', 'CENTRAL_CYLINDRICAL']

### attribute `bpy.types.Camera.passepartout_alpha`

Opacity (alpha) of the darkened overlay in Camera view (in [0, 1], default 0.5)

:type: float

### attribute `bpy.types.Camera.sensor_fit`

Method to fit image and field of view angle inside the sensor (default ``'AUTO'``)

- ``AUTO``
  Auto -- Fit to the sensor width or height depending on image resolution.
- ``HORIZONTAL``
  Horizontal -- Fit to the sensor width.
- ``VERTICAL``
  Vertical -- Fit to the sensor height.

:type: Literal['AUTO', 'HORIZONTAL', 'VERTICAL']

### attribute `bpy.types.Camera.sensor_height`

Vertical size of the image sensor area in millimeters (in [1, inf], default 24.0)

:type: float

### attribute `bpy.types.Camera.sensor_width`

Horizontal size of the image sensor area in millimeters (in [1, inf], default 36.0)

:type: float

### attribute `bpy.types.Camera.shift_x`

Camera horizontal shift (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Camera.shift_y`

Camera vertical shift (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.Camera.show_background_images`

Display reference images behind objects in the 3D View (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_center`

Display center composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_center_diagonal`

Display diagonal center composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_golden`

Display golden ratio composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_golden_tria_a`

Display golden triangle A composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_golden_tria_b`

Display golden triangle B composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_harmony_tri_a`

Display harmony A composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_harmony_tri_b`

Display harmony B composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_composition_thirds`

Display rule of thirds composition guide inside the camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_limits`

Display the clipping range and focus point on the camera (default False)

:type: bool

### attribute `bpy.types.Camera.show_mist`

Display a line from the Camera to indicate the mist area (default False)

:type: bool

### attribute `bpy.types.Camera.show_name`

Show the active Camera's name in Camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_passepartout`

Show a darkened overlay outside the image area in Camera view (default True)

:type: bool

### attribute `bpy.types.Camera.show_safe_areas`

Show TV title safe and action safe areas in Camera view (default False)

:type: bool

### attribute `bpy.types.Camera.show_safe_center`

Show safe areas to fit content in a different aspect ratio (default False)

:type: bool

### attribute `bpy.types.Camera.show_sensor`

Show sensor size (film gate) in Camera view (default False)

:type: bool

### data `bpy.types.Camera.stereo`

(readonly, never None)

:type: :class:`CameraStereoData`

### attribute `bpy.types.Camera.type`

Camera types (default ``'PERSP'``)

:type: Literal['PERSP', 'ORTHO', 'PANO', 'CUSTOM']

### method `bpy.types.Camera.view_frame`

Return 4 points for the cameras frame (before object transformation)

:param scene: Scene to use for aspect calculation, when omitted 1:1 aspect is used (optional)
:type scene: :class:`Scene` | None
:return:
   ``result_1``, Result, :class:`mathutils.Vector`

   ``result_2``, Result, :class:`mathutils.Vector`

   ``result_3``, Result, :class:`mathutils.Vector`

   ``result_4``, Result, :class:`mathutils.Vector`

:rtype: tuple[:class:`mathutils.Vector`, :class:`mathutils.Vector`, :class:`mathutils.Vector`, :class:`mathutils.Vector`]

### classmethod `bpy.types.Camera.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Camera.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.camera`
- :class:`BlendData.cameras`
- :class:`BlendDataCameras.new`
- :class:`BlendDataCameras.remove`
- :class:`RenderEngine.update_custom_camera`
