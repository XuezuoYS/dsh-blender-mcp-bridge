<!-- source: api/bpy.types.GreasePencilLayer.rst -->

base classes --- :class:`bpy_struct`, :class:`GreasePencilTreeNode`

### class `bpy.types.GreasePencilLayer`

Collection of related drawings

### attribute `bpy.types.GreasePencilLayer.blend_mode`

Blend mode (default ``'REGULAR'``)

:type: Literal['REGULAR', 'HARDLIGHT', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']

### data `bpy.types.GreasePencilLayer.frames`

Grease Pencil frames (default None, readonly)

:type: :class:`GreasePencilFrames`\ [:class:`GreasePencilFrame`]

### attribute `bpy.types.GreasePencilLayer.ignore_locked_materials`

Allow editing strokes even if they use locked materials (default False)

:type: bool

### attribute `bpy.types.GreasePencilLayer.lock_frame`

Lock current frame displayed by layer (default False)

:type: bool

### data `bpy.types.GreasePencilLayer.mask_layers`

List of Masking Layers (default None, readonly)

:type: :class:`GreasePencilLayerMasks`\ [:class:`GreasePencilLayerMask`]

### data `bpy.types.GreasePencilLayer.matrix_local`

Local transformation matrix of the layer (multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)), readonly)

:type: :class:`mathutils.Matrix`

### data `bpy.types.GreasePencilLayer.matrix_parent_inverse`

Inverse of layer's parent transformation matrix (multi-dimensional array of 4 * 4 items, in [-inf, inf], default ((0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0), (0.0, 0.0, 0.0, 0.0)), readonly)

:type: :class:`mathutils.Matrix`

### attribute `bpy.types.GreasePencilLayer.opacity`

Layer Opacity (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLayer.parent`

Parent object

:type: :class:`Object` | None

### attribute `bpy.types.GreasePencilLayer.parent_bone`

Name of parent bone. Only used when the parent object is an armature. (default "", never None)

:type: str

### attribute `bpy.types.GreasePencilLayer.pass_index`

Index number for the "Layer Index" pass (in [0, inf], default 0)

:type: int

### attribute `bpy.types.GreasePencilLayer.radius_offset`

Radius change to apply to current strokes (in [-inf, inf], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLayer.rotation`

Euler rotation of the layer (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Euler`

### attribute `bpy.types.GreasePencilLayer.scale`

Scale of the layer (array of 3 items, in [-inf, inf], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.GreasePencilLayer.tint_color`

Color for tinting stroke colors (array of 3 items, in [0, 1], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.GreasePencilLayer.tint_factor`

Factor of tinting color (in [0, 1], default 0.0)

:type: float

### attribute `bpy.types.GreasePencilLayer.translation`

Translation of the layer (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.GreasePencilLayer.use_lights`

Enable the use of lights on stroke and fill materials (default False)

:type: bool

### attribute `bpy.types.GreasePencilLayer.use_viewlayer_masks`

Include the mask layers when rendering the view-layer (default True)

:type: bool

### attribute `bpy.types.GreasePencilLayer.viewlayer_render`

Only include Layer in this View Layer render output (leave blank to include always) (default "", never None)

:type: str

### method `bpy.types.GreasePencilLayer.get_frame_at`

Get the frame at given frame number

:param frame_number: Frame Number, (in [-1048574, 1048574])
:type frame_number: int
:return: Frame
:rtype: :class:`GreasePencilFrame`

### method `bpy.types.GreasePencilLayer.current_frame`

The Grease Pencil frame at the current scene time on this layer

:rtype: :class:`GreasePencilFrame`

### classmethod `bpy.types.GreasePencilLayer.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilLayer.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`GreasePencilTreeNode.name`
- :class:`GreasePencilTreeNode.hide`
- :class:`GreasePencilTreeNode.lock`
- :class:`GreasePencilTreeNode.select`
- :class:`GreasePencilTreeNode.use_onion_skinning`
- :class:`GreasePencilTreeNode.use_masks`
- :class:`GreasePencilTreeNode.channel_color`
- :class:`GreasePencilTreeNode.next_node`
- :class:`GreasePencilTreeNode.prev_node`
- :class:`GreasePencilTreeNode.parent_group`

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
- :class:`GreasePencilTreeNode.bl_rna_get_subclass`
- :class:`GreasePencilTreeNode.bl_rna_get_subclass_py`

:columns: 2

- :class:`GreasePencil.layers`
- :class:`GreasePencilLayerMasks.add`
- :class:`GreasePencilv3Layers.active`
- :class:`GreasePencilv3Layers.move`
- :class:`GreasePencilv3Layers.move_bottom`
- :class:`GreasePencilv3Layers.move_to_layer_group`
- :class:`GreasePencilv3Layers.move_top`
- :class:`GreasePencilv3Layers.new`
- :class:`GreasePencilv3Layers.remove`
