<!-- source: api/bpy.types.Context.rst -->

base class --- :class:`bpy_struct`

### class `bpy.types.Context`

Current windowmanager and data context

### data `bpy.types.Context.area`

(readonly)

:type: :class:`Area` | None

### data `bpy.types.Context.asset`

(readonly)

:type: :class:`AssetRepresentation` | None

### data `bpy.types.Context.blend_data`

(readonly)

:type: :class:`BlendData` | None

### data `bpy.types.Context.collection`

(readonly)

:type: :class:`Collection` | None

### data `bpy.types.Context.engine`

(default "", readonly, never None)

:type: str

### data `bpy.types.Context.gizmo_group`

(readonly)

:type: :class:`GizmoGroup` | None

### data `bpy.types.Context.layer_collection`

(readonly)

:type: :class:`LayerCollection` | None

### data `bpy.types.Context.mode`

(default ``'EDIT_MESH'``, readonly)

:type: Literal[:ref:`rna_enum_context_mode_items`]

### data `bpy.types.Context.preferences`

(readonly)

:type: :class:`Preferences` | None

### data `bpy.types.Context.region`

(readonly)

:type: :class:`Region` | None

### data `bpy.types.Context.region_data`

(readonly)

:type: :class:`RegionView3D` | None

### data `bpy.types.Context.region_popup`

The temporary region for pop-ups (including menus and pop-overs) (readonly)

:type: :class:`Region` | None

### data `bpy.types.Context.scene`

(readonly)

:type: :class:`Scene` | None

### data `bpy.types.Context.screen`

(readonly)

:type: :class:`Screen` | None

### data `bpy.types.Context.space_data`

The current space, may be None in background-mode, when the cursor is outside the window or when using menu-search (readonly)

:type: :class:`Space` | None

### data `bpy.types.Context.tool_settings`

(readonly)

:type: :class:`ToolSettings` | None

### data `bpy.types.Context.view_layer`

(readonly)

:type: :class:`ViewLayer` | None

### data `bpy.types.Context.window`

(readonly)

:type: :class:`Window` | None

### data `bpy.types.Context.window_manager`

(readonly)

:type: :class:`WindowManager` | None

### data `bpy.types.Context.workspace`

(readonly)

:type: :class:`WorkSpace` | None

### data `bpy.types.Context.texture_slot`

#### Buttons Context
:type: :class:`TextureSlot`

### data `bpy.types.Context.scene`

:noindex:

:type: :class:`Scene`

### data `bpy.types.Context.world`

:type: :class:`World`

### data `bpy.types.Context.object`

:type: :class:`Object`

### data `bpy.types.Context.mesh`

:type: :class:`Mesh`

### data `bpy.types.Context.armature`

:type: :class:`Armature`

### data `bpy.types.Context.lattice`

:type: :class:`Lattice`

### data `bpy.types.Context.curve`

:type: :class:`Curve`

### data `bpy.types.Context.meta_ball`

:type: :class:`MetaBall`

### data `bpy.types.Context.light`

:type: :class:`Light`

### data `bpy.types.Context.speaker`

:type: :class:`Speaker`

### data `bpy.types.Context.lightprobe`

:type: :class:`LightProbe`

### data `bpy.types.Context.camera`

:type: :class:`Camera`

### data `bpy.types.Context.material`

:type: :class:`Material`

### data `bpy.types.Context.material_slot`

:type: :class:`MaterialSlot`

### data `bpy.types.Context.texture`

:type: :class:`Texture`

### data `bpy.types.Context.texture_user`

:type: :class:`ID`

### data `bpy.types.Context.texture_user_property`

:type: :class:`Property`

### data `bpy.types.Context.texture_node`

:type: :class:`Node`

### data `bpy.types.Context.bone`

:type: :class:`Bone`

### data `bpy.types.Context.edit_bone`

:type: :class:`EditBone`

### data `bpy.types.Context.pose_bone`

:type: :class:`PoseBone`

