<!-- source: api/bmesh.types.rst -->

.. |UV_STICKY_SELECT_MODE_REF| replace:: (:class:`bpy.types.ToolSettings.uv_sticky_select_mode` which may be passed in directly).

.. |UV_STICKY_SELECT_MODE_TYPE| replace:: Literal['SHARED_LOCATION', 'DISABLED', 'SHARED_VERTEX']

.. |UV_SELECT_FLUSH_MODE_NEEDED| replace:: This function is selection-mode independent, typically :meth:`bmesh.types.BMesh.uv_select_flush_mode` should be called afterwards.

.. |UV_SELECT_SYNC_TO_MESH_NEEDED| replace:: This function doesn't flush the selection to the mesh, typically :meth:`bmesh.types.BMesh.uv_select_sync_to_mesh` should be called afterwards.

### class `bmesh.types.BMesh`

The BMesh data structure

### method `bmesh.types.BMesh.calc_loop_triangles`

Calculate triangle tessellation from quads/ngons.

:return: The triangulated faces.
:rtype: list[tuple[:class:`bmesh.types.BMLoop`, :class:`bmesh.types.BMLoop`, :class:`bmesh.types.BMLoop`]]

### method `bmesh.types.BMesh.calc_volume`

Calculate mesh volume based on face normals.

:param signed: when signed is true, negative values may be returned.
:type signed: bool
:return: The volume of the mesh.
:rtype: float

### method `bmesh.types.BMesh.clear`

Clear all mesh data.

### method `bmesh.types.BMesh.copy`

:return: A copy of this BMesh.
:rtype: :class:`bmesh.types.BMesh`

### method `bmesh.types.BMesh.free`

Explicitly free the BMesh data from memory, causing exceptions on further access.

### method `bmesh.types.BMesh.from_mesh`

note: 
The BMesh is freed automatically, typically when the script finishes executing.
   However in some cases it's hard to predict when this will be and it's useful to
   explicitly free the data.
Initialize this bmesh from existing mesh data-block.

:param mesh: The mesh data to load.
:type mesh: :class:`bpy.types.Mesh`
:param face_normals: Calculate face normals.
:type face_normals: bool
:param vertex_normals: Calculate vertex normals.
:type vertex_normals: bool
:param use_shape_key: Use the locations from a shape key.
:type use_shape_key: bool
:param shape_key_index: The shape key index to use.
:type shape_key_index: int

### method `bmesh.types.BMesh.from_object`

note: 
Multiple calls can be used to join multiple meshes.

   Custom-data layers are only copied from ``mesh`` on initialization.
   Further calls will copy custom-data to matching layers, layers missing on the target mesh won't be added.
Initialize this bmesh from existing object data-block (only meshes are currently supported).

:param object: The object data to load.
:type object: :class:`bpy.types.Object`
:param depsgraph: The dependency graph for evaluated data.
:type depsgraph: :class:`bpy.types.Depsgraph`
:param cage: Get the mesh as a deformed cage.
:type cage: bool
:param face_normals: Calculate face normals.
:type face_normals: bool
:param vertex_normals: Calculate vertex normals.
:type vertex_normals: bool

### method `bmesh.types.BMesh.normal_update`

Update normals of mesh faces and verts.

### method `bmesh.types.BMesh.select_flush`

note: 
The normal of any vertex where :attr:`is_wire` is True will be a zero vector.
Flush selection from vertices, independent of the current selection mode.

:param select: flush selection or de-selected elements.
:type select: bool

### method `bmesh.types.BMesh.select_flush_mode`

Flush selection based on the current mode :attr:`bmesh.types.BMesh.select_mode`.

:param flush_down: Flush selection down from faces to edges & verts or from edges to verts. This option is ignored when vertex selection mode is enabled.
:type flush_down: bool

### method `bmesh.types.BMesh.to_mesh`

Writes this BMesh data into an existing Mesh data-block.

:param mesh: The mesh data to write into.
:type mesh: :class:`bpy.types.Mesh`

### method `bmesh.types.BMesh.transform`

Transform the mesh (optionally filtering flagged data only).

:param matrix: 4x4 transform matrix.
:type matrix: :class:`mathutils.Matrix`
:param filter: Flag to filter vertices.
:type filter: set[Literal['SELECT', 'HIDE', 'SEAM', 'SMOOTH', 'TAG']] | None

### method `bmesh.types.BMesh.uv_select_flush`

Flush selection from UV vertices to edges & faces independent of the selection mode.

:param select: Flush selection or de-selected elements.
:type select: bool

### method `bmesh.types.BMesh.uv_select_flush_mode`

note: 
- |UV_SELECT_SYNC_TO_MESH_NEEDED|
Flush UV selection based on the current mode :attr:`bmesh.types.BMesh.select_mode`.

:param flush_down: Flush selection down from faces to edges & verts or from edges to verts. This option is ignored when vertex selection mode is enabled.
:type flush_down: bool

### method `bmesh.types.BMesh.uv_select_flush_shared`

Flush selection from UV vertices to contiguous UV's independent of the selection mode.

:param select: Flush selection or de-selected elements.
:type select: bool

### method `bmesh.types.BMesh.uv_select_foreach_set`

note: 
- |UV_SELECT_SYNC_TO_MESH_NEEDED|
Set the UV selection state for loop-vertices, loop-edges & faces.

This is a close equivalent to selecting in the UV editor.

:param select: The selection state to set.
:type select: bool
:param loop_verts: Loop verts to operate on.
:type loop_verts: Iterable[:class:`bmesh.types.BMLoop`]
:param loop_edges: Loop edges to operate on.
:type loop_edges: Iterable[:class:`bmesh.types.BMLoop`]
:param faces: Faces to operate on.
:type faces: Iterable[:class:`bmesh.types.BMFace`]
:param sticky_select_mode: See |UV_STICKY_SELECT_MODE_REF|.
:type sticky_select_mode: |UV_STICKY_SELECT_MODE_TYPE|

