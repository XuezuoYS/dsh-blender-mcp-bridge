<!-- source: manual/compositing/types/color/convert_colorspace.rst -->

.. _bpy.types.CompositorNodeConvertColorSpace:

***********************

figure: /images/node-types_CompositorNodeConvertColorSpace.webp
The *Convert Colorspace* node converts images between :term:`color spaces <Color Space>`.

note: 
Images are already automatically converted into linear color space unless specified in the image's
:ref:`Color Space <bpy.types.ColorManagedInputColorspaceSettings.name>` option.

Image
Standard color input.

From, To
The color space of the input image and the color space to convert it to.

The list of color spaces depends on the active :ref:`OCIO config <ocio-config>`.
The default supported color spaces are described in detail here:
:ref:`Default OpenColorIO Configuration <ocio-config-default-color-spaces>`

Image
Standard color output.
