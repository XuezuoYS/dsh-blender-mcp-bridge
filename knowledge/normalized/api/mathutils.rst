<!-- source: api/mathutils.rst -->

This module provides access to math operations.

note: 
Classes, methods and attributes that accept vectors also accept other numeric sequences,
such as tuples, lists.
The :mod:`mathutils` module provides the following classes:

- :class:`Color`,
- :class:`Euler`,
- :class:`Matrix`,
- :class:`Quaternion`,
- :class:`Vector`,

### class `mathutils.Color`

:maxdepth: 1
:caption: Submodules

mathutils.geometry.rst
mathutils.bvhtree.rst
mathutils.kdtree.rst
mathutils.interpolate.rst
mathutils.noise.rst
literalinclude: ./examples/mathutils.0.py
This object gives access to Colors in Blender.

Most colors returned by Blender APIs are in scene linear color space, as defined by the OpenColorIO configuration. The notable exception is user interface theming colors, which are in sRGB color space.

:param rgb: (red, green, blue) color values where (0, 0, 0) is black & (1, 1, 1) is white.
:type rgb: Sequence[float]

### method `mathutils.Color.copy`

literalinclude: ./examples/mathutils.Color.0.py
Returns a copy of this color.

:return: A copy of the color.
:rtype: :class:`Color`

### method `mathutils.Color.freeze`

note: use this to get a copy of a wrapped color with
no reference to the original data.
Make this object immutable.

After this the object can be hashed, used in dictionaries & sets.

:return: An instance of this object.
:rtype: Self

### method `mathutils.Color.from_aces_to_scene_linear`

Convert from ACES2065-1 linear to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_acescg_to_scene_linear`

Convert from ACEScg linear to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_rec2020_linear_to_scene_linear`

Convert from Rec.2020 linear color space to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_rec709_linear_to_scene_linear`

Convert from Rec.709 linear color space to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_aces`

Convert from scene linear to ACES2065-1 linear color space.

:return: A color in ACES2065-1 linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_acescg`

Convert from scene linear to ACEScg linear color space.

:return: A color in ACEScg linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_rec2020_linear`

Convert from scene linear to Rec.2020 linear color space.

:return: A color in Rec.2020 linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_rec709_linear`

Convert from scene linear to Rec.709 linear color space.

:return: A color in Rec.709 linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_srgb`

Convert from scene linear to sRGB color space.

:return: A color in sRGB color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_scene_linear_to_xyz_d65`

Convert from scene linear to CIE XYZ (Illuminant D65) color space.

:return: A color in XYZ color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_srgb_to_scene_linear`

Convert from sRGB to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### method `mathutils.Color.from_xyz_d65_to_scene_linear`

Convert from CIE XYZ (Illuminant D65) to scene linear color space.

:return: A color in scene linear color space.
:rtype: :class:`Color`

### attribute `mathutils.Color.b`

Blue color channel.

:type: float

### attribute `mathutils.Color.g`

Green color channel.

:type: float

### attribute `mathutils.Color.h`

HSV Hue component in [0, 1].

:type: float

### attribute `mathutils.Color.hsv`

HSV Values in [0, 1].

:type: tuple[float, float, float]

### attribute `mathutils.Color.is_frozen`

True when this object has been frozen (read-only).

:type: bool

### attribute `mathutils.Color.is_valid`

True when the owner of this data is valid.

:type: bool

### attribute `mathutils.Color.is_wrapped`

True when this object wraps external data (read-only).

:type: bool

### attribute `mathutils.Color.owner`

The item this is wrapping or None (read-only).

:type: Any

### attribute `mathutils.Color.r`

Red color channel.

:type: float

### attribute `mathutils.Color.s`

HSV Saturation component in [0, 1].

:type: float

### attribute `mathutils.Color.v`

HSV Value component in [0, 1].

:type: float

### method `mathutils.Color.__add__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Color`

### method `mathutils.Color.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Color.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `mathutils.Color.__hash__`

:rtype: int

### method `mathutils.Color.__iadd__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Color`

### method `mathutils.Color.__imul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Color`

### method `mathutils.Color.__isub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Color`

### method `mathutils.Color.__itruediv__`

:param other: Scalar divisor.
   :type other: float
   :rtype: :class:`Color`

### method `mathutils.Color.__len__`

:rtype: int

### method `mathutils.Color.__mul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Color`

### method `mathutils.Color.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Color.__neg__`

:rtype: :class:`Color`

### method `mathutils.Color.__pos__`

:rtype: :class:`Color`

### method `mathutils.Color.__repr__`

:rtype: str

### method `mathutils.Color.__rmul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Color`

### method `mathutils.Color.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### method `mathutils.Color.__str__`

:rtype: str

### method `mathutils.Color.__sub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Color`

