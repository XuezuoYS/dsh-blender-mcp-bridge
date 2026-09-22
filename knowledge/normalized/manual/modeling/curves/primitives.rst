<!-- source: manual/modeling/curves/primitives.rst -->

.. _bpy.ops.curve.primitive*add:

****************

:Mode:      Object Mode and Edit Mode
:Menu:      :menuselection:`Add --> Curve`
:Shortcut:  :kbd:`Shift-A`
seealso: 
When adding curves there are some common options like other :ref:`Objects <object-common-options>`.
note: 
Eventually all the primitive curves will be replaced to use the same curve system used for hair curves.
Until this is done, their features will diverge.

They can be converted interchangeably to access the full range of edit and sculpting functionalities.
In Object/Edit Mode, the *Add Curve* menu, provides a few different curve primitives:

Adds an open 2D Bézier curve with two control points.

Adds a closed, circle-shaped 2D Bézier curve (made of four control points).

Adds an open 2D :term:`NURBS` curve, with four control points, with *Uniform* knots.

Adds a closed, circle-shaped 2D :term:`NURBS` curve (made of eight control points).

Adds a :term:`NURBS` open 3D curve made of five aligned control points,
with *Endpoint* knots and the *Curve Path* setting enabled.