### method `bmesh.types.BMesh.uv_select_foreach_set_from_mesh`

note: 
- |UV_SELECT_FLUSH_MODE_NEEDED|
   - |UV_SELECT_SYNC_TO_MESH_NEEDED|
Select or de-select mesh elements, updating the UV selection.

An equivalent to selecting from the 3D viewport for selection operations that support maintaining a synchronized UV selection.

:param select: The selection state to set.
:type select: bool
:param verts: Verts to operate on.
:type verts: Iterable[:class:`bmesh.types.BMVert`]
:param edges: Edges to operate on.
:type edges: Iterable[:class:`bmesh.types.BMEdge`]
:param faces: Faces to operate on.
:type faces: Iterable[:class:`bmesh.types.BMFace`]
:param sticky_select_mode: See |UV_STICKY_SELECT_MODE_REF|.
:type sticky_select_mode: |UV_STICKY_SELECT_MODE_TYPE|

### method `bmesh.types.BMesh.uv_select_sync_from_mesh`

Sync selection from mesh to UVs.

:param sticky_select_mode: Behavior when flushing from the mesh to UV selection |UV_STICKY_SELECT_MODE_REF|. This should only be used when preparing to create a UV selection.
:type sticky_select_mode: |UV_STICKY_SELECT_MODE_TYPE|

### method `bmesh.types.BMesh.uv_select_sync_to_mesh`

note: 
- |UV_SELECT_SYNC_TO_MESH_NEEDED|
Sync selection from UVs to the mesh.

### attribute `bmesh.types.BMesh.edges`

This mesh's edge sequence (read-only).

:type: :class:`bmesh.types.BMEdgeSeq`

### attribute `bmesh.types.BMesh.faces`

This mesh's face sequence (read-only).

:type: :class:`bmesh.types.BMFaceSeq`

### attribute `bmesh.types.BMesh.is_valid`