### method `mathutils.Color.__truediv__`

:param other: Scalar divisor.
   :type other: float
   :rtype: :class:`Color`

### class `mathutils.Euler`

This object gives access to Eulers in Blender.

### method `mathutils.Euler.copy`

seealso: `Euler angles <https://en.wikipedia.org/wiki/Euler_angles>`__ on Wikipedia.
:param angles: (X, Y, Z) angles in radians.
:type angles: Sequence[float]
:param order: Euler rotation order.
:type order: Literal['XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX']
literalinclude: ./examples/mathutils.Euler.0.py
Returns a copy of this euler.

:return: A copy of the euler.
:rtype: :class:`Euler`

### method `mathutils.Euler.freeze`

note: use this to get a copy of a wrapped euler with
no reference to the original data.
Make this object immutable.

After this the object can be hashed, used in dictionaries & sets.

:return: An instance of this object.
:rtype: Self

### method `mathutils.Euler.make_compatible`

Make this euler compatible with another,
so interpolating between them works as intended.

:param other: Other euler rotation.
:type other: :class:`Euler`

### method `mathutils.Euler.rotate`

note: the rotation order is not taken into account for this function.
Rotates the euler by another mathutils value.

:param other: rotation component of mathutils value
:type other: :class:`Euler` | :class:`Quaternion` | :class:`Matrix`

### method `mathutils.Euler.rotate_axis`

Rotates the euler a certain amount, wrapping the result to produce
a unique euler rotation (no 720 degree pitches).

:param axis: An axis string.
:type axis: Literal['X', 'Y', 'Z']
:param angle: angle in radians.
:type angle: float

### method `mathutils.Euler.to_matrix`

Return a matrix representation of the euler.

:return: A 3x3 rotation matrix representation of the euler.
:rtype: :class:`Matrix`

### method `mathutils.Euler.to_quaternion`

Return a quaternion representation of the euler.

:return: Quaternion representation of the euler.
:rtype: :class:`Quaternion`

### method `mathutils.Euler.zero`

Set all values to zero.

### attribute `mathutils.Euler.is_frozen`

True when this object has been frozen (read-only).

:type: bool

### attribute `mathutils.Euler.is_valid`

True when the owner of this data is valid.

:type: bool

### attribute `mathutils.Euler.is_wrapped`

True when this object wraps external data (read-only).

:type: bool

### attribute `mathutils.Euler.order`

Euler rotation order.

:type: Literal['XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX']

### attribute `mathutils.Euler.owner`

The item this is wrapping or None (read-only).

:type: Any

### attribute `mathutils.Euler.x`

Euler axis angle in radians.

:type: float

### attribute `mathutils.Euler.y`

Euler axis angle in radians.

:type: float

### attribute `mathutils.Euler.z`

Euler axis angle in radians.

:type: float

### method `mathutils.Euler.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Euler.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `mathutils.Euler.__hash__`

:rtype: int

### method `mathutils.Euler.__len__`

:rtype: int

### method `mathutils.Euler.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Euler.__repr__`

:rtype: str

### method `mathutils.Euler.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### method `mathutils.Euler.__str__`

:rtype: str

### class `mathutils.Matrix`

This object gives access to Matrices in Blender, supporting square and rectangular
matrices from 2x2 up to 4x4.

:param rows: Sequence of rows.
:type rows: Sequence[Sequence[float]]

### classmethod `mathutils.Matrix.Diagonal`

literalinclude: ./examples/mathutils.Matrix.0.py
Create a diagonal (scaling) matrix using the values from the vector.

:param vector: The vector of values for the diagonal.
:type vector: Sequence[float]
:return: A diagonal matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.Identity`

Create an identity matrix.

:param size: The size of the identity matrix to construct [2, 4].
:type size: int
:return: A new identity matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.LocRotScale`

Create a matrix combining translation, rotation and scale,
acting as the inverse of the decompose() method.

Any of the inputs may be replaced with None if not needed.

:param location: The translation component.
:type location: Sequence[float] | None
:param rotation: The rotation component as a 3x3 matrix, quaternion, euler or None for no rotation.
:type rotation: :class:`Matrix` | :class:`Quaternion` | :class:`Euler` | None
:param scale: The scale component.
:type scale: Sequence[float] | None
:return: Combined transformation as a 4x4 matrix. 
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.OrthoProjection`

literalinclude: ./examples/mathutils.Matrix.LocRotScale.0.py
Create a matrix to represent an orthographic projection.

:param axis: An axis string,
   where a single axis is for a 2D matrix.
   Or a vector for an arbitrary axis
:type axis: Literal['X', 'Y', 'XY', 'XZ', 'YZ'] | Sequence[float]
:param size: The size of the projection matrix to construct [2, 4].
:type size: int
:return: A new projection matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.Rotation`