### data `bpy.types.Context.particle_system`

:type: :class:`ParticleSystem`

### data `bpy.types.Context.particle_system_editable`

:type: :class:`ParticleSystem`

### data `bpy.types.Context.particle_settings`

:type: :class:`ParticleSettings`

### data `bpy.types.Context.cloth`

:type: :class:`ClothModifier`

### data `bpy.types.Context.soft_body`

:type: :class:`SoftBodyModifier`

### data `bpy.types.Context.fluid`

:type: :class:`FluidModifier`

### data `bpy.types.Context.collision`

:type: :class:`CollisionModifier`

### data `bpy.types.Context.brush`

:type: :class:`Brush`

### data `bpy.types.Context.dynamic_paint`

:type: :class:`DynamicPaintModifier`

### data `bpy.types.Context.line_style`

:type: :class:`FreestyleLineStyle`

### data `bpy.types.Context.collection`

:noindex:

:type: :class:`LayerCollection`

### data `bpy.types.Context.gpencil`

:type: :class:`GreasePencil`

### data `bpy.types.Context.grease_pencil`

:type: :class:`GreasePencil`

### data `bpy.types.Context.curves`

:type: :class:`Curves`

### data `bpy.types.Context.pointcloud`

:type: :class:`PointCloud`

### data `bpy.types.Context.volume`

:type: :class:`Volume`

### data `bpy.types.Context.strip`

:type: :class:`Strip`

### data `bpy.types.Context.strip_modifier`

:type: :class:`StripModifier`

### data `bpy.types.Context.edit_movieclip`

#### Clip Context
:type: :class:`MovieClip`

### data `bpy.types.Context.edit_mask`

:type: :class:`Mask`

### data `bpy.types.Context.active_file`

#### File Context
:type: :class:`FileSelectEntry`

### data `bpy.types.Context.selected_files`

:type: Sequence[:class:`FileSelectEntry`]

### data `bpy.types.Context.asset_library_reference`

:type: :class:`AssetLibraryReference`

### data `bpy.types.Context.asset`

:noindex:

:type: :class:`AssetRepresentation`

### data `bpy.types.Context.selected_assets`

:type: Sequence[:class:`AssetRepresentation`]

### data `bpy.types.Context.id`

:type: :class:`ID`

### data `bpy.types.Context.selected_ids`

:type: Sequence[:class:`ID`]

### data `bpy.types.Context.edit_image`

#### Image Context
:type: :class:`Image`

### data `bpy.types.Context.edit_mask`

:noindex:

:type: :class:`Mask`

### data `bpy.types.Context.selected_nodes`

#### Node Context
:type: Sequence[:class:`Node`]

### data `bpy.types.Context.active_node`

:type: :class:`Node`

### data `bpy.types.Context.light`

:noindex:

:type: :class:`Light`

### data `bpy.types.Context.material`

:noindex:

:type: :class:`Material`

### data `bpy.types.Context.world`

:noindex:

:type: :class:`World`

### data `bpy.types.Context.scene`

#### Screen Context
:noindex:

:type: :class:`Scene`

### data `bpy.types.Context.view_layer`

:noindex:

:type: :class:`ViewLayer`

### data `bpy.types.Context.visible_objects`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.selectable_objects`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.selected_objects`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.editable_objects`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.selected_editable_objects`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.objects_in_mode`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.objects_in_mode_unique_data`

:type: Sequence[:class:`Object`]

### data `bpy.types.Context.visible_bones`

:type: Sequence[:class:`EditBone`]

### data `bpy.types.Context.editable_bones`

:type: Sequence[:class:`EditBone`]

### data `bpy.types.Context.selected_bones`

:type: Sequence[:class:`EditBone`]

### data `bpy.types.Context.selected_editable_bones`

:type: Sequence[:class:`EditBone`]

### data `bpy.types.Context.visible_pose_bones`

:type: Sequence[:class:`PoseBone`]

### data `bpy.types.Context.selected_pose_bones`

