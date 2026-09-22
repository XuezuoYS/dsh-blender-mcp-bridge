// SPDX-License-Identifier: GPL-3.0-or-later
// L1 静态判定与纯函数的回归用例（`20260922` 实机报告 P0/P1 的逐条守卫；
// 报告的结论与判据复盘在 `.AGENTS/ver-dev20260922-regression.md`）。
//
// **为什么必须有这个文件**：报告最重的一条判据教训是"这套护栏的**静态可读性差于它的实际强度**"
// ——照源码判断某条路径能不能绕过**不可靠**（审计以为 `copyfile` 能越界，实测被内部 `open` 拦了；
// 以为 `makedirs` 没人管，实测 L2 拦了）。所以每条覆盖都要有**能失败的断言**，
// 而不是"读代码觉得接上了"。
//
// 副作用边界：**纯只读纯函数**，不连 Blender、不写盘、不需要 add-on。

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { planRotation } from '../lib/checkpoint.js'
import { scanRequest } from '../lib/requestPolicy.js'
import { FILE_OUTPUT_OPS, isPathArgument, pathArgsOf } from '../lib/writeOps.js'

/** 仓库根。 */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/** 任务目录（用例里的唯一可写范围）。 */
const ROOT_DIR = 'C:/tasks/.dsh-blender-x'

/** 模拟的 Blender 进程 cwd（**实测**在 Program Files 下）。 */
const CWD = 'C:/Program Files/Blender'

/**
 * 跑一次 L1 扫描。
 *
 * @param {string} code 源码。
 * @returns {import('../lib/requestPolicy.js').ScanResult} 扫描结果。
 */
const scan = (code) => scanRequest({ code, allowRoot: ROOT_DIR, blenderCwd: CWD })

/** 越界目标（既不在任务目录下，也不是任何特殊路径）。 */
const OUT = 'D:/other'

/** @type {{name: string, ok: boolean, detail: string}[]} */
const results = []

/**
 * 记录一条检查。
 *
 * @param {string} name 检查名。
 * @param {boolean} ok 是否通过。
 * @param {string} detail 细节。
 */
