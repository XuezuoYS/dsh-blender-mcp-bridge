<!-- source: manual/modeling/geometry_nodes/utilities/list/filter_list.rst -->

.. _bpy.types.GeometryNodeFilterList:

****************

figure: /images/node-types_GeometryNodeFilterList.webp
The *Filter List* node splits a list into two lists based on a boolean selection.

Items with a corresponding selection value of ``true`` are placed in the
*Selection* output, while items with a selection value of ``false`` are placed
in the *Inverted* output.

List
The input list to filter.

Selection
A boolean list used to determine which items are included in each output.

The selection list is matched to the input list by index.

Data Type
The data type of the input and output lists.

Selection
A list containing all items whose corresponding selection value is ``true``.

Inverted
A list containing all items whose corresponding selection value is ``false``.
