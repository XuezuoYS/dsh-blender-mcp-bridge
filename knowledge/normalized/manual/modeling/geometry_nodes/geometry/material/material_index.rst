<!-- source: manual/modeling/geometry_nodes/geometry/material/material_index.rst -->

.. _bpy.types.GeometryNodeInputMaterialIndex:

*******************

figure: /images/node-types_GeometryNodeInputMaterialIndex.webp
The *Material Index* node outputs which material in the list of materials of the geometry
each element corresponds to. Currently the node supports mesh data, where ``material_index``
is a built-in attribute on faces.

The node to set this data is
the :doc:`Set Material Index </modeling/geometry_nodes/geometry/material/set_material_index>` node.

This node has no inputs.

Material Index
Standard integer value, with a minimum value of zero.
