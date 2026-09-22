<!-- source: manual/grease_pencil/modes/draw/tools/line.rst -->

.. _tool-grease-pencil-draw-line:

*********

:Mode:      Draw Mode
:Tool:      :menuselection:`Toolbar --> Line`
The Line tool creates straight lines using any of the *Draw* type brushes.

You can configure the brush main settings exposed on the Tool Settings for convenience.
For the draw brushes configuration and settings see:
:doc:`Draw Brush </grease_pencil/modes/draw/brushes/draw>`.

Subdivisions
The number of stroke points between each stroke edge.

Thickness Profile
Use a :doc:`curve widget </interface/controls/templates/curve>` to define the stroke thickness
from the start (left) to end (right) of the stroke.

Use Curve
When enabled, the stroke use a curve profile to control the thickness along the line.

[unparsed directive: list-table] Different thickness profile samples.

* - .. figure:: /images/grease-pencil_modes_draw_tools_line_thickness-profile-01.png
:width: 200px

- .. figure:: /images/grease-pencil_modes_draw_tools_line_thickness-profile-02.png
:width: 200px

- .. figure:: /images/grease-pencil_modes_draw_tools_line_thickness-profile-03.png
:width: 200px

Picks the brush asset used by the tool.

See :doc:`/grease_pencil/modes/draw/tool_settings/brushes` for more information.

See :doc:`/grease_pencil/modes/draw/brushes/draw` for a detailed list of all draw brushes and their options.

Parameters to control to look of the stroke.

See :doc:`/grease_pencil/modes/draw/brushes/draw` for details.

Settings to determine the color of strokes.

See :doc:`/grease_pencil/modes/draw/tool_settings/color`

In the Tool Settings select the brush, material and color type to use with the tool.
The Line tool uses *Draw Brush* types.
See :ref:`grease-pencil-draw-common-options` for more information.

#. Click (:kbd:`LMB` or the :kbd:`Pen` tip) and drag the start point.
#. Release on the desired end point.
#. After releasing you can move the start and end point by clicking and dragging on the yellow manipulators.
#. Then confirm (:kbd:`Return`/:kbd:`MMB`) or cancel (:kbd:`Esc`/:kbd:`RMB`).

While dragging you can use :kbd:`Shift` to snapping the line to horizontal, vertical or 45° angle
or use :kbd:`Alt` to create the line from a center point.

:kbd:`NumpadPlus` and :kbd:`NumpadMinus` or using the mouse :kbd:`Wheel`
will increase or decrease the amount of points in the final line.

:kbd:`F` will adjust the line thickness and :kbd:`Shift-F` will adjust the opacity of the strokes.

[unparsed directive: list-table]

* - .. figure:: /images/grease-pencil_modes_draw_tools_line_example-01.png
:width: 200px

click and dragging the start point.

- .. figure:: /images/grease-pencil_modes_draw_tools_line_example-02.png
:width: 200px

Moving start and end points with manipulators.

- .. figure:: /images/grease-pencil_modes_draw_tools_line_example-03.png
:width: 200px

The line after confirming.

Before confirming you can use :kbd:`E` to extrude the end point of the line
to generate multiple connected lines.

[unparsed directive: list-table]

* - .. figure:: /images/grease-pencil_modes_draw_tools_line_extrude-01.png
:width: 200px

End point extruding.

- .. figure:: /images/grease-pencil_modes_draw_tools_line_extrude-02.png
:width: 200px

Moving the end point of the last line with the manipulator.

- .. figure:: /images/grease-pencil_modes_draw_tools_line_extrude-03.png
:width: 200px

The connected lines after confirming.
