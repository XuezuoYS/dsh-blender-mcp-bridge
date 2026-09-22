<!-- source: manual/grease_pencil/modifiers/deform/hook.rst -->

.. _bpy.types.GreasePencilHookModifier:

*************

The *Hook* Modifier is used to deform stroke points using another object
(usually an empty or a bone but it can be any object).

As the hook moves, it pulls points from the strokes with it.
You can think of it as animated
:doc:`Proportional Editing </editors/3dview/controls/proportional_editing>`.

seealso: 
This documentation refers to the Hook Modifier specific to the Grease Pencil object.
For uses with other object types refer to the general :doc:`/modeling/modifiers/deform/hooks`.

figure: /images/grease-pencil_modifiers_deform_hook_panel.png
Object
The name of the object to hook points to.

Strength
Adjust this hooks influence on the stroke points, were (0.0 to 1.0) (no change to fully follow the hook).

Type
This can be used to adjust the type of curve for the Strength attenuation.
You can also define a custom curve to get a much higher level of control.

Radius
The size of the hooks influence.

Uniform Falloff
This setting is useful when using hooks on scaled objects,
especially in cases where non-uniform scale would stretch the result of the hook.

See :ref:`grease-pencil-modifier-influence-filters`.

note: 
The Hook Modifier stores points indices from the original strokes to determine what to affect;
this means that modifiers that generate geometry, like a Subdivision Surface Modifier,
should always be applied **after** the Hook Modifier;
otherwise the generated geometry will be left out of the hook's influence.

figure: /images/grease-pencil_modifiers_deform_hook_sample.png
