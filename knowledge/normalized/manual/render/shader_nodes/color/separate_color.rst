<!-- source: manual/render/shader_nodes/color/separate_color.rst -->

.. _bpy.types.ShaderNodeSeparateColor:

*******************

figure: /images/node-types_ShaderNodeSeparateColor.webp
Splits a color into its channels,
based on a particular :term:`Color Model`.

Color
Standard color input.

Mode
The color model to output.

:RGB: Red, Green, Blue.
:HSV: Hue, Saturation, Value.
:HSL: Hue, Saturation, Lightness.

The outputs of this node depend on the Mode property (see above).