True when this element is valid (hasn't been freed or removed).

:type: bool

### attribute `bmesh.types.BMesh.is_wrapped`

True when this mesh is owned by blender (typically the editmode BMesh).

:type: bool

### attribute `bmesh.types.BMesh.loops`

This mesh's loops (read-only).

:type: :class:`bmesh.types.BMLoopSeq`

### attribute `bmesh.types.BMesh.select_history`

note: 
Loops must be accessed via faces, this is only exposed for layer access.
Sequence of selected items (the last is displayed as active).

:type: :class:`bmesh.types.BMEditSelSeq`

### attribute `bmesh.types.BMesh.select_mode`

The selection mode, cannot be assigned an empty set.

:type: set[Literal['VERT', 'EDGE', 'FACE']]

### attribute `bmesh.types.BMesh.uv_select_sync_valid`

When true, the UV selection has been synchronized. Setting to False means the UV selection will be ignored. While setting to true is supported it is up to the script author to ensure a correct selection state before doing so.

:type: bool

### attribute `bmesh.types.BMesh.verts`

This mesh's vert sequence (read-only).

:type: :class:`bmesh.types.BMVertSeq`

### method `bmesh.types.BMesh.__hash__`

:rtype: int

### method `bmesh.types.BMesh.__repr__`

:rtype: str

### class `bmesh.types.BMVert`

The BMesh vertex type

### method `bmesh.types.BMVert.calc_edge_angle`

Return the angle between this vert's two connected edges.

:param fallback: return this when the vert doesn't have 2 edges
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: Angle between edges in radians.
:rtype: float

### method `bmesh.types.BMVert.calc_shell_factor`

Return a multiplier calculated based on the sharpness of the vertex.
Where a flat surface gives 1.0, and higher values sharper edges.
This is used to maintain shell thickness when offsetting verts along their normals.

:return: offset multiplier
:rtype: float

### method `bmesh.types.BMVert.copy_from`

Copy values from another element of matching type.

:param other: Another element of the same type to copy from.
:type other: Self

### method `bmesh.types.BMVert.copy_from_face_interp`

Interpolate the customdata from a face onto this vert (the vert should overlap the face).

:param face: The face to interpolate data from.
:type face: :class:`bmesh.types.BMFace`

### method `bmesh.types.BMVert.copy_from_vert_interp`

Interpolate the customdata from a vert between 2 other verts.

:param vert_pair: The verts between which to interpolate data from.
:type vert_pair: Sequence[:class:`bmesh.types.BMVert`]
:param fac: The interpolation factor.
:type fac: float

### method `bmesh.types.BMVert.hide_set`

Set the hide state.
This is different from the *hide* attribute because it updates the selection and hide state of associated geometry.

:param hide: Hidden or visible.
:type hide: bool

### method `bmesh.types.BMVert.normal_update`

Update vertex normal.
This does not update the normals of adjoining faces.

### method `bmesh.types.BMVert.select_set`

note: 
The vertex normal will be a zero vector if vertex :attr:`is_wire` is True.
Set the selection.
This is different from the *select* attribute because it updates the selection state of associated geometry.

:param select: Select or de-select.
:type select: bool

### attribute `bmesh.types.BMVert.co`

note: 
This flushes selection down (e.g. selecting a face also selects its edges and vertices), but not up (e.g. de-selecting a vertex won't de-select faces that use it). Before finishing with a mesh, flushing is typically still needed.
The coordinates for this vertex as a 3D, wrapped vector.

:type: :class:`mathutils.Vector`

### attribute `bmesh.types.BMVert.hide`

Hidden state of this element.

:type: bool

### attribute `bmesh.types.BMVert.index`

Index of this element.

:type: int

### attribute `bmesh.types.BMVert.is_boundary`

note: 
This value is not necessarily valid, while editing the mesh it can become *dirty*.

   It's also possible to assign any number to this attribute for a scripts internal logic.

   To ensure the value is up to date - see :meth:`bmesh.types.BMElemSeq.index_update`.
True when this vertex is connected to boundary edges (read-only).

:type: bool

### attribute `bmesh.types.BMVert.is_manifold`

True when this vertex is manifold (read-only).

:type: bool

### attribute `bmesh.types.BMVert.is_valid`

True when this element is valid (hasn't been freed or removed).

:type: bool

### attribute `bmesh.types.BMVert.is_wire`

True when this vertex is not connected to any faces (read-only).

:type: bool

### attribute `bmesh.types.BMVert.link_edges`

Edges connected to this vertex (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMEdge`]

### attribute `bmesh.types.BMVert.link_faces`

Faces connected to this vertex (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMFace`]

### attribute `bmesh.types.BMVert.link_loops`

Loops that use this vertex (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMLoop`]

### attribute `bmesh.types.BMVert.normal`

The normal for this vertex as a 3D, wrapped vector.

:type: :class:`mathutils.Vector`

### attribute `bmesh.types.BMVert.select`

Selected state of this element.

:type: bool

### attribute `bmesh.types.BMVert.tag`

Generic attribute scripts can use for own logic

:type: bool

### method `bmesh.types.BMVert.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bmesh.types.BMVert.__hash__`

:rtype: int

### method `bmesh.types.BMVert.__repr__`

:rtype: str

### method `bmesh.types.BMVert.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `bmesh.types.BMEdge`

The BMesh edge connecting 2 verts

### method `bmesh.types.BMEdge.calc_face_angle`

Return the angle between this edge's two connected faces.

:param fallback: return this when the edge doesn't have 2 faces
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: The angle between 2 connected faces in radians.
:rtype: float

### method `bmesh.types.BMEdge.calc_face_angle_signed`

Return the signed angle between this edge's two connected faces.

:param fallback: return this when the edge doesn't have 2 faces
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: The angle between 2 connected faces in radians (negative for concave join).
:rtype: float

### method `bmesh.types.BMEdge.calc_length`

Return the length of the edge.

:return: The length between both verts.
:rtype: float

### method `bmesh.types.BMEdge.calc_tangent`

Return the tangent at this edge relative to a face (pointing inward into the face).
This uses the face normal for calculation.

:param loop: The loop used for tangent calculation.
:type loop: :class:`bmesh.types.BMLoop`
:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMEdge.copy_from`

Copy values from another element of matching type.

:param other: Another element of the same type to copy from.
:type other: Self

### method `bmesh.types.BMEdge.hide_set`

Set the hide state.
This is different from the *hide* attribute because it updates the selection and hide state of associated geometry.

:param hide: Hidden or visible.
:type hide: bool

### method `bmesh.types.BMEdge.normal_update`

Update normals of all connected faces and the edge verts.

### method `bmesh.types.BMEdge.other_vert`

note: 
The normal of edge vertex will be a zero vector if vertex :attr:`is_wire` is True.
Return the other vertex on this edge or None if the vertex is not used by this edge.

:param vert: a vert in this edge.
:type vert: :class:`bmesh.types.BMVert`
:return: The edge's other vert.
:rtype: :class:`bmesh.types.BMVert` | None

### method `bmesh.types.BMEdge.select_set`

Set the selection.
This is different from the *select* attribute because it updates the selection state of associated geometry.

:param select: Select or de-select.
:type select: bool

### attribute `bmesh.types.BMEdge.hide`

note: 
This flushes selection down (e.g. selecting a face also selects its edges and vertices), but not up (e.g. de-selecting a vertex won't de-select faces that use it). Before finishing with a mesh, flushing is typically still needed.
Hidden state of this element.

:type: bool

### attribute `bmesh.types.BMEdge.index`

Index of this element.

:type: int

### attribute `bmesh.types.BMEdge.is_boundary`

note: 
This value is not necessarily valid, while editing the mesh it can become *dirty*.

   It's also possible to assign any number to this attribute for a scripts internal logic.

   To ensure the value is up to date - see :meth:`bmesh.types.BMElemSeq.index_update`.
True when this edge is at the boundary of a face (read-only).

:type: bool

### attribute `bmesh.types.BMEdge.is_contiguous`

True when this edge is manifold, between two faces with the same winding (read-only).

:type: bool

### attribute `bmesh.types.BMEdge.is_convex`

True when this edge joins two convex faces, depends on a valid face normal (read-only).

:type: bool

### attribute `bmesh.types.BMEdge.is_manifold`

True when this edge is manifold (read-only).

:type: bool

### attribute `bmesh.types.BMEdge.is_valid`

True when this element is valid (hasn't been freed or removed).

:type: bool

### attribute `bmesh.types.BMEdge.is_wire`

True when this edge is not connected to any faces (read-only).

:type: bool

### attribute `bmesh.types.BMEdge.link_faces`

Faces connected to this edge, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMFace`]

### attribute `bmesh.types.BMEdge.link_loops`

Loops connected to this edge, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMLoop`]

### attribute `bmesh.types.BMEdge.seam`

Seam for UV unwrapping.

:type: bool

### attribute `bmesh.types.BMEdge.select`

Selected state of this element.

:type: bool

### attribute `bmesh.types.BMEdge.smooth`

Smooth state of this element.

:type: bool

### attribute `bmesh.types.BMEdge.tag`

Generic attribute scripts can use for own logic

:type: bool

### attribute `bmesh.types.BMEdge.verts`

Verts this edge uses (always 2), (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMVert`]

### method `bmesh.types.BMEdge.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bmesh.types.BMEdge.__hash__`

:rtype: int

### method `bmesh.types.BMEdge.__repr__`

:rtype: str

### method `bmesh.types.BMEdge.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `bmesh.types.BMFace`

The BMesh face with 3 or more sides

### method `bmesh.types.BMFace.calc_area`

Return the area of the face.

:return: The area of the face.
:rtype: float

### method `bmesh.types.BMFace.calc_center_bounds`

Return bounds center of the face.

:return: a 3D vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_center_median`

Return median center of the face.

:return: a 3D vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_center_median_weighted`

Return median center of the face weighted by edge lengths.

:return: a 3D vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_perimeter`

Return the perimeter of the face.

:return: The perimeter of the face.
:rtype: float

### method `bmesh.types.BMFace.calc_tangent_edge`

Return face tangent based on longest edge.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_tangent_edge_diagonal`

Return face tangent based on the edge farthest from any vertex.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_tangent_edge_pair`

Return face tangent based on the two longest disconnected edges.

- Tris: Use the edge pair with the most similar lengths.
- Quads: Use the longest edge pair.
- NGons: Use the two longest disconnected edges.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.calc_tangent_vert_diagonal`

Return face tangent based on the two most distant vertices.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMFace.copy`

Make a copy of this face.

:param verts: When set, the faces verts will be duplicated too.
:type verts: bool
:param edges: When set, the faces edges will be duplicated too.
:type edges: bool
:return: The newly created face.
:rtype: :class:`bmesh.types.BMFace`

### method `bmesh.types.BMFace.copy_from`

Copy values from another element of matching type.

:param other: Another element of the same type to copy from.
:type other: Self

### method `bmesh.types.BMFace.copy_from_face_interp`

Interpolate the customdata from another face onto this one (faces should overlap).

:param face: The face to interpolate data from.
:type face: :class:`bmesh.types.BMFace`
:param vert: When True, also copy vertex data.
:type vert: bool

### method `bmesh.types.BMFace.hide_set`

Set the hide state.
This is different from the *hide* attribute because it updates the selection and hide state of associated geometry.

:param hide: Hidden or visible.
:type hide: bool

### method `bmesh.types.BMFace.normal_flip`

Reverses winding of a face, which flips its normal.

### method `bmesh.types.BMFace.normal_update`

Update face normal based on the positions of the face verts.
This does not update the normals of face verts.

### method `bmesh.types.BMFace.select_set`

Set the selection.
This is different from the *select* attribute because it updates the selection state of associated geometry.

:param select: Select or de-select.
:type select: bool

### method `bmesh.types.BMFace.uv_select_set`

note: 
This flushes selection down (e.g. selecting a face also selects its edges and vertices), but not up (e.g. de-selecting a vertex won't de-select faces that use it). Before finishing with a mesh, flushing is typically still needed.
Set the UV face selection state.

:param select: Select or de-select.
:type select: bool

### attribute `bmesh.types.BMFace.edges`

note: 
This flushes selection down (selecting a face also selects its edges and vertices), but not up. Before finishing with a mesh, flushing with :meth:`bmesh.types.BMesh.uv_select_flush_mode` is still needed.
Edges of this face, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMEdge`]

### attribute `bmesh.types.BMFace.hide`

Hidden state of this element.

:type: bool

### attribute `bmesh.types.BMFace.index`

Index of this element.

:type: int

### attribute `bmesh.types.BMFace.is_valid`

note: 
This value is not necessarily valid, while editing the mesh it can become *dirty*.

   It's also possible to assign any number to this attribute for a scripts internal logic.

   To ensure the value is up to date - see :meth:`bmesh.types.BMElemSeq.index_update`.
True when this element is valid (hasn't been freed or removed).

:type: bool

### attribute `bmesh.types.BMFace.loops`

Loops of this face, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMLoop`]

### attribute `bmesh.types.BMFace.material_index`

The face's material index.

:type: int

### attribute `bmesh.types.BMFace.normal`

The normal for this face as a 3D, wrapped vector.

:type: :class:`mathutils.Vector`

### attribute `bmesh.types.BMFace.select`

Selected state of this element.

:type: bool

### attribute `bmesh.types.BMFace.smooth`

Smooth state of this element.

:type: bool

### attribute `bmesh.types.BMFace.tag`

Generic attribute scripts can use for own logic

:type: bool

### attribute `bmesh.types.BMFace.uv_select`

UV selected state of this element.

:type: bool

### attribute `bmesh.types.BMFace.verts`

Verts of this face, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMVert`]

### method `bmesh.types.BMFace.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bmesh.types.BMFace.__hash__`

:rtype: int

### method `bmesh.types.BMFace.__repr__`

:rtype: str

### method `bmesh.types.BMFace.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `bmesh.types.BMLoop`

This is normally accessed from :class:`bmesh.types.BMFace.loops` where each face loop represents a corner of the face.

### method `bmesh.types.BMLoop.calc_angle`

Return the angle at this loops corner of the face.
This is calculated so sharper corners give lower angles.

:return: The angle in radians.
:rtype: float

### method `bmesh.types.BMLoop.calc_normal`

Return normal at this loops corner of the face.
Falls back to the face normal for straight lines.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMLoop.calc_tangent`

Return the tangent at this loops corner of the face (pointing inward into the face).
Falls back to the face normal for straight lines.

:return: a normalized vector.
:rtype: :class:`mathutils.Vector`

### method `bmesh.types.BMLoop.copy_from`

Copy values from another element of matching type.

:param other: Another element of the same type to copy from.
:type other: Self

### method `bmesh.types.BMLoop.copy_from_face_interp`

Interpolate the customdata from a face onto this loop (the loop's vert should overlap the face).

:param face: The face to interpolate data from.
:type face: :class:`bmesh.types.BMFace`
:param vert: When enabled, interpolate the loop's vertex data (optional).
:type vert: bool
:param multires: When enabled, interpolate the loop's multires data (optional).
:type multires: bool

### method `bmesh.types.BMLoop.uv_select_edge_set`

Set the UV edge selection state.

:param select: Select or de-select.
:type select: bool

### method `bmesh.types.BMLoop.uv_select_vert_set`

note: 
This flushes selection down (selecting an edge also selects its vertices), but not up (de-selecting a vertex won't de-select the edges & faces that use it). Before finishing with a mesh, flushing with :meth:`bmesh.types.BMesh.uv_select_flush_mode` is still needed.
Set the UV vertex selection state.

:param select: Select or de-select.
:type select: bool

### attribute `bmesh.types.BMLoop.edge`

note: 
This does not flush selection, so selecting a vertex won't select the edges & faces that use it. Before finishing with a mesh, flushing with :meth:`bmesh.types.BMesh.uv_select_flush_mode` is still needed.
The loop's edge (between this loop and the next), (read-only).

:type: :class:`bmesh.types.BMEdge`

### attribute `bmesh.types.BMLoop.face`

The face this loop belongs to (read-only).

:type: :class:`bmesh.types.BMFace`

### attribute `bmesh.types.BMLoop.index`

Index of this element.

:type: int

### attribute `bmesh.types.BMLoop.is_convex`

note: 
This value is not necessarily valid, while editing the mesh it can become *dirty*.

   It's also possible to assign any number to this attribute for a scripts internal logic.

   To ensure the value is up to date - see :meth:`bmesh.types.BMElemSeq.index_update`.
True when this loop is at the convex corner of a face, depends on a valid face normal (read-only).

:type: bool

### attribute `bmesh.types.BMLoop.is_valid`

True when this element is valid (hasn't been freed or removed).

:type: bool

### attribute `bmesh.types.BMLoop.link_loop_next`

The next face corner (read-only).

:type: :class:`bmesh.types.BMLoop`

### attribute `bmesh.types.BMLoop.link_loop_prev`

The previous face corner (read-only).

:type: :class:`bmesh.types.BMLoop`

### attribute `bmesh.types.BMLoop.link_loop_radial_next`

The next loop around the edge (read-only).

:type: :class:`bmesh.types.BMLoop`

### attribute `bmesh.types.BMLoop.link_loop_radial_prev`

The previous loop around the edge (read-only).

:type: :class:`bmesh.types.BMLoop`

### attribute `bmesh.types.BMLoop.link_loops`

Loops connected to this loop, (read-only).

:type: :class:`bmesh.types.BMElemSeq`\ [:class:`bmesh.types.BMLoop`]

### attribute `bmesh.types.BMLoop.tag`

Generic attribute scripts can use for own logic

:type: bool

### attribute `bmesh.types.BMLoop.uv_select_edge`

UV edge selected state of this loop.

:type: bool

### attribute `bmesh.types.BMLoop.uv_select_vert`

UV vertex selected state of this loop.

:type: bool

### attribute `bmesh.types.BMLoop.vert`

The loop's vertex (read-only).

:type: :class:`bmesh.types.BMVert`

### method `bmesh.types.BMLoop.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bmesh.types.BMLoop.__hash__`

:rtype: int

### method `bmesh.types.BMLoop.__repr__`

:rtype: str

### method `bmesh.types.BMLoop.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `bmesh.types.BMElemSeq`

General sequence type used for accessing any sequence of
:class:`bmesh.types.BMVert`, :class:`bmesh.types.BMEdge`, :class:`bmesh.types.BMFace`, :class:`bmesh.types.BMLoop`.

When accessed via :class:`bmesh.types.BMesh.verts`, :class:`bmesh.types.BMesh.edges`, :class:`bmesh.types.BMesh.faces`
there are also functions to create/remove items.

### method `bmesh.types.BMElemSeq.index_update`

Initialize the index values of this sequence.

This is the equivalent of looping over all elements and assigning the index values.

### method `bmesh.types.BMElemSeq.__contains__`

```
for index, ele in enumerate(sequence):
       ele.index = index
```
note: 
Running this on sequences besides :class:`bmesh.types.BMesh.verts`, :class:`bmesh.types.BMesh.edges`, :class:`bmesh.types.BMesh.faces`
   works but won't result in each element having a valid index, instead its order in the sequence will be set.
:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMElemSeq.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMVert` | :class:`BMEdge` | :class:`BMFace`

### method `bmesh.types.BMElemSeq.__iter__`

:rtype: :class:`BMElemSeq`

### method `bmesh.types.BMElemSeq.__len__`

:rtype: int

### method `bmesh.types.BMVertSeq.ensure_lookup_table`

Ensure internal data needed for int subscript access is initialized with verts/edges/faces, eg ``bm.verts[index]``.

This needs to be called again after adding/removing data in this sequence.

### method `bmesh.types.BMVertSeq.index_update`

Initialize the index values of this sequence.

This is the equivalent of looping over all elements and assigning the index values.

### method `bmesh.types.BMVertSeq.new`

```
for index, ele in enumerate(sequence):
       ele.index = index
```
note: 
Running this on sequences besides :class:`bmesh.types.BMesh.verts`, :class:`bmesh.types.BMesh.edges`, :class:`bmesh.types.BMesh.faces`
   works but won't result in each element having a valid index, instead its order in the sequence will be set.
Create a new vertex.

:param co: The initial location of the vertex (optional argument).
:type co: tuple[float, float, float] | Sequence[float]
:param source: Existing vert to initialize settings.
:type source: :class:`bmesh.types.BMVert` | None
:return: The newly created vertex.
:rtype: :class:`bmesh.types.BMVert`

### method `bmesh.types.BMVertSeq.remove`

Remove a vert.

:param vert: The vert to remove.
:type vert: :class:`bmesh.types.BMVert`

### method `bmesh.types.BMVertSeq.sort`

Sort the elements of this sequence, using an optional custom sort key.
Indices of elements are not changed, :meth:`bmesh.types.BMElemSeq.index_update` can be used for that.

:param key: The key that sets the ordering of the elements.
:type key: Callable[[:class:`bmesh.types.BMVert` | :class:`bmesh.types.BMEdge` | :class:`bmesh.types.BMFace`], int] | None
:param reverse: Reverse the order of the elements
:type reverse: bool

### attribute `bmesh.types.BMVertSeq.layers`

note: 
When the 'key' argument is not provided, the elements are reordered following their current index value.
   In particular this can be used by setting indices manually before calling this method.
warning: 
Existing references to the N'th element, will continue to point the data at that index.
custom-data layers (read-only).

:type: :class:`bmesh.types.BMLayerAccessVert`

### method `bmesh.types.BMVertSeq.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMVertSeq.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMVert`

### method `bmesh.types.BMVertSeq.__iter__`

:rtype: :class:`BMVertSeq`

### method `bmesh.types.BMVertSeq.__len__`

:rtype: int

### method `bmesh.types.BMEdgeSeq.ensure_lookup_table`

Ensure internal data needed for int subscript access is initialized with verts/edges/faces, eg ``bm.verts[index]``.

This needs to be called again after adding/removing data in this sequence.

### method `bmesh.types.BMEdgeSeq.get`

Return an edge which uses the **verts** passed.

:param verts: Pair of verts (exactly 2).
:type verts: Sequence[:class:`bmesh.types.BMVert`]
:param fallback: Return this value if nothing is found.
:type fallback: Any
:return: The edge found or the fallback value.
:rtype: :class:`bmesh.types.BMEdge` | None

### method `bmesh.types.BMEdgeSeq.index_update`

Initialize the index values of this sequence.

This is the equivalent of looping over all elements and assigning the index values.

### method `bmesh.types.BMEdgeSeq.new`

```
for index, ele in enumerate(sequence):
       ele.index = index
```
note: 
Running this on sequences besides :class:`bmesh.types.BMesh.verts`, :class:`bmesh.types.BMesh.edges`, :class:`bmesh.types.BMesh.faces`
   works but won't result in each element having a valid index, instead its order in the sequence will be set.
Create a new edge from a given pair of verts.

:param verts: Vertex pair.
:type verts: Sequence[:class:`bmesh.types.BMVert`]
:param source: Existing edge to initialize settings (optional argument).
:type source: :class:`bmesh.types.BMEdge` | None
:return: The newly created edge.
:rtype: :class:`bmesh.types.BMEdge`

### method `bmesh.types.BMEdgeSeq.remove`

Remove an edge.

:param edge: The edge to remove.
:type edge: :class:`bmesh.types.BMEdge`

### method `bmesh.types.BMEdgeSeq.sort`

Sort the elements of this sequence, using an optional custom sort key.
Indices of elements are not changed, :meth:`bmesh.types.BMElemSeq.index_update` can be used for that.

:param key: The key that sets the ordering of the elements.
:type key: Callable[[:class:`bmesh.types.BMVert` | :class:`bmesh.types.BMEdge` | :class:`bmesh.types.BMFace`], int] | None
:param reverse: Reverse the order of the elements
:type reverse: bool

### attribute `bmesh.types.BMEdgeSeq.layers`

note: 
When the 'key' argument is not provided, the elements are reordered following their current index value.
   In particular this can be used by setting indices manually before calling this method.
warning: 
Existing references to the N'th element, will continue to point the data at that index.
custom-data layers (read-only).

:type: :class:`bmesh.types.BMLayerAccessEdge`

### method `bmesh.types.BMEdgeSeq.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMEdgeSeq.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMEdge`

### method `bmesh.types.BMEdgeSeq.__iter__`

:rtype: :class:`BMEdgeSeq`

### method `bmesh.types.BMEdgeSeq.__len__`

:rtype: int

### method `bmesh.types.BMFaceSeq.ensure_lookup_table`

Ensure internal data needed for int subscript access is initialized with verts/edges/faces, eg ``bm.verts[index]``.

This needs to be called again after adding/removing data in this sequence.

### method `bmesh.types.BMFaceSeq.get`

Return a face which uses the **verts** passed.

:param verts: Sequence of verts.
:type verts: Sequence[:class:`bmesh.types.BMVert`]
:param fallback: Return this value if nothing is found.
:type fallback: Any
:return: The face found or the fallback value.
:rtype: :class:`bmesh.types.BMFace` | None

### method `bmesh.types.BMFaceSeq.index_update`

Initialize the index values of this sequence.

This is the equivalent of looping over all elements and assigning the index values.

### method `bmesh.types.BMFaceSeq.new`

```
for index, ele in enumerate(sequence):
       ele.index = index
```
note: 
Running this on sequences besides :class:`bmesh.types.BMesh.verts`, :class:`bmesh.types.BMesh.edges`, :class:`bmesh.types.BMesh.faces`
   works but won't result in each element having a valid index, instead its order in the sequence will be set.
Create a new face from a given set of verts.

:param verts: Sequence of 3 or more verts.
:type verts: Sequence[:class:`bmesh.types.BMVert`]
:param source: Existing face to initialize settings (optional argument).
:type source: :class:`bmesh.types.BMFace` | None
:return: The newly created face.
:rtype: :class:`bmesh.types.BMFace`

### method `bmesh.types.BMFaceSeq.remove`

Remove a face.

:param face: The face to remove.
:type face: :class:`bmesh.types.BMFace`

### method `bmesh.types.BMFaceSeq.sort`

Sort the elements of this sequence, using an optional custom sort key.
Indices of elements are not changed, :meth:`bmesh.types.BMElemSeq.index_update` can be used for that.

:param key: The key that sets the ordering of the elements.
:type key: Callable[[:class:`bmesh.types.BMVert` | :class:`bmesh.types.BMEdge` | :class:`bmesh.types.BMFace`], int] | None
:param reverse: Reverse the order of the elements
:type reverse: bool

### attribute `bmesh.types.BMFaceSeq.active`

note: 
When the 'key' argument is not provided, the elements are reordered following their current index value.
   In particular this can be used by setting indices manually before calling this method.
warning: 
Existing references to the N'th element, will continue to point the data at that index.
active face.

:type: :class:`bmesh.types.BMFace` | None

### attribute `bmesh.types.BMFaceSeq.layers`

custom-data layers (read-only).

:type: :class:`bmesh.types.BMLayerAccessFace`

### method `bmesh.types.BMFaceSeq.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMFaceSeq.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMFace`

### method `bmesh.types.BMFaceSeq.__iter__`

:rtype: :class:`BMFaceSeq`

### method `bmesh.types.BMFaceSeq.__len__`

:rtype: int

### attribute `bmesh.types.BMLoopSeq.layers`

custom-data layers (read-only).

:type: :class:`bmesh.types.BMLayerAccessLoop`

### class `bmesh.types.BMIter`

Internal BMesh type for looping over verts/faces/edges,
used for iterating over :class:`bmesh.types.BMElemSeq` types.

### method `bmesh.types.BMIter.__iter__`

:rtype: :class:`BMIter`

### method `bmesh.types.BMIter.__next__`

:rtype: Any

### method `bmesh.types.BMEditSelSeq.add`

Add an element to the selection history (no action taken if its already added).

:param element: The element to add.
:type element: :class:`BMVert` | :class:`BMEdge` | :class:`BMFace`

### method `bmesh.types.BMEditSelSeq.clear`

Empties the selection history.

### method `bmesh.types.BMEditSelSeq.discard`

Discard an element from the selection history.

Like remove but doesn't raise an error when the element is not in the selection list.

:param element: The element to discard.
:type element: :class:`BMVert` | :class:`BMEdge` | :class:`BMFace`

### method `bmesh.types.BMEditSelSeq.remove`

Remove an element from the selection history.

:param element: The element to remove.
:type element: :class:`BMVert` | :class:`BMEdge` | :class:`BMFace`

### method `bmesh.types.BMEditSelSeq.validate`

Ensures all elements in the selection history are selected.

### attribute `bmesh.types.BMEditSelSeq.active`

The last selected element or None (read-only).

:type: :class:`bmesh.types.BMVert` | :class:`bmesh.types.BMEdge` | :class:`bmesh.types.BMFace` | None

### method `bmesh.types.BMEditSelSeq.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMEditSelSeq.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMVert` | :class:`BMEdge` | :class:`BMFace`

### method `bmesh.types.BMEditSelSeq.__iter__`

:rtype: :class:`BMEditSelSeq`

### method `bmesh.types.BMEditSelSeq.__len__`

:rtype: int

### method `bmesh.types.BMEditSelIter.__iter__`

:rtype: :class:`BMEditSelIter`

### method `bmesh.types.BMEditSelIter.__next__`

:rtype: Any

### class `bmesh.types.BMLayerAccessVert`

Exposes custom-data layer attributes.

### attribute `bmesh.types.BMLayerAccessVert.bool`

Generic boolean custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [bool]

### attribute `bmesh.types.BMLayerAccessVert.color`

Generic RGBA color with 8-bit precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessVert.deform`

Vertex deform weight :class:`bmesh.types.BMDeformVert` (TODO).

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`bmesh.types.BMDeformVert`]

