<!-- source: api/bpy.path.rst -->

This module has a similar scope to os.path, containing utility
functions for dealing with paths in Blender.

### function `bpy.path.abspath`

Returns the absolute path relative to the current blend file
using the "//" prefix.

:param path: The path to convert to absolute.
:type path: str | bytes
:param start: Relative to this path,
when not set the current filename is used.
:type start: str | bytes | None
:param library: The library this path is from. This is only included for
convenience, when the library is not None its path replaces *start*.
:type library: :class:`bpy.types.Library` | None
:return: The absolute path.
:rtype: str

### function `bpy.path.basename`

Equivalent to ``os.path.basename``, but skips a "//" prefix.

Use for Windows compatibility.

:param path: The path to get the base name of.
:type path: str | bytes
:return: The base name of the given path.
:rtype: str

### function `bpy.path.clean_name`

Returns a name with characters replaced that
may cause problems under various circumstances,
such as writing to a file.

All characters besides A-Z/a-z, 0-9 are replaced with "_"
or the *replace* argument if defined.

:param name: The path name.
:type name: str | bytes
:param replace: The replacement for non-valid characters.
:type replace: str
:return: The cleaned name.
:rtype: str

### function `bpy.path.display_name`

Creates a display string from name to be used in menus and the user interface.
Intended for use with filenames and module names.

:param name: The name to be used for displaying the user interface.
:type name: str
:param has_ext: Remove file extension from name.
:type has_ext: bool
:param title_case: Convert lowercase names to title case.
:type title_case: bool
:return: The display string.
:rtype: str

### function `bpy.path.display_name_to_filepath`

Performs the reverse of display_name using literal versions of characters
which aren't supported in a filepath.

:param name: The display name to convert.
:type name: str
:return: The file path.
:rtype: str

### function `bpy.path.display_name_from_filepath`

Returns the path stripped of directory and extension,
ensured to be UTF-8 compatible.

:param name: The file path to convert.
:type name: str
:return: The display name.
:rtype: str

### function `bpy.path.ensure_ext`

Return the path with the extension added if it is not already set.

:param filepath: The file path.
:type filepath: str
:param ext: The extension to check for, can be a compound extension. Should
       start with a dot, such as ``.blend`` or ``.tar.gz``.
:type ext: str
:param case_sensitive: Check for matching case when comparing extensions.
:type case_sensitive: bool
:return: The file path with the given extension.
:rtype: str

### function `bpy.path.is_subdir`

Returns true if *path* is in a subdirectory of *directory*.
Both paths must be absolute.

:param path: An absolute path.
:type path: str | bytes
:param directory: The parent directory to check against.
:type directory: str | bytes
:return: Whether or not the path is a subdirectory.
:rtype: bool

### function `bpy.path.module_names`

Return a list of modules which can be imported from *path*.

:param path: a directory to scan.
:type path: str
:param recursive: Also return submodule names for packages.
:type recursive: bool
:param package: Optional string, used as the prefix for module names (without the trailing ".").
:type package: str
:return: a list of string pairs (module_name, module_file).
:rtype: list[tuple[str, str]]

### function `bpy.path.native_pathsep`

Replace the path separator with the system's native ``os.sep``.

:param path: The path to replace.
:type path: str
:return: The path with system native separators.
:rtype: str

### function `bpy.path.reduce_dirs`

Given a sequence of directories, remove duplicates and
any directories nested in one of the other paths.
(Useful for recursive path searching).

:param dirs: Sequence of directory paths.
:type dirs: Sequence[str]
:return: A unique list of paths.
:rtype: list[str]

### function `bpy.path.relpath`

Returns the path relative to the current blend file using the "//" prefix.

:param path: An absolute path.
:type path: str | bytes
:param start: Relative to this path,
when not set the current filename is used.
:type start: str | bytes | None
:return: The relative path.
:rtype: str

### function `bpy.path.resolve_ncase`

Resolve a case insensitive path on a case sensitive system,
returning a string with the path if found else return the original path.

:param path: The path name to resolve.
:type path: str
:return: The resolved path.
:rtype: str
