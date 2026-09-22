<!-- source: manual/modeling/geometry_nodes/geometry/read/id.rst -->

.. _bpy.types.GeometryNodeInputID:

*******

figure: /images/node-types_GeometryNodeInputID.webp
The *ID* node gives an integer value indicating the stable random identifier of each element on the point domain,
which is stored in the ``id`` attribute.

The node to set this data is the :doc:`/modeling/geometry_nodes/geometry/write/set_id` node.

note: 
Unlike other built-in attributes, the ``id`` attribute does not always exist.
In that case, this node will output the :doc:`index </modeling/geometry_nodes/geometry/read/input_index>`.

This node has no inputs.

ID
Integer value.