### attribute `bmesh.types.BMLayerAccessVert.float`

Generic float custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [float]

### attribute `bmesh.types.BMLayerAccessVert.float_color`

Generic RGBA color with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessVert.float_vector`

Generic 3D vector with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessVert.int`

Generic int custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [int]

### attribute `bmesh.types.BMLayerAccessVert.shape`

Vertex shape-key absolute location (as a 3D Vector).

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessVert.skin`

Accessor for skin layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`bmesh.types.BMVertSkin`]

### attribute `bmesh.types.BMLayerAccessVert.string`

Generic string custom-data layer (exposed as bytes, 255 max length).

:type: :class:`bmesh.types.BMLayerCollection`\ [bytes]

### class `bmesh.types.BMLayerAccessEdge`

Exposes custom-data layer attributes.

### attribute `bmesh.types.BMLayerAccessEdge.bool`

Generic boolean custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [bool]

### attribute `bmesh.types.BMLayerAccessEdge.color`

Generic RGBA color with 8-bit precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessEdge.float`

Generic float custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [float]

### attribute `bmesh.types.BMLayerAccessEdge.float_color`

Generic RGBA color with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessEdge.float_vector`

Generic 3D vector with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessEdge.int`

Generic int custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [int]

### attribute `bmesh.types.BMLayerAccessEdge.string`

