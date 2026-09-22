<!-- source: api/bpy.types.UDIMTiles.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.UDIMTiles`

Collection of UDIM tiles

### attribute `bpy.types.UDIMTiles.active`

Active Image Tile (never None)

:type: :class:`UDIMTile`

### attribute `bpy.types.UDIMTiles.active_index`

Active index in tiles array (in [0, inf], default 0)

:type: int

### method `bpy.types.UDIMTiles.new`

Add a tile to the image

:param tile_number: Number of the newly created tile (in [1, inf])
:type tile_number: int
:param label: Optional label for the tile (optional, never None)
:type label: str
:return: Newly created image tile
:rtype: :class:`UDIMTile`

### method `bpy.types.UDIMTiles.get`

Get a tile based on its tile number

:param tile_number: Number of the tile (in [0, inf])
:type tile_number: int
:return: The tile
:rtype: :class:`UDIMTile`

### method `bpy.types.UDIMTiles.remove`

Remove an image tile

:param tile: Image tile to remove (never None)
:type tile: :class:`UDIMTile` | None

### classmethod `bpy.types.UDIMTiles.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.UDIMTiles.bl_rna_get_subclass_py`

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

- :class:`Image.tiles`
