// SPDX-License-Identifier: GPL-3.0-or-later
// 受控算子名单的**单一真相源**。
//
// 为什么单独一个模块：L1（`lib/requestPolicy.js`，Node 侧静态判定）与 L2（`lib/guardPayload.js`，
// 生成的 Blender 进程内载荷）必须按**同一张表**判定。两张各写一份必定漂移——那时会出现
// "L1 拦、L2 放"或反过来的静默缺口，而这类缺口正是审计里最难发现的一种。
//
// 判定原则（I6）：**判定对象是"写路径"而不是"算子名"**。
// 本表只回答"这个算子的哪些实参是落盘目标"，越界与否仍由调用方按 `realpath` 判定。
//
// 副作用边界：**纯数据与纯函数**，不读写文件、不联网、不碰 Blender。

/**
 * 拒绝类受控算子：命中即**直接拒绝**，不看路径。
 *
 * 这些算子的语义决定了它们没有"界内的合法用法"——覆盖保存丢的是用户的文件，
 * 丢会话丢的是用户整个现场，改偏好是跨会话持久。
 *
 * ⚠️ Python 侧代理必须按**模块级**取（`bpy.ops.wm` / `bpy.ops.preferences`），
 * 因此本表是按模块组织、算子名的纯列表。
 *
 * @type {Record<string, string[]>}
 */
export const CONTROLLED_OPS = {
  wm: [
    'save_mainfile',
    'save_as_mainfile',
    'read_homefile',
    'read_factory_settings',
    'read_factory_userpref',
    'read_userpref',
  ],
  preferences: ['addon_enable', 'addon_disable', 'addon_install', 'addon_remove'],
}

/**
 * 路径受检类算子：**放行与否取决于它的落盘实参**。
 *
 * 修正报告 P0-4：此前 `CONTROLLED_OPS` 只列 `wm` / `preferences`，于是
 * `bpy.data.libraries.write` / `export_scene.*` / `image.save_as` / `wm.save_homefile`
 * 这类**能往任意位置落盘**的算子完全不在拦截面内。
 *
 * 值为该算子在 Blender 5.2 上**确认过**的落盘实参名；运行时另有一条兜底：
 * 任何以 `filepath` 或 `path` 结尾的关键字实参也一并受检（见 Python 载荷的 `_dsh_ensure_paths`）。
 *
 * @type {Record<string, Record<string, string[]>>}
 */
export const FILE_OUTPUT_OPS = {
  wm: {
    save_as_mainfile: ['filepath'],
    save_homefile: ['filepath'],
    alembic_export: ['filepath'],
    usd_export: ['filepath'],
    collada_export: ['filepath'],
    obj_export: ['filepath'],
    stl_export: ['filepath'],
    fbx_export: ['filepath'],
    gpencil_export: ['filepath'],
  },
  image: {
    save_as: ['filepath', 'path'],
    // `image.save()` **没有任何落盘实参**——它的目标由 `image.filepath` 这个**数据块属性**决定，
    // 静态与运行期都无从判定它写到哪。如实登记在这里：
    // 名字在表里表示"我们确实考虑过它"，空数组表示"可判定的实参集为空"。
    // 这与 `docs/contract.md` §8.6 的诚实边界一致：**不得**声称它已被覆盖。
    save: [],
  },
  export_scene: {
    obj: ['filepath'],
    fbx: ['filepath'],
    gltf: ['filepath'],
    gltf2: ['filepath'],
    x3d: ['filepath'],
    stl: ['filepath'],
    ply: ['filepath'],
    collada: ['filepath'],
    alembic: ['filepath'],
    usd: ['filepath'],
  },
  export_anim: {
    bvh: ['filepath'],
    gltf: ['filepath'],
    gltf2: ['filepath'],
  },
  export_mesh: {
    ply: ['filepath'],
    stl: ['filepath'],
  },
  libraries: {
    // `bpy.data.libraries.write(filepath, datablocks, ...)`：第一个实参就是落盘目标。
    //
    // 键用 `libraries`（而不是 `data`）：这样 Python 侧与 L1 侧都能用**同一个模块路径**
    // `bpy.data.libraries` 去查表，不必各自再映射一次——两份映射就是两处会漂移的地方
    // （首版实测：L1 查 `FILE_OUTPUT_OPS['libraries']` 落空，于是这条路径在 L1 完全没判）。
    //
    // 它不在 `bpy.ops` 上，所以由 `bpy.data` 层代理覆盖；动态构造的目标由 `open`/`os.open`
    // 钩子在其内部真正调用的那一层兜底。这条限制如实登记，不假装全覆盖。
    write: ['filepath'],
  },
}

/**
 * 判定一个关键字实参名是否属于"落盘目标"。
 *
 * 两级判定：① 显式名单（`FILE_OUTPUT_OPS` 里为该算子列出的实参名）；
 * ② 兜底后缀规则——任何以 `filepath` 或 `path` 结尾的关键字实参都算。
 * 后缀规则抓的是 `binary_path` / `output_path` / `filepath` 这类变体，
 * 它们在不同 Blender 版本间改过名，而**名字改了不等于不该拦**。
 *
 * @default explicit = []
 * @param {string} name 关键字实参名。
 * @param {string[]} [explicit] 该算子的显式落盘实参名（优先）。
 * @returns {boolean} 是否为落盘目标。
 */
export function isPathArgument(name, explicit = []) {
  if (typeof name !== 'string' || name === '') return false
  if (explicit.includes(name)) return true
  const lower = name.toLowerCase()
  return lower === 'filepath' || lower.endsWith('_filepath') || lower === 'path' || lower.endsWith('_path')
}

/**
 * 取某个算子的显式落盘实参名（不存在时返回空数组）。
 *
 * @default moduleName = '', opName = ''
 * @param {string} moduleName 算子模块名，如 `export_scene`。
 * @param {string} [opName] 算子名；省略时表示"取该模块全部"。
 * @returns {string[]} 落盘实参名。
 */
export function pathArgsOf(moduleName, opName = '') {
  const perModule = FILE_OUTPUT_OPS[moduleName]
  if (perModule === undefined) return []
  if (opName !== '') return perModule[opName] ?? []
  /** @type {string[]} */
  const out = []
  for (const names of Object.values(perModule)) {
    for (const name of names) out.push(name)
  }
  return [...new Set(out)]
}

/**
 * 该模块是否有任何路径受检的算子。
 *
 * 用于在 Python 侧决定"要不要为这个模块装代理"——没有就不装，
 * 少一层包装就少一处可能踩到上游 `_op_create_function` 弱沙箱的地方。
 *
 * @param {string} moduleName 算子模块名。
 * @returns {boolean} 是否需要代理。
 */
export function hasFileOutputOps(moduleName) {
  const perModule = FILE_OUTPUT_OPS[moduleName]
  return perModule !== undefined && Object.keys(perModule).length > 0
}