:type: Sequence[:class:`PoseBone`]

### data `bpy.types.Context.selected_pose_bones_from_active_object`

:type: Sequence[:class:`PoseBone`]

### data `bpy.types.Context.active_bone`

:type: :class:`EditBone` | :class:`Bone`

### data `bpy.types.Context.active_pose_bone`

:type: :class:`PoseBone`

### data `bpy.types.Context.active_object`

:type: :class:`Object`

### data `bpy.types.Context.object`

:noindex:

:type: :class:`Object`

### data `bpy.types.Context.edit_object`

:type: :class:`Object`

### data `bpy.types.Context.sculpt_object`

:type: :class:`Object`

### data `bpy.types.Context.vertex_paint_object`

:type: :class:`Object`

### data `bpy.types.Context.weight_paint_object`

:type: :class:`Object`

### data `bpy.types.Context.image_paint_object`

:type: :class:`Object`

### data `bpy.types.Context.particle_edit_object`

:type: :class:`Object`

### data `bpy.types.Context.pose_object`

:type: :class:`Object`

### data `bpy.types.Context.active_nla_track`

:type: :class:`NlaTrack`

### data `bpy.types.Context.active_nla_strip`

:type: :class:`NlaStrip`

### data `bpy.types.Context.selected_nla_strips`

:type: Sequence[:class:`NlaStrip`]

### data `bpy.types.Context.selected_movieclip_tracks`

:type: Sequence[:class:`MovieTrackingTrack`]

### data `bpy.types.Context.annotation_data`

:type: :class:`GreasePencil`

### data `bpy.types.Context.annotation_data_owner`

:type: :class:`ID`

### data `bpy.types.Context.active_annotation_layer`

:type: :class:`AnnotationLayer`

### data `bpy.types.Context.grease_pencil`

:noindex:

:type: :class:`GreasePencil`

### data `bpy.types.Context.active_operator`

:type: :class:`Operator`

### data `bpy.types.Context.active_action`

:type: :class:`Action`

### data `bpy.types.Context.selected_visible_actions`

:type: Sequence[:class:`Action`]

### data `bpy.types.Context.selected_editable_actions`

:type: Sequence[:class:`Action`]

### data `bpy.types.Context.visible_fcurves`

:type: Sequence[:class:`FCurve`]

### data `bpy.types.Context.editable_fcurves`

:type: Sequence[:class:`FCurve`]

### data `bpy.types.Context.selected_visible_fcurves`

:type: Sequence[:class:`FCurve`]

### data `bpy.types.Context.selected_editable_fcurves`

:type: Sequence[:class:`FCurve`]

### data `bpy.types.Context.active_editable_fcurve`

:type: :class:`FCurve`

### data `bpy.types.Context.selected_editable_keyframes`

:type: Sequence[:class:`Keyframe`]

### data `bpy.types.Context.ui_list`

:type: :class:`UIList`

### data `bpy.types.Context.property`

:type: :class:`AnyType` | :class:`str` | :class:`int`


Get the property associated with a hovered button.
Returns a tuple of the data-block, data path to the property, and array index.

### data `bpy.types.Context.asset_library_reference`

note: 
When the property doesn't have an associated :class:`bpy.types.ID` non-ID data may be returned.
   This may occur when accessing windowing data, for example, operator properties.
literalinclude: ./examples/bpy.context.property.0.py
:noindex:

:type: :class:`AssetLibraryReference`

### data `bpy.types.Context.active_strip`

:type: :class:`Strip`

### data `bpy.types.Context.strips`

:type: Sequence[:class:`Strip`]

### data `bpy.types.Context.selected_strips`

:type: Sequence[:class:`Strip`]

### data `bpy.types.Context.selected_editable_strips`

:type: Sequence[:class:`Strip`]

### data `bpy.types.Context.sequencer_scene`

:type: :class:`Scene`

### data `bpy.types.Context.edit_mask`

#### Sequencer Context
:noindex:

