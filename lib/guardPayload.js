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
    _D.noted = []
    _D.installs = 0
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

def _dsh_record(target, action, kind='write'):
    if len(_D.blocked) < 50:
        _D.blocked.append({'target': str(target), 'action': action, 'kind': kind})

class DshWriteBlocked(PermissionError):
    def __init__(self, target, action='write'):
        PermissionError.__init__(self, 'dsh-blender guard: blocked %s outside the task directory: %s' % (action, target))
        self.target = str(target)
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
])

_RENDER_OPS = frozenset(['render.render', 'render.opengl', 'render.play_rendered_anim'])
_WRITE_PREFIXES = ('export_scene.',)

def _dsh_wrap_open(original):
    def hook(file, mode='r', *args, **kwargs):
        if isinstance(file, int):
            return original(file, mode, *args, **kwargs)
        if not isinstance(mode, str):
            mode = 'r'
        writing = any(flag in mode for flag in ('w', 'a', 'x', '+'))
        if _dsh_thread_ok() and writing and not _dsh_inside(file):
            _dsh_record(file, 'open', 'write')
            raise DshWriteBlocked(file, 'write')
        return original(file, mode, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_os_open(original):
    write_flags = os.O_WRONLY | os.O_RDWR | os.O_CREAT | os.O_APPEND | os.O_TRUNC
    def hook(path, flags, *args, **kwargs):
        if _dsh_thread_ok() and (flags & write_flags) and not _dsh_inside(path):
            _dsh_record(path, 'os.open', 'write')
            raise DshWriteBlocked(path, 'write')
        return original(path, flags, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_single(original, action):
    def hook(target, *args, **kwargs):
        if _dsh_thread_ok() and not _dsh_inside(target):
            _dsh_record(target, action, 'write')
            raise DshWriteBlocked(target, action)
        return original(target, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_delete(original, action):
    def hook(target, *args, **kwargs):
        if _dsh_thread_ok() and not _dsh_inside(target):
            _dsh_record(target, action, 'delete')
            raise DshWriteBlocked(target, action)
        return original(target, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_pair(original, action):
    def hook(src, dst, *args, **kwargs):
        if _dsh_thread_ok():
            for target in (src, dst):
                if not _dsh_inside(target):
                    _dsh_record(target, action, 'move')
                    raise DshWriteBlocked(target, action)
        return original(src, dst, *args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_multi(original, action):
    def hook(*args, **kwargs):
        if _dsh_thread_ok():
            for value in args:
                if isinstance(value, (str, bytes, os.PathLike)) and not _dsh_inside(value):
                    _dsh_record(value, action, 'write')
                    raise DshWriteBlocked(value, action)
        return original(*args, **kwargs)
    hook.__dsh_guard__ = True
    return hook

def _dsh_wrap_path_method(original, action):
    def hook(self, *args, **kwargs):
        try:
            target = os.fspath(self)
        except TypeError:
            target = str(self)
        if _dsh_thread_ok() and not _dsh_inside(target):
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
        if _dsh_thread_ok() and writing and not _dsh_inside(target):
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
            if target is not None and not _dsh_inside(target):
                _dsh_record(target, qualified, 'write')
                raise DshWriteBlocked(target, qualified)
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
        if qualified in _RENDER_OPS or qualified.startswith(_WRITE_PREFIXES):
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

def _dsh_uninstall():
    for owner, name, original in reversed(_D.hooks):
        try:
            setattr(owner, name, original)
        except Exception:
            pass
    _D.hooks = []
    if _D.ops_original is not None:
        try:
            bpy.ops = _D.ops_original
        except Exception:
            pass
        _D.ops_original = None
        _D.ops_proxy = None
    _D.installed_root = None

def _dsh_install(root):
    _dsh_uninstall()
    _D.installed_root = _dsh_norm(root)
    _D.blocked = []
    _D.noted = []
    _D.installs += 1

    original_open = builtins.open
    open_hook = _dsh_wrap_open(original_open)
    builtins.open = open_hook
    io.open = open_hook
    _D.hooks.append((builtins, 'open', original_open))
    _D.hooks.append((io, 'open', original_open))

    def add(owner, name, factory, action):
        original = getattr(owner, name)
        setattr(owner, name, factory(original, action))
        _D.hooks.append((owner, name, original))

    add(os, 'open', lambda original, _action: _dsh_wrap_os_open(original), 'open')
    for name, action in (('remove', 'delete'), ('unlink', 'delete'), ('rmdir', 'delete')):
        add(os, name, _dsh_wrap_delete, action)
    add(os, 'truncate', _dsh_wrap_single, 'truncate')
    add(os, 'mkdir', _dsh_wrap_single, 'mkdir')
    add(os, 'rename', _dsh_wrap_pair, 'rename')
    add(os, 'replace', _dsh_wrap_pair, 'replace')

    for name in ('copy', 'copy2', 'copyfile'):
        add(shutil, name, _dsh_wrap_multi, 'copy')
    add(shutil, 'move', _dsh_wrap_multi, 'move')
    add(shutil, 'rmtree', _dsh_wrap_multi, 'delete')

    for name in ('write_text', 'write_bytes', 'unlink', 'rename', 'replace', 'mkdir'):
        if hasattr(pathlib.Path, name):
            add(pathlib.Path, name, _dsh_wrap_path_method, 'pathlib.' + name)
    if hasattr(pathlib.Path, 'open'):
        add(pathlib.Path, 'open', lambda original, _action: _dsh_wrap_path_open(original), 'pathlib.open')

    try:
        original_write = bpy.data.libraries.write
        bpy.data.libraries.write = _dsh_wrap_single(original_write, 'libraries.write')
        _D.hooks.append((bpy.data.libraries, 'write', original_write))
    except Exception:
        pass

    try:
        _D.ops_original = bpy.ops
        _D.ops_proxy = _dsh_make_ops_proxy(_D.ops_original)
        bpy.ops = _D.ops_proxy
    except Exception:
        _D.ops_original = None
        _D.ops_proxy = None

def _dsh_verify():
    hooks_intact = True
    for owner, name, _original in _D.hooks:
        current = getattr(owner, name, None)
        if not getattr(current, '__dsh_guard__', False):
            hooks_intact = False
    ops_intact = _D.ops_proxy is not None and bpy.ops is _D.ops_proxy
    if ops_intact:
        try:
            leaked = any(hasattr(bpy.ops, name) for name in ('_dsh_real', '_op_create_function'))
            leaked = leaked or hasattr(bpy.ops.wm, '_dsh_real') or hasattr(bpy.ops.wm, '_dsh_proxy')
            ops_intact = not leaked
        except Exception:
            ops_intact = False
    return {
        'verified': hooks_intact,
        'hooksIntact': hooks_intact,
        'opsIntact': ops_intact,
        'installs': _D.installs,
        'window': _GUARD_WINDOW,
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
  if (guardEnabled) {
    lines.push(
      '_dsh_install_error = None',
      'try:',
      '    _dsh_install(' + rootLiteral + ')',
      'except Exception as _dsh_install_exc:',
      '    _dsh_install_error = \'{}: {}\'.format(type(_dsh_install_exc).__name__, _dsh_install_exc)',
    )
  } else {
    lines.push('_dsh_install_error = None', '_dsh_uninstall()')
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
    '',
    '_dsh_result = _dsh_ns.get(\'result\', {})',
    'if not isinstance(_dsh_result, dict):',
    '    _dsh_result = {\'value\': repr(_dsh_result)}',
    '',
    '_dsh_guard = {',
    '    \'enabled\': ' + (guardEnabled ? 'True' : 'False') + ',',
    '    \'threadScope\': ' + JSON.stringify(threadScope) + ',',
  )
  if (guardEnabled) {
    lines.push(
      '    \'verified\': False,',
      '    \'hooksIntact\': False,',
      '    \'opsIntact\': False,',
      '    \'blocked\': [],',
      '    \'noted\': [],',
      '    \'window\': _GUARD_WINDOW,',
      '}',
      'if _dsh_install_error is not None:',
      '    _dsh_guard[\'installError\'] = _dsh_install_error',
      '_dsh_verify_result = _dsh_verify()',
      '_dsh_guard.update(_dsh_verify_result)',
      '_dsh_guard[\'blocked\'] = list(_D.blocked)',
      '_dsh_guard[\'noted\'] = list(_D.noted)',
      '_dsh_uninstall()',
    )
  } else {
    lines.push(
      '    \'verified\': False,',
      '    \'hooksIntact\': False,',
      '    \'opsIntact\': False,',
      '    \'blocked\': [],',
      '    \'noted\': [],',
      '    \'window\': _GUARD_WINDOW,',
      '}',
      '_dsh_uninstall()',
    )
  }
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
