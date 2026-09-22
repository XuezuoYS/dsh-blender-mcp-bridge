<!-- source: manual/compositing/types/color/adjust/color_correction.rst -->

.. _bpy.types.CompositorNodeColorCorrection:

*********************

figure: /images/node-types_CompositorNodeColorCorrection.webp
The Color Correction node adjusts the color of an image, separately in several tonal ranges
(highlights, midtones and shadows).

Image
Standard color input.
Mask
Controls the amount of influence the node exerts on the output image.

These settings target the entire tonal range.

Saturation
Adjusts the image's saturation.
Contrast
Adjust image contrast.
Gamma
Exponential gamma correction, affecting the midtones of the image. (Works like Power in the Color Balance node.)
Gain
Multiplier, stronger influence on the highlights. (Works like Slope in the Color Balance node.)
Offset
This value (can be negative) will be added (+), linear lightens or darkens the image.

These settings target specific brightness ranges of the image.

Each tonal range (Highlights, Midtones, Shadows) supports the same controls as Master.

Midtones Start, Midtones End
Defines the start and the end of midtones range, i.e.
values where the whole tonal range is divided into the highlights, midtones and shadows
(there is also a smooth transition between the ranges of width 0.2 units).

Red, Green, Blue
Specifies which RGB channels will be affected by the correction.

Color
Standard color output.
