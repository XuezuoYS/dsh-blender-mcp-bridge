<!-- source: manual/modeling/geometry_nodes/input/scene/collection_children.rst -->

.. _bpy.types.GeometryNodeCollectionChildren:

************************

figure: /images/node-types_GeometryNodeCollectionChildren.webp
The *Collection Children* node returns the child collections and objects
contained within a collection.

Collection
The collection to query.

Recursive
Include collections and objects contained in nested child collections.

When disabled, only the direct children of the input collection are returned.

Collections
A list of child collections contained in the input collection.

When *Recursive* is enabled, all descendant collections are included.

Objects
A list of objects contained in the input collection.

When *Recursive* is enabled, objects from all descendant collections are
included.
