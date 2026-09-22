<!-- source: manual/compositing/types/mask/id_mask.rst -->

.. _bpy.types.CompositorNodeIDMask:

************

figure: /images/node-types_CompositorNodeIDMask.webp
The *ID Mask Node* creates a mask for a particular object or material in the render.
It relies on the *Object Index* or *Material Index* :doc:`render pass </render/layers/passes>`,
which is only available when rendering with Cycles.

seealso: 
This node is superseded by the :doc:`/compositing/types/mask/cryptomatte`.
Cryptomatte is more versatile and is supported by both Cycles and EEVEE.

ID Value
Input for the *Object Index* or *Material Index* render pass.
Once a pass is enabled, it can be accessed through the *IndexOB* or *IndexMA* slot of the
:doc:`/compositing/types/input/scene/render_layers`.
Index
The index for which to create a mask. This index can be configured for objects at
:menuselection:`Properties --> Object --> Relations --> Pass Index`,
and for materials at :menuselection:`Properties --> Material --> Settings --> Pass Index`.

figure: /images/compositing_types_converter_id-mask_relations-panel.png
:term:`Anti-Aliasing`
Whether to smooth the mask edges.

Alpha
A grayscale image that's white where the object exists and black where it does not.

In the example below, the left and right cubes are assigned a *Pass Index* of 1 and 2 respectively.
We extract a mask for the left cube, then use it to turn that cube red with a
:doc:`/compositing/types/color/mix_color`. The masks for the other Pass Indexes are also shown.

figure: /images/compositing_types_converter_id-mask_example.png

- :doc:`Volume Objects </modeling/volumes/introduction>` are not supported.
