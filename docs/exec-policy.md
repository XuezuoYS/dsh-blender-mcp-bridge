# 静态检查、警告和脚本执行

插件的防护分两层：发送前的静态检查（L1）和 Blender 里的运行时 guard（L2）。两层都不是沙箱，只是“别犯低级错误”的护栏。这篇讲 L1 能做什么、警告怎么读、长脚本怎么跑。

## 1. L1 只看字面

发送前把这段 Python 当文本扫一遍，命中就整段拒绝，一个字节都不发：

- `wm.save_mainfile` / `wm.open_mainfile` / `wm.quit_blender` 这类操作；
- 任何 `.preferences`；
- `sys.exit(`；
- 任务目录之外的绝对路径，同时那一行还有写动词。

它不是解析器：动态拼出来的代码、先读文件再执行、C 层直接写盘都看不见。那部分交给 guard 兜底，但 guard 也只是误操作防护。

## 2. 警告不会拦下调用

成功执行的结果里也会出现 `warnings`：L1 的提示和 guard 的提示都在这儿，只是提示，不改变状态。

- 格式：`line 3: ...`；同一条消息命中多次会合成 `lines 3, 7, 12: ...`，超过 6 个行号写 `+N more`。
- 脚本模式的行号带上来源：`script make.py line 3: ...`。
- 常见内容：`exec(`, `eval(`, `ctypes`, `subprocess`, `os.system(`, `.save_render(`。
- 行号指的是这次送进去的代码，或者那个脚本文件。

## 3. 长脚本用 scriptPath

`exec(open("make.py").read())` 只会扫到那一行，文件里写了什么没人看过。改成：

```
{ task: 'lamp', scriptPath: 'scripts/make.py' }
```

三条硬规则：

- 只接受本次 `task` 对应任务目录里的 `.py`（相对路径，或目录内的绝对路径），跑到目录外直接拒绝；
- 发送前对文件内容跑同一套 L1，命中就整段不执行；
- 内容和 sha256 进审计，发送前再读一次文件，变了就返回 `refused`，一个字节都不发。

限制：单文件 256 KB、UTF-8、开头 BOM 会被去掉。`readOnly` 和 `scriptPath` 可以一起用。脚本运行中再去 `exec` 别的文件，L1 仍然看不见——那种写法会收到警告，别指望它被检查。

## 4. 审计里有什么

`exec` 的每条记录都带 `policyWarnings`（L1 警告原文）。脚本模式另有 `scriptPath` 和 `scriptSha256`，正文哈希统一记在 `codeSha256`。`audit.storeCode` 关掉时照样记路径和哈希，只是不存正文。