function check(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}\n      ${detail}`)
}

/** 主流程。 */
async function main() {
  // ---- P0-1：`io.open` 必须与 `builtins.open` 同等受检 ----
  // 实测绕过：`io.open(界外,'w')` 当时 ALLOWED，因为只包裹了 `builtins.open`。
  const ioOpen = scan(`io.open(r'${OUT}/b.txt','w')\n`)
  check('P0-1 `io.open` 字面量越界写被 L1 拒绝',
    ioOpen.blocked === true && ioOpen.reason === 'write-outside-scope',
    `blocked=${ioOpen.blocked} reason=${ioOpen.reason} path=${ioOpen.blockedPath}`)

  const builtinsOpen = scan(`open(r'${OUT}/b.txt','w')\n`)
  check('P0-1 裸 `open` 与 `io.open` 判定一致（同一个规则）',
    builtinsOpen.blocked === true && builtinsOpen.reason === ioOpen.reason,
    `builtins=${builtinsOpen.reason} io=${ioOpen.reason}`)

  // 符号模式（`os.O_CREAT|os.O_WRONLY`）静态判不出写/读：**不得静默放行**，
  // 必须登记为"无法判定、由 L2 兜底"。
  const symbolicMode = scan("import os\nos.open('D:/other/c.bin', os.O_CREAT|os.O_WRONLY)\n")
  check('P0-1 符号模式的 `open` 不被静默放行（登记为动态、交 L2）',
    symbolicMode.blocked === false && symbolicMode.issues.some(item => item.pathKind === 'dynamic'),
    `blocked=${symbolicMode.blocked} issues=${symbolicMode.issues.length}`)

  // ---- P0-2：改名/移动作族必须判**全部实参**（源与目标） ----
  // 实测绕过：`shutil.move(界内 → 界外)`、`os.rename`、`os.replace` 的目标端全都不判。
  /** @type {[string, string, string][]} 标签 / 源码 / 期望规则 */
  const moveCases = [
    ['os.rename', `import os\nos.rename(r'${ROOT_DIR}/a.txt', r'${OUT}/z.txt')\n`, 'delete-outside-scope'],
    ['os.replace', `import os\nos.replace(r'${ROOT_DIR}/a.txt', r'${OUT}/z.txt')\n`, 'delete-outside-scope'],
    ['shutil.move', `import shutil\nshutil.move(r'${ROOT_DIR}/a.txt', r'${OUT}/dir')\n`, 'delete-outside-scope'],
    ['shutil.copyfile', `import shutil\nshutil.copyfile(r'${ROOT_DIR}/a.txt', r'${OUT}/c.txt')\n`, 'delete-outside-scope'],
    ['shutil.copytree', `import shutil\nshutil.copytree(r'${ROOT_DIR}/renders', r'${OUT}/copy')\n`, 'delete-outside-scope'],
    ['os.truncate', `import os\nos.truncate(r'${OUT}/f.bin', 0)\n`, 'delete-outside-scope'],
  ]
  for (const [label, code, rule] of moveCases) {
    const result = scan(code)
    check(`P0-2 \`${label}\` 的**目标端**越界被拒（${rule}）`,
      result.blocked === true && result.reason === rule,
      `blocked=${result.blocked} reason=${result.reason} path=${result.blockedPath}`)
  }

  // 界内改名必须**放行**（否则收紧会误伤正常的中间产物整理）
  const insideMove = scan(`import os\nos.rename(r'${ROOT_DIR}/a.txt', r'${ROOT_DIR}/b.txt')\n`)
  check('P0-2 界内改名仍然放行（收紧不误伤）',
    insideMove.blocked === false,
    `blocked=${insideMove.blocked} reason=${insideMove.reason ?? '-'}`)

  // ---- P0-4：文件输出算子（此前完全不在拦截面内）----
  const exportOp = scan(`bpy.ops.export_scene.obj(filepath='${OUT}/o.obj')\n`)
  check('P0-4 `export_scene.obj` 越界落盘被拒',
    exportOp.blocked === true && exportOp.reason === 'write-outside-scope',
    `blocked=${exportOp.blocked} reason=${exportOp.reason} path=${exportOp.blockedPath}`)

  const librariesPositional = scan(`bpy.data.libraries.write('${OUT}/lib.blend', set())\n`)
  check('P0-4 `bpy.data.libraries.write` 的**位置**实参越界被拒',
    librariesPositional.blocked === true,
    `blocked=${librariesPositional.blocked} path=${librariesPositional.blockedPath}`)

  const librariesKeyword = scan(`bpy.data.libraries.write(filepath='${OUT}/lib2.blend', datablocks=set())\n`)
  check('P0-4 `bpy.data.libraries.write` 的**关键字**实参越界被拒',
    librariesKeyword.blocked === true,
    `blocked=${librariesKeyword.blocked} path=${librariesKeyword.blockedPath}`)

  // 无落盘实参的算子（`image.save()`：目标来自 `image.filepath` 数据块属性）**必须如实登记为不可判定**，
  // 不得假装覆盖（../docs/contract.md 的诚实边界）。
  const noArgSave = scan("img = bpy.data.images['x']\nimg.save()\n")
  check('P0-4 无落盘实参的写法被**如实标注为不可判定**（不假装拦住）',
    noArgSave.blocked === false,
    `blocked=${noArgSave.blocked}（这类目标只有 L2 的内部 open 钩子能兜底，不在 L1 的判定能力内）`)

  // ---- 变量绑定：`p = "…"; open(p,'w')` ----
  // 早期实现把"已提取的字面量值"传给绑定解析器，而变量名从来不是字面量 → **整张绑定表等于没接线**。
  const bound = scan(`p = '${OUT}/v.txt'\nopen(p, 'w')\n`)
  check('变量绑定的越界写被拒（绑定表真的接线了）',
    bound.blocked === true && bound.blockedPath === bound.blockedPath,
    `blocked=${bound.blocked} path=${bound.blockedPath}`)

  // ---- 一次拒绝要能列出**全部**命中（报告 §6.1：三个载荷同发只报第一个）----
  const multi = scan(`import os\nopen(r'${OUT}/a.txt','w')\nos.rename(r'${ROOT_DIR}/a', r'${OUT}/b')\nbpy.ops.wm.save_mainfile()\n`)
  check('多命中时 `issues` 列出全部（由 tools 层落到 `blocked.blockedAll`）',
    multi.blocked === true && multi.issues.length >= 3,
    `blocked=${multi.blocked} reason=${multi.reason} 命中 ${multi.issues.length} 条：${multi.issues.map(item => item.rule).join(', ')}`)

  // ---- 环境写入口（回归：`/g` 游标泄漏曾让同一段第二次不拦）----
  const envCode = 'bpy.context.preferences.view.show_splash = False\n'
  const envRuns = [scan(envCode), scan(envCode), scan(envCode)]
  check('环境写入口连扫三次判定一致（不出现 true/false/true 交错）',
    envRuns.every(item => item.blocked === true && item.reason === 'environment-change'),
    `三次 = ${envRuns.map(item => item.reason ?? 'allow').join(' / ')}`)

  // ---- 写操作表：L1 与 L2 必须共用同一张表（否则会出现"L1 拦、L2 放"）----
  const guardSource = await readFile(join(ROOT, 'lib', 'guardPayload.js'), 'utf8')
  check('L2 载荷从 `lib/writeOps.js` 取算子表（单一真相源，不各写一份）',
    guardSource.includes("from './writeOps.js'")
    && guardSource.includes('FILE_OUTPUT_OPS')
    && !/const CONTROLLED_OPS = \{/u.test(guardSource),
    `guardPayload 引用 writeOps=${guardSource.includes("from './writeOps.js'")}；`
    + `自带 CONTROLLED_OPS 字面量=${/const CONTROLLED_OPS = \{/u.test(guardSource)}（应为 false）`)

  check('写操作表覆盖报告点名的四条路径',
    Object.keys(FILE_OUTPUT_OPS).includes('libraries')
    && Object.keys(FILE_OUTPUT_OPS.export_scene ?? {}).includes('obj')
    && isPathArgument('filepath') && isPathArgument('output_path')
    && pathArgsOf('libraries', 'write').includes('filepath'),
    `表键=${Object.keys(FILE_OUTPUT_OPS).join(', ')}`)

  // ---- P0-3 的**代码层**断言：不得再产出 `undefined` 属性 ----
  // `restored: payload.restored ?? undefined` 会写出一个值为 undefined 的属性，
  // DSH 出参校验判它"不是无损 JSON"，整个工具调用失败（而文件其实写出来了）。
  const toolsSource = await readFile(join(ROOT, 'lib', 'tools.js'), 'utf8')
  const captureSection = toolsSource.slice(
    toolsSource.indexOf('export function makeCaptureTool'),
    toolsSource.indexOf('export function makeDocsTool'),
  )
  // 必须**剥掉注释**再断言：修复说明本身就写着 `payload.restored ?? undefined`（旧写法），
  // 直接全文匹配会把"解释 bug 的注释"当成 bug 本身——本仓已有一次同族教训（R3 的注释假绿）。
  //
  // ⚠️ 这里第一版只剥了"` // …`"（`//` 前有空格）的行内注释，**漏掉了以空白开头、`//` 在行首**的
  // 整行注释——而工具层里的整行注释正是缩进过的，于是假红（报告里那两条 `?? undefined`
  // 都在注释里）。判据要同时认三种形态：行首 `//`、缩进后的 `//`、以及行尾的 `//`。
  const captureCode = captureSection
    .split('\n')
    .map(line => line.replace(/^\s*\/\/.*$/u, '').replace(/\s\/\/.*$/u, ''))
    .join('\n')
  const undefinedProps = captureCode.match(/\?\?\s*undefined/gu) ?? []
  check('P0-3 `capture` 的**代码**里不再有 `?? undefined`',
    captureSection.length > 0 && undefinedProps.length === 0,
    `capture 分支 ${captureSection.length} 字符（剥注释后）里 \`?? undefined\` 出现 ${undefinedProps.length} 次（应为 0）`)

  // 同一处修复的另一半：`window` / `area` 两个分支也必须真的调用 `_restore()`
  // （此前只有 `viewport` 分支调，那两个分支的 `restored` 恒为 None）。
  const restoreCalls = (captureSection.match(/_restore\(\)/gu) ?? []).length
  check('P0-3 `capture` 的三个目标分支都结算 restore（I15）',
    restoreCalls >= 4,
    `_restore() 出现 ${restoreCalls} 次（viewport/area/window 三支 + 异常支 + 兜底支）`)

  // ---- P1-2 检查点粒度：`perTurn='turn'` 复用、`'write'` 逐写各落一份 ----
  const duringWrite = planRotation([{ path: 'a', bytes: 1 }, { path: 'b', bytes: 1 }, { path: 'c', bytes: 1 }], 3, 'during-write')
  check('P1-2 `during-write` 阶段**不删任何旧份**（I8：写盘失败时旧历史必须还在）',
    duringWrite.remove.length === 0 && duringWrite.writeNext === true,
    `回收 ${duringWrite.remove.length} 份、writeNext=${duringWrite.writeNext}（先写第 n+1 份，轮次结束才回落）`)

  check('P1-2 `keep=1` 时 `during-write` 不清空唯一一份备份',
    planRotation([{ path: 'only', bytes: 1 }], 1, 'during-write').remove.length === 0,
    'keep=1、现存 1 份 → 写前回收 0 份')

  const afterRound = planRotation([{ path: 'a', bytes: 1 }, { path: 'b', bytes: 1 }, { path: 'c', bytes: 1 }, { path: 'd', bytes: 1 }], 3, 'after-round')
  check('P1-2 `after-round` 回落到 keep 份（保留的是最新的）',
    afterRound.remove.length === 1 && afterRound.remove[0] === 'a',
    `回收 = ${afterRound.remove.join(', ')}（最早的一份）`)

  const oversized = planRotation(
    [{ path: 'big', bytes: 900 }, { path: 'small', bytes: 1 }, { path: 'mid', bytes: 2 }],
    2,
    'after-round',
    500,
  )
  check('P1-2 `maxBytes` **参与轮换**（超限的旧份优先回收，不再只告警）',
    oversized.remove.includes('big'),
    `回收 = ${oversized.remove.join(', ')}（big 是唯一超限的一份）`)

  assert.ok(planRotation([], 3, 'after-round').remove.length === 0)
}

await main()

for (const item of results) {
  test(item.name, () => {
    assert.ok(item.ok, item.detail)
  })
}

const failed = results.filter(item => !item.ok)
console.log(`\n# ${results.length - failed.length}/${results.length} 通过`)
for (const item of failed) console.log(`#   - ${item.name}`)
if (failed.length > 0) process.exitCode = 1
