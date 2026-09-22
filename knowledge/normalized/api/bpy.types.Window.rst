<!-- source: api/bpy.types.Window.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Window`

Open window

### data `bpy.types.Window.height`

Window height (in [0, 32767], default 0, readonly)

:type: int

### data `bpy.types.Window.modal_operators`

A list of currently running modal operators (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`Operator`]

### data `bpy.types.Window.parent`

Active workspace and scene follow this window (readonly)

:type: :class:`Window` | None

### attribute `bpy.types.Window.scene`

Active scene to be edited in the window (never None)

:type: :class:`Scene`

### attribute `bpy.types.Window.screen`

Active workspace screen showing in the window (never None)

:type: :class:`Screen`

### data `bpy.types.Window.stereo_3d_display`

Settings for stereo 3D display (readonly, never None)

:type: :class:`Stereo3dDisplay`

### data `bpy.types.Window.support_hdr_color`

The window has a HDR graphics buffer that wide gamut and high dynamic range colors can be written to, in extended sRGB color space. (default False, readonly)

:type: bool

### attribute `bpy.types.Window.view_layer`

The active workspace view layer showing in the window (never None)

:type: :class:`ViewLayer`

### data `bpy.types.Window.width`

Window width (in [0, 32767], default 0, readonly)

:type: int

### attribute `bpy.types.Window.workspace`

Active workspace showing in the window (never None)

:type: :class:`WorkSpace`

### data `bpy.types.Window.x`

Horizontal location of the window (in [-32768, 32767], default 0, readonly)

:type: int

### data `bpy.types.Window.y`

Vertical location of the window (in [-32768, 32767], default 0, readonly)

:type: int

### method `bpy.types.Window.cursor_warp`

Set the cursor position

:param x: (in [-inf, inf])
:type x: int
:param y: (in [-inf, inf])
:type y: int

### method `bpy.types.Window.cursor_set`

Set the cursor

:param cursor: cursor
:type cursor: Literal[:ref:`rna_enum_window_cursor_items`]

### method `bpy.types.Window.cursor_modal_set`

Set the cursor, so the previous cursor can be restored

:param cursor: cursor
:type cursor: Literal[:ref:`rna_enum_window_cursor_items`]

### method `bpy.types.Window.cursor_modal_restore`

Restore the previous cursor after calling ``cursor_modal_set``

### method `bpy.types.Window.event_simulate`

event_simulate

:param type: Type
:type type: Literal[:ref:`rna_enum_event_type_items`]
:param value: Value
:type value: Literal[:ref:`rna_enum_event_value_items`]
:param unicode: (optional)
:type unicode: str
:param x: (in [-inf, inf], optional)
:type x: int
:param y: (in [-inf, inf], optional)
:type y: int
:param shift: Shift, (optional)
:type shift: bool
:param ctrl: Ctrl, (optional)
:type ctrl: bool
:param alt: Alt, (optional)
:type alt: bool
:param oskey: OS Key, (optional)
:type oskey: bool
:param hyper: Hyper, (optional)
:type hyper: bool
:return: Item, Added key map item
:rtype: :class:`Event`

### method `bpy.types.Window.find_playing_scene`

find_playing_scene

:param scrub: Scrubbing, Check if time in the scene is being scrubbed (optional)
:type scrub: bool
:return: Scene, Scene that is currently playing
:rtype: :class:`Scene`

### classmethod `bpy.types.Window.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Window.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### method `bpy.types.Window.screenshot`

Capture the windows pixel data.

:param region: The region to capture, or ``None`` to capture all.
   Each int pair represents a pixel coordinate (the end value is not inclusive, matching Python slicing): ((min_x, min_y), (max_x, max_y))
:type region: tuple[tuple[int, int], tuple[int, int]] | None
:param use_alpha: When false the alpha channel is fully opaque. Otherwise alpha values from the window's frame-buffer are returned as-is.
:type use_alpha: bool
:return: A read-only :class:`memoryview` of shape ``(height, width, 4)`` and format ``'B'``, viewing the captured RGBA pixels (rows ordered from bottom to top).
:rtype: memoryview


**Save 3D Viewport to a PNG**

Capture the 3D viewport's main region from the current window
and write it to a PNG file using :mod:`imbuf`.

literalinclude: ./examples/bpy.types.Window.screenshot.0.py

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

- :class:`Context.window`
- :class:`Window.parent`
- :class:`WindowManager.event_timer_add`
- :class:`WindowManager.windows`
- :class:`Windows.find_playing`
