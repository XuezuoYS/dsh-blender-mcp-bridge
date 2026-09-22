<!-- source: manual/video_editing/edit/montage/modifiers/creative/unsharp_mask.rst -->

*********************

*****************

figure: /images/node-types_CompositorNodeUnsharpMask.webp
.. --- modifier-intro-start ---

*Unsharp Mask* enhances the apparent sharpness of an image by increasing edge contrast.
Despite its name, it does not blur the image; instead, it sharpens details by subtracting a
blurred (unsharp) version of the image from the original and emphasizing the resulting edges.

This technique is commonly used in photography, printing, and digital compositing
to improve clarity and definition.

.. --- modifier-intro-end ---

Image
Standard color input image.

.. --- modifier-options-start ---

Radius
Controls how much surrounding area is sampled when detecting edges.
Larger values affect broader regions and can enhance larger features,
while smaller values focus on fine detail.

Factor
Controls the intensity of the sharpening effect.
Higher values produce stronger edge contrast but can lead to halos or artifacts if overused.

Threshold
Defines how different a pixel must be from its surrounding area before sharpening is applied.
Higher values limit sharpening to more distinct edges, reducing noise enhancement.

.. --- modifier-options-end ---

Result
The sharpened image with enhanced edge contrast.

:start-after: .. --- modifier-intro-start ---
:end-before: .. --- modifier-intro-end ---

[unparsed directive: include] /compositing/types/creative/unsharp_mask.rst（上游仓库里的目标文件不存在）

:start-after: .. --- modifier-options-start ---
:end-before: .. --- modifier-options-end ---

[unparsed directive: include] ../_common/masking.rst.frag（上游仓库里的目标文件不存在）