Create a matrix representing a rotation.

:param angle: The angle of rotation desired, in radians.
:type angle: float
:param size: The size of the rotation matrix to construct [2, 4].
:type size: int
:param axis: Axis of rotation: a single-character string ('X', 'Y' or 'Z')
   or a 3D vector. Required for ``size`` 3 or 4. Must be None (or omitted)
   when ``size`` is 2 - 2D rotation has no axis.
:type axis: Literal['X', 'Y', 'Z'] | Sequence[float] | None
:return: A new rotation matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.Scale`

Create a matrix representing a scaling.

:param factor: The factor of scaling to apply.
:type factor: float
:param size: The size of the scale matrix to construct [2, 4].
:type size: int
:param axis: Direction along which to scale. When None (or omitted),
   ``factor`` is applied uniformly along all axes.
:type axis: Sequence[float] | None
:return: A new scale matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.Shear`

Create a matrix to represent a shear transformation.

:param plane: An axis string,
   where a single axis is for a 2D matrix only.
:type plane: Literal['X', 'Y', 'XY', 'XZ', 'YZ']
:param size: The size of the shear matrix to construct [2, 4].
:type size: int
:param factor: The factor of shear to apply. For a 2 *size* matrix use a single float. For a 3 or 4 *size* matrix pass a pair of floats corresponding with the *plane* axis.
:type factor: float | Sequence[float]
:return: A new shear matrix.
:rtype: :class:`Matrix`

### classmethod `mathutils.Matrix.Translation`

Create a matrix representing a translation.

:param vector: The translation vector.
:type vector: Sequence[float]
:return: An identity matrix with a translation.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.adjugate`

Set the matrix to its adjugate.

:raises ValueError: if the matrix cannot be adjugated.

### method `mathutils.Matrix.adjugated`

seealso: `Adjugate matrix <https://en.wikipedia.org/wiki/Adjugate_matrix>`__ on Wikipedia.
Return an adjugated copy of the matrix.

:return: the adjugated matrix.
:rtype: :class:`Matrix`
:raises ValueError: if the matrix cannot be adjugated

### method `mathutils.Matrix.copy`

Returns a copy of this matrix.

:return: A copy of the matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.decompose`

Return the translation, rotation, and scale components of this 4x4 matrix.

:return: Tuple of translation, rotation, and scale.
:rtype: tuple[:class:`Vector`, :class:`Quaternion`, :class:`Vector`]

### method `mathutils.Matrix.determinant`

Return the determinant of a matrix.

:return: Return the determinant of a matrix.
:rtype: float

### method `mathutils.Matrix.freeze`

seealso: `Determinant <https://en.wikipedia.org/wiki/Determinant>`__ on Wikipedia.
Make this object immutable.

After this the object can be hashed, used in dictionaries & sets.

:return: An instance of this object.
:rtype: Self

### method `mathutils.Matrix.identity`

Set the matrix to the identity matrix.

### method `mathutils.Matrix.invert`

note: An object with a location and rotation of zero, and a scale of one
will have an identity matrix.
seealso: `Identity matrix <https://en.wikipedia.org/wiki/Identity_matrix>`__ on Wikipedia.
Set the matrix to its inverse.

:param fallback: Set the matrix to this value when the inverse cannot be calculated
   (instead of raising a :exc:`ValueError` exception).
:type fallback: :class:`Matrix` | None

### method `mathutils.Matrix.invert_safe`

seealso: `Inverse matrix <https://en.wikipedia.org/wiki/Inverse_matrix>`__ on Wikipedia.
Set the matrix to its inverse, will never error.
If degenerated (e.g. zero scale on an axis), add some epsilon to its diagonal, to get an invertible one.
If tweaked matrix is still degenerated, set to the identity matrix instead.

### method `mathutils.Matrix.inverted`

seealso: `Inverse Matrix <https://en.wikipedia.org/wiki/Inverse_matrix>`__ on Wikipedia.
Return an inverted copy of the matrix.

:param fallback: return this when the inverse can't be calculated
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: The inverted matrix or fallback when given.
:rtype: :class:`Matrix` | Any

### method `mathutils.Matrix.inverted_safe`

Return an inverted copy of the matrix, will never error.
If degenerated (e.g. zero scale on an axis), add some epsilon to its diagonal, to get an invertible one.
If tweaked matrix is still degenerated, return the identity matrix instead.

:return: the inverted matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.lerp`

Returns the interpolation of two matrices. Uses polar decomposition, see "Matrix Animation and Polar Decomposition", Shoemake and Duff, 1992.

:param other: value to interpolate with.
:type other: :class:`Matrix`
:param factor: The interpolation value in [0.0, 1.0].
:type factor: float
:return: The interpolated matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.normalize`

