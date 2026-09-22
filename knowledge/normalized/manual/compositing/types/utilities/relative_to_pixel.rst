<!-- source: manual/compositing/types/utilities/relative_to_pixel.rst -->

.. _bpy.types.CompositorNodeRelativeToPixel:

**********************

figure: /images/node-types_CompositorNodeRelativeToPixel.webp
The *Relative To Pixel* node converts values that are relative to the image size into values in pixel units.
This is useful when working with screen-space operations that require absolute pixel values,
such as blurring or positioning effects in the compositor.

Value
A float or vector value that is relative to the image size and should be converted to pixels.

Image
The image used to determine the resolution for the conversion. This defines the reference size
used for computing pixel values.

Data Type
The type of data being converted.

:Float: A single float value.
:Vector: A vector (e.g. 2D) value.

Reference Dimension
Defines which part of the image's dimensions the relative value refers to.

:Per Dimension: Each axis (X and Y) is scaled independently by the image width and height.
:X: The value is scaled relative to the image width.
:Y: The value is scaled relative to the image height.
:Greater: The value is scaled relative to the larger of the image dimensions.
:Smaller: The value is scaled relative to the smaller of the image dimensions.
:Diagonal: The value is scaled relative to the diagonal length of the image.

Value
The input value converted from a relative scale to an absolute pixel scale.
The output type matches the selected *Data Type*.
