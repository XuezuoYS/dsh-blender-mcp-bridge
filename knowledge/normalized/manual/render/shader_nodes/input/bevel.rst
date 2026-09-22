<!-- source: manual/render/shader_nodes/input/bevel.rst -->

.. _bpy.types.ShaderNodeBevel:

**********

:guilabel:`Cycles Only`

figure: /images/node-types_ShaderNodeBevel.webp
The Bevel shader node can be used for rendering rounded corners.
Like bump mapping, this does not modify the actual geometry, only the shading is affected.
Slight rounding on edges helps to capture specular highlights that you would also see in the real world.

Note that this is a very expensive shader, and may slow down renders
by 20% even if there is a lot of other complexity in the scene.
For that reason, we suggest to mainly use this for baking or
still frame renders where render time is not as much of an issue.
The :doc:`/modeling/modifiers/generate/bevel` is a faster option when it works,
but sometimes fails on complex or messy geometry.

note: 
**The Bevel node will not produce a valid result when:**

- The object is either a :ref:`Caustic caster <bpy.types.CyclesObjectSettings.is_caustics_caster>`
or :ref:`Caustic receiver <bpy.types.CyclesObjectSettings.is_caustics_receiver>` while the scene
contains an active :ref:`Caustic caster <bpy.types.CyclesObjectSettings.is_caustics_caster>`,
:ref:`Caustic receiver <bpy.types.CyclesObjectSettings.is_caustics_receiver>`, and
:ref:`Shadow Caustic Light <bpy.types.CyclesLightSettings.is_caustics_light>`.
- :doc:`/render/cycles/osl/index` is active while using the OptiX rendering backend.

Radius
Width of the bevel effect on edges.
Normal
Normal to apply bevel on top of, to be combined with a :doc:`/render/shader_nodes/displacement/bump`
for example. When not connected, uses the surface normal.

Samples
Number of samples to take for each shader evaluation.
More samples give more accurate results, but are also slower to render.
The default value of 4 works well for most cases, with any noise resolved by using more AA samples.

Normal
Standard normal output.

figure: /images/render_shader-nodes_input_bevel_example_setup.png
figure: /images/render_shader-nodes_input_bevel_example.jpg
