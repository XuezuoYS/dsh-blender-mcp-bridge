<!-- source: manual/compositing/types/filter/inpaint.rst -->

.. _bpy.types.CompositorNodeInpaint:

************

figure: /images/node-types_CompositorNodeInpaint.webp
The *Inpaint node* is used to extend borders of an image into transparent or masked regions.
This can be useful to solve problems like "wire removal" and holes created during chroma keying.

Image
Standard color input.
Size
The number of times to extend the image.

Image
Standard color output.

The left image shows the "wire" in place and after chroma keying has been applied. You will see you are left
with a blank space -- it's shown as a black line here but it will be alpha in your Blender output.

figure: /images/compositing_types_filter_inpaint_example.jpg
Inpainting fills in a couple of pixels using the surrounding image and voilà... your wire is removed.

note: 
The wider the "hole" is, the more noticeable this effect is!
If you use more than a few pixels of infill,
the effect is almost as irritating as the wire and your viewers won't be impressed.
Inpainting can also cover up a multitude of other minor sins
such as control points for motion capture: use it sparingly and it will amaze.
