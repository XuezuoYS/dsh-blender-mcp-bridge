<!-- source: manual/modeling/geometry_nodes/geometry/material/material_selection.rst -->

.. _bpy.types.GeometryNodeMaterialSelection:

***********************

figure: /images/modeling_geometry-nodes_material_material-selection_node.png
The *Material Selection* node provides a selection for meshes that use this material.
Since the ``material_index`` is stored on each face, the output will be implicitly interpolated to
a different domain when necessary. For example, every vertex connected to
a selected face will be selected.

Material
Standard material input.

Selection
Selection of faces that use the input material.
