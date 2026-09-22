<!-- source: manual/compositing/types/utilities/switch_stereo_view.rst -->

.. _bpy.types.CompositorNodeSwitchView:

****************

figure: /images/node-types_CompositorNodeSwitchView.webp
The *Switch View* node combines the *views* (left and right) into a single stereo 3D output.
This can be useful if for example, you need to treat the view as separate images by combining each of the views.

[unparsed directive: container] lead

.. clear

seealso: 
:doc:`The multi-view workflow </render/output/properties/stereoscopy/index>`.

Left
Left-eye image input.
Right
Right-eye image input.

Image
Stereo 3D image output.

figure: /images/render_output_properties_stereoscopy_usage_compositor.png
The views to render are defined in the current scene views,
in a similar way as you define the composite output resolution in the current scene render panel,
regardless of the Image nodes resolutions or Render Layers from different scenes.
