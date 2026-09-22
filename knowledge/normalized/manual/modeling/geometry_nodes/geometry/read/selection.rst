<!-- source: manual/modeling/geometry_nodes/geometry/read/selection.rst -->

.. _bpy.types.GeometryNodeToolSelection:

**************

figure: /images/node-types_GeometryNodeToolSelection.webp
The *Selection* node outputs true for geometry that is :doc:`selected </interface/selecting>`, and false elsewhere.

The corresponding data flow node is the :doc:`/modeling/geometry_nodes/geometry/write/set_selection`.

note: 
This node can only be used in the :ref:`Tool context <tool_context>`.

This node has no inputs.

Selection
Boolean field set to true for geometry that is selected in edit mode.