Normalize each of the matrix columns (3x3 and 4x4 only).

### method `mathutils.Matrix.normalized`

note: for 4x4 matrices, the 4th column (translation) is left untouched.
Return a column normalized matrix (3x3 and 4x4 only).

:return: a column normalized matrix
:rtype: :class:`Matrix`

### method `mathutils.Matrix.resize_4x4`

note: for 4x4 matrices, the 4th column (translation) is left untouched.
Resize the matrix to 4x4.

### method `mathutils.Matrix.rotate`

Rotates the matrix by another mathutils value.

### method `mathutils.Matrix.to_2x2`

note: The matrix must be 3x3.
note: If any of the columns are not unit length this may not have desired results.
:param other: rotation component of mathutils value
:type other: :class:`Euler` | :class:`Quaternion` | :class:`Matrix`
Return a 2x2 copy of this matrix.

:return: a new matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.to_3x3`

Return a 3x3 copy of this matrix.

:return: a new matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.to_4x4`

Return a 4x4 copy of this matrix.

:return: a new matrix.
:rtype: :class:`Matrix`

### method `mathutils.Matrix.to_euler`

Return an Euler representation of the rotation matrix
(3x3 or 4x4 matrix only).

:param order: A rotation order string.
:type order: Literal['XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX']
:param euler_compat: Optional euler argument the new euler will be made
   compatible with (no axis flipping between them).
   Useful for converting a series of matrices to animation curves.
:type euler_compat: :class:`Euler` | None
:return: Euler representation of the matrix.
:rtype: :class:`Euler`

### method `mathutils.Matrix.to_quaternion`

Return a quaternion representation of the rotation matrix.

:return: Quaternion representation of the rotation matrix.
:rtype: :class:`Quaternion`

### method `mathutils.Matrix.to_scale`

Return the scale part of a 3x3 or 4x4 matrix.

:return: Return the scale of a matrix.
:rtype: :class:`Vector`

### method `mathutils.Matrix.to_translation`

note: This method does not return a negative scale on any axis because it is not possible to obtain this data from the matrix alone.
Return the translation part of a 4x4 matrix.

:return: Return the translation of a matrix.
:rtype: :class:`Vector`

### method `mathutils.Matrix.transpose`

Set the matrix to its transpose.

### method `mathutils.Matrix.transposed`

seealso: `Transpose <https://en.wikipedia.org/wiki/Transpose>`__ on Wikipedia.
Return a new, transposed matrix.

:return: a transposed matrix
:rtype: :class:`Matrix`

### method `mathutils.Matrix.zero`

Set all the matrix values to zero.

### attribute `mathutils.Matrix.col`

Access the matrix by columns (read-only).

:type: :class:`MatrixAccess`

### attribute `mathutils.Matrix.is_frozen`

True when this object has been frozen (read-only).

:type: bool

### attribute `mathutils.Matrix.is_identity`

True if this is an identity matrix (read-only).

:type: bool

### attribute `mathutils.Matrix.is_negative`

True if this matrix results in a negative scale, 3x3 and 4x4 only, (read-only).

:type: bool

### attribute `mathutils.Matrix.is_orthogonal`

True if this matrix is orthogonal, 3x3 and 4x4 only, (read-only).

:type: bool

### attribute `mathutils.Matrix.is_orthogonal_axis_vectors`

True if this matrix has orthogonal axis vectors, 3x3 and 4x4 only, (read-only).

:type: bool

### attribute `mathutils.Matrix.is_valid`

True when the owner of this data is valid.

:type: bool

### attribute `mathutils.Matrix.is_wrapped`

True when this object wraps external data (read-only).

:type: bool

### attribute `mathutils.Matrix.median_scale`

The average scale applied to each axis (read-only).

:type: float

### attribute `mathutils.Matrix.owner`

The item this is wrapping or None (read-only).

:type: Any

### attribute `mathutils.Matrix.row`

Access the matrix by rows (default), (read-only).

:type: :class:`MatrixAccess`

### attribute `mathutils.Matrix.translation`

The translation component of the matrix.

:type: :class:`Vector`

### method `mathutils.Matrix.__add__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Matrix.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: :class:`Vector`

### method `mathutils.Matrix.__hash__`

:rtype: int

### method `mathutils.Matrix.__imatmul__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__imul__`

:param other: The other operand.
   :type other: :class:`Matrix`
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__imul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__invert__`

:rtype: :class:`Matrix`

### method `mathutils.Matrix.__len__`

:rtype: int

### method `mathutils.Matrix.__matmul__`

:param other: The other operand.
   :type other: :class:`Matrix`
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__matmul__`

:noindex:

   :param other: The other operand.
   :type other: :class:`Vector`
   :rtype: :class:`Vector`

### method `mathutils.Matrix.__mul__`

