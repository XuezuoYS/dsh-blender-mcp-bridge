<!-- source: manual/modeling/geometry_nodes/mesh/read/edge_length.rst -->

****************

figure: /images/node-types_GeometryNodeEdgeLength.webp
The *Edge Length* node outputs the length of each edge in a mesh.
It calculates the distance between the two vertices that define each edge.

This node can be used for geometric analysis, mesh-based effects, or procedural operations
that depend on edge length (such as adaptive subdivision, weight mapping, or trimming).

This node has no inputs.

Length
The length of each edge as a floating-point value, measured in the same units as the scene scale.
