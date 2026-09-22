<!-- source: manual/compositing/types/input/scene/render_layers.rst -->

.. _bpy.types.CompositorNodeRLayers:

******************

figure: /images/node-types_CompositorNodeRLayers.webp
Renders a :doc:`View Layer </render/layers/introduction>` and reads its
:doc:`Passes </render/layers/passes>` into the compositing node graph.

This node has no input sockets.

Scene
The scene for which to render a view layer.

View Layer
The view layer to render. The button next to the dropdown re-renders it immediately.

hint: 
To use the compositing output from another scene rather than its "raw" render output,
first render that scene into a series of multi-layered images (using e.g. the OpenEXR format),
then load those images into the Compositor of the current scene using the
:doc:`/compositing/types/input/image`.

Image
Rendered image.
Alpha
Alpha channel.
Render pass sockets
Additional outputs for any enabled render passes.

note: 
The :ref:`viewport compositor <bpy.types.View3DShading.use_compositor>`
only supports render passes when using EEVEE.
For other engines, the passes will be empty.
