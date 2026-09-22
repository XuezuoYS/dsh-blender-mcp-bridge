<!-- source: manual/animation/constraints/relationship/pivot.rst -->

.. _bpy.types.PivotConstraint:

****************

The *Pivot* constraint makes an object or bone rotate around a point other than
its :doc:`origin </scene_layout/object/origin>`. This can be a point that's relative
to the same or another object/bone, or a point that's fixed in space.

figure: /images/animation_constraints_relationship_pivot_panel.png
:ref:`Target <rigging-constraints-interface-common-target>`
The object or bone to use as the pivot point. Can be left empty,
in which case the pivot point is either relative to the constraint owner itself
or not relative to anything (fixed in space).

Use Relative Offset :guilabel:`No Target set`
Whether the *Pivot Point* coordinates are relative to the constraint owner
or absolute in the world. If a *Target* is set, the coordinates are always relative.

Pivot Point X, Y, Z
The coordinates of the pivot point.

Rotation Range
Euler axis and direction for which the constraint should be active.

:Always:
Apply pivoting for every possible owner rotation.
:-X/-Y/-Z Rotation:
Only apply pivoting if the owner's X/Y/Z rotation is negative or zero.
:X/Y/Z Rotation:
Only apply pivoting if the owner's X/Y/Z rotation is positive or zero.

:ref:`bpy.types.constraint.influence`
How strongly the constraint affects the owner.
