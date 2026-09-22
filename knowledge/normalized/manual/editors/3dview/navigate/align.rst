<!-- source: manual/editors/3dview/navigate/align.rst -->

**********

These options allow you to align and orient the viewport relative to objects,
the scene, or the camera.

:Menu:      :menuselection:`View --> Align View --> Align View to Active`
Aligns the view to a local axis of the active object, bone, or
(in Edit Mode) the normal of the active face. The view is also
switched to orthographic mode.

This can be useful when inspecting geometry relative to an object's
local orientation.

To return to a regular perspective view, press :kbd:`Numpad3`
to align to the global X axis and then orbit the view with :kbd:`MMB`.

.. _bpy.ops.view3d.camera_to_view:

:Menu:      :menuselection:`View --> Align View --> Align Active Camera to View`
:Shortcut:  :kbd:`Ctrl-Alt-Numpad0`
Moves and rotates the active camera so that it matches the current
viewport position and orientation.

This is commonly used after framing a composition in the viewport
to place the camera at that exact viewpoint.

.. _bpy.ops.view3d.camera_to_view_selected:

:Menu:      :menuselection:`View --> Align View --> Align Active Camera to Selected`
Moves the active camera without changing its orientation so that
the selected objects are centered in the camera frame.

.. _cursor-center-and-frame:

:Menu:      :menuselection:`View --> Align View --> Center Cursor and Frame All`
:Shortcut:  :kbd:`Shift-C`
Moves the :doc:`3D Cursor </editors/3dview/3d_cursor>` to the world
origin and adjusts the view to frame the entire scene.

.. _bpy.ops.view3d.view_center_cursor:

:Menu:      :menuselection:`View --> Align View --> Center View to Cursor`
Centers the viewport on the :doc:`3D Cursor </editors/3dview/3d_cursor>`.

.. _bpy.ops.view3d.view_lock_to_active:

:Menu:      :menuselection:`View --> Align View --> View Lock to Active`
Centers the view on the active object and sets it as the point of interest.

The viewport will continue orbiting around this object even when panning
to another location. If the object moves, the view will follow it.

.. _bpy.ops.view3d.view_lock_clear:

:Menu:      :menuselection:`View --> Align View --> View Lock Clear`
Removes the active view lock and returns the viewport to normal navigation.
