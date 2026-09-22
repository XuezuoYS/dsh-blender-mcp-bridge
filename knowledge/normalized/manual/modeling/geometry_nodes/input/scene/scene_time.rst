<!-- source: manual/modeling/geometry_nodes/input/scene/scene_time.rst -->

.. _bpy.types.GeometryNodeInputSceneTime:
.. --- copy below this line ---

***************

figure: /images/node-types_GeometryNodeInputSceneTime.webp
The *Scene Time* node outputs the current time in the scene's animation in units of seconds or frames.

This node has no inputs.

Seconds
Current scene time in seconds.

Frames
Current scene frame.
As an input in geometry nodes, this output may also output non-round numbers,
in order to support higher quality :doc:`motion blur </render/eevee/render_settings/motion_blur>`.
