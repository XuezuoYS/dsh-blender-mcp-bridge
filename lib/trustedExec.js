/**
 * Prelude for trusted internal execs (snapshot, capture, render, helper).
 *
 * A hard crash can leave the L2 guard installed in the Blender process. The
 * trusted channel does not install the guard itself, so it first removes any
 * leftovers from the carrier module: otherwise a stale `bpy.ops` proxy would
 * block the plugin's own `save_as_mainfile(copy=True)`.
 *
 * @module lib/trustedExec
 */

/** Python prelude that uninstalls a leftover guard, if any. */
export const TRUSTED_CLEANUP = `import sys as _dsh_sys
_dsh_state = _dsh_sys.modules.get('dsh_blender_mcp_guard')
if _dsh_state is not None:
    for _owner, _name, _original in reversed(getattr(_dsh_state, 'hooks', [])):
        try:
            setattr(_owner, _name, _original)
        except Exception:
            pass
    _dsh_state.hooks = []
    if getattr(_dsh_state, 'ops_original', None) is not None:
        try:
            import bpy as _dsh_bpy
            _dsh_bpy.ops = _dsh_state.ops_original
        except Exception:
            pass
        _dsh_state.ops_original = None
        _dsh_state.ops_proxy = None
    _dsh_state.installed_root = None
`
