<!-- source: manual/animation/drivers/workflow_examples.rst -->

*******************

Simple Drivers can be configured from the pop-over that appears when adding a new Driver.
When adding multiple Drivers or for more advanced configurations,
it is useful to have open the :doc:`Drivers Editor </editors/drivers_editor>`.

Control a property with an object's transform.
In this example, the Y rotation of Object 2 will be driven by the X position of Object 1.
Starting from a simple setup with two objects:

#. Add a Driver to the *Rotation Y* property of the second object via the context menu or with :kbd:`Ctrl-D`.

figure: /images/animation_drivers_workflow-examples_transform-driver-1.png
#. Open the *Drivers Editor* and select the *Y Euler Rotation* property in the channels region.
#. Open the Sidebar region and select the *Drivers* tab.
#. Configure the driver to be the *Averaged Value* of a *Transform Channel* of the first object.

figure: /images/animation_drivers_workflow-examples_transform-driver-2.png
#. Experiment with moving the first object and notice how it affects the Y rotation of the second object.

Orbit an object's position around a point with a custom *Scripted Expression*.
The object's position will change when scrubbing the timeline.
Using trigonometry, circular motion can be defined in 2D using the sine and cosine functions.
(See `Unit Circle <https://en.wikipedia.org/wiki/Unit_circle>`__.)
In this example, the current frame is used as the variable that induces the motion.
``frame`` is a :ref:`Simple Expression <drivers-simple-expressions>` that corresponds to
``bpy.context.scene.frame_current``.

figure: /images/animation_drivers_workflow-examples_object-rotation.png
#. Add a driver to the X Location property.

#. Set the *Driver Type* to *Scripted Expression*.
#. Add the expression ``0 + (sin(frame / 8) * 4)``, where:

- ``frame/8`` : is the current frame of the animation, divided by 8 to slow the orbit down.
- ``(sin( )*4)`` : multiplies the result of ``sin(frame/8)`` by 4 for a bigger circle.
- ``0 +`` : is used to control the offset to the orbit center point.

#. Add a driver to the Y Location property with the expression ``0 + (cos(frame / 8) * 4)``.
#. Scrub the timeline to see the effect.
Experiment with the variables to control the size and center of the orbit.

.. _driver-namespace:

Create a custom function to get the square of a value (i.e. *value*\ :sup:`2`).
Adding the function to the *Driver Namespace* allows it to be used from driver expressions.
The *Driver Namespace* has a list of built-in functions for use in driver expressions,
as well as constants such as π and e.
These can be inspected via the Python Console::

