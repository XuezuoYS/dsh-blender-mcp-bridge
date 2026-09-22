<!-- source: manual/contribute/manual/guides/markup_guide.rst -->

******************

.. Editor's Note:
::
There are many detailed conventions, e.g:
::
- When definition lists/bullet-points are used.
- Word-ordering in filenames.
- How text is wrapped.
- The number of spaces between lines.
- When it is/is not okay to add in Unicode characters.
- Should comments on a page be above or below titles :)
::
Having a lot of detailed text on this page is off-putting to new contributors,
so please avoid making this page into a wall-of-text,
many conventions can be noticed along the way by reading existing text.

This page covers conventions for writing Blender's documentation using reStructuredText (RST) markup syntax.
Following these conventions ensures clarity, consistency, and ease of maintenance.

- Use a three-space indentation.
- Limit line length to 120 characters.
- Use italics for button and menu names.
- Avoid using Unicode characters unless strictly necessary.
- Prefer simple sentence structures for clarity.
- Avoid heavily wrapped text (shorter paragraphs and clear sentences are recommended).

Use the following hierarchy for headings:

```
#################
Document Part
#################

****************
Document Chapter
****************

Document Section
================

Document Subsection
-------------------

Document Subsubsection
^^^^^^^^^^^^^^^^^^^^^^

Document Paragraph
""""""""""""""""""
```
note: 
- Each ``.rst`` file should only have one chapter heading (``*``).
- *Parts* should only be used on contents or index pages.

Common text styles used throughout the documentation:

```
*italic text*
**bold text**
``literal text`` (e.g., filenames, Python code snippets)
```

Standard markup for interface elements:

- ``:kbd:`LMB``` -- keyboard and mouse shortcuts.
- ``*Mirror*`` -- interface labels (buttons, panels, etc.).
- ``:menuselection:`3D Viewport --> Add --> Mesh --> Monkey``` -- navigation paths through menus.

Lists are used to clearly present sequential or grouped items:

Bullet List

```
- First item
- Second item
- Third item
```
Numbered List:

```
#. First step
#. Second step
#. Third step
```
Definition List:

```
Term
Definition text here.
```

- ``|BLENDER_VERSION|``:
Inserts the current Blender version number automatically. e.g. "4.5".
- ``|BLENDER_VERSION_LABEL|``:
Inserts the current Blender version label automatically. e.g. "4.5 LTS".
- ``:abbr:`SSAO (Screen Space Ambient Occlusion)```:
Abbreviation displays the full text on hover.
- ``:term:`Manifold```:
Links to the corresponding entry in the :doc:`Glossary </glossary/index>`.
- ``:bl-icon:`icon_name```:
Include Blender icons as inline text, see the full list at :doc:`/contribute/manual/guides/icons`.

:hidden:

icons.rst

Internal document links:

```
:doc:`Link Title </section/path/to/file>`
```
Link to a specific section using explicit labels:

```
.. _my-section-label:

Section Title
=============

Reference this section later with :ref:`Optional Title <my-section-label>`
```
Implicit references within the same document:

```
Section Title
=============

Reference it implicitly later using `Section Title`_
```
External website links:

```
`Blender's Official Website <https://www.blender.org>`__
```

To link Blender UI properties and operators directly to manual entries:

#. Right-click the property/operator in Blender and select *Online Python Reference*
to get the RNA tag (shown in the OS console).
#. In the documentation, use an external reference matching Blender's RNA tag:

```
.. _bpy.types.FluidDomainSettings.use_fractions:

Fractional Obstacles
Enables finer resolution in fluid/obstacle regions.
```
For operators:

```
.. _bpy.ops.curve.subdivide:

Subdivide
=========
```
Blender uses these tags to link UI elements directly to documentation entries via the "Online Manual" option.

Admonitions are special blocks used to highlight important notes, warnings,
or additional information in the documentation.

Common admonition types include:

- ``note``
- ``tip``
- ``important``
- ``warning``
- ``caution``
- ``seealso``

Admonitions are created using the following markup:

```

```
note: 
This is a note for general information.
Other types can be rendered by replacing ``note`` with the desired type from the list above.

Use the figure directive for embedding images with captions:

```

```
figure: /images/interface_splash_current.webp

To ensure consistency across screenshots:

#. Use Blender's default theme and settings.
#. Zoom to the maximum level (:kbd:`Ctrl-MMB` or :kbd:`NumpadPlus`).
#. Zoom out exactly eight steps (:kbd:`NumpadMinus`, pressed eight times).
#. Leave around a 30-pixel margin around the content, if applicable.

Follow these guidelines for naming image files:

- Use lowercase letters, no spaces, underscores between sections, and dashes within multi-word sections.
- Place images only in the ``manual/images`` directory (no subfolders).

Examples:

- ``interface_splash_current.png``
- ``modeling_meshes_edit-mode.png``

- ``.png``: For interface screenshots or solid-color images.
- ``.jpg``: For photographic images or renders with high color variation.
- Avoid ``.gif``; use embedded videos for animations instead.

Embed videos hosted on Blender's PeerTube at `video.blender.org <https://video.blender.org/>`__.

```

```
The ``ID`` is extracted from the video URL, e.g.:

``https://video.blender.org/videos/watch/47448bc1-0cc0-4bd1-b6c8-9115d8f7e08c``
The ID is: ``47448bc1-0cc0-4bd1-b6c8-9115d8f7e08c``.

- Prefer videos without spoken or textual explanations for easier translation.
- Do not rely solely on videos to explain features. The manual text itself should clearly document the process.

Code snippets should use syntax highlighting and optional line numbering:

```

```
```
:linenos:

import bpy

def example_function():
    print("Hello Blender")
```

For content that needs future updates or completion:

Visible to readers:

```

```
[unparsed directive: todo] Complete this section when feature is finalized.

Internal notes (not visible to readers):

```
.. Internal developer reminder goes here
```

- `Sphinx RST Primer <https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html>`__:
Introduction to RST syntax.
- `Docutils reStructuredText Reference <https://docutils.sourceforge.io/rst.html>`__:
Comprehensive documentation on RST markup.
