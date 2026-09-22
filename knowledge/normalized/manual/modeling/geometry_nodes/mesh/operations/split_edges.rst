<!-- source: manual/modeling/geometry_nodes/mesh/operations/split_edges.rst -->

.. _bpy.types.GeometryNodeSplitEdges:

****************

figure: /images/node-types_GeometryNodeSplitEdges.webp
Like the :doc:`/modeling/modifiers/generate/edge_split`, the *Split Edges* node splits and duplicates edges
within a mesh, breaking 'links' between faces around those split edges.

Mesh
Standard geometry input.

Selection
A standard Boolean selection input to determine which edges will be split.

note: 
Because of mesh topology requirements, sometimes more or fewer edges than are selected will be split.

Mesh
Standard geometry output.
