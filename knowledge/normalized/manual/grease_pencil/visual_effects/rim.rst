<!-- source: manual/grease_pencil/visual_effects/rim.rst -->

.. _bpy.types.ShaderFxRim:

*****************

The *Rim* Visual Effect shows a simulated rim light on the object contour.

For simulating the rim light, a masked color silhouette of the object is
displaced in horizontal and/or vertical direction.

Many blending modes can be applied to the resulting mask.

figure: /images/grease-pencil_visual-effects_rim_panel.png
Rim Color
Defines the rim light color.

Mask Color
Defines a color to keep unaltered.

Blend Mode
The mask blending operation to perform. See :term:`Color Blend Modes`.

Offset X, Y
Control the color mask displacement in pixels on the X and Y axis.

Blur X, Y
Control the blur scale in pixels on the X and Y axis.

Samples
Number of blur samples (0 disabled the blur effect).

[unparsed directive: list-table] Rim Effect samples (Mode: Add).

* - .. figure:: /images/grease-pencil_visual-effects_rim_original.png
:width: 200px

Original image.

- .. figure:: /images/grease-pencil_visual-effects_rim_no-blur.png
:width: 200px

No blur.

- .. figure:: /images/grease-pencil_visual-effects_rim_blur.png
:width: 200px

Blur.

- .. figure:: /images/grease-pencil_visual-effects_rim_mask.png
:width: 200px

Mask color: Black.
