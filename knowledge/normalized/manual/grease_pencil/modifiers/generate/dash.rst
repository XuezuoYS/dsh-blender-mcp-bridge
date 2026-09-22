<!-- source: manual/grease_pencil/modifiers/generate/dash.rst -->

.. _bpy.types.GreasePencilDashModifierData:

*****************

The *Dot Dash* modifier generates dot dash segments from the original stroke.

figure: /images/grease-pencil_modifiers_generate_dash_panel.png
Offset
Determines the starting offset of the pattern.

Segment
Makes up individual stroke of a dot dash pattern.

Use the plus/minus button on the side of the list to add/remove segments.

Dash
The number of consecutive points from the original stroke to include in this segment.
Gap
The number of points skipped after the segment ends.
Radius
The factor to apply to the original point's radius for the new points.
Opacity
The factor to apply to the original point's opacity for the new points.
Material Index
Use this index on generated segment, use -1 for existing material.
Use Cyclic
Close the segment.

See :ref:`grease-pencil-modifier-influence-filters`.
