<!-- source: manual/modeling/geometry_nodes/utilities/math/clamp.rst -->

.. _bpy.types.ShaderNodeClamp:
.. Editor's Note: This page gets copied into:
.. - :doc:`</compositing/types/utilities/clamp>`
.. - :doc:`</modeling/geometry_nodes/utilities/clamp>`
.. --- copy below this line ---

**********

figure: /images/node-types_ShaderNodeClamp.webp
The *Clamp* node clamps a value between a minimum and a maximum.

Value
The input value to be clamped.
Min
The minimum value.
Max
The maximum value.

Clamp Type
Method to clamp.

:Min Max:
Constrain values between Min and Max. When Min is greater than Max,
Result always outputs Max, irrespective of the input value.
:Range:
Constrain values between Min and Max. When Min is greater than Max,
constrain between Max and Min instead.

Result
The input value after clamping.

The *Voronoi Texture* node outputs a value whose minimum is zero.
We can use the *Clamp* node to clamp this value such that the minimum is 0.2.

figure: /images/render_shader-nodes_converter_clamp_example.jpg

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
