<!-- source: manual/sculpt_paint/curves_sculpting/brushes/grow_shrink_curves.rst -->

********************

Change the length of existing curves preserving the amount of control points
and resampling the curve to preserve the original shape.

Direction
Determines whether to grow or shrink the curves. It can be toggled holding :kbd:`Ctrl` while sculpting.

.. _bpy.types.BrushCurvesSculptSettings.use_uniform_scale:

Scale Uniform
Grow or shrink curves by changing their size uniformly instead of using trimming or extrapolation.

.. _bpy.types.BrushCurvesSculptSettings.minimum_length:

Minimum Length
Avoid shrinking curves shorter than this length.
