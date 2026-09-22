<!-- source: manual/animation/constraints/relationship/child_of.rst -->

.. _bpy.types.ChildOfConstraint:

*******************

The *Child Of* constraint transforms an object or bone as though it were a
:doc:`child </scene_layout/object/editing/parent>` of another object or bone.

The main advantage over a regular parent-child relationship is that the
constraint has an animatable *Influence*, which makes it possible to switch
to different parents over time.

This same *Influence* can also be used to mix multiple *Child Of* constraints
and create a weighted average between multiple parents. However, if those parents
are bones, the :doc:`/animation/constraints/relationship/armature` may be a better choice.

note: 
While this constraint can "parent" a bone to another, it's not very suited for
creating :ref:`chains of bones <armature-bone-chain>`. Notably, it can't
emulate connected bones (where the tip of the parent always coincides with
the base of the child).

figure: /images/animation_constraints_relationship_child-of_panel.png
:ref:`Target <rigging-constraints-interface-common-target>`
The parent object or bone.

Location
The location axes of the child to affect.

Rotation
The rotation axes of the child to affect.

Scale
The scale axes of the child to affect.

Set Inverse
If the child's transform is correct with the constraint disabled but incorrect with the
constraint enabled, click this button to fix it.

Clear Inverse
Tells the constraint that the child's current transform with the constraint disabled is its
correct *relative* transform. Once the constraint is enabled again, this transform will be
applied as an offset to the parent to determine the child's final transform.

:ref:`bpy.types.constraint.influence`
How strongly the constraint affects the owner.
