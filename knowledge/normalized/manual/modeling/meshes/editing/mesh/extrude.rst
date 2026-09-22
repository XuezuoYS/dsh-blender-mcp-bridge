<!-- source: manual/modeling/meshes/editing/mesh/extrude.rst -->

*******

:Mode:      Edit Mode
:Menu:      :menuselection:`Mesh --> Extrude`
:Shortcut:  :kbd:`Alt-E`
The available operators in this menu depend on the current selection.
Many of them are also available in the :doc:`Vertex </modeling/meshes/editing/vertex/index>`,
:doc:`Edge </modeling/meshes/editing/edge/index>`, and :doc:`Face </modeling/meshes/editing/face/index>` menus.

Available when at least one face is selected.

See :doc:`/modeling/meshes/editing/face/extrude_faces`.

Available when at least one face is selected.

See :doc:`/modeling/meshes/editing/face/extrude_faces_normal`.

Available when at least one face is selected.

See :doc:`/modeling/meshes/editing/face/extrude_individual_faces`.

Available when at least one face is selected.

See :doc:`/modeling/meshes/tools/extrude_manifold`.

Available when at least one edge is selected.

See :doc:`/modeling/meshes/editing/edge/extrude_edges`.

Available when at least one vertex is selected.

See :doc:`/modeling/meshes/editing/vertex/extrude_vertices`.

.. _bpy.ops.mesh.extrude_repeat:

:Mode:      Edit Mode
:Menu:      :menuselection:`Mesh --> Extrude --> Extrude Repeat`
Repeatedly extrudes the selection along the current viewing direction, away from the
current viewpoint. Works best when using a :doc:`top or side view </editors/3dview/navigate/viewpoint>`
or a custom viewing direction with :doc:`orthographic projection </editors/3dview/navigate/projections>`.

Steps
Number of extrusions.
Offset X, Y, Z
Distance between each extrusion.
Scale Offset
Multiplication factor for the *Offset*.

See :doc:`/modeling/meshes/tools/spin`.
