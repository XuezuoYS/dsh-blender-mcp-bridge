<!-- source: api/bpy.types.MovieTrackingReconstructedCameras.rst -->

base class --- :class:`bpy_prop_collection`

### class `bpy.types.MovieTrackingReconstructedCameras`

Collection of solved cameras

### method `bpy.types.MovieTrackingReconstructedCameras.find_frame`

Find a reconstructed camera for a give frame number

:param frame: Frame, Frame number to find camera for (in [0, 1048574], optional)
:type frame: int
:return: Camera for a given frame
:rtype: :class:`MovieReconstructedCamera`

### method `bpy.types.MovieTrackingReconstructedCameras.matrix_from_frame`

Return interpolated camera matrix for a given frame

:param frame: Frame, Frame number to find camera for (in [0, 1048574], optional)
:type frame: int
:return: Matrix, Interpolated camera matrix for a given frame (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:rtype: :class:`mathutils.Matrix`

### classmethod `bpy.types.MovieTrackingReconstructedCameras.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.MovieTrackingReconstructedCameras.bl_rna_get_subclass_py`

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

- :class:`MovieTrackingReconstruction.cameras`
