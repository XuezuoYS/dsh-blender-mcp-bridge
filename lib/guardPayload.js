/**
 * L2 runtime guard, generated as self-contained Python and sent with every
 * `exec` request.
 *
 * It installs file write/delete hooks and a module-level `bpy.ops` proxy for
 * the duration of one exec, records every refusal, verifies the hooks are
 * still ours at the end, then uninstalls everything. It is a mistake guard,
 * not a sandbox: dynamic construction, `ctypes` and background threads can
 * still get around it.
 *
 * @module lib/guardPayload
 */

/** Python prelude shared by every generated guard. */
const PRELUDE = `import bpy
import builtins
import io
import os
import pathlib
import shutil
import sys
import tempfile
import threading
import traceback
import types

_D = sys.modules.get('dsh_blender_mcp_guard')
if _D is None:
    _D = types.ModuleType('dsh_blender_mcp_guard')
    _D.installed_root = None
    _D.hooks = []
    _D.ops_original = None
    _D.ops_proxy = None
    _D.blocked = []
    _D.blocked_total = 0
    _D.noted = []
    _D.installs = 0
    _D.temp_roots = set()
    _D.pref_snapshot = {}
    _D.pref_changes = []
    sys.modules['dsh_blender_mcp_guard'] = _D

_GUARD_WINDOW = 'exec (Blender main thread, synchronous)'
_MAIN_THREAD = threading.main_thread()
_THREAD_SCOPE = 'main'

def _dsh_thread_ok():
    if _THREAD_SCOPE == 'all':
        return True
    return threading.current_thread() is _MAIN_THREAD

def _dsh_norm(value):
    try:
        return os.path.normcase(os.path.realpath(os.path.abspath(os.fspath(value))))
    except Exception:
        return os.path.normcase(os.path.abspath(str(value)))

def _dsh_inside(value):
    if _D.installed_root is None:
        return False
    target = _dsh_norm(value)
    root = _D.installed_root
    return target == root or target.startswith(root + os.sep) or target.startswith(root + '/')

def _dsh_temp_ok(value):
    if not _D.temp_roots:
        return False
    target = _dsh_norm(value)
    for root in _D.temp_roots:
        if target == root or target.startswith(root + os.sep) or target.startswith(root + '/'):
            return True
    return False

def _dsh_writable(value):
    return _dsh_inside(value) or _dsh_temp_ok(value)

def _dsh_resolved(value):
    try:
        return os.path.abspath(os.fspath(value))
    except Exception:
        return str(value)

def _dsh_record(target, action, kind='write'):
    _D.blocked_total = getattr(_D, 'blocked_total', 0) + 1
    if len(_D.blocked) < 50:
        _D.blocked.append({'target': str(target), 'resolved': _dsh_resolved(target), 'action': action, 'kind': kind})

_PREF_PATHS = (
    ('edit', 'undo_steps'),
    ('edit', 'undo_memory_limit'),
    ('edit', 'use_global_undo'),
    ('filepaths', 'use_auto_save_temporary_files'),
    ('filepaths', 'auto_save_time'),
    ('filepaths', 'save_version'),
)

def _dsh_pref_snapshot():
    values = {}
    try:
        prefs = bpy.context.preferences
    except Exception:
        return values
    for path in _PREF_PATHS:
        try:
            obj = prefs
            for attr in path[:-1]:
                obj = getattr(obj, attr)
            values['.'.join(path)] = getattr(obj, path[-1])
        except Exception:
            pass
    return values

def _dsh_pref_restore(snapshot):
    changed = []
    if not snapshot:
        return changed
    try:
        prefs = bpy.context.preferences
    except Exception:
        return changed
    for dotted, value in snapshot.items():
        path = dotted.split('.')
        try:
            obj = prefs
            for attr in path[:-1]:
                obj = getattr(obj, attr)
            if getattr(obj, path[-1]) != value:
                setattr(obj, path[-1], value)
                changed.append(dotted)
        except Exception:
            pass
    return changed

class DshWriteBlocked(PermissionError):
    def __init__(self, target, action='write'):
        root = _D.installed_root or '<unknown task directory>'
        PermissionError.__init__(
            self,
            'dsh-blender guard: blocked %s outside the task directory: %s (resolved: %s; write under: %s)'
            % (action, target, _dsh_resolved(target), root),
        )
        self.target = str(target)
        self.resolved = _dsh_resolved(target)
        self.action = action

class DshOperatorBlocked(PermissionError):
    def __init__(self, operator):
        PermissionError.__init__(self, 'dsh-blender guard: blocked operator: %s' % operator)
        self.operator = operator

_BLOCKED_OPS = frozenset([
    'wm.save_mainfile',
    'wm.save_as_mainfile',
    'wm.save_homefile',
    'wm.save_userpref',
    'wm.open_mainfile',
    'wm.read_homefile',
    'wm.read_factory_settings',
    'wm.read_factory_userpref',
    'wm.read_userpref',
    'wm.quit_blender',
    'wm.preferences',
    # Undo history is the user's recovery path; only the plugin may push.
    'ed.undo',
    'ed.redo',
    'ed.undo_push',
    # File-writing data operators that have no task-dir path argument.
    'image.save',
    'image.save_all_modified',
    'image.save_modified',
    'image.save_sequence',
    'image.unpack',
    'sound.save',
    'sound.unpack',
    'text.save',
])

_RENDER_OPS = frozenset(['render.render', 'render.opengl', 'render.play_rendered_anim'])
# Operators that take their output path as a filepath kwarg; the wrapper checks it.
_PATH_OPS = frozenset(['image.save_as', 'screen.screenshot', 'text.save_as', 'sound.save_as'])
_WRITE_PREFIXES = ('export_scene.',)

def _dsh_wrap_open(original):
    def hook(file, mode='r', *args, **kwargs):
        if isinstance(file, int):
            return original(file, mode, *args, **kwargs)
        if not isinstance(mode, str):
            mode = 'r'
        writing = any(flag in mode for flag in ('w', 'a', 'x', '+'))
        if _dsh_thread_ok() and writing and not _dsh_writable(file):
            _dsh_record(file, 'open', 'write')
            raise DshWriteBlocked(file, 'write')
        return original(file, mode, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_os_open(original):
    write_flags = os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_APPEND | os.O_TRUNC
    def hook(path, flags, *args, **kwargs):
        if _dsh_thread_ok() and (flags & write_flags) and not _dsh_writable(path):
            _dsh_record(path, 'os.open', 'write')
            raise DshWriteBlocked(path, 'write')
        return original(path, flags, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_single(original, action):
    def hook(target, *args, **kwargs):
        if _dsh_thread_ok() and not _dsh_writable(target):
            _dsh_record(target, action, 'write')
            raise DshWriteBlocked(target, action)
        return original(target, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_delete(original, action):
    def hook(target, *args, **kwargs):
        if _dsh_thread_ok() and not _dsh_writable(target):
            _dsh_record(target, action, 'delete')
            raise DshWriteBlocked(target, action)
        return original(target, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_pair(original, action):
    def hook(src, dst, *args, **kwargs):
        if _dsh_thread_ok():
            for target in (src, dst):
                if not _dsh_writable(target):
                    _dsh_record(target, action, 'move')
                    raise DshWriteBlocked(target, action)
        return original(src, dst, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_multi(original, action):
    def hook(*args, **kwargs):
        if _dsh_thread_ok():
            for value in args:
                if isinstance(value, (str, bytes, os.PathLike)) and not _dsh_writable(value):
                    _dsh_record(value, action, 'write')
                    raise DshWriteBlocked(value, action)
        return original(*args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_copy(original, action):
    def hook(src, dst, *args, **kwargs):
        if _dsh_thread_ok() and not _dsh_writable(dst):
            _dsh_record(dst, action, 'write')
            raise DshWriteBlocked(dst, action)
        return original(src, dst, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_fileio(original):
    class _DshFileIO(original):
        def __init__(self, file, mode='r', *args, **kwargs):
            if not isinstance(file, int):
                if not isinstance(mode, str):
                    mode = 'r'
                writing = any(flag in mode for flag in ('w', 'a', 'x', '+'))
                if _dsh_thread_ok() and writing and not _dsh_writable(file):
                    _dsh_record(file, 'io.FileIO', 'write')
                    raise DshWriteBlocked(file, 'io.FileIO')
            original.__init__(self, file, mode, *args, **kwargs)
    _DshFileIO.__dsh_guard__ = True
    return _DshFileIO

def _dsh_wrap_path_method(original, action):
    def hook(self, *args, **kwargs):
        try:
            target = os.fspath(self)
        except TypeError:
            target = str(self)
        if _dsh_thread_ok() and not _dsh_writable(target):
            _dsh_record(target, action, 'write')
            raise DshWriteBlocked(target, action)
        return original(self, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_path_open(original):
    def hook(self, mode='r', *args, **kwargs):
        if not isinstance(mode, str):
            mode = 'r'
        writing = any(flag in mode for flag in ('w', 'a', 'x', '+'))
        target = os.fspath(self)
        if _dsh_thread_ok() and writing and not _dsh_writable(target):
            _dsh_record(target, 'pathlib.open', 'write')
            raise DshWriteBlocked(target, 'pathlib.open')
        return original(self, mode, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_make_ops_proxy(real_ops):
    # real_ops lives in this closure only: no public attribute (including
    # bpy.ops._dsh_real) may lead back to the unguarded module.
    _module_proxies = {}

    def _dsh_wrap_output(qualified, operator):
        def checked(*args, **kwargs):
            target = kwargs.get('filepath')
            if target is None and qualified in _RENDER_OPS:
                try:
                    target = bpy.context.scene.render.filepath
                except Exception:
                    target = None
            if qualified in _PATH_OPS and target is None:
                _dsh_record('<missing filepath>', qualified, 'write')
                raise DshWriteBlocked('<missing filepath>', qualified)
            if qualified in _RENDER_OPS and kwargs.get('write_still') is not True:
                # A probe render that does not write a file must not be refused
                # because the scene still points at an old render path. Both
                # render.render and render.opengl default write_still to False.
                target = None
            if target is not None and not _dsh_inside(target):
                _dsh_record(target, qualified, 'write')
                raise DshWriteBlocked(target, qualified)
            directory = kwargs.get('directory')
            if directory is not None and not _dsh_inside(directory):
                _dsh_record(directory, qualified, 'write')
                raise DshWriteBlocked(directory, qualified)
            return operator(*args, **kwargs)
        checked.__dsh_guard__ = True
        return checked

    def _dsh_get(module_name, func_name):
        qualified = module_name + '.' + func_name
        if qualified in _BLOCKED_OPS:
            _D.noted.append(qualified)
            _dsh_record(qualified, 'operator', 'operator')
            raise DshOperatorBlocked(qualified)
        create = getattr(real_ops, '_op_create_function', None)
        if callable(create):
            operator = create(module_name, func_name)
        else:
            operator = getattr(getattr(real_ops, module_name), func_name)
        if qualified in _RENDER_OPS or qualified in _PATH_OPS or qualified.startswith(_WRITE_PREFIXES):
            return _dsh_wrap_output(qualified, operator)
        return operator

    def _module_proxy(module_name):
        proxy = _module_proxies.get(module_name)
        if proxy is not None:
            return proxy

        class _OpsModuleProxy:
            __slots__ = ()
            def __getattr__(self, item):
                if item.startswith('_'):
                    raise AttributeError(item)
                return _dsh_get(module_name, item)
            def __setattr__(self, item, value):
                raise AttributeError('bpy.ops is read-only under the live-session guard')

        proxy = _OpsModuleProxy()
        _module_proxies[module_name] = proxy
        return proxy

    class _OpsProxy:
        __slots__ = ()
        def __getattr__(self, item):
            if item.startswith('_'):
                raise AttributeError(item)
            return _module_proxy(item)
        def __setattr__(self, item, value):
            raise AttributeError('bpy.ops is read-only under the live-session guard')

    return _OpsProxy()

def _dsh_uninstall(handle=None):
    hooks = _D.hooks
    real_ops = _D.ops_original
    if handle is not None:
        hooks = handle[0]
        real_ops = handle[2]
    for owner, name, original in reversed(hooks):
        try:
            setattr(owner, name, original)
        except Exception:
            pass
    _D.hooks = []
    if real_ops is not None:
        try:
            bpy.ops = real_ops
        except Exception:
            pass
    _D.ops_original = None
    _D.ops_proxy = None
    _D.installed_root = None

def _dsh_install(root):
    _dsh_uninstall()
    _D.installed_root = _dsh_norm(root)
    _D.blocked = []
    _D.blocked_total = 0
    _D.noted = []
    _D.pref_changes = []
    _D.pref_snapshot = _dsh_pref_snapshot()
    _D.installs += 1
    _D.temp_roots = set()
    for candidate in (tempfile.gettempdir(), os.environ.get('TEMP'), os.environ.get('TMP')):
        if candidate:
            try:
                _D.temp_roots.add(_dsh_norm(candidate))
            except Exception:
                pass

    hooks = []
    checks = []
    _D.hooks = hooks

    def add(owner, name, factory, action):
        original = getattr(owner, name)
        hook = factory(original, action)
        setattr(owner, name, hook)
        hooks.append((owner, name, original))
        checks.append((owner, name, hook))

    original_open = builtins.open
    open_hook = _dsh_wrap_open(original_open)
    builtins.open = open_hook
    io.open = open_hook
    hooks.append((builtins, 'open', original_open))
    checks.append((builtins, 'open', open_hook))
    hooks.append((io, 'open', original_open))
    checks.append((io, 'open', open_hook))

    if hasattr(io, 'FileIO'):
        original_fileio = io.FileIO
        fileio_hook = _dsh_wrap_fileio(original_fileio)
        io.FileIO = fileio_hook
        hooks.append((io, 'FileIO', original_fileio))
        checks.append((io, 'FileIO', fileio_hook))

    add(os, 'open', lambda original, _action: _dsh_wrap_os_open(original), 'open')
    for name, action in (('remove', 'delete'), ('unlink', 'delete'), ('rmdir', 'delete')):
        add(os, name, _dsh_wrap_delete, action)
    add(os, 'truncate', _dsh_wrap_single, 'truncate')
    add(os, 'mkdir', _dsh_wrap_single, 'mkdir')
    add(os, 'rename', _dsh_wrap_pair, 'rename')
    add(os, 'replace', _dsh_wrap_pair, 'replace')

    for name in ('copy', 'copy2', 'copyfile'):
        add(shutil, name, _dsh_wrap_copy, 'copy')
    add(shutil, 'move', _dsh_wrap_multi, 'move')
    add(shutil, 'rmtree', _dsh_wrap_multi, 'delete')
    for name, action in (('link', 'link'), ('symlink', 'symlink')):
        if hasattr(os, name):
            add(os, name, _dsh_wrap_pair, action)

    for name in ('write_text', 'write_bytes', 'unlink', 'rename', 'replace', 'mkdir'):
        if hasattr(pathlib.Path, name):
            add(pathlib.Path, name, _dsh_wrap_path_method, 'pathlib.' + name)
    if hasattr(pathlib.Path, 'open'):
        add(pathlib.Path, 'open', lambda original, _action: _dsh_wrap_path_open(original), 'pathlib.open')

    try:
        original_write = bpy.data.libraries.write
        hook = _dsh_wrap_single(original_write, 'libraries.write')
        bpy.data.libraries.write = hook
        hooks.append((bpy.data.libraries, 'write', original_write))
        checks.append((bpy.data.libraries, 'write', hook))
    except Exception:
        pass

    real_ops = None
    try:
        real_ops = bpy.ops
        _D.ops_original = real_ops
        _D.ops_proxy = _dsh_make_ops_proxy(real_ops)
        bpy.ops = _D.ops_proxy
    except Exception:
        _D.ops_original = None
        _D.ops_proxy = None
        real_ops = None
    return (list(hooks), list(checks), real_ops)

def _dsh_verify(handle=None):
    hooks_intact = True
    if handle is not None:
        for owner, name, hook in handle[1]:
            if getattr(owner, name, None) is not hook:
                hooks_intact = False
    else:
        if len(_D.hooks) == 0:
            hooks_intact = False
        for owner, name, _original in _D.hooks:
            current = getattr(owner, name, None)
            if not getattr(current, '__dsh_guard__', False):
                hooks_intact = False
    try:
        ops_intact = _D.ops_proxy is not None and bpy.ops is _D.ops_proxy
    except Exception:
        ops_intact = False
    if ops_intact:
        try:
            leaked = any(hasattr(bpy.ops, name) for name in ('_dsh_real', '_op_create_function'))
            leaked = leaked or hasattr(bpy.ops.wm, '_dsh_real') or hasattr(bpy.ops.wm, '_dsh_proxy')
            ops_intact = not leaked
        except Exception:
            ops_intact = False
    return {
        'verified': hooks_intact and ops_intact,
        'hooksIntact': hooks_intact,
        'opsIntact': ops_intact,
        'installs': _D.installs,
        'window': _GUARD_WINDOW,
        'preferencesChanged': list(_D.pref_changes),
    }
`

