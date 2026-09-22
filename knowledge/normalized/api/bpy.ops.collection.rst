<!-- source: api/bpy.ops.collection.rst -->

### function `bpy.ops.collection.create`

Create an object collection from selected objects

:param name: Name, Name of the new collection (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.export_all`

Invoke all configured exporters on this collection

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.exporter_add`

Add exporter to the exporter list

:param name: Name, FileHandler idname (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.exporter_export`

Invoke the export operation

:param index: Index, Exporter index (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.exporter_move`

Move exporter up or down in the exporter list

:param direction: Direction, Direction to move the active exporter (optional)
:type direction: Literal['UP', 'DOWN']
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.exporter_remove`

Remove exporter from the exporter list

:param index: Index, Exporter index (in [0, inf], optional)
:type index: int
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.importer_add`

Add Importer

:param name: Name, FileHandler idname (optional, never None)
:type name: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.importer_remove`

Remove Importer

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.objects_add_active`

Add selected objects to one of the collections the active-object is part of. Optionally add to "All Collections" to ensure selected objects are included in the same collections as the active object

:param collection: Collection, The collection to add other selected objects to (optional)
:type collection: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.objects_remove`

Remove selected objects from a collection

:param collection: Collection, The collection to remove this object from (optional)
:type collection: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.objects_remove_active`

Remove the object from an object collection that contains the active object

:param collection: Collection, The collection to remove other selected objects from (optional)
:type collection: str
:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]

### function `bpy.ops.collection.objects_remove_all`

Remove selected objects from all collections

:return: Result of the operator call.
:rtype: set[Literal[:ref:`rna_enum_operator_return_items`]]
