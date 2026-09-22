<!-- source: manual/modeling/geometry_nodes/grease_pencil/read/named_layer_selection.rst -->

.. _bpy.types.GeometryNodeInputNamedLayerSelection:

**************************

figure: /images/node-types_GeometryNodeInputNamedLayerSelection.webp
The *Named Layer Selection* node outputs a Boolean field whose index value is true
for :doc:`Grease Pencil layers </grease_pencil/properties/layers>` whose name matches a string input.

note: 
- The specified layer must already exist in the object.
- If no matching layer is found, the selection will be false for all elements.

Name
The name of the Grease Pencil layer to match.

Selection
A Boolean field for which the index for layers
whose name matches the input string will be true; all others are false.
