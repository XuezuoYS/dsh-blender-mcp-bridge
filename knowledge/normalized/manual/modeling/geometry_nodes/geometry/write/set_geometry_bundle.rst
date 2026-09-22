<!-- source: manual/modeling/geometry_nodes/geometry/write/set_geometry_bundle.rst -->

.. _bpy.types.GeometryNodeSetGeometryBundle:

************************

figure: /images/node-types_GeometryNodeSetGeometryBundle.webp
The *Set Geometry Bundle* node stores a bundle on a geometry.

Bundles can store arbitrary data alongside geometry, allowing information to
be passed between node groups, modifiers, and objects without modifying the geometry itself.

The bundle stored on a geometry can later be retrieved with the
:doc:`Get Geometry Bundle </modeling/geometry_nodes/geometry/read/get_geometry_bundle>` node.

Geometry
Geometry on which to store the bundle.

Bundle
Bundle to store on the geometry.

Geometry
The input geometry with the bundle attached.
