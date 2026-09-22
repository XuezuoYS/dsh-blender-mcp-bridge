<!-- source: manual/modeling/geometry_nodes/geometry/read/get_geometry_bundle.rst -->

.. _bpy.types.GeometryNodeGetGeometryBundle:

************************

figure: /images/node-types_GeometryNodeGetGeometryBundle.webp
The *Get Geometry Bundle* node extracts the bundle stored on a geometry.

Bundles can store arbitrary data alongside geometry, allowing information to
be passed between node groups, modifiers, and objects without modifying the geometry itself.

Geometry
Geometry from which to retrieve the bundle.

Remove
Removes the bundle from the geometry after extracting it.

This can improve performance by avoiding unnecessary copies when the
bundle is no longer needed.

Geometry
The input geometry.

If *Remove* is enabled, the output geometry no longer contains the
extracted bundle.

Bundle
The bundle stored on the input geometry.
