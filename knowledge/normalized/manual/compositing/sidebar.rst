<!-- source: manual/compositing/sidebar.rst -->

*******

:Panel:     :menuselection:`Sidebar region --> View`
.. _bpy.types.SpaceNodeEditor.show_backdrop:

figure: /images/compositing_sidebar_view.png
The backdrop displays the output of a *Viewer* node behind the node editor in the Compositor.
For example, pressing :kbd:`Shift-Ctrl-LMB` on an Image node displays a preview of the image,
while pressing it on a Mix node shows the result of the mixing operation.

The backdrop can be toggled by enabling the checkbox in the *Backdrop* panel header
or by clicking the *Backdrop* button in the Compositor header.

The backdrop is useful for visually evaluating node results while editing,
allowing direct comparison between the node graph and its output.

.. _bpy.types.SpaceNodeEditor.backdrop_channels:

Channels
Specifies which color channels of the backdrop image are displayed.

.. _bpy.types.SpaceNodeEditor.backdrop_zoom:

Zoom :kbd:`Alt-V`, :kbd:`V`
Adjusts the display size of the backdrop image.

.. _bpy.types.SpaceNodeEditor.backdrop_offset:

Offset X, Y
Offsets the backdrop image in screen space.

.. _bpy.ops.node.backimage_move:

Move :kbd:`Alt-MMB`
Interactively moves the backdrop image.

.. _bpy.ops.node.backimage_fit:

Fit
Scales the backdrop image to fit the Compositor view.

:Panel:     :menuselection:`Sidebar region --> Options`

figure: /images/compositing_sidebar_options.png
This panel helps you tweak the performance of the Compositor.

***********

:Panel:     :menuselection:`Properties --> Render --> Performance`
.. _bpy.types.RenderSettings.use_high_quality_normals:

High Quality Normals
Uses higher precision normals and tangents which can improve
visual quality for dense meshes with high frequency textures at the cost of memory.

.. _bpy.types.RenderSettings.anisotropic_filter:

Anisotropic Filtering
Quality of anisotropic filtering used when sampling textures at oblique viewing angles.

Higher values improve the sharpness of textures viewed at a grazing angle,
such as floors, roads, and other surfaces that extend into the distance.
Increasing the setting may have a small impact on performance.

:Off: Turn off anisotropic filtering.
:2×: Use 2 samples for anisotropic filtering.
:4×: Use 4 samples for anisotropic filtering.
:8×: Use 8 samples for anisotropic filtering.
:16×: Use 16 samples for anisotropic filtering.

.. _bpy.types.SceneEEVEE.shadow_pool_size:

Shadow Pool
A bigger pool size allows for more shadows in the scene
but might not fit into GPU memory and decreases performance.
Increasing the size might fix the *Shadow buffer full* error.

seealso: 
:ref:`Shadow documentation <bpy.types.Light.shadow>`
.. _bpy.types.SceneEEVEE.gi_irradiance_pool_size:

Light Probes Volume Pool
A bigger pool size allows for more irradiance grids in the scene
but might not fit into GPU memory and decreases performance.

.. _bpy.types.RenderSettings.preview_pixel_size:

Pixel Size
Option to control the resolution for viewport rendering.
Allows you to speed up viewport rendering, which is especially useful for displays with high DPI.

.. Editor's Note: This section gets copied into:
.. - :doc:`</render/cycles/render_settings/performance>`
.. - :doc:`</compositing/sidebar>`
.. These bpy types cannot be added below the copy line as it causes build warnings.

.. _bpy.types.RenderSettings.compositor_device:
.. _bpy.types.RenderSettings.compositor_precision:
.. _bpy.types.RenderSettings.compositor_denoise_device:
.. _bpy.types.RenderSettings.compositor_denoise_preview_quality:
.. _bpy.types.RenderSettings.compositor_denoise_final_quality:

.. --- copy below this line ---

Device
The device used for compositing.

:CPU: Use the CPU for compositing.
:GPU: Use the GPU for compositing.

Precision :guilabel:`GPU`
The precision of compositor intermediate result.

:Auto: Use full precision for final renders, half precision otherwise.
:Full: Use full precision for final renders and viewport.

.. --- end copy above this line - compositor sidebar ---

Denoising Device
The device to use to process :doc:`Denoise nodes </compositing/types/filter/denoise>` in the compositor.

:Auto: Use the same device used by the compositor to process the denoise node.
:CPU: Use the CPU to process the denoise node.
:GPU: Use the GPU to process the denoise node if available, otherwise fallback to CPU.

Preview Quality
The quality used by :doc:`Denoise nodes </compositing/types/filter/denoise>` during viewport
and interactive compositing of a render if their quality is set to *Follow Scene*.

:High:
Produces the highest quality output at the cost of long processing times.
:Balanced:
Balanced between performance and quality, typically processing in half the time as *High*,
while retaining most of the quality.
:Fast:
Produces an output quickly at a noticeable cost of quality.

Final Quality
The quality used by :doc:`Denoise nodes </compositing/types/filter/denoise>` during the final
render if their quality is set to *Follow Scene*.

:High:
Produces the highest quality output at the cost of long processing times.
:Balanced:
Balanced between performance and quality, typically processing in half the time as *High*,
while retaining most of the quality.
:Fast:
Produces an output quickly at a noticeable cost of quality.

.. --- end copy above this line - compositor performance ---

:start-after: .. --- copy below this line ---
:end-before: .. --- end copy above this line - compositor sidebar ---

.. Currently removed from UI see https://projects.blender.org/blender/blender/commit/a079875ffe
.. .. _bpy.types.CompositorNodeTree.use_viewer_border:

.. Viewer Region
..    This allows to set an area of interest for the backdrop.
..    Press :kbd:`Ctrl-B` and select a rectangular area in the preview
..    which will become the next preview in the backdrop.
..    :kbd:`Ctrl-Alt-B` discards the region back to a full preview.
..    This is only a preview option, final compositing during a render ignores this region.
