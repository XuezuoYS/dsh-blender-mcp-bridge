<!-- source: api/bpy.types.GreasePencilDrawing.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.GreasePencilDrawing`

A Grease Pencil drawing

### data `bpy.types.GreasePencilDrawing.attributes`

Geometry attributes (default None, readonly)

:type: :class:`AttributeGroupGreasePencilDrawing`\ [:class:`Attribute`]

### data `bpy.types.GreasePencilDrawing.color_attributes`

Geometry color attributes (default None, readonly)

:type: :class:`AttributeGroupGreasePencilDrawing`\ [:class:`Attribute`]

### data `bpy.types.GreasePencilDrawing.curve_offsets`

Offset indices of the first point of each curve (default None, readonly)

:type: :class:`bpy_prop_collection`\ [:class:`IntAttributeValue`]

### data `bpy.types.GreasePencilDrawing.type`

Drawing type (default ``'DRAWING'``, readonly)

:type: Literal['DRAWING', 'REFERENCE']

### data `bpy.types.GreasePencilDrawing.user_count`

The number of keyframes this drawing is used by (in [-inf, inf], default 0, readonly)

:type: int

### data `bpy.types.GreasePencilDrawing.strokes`

Return a collection of all the Grease Pencil strokes in this drawing.

### method `bpy.types.GreasePencilDrawing.add_strokes`

note: 
This API should *not* be used for performance critical operations.
   Use the :class:`GreasePencilDrawing.attributes` API instead.
note: 
When point/curves count of a drawing is changed, the slice returned by this
   call prior to the change is no longer valid. You need to get the new stroke
   slice via ``drawing.strokes[n]``.

(readonly)
Add new strokes with provided sizes at the end

:param sizes: Sizes, The number of points in each stroke (array of 1 items, in [1, inf])
:type sizes: Sequence[int]

### method `bpy.types.GreasePencilDrawing.remove_strokes`

Remove all strokes. If indices are provided, remove only the strokes with the given indices.

:param indices: Indices, The indices of the strokes to remove (array of 1 items, in [0, inf], optional)
:type indices: Sequence[int]

### method `bpy.types.GreasePencilDrawing.resize_strokes`

Resize all existing strokes. If indices are provided, resize only the strokes with the given indices. If the new size for a stroke is smaller, the stroke is trimmed. If the new size for a stroke is larger, the new end values are default initialized.

:param sizes: Sizes, The number of points in each stroke (array of 1 items, in [1, inf])
:type sizes: Sequence[int]
:param indices: Indices, The indices of the stroke to resize (array of 1 items, in [0, inf], optional)
:type indices: Sequence[int]

### method `bpy.types.GreasePencilDrawing.reorder_strokes`

Reorder the strokes by the new indices.

:param new_indices: New indices, The new index for each of the strokes (array of 1 items, in [0, inf])
:type new_indices: Sequence[int]

### method `bpy.types.GreasePencilDrawing.set_types`

Set the curve type. If indices are provided, set only the types with the given curve indices.

:param type: Type, (optional)
:type type: Literal[:ref:`rna_enum_curves_type_items`]
:param indices: Indices, The indices of the curves to resize (array of 1 items, in [0, inf], optional)
:type indices: Sequence[int]

### method `bpy.types.GreasePencilDrawing.tag_positions_changed`

Indicate that the positions of points in the drawing have changed

### method `bpy.types.GreasePencilDrawing.vertex_group_assign`

Assign points to vertex group

:param vgroup_name: Vertex Group Name, Name of the vertex group (never None)
:type vgroup_name: str
:param indices_ptr: Indices, The point indices to assign the weight to (array of 1 items, in [-inf, inf])
:type indices_ptr: Sequence[int]
:param weight: Vertex weight (in [0, 1])
:type weight: float

### method `bpy.types.GreasePencilDrawing.vertex_group_remove`

Remove points from vertex group

:param vgroup_name: Vertex Group Name, Name of the vertex group (never None)
:type vgroup_name: str
:param indices_ptr: Indices, The point indices to remove from the vertex group (array of 1 items, in [-inf, inf])
:type indices_ptr: Sequence[int]

### method `bpy.types.GreasePencilDrawing.set_vertex_weights`

Set the weights of vertices in a grease pencil drawing

:param vertex_group_name: Vertex Group Name, Name of the vertex group (never None)
:type vertex_group_name: str
:param indices: Indices, The point indices in the vertex group to modify (array of 1 items, in [-inf, inf])
:type indices: Sequence[int]
:param weights: Weights, The weight for each corresponding index in the indices array (array of 1 items, in [0, 1])
:type weights: Sequence[float]
:param assign_mode: (optional)

   - ``REPLACE``
     Replace -- Replace.
   - ``ADD``
     Add -- Add.
   - ``SUBTRACT``
     Subtract -- Subtract.
:type assign_mode: Literal['REPLACE', 'ADD', 'SUBTRACT']

### classmethod `bpy.types.GreasePencilDrawing.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.GreasePencilDrawing.bl_rna_get_subclass_py`

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

- :class:`GreasePencilFrame.drawing`