>>> bpy.app.driver_namespace[' <tab>
acos']
acosh']
asin']
asinh']
atan']
...

To add a new function to the *Driver Namespace*, the function itself needs to be implemented
and then added to the ``bpy.app.driver_namespace``.

#. Add the following to the Text Editor inside Blender and press *Run Script*. ::

import bpy

def square(val):
"""Returns the square of the given value"""
return val * val

# Add function to driver_namespace.
bpy.app.driver_namespace['square'] = square

#. Add a driver with a *Scripted Expression* such as ``square(frame)``.
#. Observe the effect when scrubbing the timeline.

There are more custom function examples available in Blender's Text Editor
:menuselection:`Templates --> Python --> Driver Functions`.
Since :ref:`Simple Expressions <drivers-simple-expressions>` cannot access
custom functions, using them only makes sense for complex computations.

warning: 
Trying to replace built-in entries of the driver namespace may result in undefined behavior.
.. _driver-attribute-node-emulation:

The material :doc:`Attribute Node </render/shader_nodes/input/attribute>` in the View Layer mode
automatically searches for the attribute property in multiple locations. This, for example, can allow
setting a certain value of the custom attribute at the :doc:`Scene </scene_layout/scene/introduction>`
or :doc:`World </render/lights/world>` level, and then overriding it
differently for one :doc:`View Layer </render/layers/introduction>`.

figure: /images/animation_drivers_workflow-examples_attribute-lookup.png
Context Properties of drivers don't implement this behavior, so if necessary it has to be manually
emulated via fallback values and a conditional expression (conditions are
:ref:`Simple Expressions <drivers-simple-expressions>`).

For an attribute named ``attr``, the node tries the following six RNA path lookups in order:

- ``["attr"]`` in the active View Layer (custom property).
- ``attr`` in the active View Layer (built-in property).
- ``["attr"]`` in the active Scene.
- ``attr`` in the active Scene.
- ``world["attr"]`` in the active Scene.
- ``world.attr`` in the active Scene.

Depending on the specific property it may be sufficient to check only a subset of these locations.
For example, the image on the right shows how to access an attribute that is known to definitely be
a custom property with a color value.

Driver variables accessing locations that are not final in the lookup chain should use fallback values that are
invalid for the attribute (e.g. negative color values), which can then be checked by the conditional expression.
The final variable should fallback to a valid default value to be used when the property is not set at all.

.. _shapekey-driver-example:

Fix intersection problems that happen when using armatures and weight painting, especially at joints.
Shape keys can also be used to tweak and refine a rig, for example to suggest muscle formations.
In this example, a shape key is used to improve the deformation at the elbow of a rudimentary arm.

figure: /images/animation_drivers_workflow-examples_shape-key-improved-deformation.png
Setup
#. Add a mesh (in this example, a cylinder with loop cuts).
#. Add an armature with a chain of bones.
#. Skin the mesh to the armature using weight painting.

(Note: to parent the mesh to the armature: select the mesh first,
then the armature and use :kbd:`Ctrl-P` to parent with auto weights.)

Experiment with posing the armature and observe the deformation at the joint.
To fix intersection problems or angles that look unsatisfactory,
you can associate a :doc:`Shape Key </animation/shape_keys/index>` with a pose.

Shape Key
#. Pose the armature such that the problems are visible.
Be sure to cover the extreme poses that you want to support for the rig.
#. With the mesh selected, add a new *Shape Key* in addition to the *Basis* key.
:menuselection:`Properties --> Mesh tab --> Shape Keys`
#. In order to author the shape key on top of the armature deformation,
enable both *Edit Mode Display* and *Cage Editing* in the Armature modifier.
:menuselection:`Properties --> Modifiers tab --> Armature Modifier --> Header`
#. Enter Edit Mode and select the new shape key in the properties panel.
Adjust the vertices as desired.
Select the *Basis* key to toggle between the original mesh and your edits.
(Note: be careful to apply edits only to your shape and not to
the original mesh or other existing keys.)

Once you are satisfied with how the deformation looks for the problematic pose,
you'll need to configure a driver to activate the shape smoothly when entering that position.

Driver
#. Add a driver to the *Value* of the shape key you've created.
#. Open the Drivers Editor and select the driver.

Method 1 -- Direct mapping to a bone rotation value
A simple way to configure the driver is with a direct correspondence of
the value of a bone's rotation channel to the shape key activation *Value*.
This method has the disadvantage of relying on a single channel of a bone's
rotation which might be insufficient to precisely express the condition
under which the shape key should be activated.

#. In the Drivers tab, select the *Averaged Value* of the rotation of
the bone you are posing.

Understand the rotation axis that you are interested in by enabling axes display
in the armature or by observing the bone's transform values in the Properties.

Select the rotation channel and set it to local, meaning, the bone's
rotation value relative to its parent bone.

figure: /images/animation_drivers_workflow-examples_shape-key-method1.png
figure: /images/animation_drivers_workflow-examples_shape-key-method2.png

Activate different shape keys in succession.
In this example, moving a single bone will activate first *Key 1* and then *Key 2*.
See also :ref:`relative shape keys mix additively <animation-shapekeys-relative-vs-absolute>`.

Shape Keys
Add two shape keys to a mesh, besides the *Basis*.

[unparsed directive: list-table]

* - .. figure:: /images/animation_drivers_workflow-examples_chained-shape-keys-basis.png
:width: 200px

Basis.

- .. figure:: /images/animation_drivers_workflow-examples_chained-shape-keys-key1.png
:width: 200px

Key 1: top faces moved up by 1 m.

- .. figure:: /images/animation_drivers_workflow-examples_chained-shape-keys-key2.png
:width: 200px

Key 2: inner top moved up by 1 m.

Drivers
Add an armature with a single bone to control the shape keys.
The goal is to activate the keys in succession as this bone moves up.

figure: /images/animation_drivers_workflow-examples_chained-shape-keys-result.png
figure: /images/animation_drivers_workflow-examples_chained-shape-keys-driver-setup.png
