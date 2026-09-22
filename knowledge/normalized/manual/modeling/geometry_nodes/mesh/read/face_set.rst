<!-- source: manual/modeling/geometry_nodes/mesh/read/face_set.rst -->

.. _bpy.types.GeometryNodeToolFaceSet:

*************

figure: /images/node-types_GeometryNodeToolFaceSet.webp
The *Face Set Node* outputs which :ref:`face set <face_sets>` a face is in,
and whether or not face sets exist in the mesh at all.

The corresponding data flow node is the :doc:`/modeling/geometry_nodes/mesh/write/set_face_set`.

note: 
This node can only be used in the :ref:`Tool context <tool_context>`.

This node has no inputs.

Face Set
Integer indicating which face set a face is in, or 0 when the mesh does not have face sets.
When evaluated in the edge or point domain, outputs an interpolated value based on the connected faces.

Exists
Boolean value that indicates whether the element's mesh has face sets.