:param other: The other operand.
   :type other: :class:`Matrix`
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__mul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Matrix.__repr__`

:rtype: str

### method `mathutils.Matrix.__rmul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Matrix`

### method `mathutils.Matrix.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### method `mathutils.Matrix.__str__`

:rtype: str

### method `mathutils.Matrix.__sub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Matrix`

### class `mathutils.MatrixAccess`

An indexable type for accessing matrix rows or columns as :class:`Vector` types.

### method `mathutils.MatrixAccess.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `mathutils.MatrixAccess.__iter__`

:rtype: :class:`MatrixAccess`

### method `mathutils.MatrixAccess.__len__`

:rtype: int

### method `mathutils.MatrixAccess.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### class `mathutils.Quaternion`

This object gives access to Quaternions in Blender.

:param seq: A (w, x, y, z) quaternion, a 3D exponential map vector,
or a 3D axis vector (when *angle* is also provided).
:type seq: Sequence[float]
:param angle: rotation angle, in radians
:type angle: float

The constructor takes arguments in various forms:

(), *no args*
Create an identity quaternion
(*wxyz*)
Create a quaternion from a ``(w, x, y, z)`` vector.
(*exponential_map*)
Create a quaternion from a 3d exponential map vector.

### method `mathutils.Quaternion.conjugate`

seealso: :meth:`to_exponential_map`
(*axis, angle*)
Create a quaternion representing a rotation of *angle* radians over *axis*.
seealso: :meth:`to_axis_angle`
literalinclude: ./examples/mathutils.Quaternion.0.py
Set the quaternion to its conjugate (negate x, y, z).

### method `mathutils.Quaternion.conjugated`

Return a new conjugated quaternion.

:return: a new quaternion.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.copy`

Returns a copy of this quaternion.

:return: A copy of the quaternion.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.cross`

note: use this to get a copy of a wrapped quaternion with
no reference to the original data.
Return the cross product of this quaternion and another.

:param other: The other quaternion to perform the cross product with.
:type other: :class:`Quaternion`
:return: The cross product.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.dot`

Return the dot product of this quaternion and another.

:param other: The other quaternion to perform the dot product with.
:type other: :class:`Quaternion`
:return: The dot product.
:rtype: float

### method `mathutils.Quaternion.freeze`

Make this object immutable.

After this the object can be hashed, used in dictionaries & sets.

:return: An instance of this object.
:rtype: Self

### method `mathutils.Quaternion.identity`

Set the quaternion to an identity quaternion.

### method `mathutils.Quaternion.invert`

Set the quaternion to its inverse.

### method `mathutils.Quaternion.inverted`

Return a new, inverted quaternion.

:return: the inverted value.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.make_compatible`

Make this quaternion compatible with another,
so interpolating between them works as intended.

:param other: The reference quaternion to make this one compatible with.
:type other: :class:`Quaternion`

### method `mathutils.Quaternion.negate`

Set the quaternion to its negative.

### method `mathutils.Quaternion.normalize`

Normalize the quaternion.

### method `mathutils.Quaternion.normalized`

Return a new normalized quaternion.

:return: a normalized copy.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.rotate`

Rotates the quaternion by another mathutils value.

:param other: rotation component of mathutils value
:type other: :class:`Euler` | :class:`Quaternion` | :class:`Matrix`

### method `mathutils.Quaternion.rotation_difference`

Returns a quaternion representing the rotational difference.

:param other: second quaternion.
:type other: :class:`Quaternion`
:return: the rotational difference between the two quat rotations.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.slerp`

Returns the interpolation of two quaternions.

