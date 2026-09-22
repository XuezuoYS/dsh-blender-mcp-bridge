// SPDX-License-Identifier: GPL-3.0-or-later
// L2 运行时护栏：生成随每次 exec 一起发送的自包含 Python 载荷。
//
// 载体放在 `sys.modules['dsh_blender_mcp_bridge.guardState']`——它是一个 `str -> module` 的 dict，
// 非 str 键会跳过模块级 `__getattr__`，因此**不触发 bpy 的数据块查找**（../docs/contract.md#guard）。
//
// 三条硬约束（违反第一条的后果是每个请求都失败，见 ../docs/contract.md#guard-ops-proxy）：
//   1. 算子拦截必须用 `bpy.ops` 模块级代理，**禁止**包装 `_op_create_function`；
//   2. 代理必须**读写透传** `_op_create_function`（上游弱沙箱 __enter__ 读、__exit__ 写）；
//   3. 代理对非名单算子必须**委托给当前**的 `_op_create_function`。
//
// 副作用边界：这段 Python 在 Blender 进程内运行，会包装 builtins.open / os 写删族 / bpy.ops；
// 它**不是安全边界**，只防误操作——动态构造、importlib.reload、ctypes 都能绕过。

/** 载体模块名（跨 exec 存活的那个合成模块）。 */
export const GUARD_STATE_MODULE = 'dsh_blender_mcp_bridge.guardState'

/** 本插件装的钩子/代理打的标记，用于剥掉嵌套层（../docs/contract.md#guard-carrier）。 */
const GUARD_MARK = '__dsh_guard__'

/**
 * 受控算子名单。
 *
 * 路由依据是**我们自己维护的这张表**，不采信上游任何 `readOnlyHint`（I9）。
 * 只列**算子名**，写/删的判定仍然以「写路径」为准（I6）。
 */
const CONTROLLED_OPS = {
  wm: ['save_mainfile', 'save_as_mainfile', 'read_homefile', 'read_factory_settings', 'read_factory_userpref', 'read_userpref'],
  preferences: ['addon_enable', 'addon_disable', 'addon_install', 'addon_remove'],
}

/**
 * 生成护栏载荷。
 *
 * @param {object} options 参数。
 * @param {string} options.allowRoot 唯一可写范围（任务目录绝对路径）。
 * @param {'main'|'all'} options.threadScope 线程范围：`main` 只检主线程，`all` 检所有线程。
 * @param {boolean} options.enabled 是否安装（false 时载荷只做差分统计）。
 * @returns {string} 可直接拼进 exec 源码的 Python 片段（末尾已换行）。
 * @throws {Error} 路径里出现 NUL 时抛出（Python 源码不允许）。
 */
export function buildGuardPayload({ allowRoot, threadScope, enabled }) {
  const payload = renderPayload({ allowRoot, threadScope, enabled })
  if (payload.includes('\0')) throw new Error('护栏载荷里出现了 NUL 字节，拒绝生成')
  return payload
}

