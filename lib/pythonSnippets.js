/**
 * Read-only Python snippets shared by tools and offline probes.
 *
 * Keeping them out of `lib/tools.js` lets the syntax probe load them without
 * importing the DSH tool SDK (which is not installed in a bare tarball).
 *
 * The scene query for `blender_mcp_inspect` is generated per call and lives in
 * {@link module:lib/inspect}; the fixed object-name and performance queries
 * stay here.
 *
 * @module lib/pythonSnippets
 */

/** Bounded object-name query used to report added/removed objects. */
export const OBJECT_NAMES_CODE = `import bpy
result = {
    'names': [obj.name for obj in bpy.data.objects][:500],
    'total': len(bpy.data.objects),
}
`

/**
 * Read-only performance facts for the session handshake.
 *
 * Defines `_dsh_performance()` and writes nothing: every read is wrapped in
 * `try/except`, so a disabled Cycles add-on, background mode or an older
 * Blender cannot break the handshake. `get_devices()` is deliberately not
 * called — it rebuilds the device collection and can disturb the user's
 * selection; the names listed here are whatever Blender already enumerated.
 */
export const PERFORMANCE_CODE = `
def _dsh_performance():
    def _text(value):
        try:
            return str(value)
        except Exception:
            return ''

    def _int(value):
        try:
            return int(value)
        except Exception:
            return 0

    def _num(value):
        try:
            return round(float(value), 4)
        except Exception:
            return 0.0

    def _bool(value):
        try:
            return bool(value)
        except Exception:
            return False

    def _cycles():
        try:
            cycles = scene.cycles
        except Exception:
            return None
        entry = {
            'deviceType': '',
            'deviceCount': 0,
            'devices': [],
            'devicesTruncated': False,
            'samples': _int(getattr(cycles, 'samples', 0)),
            'previewSamples': _int(getattr(cycles, 'preview_samples', 0)),
            'adaptiveSampling': _bool(getattr(cycles, 'use_adaptive_sampling', False)),
            'adaptiveThreshold': _num(getattr(cycles, 'adaptive_threshold', 0.0)),
            'denoising': _bool(getattr(cycles, 'use_denoising', False)),
            'denoiser': _text(getattr(cycles, 'denoiser', '')),
        }
        try:
            cycles_prefs = bpy.context.preferences.addons.get('cycles').preferences
        except Exception:
            return entry
        entry['deviceType'] = _text(getattr(cycles_prefs, 'compute_device_type', ''))
        try:
            devices = list(cycles_prefs.devices)
        except Exception:
            devices = []
        entry['deviceCount'] = len(devices)
        for device in devices[:8]:
            entry['devices'].append({
                'name': _text(getattr(device, 'name', '')),
                'type': _text(getattr(device, 'type', '')),
                'use': _bool(getattr(device, 'use', False)),
            })
        entry['devicesTruncated'] = len(devices) > 8
        return entry

    def _eevee():
        try:
            eevee = scene.eevee
        except Exception:
            return None
        return {
            'renderSamples': _int(getattr(eevee, 'taa_render_samples', 0)),
            'viewportSamples': _int(getattr(eevee, 'taa_samples', 0)),
        }

    def _color_management():
        try:
            views = scene.view_settings
            return {
                'displayDevice': _text(scene.display_settings.display_device),
                'viewTransform': _text(views.view_transform),
                'look': _text(views.look),
                'exposure': _num(views.exposure),
                'gamma': _num(views.gamma),
            }
        except Exception:
            return None

    def _threads():
        try:
            return {'mode': _text(scene.render.threads_mode), 'count': _int(scene.render.threads)}
        except Exception:
            return {'mode': '', 'count': 0}

    try:
        engine = _text(scene.render.engine)
    except Exception:
        engine = ''
    return {
        'engine': engine,
        'threads': _threads(),
        'colorManagement': _color_management(),
        'cycles': _cycles(),
        'eevee': _eevee(),
    }
`