Generic string custom-data layer (exposed as bytes, 255 max length).

:type: :class:`bmesh.types.BMLayerCollection`\ [bytes]

### class `bmesh.types.BMLayerAccessFace`

Exposes custom-data layer attributes.

### attribute `bmesh.types.BMLayerAccessFace.bool`

Generic boolean custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [bool]

### attribute `bmesh.types.BMLayerAccessFace.color`

Generic RGBA color with 8-bit precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessFace.float`

Generic float custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [float]

### attribute `bmesh.types.BMLayerAccessFace.float_color`

Generic RGBA color with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessFace.float_vector`

Generic 3D vector with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessFace.int`

Generic int custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [int]

### attribute `bmesh.types.BMLayerAccessFace.string`

Generic string custom-data layer (exposed as bytes, 255 max length).

:type: :class:`bmesh.types.BMLayerCollection`\ [bytes]

### class `bmesh.types.BMLayerAccessLoop`

Exposes custom-data layer attributes.

### attribute `bmesh.types.BMLayerAccessLoop.bool`

Generic boolean custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [bool]

### attribute `bmesh.types.BMLayerAccessLoop.color`

Generic RGBA color with 8-bit precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessLoop.float`

Generic float custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [float]

### attribute `bmesh.types.BMLayerAccessLoop.float_color`

