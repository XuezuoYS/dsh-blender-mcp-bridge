<!-- source: manual/modeling/geometry_nodes/geometry/read/active_element.rst -->

.. _bpy.types.GeometryNodeToolActiveElement:

*******************

figure: /images/node-types_GeometryNodeToolActiveElement.webp
The *Active Element* node outputs the index of the :term:`Active` point, edge, face, or layer.

note: 
This node can only be used in the :ref:`Tool context <tool_context>`.

This node has no inputs.

Domain
Which :ref:`domain <attribute-domains>` to return the index of.

Index
Index of the active element in the specified domain.

Exists
True if an active element exists in the mesh, false otherwise