:param other: value to interpolate with.
:type other: :class:`Quaternion`
:param factor: The interpolation value in [0.0, 1.0].
:type factor: float
:return: The interpolated rotation.
:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.to_axis_angle`

Return the axis, angle representation of the quaternion.

:return: Axis, angle.
:rtype: tuple[:class:`Vector`, float]

### method `mathutils.Quaternion.to_euler`

Return Euler representation of the quaternion.

:param order: Rotation order.
:type order: Literal['XYZ', 'XZY', 'YXZ', 'YZX', 'ZXY', 'ZYX']
:param euler_compat: Optional euler argument the new euler will be made
   compatible with (no axis flipping between them).
   Useful for converting a series of quaternions to animation curves.
:type euler_compat: :class:`Euler` | None
:return: Euler representation of the quaternion.
:rtype: :class:`Euler`

### method `mathutils.Quaternion.to_exponential_map`

Return the exponential map representation of the quaternion.

This representation consists of the rotation axis multiplied by the rotation angle.
Such a representation is useful for interpolation between multiple orientations.

:return: 3D exponential map.
:rtype: :class:`Vector`

To convert back to a quaternion, pass it to the :class:`Quaternion` constructor.

### method `mathutils.Quaternion.to_matrix`

Return a matrix representation of the quaternion.

:return: A 3x3 rotation matrix representation of the quaternion.
:rtype: :class:`Matrix`

### method `mathutils.Quaternion.to_swing_twist`

Split the rotation into a swing quaternion with the specified
axis fixed at zero, and the remaining twist rotation angle.

:param axis: Twist axis as a string.
:type axis: Literal['X', 'Y', 'Z']
:return: Swing, twist angle.
:rtype: tuple[:class:`Quaternion`, float]

### attribute `mathutils.Quaternion.angle`

Angle of the quaternion.

:type: float

### attribute `mathutils.Quaternion.axis`

Quaternion axis as a vector.

:type: :class:`Vector`

### attribute `mathutils.Quaternion.is_frozen`

True when this object has been frozen (read-only).

:type: bool

### attribute `mathutils.Quaternion.is_valid`

True when the owner of this data is valid.

:type: bool

### attribute `mathutils.Quaternion.is_wrapped`

True when this object wraps external data (read-only).

:type: bool

### attribute `mathutils.Quaternion.magnitude`

Size of the quaternion (read-only).

:type: float

### attribute `mathutils.Quaternion.owner`

The item this is wrapping or None (read-only).

:type: Any

### attribute `mathutils.Quaternion.w`

Quaternion component value.

:type: float

### attribute `mathutils.Quaternion.x`

Quaternion component value.

:type: float

### attribute `mathutils.Quaternion.y`

Quaternion component value.

:type: float

### attribute `mathutils.Quaternion.z`

Quaternion component value.

:type: float

### method `mathutils.Quaternion.__add__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Quaternion.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `mathutils.Quaternion.__hash__`

:rtype: int

### method `mathutils.Quaternion.__imatmul__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__imul__`

:param other: The other operand.
   :type other: :class:`Quaternion`
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__imul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__len__`

:rtype: int

### method `mathutils.Quaternion.__matmul__`

:param other: The other operand.
   :type other: :class:`Quaternion`
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__matmul__`

:noindex:

   :param other: The other operand.
   :type other: :class:`Vector`
   :rtype: :class:`Vector`

### method `mathutils.Quaternion.__mul__`

:param other: The other operand.
   :type other: :class:`Quaternion`
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__mul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Quaternion.__neg__`

:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__pos__`

:rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__repr__`

:rtype: str

### method `mathutils.Quaternion.__rmul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Quaternion`

### method `mathutils.Quaternion.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### method `mathutils.Quaternion.__str__`

:rtype: str

### method `mathutils.Quaternion.__sub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Quaternion`

### class `mathutils.Vector`

This object gives access to Vectors in Blender.

:param seq: Components of the vector, must be a sequence of at least two.
:type seq: Sequence[float]

### classmethod `mathutils.Vector.Fill`

literalinclude: ./examples/mathutils.Vector.0.py
Create a vector of length size with all values set to fill.

:param size: The length of the vector to be created.
:type size: int
:param fill: The value used to fill the vector.
:type fill: float
:return: A new vector.
:rtype: :class:`Vector`

### classmethod `mathutils.Vector.Linspace`

Create a vector of the specified size which is filled with linearly spaced values between start and stop values.

:param start: The start of the range used to fill the vector.
:type start: float
:param stop: The end of the range used to fill the vector.
:type stop: float
:param size: The size of the vector to be created.
:type size: int
:return: A new vector.
:rtype: :class:`Vector`

### classmethod `mathutils.Vector.Range`

Create a vector filled with a range of values.

This method can also be called with a single argument, in which case the argument is interpreted as ``stop`` and ``start`` defaults to 0.

:param start: The start of the range used to fill the vector.
:type start: int
:param stop: The end of the range used to fill the vector.
:type stop: int
:param step: The step between successive values in the vector.
:type step: int
:return: A new vector.
:rtype: :class:`Vector`

### classmethod `mathutils.Vector.Repeat`

Create a vector by repeating the values in vector until the required size is reached.

:param vector: The vector to draw values from.
:type vector: :class:`Vector`
:param size: The size of the vector to be created.
:type size: int
:return: A new vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.angle`

Return the angle between two vectors.

### method `mathutils.Vector.angle_signed`

note: For 4D vectors, only the x, y, z components are used.
:param other: another vector to compare the angle with
:type other: :class:`Vector`
:param fallback: return this when the angle can't be calculated (zero length vector),
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: angle in radians or fallback when given
:rtype: float | Any
Return the signed angle between two 2D vectors (clockwise is positive).

:param other: another vector to compare the angle with
:type other: :class:`Vector`
:param fallback: return this when the angle can't be calculated (zero length vector),
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: angle in radians or fallback when given
:rtype: float | Any

### method `mathutils.Vector.copy`

Returns a copy of this vector.

:return: A copy of the vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.cross`