Generic RGBA color with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessLoop.float_vector`

Generic 3D vector with float precision custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`mathutils.Vector`]

### attribute `bmesh.types.BMLayerAccessLoop.int`

Generic int custom-data layer.

:type: :class:`bmesh.types.BMLayerCollection`\ [int]

### attribute `bmesh.types.BMLayerAccessLoop.string`

Generic string custom-data layer (exposed as bytes, 255 max length).

:type: :class:`bmesh.types.BMLayerCollection`\ [bytes]

### attribute `bmesh.types.BMLayerAccessLoop.uv`

Accessor for :class:`bmesh.types.BMLoopUV` UV (as a 2D Vector).

:type: :class:`bmesh.types.BMLayerCollection`\ [:class:`bmesh.types.BMLoopUV`]

### class `bmesh.types.BMLayerCollection`

Gives access to a collection of custom-data layers of the same type and behaves like Python dictionaries, except for the ability to do list like index access.

### method `bmesh.types.BMLayerCollection.get`

Returns the value of the layer matching the key or default
when not found (matches Python's dictionary function of the same name).

:param key: The key associated with the layer.
:type key: str
:param default: Optional argument for the value to return if
   *key* is not found.
:type default: Any
:return: The layer matching the key or the default value.
:rtype: :class:`bmesh.types.BMLayerItem` | Any

### method `bmesh.types.BMLayerCollection.items`

Return the (key, value) pairs of collection members
(matching Python's dict.items() functionality).

:return: (key, value) pairs for each member of this collection.
:rtype: list[tuple[str, :class:`bmesh.types.BMLayerItem`]]

### method `bmesh.types.BMLayerCollection.keys`

Return the identifiers of collection members
(matching Python's dict.keys() functionality).

:return: the identifiers for each member of this collection.
:rtype: list[str]

### method `bmesh.types.BMLayerCollection.new`

Create a new layer

:param name: Optional name argument (will be made unique).
:type name: str
:return: The newly created layer.
:rtype: :class:`bmesh.types.BMLayerItem`

### method `bmesh.types.BMLayerCollection.remove`

Remove a layer

:param layer: The layer to remove.
:type layer: :class:`bmesh.types.BMLayerItem`

### method `bmesh.types.BMLayerCollection.values`

Return the values of collection
(matching Python's dict.values() functionality).

:return: the members of this collection.
:rtype: list[:class:`bmesh.types.BMLayerItem`]

### method `bmesh.types.BMLayerCollection.verify`

Create a new layer or return an existing active layer

:return: The newly created layer, or the existing active layer.
:rtype: :class:`bmesh.types.BMLayerItem`

### attribute `bmesh.types.BMLayerCollection.active`

The active layer of this type (read-only).

:type: :class:`bmesh.types.BMLayerItem` | None

### attribute `bmesh.types.BMLayerCollection.is_singleton`

True if there can exist only one layer of this type (read-only).

:type: bool

### method `bmesh.types.BMLayerCollection.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMLayerCollection.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`BMLayerItem`

