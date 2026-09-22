<!-- source: api/bpy.types.Armature.rst -->

base classes --- :class:`bpy_struct`, :class:`ID`

### class `bpy.types.Armature`

Armature data-block containing a hierarchy of bones, usually used for rigging characters

### data `bpy.types.Armature.animation_data`

Animation data for this data-block (readonly)

:type: :class:`AnimData` | None

### attribute `bpy.types.Armature.axes_position`

The position for the axes on the bone. Increasing the value moves it closer to the tip; decreasing moves it closer to the root. (in [0, 1], default 0.0)

:type: float

### data `bpy.types.Armature.bones`

(default None, readonly)

:type: :class:`ArmatureBones`\ [:class:`Bone`]

### attribute `bpy.types.Armature.collections`

(default None)

:type: :class:`BoneCollections`\ [:class:`BoneCollection`]

### data `bpy.types.Armature.collections_all`

List of all bone collections of the armature (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`BoneCollection`]

### attribute `bpy.types.Armature.display_type`

(default ``'OCTAHEDRAL'``)

- ``OCTAHEDRAL``
  Octahedral -- Display bones as octahedral shape (default).
- ``STICK``
  Stick -- Display bones as simple 2D lines with dots.
- ``BBONE``
  B-Bone -- Display bones as boxes, showing subdivision and B-Splines.
- ``ENVELOPE``
  Envelope -- Display bones as extruded spheres, showing deformation influence volume.
- ``WIRE``
  Wire -- Display bones as thin wires, showing subdivision and B-Splines.

:type: Literal['OCTAHEDRAL', 'STICK', 'BBONE', 'ENVELOPE', 'WIRE']

### data `bpy.types.Armature.edit_bones`

(default None, readonly)

:type: :class:`ArmatureEditBones`\ [:class:`EditBone`]

### data `bpy.types.Armature.is_editmode`

True when used in editmode (default False, readonly)

:type: bool

### attribute `bpy.types.Armature.pose_position`

Show armature in binding pose or final posed state (default ``'POSE'``)

- ``POSE``
  Pose Position -- Show armature in posed state.
- ``REST``
  Rest Position -- Show Armature in binding pose state (no posing possible).

:type: Literal['POSE', 'REST']

### attribute `bpy.types.Armature.relation_line_position`

The start position of the relation lines from parent to child bones (default ``'TAIL'``)

- ``TAIL``
  Tail -- Draw the relationship line from the parent tail to the child head.
- ``HEAD``
  Head -- Draw the relationship line from the parent head to the child head.

:type: Literal['TAIL', 'HEAD']

### attribute `bpy.types.Armature.show_axes`

Display bone axes (default False)

:type: bool

### attribute `bpy.types.Armature.show_bone_colors`

Display bone colors (default True)

:type: bool

### attribute `bpy.types.Armature.show_bone_custom_shapes`

Display bones with their custom shapes (default True)

:type: bool

### attribute `bpy.types.Armature.show_names`

Display bone names (default False)

:type: bool

### attribute `bpy.types.Armature.use_mirror_x`

Apply changes to matching bone on opposite side of X-Axis (default False)

:type: bool

### method `bpy.types.Armature.transform`

Transform armature bones by a matrix

:param matrix: Matrix (multi-dimensional array of 4 * 4 items, in [-inf, inf])
:type matrix: :class:`mathutils.Matrix` | Sequence[Sequence[float]]

### classmethod `bpy.types.Armature.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Armature.bl_rna_get_subclass_py`

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

- :mod:`bpy.context.armature`
- :class:`BlendData.armatures`
- :class:`BlendDataArmatures.new`
- :class:`BlendDataArmatures.remove`