/**
 * 把用户代码与载荷拼成**一次执行**的完整源码。
 *
 * 为什么不能直接把用户代码文本插在载荷与收尾之间（此前的做法）：
 * add-on 在 `exec` 抛异常时**提前返回**（`mcp_to_blender_server.py` 的 except 分支），
 * 于是收尾那段根本不跑——实测后果有两个，都很贵：
 *
 * - **L2 钩子常驻**（违反 I16）：`enabled` 停在 True、`requested_root` 停在上一轮的任务目录，
 *   于是两轮 exec 之间用户在 Blender 里的任何写操作都被那个**过期作用域**判定为界外，
 *   抛 `PermissionError`——误伤的是用户自己的 Blender。
 * - **护栏证据全丢**：`blocked` / `noted` / `changes` 随收尾一起不产出，
 *   于是"越界写被拦到了"这件事在返回体里看不见，`guard.verified` 还会假假地报 false
 *   （看起来像被篡改，其实是没跑到收尾）。
 *
 * 修法是把用户代码放进 `try`、收尾放进 `finally`，异常**照常向外传播**
 * （add-on 仍然打印它自己的 traceback，错误形态不变）。
 *
 * 源码用 **base64 透传**而不是字符串字面量：`JSON.stringify` 会把非 BMP 字符
 * （emoji、生僻汉字）写成**孤立代理对**，那不是合法的 Python 字符串——直拼源码
 * 没有这个问题，转成字面量就有。base64 顺带免掉一切引号与转义歧义。
 *
 * 编译时给了文件名 `<dsh-user-code>`，于是 traceback 的行号是**用户代码自己的行号**；
 * 直接拼接时行号是"载荷 + 用户代码"的整体行号（实测报过 `File "<string>", line 520`，
 * 而用户代码总共 4 行——那种行号对模型是噪声）。
 *
 * `exec(compiled, globals())` 复用载荷所在的那个命名空间，所以用户代码里
 * `result = {...}` 与 `def check_is_finished()` 的落点与直接拼接**一致**
 * （add-on 事后仍从同一个命名空间取这两个名字）。
 *
 * 副作用边界：这段源码会在 Blender 进程内执行用户代码；`finally` 里只读状态、卸钩子、打印一行哨兵。
 *
 * @param {string} payload {@link buildGuardPayload} 的输出。
 * @param {string} code 用户源码（原文，不改缩进、不改字符）。
 * @returns {string} 完整源码。
 */
export function wrapWithFinalizer(payload, code) {
  const encoded = Buffer.from(code, 'utf8').toString('base64')
  return payload
    + `\n_dsh_user_source = __import__('base64').b64decode('${encoded}').decode('utf-8')\n`
    + 'try:\n'
    + '    exec(compile(_dsh_user_source, "<dsh-user-code>", "exec"), globals())\n'
    + 'finally:\n'
    + '    try:\n'
    + '        _dsh_meta = _dsh_carrier._dsh_finalize()\n'
    + '        print("__DSH_GUARD__" + _dsh_json.dumps(_dsh_meta, default=repr))\n'
    + '    except Exception as _dsh_exc:\n'
    + '        print("__DSH_GUARD_ERROR__" + repr(_dsh_exc), file=_dsh_sys.stderr)\n'
}

/**
 * 渲染 Python 源码。
 *
 * @param {{allowRoot: string, threadScope: string, enabled: boolean}} options 参数。
 * @returns {string} 源码。
 */
