<!-- source: manual/compositing/types/filter/despeckle.rst -->

.. _bpy.types.CompositorNodeDespeckle:

**************

figure: /images/node-types_CompositorNodeDespeckle.webp
The *Despeckle* node is used to smooth areas of an image in which noise is noticeable,
while leaving complex areas untouched.

This works by the standard deviation of each pixel and its neighbors is calculated to determine
if the area is one of high complexity or low complexity.
If the complexity is lower than the threshold then the area is smoothed using a simple mean filter.

Image
Standard color input.
Factor
Controls the amount the filter affects the image.
Color Threshold
The threshold to control high/low complexity.
Neighbor Threshold
The threshold to control the number of pixels that must match.

Image
Standard color output.
