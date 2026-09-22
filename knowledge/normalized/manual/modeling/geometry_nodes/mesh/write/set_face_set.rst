<!-- source: manual/modeling/geometry_nodes/mesh/write/set_face_set.rst -->

.. _bpy.types.GeometryNodeToolSetFaceSet:

*****************

figure: /images/node-types_GeometryNodeToolSetFaceSet.webp
The *Set Face Set* node controls which :ref:`face set <face_sets>` that faces are in.

The input node for this data is the :doc:`/modeling/geometry_nodes/mesh/read/face_set`.

note: 
This node can only be used in the :ref:`Tool context <tool_context>`.

Mesh
Standard geometry input.

Selection
Boolean field that controls which faces will have the Face Set value applied.

Face Set
Integer field for specifying which face set each selected face should be moved to.
Ignored for faces where the value of Selection is false.

Mesh
Standard geometry output.
