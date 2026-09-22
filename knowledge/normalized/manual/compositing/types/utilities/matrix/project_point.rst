<!-- source: manual/compositing/types/utilities/matrix/project_point.rst -->

.. _bpy.types.FunctionNodeProjectPoint:
.. --- copy below this line ---

******************

figure: /images/node-types_FunctionNodeProjectPoint.webp
Applies a projection matrix to a point. Specifically, this node turns the given
Euclidean vector (X, Y, Z) into the homogeneous vector (X, Y, Z, 1),
multiplies the given projection matrix by it,
and turns the resulting homogeneous vector back into a Euclidean one by dividing
it by the absolute value of its W component. This last step is also known as
perspective division.

Vector
The position vector to project.
Transformation
The projection matrix.

Vector
The projected position vector.

.. DO NOT EDIT FILE. This is simply a stub which copies everything from the link below.

:start-after: .. --- copy below this line ---
