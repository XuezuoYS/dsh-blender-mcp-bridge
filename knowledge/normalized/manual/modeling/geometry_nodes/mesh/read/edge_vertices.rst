<!-- source: manual/modeling/geometry_nodes/mesh/read/edge_vertices.rst -->

.. _bpy.types.GeometryNodeInputMeshEdgeVertices:

******************

figure: /images/node-types_GeometryNodeInputMeshEdgeVertices.webp
The *Edge Vertices* node outputs the position and index of the two vertices of each of a mesh's edges.

note: 
The order of the two vertices of an edge is arbitrary. In some cases it may be predictable
based on the internals of the algorithm that created the mesh, but in general the order should
not be relied upon.

This node has no inputs.

Vertex Index 1/2
The :doc:`index </modeling/geometry_nodes/geometry/read/input_index>` of the two vertices of the edge.

Position 1/2
The :doc:`position </modeling/geometry_nodes/geometry/read/position>` of each of the edge's vertices.
This output is for convenience, it is the same as using index output to retrieve the position from the
:doc:`/modeling/geometry_nodes/utilities/field/evaluate_at_index`.
