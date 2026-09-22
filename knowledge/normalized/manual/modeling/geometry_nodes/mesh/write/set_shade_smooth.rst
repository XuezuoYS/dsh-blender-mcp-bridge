<!-- source: manual/modeling/geometry_nodes/mesh/write/set_shade_smooth.rst -->

.. _bpy.types.GeometryNodeSetShadeSmooth:

*********************

figure: /images/node-types_GeometryNodeSetShadeSmooth.webp
The *Set Shade Smooth* node controls whether the mesh's faces look smooth in the viewport and renders.
The smooth status of both edges and faces can be controlled, corresponding to the ``sharp_edge`` and
``sharp_face`` attributes.
The input node for this data is the :doc:`/modeling/geometry_nodes/mesh/read/is_face_smooth`.

Mesh
Standard geometry input.

Shade Smooth
When true, the selected faces will be marked to render smooth shaded.
Otherwise the faces will be rendered flat shaded.

Selection
Boolean input for selecting which faces will have the Shade Smooth value applied.

Domain
Whether to write smoothness of mesh faces or edges.

Mesh
Standard geometry output.
