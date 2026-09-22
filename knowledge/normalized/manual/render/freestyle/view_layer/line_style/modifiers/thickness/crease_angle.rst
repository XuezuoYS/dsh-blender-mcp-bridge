<!-- source: manual/render/freestyle/view_layer/line_style/modifiers/thickness/crease_angle.rst -->

.. _bpy.types.LineStyle*Modifier_CreaseAngle:
.. Editor's Note: This page gets copied into:
:doc:`</render/freestyle/view_layer/line_style/modifiers/alpha/crease_angle>`
:doc:`</render/freestyle/view_layer/line_style/modifiers/thickness/crease_angle>`
.. --- copy below this line ---

************

A modifier based on the Crease Angle (angle between two adjacent faces).
If a stroke segment does not lie on a crease (i.e. the edge does not have the *Crease Angle nature*),
its properties are not touched by the modifier.

Angle Min, Max
The range of input values to the mapping.
Out-of-range crease angle values will be clamped by
the Min and Max angles and their corresponding property values.

figure: /images/render_freestyle_parameter-editor_line-style_modifiers_color_crease-angle_example.png

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
