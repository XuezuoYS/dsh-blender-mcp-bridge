<!-- source: manual/modeling/geometry_nodes/mesh/primitives/grid.rst -->

.. _bpy.types.GeometryNodeMeshGrid:

*********

figure: /images/node-types_GeometryNodeMeshGrid.webp
The *Grid* node generates a planar mesh on the XY plane.

Size X
Side length of the plane in the X direction.

Size Y
Side length of the plane in the Y direction.

Vertices X
Number of vertices in the X direction.
If this is smaller than two, no mesh is generated.

Vertices Y
Number of vertices in the Y direction.
If this is smaller than two, no mesh is generated.

Mesh
Standard geometry output.

UV Map
A 2D vector representing the default X/Y coordinates of the :term:`UV Map` for the primitive's shape.
This can be connected to the :doc:`/modeling/geometry_nodes/attribute/store_named_attribute`,
to be used once the Geometry Nodes Modifier get applied.
The UV map must be stored on the face corner in order to be accessed.