function renderPayload({ allowRoot, threadScope, enabled }) {
  const controlledOpsJson = JSON.stringify(CONTROLLED_OPS)
  const stateName = JSON.stringify(GUARD_STATE_MODULE)
  const mark = JSON.stringify(GUARD_MARK)
  const root = JSON.stringify(allowRoot)
  const scope = JSON.stringify(threadScope)
  const enabledLiteral = enabled ? 'True' : 'False'

  return `# ---- dsh-blender-mcp-bridge L2 guard payload ----
import sys as _dsh_sys
import os as _dsh_os
import json as _dsh_json
import builtins as _dsh_builtins
import threading as _dsh_threading

_dsh_state = _dsh_sys.modules.get(${stateName})
if _dsh_state is None or not getattr(_dsh_state, '__dsh_marker__', None):
    import types as _dsh_types
    _dsh_state = _dsh_types.ModuleType(${stateName})
    _dsh_state.__dsh_marker__ = 'dsh-blender-mcp-bridge.guard'
    _dsh_state.installed_root = None
    _dsh_state.reinstalls = 0
    _dsh_state.tampered = False
    _dsh_state.thread_scope = 'main'
    _dsh_state.enabled = True
    _dsh_state.original_open = None
    _dsh_state.original_os = {}
    _dsh_state.original_shutil = {}
    _dsh_state.original_pathlib = {}
    _dsh_state.original_ops = None
    _dsh_state.ops_proxy = None
    _dsh_state.ops_proxy_intact = False
    _dsh_state.proxy_installed_by_us = False
    _dsh_state.blocked_events = []
    _dsh_state.noted = []
    _dsh_state.before_snapshot = None
    _dsh_state.pending_final_snapshot = False
    _dsh_sys.modules[${stateName}] = _dsh_state

_dsh_state.requested_root = ${root}
_dsh_state.thread_scope = ${scope}
_dsh_state.enabled = ${enabledLiteral}


def _dsh_norm(p):
    try:
        p = _dsh_os.fspath(p)
    except TypeError:
        return None
    if isinstance(p, bytes):
        try:
            p = p.decode(_dsh_sys.getfilesystemencoding() or 'utf-8', 'replace')
        except Exception:
            return None
    if not isinstance(p, str):
        return None
    try:
        resolved = _dsh_os.path.realpath(_dsh_os.path.abspath(p))
    except Exception:
        resolved = _dsh_os.path.abspath(p)
    resolved = _dsh_os.path.normpath(resolved)
    if _dsh_os.name == 'nt':
        return resolved.lower()
    return resolved


def _dsh_in_root(path):
    root = _dsh_norm(_dsh_state.requested_root)
    candidate = _dsh_norm(path)
    if root is None or candidate is None:
        return False
    if candidate == root:
        return True
    return candidate.startswith(root + _dsh_os.sep)


def _dsh_checked():
    if not _dsh_state.enabled:
        return False
    if _dsh_state.thread_scope == 'all':
        return True
    # 补丁是进程级全局的，而 exec 只在主线程；后台线程被拦会造成无法解释的故障面
    return _dsh_threading.current_thread() is _dsh_threading.main_thread()


def _dsh_record(path, rule, kind, detail):
    if len(_dsh_state.blocked_events) >= 20:
        return
    _dsh_state.blocked_events.append({'rule': rule, 'kind': kind, 'path': str(path), 'call': detail})
    if len(_dsh_state.blocked_events) == 1:
        try:
            print('[dsh-guard] blocked ' + rule + ': ' + str(path), file=_dsh_sys.stderr)
        except Exception:
            pass


def _dsh_block(path, rule, kind, detail):
    _dsh_record(path, rule, kind, detail)
    raise PermissionError(
        '[dsh-guard] ' + rule + ': ' + str(path)
        + ' | writable scope: ' + str(_dsh_state.requested_root)
        + ' | this is not a sandbox, only a guard against mistakes'
    )


def _dsh_noted(path, detail):
    if len(_dsh_state.noted) >= 20:
        return
    _dsh_state.noted.append({'path': str(path), 'call': detail})


def _dsh_unwrap(fn):
    depth = 0
    while getattr(fn, ${mark}, False) and depth < 32:
        fn = getattr(fn, '__dsh_original__', None)
        if fn is None:
            break
        depth += 1
    return fn


def _dsh_snapshot():
    import bpy as _dsh_bpy
    out = {'objects': {}, 'other': {}}
    try:
        objects = list(_dsh_bpy.data.objects)
    except Exception:
        objects = []
    for obj in objects:
        try:
            pointer = str(obj.as_pointer())
            name = obj.name
            obj_type = obj.type
        except Exception:
            continue
        polygons = None
        try:
            mesh = getattr(obj, 'data', None)
            if mesh is not None and hasattr(mesh, 'polygons'):
                polygons = len(mesh.polygons)
        except Exception:
            polygons = None
        out['objects'][pointer] = {'name': name, 'type': obj_type, 'polygons': polygons}
    for key in ('collections', 'meshes', 'materials', 'lights', 'cameras', 'images', 'textures', 'armatures', 'curves', 'actions', 'node_groups'):
        try:
            items = list(getattr(_dsh_bpy.data, key))
        except Exception:
            continue
        for item in items:
            try:
                out['other'][str(item.as_pointer())] = {'kind': key, 'name': item.name}
            except Exception:
                pass
    return out


def _dsh_make_open_hook():
    real = _dsh_state.original_open

    def _guard(file, mode='r', *args, **kwargs):
        if _dsh_checked() and isinstance(mode, str) and any(ch in mode for ch in 'wax+'):
            if not _dsh_in_root(file):
                _dsh_block(file, 'write-outside-scope', 'open', 'open(mode=' + mode + ')')
            else:
                _dsh_noted(file, 'open(mode=' + mode + ')')
        return real(file, mode, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_make_os_open_hook():
    real = _dsh_state.original_os['open']
    write_flags = (getattr(_dsh_os, 'O_WRONLY', 0) | getattr(_dsh_os, 'O_RDWR', 0)
                   | getattr(_dsh_os, 'O_CREAT', 0) | getattr(_dsh_os, 'O_APPEND', 0)
                   | getattr(_dsh_os, 'O_TRUNC', 0))

    def _guard(path, flags, *args, **kwargs):
        if _dsh_checked() and (flags & write_flags):
            if not _dsh_in_root(path):
                _dsh_block(path, 'write-outside-scope', 'os.open', 'os.open(flags=' + str(flags) + ')')
            else:
                _dsh_noted(path, 'os.open')
        return real(path, flags, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_make_delete_hook(name, real):
    def _guard(*args, **kwargs):
        target = args[0] if args else kwargs.get('path', kwargs.get('src'))
        if _dsh_checked() and not _dsh_in_root(target):
            _dsh_block(target, 'delete-outside-scope', name, name + '()')
        elif _dsh_checked():
            _dsh_noted(target, name)
        return real(*args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_make_write_hook(name, real):
    def _guard(path, *args, **kwargs):
        if _dsh_checked() and not _dsh_in_root(path):
            _dsh_block(path, _dsh_write_rule_for(name), name, name + '()')
        elif _dsh_checked():
            _dsh_noted(path, name)
        return real(path, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_write_rule_for(name):
    if name.startswith('shutil.'):
        tail = name.split('.', 1)[1]
        if tail in ('rmtree', 'move'):
            return 'delete-outside-scope'
    return 'write-outside-scope'


def _dsh_make_path_hook(name, real):
    def _guard(self, *args, **kwargs):
        if _dsh_checked() and not _dsh_in_root(self):
            _dsh_block(self, _dsh_write_rule_for(name), name, name + '()')
        elif _dsh_checked():
            _dsh_noted(self, name)
        return real(self, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_ops_module(real_ops, module_name, controlled, cache):
    names = controlled.get(module_name)
    if not names:
        return getattr(real_ops, module_name)
    key = (module_name, id(getattr(real_ops, '_op_create_function', None)))
    if key in cache:
        return cache[key]
    plain = getattr(real_ops, module_name)

    class _OpsModule(object):
        _dsh_ops_module = True

        def __getattr__(self, op_name):
            if op_name in names:
                return _dsh_blocked_op(plain, module_name, op_name)
            # 非名单算子委托给**当前**的 _op_create_function：
            # 上游那 4 个被拦算子的过滤活在那个包装里，绕开它就是用我们的护栏换掉上游的护栏
            return getattr(plain, op_name)

        def __setattr__(self, name, value):
            setattr(plain, name, value)

        def __delattr__(self, name):
            delattr(plain, name)

        def __dir__(self):
            return dir(plain)

    wrapped = _OpsModule()
    cache[key] = wrapped
    return wrapped


def _dsh_blocked_op(plain, module_name, op_name):
    real_op = getattr(plain, op_name)

    def _guard(*args, **kwargs):
        if not _dsh_checked():
            return real_op(*args, **kwargs)
        # 检查点机制自己的存盘出口必须在算子层放行，否则检查点无法落地。
        # 但 copy=True 只豁免"覆盖保存"这一条，**不豁免可写范围**（I5）：
        # 此前这一支无条件放行且不判路径，于是任意代码能用它往任务目录外写 .blend（实测）。
        # 缺 filepath 也一并拦下——save_as_mainfile(copy=True) 不带路径时写的是**用户当前文件**，
        # 那正是覆盖保存。（fail-closed：宁可误拦，不可漏放。）
        if module_name == 'wm' and kwargs.get('copy') is True:
            if not _dsh_in_root(kwargs.get('filepath')):
                _dsh_block(kwargs.get('filepath'), 'write-outside-scope', 'bpy.ops',
                           'save_as_mainfile(copy=True)')
            _dsh_noted(kwargs.get('filepath'), module_name + '.' + op_name + '(copy=True)')
            return real_op(*args, **kwargs)
        if module_name == 'wm' and op_name == 'save_mainfile':
            _dsh_block('bpy.ops.wm.save_mainfile', 'overwrite-save', 'bpy.ops', 'save_mainfile() == Ctrl+S')
        if module_name == 'wm' and op_name == 'save_as_mainfile':
            _dsh_block(kwargs.get('filepath'), 'overwrite-save', 'bpy.ops', 'save_as_mainfile() without copy=True')
        if module_name == 'wm':
            _dsh_block('bpy.ops.wm.' + op_name, 'discard-session', 'bpy.ops', op_name + '()')
        if module_name == 'preferences':
            _dsh_block('bpy.ops.preferences.' + op_name, 'environment-change', 'bpy.ops', op_name + '()')
        return real_op(*args, **kwargs)

    return _guard


def _dsh_make_ops_proxy(real_ops):
    controlled = _dsh_json.loads(${JSON.stringify(controlledOpsJson)})
    cache = {}

    class _OpsProxy(object):
        _dsh_ops_proxy = True

        def __getattr__(self, name):
            if name.startswith('__') and name.endswith('__'):
                raise AttributeError(name)
            # 名单外的模块**不缓存**：缓存会把当时的 _op_create_function 包装固化下来
            return _dsh_ops_module(_dsh_state.original_ops, name, controlled, cache)

        def __setattr__(self, name, value):
            # 必须读写透传：上游弱沙箱 __enter__ 读、__exit__ 写 _op_create_function
            setattr(_dsh_state.original_ops, name, value)

        def __delattr__(self, name):
            delattr(_dsh_state.original_ops, name)

        def __dir__(self):
            return dir(_dsh_state.original_ops)

    return _OpsProxy()


def _dsh_install():
    import bpy as _dsh_bpy
    # 真原始函数只在首次捕获：否则重装会把上一次的 _guard 当"原始函数"，守卫层层嵌套
    if _dsh_state.original_open is None:
        _dsh_state.original_open = _dsh_unwrap(_dsh_builtins.open)
    if not _dsh_state.original_os:
        _dsh_state.original_os = {
            'open': _dsh_unwrap(_dsh_os.open),
            'remove': _dsh_unwrap(_dsh_os.remove),
            'unlink': _dsh_unwrap(_dsh_os.unlink),
            'rmdir': _dsh_unwrap(_dsh_os.rmdir),
            'rename': _dsh_unwrap(_dsh_os.rename),
            'replace': _dsh_unwrap(_dsh_os.replace),
            'mkdir': _dsh_unwrap(_dsh_os.mkdir),
            'makedirs': _dsh_unwrap(_dsh_os.makedirs),
        }
    if _dsh_state.original_ops is None:
        _dsh_state.original_ops = _dsh_bpy.ops

    _dsh_builtins.open = _dsh_make_open_hook()
    _dsh_os.open = _dsh_make_os_open_hook()
    _dsh_os.remove = _dsh_make_delete_hook('os.remove', _dsh_state.original_os['remove'])
    _dsh_os.unlink = _dsh_make_delete_hook('os.unlink', _dsh_state.original_os['unlink'])
    _dsh_os.rmdir = _dsh_make_delete_hook('os.rmdir', _dsh_state.original_os['rmdir'])
    _dsh_os.rename = _dsh_make_delete_hook('os.rename', _dsh_state.original_os['rename'])
    _dsh_os.replace = _dsh_make_delete_hook('os.replace', _dsh_state.original_os['replace'])
    _dsh_os.mkdir = _dsh_make_write_hook('os.mkdir', _dsh_state.original_os['mkdir'])
    _dsh_os.makedirs = _dsh_make_write_hook('os.makedirs', _dsh_state.original_os['makedirs'])

    try:
        import shutil as _dsh_shutil
        for _name in ('rmtree', 'move', 'copyfile', 'copy2'):
            if _name not in _dsh_state.original_shutil:
                _dsh_state.original_shutil[_name] = _dsh_unwrap(getattr(_dsh_shutil, _name))
            setattr(_dsh_shutil, _name,
                    _dsh_make_write_hook('shutil.' + _name, _dsh_state.original_shutil[_name]))
    except Exception:
        pass

    try:
        import pathlib as _dsh_pathlib
        for _name in ('write_text', 'write_bytes', 'touch', 'unlink', 'mkdir', 'rmdir'):
            if _name not in _dsh_state.original_pathlib:
                _dsh_state.original_pathlib[_name] = _dsh_unwrap(getattr(_dsh_pathlib.Path, _name))
            setattr(_dsh_pathlib.Path, _name,
                    _dsh_make_path_hook('Path.' + _name, _dsh_state.original_pathlib[_name]))
    except Exception:
        pass

    # 算子代理：只在 exec 作用域内装上，收尾卸下（I16）
    _dsh_state.ops_proxy = _dsh_make_ops_proxy(_dsh_state.original_ops)
    _dsh_bpy.ops = _dsh_state.ops_proxy
    _dsh_state.ops_proxy_intact = True
    _dsh_state.proxy_installed_by_us = True
    _dsh_state.installed_root = _dsh_state.requested_root
    _dsh_state.reinstalls = _dsh_state.reinstalls + 1


def _dsh_restore(target_obj, name, original):
    """把某个属性还原成原始函数。

    **只在我们的钩子仍在最上层时才还原**：若期间有别的 add-on 在我们之上又打了一次补丁，
    强行还原会把人家的补丁抹掉（那是比"钩子多留一轮"更糟的越权）。
    """
    try:
        current = getattr(target_obj, name, None)
    except Exception:
        return
    if getattr(current, ${mark}, False):
        try:
            setattr(target_obj, name, original)
        except Exception:
            pass


def _dsh_uninstall():
    """收尾卸掉**全部**钩子（I16：L2 只在 exec 作用域内安装，不得常驻）。

    此前只还原了 bpy.ops，文件族钩子一直留在进程里，于是两轮 exec 之间
    requested_root 还是上一次那个任务目录，Blender 里任何来源的写都被那个过期作用域判定
    为界外并抛 PermissionError——这会误伤用户自己的 Blender。
    """
    import bpy as _dsh_bpy
    if _dsh_state.original_open is not None:
        _dsh_restore(_dsh_builtins, 'open', _dsh_state.original_open)
    for _name, _original in list(_dsh_state.original_os.items()):
        _dsh_restore(_dsh_os, _name, _original)
    try:
        import shutil as _dsh_shutil
        for _name, _original in list(_dsh_state.original_shutil.items()):
            _dsh_restore(_dsh_shutil, _name, _original)
    except Exception:
        pass
    try:
        import pathlib as _dsh_pathlib
        for _name, _original in list(_dsh_state.original_pathlib.items()):
            _dsh_restore(_dsh_pathlib.Path, _name, _original)
    except Exception:
        pass
    if _dsh_state.original_ops is not None:
        try:
            _dsh_bpy.ops = _dsh_state.original_ops
        except Exception:
            pass
    # 双保险：即使某个钩子因上面的"不抹掉别人补丁"判据而留在位上，也不许它继续判定。
    # enabled / requested_root 每次 exec 都由载荷头部重写（见上），清掉不影响下一次。
    _dsh_state.enabled = False
    _dsh_state.requested_root = None
    _dsh_state.ops_proxy = None
    _dsh_state.proxy_installed_by_us = False
    _dsh_state.installed_root = None


def _dsh_proxy_in_place():
    import bpy as _dsh_bpy
    return getattr(_dsh_bpy, 'ops', None) is getattr(_dsh_state, 'ops_proxy', None)


def _dsh_prep():
    import bpy as _dsh_bpy
    if not _dsh_state.enabled:
        if _dsh_state.before_snapshot is None:
            _dsh_state.before_snapshot = _dsh_snapshot()
            _dsh_state.pending_final_snapshot = True
        return
    # 根变化必须强制重装：钩子是闭包，捕获的是当时的 allowRoot
    root_changed = _dsh_state.installed_root != _dsh_state.requested_root
    # tampered 是**按轮**结论，不是粘性标志：一次真篡改不应当污染之后所有轮次
    _dsh_state.tampered = False
    if root_changed or not _dsh_proxy_in_place():
        # **篡改证据只能这样成立**：上一次留下的确实是本插件装的代理（proxy_installed_by_us），
        # 而此刻它已经不在位。收尾主动卸下会把该标志清掉，因此正常流程不会被误报。
        if _dsh_state.pending_final_snapshot and _dsh_state.proxy_installed_by_us and not _dsh_proxy_in_place():
            _dsh_state.tampered = True
        # 上一次没跑到 finalize（用户代码抛异常）：把上一轮的证据结算掉，避免丢失
        if _dsh_state.pending_final_snapshot:
            _dsh_state.pending_final_snapshot = False
            _dsh_state.before_snapshot = None
        _dsh_install()
    # 证据每轮重置：否则历史拦截会被算到本轮账上
    _dsh_state.blocked_events = []
    _dsh_state.noted = []
    _dsh_state.before_snapshot = _dsh_snapshot()
    _dsh_state.pending_final_snapshot = True


def _dsh_finalize():
    import bpy as _dsh_bpy
    blocked = list(_dsh_state.blocked_events)
    noted = list(_dsh_state.noted)
    changes = None
    risk_notes = []
    if _dsh_state.pending_final_snapshot and _dsh_state.before_snapshot is not None:
        try:
            after = _dsh_snapshot()
            before = _dsh_state.before_snapshot
            removed = [v for k, v in before['objects'].items() if k not in after['objects']]
            added = [v for k, v in after['objects'].items() if k not in before['objects']]
            other_removed = [v for k, v in before['other'].items() if k not in after['other']]
            changes = {'objectsAdded': added, 'objectsRemoved': removed, 'dataBlocksRemoved': other_removed}
            if removed:
                risk_notes.append('已删除 ' + str(len(removed)) + ' 个对象：'
                                  + ', '.join([str(x.get('name')) for x in removed[:10]]))
            if other_removed:
                risk_notes.append('已删除 ' + str(len(other_removed)) + ' 个数据块：'
                                  + ', '.join([str(x.get('kind')) + ':' + str(x.get('name')) for x in other_removed[:10]]))
        except Exception as _exc:
            risk_notes.append('数据块差分失败：' + repr(_exc))
        _dsh_state.before_snapshot = None
        _dsh_state.pending_final_snapshot = False
    if blocked:
        risk_notes.append('本次执行中有 ' + str(len(blocked)) + ' 次越界写/删被 L2 运行时拦截')
    intact = _dsh_proxy_in_place()
    # 收尾必须卸掉**全部**钩子，不只是算子代理（I16）。见 _dsh_uninstall 的说明。
    try:
        _dsh_uninstall()
    except Exception as _dsh_exc:
        risk_notes.append('L2 钩子收尾卸载失败：' + repr(_dsh_exc))
    _dsh_state.ops_proxy_intact = False
    # **卸载后当场自查**：I16 说"L2 不得常驻"，光靠代码读起来像卸了不算证据。
    # 残留时不抛异常（那会让用户的 exec 变成失败），而是把它记进 risk_notes 让调用方看见。
    residual = []
    try:
        if getattr(_dsh_builtins.open, ${mark}, False):
            residual.append('builtins.open')
        for _name in list(_dsh_state.original_os):
            if getattr(getattr(_dsh_os, _name, None), ${mark}, False):
                residual.append('os.' + _name)
        if getattr(getattr(_dsh_bpy, 'ops', None), ${mark}, False):
            residual.append('bpy.ops')
    except Exception as _dsh_exc:
        risk_notes.append('L2 残留自查失败：' + repr(_dsh_exc))
    if residual:
        risk_notes.append('L2 钩子在收尾后仍留在进程里（违反 I16）：' + ', '.join(residual))
    return {
        'intact': bool(intact),
        'reinstalls': int(_dsh_state.reinstalls),
        'tampered': bool(_dsh_state.tampered),
        'blocked': blocked,
        'noted': noted,
        'changes': changes,
        'risk_notes': risk_notes,
        'residual': residual,
        'enabledAfter': bool(_dsh_state.enabled),
    }


_dsh_carrier = _dsh_sys.modules[${stateName}]
_dsh_carrier._dsh_prep = _dsh_prep
_dsh_carrier._dsh_finalize = _dsh_finalize
_dsh_carrier._dsh_proxy_in_place = _dsh_proxy_in_place
_dsh_carrier._dsh_snapshot = _dsh_snapshot

_dsh_prep()
`
}
