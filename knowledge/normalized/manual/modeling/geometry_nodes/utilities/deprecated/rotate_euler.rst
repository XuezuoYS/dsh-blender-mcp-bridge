<!-- source: manual/modeling/geometry_nodes/utilities/deprecated/rotate_euler.rst -->

.. _bpy.types.FunctionNodeRotateEuler:

*****************

figure: /images/node-types_FunctionNodeRotateEuler.webp
The *Rotate Euler* node rotates an Euler rotation.

important: 
This node is deprecated, use the :doc:`/modeling/geometry_nodes/utilities/rotation/rotate_rotation` instead.

Rotation
The :term:`Euler` rotation to rotate.

Rotate By
Specifies how much an Euler rotation is rotated. This input is only available
when the rotation type is set to *Euler*.

Axis
The axis to rotate around. This input is only available when the rotation type is set to *Axis Angle*.

Angle
The angle to rotate by around the specified axis. This input is only available
when the rotation type is set to *Axis Angle*.

Rotation Type
:Axis Angle: Use separate axis and angle inputs to control the rotation.
:Euler: Use an Euler input to control the rotation.

Space
:Object: Rotate an Euler rotation in the evaluated object's space.
:Local: Rotate an Euler rotation in local space.

Rotation
The rotated Euler rotation.
