<!-- source: manual/compositing/types/color/mix_color.rst -->

.. _bpy.types.ShaderNodeMixRGB:
.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.
.. Editor's Note: This page gets copied into:
.. - :doc:`</compositing/types/color/mix_color>`
.. - :doc:`</modeling/geometry_nodes/color/mix_rgb>`
.. --- copy below this line ---

**************

.. _bpy.types.ShaderNodeMix:
.. Editor's Note: This page gets copied into:
.. - :doc:`</modeling/geometry_nodes/utilities/mix>`
.. - :doc:`</render/shader_nodes/color/mix>`

********

.. --- copy below this line ---

The *Mix Node* mixes values, colors and vectors inputs
using a factor to control the amount of interpolation.
The *Color* mode has additional blending modes.

figure: /images/render_shader-nodes_shader_mix_node.jpg

Factor
Controls the amount of mixing between the ``A`` and ``B`` inputs.
A/B
The two inputs that are mixed together.

Data Type
The data type that is used for mixing.
The node supports float, vector, color, and rotation data types.

Factor Mode (Vector only)
The factor mode can be set to *Uniform* and *Non-Uniform*.
In uniform mode, a single float controls the factor.
In non-uniform mode, a vector controls the factor for
each XYZ channel separately.

Mix (Color only)
The Blend modes can be selected in the select menu.
See :term:`Color Blend Modes` for details on each blending mode.

Add, Subtract, Multiply, Screen, Divide, Difference,
Darken, Lighten, Overlay, Color Dodge, Color Burn,
Hue, Saturation, Value, Color, Soft Light, Linear Light

Clamp Factor
Limit the factor value between 0.0 and 1.0. If this option is
unchecked then the node operates using *Extrapolation*.

Clamp Result (Color only)
Limit the Result to the range between 0.0 and 1.0.

Result
Output the result of the mix using the data type selected.

See the :doc:`Mix Color Node </render/shader_nodes/color/mix>` for additional examples.

:start-after: .. --- copy below this line ---
:end-before: Examples

Below are examples of blending modes, as well as some practical use cases.

figure: /images/compositing_types_color_mix_blend-modes.png

The Compositing setup below shows how to fix an overexposed render by
darkening it and increasing contrast.

figure: /images/compositing_types_color_mix_contrast-enhancement.png
The top :doc:`/compositing/types/color/adjust/rgb_curves` darkens the image by linearly scaling each
color value to a smaller one.

The bottom curve node increases contrast by making small values smaller and large values larger.

Finally, the Mix node blends the two together.

In the old days, a pattern was pressed into the paper mush as it dried,
creating a mark that identified who made the paper and where it came from.
The mark was barely perceptible except in just the right light.
Probably the first form of subliminal advertising.

Nowadays, people watermark their images to identify them as personal intellectual property,
for subliminal advertising of the author or hosting service,
or simply to track their image's proliferation throughout the web.

Blender provides a complete set of tools for you to both encode your watermark
and to tell if an image has your watermark.

First, construct your own personal watermark.
You can use your name, a word, or a shape or image not easily replicated.
While neutral gray works best using the encoding method suggested,
you are free to use other colors or patterns.
It can be a single pixel or a whole gradient; it is up to you.

In the example below, we are encoding the watermark in a specific location
in the image using the *Translate* node;
this helps later because we only have to look at a specific location for the mark.
We then use the *RGB to BW node* to convert the color image to grayscale numbers,
which we then feed into the *Map Range* node to reduce the mark to one-tenth of
its original intensity.

The *Add* node (*Mix* node with blending mode *Add*) adds the corresponding pixels,
making the ones containing the mark ever-so-slightly brighter.

figure: /images/compositing_types_color_mix_watermark-encode.png
Of course, if you *want* people to notice your mark, do not scale it so much,
or make it a contrasting color. There are also many other ways,
using other mix settings and fancier rigs. Feel free to experiment!

When you see an image that you think might be yours,
use the node tree below to compare it to your stock image (non-watermarked original).
In this tree, the *Mix* node is set to Difference,
and the *Map Value* node amplifies any difference.
You can see how the original mark clearly stands out.

figure: /images/compositing_types_color_mix_watermark-decode.png

:start-after: .. --- copy below this line ---
