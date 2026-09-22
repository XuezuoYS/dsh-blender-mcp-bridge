<!-- source: api/bmesh.utils.rst -->

This module provides bmesh utility functions for splitting, joining, and modifying mesh elements.

### function `bmesh.utils.edge_rotate`

Rotate the edge and return the newly created edge.
If rotating the edge fails, None will be returned.

:param edge: The edge to rotate.
:type edge: :class:`bmesh.types.BMEdge`
:param ccw: When True the edge will be rotated counter clockwise.
:type ccw: bool
:return: The newly rotated edge.
:rtype: :class:`bmesh.types.BMEdge` | None

### function `bmesh.utils.edge_split`

Split an edge, return the newly created data.

:param edge: The edge to split.
:type edge: :class:`bmesh.types.BMEdge`
:param vert: One of the verts on the edge, defines the split direction.
:type vert: :class:`bmesh.types.BMVert`
:param fac: The point on the edge where the new vert will be created [0 - 1].
:type fac: float
:return: The newly created (edge, vert) pair.
:rtype: tuple[:class:`bmesh.types.BMEdge`, :class:`bmesh.types.BMVert`]

### function `bmesh.utils.face_flip`

Flip the face's direction.

:param face: Face to flip.
:type face: :class:`bmesh.types.BMFace`

### function `bmesh.utils.face_join`

Joins a sequence of faces.

:param faces: Sequence of faces.
:type faces: Sequence[:class:`bmesh.types.BMFace`]
:param remove: Remove the edges and vertices between the faces.
:type remove: bool
:return: The newly created face or None on failure.
:rtype: :class:`bmesh.types.BMFace` | None

### function `bmesh.utils.face_split`

Face split with optional intermediate points.

:param face: The face to cut.
:type face: :class:`bmesh.types.BMFace`
:param vert_a: First vertex to cut in the face (face must contain the vert).
:type vert_a: :class:`bmesh.types.BMVert`
:param vert_b: Second vertex to cut in the face (face must contain the vert).
:type vert_b: :class:`bmesh.types.BMVert`
:param coords: Optional sequence of 3D points in between *vert_a* and *vert_b*.
:type coords: Sequence[Sequence[float]]
:param use_exist: Use an existing edge if it exists (only used when *coords* argument is empty or omitted)
:type use_exist: bool
:param source: Newly created edge will copy settings from this one.
:type source: :class:`bmesh.types.BMEdge` | None
:return: The newly created face and loop.
:rtype: tuple[:class:`bmesh.types.BMFace`, :class:`bmesh.types.BMLoop`]

### function `bmesh.utils.face_split_edgenet`

Splits a face into any number of regions defined by an edgenet.

:param face: The face to split.
:type face: :class:`bmesh.types.BMFace`
:param edgenet: Sequence of edges.
:type edgenet: Sequence[:class:`bmesh.types.BMEdge`]
:return: The newly created faces.
:rtype: tuple[:class:`bmesh.types.BMFace`, ...]

### function `bmesh.utils.face_vert_separate`

note: 
Regions defined by edges need to connect to the face, otherwise they're ignored as loose edges.
Rip a vertex in a face away and add a new vertex.

:param face: The face to separate.
:type face: :class:`bmesh.types.BMFace`
:param vert: A vertex in the face to separate.
:type vert: :class:`bmesh.types.BMVert`
:return: The newly created vertex or None on failure.
:rtype: :class:`bmesh.types.BMVert` | None

### function `bmesh.utils.loop_separate`

note: 
This is the same as loop_separate, and has only been added for convenience.
Rip a vertex in a face away and add a new vertex.

:param loop: The loop to separate.
:type loop: :class:`bmesh.types.BMLoop`
:return: The newly created vertex or None on failure.
:rtype: :class:`bmesh.types.BMVert` | None

### function `bmesh.utils.uv_select_check`

Check UV selection state for consistency issues.

:param bm: The BMesh to check.
:type bm: :class:`bmesh.types.BMesh`
:param sync: Check the data is properly synchronized between UV's and the underlying mesh. Failure to synchronize with the mesh selection may cause tools not to behave properly.
:type sync: bool
:param flush: Check the selection has been properly flushed between elements (based on the current :attr:`bmesh.types.BMesh.select_mode`).
:type flush: bool
:param contiguous: Check connected UV's and edges have a matching selection state.
:type contiguous: bool
:return: An error dictionary or None when there are no errors found.
:rtype: dict[str, int] | None

### function `bmesh.utils.vert_collapse_edge`

Collapse a vertex into an edge.

:param vert: The vert that will be collapsed.
:type vert: :class:`bmesh.types.BMVert`
:param edge: The edge to collapse into.
:type edge: :class:`bmesh.types.BMEdge`
:return: The resulting edge from the collapse operation.
:rtype: :class:`bmesh.types.BMEdge`

### function `bmesh.utils.vert_collapse_faces`

Collapses a vertex that has only two manifold edges onto a vertex it shares an edge with.

:param vert: The vert that will be collapsed.
:type vert: :class:`bmesh.types.BMVert`
:param edge: The edge to collapse into.
:type edge: :class:`bmesh.types.BMEdge`
:param fac: The factor to use when merging customdata [0 - 1].
:type fac: float
:param join_faces: When true the faces around the vertex will be joined otherwise collapse the vertex by merging the 2 edges this vertex connects to into one.
:type join_faces: bool
:return: The resulting edge from the collapse operation.
:rtype: :class:`bmesh.types.BMEdge`

### function `bmesh.utils.vert_dissolve`

Dissolve this vertex (will be removed).

:param vert: The vert to be dissolved.
:type vert: :class:`bmesh.types.BMVert`
:return: True when the vertex dissolve is successful.
:rtype: bool

### function `bmesh.utils.vert_separate`

Separate this vertex at every edge.

:param vert: The vert to be separated.
:type vert: :class:`bmesh.types.BMVert`
:param edges: The edges to separate.
:type edges: Sequence[:class:`bmesh.types.BMEdge`]
:return: The newly separated verts (including the vertex passed).
:rtype: tuple[:class:`bmesh.types.BMVert`, ...]

### function `bmesh.utils.vert_splice`

Splice vert into vert_target, merging them.

:param vert: The vertex to be removed.
:type vert: :class:`bmesh.types.BMVert`
:param vert_target: The vertex to merge into.
:type vert_target: :class:`bmesh.types.BMVert`

note: The verts mustn't share an edge or face.
