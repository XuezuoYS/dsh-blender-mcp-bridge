<!-- source: api/bpy.types.Image.rst -->

The Image data-block is a shallow wrapper around image or video file(s)
(on disk, as packed data, or generated).

All actual data like the pixel buffer, size, resolution etc. is
cached in an :class:`imbuf.types.ImBuf` image buffer (or several buffers
in some cases, like UDIM textures, multi-views, animations...).

Several properties and functions of the Image data-block are then actually
using/modifying its image buffer, and not the Image data-block itself.

warning: 
One key limitation is that image buffers are not shared between different
Image data-blocks, and they are not duplicated when copying an image.

So until a modified image buffer is saved on disk, duplicating its Image
data-block will not propagate the underlying buffer changes to the new Image.
This example script generates an Image data-block with a given size,
change its first pixel, rescale it, and duplicates the image.

The duplicated image still has the same size and colors as the original image
at its creation, all editing in the original image's buffer is 'lost' in its copy.

literalinclude: ./examples/bpy.types.Image.0.py
base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Image`

Image data-block referencing an external or packed image

### attribute `bpy.types.Image.alpha_mode`

Representation of alpha in the image file, to convert to and from when saving and loading the image (default ``'STRAIGHT'``)

- ``STRAIGHT``
  Straight -- Store RGB and alpha channels separately with alpha acting as a mask, also known as unassociated alpha. Commonly used by image editing applications and file formats like PNG..
- ``PREMUL``
  Premultiplied -- Store RGB channels with alpha multiplied in, also known as associated alpha. The natural format for renders and used by file formats like OpenEXR..
- ``CHANNEL_PACKED``
  Channel Packed -- Different images are packed in the RGB and alpha channels, and they should not affect each other. Channel packing is commonly used by game engines to save memory..
- ``NONE``
  None -- Ignore alpha channel from the file and make image fully opaque.

:type: Literal['STRAIGHT', 'PREMUL', 'CHANNEL_PACKED', 'NONE']

### data `bpy.types.Image.channels`

Number of channels in pixels buffer (in [0, inf], default 0, readonly)

:type: int

### data `bpy.types.Image.colorspace_settings`

Input color space settings (readonly)

:type: :class:`ColorManagedInputColorspaceSettings` | None

### data `bpy.types.Image.depth`

Image bit depth (in [0, inf], default 0, readonly)

:type: int

### attribute `bpy.types.Image.display_aspect`

Display Aspect for this image, does not affect rendering (array of 2 items, in [0.1, inf], default (1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Image.file_format`

Format used for re-saving this file (default ``'TARGA'``)

:type: Literal[:ref:`rna_enum_image_type_all_items`]

### attribute `bpy.types.Image.filepath`

