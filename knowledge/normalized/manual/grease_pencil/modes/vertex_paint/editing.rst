<!-- source: manual/grease_pencil/modes/vertex_paint/editing.rst -->

***************************

.. _bpy.ops.grease_pencil.vertex_color_set:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Set Color Attribute`
Sets the :ref:`active color <grease-pencil-vertex-paint-brush-color>` to all selected vertices.

.. _bpy.ops.grease_pencil.stroke_reset_vertex_color:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Reset Vertex Color`
Removes the Color Attribute information of the active strokes,
if no strokes are selected, all strokes are reset.

.. _bpy.ops.grease_pencil.vertex_color_invert:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Invert`
Invert RGB values.

.. _bpy.ops.grease_pencil.vertex_color_levels:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Levels`
Adjust the levels of Color Attributes.

.. _bpy.ops.grease_pencil.vertex_color_hsv:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Hue/Saturation/Value`
Adjust the color's HSV values.

.. _bpy.ops.grease_pencil.vertex_color_brightness_contrast:

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Brightness/Contrast`
Adjust the color's brightness/contrast.

:Mode:      Vertex Paint Mode
:Menu:      :menuselection:`Paint --> Sample Color`
:Shortcut:  :kbd:`Shift-X`

.. :Shortcut:  :kbd:`Shift-X`, :kbd:`Shift-Ctrl-X`
Samples a color from the viewport and assigns it to the active
:doc:`Paint </sculpt_paint/sculpting/brushes/paint>` brush.

When invoking the operator from a menu (instead of using a shortcut),
you can click and drag across multiple colors to sample their average.

This allows quickly matching the brush color to existing painted details
directly on the model.

- Press :kbd:`Shift-X` to sample a color at the mouse cursor position.

.. - Press :kbd:`Shift-Ctrl-X` to sample the **merged viewport color**,
..   including lighting, shading, and all visible layers.

The sampled color becomes the primary color of the active Paint brush.
