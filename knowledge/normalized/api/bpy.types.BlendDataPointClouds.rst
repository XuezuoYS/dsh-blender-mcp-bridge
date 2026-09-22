<!-- source: api/bpy.types.BlendDataPointClouds.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.BlendDataPointClouds`

Collection of point clouds

### method `bpy.types.BlendDataPointClouds.new`

Add a new point cloud to the main database

:param name: New name for the data-block (never None)
:type name: str
:return: New point cloud data-block
:rtype: :class:`PointCloud`

### method `bpy.types.BlendDataPointClouds.remove`

Remove a point cloud from the current blendfile

:param pointcloud: Point cloud to remove (never None)
:type pointcloud: :class:`PointCloud` | None
:param do_unlink: Unlink all usages of this point cloud before deleting it (WARNING: will also delete objects instancing that point cloud data) (optional)
:type do_unlink: bool
:param do_id_user: Decrement user counter of all data-blocks used by this point cloud data (optional)
:type do_id_user: bool
:param do_ui_user: Make sure interface does not reference this point cloud data (optional)
:type do_ui_user: bool

### method `bpy.types.BlendDataPointClouds.tag`

tag

:param value: Value
:type value: bool

### classmethod `bpy.types.BlendDataPointClouds.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.BlendDataPointClouds.bl_rna_get_subclass_py`

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

- :class:`BlendData.pointclouds`
