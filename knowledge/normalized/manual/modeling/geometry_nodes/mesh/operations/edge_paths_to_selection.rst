<!-- source: manual/modeling/geometry_nodes/mesh/operations/edge_paths_to_selection.rst -->

.. _bpy.types.GeometryNodeEdgePathsToSelection:

****************************

figure: /images/node-types_GeometryNodeEdgePathsToSelection.webp
The *Edge Paths to Selection* node follows paths across mesh edges and outputs a selection
of every visited edge.

seealso: 
This node is meant to use the output of the :doc:`/modeling/geometry_nodes/mesh/read/shortest_edge_paths`.
It can be combined with the :doc:`/modeling/geometry_nodes/geometry/operations/separate_geometry` to remove
any unused edges.

Start Vertices
A selection of the vertices to start at when traveling along the next vertex indices.

Next Vertex Index
Describes the path to follow at every vertex.

Selection
A boolean field indicating all edges visited when traversing the mesh.
