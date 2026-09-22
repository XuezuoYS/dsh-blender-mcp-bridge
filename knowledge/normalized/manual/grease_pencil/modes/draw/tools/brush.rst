<!-- source: manual/grease_pencil/modes/draw/tools/brush.rst -->

**********

:Mode:      Draw Mode
:Tool:      :menuselection:`Toolbar --> Brush`
Tool to free form draw Grease Pencil strokes using any of the *Draw* type brushes.

tip: 
Activating a brush asset from an asset shelf or brush selector will also activate this tool for convenience.

Picks the brush asset used by the tool.

See :doc:`/grease_pencil/modes/draw/tool_settings/brushes` for more information.

See :doc:`/grease_pencil/modes/draw/brushes/draw` for a detailed list of all draw brushes and their options.

Parameters to control to look of the stroke.

See :doc:`/grease_pencil/modes/draw/brushes/draw` for details.

.. _bpy.types.Paint.eraser_brush:

Default Eraser Brush
Select a brush to use as eraser for quickly alternating with the main brush using
:kbd:`Ctrl-LMB`.

Settings to determine the color of strokes.

See :doc:`/grease_pencil/modes/draw/tool_settings/color`

In the Tool Settings select the brush, material and color type to use with the tool.
The Draw tool uses *Draw Brush* types.
See :ref:`grease-pencil-draw-common-options` for more information.

Click and hold :kbd:`LMB` or use the pen tip to make free-hand drawing on the viewport.

[unparsed directive: list-table] Drawing free-hand strokes.

* - .. figure:: /images/grease-pencil_modes_draw_tools_draw_free-hand-01.png
:width: 200px

- .. figure:: /images/grease-pencil_modes_draw_tools_draw_free-hand-02.png
:width: 200px

- .. figure:: /images/grease-pencil_modes_draw_tools_draw_free-hand-03.png
:width: 200px

:kbd:`Shift-LMB` toggle the use of :ref:`Stabilize Stroke <bpy.types.BrushGpencilSettings.use_settings_stabilizer>`
on the brush to have more control while drawing and get smoother lines.

[unparsed directive: list-table] Drawing strokes using *Stabilize Stroke*.

* - .. figure:: /images/grease-pencil_modes_draw_tools_draw_stabilizer-01.png

- .. figure:: /images/grease-pencil_modes_draw_tools_draw_stabilizer-02.png

- .. figure:: /images/grease-pencil_modes_draw_tools_draw_stabilizer-03.png

:kbd:`Alt-LMB` Constrains the drawing of the strokes to horizontal or vertical straight lines.

:kbd:`Ctrl-LMB` changes temporally to the active Erase tool.
See :doc:`Erase Tool </grease_pencil/modes/draw/tools/erase>` for more information.

You can also use :kbd:`B` to delete all the points in the selected drawing area.
