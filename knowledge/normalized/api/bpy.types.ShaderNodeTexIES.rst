<!-- source: api/bpy.types.ShaderNodeTexIES.rst -->

base classes --- :class:`bpy_struct`, :class:`Node`, :class:`NodeInternal`, :class:`ShaderNode`

### class `bpy.types.ShaderNodeTexIES`

Match real world lights with IES files, which store the directional intensity distribution of light sources

### attribute `bpy.types.ShaderNodeTexIES.filepath`

IES light path (default "", never None, blend relative ``//`` prefix supported)

:type: str

### attribute `bpy.types.ShaderNodeTexIES.ies`

Internal IES file

:type: :class:`Text` | None

### attribute `bpy.types.ShaderNodeTexIES.mode`

Whether the IES file is loaded from disk or from a text data-block (default ``'INTERNAL'``)

- ``INTERNAL``
  Internal -- Use internal text data-block.
- ``EXTERNAL``
  External -- Use external .ies file.

:type: Literal['INTERNAL', 'EXTERNAL']

### classmethod `bpy.types.ShaderNodeTexIES.is_registered_node_type`

True if a registered node type

:return: Result
:rtype: bool

### classmethod `bpy.types.ShaderNodeTexIES.input_template`

Input socket template

:param index: Index, (in [0, inf])
:type index: int
:return: result
:rtype: :class:`NodeInternalSocketTemplate`

### classmethod `bpy.types.ShaderNodeTexIES.output_template`

Output socket template

:param index: Index, (in [0, inf])
:type index: int
:return: result
:rtype: :class:`NodeInternalSocketTemplate`

### classmethod `bpy.types.ShaderNodeTexIES.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.ShaderNodeTexIES.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

:columns: 2

- :class:`bpy_struct.id_data`
- :class:`Node.type`
- :class:`Node.location`
- :class:`Node.location_absolute`
- :class:`Node.width`
- :class:`Node.height`
- :class:`Node.dimensions`
- :class:`Node.name`
- :class:`Node.label`
- :class:`Node.inputs`
- :class:`Node.outputs`
- :class:`Node.panel_states`
- :class:`Node.internal_links`
- :class:`Node.parent`
- :class:`Node.warning_propagation`
- :class:`Node.use_custom_color`
- :class:`Node.color`
- :class:`Node.color_tag`
- :class:`Node.select`
- :class:`Node.show_options`
- :class:`Node.show_preview`
- :class:`Node.hide`
- :class:`Node.mute`
- :class:`Node.show_texture`
- :class:`Node.bl_idname`
- :class:`Node.bl_label`
- :class:`Node.bl_description`
- :class:`Node.bl_icon`
- :class:`Node.bl_static_type`
- :class:`Node.bl_width_default`
- :class:`Node.bl_width_min`
- :class:`Node.bl_width_max`
- :class:`Node.bl_height_default`
- :class:`Node.bl_height_min`
- :class:`Node.bl_height_max`

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
- :class:`Node.bl_system_properties_get`
- :class:`Node.socket_value_update`
- :class:`Node.is_registered_node_type`
- :class:`Node.poll`
- :class:`Node.poll_instance`
- :class:`Node.update`
- :class:`Node.insert_link`
- :class:`Node.init`
- :class:`Node.copy`
- :class:`Node.free`
- :class:`Node.draw_buttons`
- :class:`Node.draw_buttons_ext`
- :class:`Node.draw_label`
- :class:`Node.debug_zone_body_lazy_function_graph`
- :class:`Node.debug_zone_lazy_function_graph`
- :class:`Node.poll`
- :class:`Node.bl_rna_get_subclass`
- :class:`Node.bl_rna_get_subclass_py`
- :class:`NodeInternal.poll`
- :class:`NodeInternal.poll_instance`
- :class:`NodeInternal.update`
- :class:`NodeInternal.draw_buttons`
- :class:`NodeInternal.draw_buttons_ext`
- :class:`NodeInternal.bl_rna_get_subclass`
- :class:`NodeInternal.bl_rna_get_subclass_py`
- :class:`ShaderNode.poll`
- :class:`ShaderNode.bl_rna_get_subclass`
- :class:`ShaderNode.bl_rna_get_subclass_py`
