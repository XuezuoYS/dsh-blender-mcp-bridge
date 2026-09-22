<!-- source: manual/modeling/geometry_nodes/geometry/read/position.rst -->

.. _bpy.types.GeometryNodeInputPosition:

*************

figure: /images/node-types_GeometryNodeInputPosition.webp
The *Position* node outputs a vector of each point of the geometry the node is connected to.

The node can work on geometry domains besides points. In that case, the position data will be
automatically interpolated to the new domain. For example, when used as part of the input to
the :doc:`/modeling/geometry_nodes/mesh/operations/split_edges`, the position for each edge
will be the average position of the edge's two vertices.

For instances themselves, the output is the origin of each instance. However, if the node is for
a geometry node that adjusts data inside instances, the position output of this node will be
in the local space of each instance. See the :ref:`geometry-nodes_instance-processing` page
for more details.

This node has no inputs.

Position
Vector that indicates the location of each element of the geometry.
