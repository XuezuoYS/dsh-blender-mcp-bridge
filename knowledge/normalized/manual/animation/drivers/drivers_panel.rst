<!-- source: manual/animation/drivers/drivers_panel.rst -->

*************

figure: /images/animation_drivers_drivers-panel_panel.png
:Editor:    Graph editor
:Mode:      Drivers
:Panel:     :menuselection:`Sidebar region --> Drivers`
:Shortcut:  :kbd:`N`
:Menu:      :menuselection:`Context menu --> Edit Driver`
:Shortcut:  :kbd:`Ctrl-D`
This panel is visible in Sidebar of the :doc:`Drivers Editor </editors/drivers_editor>`
or as a popover when adding a driver to a property.

It shows the property that is being driven, followed by a series of settings
that determine how the driver works.

.. _bpy.types.Driver.type:

There are two categories of drivers:

- **Built-in functions** (*Average*, *Sum*, *Min* and *Max*)

The driven property will have the value of the average, sum, lowest or highest (respectively)
of the values of the referenced *Driver Variables*.
If there is only one driver variable, these functions will yield the same result.

- **Custom** (*Scripted Expression*).

An arbitrary Python expression that can refer to the *Driver Variables* by name. See `Expressions`_.

The current result of the driver setup. Useful for debug purposes.

See `Driver Variables`_.

Forces an update for the Driver Value dependencies.

Opens the fully featured :doc:`Drivers Editor </editors/drivers_editor>`.
This button only appears in the popover version of the Drivers panel.

.. _drivers-variables:
.. _bpy.types.DriverTarget:

Variables are references to properties, transformation channels, or the result of a comparison
between transformations of two objects.

Drivers should access object data via *Driver Variables*, rather than direct references in the Python expression,
in order for dependencies to be correctly tracked.

figure: /images/animation_drivers_drivers-panel_add-variable.png
Add Input Variable
Adds a new Driver Variable.

.. _bpy.ops.graph.driver_variables_copy:
.. _bpy.ops.graph.driver_variables_paste:

Copy/Paste Variables
Copies the current variable list so it can be pasted into another driver's variable list.

.. _bpy.types.DriverVariable.name:

Name
Name for use in scripted expressions.
The name must start with a letter, and only contain letters, digits, or underscores.

.. _bpy.types.DriverVariable.type:

Variable Type
The type of variable to use.

Single Property
figure: /images/animation_drivers_drivers-panel_single-property.png
tip: 
The easiest way to create a variable of this type is to use
   the :ref:`Copy As New Driver <bpy.ops.ui.copy_as_driver_button>`
   context menu option of the input property, and paste the result
   into the driver via :ref:`Paste Driver Variables <drivers-variables>`.

Transform Channel
figure: /images/animation_drivers_drivers-panel_transform-channel2.png
figure: /images/animation_drivers_drivers-panel_rotational-difference.png
figure: /images/animation_drivers_drivers-panel_distance.png
figure: /images/animation_drivers_drivers-panel_context-property.png
tip: 
Although the values of the x/y/z animation channels for the camera location can be accessed
   via ``camera.location[0/1/2]``, retrieving its world space location and orientation after parenting
   and constraints currently requires using ``camera.matrix_world``. This property can be understood
   easily by viewing the matrix as an array of four vectors in *World* space:

   - ``matrix_world[0][0/1/2]`` is the *Screen Right* direction vector (camera local X).
   - ``matrix_world[1][0/1/2]`` is the *Screen Up* direction vector (camera local Y).
   - ``matrix_world[2][0/1/2]`` is the **opposite** of the direction the camera is pointing.
   - ``matrix_world[3][0/1/2]`` is the *location* of the camera.
Value
Shows the value of the variable.

.. _drivers-variables-rotation-modes:

Rotation Transform Channels support a number of operation modes, including:

Auto Euler
Uses the :term:`Euler` order of the target to decompose rotation into channels.
XYZ Euler, ...
Explicitly specifies the :term:`Euler` rotation order to use.
Quaternion
Provides the :term:`Quaternion` representation of the rotation.
Swing and X/Y/Z Twist
Decomposes the rotation into two parts: a :term:`Swing` rotation that aims the specified
axis in its final direction, followed by a :term:`Twist <Swing>` rotation around that axis.
This is often necessary for driving corrective :doc:`Shape Keys </animation/shape_keys/index>`
and bones for organic joint rotation.

This decomposition is often produced in rigs by using a helper bone with
a :doc:`Damped Track Constraint </animation/constraints/tracking/damped_track>`
to extract the swing part, and its child with
:doc:`Copy Transforms </animation/constraints/transform/copy_transforms>`
to extract the twist component.

The channels values for *Swing and Y Twist* are:

figure: /images/animation_drivers_drivers-panel_angle-curve.png

.. _bpy.types.Driver.expression:

Expression
A text field where you can enter an arbitrary Python expression that refers to
*Driver Variables* by their names.

The expression has access to a set of standard constants and math functions from ``math``,
``bl_math`` and other modules, provided in the *Driver Namespace*. For an example of adding
a custom function to the namespace, see the :ref:`driver namespace example <driver-namespace>`.

For performance reasons it is best to use the `Simple Expressions`_ subset as much as possible.

.. _bpy.types.Driver.use_self:

Use Self
If this option is enabled, the variable ``self`` can be used for drivers to reference their own data.
Useful for objects and bones to avoid having to create a *Driver Variable* pointing to itself.

Example: ``self.location.x`` applied to the Y rotation property of the same object
will make the object tumble when moving.

Note that dependencies for properties accessed via ``self`` may not be fully tracked.

.. _drivers-simple-expressions:

Blender can evaluate a useful subset of Python driver expressions directly,
which significantly improves performance, especially on multi-core systems.
To take advantage of this, the driver expression must only use the following features:

Variable Names
Use only ASCII characters.
Literals
Floating-point and decimal integer.
Globals
``frame``
Constants
``pi``, ``True``, ``False``
Operators
``+``, ``-``, ``*``, ``/``,
``==``, ``!=``, ``<``, ``<=``, ``>``, ``>=``,
``and``, ``or``, ``not``, conditional operator/ ternary if
Standard Functions
``min``, ``max``, ``radians``, ``degrees``,
``abs``, ``fabs``, ``floor``, ``ceil``, ``trunc``, ``round``, ``int``,
``sin``, ``cos``, ``tan``, ``asin``, ``acos``, ``atan``, ``atan2``,
``exp``, ``log``, ``sqrt``, ``pow``, ``fmod``
Blender Provided Functions
``lerp``, ``clamp``, ``smoothstep``

Simple expressions are evaluated even when Python script execution is disabled.

When an expression outside of this subset is used, Blender displays a "Slow Python expression"
warning. However, as long as the majority of drivers use simple expressions, using a complex
expression in select few is OK.

seealso: 
- :ref:`Extending Blender with Python <scripting-index>`.

- `Python <https://www.python.org>`__ and its `documentation <https://docs.python.org/3/>`__.
- `functions.wolfram.com <https://functions.wolfram.com/>`__.
