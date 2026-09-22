<!-- source: manual/modeling/meshes/selecting/loops.rst -->

.. _bpy.ops.mesh.loop_select:
.. _bpy.ops.mesh.loop_multi_select:

************

.. _bpy.ops.mesh.select_edge_loop_multi:

:Mode:      Edit Mode (Vertex or Edge select mode)
:Menu:      :menuselection:`Select --> Select Loops --> Edge Loops`
:Shortcut:  :kbd:`Alt-LMB` or :kbd:`Shift-Alt-LMB`
Selecting an edge with :kbd:`Alt-LMB` will also select the edges that are connected to it in a
(topologically) straight line. Use :kbd:`Shift-Alt-LMB` to add to the previous selection
instead of replacing it.

The resulting chain of edges is called an :ref:`edge loop <modeling_meshes_structure_topology>`
in Blender terminology because it typically forms a closed loop around the mesh.
However, as shown below, this doesn't have to be the case.

figure: /images/modeling_meshes_selecting_loops_edge-loops.png
hint: 
Selecting edge loops by clicking edges is also possible in the Vertex selection mode.
note: 
When :ref:`bpy.types.PreferencesInput.use_mouse_emulate_3_button` is enabled,
the :kbd:`Alt-LMB` shortcut won't work because it serves as a replacement for :kbd:`MMB`.
To select edge loops in this case, double-click with :kbd:`LMB` instead.

Running the edge loop selection on a boundary edge twice will select the whole boundary.

figure: /images/modeling_meshes_selecting_loops_edge-boundary-loops.png
See also :ref:`bpy.ops.mesh.region_to_loop`.

.. _modeling-meshes-selecting-face-loops:

:Mode:      Edit Mode (Face select mode)
:Shortcut:  :kbd:`Alt-LMB` or :kbd:`Shift-Alt-LMB`
In *Face* selection mode, clicking an edge with :kbd:`Alt-LMB` will select the row
of faces that's perpendicular to that edge. Use :kbd:`Shift-Alt-LMB` to add to the
previous selection instead of replacing it.

The resulting row of faces is called a :ref:`face loop <modeling_meshes_structure_topology>`
in Blender terminology because it typically forms a closed loop around the mesh.
However, as shown below, this doesn't have to be the case.

figure: /images/modeling_meshes_selecting_loops_face-loops.png
In Vertex selection mode, the same can be achieved using
:ref:`bpy.ops.mesh.select_edge_ring_multi`.

note: 
When :ref:`bpy.types.PreferencesInput.use_mouse_emulate_3_button` is enabled,
the :kbd:`Alt-LMB` shortcut won't work because it serves as a replacement for :kbd:`MMB`.
To select face loops in this case, double-click the edge with :kbd:`LMB` instead.
.. _bpy.ops.mesh.select_edge_ring_multi:

:Mode:      Edit Mode (Edge select mode)
:Menu:      :menuselection:`Select --> Select Loops --> Edge Rings`
:Shortcut:  :kbd:`Ctrl-Alt-LMB` or :kbd:`Shift-Ctrl-Alt-LMB`
Selecting an edge with :kbd:`Ctrl-Alt-LMB` will also select the parallel edges that lie
in the face row perpendicular to the edge. Use :kbd:`Shift-Ctrl-Alt-LMB` to add to the
previous selection instead of replacing it.

The resulting set of edges is called an :ref:`edge ring <modeling_meshes_structure_topology>`
in Blender terminology because it typically forms a closed ring around the mesh.
However, as shown below, this doesn't have to be the case.

figure: /images/modeling_meshes_selecting_loops_edge-ring.png
This shortcut also works in Vertex selection mode, but results in a face loop selection instead:

figure: /images/modeling_meshes_selecting_loops_edge-ring_vertex-mode.png
hint: 
To convert an edge ring selection to a face loop, either switch to Vertex mode or
switch to Face mode while holding :kbd:`Ctrl`
(see :ref:`modeling_meshes_selecting_switch-mode_expand-contract`).
.. _bpy.ops.mesh.select_boundary_loop_multi:

:Mode:      Edit Mode (Edge Select Mode)
:Menu:      :menuselection:`Select --> Select Loops --> Boundary Loops`
Selects the entire boundary loop for each selected boundary edge.

A boundary edge is an edge connected to only one face.
This operator expands the selection to include all connected boundary edges,
forming one or more continuous loops.

figure: /images/modeling_meshes_selecting_loops_boundary_loops.png
note: 
At least one boundary edge must be selected to start a boundary loop selection.
#### Options
Extend
Adds the detected boundary loops to the existing selection
instead of replacing it.

Delimit
Restricts how far the boundary loop selection can propagate.

:Seam: Stops the selection at edges marked as seams.
:Sharp: Stops the selection at edges marked as sharp.
:N-gons: Stops the selection when encountering faces with more than four sides.
:Inner Corners: Stops at vertices connected to more than three edges.
:Outer Corners:
Stops at vertices connected to exactly two edges
when those edges share a face that is not an n-gon.

.. _bpy.ops.mesh.loop_to_region:

:Mode:      Edit Mode (Edge select mode)
:Menu:      :menuselection:`Select --> Select Loops --> Select Loop Inner-Region`
Selects all faces that are inside the selected, closed loop of edges.
While it's possible to use this operator in the *Vertex* and *Face* selection modes,
results may be unexpected.

Note that if the selected edges do not form a closed loop,
all connected faces will be selected.

Select Bigger
Select the faces outside the edge loop instead of those inside it.

figure: /images/modeling_meshes_selecting_loops_inner-region1.png
figure: /images/modeling_meshes_selecting_loops_inner-region2.png
figure: /images/modeling_meshes_selecting_loops_inner-region3.png
.. _bpy.ops.mesh.region_to_loop:

:Mode:      Edit Mode
:Menu:      :menuselection:`Select --> Select Loops --> Boundary of Selection`
Replaces the current face selection by an edge selection going around the border of
each face "island." This is essentially the opposite of :ref:`bpy.ops.mesh.loop_to_region`.

This operator can be run in any selection mode. When run in Face mode,
it will automatically switch to Edge mode.

figure: /images/modeling_meshes_selecting_loops_boundary-loop.png
