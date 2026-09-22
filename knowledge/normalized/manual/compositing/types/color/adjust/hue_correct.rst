<!-- source: manual/compositing/types/color/adjust/hue_correct.rst -->

.. _bpy.types.CompositorNodeHueCorrect:

****************

The *Hue Correct Node* adjusts the hue, saturation, and value of an image,
with an input curve.

figure: /images/node-types_CompositorNodeHueCorrect.webp

Image
Standard color input.
Factor
Controls the amount of influence the node exerts on the output image.

Level
H (Hue), S (Saturation), V (Value)
Curve
For the curve controls see: :ref:`Curve widget <ui-curve-widget>`.
By default, the curve is a straight line, meaning there is no change.
The spectrum allows you to raise or lower HSV levels for each range of pixel colors.
To change an H, S, or V level, move the curve points up or down. Pixels with hue values each
point in the horizontal position of the graph will be changed depending on the shape of the curve.

Image
Standard color output.

.. todo <2.8 explain all options
