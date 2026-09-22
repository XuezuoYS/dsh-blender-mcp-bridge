<!-- source: manual/modeling/geometry_nodes/color/separate_color.rst -->

.. _bpy.types.FunctionNodeSeparateColor:
.. --- copy below this line ---

*******************

figure: /images/node-types_FunctionNodeSeparateColor.webp
Splits an image into its channels,
based on a particular :term:`Color Model`.

Color
Standard color input.

Mode
The color model to output.

:RGB: Red, Green, Blue.
:HSV: Hue, Saturation, Value.
:HSL: Hue, Saturation, Lightness.

The outputs of this node depend on the Mode property (see above).

Alpha
The opacity value.
