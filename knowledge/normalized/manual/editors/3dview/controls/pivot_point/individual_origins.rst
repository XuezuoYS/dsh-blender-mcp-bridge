<!-- source: manual/editors/3dview/controls/pivot_point/individual_origins.rst -->

******************

:Mode:      Object Mode and Edit Mode
:Location:  :menuselection:`Header --> Transform Pivot Point --> Individual Origins` (:bl-icon:`pivot_individual`)
:Shortcut:  :kbd:`Period`
While the other pivot point modes transform the whole selection around one point,
Individual Origins transforms each item around itself.

Each object gets transformed around its :doc:`origin </scene_layout/object/origin>`,
which is a point that can be chosen freely and doesn't have to be in the center.
In the example below, the orange rectangle has it in a corner instead.

figure: /images/editors_3dview_controls_pivot-point_individual-origins_rotation-around-center.png
The images below compare Individual Origins to :doc:`/editors/3dview/controls/pivot_point/median_point`.

figure: /images/editors_3dview_controls_pivot-point_individual-origins_objects-rotate.png
figure: /images/editors_3dview_controls_pivot-point_individual-origins_objects-scale.png

Each selected element is transformed around its own centerpoint.

figure: /images/editors_3dview_controls_pivot-point_individual-origins_rotation-faces.png
figure: /images/editors_3dview_controls_pivot-point_individual-origins_scale-individual-faces.png
When you transform adjacent faces or edges, they are treated as a single element
(meaning they don't become disconnected).
