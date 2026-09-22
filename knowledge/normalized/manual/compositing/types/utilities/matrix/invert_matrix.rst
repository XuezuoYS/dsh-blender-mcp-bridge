<!-- source: manual/compositing/types/utilities/matrix/invert_matrix.rst -->

.. _bpy.types.FunctionNodeInvertMatrix:
.. --- copy below this line ---

******************

figure: /images/node-types_FunctionNodeInvertMatrix.webp
Returns the `inverse <https://mathworld.wolfram.com/MatrixInverse.html>`__ of the given matrix.

Matrix
The matrix to invert.

Matrix
The inverted matrix.
Invertible
Returns whether the matrix could be inverted.
This can be false when a transformation matrix has a scale of zero, for example.
See `Invertible matrix <https://en.wikipedia.org/wiki/Invertible_matrix>`__ for more information.

important: 
When a matrix is not invertible, the `identity matrix <https://en.wikipedia.org/wiki/Identity_matrix>`__
is returned.

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