### method `bmesh.types.BMLayerCollection.__iter__`

:rtype: :class:`BMLayerCollection`

### method `bmesh.types.BMLayerCollection.__len__`

:rtype: int

### class `bmesh.types.BMLayerItem`

Exposes a single custom data layer, its main purpose is for use as an item accessor to custom-data when used with vert/edge/face/loop data.

### method `bmesh.types.BMLayerItem.copy_from`

Copy data from another layer.

:param other: Another layer to copy from.
:type other: :class:`bmesh.types.BMLayerItem`

### attribute `bmesh.types.BMLayerItem.name`

The layer's unique name (read-only).

:type: str

### attribute `bmesh.types.BMLoopUV.pin_uv`

UV pin state.

:type: bool

### attribute `bmesh.types.BMLoopUV.uv`

Loop UV (as a 2D Vector).

:type: :class:`mathutils.Vector`

### method `bmesh.types.BMDeformVert.clear`

Clears all weights.

### method `bmesh.types.BMDeformVert.get`

Returns the deform weight matching the key or default
when not found (matches Python's dictionary function of the same name).

:param key: The vertex group index.
:type key: int
:param default: Optional argument for the value to return if
   *key* is not found.
:type default: Any
:return: The deform weight or the default when not found.
:rtype: float | Any

### method `bmesh.types.BMDeformVert.items`

Return (group, weight) pairs for this vertex
(matching Python's dict.items() functionality).

:return: (key, value) pairs for each deform weight of this vertex.
:rtype: list[tuple[int, float]]

### method `bmesh.types.BMDeformVert.keys`

Return the group indices used by this vertex
(matching Python's dict.keys() functionality).

:return: The deform group indices this vertex uses.
:rtype: list[int]

### method `bmesh.types.BMDeformVert.values`

Return the weights of the deform vertex
(matching Python's dict.values() functionality).

:return: The weights that influence this vertex
:rtype: list[float]

### method `bmesh.types.BMDeformVert.__contains__`

:param item: Item to test for membership.
   :type item: object
   :rtype: bool

### method `bmesh.types.BMDeformVert.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `bmesh.types.BMDeformVert.__len__`

:rtype: int

### method `bmesh.types.BMDeformVert.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object
