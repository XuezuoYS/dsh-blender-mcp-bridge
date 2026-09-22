<!-- source: manual/modeling/meshes/editing/face/face_data.rst -->

*********

.. _bpy.ops.mesh.colors_rotate:

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Rotate Colors`
Rotates the colors for the active
:ref:`Color Attribute <modeling-meshes-properties-object_data-color-attributes>`
inside each selected face either clockwise or counterclockwise.

.. _bpy.ops.mesh.colors_reverse:

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Reverse Colors`
Mirrors the colors for the active Color Attribute inside each selected face.

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Rotate UVs`
See :ref:`bpy.ops.mesh.uvs_rotate`.

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Reverse UVs`
See :ref:`bpy.ops.mesh.uvs_reverse`.

.. _bpy.ops.mesh.flip_quad_tessellation:

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Flip Quad Tessellation`
Internally, every :term:`quad` is :term:`tessellated <Tessellation>` into two triangles.
This operator swaps the tessellation direction of the selected quads.

[unparsed directive: list-table]

* - .. figure:: /images/modeling_meshes_editing_face_flip-tessellation_before.png
- .. figure:: /images/modeling_meshes_editing_face_flip-tessellation_after.png

seealso: 
:doc:`/modeling/meshes/editing/edge/rotate_edge`
.. _bpy.ops.mesh.mark_freestyle_face:

:Mode:      Edit Mode
:Menu:      :menuselection:`Face --> Face Data --> Mark/Clear Freestyle Face`
Marks or unmarks the selected faces as requiring special Freestyle behavior.
See :ref:`freestyle-face-marks`.