note: use this to get a copy of a wrapped vector with
no reference to the original data.
Return the cross product of this vector and another.

:param other: The other vector to perform the cross product with.
:type other: :class:`Vector`
:return: The cross product as a vector or a float when 2D vectors are used.
:rtype: :class:`Vector` | float

### method `mathutils.Vector.dot`

note: both vectors must be 2D or 3D
Return the dot product of this vector and another.

:param other: The other vector to perform the dot product with.
:type other: :class:`Vector`
:return: The dot product.
:rtype: float

### method `mathutils.Vector.freeze`

Make this object immutable.

After this the object can be hashed, used in dictionaries & sets.

:return: An instance of this object.
:rtype: Self

### method `mathutils.Vector.lerp`

Returns the interpolation of two vectors.

:param other: value to interpolate with.
:type other: :class:`Vector`
:param factor: The interpolation value in [0.0, 1.0].
:type factor: float
:return: The interpolated vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.negate`

Set all values to their negative.

### method `mathutils.Vector.normalize`

Normalize the vector, making the length of the vector always 1.0.

### method `mathutils.Vector.normalized`

warning: Normalizing a vector where all values are zero has no effect.
note: For 4D vectors, only the x, y, z components are normalized;
the w component is left untouched.
   The resulting 4D vector may not have unit length.
Return a new, normalized vector.

### method `mathutils.Vector.orthogonal`

note: For 4D vectors, only the x, y, z components are normalized;
the w component is left untouched.
   The resulting 4D vector may not have unit length.

:return: a normalized copy of the vector
:rtype: :class:`Vector`
Return a perpendicular vector.

:return: a new vector 90 degrees from this vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.project`

note: the axis is undefined, only use when any orthogonal vector is acceptable.
Return the projection of this vector onto the *other*.

:param other: second vector.
:type other: :class:`Vector`
:return: the parallel projection vector
:rtype: :class:`Vector`

### method `mathutils.Vector.reflect`

Return the reflection vector from the *mirror* argument.

:param mirror: This vector could be a normal from the reflecting surface.
:type mirror: :class:`Vector`
:return: The reflected vector matching the size of this vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.resize`

Resize the vector to have size number of elements.

:param size: The new size of the vector.
:type size: int

### method `mathutils.Vector.resize_2d`

Resize the vector to 2D (x, y).

### method `mathutils.Vector.resize_3d`

Resize the vector to 3D (x, y, z).

### method `mathutils.Vector.resize_4d`

Resize the vector to 4D (x, y, z, w).

### method `mathutils.Vector.resized`

Return a resized copy of the vector with size number of elements.

:param size: The new size of the vector.
:type size: int
:return: A new vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.rotate`

Rotate the vector by a rotation value.

### method `mathutils.Vector.rotation_difference`

note: 2D vectors are a special case that can only be rotated by a 2x2 matrix.
:param other: rotation component of mathutils value
:type other: :class:`Euler` | :class:`Quaternion` | :class:`Matrix`
Returns a quaternion representing the rotational difference between this
vector and another.

:param other: second vector.
:type other: :class:`Vector`
:return: the rotational difference between the two vectors.
:rtype: :class:`Quaternion`

### method `mathutils.Vector.slerp`

note: 2D vectors raise an :exc:`AttributeError`.
Returns the interpolation of two non-zero vectors (spherical coordinates).

:param other: value to interpolate with.
:type other: :class:`Vector`
:param factor: The interpolation value typically in [0.0, 1.0].
:type factor: float
:param fallback: return this when the vector can't be calculated (zero length vector or direct opposites),
   (instead of raising a :exc:`ValueError`).
:type fallback: Any
:return: The interpolated vector.
:rtype: :class:`Vector`

### method `mathutils.Vector.to_2d`

Return a 2d copy of the vector.

:return: a new vector
:rtype: :class:`Vector`

### method `mathutils.Vector.to_3d`

Return a 3d copy of the vector.

:return: a new vector
:rtype: :class:`Vector`

### method `mathutils.Vector.to_4d`

Return a 4d copy of the vector.

:return: a new vector
:rtype: :class:`Vector`

### method `mathutils.Vector.to_track_quat`

Return a quaternion rotation from the vector and the track and up axis.

:param track: Track axis string.
:type track: Literal['X', 'Y', 'Z', '-X', '-Y', '-Z']
:param up: Up axis string.
:type up: Literal['X', 'Y', 'Z']
:return: rotation from the vector and the track and up axis.
:rtype: :class:`Quaternion`

### method `mathutils.Vector.to_tuple`

Return this vector as a tuple with a given precision.

:param precision: The number to round the value to in [-1, 21].
:type precision: int
:return: the values of the vector rounded by *precision*
:rtype: tuple[float, ...]

