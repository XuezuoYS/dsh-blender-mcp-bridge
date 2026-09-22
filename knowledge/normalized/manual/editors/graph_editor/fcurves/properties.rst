<!-- source: manual/editors/graph_editor/fcurves/properties.rst -->

******************

:Panel:     :menuselection:`Sidebar region --> F-Curve --> Active F-Curve`
figure: /images/editors_graph-editor_fcurves_sidebar_curve_active-fcurve-panel.png
This panel displays properties for the active F-Curve.

Channel Name
The name of the property that's animated by the curve.

.. _bpy.types.FCurve.data_path:

Data Path
The programmatic path to the property.

.. _bpy.types.FCurve.array_index:

RNA Array Index
The index into the property, for multi-value properties. As an example, the Location
property has three values (X, Y and Z), which means it can have three different curves
with indices 0, 1 and 2.

.. _bpy.types.FCurve.color_mode:

Display Color
How to determine the color of the F-Curve in the Graph editor.

:Auto Rainbow:
Assigns a unique color to each curve that uses this setting.
:Auto XYZ to RGB:
Detects curves that animate an X/Y/Z coordinate and colors them red/green/blue accordingly.
:User Defined:
Lets you choose the color yourself.

.. _bpy.types.FCurve.auto_smoothing:

Handle Smoothing
How to compute the :ref:`Bézier handles <editors-graph-fcurves-settings-handles>`
when using the *Automatic* or *Auto Clamped* handle type.

:None:
Only directly adjacent key values are considered when computing the handles.

This older method is very simple and predictable, but it can only produce
truly smooth curves in the most trivial cases. Notice that the red curve
in the image above has a few kinks in the middle.
:Continuous Acceleration:
A system of equations is solved in order to avoid or minimize jumps in acceleration
at every keyframe.

It produces much smoother curves out of the box, but necessarily means that
any changes in the key values may affect interpolation over a significant stretch
of the curve; although the amount of change decays exponentially with distance.
This change propagation is stopped by any key with *Free*, *Aligned*, or *Vector*
handles, as well as by extremes with *Auto Clamped* handles.

The mode also tends to overshoot and oscillate more with fully *Automatic* handles
in some cases (see the image above). So it is recommended to use *Auto Clamped* by default,
and only switch to *Automatic* handles in places where this is desired behavior.
That effect can also be reduced by adding in-between keys.

tip: 
Considering the upsides and downsides of each mode, *Continuous Acceleration* should be
   better suited for limited animation, which uses a small number of interpolated keys with
   minimal manual polish. In case of highly polished high key rate animation, the benefits of
   smoothing may not outweigh the workflow disruption from more extensive change propagation.
figure: /images/editors_graph-editor_fcurves_sidebar_curve_auto-smoothing.png

:Panel:     :menuselection:`Sidebar region --> F-Curve --> Active Keyframe`
figure: /images/editors_graph-editor_fcurves_sidebar_curve_active-keyframe-panel.png
.. _bpy.types.Keyframe.interpolation:
.. _editors-graph-fcurves-settings-interpolation:

Interpolation
The :term:`interpolation` to use between the active keyframe and the next.

#### Interpolation
figure: /images/editors_graph-editor_fcurves_introduction_constant.png
figure: /images/editors_graph-editor_fcurves_introduction_linear.png
figure: /images/editors_graph-editor_fcurves_editing_clean1.png
note: 
F-Curves for properties that only accept discrete values will always have a stair step pattern,
no matter which option you chose.
#### Easing (by strength)
seealso: 
For more info and a few live demos,
see `easings.net <https://easings.net>`__ and
`Robert Penner's Easing Functions <https://robertpenner.com/easing>`__.
#### Dynamic Effects
.. _editors-graph-fcurves-settings-easing:

Easing
This option only applies to the *Easing* and *Dynamic Effects* categories above.

:Automatic Easing:
Automatically pick the most commonly used type: *Ease In* when using one of the *Easing* interpolations,
and *Ease Out* when using one of the *Dynamic Effects*.
:Ease In:
The value accelerates, moving slowly at the beginning of the curve segment and speeding up towards the end.
:Ease Out:
The value decelerates, moving quickly at the beginning of the curve segment and slowing down towards the end.
:Ease In Out:
The value moves slowly in the beginning, speeds up towards the middle, and slows down again towards the end.

.. _bpy.types.Keyframe.co_ui:

Key Frame
The frame of the active keyframe.
Value
The value of the active keyframe.

.. _bpy.types.Keyframe.handle_left_type:
.. _bpy.types.Keyframe.handle_right_type:
.. _editors-graph-fcurves-settings-handles:

Left/Right Handle Type
When the keyframe's interpolation is set to *Bézier*, the shape of the curve around it is
influenced by its handles. Each handle has its own type which determines if (and how) Blender
positions it automatically, and if not, how much freedom you have in positioning it manually.

You can change the handles' types in multiple ways: using these dropdowns in the Sidebar;
through the menu :menuselection:`Key --> Handle Type`; or by pressing :kbd:`V` and selecting from the popup menu.

If you want to change an automatic handle's position, just drag it;
you don't need to manually change its type first.

:Automatic:
figure: /images/editors_graph-editor_fcurves_introduction_auto.png
figure: /images/editors_graph-editor_fcurves_introduction_autoclamped.png
figure: /images/editors_graph-editor_fcurves_introduction_vector.png
figure: /images/editors_graph-editor_fcurves_introduction_aligned.png
figure: /images/editors_graph-editor_fcurves_introduction_free.png
.. _bpy.types.Keyframe.handle_left:
.. _bpy.types.Keyframe.handle_right:

Frame, Value
The frame and value for the left/right handle of the active keyframe.