/**
 * Generate the guarded exec payload.
 *
 * @default guardEnabled = true, threadScope = 'main'
 * @param {string} userCode - Python supplied by the model
 * @param {object} options - payload options
 * @param {string} options.taskRoot - absolute task directory
 * @param {string} options.undoMessage - message stored in the undo step
 * @param {boolean} [options.guardEnabled] - install the L2 guard
 * @param {'main'|'all'} [options.threadScope] - threads that are checked
 * @returns {string} complete Python payload
 */
export function wrapWithGuard(userCode, options) {
  const guardEnabled = options.guardEnabled !== false
  const threadScope = options.threadScope === 'all' ? 'all' : 'main'
  const codeLiteral = JSON.stringify(userCode)
  const rootLiteral = JSON.stringify(options.taskRoot)
  const messageLiteral = JSON.stringify(options.undoMessage)

  const lines = [PRELUDE]
  lines.push('_dsh_handle = None', '_dsh_install_error = None')
  if (guardEnabled) {
    lines.push(
      'try:',
      '    _dsh_handle = _dsh_install(' + rootLiteral + ')',
      'except Exception as _dsh_install_exc:',
      '    _dsh_install_error = \'{}: {}\'.format(type(_dsh_install_exc).__name__, _dsh_install_exc)',
      '    try:',
      '        _dsh_uninstall()',
      '    except Exception:',
      '        pass',
    )
  } else {
    lines.push('_dsh_uninstall()', '_D.pref_changes = []')
  }
  lines.push(
    '_dsh_status = \'ok\'',
    '_dsh_error = None',
    '_dsh_trace = None',
    '_dsh_ns = {\'bpy\': bpy, \'result\': {}}',
    'try:',
    '    exec(compile(' + codeLiteral + ', \'<dsh-user-code>\', \'exec\'), _dsh_ns)',
    'except BaseException as _dsh_exc:',
    '    _dsh_status = \'error\'',
    '    _dsh_error = \'{}: {}\'.format(type(_dsh_exc).__name__, _dsh_exc)',
    '    _dsh_trace = traceback.format_exc()',
    "finally:",
    "    _dsh_verify_result = None",
    "    if " + (guardEnabled ? 'True' : 'False') + ":",
    "        try:",
    "            _dsh_pref_changed = _dsh_pref_restore(_D.pref_snapshot)",
    "            _D.pref_changes = list(_dsh_pref_changed)",
    "            for _dsh_name in _dsh_pref_changed:",
    "                _dsh_record(_dsh_name, 'preferences', 'preferences')",
    "        except BaseException:",
    "            _D.pref_changes = []",
    "        try:",
    "            _dsh_verify_result = _dsh_verify(_dsh_handle)",
    "        except BaseException as _dsh_verify_exc:",
    "            _dsh_verify_result = {'verified': False, 'hooksIntact': False, 'opsIntact': False, 'verifyError': '{}: {}'.format(type(_dsh_verify_exc).__name__, _dsh_verify_exc)}",
    "        try:",
    "            _dsh_uninstall(_dsh_handle)",
    "        except BaseException:",
    "            pass",
    "    else:",
    "        try:",
    "            _dsh_uninstall()",
    "        except BaseException:",
    "            pass",
    "        _dsh_verify_result = {'verified': False, 'hooksIntact': False, 'opsIntact': False}",
    '',
    '_dsh_result = _dsh_ns.get(\'result\', {})',
    'if not isinstance(_dsh_result, dict):',
    '    _dsh_result = {\'value\': repr(_dsh_result)}',
    '',
    '_dsh_guard = {',
    '    \'enabled\': ' + (guardEnabled ? 'True' : 'False') + ',',
    '    \'threadScope\': ' + JSON.stringify(threadScope) + ',',
  )
  lines.push(
    "    'verified': False,",
    "    'hooksIntact': False,",
    "    'opsIntact': False,",
    "    'blocked': [],",
    "    'noted': [],",
    "    'preferencesChanged': [],",
    "    'window': _GUARD_WINDOW,",
    "}",
    "if _dsh_install_error is not None:",
    "    _dsh_guard['installError'] = _dsh_install_error",
    "if _dsh_verify_result is not None:",
    "    _dsh_guard.update(_dsh_verify_result)",
    "_dsh_guard['blocked'] = list(_D.blocked)",
    "_dsh_guard['blockedTotal'] = int(getattr(_D, 'blocked_total', len(_D.blocked)))",
    "_dsh_guard['noted'] = list(_D.noted)",
    "_dsh_guard['preferencesChanged'] = list(_D.pref_changes)",
  )
  lines.push(
    '',
    '_dsh_undo = {\'pushed\': False, \'message\': ' + messageLiteral + '}',
    'try:',
    '    bpy.ops.ed.undo_push(message=' + messageLiteral + ')',
    '    _dsh_undo[\'pushed\'] = True',
    'except Exception as _dsh_undo_exc:',
    '    _dsh_undo[\'error\'] = str(_dsh_undo_exc)',
    '',
    'result = {',
    '    \'status\': _dsh_status,',
    '    \'result\': _dsh_result,',
    '    \'undo\': _dsh_undo,',
    '    \'guard\': _dsh_guard,',
    '    \'warnings\': [],',
    '}',
    'if _dsh_error is not None:',
    '    result[\'error\'] = {\'message\': _dsh_error, \'traceback\': _dsh_trace}',
    '',
  )
  return lines.join('\n')
}