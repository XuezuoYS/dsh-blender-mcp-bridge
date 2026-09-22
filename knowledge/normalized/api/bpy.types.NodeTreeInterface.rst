<!-- source: api/bpy.types.NodeTreeInterface.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.NodeTreeInterface`

Declaration of sockets and ui panels of a node group

### attribute `bpy.types.NodeTreeInterface.active`

Active item

:type: :class:`NodeTreeInterfaceItem` | None

### attribute `bpy.types.NodeTreeInterface.active_index`

Index of the active item (in [0, inf], default 0)

:type: int

### data `bpy.types.NodeTreeInterface.items_tree`

Items in the node interface (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`NodeTreeInterfaceItem`]

### method `bpy.types.NodeTreeInterface.new_socket`

Add a new socket to the interface

:param name: Name, Name of the socket (never None)
:type name: str
:param description: Description, Description of the socket (optional, never None)
:type description: str
:param in_out: Input/Output Type, Create an input or output socket (optional)

   - ``INPUT``
     Input -- Generate a input node socket.
   - ``OUTPUT``
     Output -- Generate a output node socket.
:type in_out: Literal['INPUT', 'OUTPUT']
:param socket_type: Socket Type, Type of socket generated on nodes (optional)
:type socket_type: Literal['DEFAULT']
:param parent: Parent, Panel to add the socket in (optional)
:type parent: :class:`NodeTreeInterfacePanel` | None
:return: Socket, New socket
:rtype: :class:`NodeTreeInterfaceSocket`

### method `bpy.types.NodeTreeInterface.new_panel`

Add a new panel to the interface

:param name: Name, Name of the new panel (never None)
:type name: str
:param description: Description, Description of the panel (optional, never None)
:type description: str
:param default_closed: Default Closed, Panel is closed by default on new nodes (optional)
:type default_closed: bool
:return: Panel, New panel
:rtype: :class:`NodeTreeInterfacePanel`

### method `bpy.types.NodeTreeInterface.copy`

Add a copy of an item to the interface

:param item: Item, Item to copy (never None)
:type item: :class:`NodeTreeInterfaceItem` | None
:return: Item Copy, Copy of the item
:rtype: :class:`NodeTreeInterfaceItem`

### method `bpy.types.NodeTreeInterface.remove`

Remove an item from the interface

:param item: Item, The item to remove (never None)
:type item: :class:`NodeTreeInterfaceItem` | None
:param move_content_to_parent: Move Content, If the item is a panel, move the contents to the parent instead of deleting it (optional)
:type move_content_to_parent: bool

### method `bpy.types.NodeTreeInterface.clear`

Remove all items from the interface

### method `bpy.types.NodeTreeInterface.move`

Move an item to another position

:param item: Item, The item to move (never None)
:type item: :class:`NodeTreeInterfaceItem` | None
:param to_position: To Position, Target position for the item in its current panel (in [0, inf])
:type to_position: int

### method `bpy.types.NodeTreeInterface.move_to_parent`

Move an item to a new panel and/or position.

:param item: Item, The item to move (never None)
:type item: :class:`NodeTreeInterfaceItem` | None
:param parent: Parent, New parent of the item
:type parent: :class:`NodeTreeInterfacePanel` | None
:param to_position: To Position, Target position for the item in the new parent panel (in [0, inf])
:type to_position: int

### classmethod `bpy.types.NodeTreeInterface.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.NodeTreeInterface.bl_rna_get_subclass_py`

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

- :class:`NodeTree.interface`
- :class:`UILayout.template_node_tree_interface`
