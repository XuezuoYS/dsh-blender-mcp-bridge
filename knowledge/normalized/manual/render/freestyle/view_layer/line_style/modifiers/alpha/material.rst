<!-- source: manual/render/freestyle/view_layer/line_style/modifiers/alpha/material.rst -->

.. _bpy.types.LineStyle*Modifier_Material:
.. Editor's Note: This page gets copied into:
:doc:`</render/freestyle/view_layer/line_style/modifiers/alpha/material>`
:doc:`</render/freestyle/view_layer/line_style/modifiers/thickness/material>`
.. --- copy below this line ---

********

The *Material* modifier alters the base property with a new one taken from a given range mapped on
the current material under the stroke.

You can use various properties of the materials, among which many are mono-component
(i.e. give black-and-white results). In this case for the color modifier, an optional color ramp can be used to
map these gray-scale values to colored ones.
In the reverse case properties of the materials, which are multi-components
(i.e. give RGB results) the mean value will be used for Alpha and Thickness modifiers.

If used with the *Split by Material* option in the *Stroke* tab,
the result will not be blurred between materials along the strokes.

figure: /images/render_freestyle_parameter-editor_line-style_modifiers_color_material_example.png

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
