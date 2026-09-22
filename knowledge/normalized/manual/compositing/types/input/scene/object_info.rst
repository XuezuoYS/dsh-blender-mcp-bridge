<!-- source: manual/compositing/types/input/scene/object_info.rst -->

****************

figure: /images/node-types_GeometryNodeObjectInfo-compositor.webp
The *Object Info* node outputs transformation information from an object in the scene.
This can be used to drive compositor effects using the position, rotation, or scale
of objects without manually entering values.

An *Object Info* node can be added quickly by dragging an object into the node editor.

Object
Object to get the properties from.

Transform
:term:`Transformation Matrix` containing the location, rotation and scale of the object.
Location
Location of the object in world space.
Rotation
Rotation of the object in world space.
Scale
Scale of the object in world space.
