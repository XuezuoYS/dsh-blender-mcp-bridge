<!-- source: manual/modeling/geometry_nodes/geometry/write/set_selection.rst -->

.. _bpy.types.GeometryNodeToolSetSelection:

******************

figure: /images/node-types_GeometryNodeToolSetSelection.webp
The *Set Selection* node controls which geometry is :doc:`selected </interface/selecting>`.

The input node for this data is the :doc:`/modeling/geometry_nodes/geometry/read/selection`.

note: 
This node can only be used in the :ref:`Tool context <tool_context>`.

Geometry
Standard geometry input.

Selection
Boolean field for specifying which elements should be selected in the output geometry.
Elements for which this field evaluates to false are implicitly de-selected.

Domain
Which :ref:`domain <attribute-domains>` to set the selection on.

Geometry
Standard geometry output.
