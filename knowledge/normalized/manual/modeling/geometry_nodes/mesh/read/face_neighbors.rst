<!-- source: manual/modeling/geometry_nodes/mesh/read/face_neighbors.rst -->

.. _bpy.types.GeometryNodeInputMeshFaceNeighbors:

*******************

figure: /images/node-types_GeometryNodeInputMeshFaceNeighbors.webp
The *Face Neighbors* node outputs topology information relating to each face of a mesh.

This node has no inputs.

Vertex Count
This output is simply the number of sides of each face, or how many corners each face has.

Neighboring Face Count
The number of faces that connect to this face with at least one edge. On a regular manifold
mesh with only quads and triangles, this will be the same as the vertex count, otherwise it might
be completely different.