:type: :class:`Mask`

### data `bpy.types.Context.tool_settings`

:noindex:

:type: :class:`ToolSettings`

### data `bpy.types.Context.edit_text`

#### Text Context
:type: :class:`Text`

### data `bpy.types.Context.active_object`

#### View3D Context
:noindex:

:type: :class:`Object`

### data `bpy.types.Context.selected_ids`

:noindex:

:type: Sequence[:class:`ID`]

### method `bpy.types.Context.evaluated_depsgraph_get`

#### Methods
Get the dependency graph for the current scene and view layer, to access to data-blocks with animation and modifiers applied. If any data-blocks have been edited, the dependency graph will be updated. This invalidates all references to evaluated data-blocks from the dependency graph.

:return: Evaluated dependency graph
:rtype: :class:`Depsgraph`

### method `bpy.types.Context.copy`

Get context members as a dictionary.

:rtype: dict[str, Any]

### method `bpy.types.Context.path_resolve`

Returns the property from the path, raise an exception when not found.

:param path: patch which this property resolves.
:type path: str
:param coerce: optional argument, when True, the property will be converted into its Python representation.
:type coerce: bool
:return: Property value or property object.
:rtype: Any | :class:`bpy_prop`

### classmethod `bpy.types.Context.bl_rna_get_subclass`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: :class:`bpy.types.Struct` | None
:return: The RNA type or default when not found.
:rtype: :class:`bpy.types.Struct`

### classmethod `bpy.types.Context.bl_rna_get_subclass_py`

:param id: The RNA type identifier.
:type id: str
:param default: The value to return when not found.
:type default: type | None
:return: The class or default when not found.
:rtype: type

### method `bpy.types.Context.temp_override`

Context manager to temporarily override members in the context.

:param window: Window override or None.
:type window: :class:`bpy.types.Window` | None
:param screen: Screen override or None.

note: Switching to or away from full-screen areas & temporary screens isn't supported. Passing in these screens will raise an exception, actions that leave the context such screens won't restore the prior screen.
note: Changing the screen has wider implications than other arguments as it will also change the works-space and potentially the scene (when pinned).
:type screen: :class:`bpy.types.Screen` | None
:param area: Area override or None.
:type area: :class:`bpy.types.Area` | None
:param region: Region override or None.
:type region: :class:`bpy.types.Region` | None
:param keywords: Additional keywords override context members.
:return: The context manager.
:rtype: :class:`bpy.types.ContextTempOverride`


Overriding the context can be used to temporarily activate another ``window`` / ``area`` & ``region``,
as well as other members such as the ``active_object`` or ``bone``.

Notes:

- When overriding window, area and regions: the arguments must be consistent,
  so any region argument that's passed in must be contained by the current area or the area passed in.
  The same goes for the area needing to be contained in the current window.

- Temporary context overrides may be nested, when this is done, members will be added to the existing overrides.

- Context members are restored outside the scope of the context-manager.
  The only exception to this is when the data is no longer available.

  In the event windowing data was removed (for example), the state of the context is left as-is.
  While this isn't likely to happen, explicit window operation such as closing windows or loading a new file
  remove the windowing data that was set before the temporary context was created.


Overriding the context can be useful to set the context after loading files
(which would otherwise be None). For example:
literalinclude: ./examples/bpy.types.Context.temp_override.2.py
literalinclude: ./examples/bpy.types.Context.temp_override.3.py
important: 
Not all operators rely on Context Members and therefore will not be affected by
   :class:`bpy.types.Context.temp_override`, use logging to what members if any are accessed.
literalinclude: ./examples/bpy.types.Context.temp_override.4.py

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

