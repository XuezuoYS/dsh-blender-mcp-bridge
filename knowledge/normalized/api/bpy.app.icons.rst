<!-- source: api/bpy.app.icons.rst -->

### function `bpy.app.icons.new_triangles`

Create a new icon from triangle geometry.

:param range: Pair of ints.
:type range: tuple[int, int]
:param coords: Sequence of bytes (6 floats for one triangle) for (X, Y) coordinates.
:type coords: bytes
:param colors: Sequence of bytes (12 for one triangle) for RGBA.
:type colors: bytes
:return: Unique icon value (pass to interface ``icon_value`` argument).
:rtype: int

### function `bpy.app.icons.new_triangles_from_file`

Create a new icon from triangle geometry.

:param filepath: File path.
:type filepath: str | bytes
:return: Unique icon value (pass to interface ``icon_value`` argument).
:rtype: int

### function `bpy.app.icons.release`

Release the icon.

:param icon_id: The icon id to release.
:type icon_id: int
