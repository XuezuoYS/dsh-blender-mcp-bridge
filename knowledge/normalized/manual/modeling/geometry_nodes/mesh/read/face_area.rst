<!-- source: manual/modeling/geometry_nodes/mesh/read/face_area.rst -->

.. _bpy.types.GeometryNodeInputMeshFaceArea:

**************

figure: /images/node-types_GeometryNodeInputMeshFaceArea.webp
The *Face Area* node outputs the surface area of a mesh's faces.
The units are in Blender units no matter the unit system,
equivalent to meters-squared at the default unit scale.

note: 
For :term:`quads <Quad>` and :term:`N-gons <N-gon>`, when the face's vertices are not planar,
the output is not necessarily the same as the sum of every one of the face's triangles visible
in the viewport. In this case it should only be used an approximation. In some cases,
the :doc:`/modeling/geometry_nodes/mesh/operations/triangulate` can be used to get an exact value.

This node has no inputs.

Area
The surface area of each of the mesh's faces.

figure: /images/modeling_geometry-nodes_input_face-area_surface-area.png
Combined with the :doc:`/modeling/geometry_nodes/attribute/attribute_statistic`,
this node can be used to calculate the total surface area of a mesh.
