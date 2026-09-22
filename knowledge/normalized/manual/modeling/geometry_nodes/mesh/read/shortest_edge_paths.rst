<!-- source: manual/modeling/geometry_nodes/mesh/read/shortest_edge_paths.rst -->

.. _bpy.types.GeometryNodeInputShortestEdgePaths:

************************

figure: /images/node-types_GeometryNodeInputShortestEdgePaths.webp
The *Shortest Edge Paths* node finds paths along mesh edges to a selection of end vertices.
The cost used to define "shortest" can be set to anything. By default there is a constant cost
for every edge, but a typical input would be the length of each edge.

The output is encoded with vertex indices, and is meant to be used on the vertex domain.
For each vertex, the *Next Vertex Index* output gives the index of the following vertex
in the path to the "closest" endpoint.

The node is implemented with `Dijkstra's algorithm <https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm>`__.

tip: 
figure: /images/modeling_geometry-nodes_mesh_shortest-edge-paths_distance.png
seealso: 
This node can be used with the :doc:`/modeling/geometry_nodes/mesh/operations/edge_paths_to_selection`
or the :doc:`/modeling/geometry_nodes/mesh/operations/edge_paths_to_curves` to generate new geometry
based on the paths.

End Vertex
A selection of the goal vertices that terminate the edge paths.

Edge Cost
The weight for each edge, used to determine the meaning of "shortest."

Next Vertex Index
The following vertex on the shortest path from every vertex to the closest endpoint
(as defined by the cost input).

Total Cost
The remaining cost before an end vertex is reached.

figure: /images/modeling_geometry-nodes_shortest_edge_paths_example-1.jpg
figure: /images/modeling_geometry-nodes_shortest_edge_paths_example-2.jpg
figure: /images/modeling_geometry-nodes_shortest_edge_paths_example-3.png
