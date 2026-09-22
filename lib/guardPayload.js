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
// 副作用边界：这段 Python 在 Blender 进程内运行，会包装 builtins.open / io.open / os 写删族 /
// 文件输出算子代理 / bpy.ops；它**不是安全边界**，只防误操作——动态构造、importlib.reload、
// ctypes 都能绕过。

import { CONTROLLED_OPS, FILE_OUTPUT_OPS } from './writeOps.js'

/** 载体模块名（跨 exec 存活的那个合成模块）。 */
export const GUARD_STATE_MODULE = 'dsh_blender_mcp_bridge.guardState'

/** 本插件装的钩子/代理打的标记，用于剥掉嵌套层（../docs/contract.md#guard-carrier）。 */
const GUARD_MARK = '__dsh_guard__'

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
  const fileOutputOpsJson = JSON.stringify(FILE_OUTPUT_OPS)
  const stateName = JSON.stringify(GUARD_STATE_MODULE)
  const mark = JSON.stringify(GUARD_MARK)
  const root = JSON.stringify(allowRoot)
  const scope = JSON.stringify(threadScope)
  const enabledLiteral = enabled ? 'True' : 'False'

  return `# ---- dsh-blender-mcp-bridge L2 guard payload ----
import sys as _dsh_sys
import os as _dsh_os
import io as _dsh_io
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
    _dsh_state.original_data = None
    _dsh_state.original_io = None
    _dsh_state.ops_proxy = None
    _dsh_state.data_proxy = None
    _dsh_state.ops_proxy_intact = False
    _dsh_state.data_proxy_intact = False
    _dsh_state.proxy_installed_by_us = False
    _dsh_state.blocked_events = []
    _dsh_state.noted = []
    _dsh_state.before_snapshot = None
    _dsh_state.pending_final_snapshot = False
    _dsh_state.data_cache = {}
    _dsh_state.file_ops = None
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


def _dsh_file_ops():
    """路径受检算子表（与 Node 侧 lib/writeOps.js 同源，随载荷下发）。"""
    if _dsh_state.file_ops is None:
        _dsh_state.file_ops = _dsh_json.loads(${JSON.stringify(fileOutputOpsJson)})
    return _dsh_state.file_ops


def _dsh_fingerprint(item):
    """给数据块算一个**便宜的变更指纹**，用于发现「就地修改」。

    为什么需要它：此前的 L3 差分只有增/删两个方向，于是「改合成器参数 / 改顶点 / 换材质」
    这类**就地修改**在 changes 里完全不可见——而系统提示词把合成器内容列为用户所有，
    「改了却看不见」是该说法的反面。

    口径：sha1(repr(item)) 取前 12 位。**不保证绝对无碰撞**，用途是「看起来变了就报出来」
    而不是「精确证明变了」；拿不到 repr 时返回 None（None 一律不参与比对，不当成「变了」）。
    """
    try:
        import hashlib as _dsh_hashlib
        text = repr(item)
        return _dsh_hashlib.sha1(text.encode('utf-8', 'replace')).hexdigest()[:12]
    except Exception:
        return None


def _dsh_ensure_paths(scope, paths, rule, where):
    """校验一组路径实参：**任一越界即拒**（fail-closed）。

    报告实测的 P0-2：rename / replace / move / copyfile 族此前只校验第一个实参（源），
    于是 \`shutil.move(界内 → 界外)\`、\`os.rename\`、\`os.replace\` 的**目标端**可以越界写成功。
    这里改成"全部路径实参一起判"，并把**标量非字符串实参一律视为可疑**——
    它可能是文件描述符，不可能是"合法路径"，所以拒绝比放行安全。
    """
    if not _dsh_checked():
        return None
    lowered = [p for p in paths if (isinstance(p, (str, bytes)) or isinstance(p, int))]
    if not lowered:
        return None
    outside = [p for p in lowered if not _dsh_in_root(p)]
    if outside:
        return _dsh_block(outside[0], rule, where, where + '() 的实参越界')
    for p in lowered:
        _dsh_noted(p, where)
    return None


def _dsh_path_args(args, kwargs, names):
    """从位置与关键字实参里收集**全部**路径候选。

    跳过 None：没有传这个关键字不等于传了非法值。
    标量数值（含 bool）**保留**——\`os.open(path, flags)\` 的 fd、\`os.chmod(path, mode)\`
    的 mode 都是标量，既可能是 fd 也可能是 mode；既不可能是路径，一律拒绝比放行安全
    （fail-closed：宁可误拦，不可漏放）。字符串一律收。
    其它类型交给 \`_dsh_norm\` 试 \`os.fspath\`，不认就跳过（对象代理之类）。
    """
    out = []
    for value in args:
        if value is None:
            continue
        if isinstance(value, bool):
            out.append(int(value))
            continue
        if isinstance(value, (str, bytes, int, float)):
            out.append(value)
            continue
        try:
            _dsh_os.fspath(value)
        except Exception:
            continue
        out.append(value)
    for key, value in kwargs.items():
        if value is None:
            continue
        if names and key not in names:
            # 显式名单存在时只收名单内与后缀兜底命中的键
            lowered = key.lower()
            if not (lowered == 'filepath' or lowered.endswith('_filepath')
                    or lowered == 'path' or lowered.endswith('_path')):
                continue
        out.append(value)
    return out


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
        out['objects'][pointer] = {'name': name, 'type': obj_type, 'polygons': polygons,
                                   'fp': _dsh_fingerprint(obj)}
    for key in ('collections', 'meshes', 'materials', 'lights', 'cameras', 'images', 'textures',
                'armatures', 'curves', 'actions', 'node_groups', 'libraries'):
        try:
            items = list(getattr(_dsh_bpy.data, key))
        except Exception:
            continue
        for item in items:
            try:
                out['other'][str(item.as_pointer())] = {'kind': key, 'name': item.name,
                                                        'fp': _dsh_fingerprint(item)}
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


def _dsh_write_rule_for(name):
    if name.startswith('shutil.'):
        tail = name.split('.', 1)[1]
        if tail in ('rmtree', 'move'):
            return 'delete-outside-scope'
    return 'write-outside-scope'


def _dsh_make_paths_hook(name, real, rule):
    """删除 / 改名 / 移动族：**全部路径实参**任一越界即拒（报告 P0-2）。

    此族此前只取 \`args[0]\`（源），于是 \`shutil.move(界内 → 界外)\` 这类调用目标端完全不判。
    """
    def _guard(*args, **kwargs):
        paths = _dsh_path_args(args, kwargs, [])
        _dsh_ensure_paths(None, paths, rule, name)
        return real(*args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_make_write_hook(name, real):
    """**单目标**写盘族（\`os.open\` / \`os.mkdir\` / \`os.makedirs\` / \`os.truncate\`）。

    语义与 paths 族不同：这些函数的第一个实参就是目标，但 \`os.open(path, flags)\` 的
    flags 是标量——不能"全部实参一起判"，否则任何带 flags 的调用都会被误拦。
    所以只判第一个实参，并由 \`_dsh_write_rule_for\` 给出规则名。
    """
    def _guard(path, *args, **kwargs):
        _dsh_ensure_paths(None, [path], _dsh_write_rule_for(name), name)
        return real(path, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_make_path_hook(name, real):
    def _guard(self, *args, **kwargs):
        _dsh_ensure_paths(None, [self], _dsh_write_rule_for(name), name)
        return real(self, *args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real
    return _guard


def _dsh_guarded_file_op(real_op, module_name, path_args):
    """文件输出算子：**落盘实参越界即拒**。

    判定仍以**写路径**为准（I6）：算子名只用来决定"该看哪些实参"。
    显式名单为空（例如 \`image.save()\`）时按后缀兜底收 \`filepath\` / \`path\` 结尾的关键字——
    那种算子通常**没有任何落盘实参**（目标来自数据块属性），于是这一层如实无能为力，
    与 docs/contract.md §8.6 的诚实边界一致。
    """
    def _guard(*args, **kwargs):
        if not _dsh_checked():
            return real_op(*args, **kwargs)
        paths = _dsh_path_args(args, kwargs, path_args)
        _dsh_ensure_paths(None, paths, 'write-outside-scope', 'bpy.ops.' + module_name)
        return real_op(*args, **kwargs)

    _guard.__dsh_guard__ = True
    _guard.__dsh_original__ = real_op
    return _guard


def _dsh_ops_module(real_ops, module_name, controlled, file_ops, cache, path_cache):
    """把一个 \`bpy.ops.<module>\` 包成代理模块。

    **优先级**：名单内的拒绝类算子（覆盖保存 / 丢弃会话 / 偏好）先判——它们的语义决定了
    没有"界内的合法用法"；其次是文件输出算子（按落盘实参判）；最后是非名单算子，
    委托给**当前**的 \`_op_create_function\`（上游弱沙箱的过滤活在那里，绕开它等于用我们的
    护栏换掉上游的护栏）。
    """
    names = controlled.get(module_name)
    outputs = file_ops.get(module_name)
    if not names and not outputs:
        return getattr(real_ops, module_name)
    key = (module_name, id(getattr(real_ops, '_op_create_function', None)))
    if key in cache:
        return cache[key]
    plain = getattr(real_ops, module_name)

    class _OpsModule(object):
        _dsh_ops_module = True

        def __getattr__(self, op_name):
            if names and op_name in names:
                return _dsh_blocked_op(plain, module_name, op_name)
            if outputs and op_name in outputs:
                cache_key = (module_name, op_name, id(getattr(plain, op_name, None)))
                if cache_key not in path_cache:
                    path_cache[cache_key] = _dsh_guarded_file_op(
                        getattr(plain, op_name), module_name, outputs.get(op_name) or [])
                return path_cache[cache_key]
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


def _dsh_libraries_module(real_libraries, path_args, cache):
    key = ('libraries', id(real_libraries))
    if key in cache:
        return cache[key]

    class _LibrariesModule(object):
        _dsh_libraries_module = True

        def __getattr__(self, op_name):
            if op_name == 'write':
                return _dsh_guarded_file_op(getattr(real_libraries, op_name), 'bpy.data.libraries', path_args)
            return getattr(real_libraries, op_name)

    wrapped = _LibrariesModule()
    cache[key] = wrapped
    return wrapped


def _dsh_data_module(real_data, file_ops, cache):
    """把 \`bpy.data\` 包成代理，只覆盖**名单内的文件输出方法**（\`libraries.write\`）。

    为什么值得单开一层：\`bpy.data.libraries.write(filepath, ...)\` 能把任意数据块写到任意位置，
    而它不在 \`bpy.ops\` 上，算子代理完全看不到它。
    代理只拦 \`libraries\` 模块，其余属性（含 \`objects\` / \`meshes\` 等热路径）一律透传。
    """
    # 表键是 \`libraries\`（与 Node 侧 lib/writeOps.js 同源）：两侧都用同一个模块路径
    # \`bpy.data.libraries\` 查表，不再各自映射一次——两份映射就是两处会漂移的地方。
    outputs = file_ops.get('libraries')
    if not outputs:
        return real_data
    key = ('data', id(real_data))
    if key in cache:
        return cache[key]

    class _DataProxy(object):
        _dsh_data_proxy = True

        def __getattr__(self, name):
            if name.startswith('__') and name.endswith('__'):
                raise AttributeError(name)
            target = getattr(real_data, name)
            if name == 'libraries':
                return _dsh_libraries_module(target, outputs.get('write') or [], cache)
            return target

        def __setattr__(self, name, value):
            setattr(real_data, name, value)

        def __delattr__(self, name):
            delattr(real_data, name)

    wrapped = _DataProxy()
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
    file_ops = _dsh_json.loads(${JSON.stringify(fileOutputOpsJson)})
    cache = {}
    path_cache = {}

    class _OpsProxy(object):
        _dsh_ops_proxy = True

        def __getattr__(self, name):
            if name.startswith('__') and name.endswith('__'):
                raise AttributeError(name)
            # 名单外的模块**不缓存**：缓存会把当时的 _op_create_function 包装固化下来
            return _dsh_ops_module(_dsh_state.original_ops, name, controlled, file_ops, cache, path_cache)

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
    if _dsh_state.original_io is None:
        # **CPython 里 io.open IS builtins.open**：只包裹其中一个会留下一个没有钩子的名字
        # （报告实测：\`io.open(界外,'w')\` 写成功）。两边指向**同一个**钩子，且钩子内部
        # 统一调用捕获下来的单一原始实现，避免 io.open → builtins.open 的递归。
        _dsh_state.original_io = _dsh_unwrap(_dsh_io.open)
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
            'truncate': _dsh_unwrap(_dsh_os.truncate),
        }
    if _dsh_state.original_ops is None:
        _dsh_state.original_ops = _dsh_bpy.ops
    if _dsh_state.original_data is None:
        _dsh_state.original_data = _dsh_bpy.data

    _dsh_open_hook = _dsh_make_open_hook()
    _dsh_builtins.open = _dsh_open_hook
    _dsh_io.open = _dsh_open_hook

    _dsh_os.open = _dsh_make_write_hook('os.open', _dsh_state.original_os['open'])
    _dsh_os.remove = _dsh_make_paths_hook('os.remove', _dsh_state.original_os['remove'], 'delete-outside-scope')
    _dsh_os.unlink = _dsh_make_paths_hook('os.unlink', _dsh_state.original_os['unlink'], 'delete-outside-scope')
    _dsh_os.rmdir = _dsh_make_paths_hook('os.rmdir', _dsh_state.original_os['rmdir'], 'delete-outside-scope')
    _dsh_os.rename = _dsh_make_paths_hook('os.rename', _dsh_state.original_os['rename'], 'delete-outside-scope')
    _dsh_os.replace = _dsh_make_paths_hook('os.replace', _dsh_state.original_os['replace'], 'delete-outside-scope')
    _dsh_os.mkdir = _dsh_make_write_hook('os.mkdir', _dsh_state.original_os['mkdir'])
    _dsh_os.makedirs = _dsh_make_write_hook('os.makedirs', _dsh_state.original_os['makedirs'])
    _dsh_os.truncate = _dsh_make_write_hook('os.truncate', _dsh_state.original_os['truncate'])

    try:
        import shutil as _dsh_shutil
        # copytree 必须显式覆盖：它的 CPython 默认实参 \`copy_function=copy2\` 在**导入期**就
        # 绑定了当时的 copy2，只包 copy2 拦不住 copytree 自己的调用路径。
        _dsh_shutil_hooks = (
            ('rmtree', 'delete-outside-scope'),
            ('move', 'delete-outside-scope'),
            ('copyfile', 'write-outside-scope'),
            ('copy2', 'write-outside-scope'),
            ('copytree', 'write-outside-scope'),
        )
        for _name, _rule in _dsh_shutil_hooks:
            if _name not in _dsh_state.original_shutil:
                _dsh_state.original_shutil[_name] = _dsh_unwrap(getattr(_dsh_shutil, _name))
            setattr(_dsh_shutil, _name,
                    _dsh_make_paths_hook('shutil.' + _name, _dsh_state.original_shutil[_name], _rule))
    except Exception:
        pass

    try:
        import pathlib as _dsh_pathlib
        for _name in ('write_text', 'write_bytes', 'touch', 'unlink', 'mkdir', 'rmdir', 'rename', 'replace'):
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
    # 数据块层代理：只为了盖住 \`bpy.data.libraries.write\`
    if _dsh_state.data_proxy is None:
        _dsh_state.data_proxy = _dsh_data_module(_dsh_state.original_data, _dsh_file_ops(), _dsh_state.data_cache)
    _dsh_bpy.data = _dsh_state.data_proxy
    _dsh_state.data_proxy_intact = True
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
    if _dsh_state.original_io is not None:
        _dsh_restore(_dsh_io, 'open', _dsh_state.original_io)
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
    if _dsh_state.original_data is not None:
        try:
            _dsh_bpy.data = _dsh_state.original_data
            _dsh_state.data_proxy = None
        except Exception:
            pass
    # 双保险：即使某个钩子因上面的"不抹掉别人补丁"判据而留在位上，也不许它继续判定。
    # enabled / requested_root 每次 exec 都由载荷头部重写（见上），清掉不影响下一次。
    _dsh_state.enabled = False
    _dsh_state.requested_root = None
    _dsh_state.ops_proxy = None
    _dsh_state.ops_proxy_intact = False
    _dsh_state.data_proxy_intact = False
    _dsh_state.proxy_installed_by_us = False
    _dsh_state.installed_root = None


def _dsh_proxy_in_place():
    """两个代理**都在位**才算在位。

    只查 \`bpy.ops\` 是不够的：数据块层代理（\`bpy.data.libraries.write\`）同样承担拦截职责，
    漏查就等于给它留了一个"被换掉却不被发现"的口子。
    """
    import bpy as _dsh_bpy
    ops_ok = getattr(_dsh_bpy, 'ops', None) is getattr(_dsh_state, 'ops_proxy', None)
    if getattr(_dsh_state, 'data_proxy', None) is None:
        return ops_ok
    return ops_ok and getattr(_dsh_bpy, 'data', None) is _dsh_state.data_proxy


def _dsh_jobs_running():
    """列出仍在跑的后台任务类型（异步渲染 / 烘焙等）。

    为什么要在收尾**之前**读：这正是"覆盖窗口"的边界证据——窗口在我们返回调用方时就结束，
    而这些任务之后才落盘。报告实测事故：一次 \`INVOKE_DEFAULT\` 起的渲染在 exec 返回**之后**
    写出了 \`C:\\\\tmp\\\\Untitled.png\`，护栏对此完全无感，而返回体里的 \`hooksUnloaded: true\`
    却给人一种"全程覆盖"的错觉。

    读不到就返回空列表：这只是**证据**，不是判据，不该让 exec 失败。
    """
    import bpy as _dsh_bpy
    app = getattr(_dsh_bpy, 'app', None)
    checker = getattr(app, 'is_job_running', None)
    if checker is None:
        return []
    running = []
    for _job in ('RENDER', 'OBJECT_BAKE', 'COMPOSITE', 'GEOMETRY_NODES', 'IMAGE_SAVE',
                 'SEQUENCE', 'PACK', 'SHADER_COMPILE'):
        try:
            if checker(_job):
                running.append(_job)
        except Exception:
            continue
    return running


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
            # **就地修改**：指针没变但指纹变了。此前 L3 只有增/删两个方向，于是
            # "改合成器参数 / 改顶点 / 换材质"完全不可见——而提示词把合成器内容列为用户所有。
            # None 一律不参与比对（拿不到指纹不等于变了）。
            modified = [v for k, v in after['objects'].items()
                        if k in before['objects']
                        and v.get('fp') is not None
                        and before['objects'][k].get('fp') is not None
                        and v['fp'] != before['objects'][k]['fp']]
            other_modified = [v for k, v in after['other'].items()
                              if k in before['other']
                              and v.get('fp') is not None
                              and before['other'][k].get('fp') is not None
                              and v['fp'] != before['other'][k]['fp']]
            changes = {
                'objectsAdded': added,
                'objectsRemoved': removed,
                'objectsModified': modified,
                'dataBlocksRemoved': other_removed,
                'dataBlocksModified': other_modified,
            }
            if removed:
                risk_notes.append('已删除 ' + str(len(removed)) + ' 个对象：'
                                  + ', '.join([str(x.get('name')) for x in removed[:10]]))
            if other_removed:
                risk_notes.append('已删除 ' + str(len(other_removed)) + ' 个数据块：'
                                  + ', '.join([str(x.get('kind')) + ':' + str(x.get('name')) for x in other_removed[:10]]))
            if modified:
                risk_notes.append('就地修改了 ' + str(len(modified)) + ' 个对象：'
                                  + ', '.join([str(x.get('name')) for x in modified[:10]]))
            if other_modified:
                risk_notes.append('就地修改了 ' + str(len(other_modified)) + ' 个数据块：'
                                  + ', '.join([str(x.get('kind')) + ':' + str(x.get('name')) for x in other_modified[:10]]))
        except Exception as _exc:
            risk_notes.append('数据块差分失败：' + repr(_exc))
        _dsh_state.before_snapshot = None
        _dsh_state.pending_final_snapshot = False
    if blocked:
        risk_notes.append('本次执行中有 ' + str(len(blocked)) + ' 次越界写/删被 L2 运行时拦截')
    intact = _dsh_proxy_in_place()
    # 覆盖窗口的**实际边界**：回到调用方手里之后钩子就卸了，所以窗口到此为止。
    jobs_running = _dsh_jobs_running()
    if jobs_running:
        risk_notes.append(
            '后台任务仍在运行：' + ', '.join(jobs_running)
            + '。它们在本轮 exec 的护栏窗口**之外**落盘（窗口在 exec 返回时就结束了），'
            + '因此这些写不受 L1/L2 约束。长渲染请用 Blender 自己的 F12，或分片轮询 is_job_running。')
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
        if getattr(getattr(_dsh_io, 'open', None), ${mark}, False):
            residual.append('io.open')
        for _name in list(_dsh_state.original_os):
            if getattr(getattr(_dsh_os, _name, None), ${mark}, False):
                residual.append('os.' + _name)
        for _name in list(_dsh_state.original_shutil):
            try:
                import shutil as _dsh_shutil2
                if getattr(getattr(_dsh_shutil2, _name, None), ${mark}, False):
                    residual.append('shutil.' + _name)
            except Exception:
                pass
        for _name in list(_dsh_state.original_pathlib):
            try:
                import pathlib as _dsh_pathlib2
                if getattr(getattr(_dsh_pathlib2.Path, _name, None), ${mark}, False):
                    residual.append('Path.' + _name)
            except Exception:
                pass
        if getattr(getattr(_dsh_bpy, 'ops', None), ${mark}, False):
            residual.append('bpy.ops')
        if getattr(getattr(_dsh_bpy, 'data', None), '_dsh_data_proxy', False):
            residual.append('bpy.data')
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
        'jobsRunning': jobs_running,
        'window': 'exec（主线程同步期间）',
    }


_dsh_carrier = _dsh_sys.modules[${stateName}]
_dsh_carrier._dsh_prep = _dsh_prep
_dsh_carrier._dsh_finalize = _dsh_finalize
_dsh_carrier._dsh_proxy_in_place = _dsh_proxy_in_place
_dsh_carrier._dsh_snapshot = _dsh_snapshot

_dsh_prep()
`
}