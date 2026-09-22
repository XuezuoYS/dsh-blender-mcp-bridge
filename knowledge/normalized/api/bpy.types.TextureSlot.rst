<!-- source: api/bpy.types.TextureSlot.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.TextureSlot`

:caption: Subclasses
:maxdepth: 1

bpy.types.BrushTextureSlot.rst
bpy.types.LineStyleTextureSlot.rst
bpy.types.ParticleSettingsTextureSlot.rst
Texture slot defining the mapping and influence of a texture

### attribute `bpy.types.TextureSlot.blend_type`

Mode used to apply the texture (default ``'MIX'``)

:type: Literal['MIX', 'DARKEN', 'MULTIPLY', 'LIGHTEN', 'SCREEN', 'ADD', 'OVERLAY', 'SOFT_LIGHT', 'LINEAR_LIGHT', 'DIFFERENCE', 'SUBTRACT', 'DIVIDE', 'HUE', 'SATURATION', 'COLOR', 'VALUE']

### attribute `bpy.types.TextureSlot.color`

Default color for textures that don't return RGB or when RGB to intensity is enabled (array of 3 items, in [0, inf], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Color`

### attribute `bpy.types.TextureSlot.default_value`

Value to use for Ref, Spec, Amb, Emit, Alpha, RayMir, TransLu and Hard (in [-inf, inf], default 1.0)

:type: float

### data `bpy.types.TextureSlot.name`

Texture slot name (default "", readonly, never None)

:type: str

### attribute `bpy.types.TextureSlot.offset`

Fine tune of the texture mapping X, Y and Z locations (array of 3 items, in [-inf, inf], default (0.0, 0.0, 0.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TextureSlot.output_node`

Which output node to use, for node-based textures (default ``'DEFAULT'``)

:type: Literal['DEFAULT']

### attribute `bpy.types.TextureSlot.scale`

Set scaling for the texture's X, Y and Z sizes (array of 3 items, in [-inf, inf], default (1.0, 1.0, 1.0))

:type: :class:`mathutils.Vector`

### attribute `bpy.types.TextureSlot.texture`

Texture data-block used by this texture slot

:type: :class:`Texture` | None

### classmethod `bpy.types.TextureSlot.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.TextureSlot.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.texture_slot`
- :class:`UILayout.template_preview`
