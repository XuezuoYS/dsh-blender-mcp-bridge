<!-- source: manual/modeling/geometry_nodes/mesh/primitives/cube.rst -->

.. _bpy.types.GeometryNodeMeshCube:

*********

figure: /images/node-types_GeometryNodeMeshCube.webp
The *Cube* node generates a cuboid mesh with variable side lengths and subdivisions.
The inside of the mesh is still hollow like a normal cube.

Size
Side lengths along each of the main axes.
Vertices X, Y, Z
Number of vertices for each side of the cube.
The number of vertices should be at least 1.

Mesh
Standard geometry output.
UV Map
A 2D vector representing the default X/Y coordinates of the :term:`UV Map` for the primitive's shape.
This can be connected to the :doc:`/modeling/geometry_nodes/attribute/store_named_attribute`,
to be used once the Geometry Nodes Modifier get applied.
The UV map must be stored on the face corner in order to be accessed.
