<!-- source: manual/render/shader_nodes/input/constant/value.rst -->

.. _bpy.types.ShaderNodeValue:
.. Editor's Note: This page gets copied into:
.. - :doc:`</compositing/types/input/constant/value>`
.. - :doc:`</modeling/modifiers/nodes/input/value>`

.. --- copy below this line ---

**********

figure: /images/node-types_ShaderNodeValue.webp
The *Value Node* is a simple node to input numerical values to other nodes in the tree.

This node has no input sockets.

Single numerical value (floating-point).

Value
The value set in the node properties.

In the following example the *Value Node* is used to control multiple values at once,
this makes the node a useful organizational tool.

figure: /images/compositing_types_input_value_example.png
tip: 
From this you can also make different values proportional to each other by adding
a :doc:`Math Node </compositing/types/utilities/math/math>` in between the different links.
