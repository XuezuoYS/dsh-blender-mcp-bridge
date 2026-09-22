<!-- source: manual/scene_layout/collections/introduction.rst -->

************

In Blender, objects are not directly part of the scenes.
Instead, they all get stored in a main database (basically the blend-file).

figure: /images/scene-layout_collections_introduction_database-preview.png
From there they are referenced into as many Scenes as you would like to see them.

When they are stored in a scene, they are part of a so-called *scene collection*.
So ultimately all the scene objects belong to this special collection.

figure: /images/scene-layout_collections_introduction_scene-collection.png

While the *scene collection* contains all the Scene's objects,
the user can also make their own collections to better organize these objects.

It works like a Venn diagram, where all the objects are part of the *scene collection*,
but can also be part of multiple collections.

figure: /images/scene-layout_collections_introduction_venn-diagram.png
The result is a clear and flexible way to arrange objects together on the Scene level.

figure: /images/scene-layout_collections_introduction_scene-organization.png

Collections can be named and sorted hierarchically.
Just like folders can have subfolders in any operating system,
collections can have nested collections too.

figure: /images/scene-layout_collections_introduction_collections-nested.png
For example: a *house* collection can contain a *bedroom* collection,
which in turn contains a *furniture* collection referencing a bed, a cabinet and other objects.

.. _scene_layout-collections-color-tagging:

Collections can have a color group assigned to them; helping organize
and group different collections. This color tag is displayed as part of
the collection icon in the :doc:`Outliner </editors/outliner/index>`
and various other menus. The available colors are defined by
Blender's interface :doc:`Theme </editors/preferences/themes>`.

To assign a color to a collection,
use the :ref:`Set Color Tag <bpy.ops.outliner.collection_color_tag_set>` tool in the Outliner.
