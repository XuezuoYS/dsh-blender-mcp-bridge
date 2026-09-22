<!-- source: manual/modeling/geometry_nodes/mesh/read/edge_neighbors.rst -->

.. _bpy.types.GeometryNodeInputMeshEdgeNeighbors:

*******************

figure: /images/node-types_GeometryNodeInputMeshEdgeNeighbors.webp
The *Edge Neighbors* node outputs topology information relating to each edge of a mesh.

This node has no inputs.

Face Count
The number of faces that use the edge as one of their sides.
When the value is one, the edge is a :term:`non-manifold <Non-manifold>` boundary edge.
Alternatively, when the value is zero, the edge is a loose edge, not used by any faces.

figure: /images/modeling_geometry-nodes_input_edge-vertices_boundary.png
