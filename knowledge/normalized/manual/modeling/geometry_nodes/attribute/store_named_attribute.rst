<!-- source: manual/modeling/geometry_nodes/attribute/store_named_attribute.rst -->

.. _bpy.types.GeometryNodeStoreNamedAttribute:

**************************

figure: /images/node-types_GeometryNodeStoreNamedAttribute.webp
The *Store Named Attribute* node stores the result of a field on a geometry
as an attribute with the specified name. If the attribute already exists, the data
type and domain will be updated to the values chosen in the node.
However, keep in mind that the domain and data type of :ref:`geometry-nodes_builtin-attributes`
cannot be changed.

Compared with the :doc:`/modeling/geometry_nodes/attribute/capture_attribute`, this node basically
does the same thing, but the attribute gets a name instead of an anonymous reference.
For reusing the data in the same node tree, the *Capture Attribute* node might be preferable
since it does not create the chance for name conflicts in the input geometry.

note: 
If the input geometry contains multiple geometry component types, the attribute will be
created on each component that has the chosen domain.

Geometry
Standard geometry input.

Selection
A boolean field input for each element indicating whether to store the attribute value for the given index.
If the attribute does not exist, unselected parts are filled with zero values;
otherwise, only the selected parts are filled.

Value
The input field to evaluate.

Name
The name to give the stored data.

Data Type
The :ref:`data type <attribute-data-types>` used for the evaluated data.

Domain
Which :ref:`attribute domain <attribute-domains>` to store the evaluated data on.

Geometry
Standard geometry output.
