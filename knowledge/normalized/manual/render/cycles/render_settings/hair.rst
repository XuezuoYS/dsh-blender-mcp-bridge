<!-- source: manual/render/cycles/render_settings/hair.rst -->

******

:Panel:     :menuselection:`Render --> Curves`
These are global settings that apply to all instances of particle hair systems.
The resolution of the strands is controlled by the step values in particle settings.
Each hair system uses the material identified in the particle settings.

.. _bpy.types.CyclesCurveRenderSettings.shape:

Shape
Controls how curves (such as hair strands) are represented during rendering.
Different methods balance speed and accuracy,
depending on whether the curves are viewed up close or in the distance.

:Rounded Ribbons:
Render curves as flat ribbon with rounded normals, for fast rendering.
Curves are subdivided with a fixed number of specified subdivisions.

.. _bpy.types.CyclesCurveRenderSettings.subdivisions:

Curve Subdivisions
Number of subdivisions used in cardinal curve intersection (power of 2).

:3D Curves:
Render curves as circular 3D geometry, for accurate results when viewing curves close up.
Curves are automatically subdivided until the curve is smooth.

:Linear 3D Curves:
Render curves as 3D circular geometry with linear interpolation between control points.
This is faster than full 3D curves but less smooth, and may show visible corners at low resolutions.

This is an optimization to take advantage of hardware accelerated curve intersection on GPUs.
Results will not look exactly the same on different CPU and GPU devices, so this is not
suitable for multi device rendering or render farms with mixed hardware.

These settings control the curve rendering settings used when the 3D viewport is set to
:ref:`Material Preview <3dview-material-preview>`

******

:Panel:     :menuselection:`Render --> Curves`
.. _bpy.types.RenderSettings.hair_type:
.. _bpy.types.RenderSettings.hair_subdiv:

.. Editor's Note: This part of this page gets copied into:
.. - :doc:`</render/cycles/render_settings/hair>`

.. --- copy below this line ---

Shape
:Strand:
Render curves as a thin strand roughly a pixel wide.
Curve diameter parameters are ignored with this setting.

:Strip:
Render curves as a flat ribbon with rounded normals.

Additional Subdivisions
Additional subdivisions to be applied on top of the curve resolution set in the
hair system settings. Increasing this value will smooth out the curves of the strands.

:start-after: .. --- copy below this line ---
