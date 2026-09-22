<!-- source: manual/modeling/geometry_nodes/mesh/operations/mesh_to_points.rst -->

.. _bpy.types.GeometryNodeMeshToPoints:

*******************

figure: /images/node-types_GeometryNodeMeshToPoints.webp
The *Mesh to Points* node generates a point cloud from a mesh.

Mesh
Standard Mesh input.

Selection
The meshes used to generate a point cloud.

Position
Positions of generated points. By default, this input is the same as
if the :doc:`/modeling/geometry_nodes/geometry/read/position` was connected.

Radius
Radii of generated points.

Mode
:Vertices:
Points are generated for each vertex.
:Edges:
Points are generated for each edge, at the middle of each edge, by default.
:Faces:
Points are generated for each face, at the average of all of each face's vertices, by default.
:Corners:
Points are generated for each corner. The points are all placed at the location of each
corners vertex, so they will overlap by default.

Points
Generated point cloud.