### method `mathutils.Vector.zero`

Set all values to zero.

### attribute `mathutils.Vector.is_frozen`

True when this object has been frozen (read-only).

:type: bool

### attribute `mathutils.Vector.is_valid`

True when the owner of this data is valid.

:type: bool

### attribute `mathutils.Vector.is_wrapped`

True when this object wraps external data (read-only).

:type: bool

### attribute `mathutils.Vector.length`

Vector Length.

:type: float

### attribute `mathutils.Vector.length_squared`

Vector length squared (v.dot(v)).

:type: float

### attribute `mathutils.Vector.magnitude`

Vector Length.

:type: float

### attribute `mathutils.Vector.owner`

The item this is wrapping or None (read-only).

:type: Any

### attribute `mathutils.Vector.w`

Vector W axis (4D Vectors only).

:type: float

### attribute `mathutils.Vector.ww`

:type: :class:`Vector`

### attribute `mathutils.Vector.www`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwww`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wwzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxww`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wxzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyww`

:type: :class:`Vector`

### attribute `mathutils.Vector.wywx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wywy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wywz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wyzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzww`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.wzzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.x`

Vector X axis.

:type: float

### attribute `mathutils.Vector.xw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xww`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwww`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xwzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxww`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xxzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyww`

:type: :class:`Vector`

### attribute `mathutils.Vector.xywx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xywy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xywz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xyzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzww`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.xzzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.y`

Vector Y axis.

:type: float

### attribute `mathutils.Vector.yw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yww`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywww`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywx`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywy`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywz`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.ywzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxww`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yxzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyww`

:type: :class:`Vector`

### attribute `mathutils.Vector.yywx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yywy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yywz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yyzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzww`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.yzzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.z`

Vector Z axis (3D Vectors only).

:type: float

### attribute `mathutils.Vector.zw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zww`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwww`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zwzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxww`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zxzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyww`

:type: :class:`Vector`

### attribute `mathutils.Vector.zywx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zywy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zywz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zyzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzww`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzwx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzwy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzwz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzxw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzxx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzxy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzxz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzyw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzyx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzyy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzyz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzz`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzzw`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzzx`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzzy`

:type: :class:`Vector`

### attribute `mathutils.Vector.zzzz`

:type: :class:`Vector`

### method `mathutils.Vector.__add__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Vector`

### method `mathutils.Vector.__eq__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Vector.__ge__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `mathutils.Vector.__getitem__`

:param key: Index or key.
   :type key: int
   :rtype: float

### method `mathutils.Vector.__gt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `mathutils.Vector.__hash__`

:rtype: int

### method `mathutils.Vector.__iadd__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Vector`

### method `mathutils.Vector.__imul__`

:param other: The other operand.
   :type other: :class:`Vector`
   :rtype: :class:`Vector`

### method `mathutils.Vector.__imul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Vector`

### method `mathutils.Vector.__isub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Vector`

### method `mathutils.Vector.__itruediv__`

:param other: Scalar divisor.
   :type other: float
   :rtype: :class:`Vector`

### method `mathutils.Vector.__le__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `mathutils.Vector.__len__`

:rtype: int

### method `mathutils.Vector.__lt__`

:param other: The other operand.
   :type other: Self
   :rtype: bool

### method `mathutils.Vector.__matmul__`

:param other: The other operand.
   :type other: :class:`Vector`
   :rtype: float

### method `mathutils.Vector.__matmul__`

:noindex:

   :param other: The other operand.
   :type other: :class:`Matrix`
   :rtype: :class:`Vector`

### method `mathutils.Vector.__mul__`

:param other: The other operand.
   :type other: :class:`Vector`
   :rtype: :class:`Vector`

### method `mathutils.Vector.__mul__`

:noindex:

   :param other: The other operand.
   :type other: float
   :rtype: :class:`Vector`

### method `mathutils.Vector.__ne__`

:param other: The other operand.
   :type other: object
   :rtype: bool

### method `mathutils.Vector.__neg__`

:rtype: :class:`Vector`

### method `mathutils.Vector.__pos__`

:rtype: :class:`Vector`

### method `mathutils.Vector.__repr__`

:rtype: str

### method `mathutils.Vector.__rmul__`

:param other: Scalar.
   :type other: float
   :rtype: :class:`Vector`

### method `mathutils.Vector.__setitem__`

:param key: Index or key.
   :type key: int
   :param value: Value to assign.
   :type value: object

### method `mathutils.Vector.__str__`

:rtype: str

### method `mathutils.Vector.__sub__`

:param other: The other operand.
   :type other: Self
   :rtype: :class:`Vector`

### method `mathutils.Vector.__truediv__`

:param other: Scalar divisor.
   :type other: float
   :rtype: :class:`Vector`
