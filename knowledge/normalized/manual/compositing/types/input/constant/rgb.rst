<!-- source: manual/compositing/types/input/constant/rgb.rst -->

.. _bpy.types.CompositorNodeRGB:
.. Editor's Note: This page gets copied into :doc:`</render/cycles/nodes/types/input/rgb>`

.. --- copy below this line ---

**********

figure: /images/node-types_CompositorNodeRGB.webp
The *Color* node outputs the color value chosen with the color picker widget.

tip: 
Dragging colors from a color picker button into a node editor creates a Color node.
Alpha values are preserved, if the source color has no alpha, a value of 1.0 is used.

This node has no input sockets.

The Color node uses the :ref:`color picker widget <ui-color-picker>`.

Color
Outputs the chosen color as a single constant value.