Image/Movie file name (default "", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.Image.filepath_raw`

Image/Movie file name (without data refreshing) (default "", never None, blend relative ``//`` prefix supported)

:type: str

### data `bpy.types.Image.frame_duration`

Duration (in frames) of the image (1 when not a video/sequence) (in [0, inf], default 0, readonly)

:type: int

### attribute `bpy.types.Image.generated_color`

Fill color for the generated image (array of 4 items, in [0, inf], default (0.0, 0.0, 0.0, 0.0))

:type: :class:`bpy_prop_array`\ [float]

### attribute `bpy.types.Image.generated_height`

Generated image height (in [1, 65536], default 1024)

:type: int

### attribute `bpy.types.Image.generated_type`

Generated image type (default ``'UV_GRID'``)

:type: Literal[:ref:`rna_enum_image_generated_type_items`]

### attribute `bpy.types.Image.generated_width`

Generated image width (in [1, 65536], default 1024)

:type: int

### data `bpy.types.Image.has_data`

True if the image data is loaded into memory (default False, readonly)

:type: bool

### data `bpy.types.Image.is_dirty`

Image has changed and is not saved (default False, readonly)

:type: bool

### data `bpy.types.Image.is_float`

True if this image is stored in floating-point buffer (default False, readonly)

:type: bool

### data `bpy.types.Image.is_multiview`

Image has more than one view (default False, readonly)

:type: bool

### data `bpy.types.Image.is_stereo_3d`

Image has left and right views (default False, readonly)

:type: bool

### data `bpy.types.Image.packed_file`

First packed file of the image (readonly)

:type: :class:`PackedFile` | None

### data `bpy.types.Image.packed_files`

Collection of packed images (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`ImagePackedFile`]

### attribute `bpy.types.Image.pixels`

Image buffer pixels in floating-point values (dynamic array, in [-inf, inf], default 0.0)

:type: :class:`bpy_prop_array`\ [float]

### data `bpy.types.Image.render_slots`

Render slots of the image (default None, readonly)

:type: :class:`RenderSlots`\ [:class:`RenderSlot`]

### attribute `bpy.types.Image.resolution`

X/Y pixels per meter, for the image buffer (array of 2 items, in [-inf, inf], default (0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.Image.seam_margin`

Margin to take into account when fixing UV seams during painting. Higher number would improve seam-fixes for mipmaps, but decreases performance. (in [-32768, 32767], default 8)

:type: int

### data `bpy.types.Image.size`

Width and height of the image buffer in pixels, zero when image data cannot be loaded (array of 2 items, in [-inf, inf], default (0, 0), readonly)

:type: :class:`bpy_prop_array`\ [int]

### attribute `bpy.types.Image.source`

Where the image comes from (default ``'FILE'``)

- ``FILE``
  Single Image -- Single image file.
- ``SEQUENCE``
  Image Sequence -- Multiple image files, as a sequence.
- ``MOVIE``
  Movie -- Movie file.
- ``GENERATED``
  Generated -- Generated image.
- ``VIEWER``
  Viewer -- Compositing node viewer.
- ``TILED``
  UDIM Tiles -- Tiled UDIM image texture.

:type: Literal['FILE', 'SEQUENCE', 'MOVIE', 'GENERATED', 'VIEWER', 'TILED']

### data `bpy.types.Image.stereo_3d_format`

Settings for stereo 3d (readonly, never None)

:type: :class:`Stereo3dFormat`

### data `bpy.types.Image.tiles`

Tiles of the image (default None, readonly)

:type: :class:`UDIMTiles`\ [:class:`UDIMTile`]

### data `bpy.types.Image.type`

How to generate the image (default ``'IMAGE'``, readonly)

:type: Literal['IMAGE', 'MULTILAYER', 'UV_TEST', 'RENDER_RESULT', 'COMPOSITING']

### attribute `bpy.types.Image.use_deinterlace`

Deinterlace movie file on load (default False)

:type: bool

### attribute `bpy.types.Image.use_generated_float`

Generate floating-point buffer (default False)

:type: bool

### attribute `bpy.types.Image.use_half_precision`

Use 16 bits per channel to lower the memory usage during rendering.
Note: Not supported by Cycles

(default True)

:type: bool

### attribute `bpy.types.Image.use_multiview`

Use Multiple Views (when available) (default False)

:type: bool

### attribute `bpy.types.Image.use_view_as_render`

Apply render part of display transformation when displaying this image on the screen (default False)

:type: bool

### attribute `bpy.types.Image.views_format`

Mode to load image views (default ``'INDIVIDUAL'``)

:type: Literal[:ref:`rna_enum_views_format_items`]

### method `bpy.types.Image.save_render`

Save image to a specific path using a scenes render settings

:param filepath: Output path (never None)
:type filepath: str
:param scene: Scene to take image parameters from (optional)
:type scene: :class:`Scene` | None
:param quality: Quality, Quality for image formats that support lossy compression, uses default quality if not specified (in [0, 100], optional)
:type quality: int

### method `bpy.types.Image.save`

Save image

:param filepath: Output path, uses image data-block filepath if not specified (optional, never None)
:type filepath: str
:param quality: Quality, Quality for image formats that support lossy compression, uses default quality if not specified (in [0, 100], optional)
:type quality: int
:param save_copy: Save Copy, Save the image as a copy, without updating current image's filepath (optional)
:type save_copy: bool

### method `bpy.types.Image.pack`

Pack an image as embedded data into the .blend file

:param data: data, Raw data (bytes, exact content of the embedded file) (optional, never None)
:type data: bytes
:param data_len: data_len, length of given data (mandatory if data is provided) (in [0, inf], optional)
:type data_len: int

### method `bpy.types.Image.unpack`

Save an image packed in the .blend file to disk

:param method: method, How to unpack (optional)
:type method: Literal[:ref:`rna_enum_unpack_method_items`]

### method `bpy.types.Image.reload`

Reload the image from its source path

### method `bpy.types.Image.update`

Update the display image from the floating-point buffer

### method `bpy.types.Image.scale`

Scale the buffer of the image, in pixels

:param width: Width (in [1, inf])
:type width: int
:param height: Height (in [1, inf])
:type height: int
:param frame: Frame, Frame (for image sequences) (in [0, inf], optional)
:type frame: int
:param tile_index: Tile, Tile index (for tiled images) (in [0, inf], optional)
:type tile_index: int

### method `bpy.types.Image.gl_touch`

Delay the image from being cleaned from the cache due inactivity

:param frame: Frame, Frame of image sequence or movie (in [0, inf], optional)
:type frame: int
:param layer_index: Layer, Index of layer that should be loaded (in [0, inf], optional)
:type layer_index: int
:param pass_index: Pass, Index of pass that should be loaded (in [0, inf], optional)
:type pass_index: int
:return: Error, OpenGL error value (in [-inf, inf])
:rtype: int

### method `bpy.types.Image.gl_load`

Load the image into an OpenGL texture. On success, image.bindcode will contain the OpenGL texture bindcode. Colors read from the texture will be in scene linear color space and have premultiplied or straight alpha matching the image alpha mode.

:param frame: Frame, Frame of image sequence or movie (in [0, inf], optional)
:type frame: int
:param layer_index: Layer, Index of layer that should be loaded (in [0, inf], optional)
:type layer_index: int
:param pass_index: Pass, Index of pass that should be loaded (in [0, inf], optional)
:type pass_index: int
:return: Error, OpenGL error value (in [-inf, inf])
:rtype: int

### method `bpy.types.Image.gl_free`

Free the image from OpenGL graphics memory

### method `bpy.types.Image.filepath_from_user`

Return the absolute path to the filepath of an image frame specified by the image user

:param image_user: Image user of the image to get filepath for (optional)
:type image_user: :class:`ImageUser` | None
:return: File Path, The resulting filepath from the image and its user (never None)
:rtype: str

### method `bpy.types.Image.buffers_free`

Free the image buffers from memory

### classmethod `bpy.types.Image.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Image.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.edit_image`
- :class:`BlendData.images`
- :class:`BlendDataImages.load`
- :class:`BlendDataImages.new`
- :class:`BlendDataImages.remove`
- :class:`CameraBackgroundImage.image`
- :class:`CompositorNodeCryptomatteV2.image`
- :class:`CompositorNodeImage.image`
- :class:`GeometryNodeInputImage.image`
- :class:`ImagePaint.canvas`
- :class:`ImagePaint.clone_image`
- :class:`ImagePaint.stencil_image`
- :class:`ImageTexture.image`
- :class:`Material.texture_paint_images`
- :class:`MaterialGPencilStyle.fill_image`
- :class:`MaterialGPencilStyle.stroke_image`
- :class:`MovieTrackingPlaneTrack.image`
- :class:`NodeSocketImage.default_value`
- :class:`NodeTreeInterfaceSocketImage.default_value`
- :class:`PaintModeSettings.canvas_image`
- :class:`ShaderNodeTexEnvironment.image`
- :class:`ShaderNodeTexImage.image`
- :class:`SpaceImageEditor.image`
- :class:`TextureNodeImage.image`
- :class:`UILayout.template_image_layers`