- :class:`AssetShelf.draw_context_menu`
- :class:`AssetShelf.poll`
- :class:`FileHandler.poll_drop`
- :class:`Gizmo.draw`
- :class:`Gizmo.draw_select`
- :class:`Gizmo.exit`
- :class:`Gizmo.invoke`
- :class:`Gizmo.modal`
- :class:`Gizmo.test_select`
- :class:`GizmoGroup.draw_prepare`
- :class:`GizmoGroup.invoke_prepare`
- :class:`GizmoGroup.poll`
- :class:`GizmoGroup.refresh`
- :class:`GizmoGroup.setup`
- :class:`Header.draw`
- :class:`KeyingSetInfo.generate`
- :class:`KeyingSetInfo.iterator`
- :class:`KeyingSetInfo.poll`
- :class:`Macro.draw`
- :class:`Macro.poll`
- :class:`Menu.draw`
- :class:`Menu.poll`
- :class:`Node.draw_buttons`
- :class:`Node.draw_buttons_ext`
- :class:`Node.init`
- :class:`Node.socket_value_update`
- :class:`NodeInternal.draw_buttons`
- :class:`NodeInternal.draw_buttons_ext`
- :class:`NodeSocket.draw`
- :class:`NodeSocket.draw_color`
- :class:`NodeSocketStandard.draw`
- :class:`NodeSocketStandard.draw_color`
- :class:`NodeTree.get_from_context`
- :class:`NodeTree.interface_update`
- :class:`NodeTree.poll`
- :class:`NodeTreeInterfaceSocket.draw`
- :class:`NodeTreeInterfaceSocketBool.draw`
- :class:`NodeTreeInterfaceSocketBundle.draw`
- :class:`NodeTreeInterfaceSocketClosure.draw`
- :class:`NodeTreeInterfaceSocketCollection.draw`
- :class:`NodeTreeInterfaceSocketColor.draw`
- :class:`NodeTreeInterfaceSocketFloat.draw`
- :class:`NodeTreeInterfaceSocketFloatAngle.draw`
- :class:`NodeTreeInterfaceSocketFloatColorTemperature.draw`
- :class:`NodeTreeInterfaceSocketFloatDistance.draw`
- :class:`NodeTreeInterfaceSocketFloatFactor.draw`
- :class:`NodeTreeInterfaceSocketFloatFrequency.draw`
- :class:`NodeTreeInterfaceSocketFloatMass.draw`
- :class:`NodeTreeInterfaceSocketFloatPercentage.draw`
- :class:`NodeTreeInterfaceSocketFloatPixel.draw`
- :class:`NodeTreeInterfaceSocketFloatTime.draw`
- :class:`NodeTreeInterfaceSocketFloatTimeAbsolute.draw`
- :class:`NodeTreeInterfaceSocketFloatUnsigned.draw`
- :class:`NodeTreeInterfaceSocketFloatWavelength.draw`
- :class:`NodeTreeInterfaceSocketGeometry.draw`
- :class:`NodeTreeInterfaceSocketImage.draw`
- :class:`NodeTreeInterfaceSocketInt.draw`
- :class:`NodeTreeInterfaceSocketIntFactor.draw`
- :class:`NodeTreeInterfaceSocketIntPercentage.draw`
- :class:`NodeTreeInterfaceSocketIntPixel.draw`
- :class:`NodeTreeInterfaceSocketIntUnsigned.draw`
- :class:`NodeTreeInterfaceSocketIntVector2D.draw`
- :class:`NodeTreeInterfaceSocketIntVector3D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorFactor2D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorFactor3D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorPercentage2D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorPercentage3D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorPixel2D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorPixel3D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorUnsigned2D.draw`
- :class:`NodeTreeInterfaceSocketIntVectorUnsigned3D.draw`
- :class:`NodeTreeInterfaceSocketMaterial.draw`
- :class:`NodeTreeInterfaceSocketMatrix.draw`
- :class:`NodeTreeInterfaceSocketMenu.draw`
- :class:`NodeTreeInterfaceSocketObject.draw`
- :class:`NodeTreeInterfaceSocketRotation.draw`
- :class:`NodeTreeInterfaceSocketShader.draw`
- :class:`NodeTreeInterfaceSocketString.draw`
- :class:`NodeTreeInterfaceSocketStringFilePath.draw`
- :class:`NodeTreeInterfaceSocketTexture.draw`
- :class:`NodeTreeInterfaceSocketVector.draw`
- :class:`NodeTreeInterfaceSocketVector2D.draw`
- :class:`NodeTreeInterfaceSocketVector4D.draw`
- :class:`NodeTreeInterfaceSocketVectorAcceleration.draw`
- :class:`NodeTreeInterfaceSocketVectorAcceleration2D.draw`
- :class:`NodeTreeInterfaceSocketVectorAcceleration4D.draw`
- :class:`NodeTreeInterfaceSocketVectorDirection.draw`
- :class:`NodeTreeInterfaceSocketVectorDirection2D.draw`
- :class:`NodeTreeInterfaceSocketVectorDirection4D.draw`
- :class:`NodeTreeInterfaceSocketVectorEuler.draw`
- :class:`NodeTreeInterfaceSocketVectorEuler2D.draw`
- :class:`NodeTreeInterfaceSocketVectorEuler4D.draw`
- :class:`NodeTreeInterfaceSocketVectorFactor.draw`
- :class:`NodeTreeInterfaceSocketVectorFactor2D.draw`
- :class:`NodeTreeInterfaceSocketVectorFactor4D.draw`
- :class:`NodeTreeInterfaceSocketVectorPercentage.draw`
- :class:`NodeTreeInterfaceSocketVectorPercentage2D.draw`
- :class:`NodeTreeInterfaceSocketVectorPercentage4D.draw`
- :class:`NodeTreeInterfaceSocketVectorPixel.draw`
- :class:`NodeTreeInterfaceSocketVectorPixel2D.draw`
- :class:`NodeTreeInterfaceSocketVectorPixel4D.draw`
- :class:`NodeTreeInterfaceSocketVectorTranslation.draw`
- :class:`NodeTreeInterfaceSocketVectorTranslation2D.draw`
- :class:`NodeTreeInterfaceSocketVectorTranslation4D.draw`
- :class:`NodeTreeInterfaceSocketVectorVelocity.draw`
- :class:`NodeTreeInterfaceSocketVectorVelocity2D.draw`
- :class:`NodeTreeInterfaceSocketVectorVelocity4D.draw`
- :class:`NodeTreeInterfaceSocketVectorXYZ.draw`
- :class:`NodeTreeInterfaceSocketVectorXYZ2D.draw`
- :class:`NodeTreeInterfaceSocketVectorXYZ4D.draw`
- :class:`Operator.cancel`
- :class:`Operator.check`
- :class:`Operator.description`
- :class:`Operator.draw`
- :class:`Operator.execute`
- :class:`Operator.invoke`
- :class:`Operator.modal`
- :class:`Operator.poll`
- :class:`Panel.draw`
- :class:`Panel.draw_header`
- :class:`Panel.draw_header_preset`
- :class:`Panel.poll`
- :class:`RenderEngine.draw`
- :class:`RenderEngine.view_draw`
- :class:`RenderEngine.view_update`
- :class:`UIList.draw_filter`
- :class:`UIList.draw_item`
- :class:`UIList.filter_items`
- :class:`XrSessionState.action_binding_create`
- :class:`XrSessionState.action_create`
- :class:`XrSessionState.action_set_create`
- :class:`XrSessionState.action_state_get`
- :class:`XrSessionState.active_action_set_set`
- :class:`XrSessionState.controller_aim_location_get`
- :class:`XrSessionState.controller_aim_rotation_get`
- :class:`XrSessionState.controller_grip_location_get`
- :class:`XrSessionState.controller_grip_rotation_get`
- :class:`XrSessionState.controller_pose_actions_set`
- :class:`XrSessionState.haptic_action_apply`
- :class:`XrSessionState.haptic_action_stop`
- :class:`XrSessionState.is_running`
- :class:`XrSessionState.reset_to_base_pose`
