<!-- source: api/mathutils.kdtree.rst -->

Generic 3-dimensional kd-tree to perform spatial searches.

### class `mathutils.kdtree.KDTree`

literalinclude: ./examples/mathutils.kdtree.0.py
KDTree(size) -> new kd-tree initialized to hold up to ``size`` items.

:param size: Maximum number of items.
:type size: int

### method `mathutils.kdtree.KDTree.balance`

note: 
:meth:`KDTree.balance` must have been called before using any of the ``find`` methods.
Balance the tree.

### method `mathutils.kdtree.KDTree.find`

note: 
This builds the entire tree, avoid calling after each insertion.
Find nearest point to ``co``.

:param co: 3D coordinate.
:type co: Sequence[float]
:param filter: function which takes an index and returns True for indices to include in the search.
:type filter: Callable[[int], bool] | None
:return: Returns (position, index, distance),
   or (None, None, None) when no match is found.
:rtype: tuple[:class:`Vector`, int, float] | tuple[None, None, None]

### method `mathutils.kdtree.KDTree.find_n`

Find nearest ``n`` points to ``co``.

:param co: 3D coordinate.
:type co: Sequence[float]
:param n: Number of points to find.
:type n: int
:return: Returns a list of tuples (position, index, distance).
:rtype: list[tuple[:class:`Vector`, int, float]]

### method `mathutils.kdtree.KDTree.find_range`

Find all points within ``radius`` of ``co``.

:param co: 3D coordinate.
:type co: Sequence[float]
:param radius: Maximum distance to search for points.
:type radius: float
:return: Returns a list of tuples (position, index, distance).
:rtype: list[tuple[:class:`Vector`, int, float]]

### method `mathutils.kdtree.KDTree.insert`

Insert a point into the KDTree.

:param co: Point 3d position.
:type co: Sequence[float]
:param index: The index of the point (must be non-negative).
:type index: int
