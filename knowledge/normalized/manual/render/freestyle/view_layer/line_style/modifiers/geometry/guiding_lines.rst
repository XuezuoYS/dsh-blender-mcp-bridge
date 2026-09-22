<!-- source: manual/render/freestyle/view_layer/line_style/modifiers/geometry/guiding_lines.rst -->

.. _bpy.types.LineStyleGeometryModifier_GuidingLines:

*************

The *Guiding Lines* modifier replaces a stroke by a straight line connecting both of its ends.

Offset
Offset the start and end points along the original stroke, before generating the new straight one.

This modifier will produce reasonable results when strokes are short enough,
because shorter strokes are more likely to be well approximated by straight lines.
Therefore, it is recommended to use this modifier together with one of the splitting options
(by 2D angle or by 2D length) from the *Strokes* panel.

figure: /images/render_freestyle_parameter-editor_line-style_modifiers_geometry_guiding-lines_example.png
