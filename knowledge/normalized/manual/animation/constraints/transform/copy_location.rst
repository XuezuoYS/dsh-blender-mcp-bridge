<!-- source: manual/animation/constraints/transform/copy_location.rst -->

.. _bpy.types.CopyLocationConstraint:

************************

The *Copy Location* constraint forces an object or bone to match the location of a target.

important: 
This constraint has no effect on :ref:`connected bones <bpy.types.EditBone.use_connect>`
as their position is determined by their parent bone.

figure: /images/animation_constraints_transform_copy-location_panel.png
:ref:`Target <rigging-constraints-interface-common-target>`
The object or bone whose location to copy.

Axis
The axes for which to copy location coordinates.

Invert
The axes for which invert the sign (so a coordinate of 10 becomes -10 and vice versa).

Offset
When enabled, the target's current position (from all its constraints) is not copied over,
but added to the owner's original position (from its preceding constraints).

:ref:`Target/Owner <rigging-constraints-interface-common-space>`
The spaces for retrieving the coordinates from the target and for applying them to the owner.

:ref:`bpy.types.constraint.influence`
How strongly the constraint affects the owner.

This video shows the effect of the *Head/Tail* setting when targeting a bone,
as well as the *Vertex Group* setting when targeting a mesh.

In the animation below, the camera follows the moon as it orbits the Earth,
switches to following the Earth as it orbits the Sun, and finally moves to a fixed
location for showing the Sun. This is done using two *Copy Location* constraints --
one for the moon and one for the Earth -- with animated *Influence* values for
smoothly disabling one while enabling the other.

..
You can download
the `blend-file <https://archive.blender.org/wiki/2015/index.php/File:ManAnimationTechsUsingConstraintsExSolarSys.blend>`__
used to create this animation.

^ Commented out because the drivers no longer work in the current Blender version
