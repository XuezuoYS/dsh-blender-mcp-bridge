<!-- source: api/bpy_extras.asset_utils.rst -->

Helpers for asset management tasks.

### class `bpy_extras.asset_utils.AssetBrowserPanel`

Mixin class for panels that should only show in the asset browser.

### classmethod `bpy_extras.asset_utils.AssetBrowserPanel.asset_browser_panel_poll`

Check if the panel should be shown in the asset browser.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: True when the panel should be visible.
:rtype: bool

### classmethod `bpy_extras.asset_utils.AssetBrowserPanel.poll`

Poll for asset browser visibility.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: True when the panel should be visible.
:rtype: bool

### class `bpy_extras.asset_utils.AssetMetaDataPanel`

Mixin class for panels that display asset metadata in the asset browser.

### classmethod `bpy_extras.asset_utils.AssetMetaDataPanel.poll`

Poll for asset browser with active asset metadata.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: True when the asset browser has active asset data.
:rtype: bool

### class `bpy_extras.asset_utils.SpaceAssetInfo`

Utility class for checking if a space is an asset browser.

### classmethod `bpy_extras.asset_utils.SpaceAssetInfo.is_asset_browser`

Check if the given space is an asset browser.

:param space_data: The space to check.
:type space_data: :class:`bpy.types.Space`
:return: True when the space is an asset browser.
:rtype: bool

### classmethod `bpy_extras.asset_utils.SpaceAssetInfo.is_asset_browser_poll`

Poll whether the active space is an asset browser.

:param context: The context.
:type context: :class:`bpy.types.Context`
:return: True when the active space is an asset browser.
:rtype: bool
