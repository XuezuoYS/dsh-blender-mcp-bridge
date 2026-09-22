<!-- source: manual/modeling/geometry_nodes/utilities/text/join_strings.rst -->

.. _bpy.types.GeometryNodeStringJoin:

*****************

figure: /images/node-types_GeometryNodeStringJoin.webp
The *Join Strings* node combines any number of input strings into the output string.
The order of the result depends on the vertical ordering of the inputs in the multi-input socket.

tip: 
This node can be used to create a multi-line string for
the :doc:`/modeling/geometry_nodes/utilities/text/string_to_curves`,
when combined with the line break output from
the :doc:`/modeling/geometry_nodes/utilities/text/special_characters`.

Delimiter
String value to place between each concatenated string.

Strings
Multiple string values to be combined in connection order.

String
String result of the concatenation.
