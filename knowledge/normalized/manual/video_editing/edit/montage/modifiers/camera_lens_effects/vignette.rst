<!-- source: manual/video_editing/edit/montage/modifiers/camera_lens_effects/vignette.rst -->

*****************

*************

figure: /images/node-types_CompositorNodeVignette.webp
.. --- modifier-intro-start ---

*Vignette* darkens or fades out the edges of an image to draw attention toward the center.
This effect is often used for artistic or cinematic purposes to create focus, mood, or a sense of depth.

.. --- modifier-intro-end ---

Image
Standard color input image.

.. --- modifier-options-start ---

Factor
Controls the overall strength of the vignette effect.
A value of 0 disables the effect, while higher values increase the darkness or intensity of the vignette.

Feather
Determines the softness of the vignette transition from the center to the edges.
Higher values result in a smoother, more gradual fade.

Corner Roundness
Adjusts the shape of the vignette corners.
A value of 0 produces square corners, while 1 makes the vignette fully circular.

Scale
Controls the size of the vignette area.
Smaller values make the vignette tighter and more focused near the center.

Offset
Shifts the vignette center position along the X and Y axes.
Useful for emphasizing a specific area of the image instead of the center.

Angle
Rotates the vignette mask around the image center.

.. --- modifier-options-end ---

Image
The input image with the vignette effect applied.

Mask
The generated vignette mask as a grayscale output.
This can be used for custom compositing or to apply the vignette selectively through mix nodes.

:start-after: .. --- modifier-intro-start ---
:end-before: .. --- modifier-intro-end ---

[unparsed directive: include] /compositing/types/camera_lens_effects/vignette.rst（上游仓库里的目标文件不存在）

:start-after: .. --- modifier-options-start ---
:end-before: .. --- modifier-options-end ---

[unparsed directive: include] ../_common/masking.rst.frag（上游仓库里的目标文件不存在）
