<!-- source: manual/modeling/geometry_nodes/mesh/read/is_edge_smooth.rst -->

.. _bpy.types.GeometryNodeInputEdgeSmooth:

*******************

figure: /images/node-types_GeometryNodeInputEdgeSmooth.webp
The *Is Edge Smooth* node outputs true for each edge of the mesh that is *not* marked as sharp. Otherwise, if the edge
*is* marked as sharp, then the node outputs false.

seealso: 
:ref:`Mark Sharp & Clear Sharp <bpy.ops.mesh.mark_sharp>`

This node has no inputs.

Smooth
Boolean value that indicates whether the edges of the mesh are *not* marked as sharp.
