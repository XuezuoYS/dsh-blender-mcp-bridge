<!-- source: api/mathutils.interpolate.rst -->

The Blender interpolate module.

### function `mathutils.interpolate.poly_3d_calc`

Calculate barycentric weights for a point on a polygon.

:param veclist: Sequence of 3D positions.
:type veclist: Sequence[Sequence[float]]
:param pt: 2D or 3D position.
:type pt: Sequence[float]
:return: A list of weights, one per vertex in *veclist*.
:rtype: list[float]
