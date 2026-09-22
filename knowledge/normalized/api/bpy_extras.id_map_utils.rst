<!-- source: api/bpy_extras.id_map_utils.rst -->

### function `bpy_extras.id_map_utils.get_id_reference_map`

Return a dictionary of direct data-block references for every data-block in the blend file.

:return: Each datablock of the .blend file mapped to the set of IDs they directly reference.
:rtype: dict[bpy.types.ID, set[bpy.types.ID]]

### function `bpy_extras.id_map_utils.get_all_referenced_ids`

Return a set of IDs directly or indirectly referenced by id.

:param id: Datablock whose references we're interested in.
:type id: bpy.types.ID
:param ref_map: The global ID reference map, retrieved from get_id_reference_map()
:type ref_map: dict[bpy.types.ID, set[bpy.types.ID]]
:return: Set of datablocks referenced by `id`.
:rtype: set[bpy.types.ID]
