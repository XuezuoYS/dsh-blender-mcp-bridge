<!-- source: api/bpy.types.GreasePencilFrames.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.GreasePencilFrames`

Collection of Grease Pencil frames

### method `bpy.types.GreasePencilFrames.new`

Add a new Grease Pencil frame

:param frame_number: Frame Number, The frame on which the drawing appears (in [-1048574, 1048574])
:type frame_number: int
:return: The newly created frame
:rtype: :class:`GreasePencilFrame`

### method `bpy.types.GreasePencilFrames.remove`

Remove a Grease Pencil frame

:param frame_number: Frame Number, The frame number of the frame to remove (in [-1048574, 1048574])
:type frame_number: int

### method `bpy.types.GreasePencilFrames.copy`

Copy a Grease Pencil frame

:param from_frame_number: Source Frame Number, The frame number of the source frame (in [-1048574, 1048574])
:type from_frame_number: int
:param to_frame_number: Frame Number of Copy, The frame number to copy the frame to (in [-1048574, 1048574])
:type to_frame_number: int
:param instance_drawing: Instance Drawing, Let the copied frame use the same drawing as the source (optional)
:type instance_drawing: bool
:return: The newly copied frame
:rtype: :class:`GreasePencilFrame`

### method `bpy.types.GreasePencilFrames.move`

Move a Grease Pencil frame

:param from_frame_number: Source Frame Number, The frame number of the source frame (in [-1048574, 1048574])
:type from_frame_number: int
:param to_frame_number: Target Frame Number, The frame number to move the frame to (in [-1048574, 1048574])
:type to_frame_number: int
:return: The moved frame
:rtype: :class:`GreasePencilFrame`

### classmethod `bpy.types.GreasePencilFrames.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilFrames.bl_rna_get_subclass_py`

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

- :class:`GreasePencilLayer.frames`
