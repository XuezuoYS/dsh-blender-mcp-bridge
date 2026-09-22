<!-- source: manual/modeling/geometry_nodes/geometry/operations/get_geometry_components.rst -->

.. _bpy.types.GeometryNodeGetGeometryComponent:

****************************

figure: /images/node-types_GeometryNodeGetGeometryComponent.webp
The *Get Geometry Components* node extracts a single component from the input geometry.

It can be used to isolate one geometry type, modify it, and merge it back without
splitting and handling all other component types.

Geometry
The input geometry.

Type
The type of geometry component to extract.

Remove
Remove the extracted component from the geometry output.

Geometry
The extracted geometry component.
If the selected component does not exist, an empty geometry is output.

Components
The input geometry with the extracted component removed when *Remove* is enabled.
Otherwise, this is the unchanged input geometry.

Exists
Whether the input geometry contains the selected component.
This only checks whether the component exists, not whether it contains any elements.
