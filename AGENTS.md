# dsh-blender-mcp-bridge

> 当前处于 dev 开发周期，代码与功能上破坏性变更无需做兼容和迁移。

此项目是对 Deepseek Harness（以下简称 DSH） 开发的插件，旨在包装与桥接 Blender MCP Add-on，使 DSH 上的模型可便捷对接接入当前用户工作中的 Blender 以辅助创作，且满足基础安全需要。

目标兼容 DSH 最新 rc 版本，信源请参考官方文档。

[DSH 仓库链接](https://github.com/deepseek-ai/deepseek-harness)

[Blender MCP 文档](https://www.blender.org/lab/mcp-server/)

## 项目内容细节

### 开发原因

Blender 官方 MCP 服务器在安全性和实现效果方面均烂的要死，dsh-blender 插件为了兼容前向 Blender 版本而绕过了 Blender MCP Add-on 且更偏向于批量操作和无感操作，因此此插件将着重于辅助用户进行安全的、可审计的工程创作。

> 需要与 dsh-blender 插件共存兼容。

[dsh-blender](https://github.com/CheshireJCat/blender)

### 基础安全需要

此插件有基础安全要求，需要在提示词提示 AI 且拦截 AI 危险行为。以下为细则：

1. 禁止保存用户当前的会话窗口，将修改纳入历史记录，用户可通过 `Ctrl + Z` 逐步撤销修改
2. 临时工作目录为当前 .blend 文件所在的目录下设的子目录，子目录命名格式为 `.dsh-blender-{AI 视情况命名}` ，每会话中 AI 视任务创建一个或多个工作目录，工作完成后目录不删除，但目录过多 AI 可询问用户是否删除旧的或无用的。
3. 临时工作目录下保存快照，默认3个，提供配置项可自定义保存内容。

### 知识库

本项目知识库直接让 AI 去看官方文档，网址为 https://docs.blender.org/manual/zh-hans/5.2/# 其中5.2是对应的版本号，提供给 AI 时自动识别当前打开的 Blender 版本并拼合

## 工作约束

为保证安全、可靠的与人类开发者协同开发，你需要遵守以下规范：

- 命名风格：对于函数名、变量名、文件名，默认使用小驼峰 `camelCase` 命名，对于类名，默认使用大驼峰 `PascalCase` 命名。
- 请尽可能保持代码的**模块化、高可维护性、少冗余代码、架构与代码层面低耦合**，若用户无要求，在不影响**模块化、高可维护性、少冗余代码、架构与代码层面低耦合**的前提下，执行*最小修改面*。
- 你需要严谨按照要求和约束，若你对于任意问题不确定、未知或拿不准，认为我的要求模糊的，请先向我提问后得到准确回答后再进行。
- 在 `.agents/` 文件夹（若无请自行创建）下储存 Agent 工作用临时文档、文件和给 AI 查阅的备忘和内容，与 `docs/` 内的文档产生冲突时，以 `docs/` 标准要求。
- `.agents/` 下的 Agent 工作文件在工作完成后需整理、压缩、归档入日期文件名。
- 为保证可维护性，`docs/` 与 `.agents/` 下的文档应保持简洁、通俗、口语化，禁止使用少见、偏僻、翻译腔、AI 常用的难读术语，**全部文档应高效优雅**且便于人类程序员理解，语言风格符合 `AGENTS.md`。
- 未经明确允许，禁止进行 Git 操作。
- 未经明确允许，禁止修改 `AGENTS.md`。

### 注释

JSDoc + `jsconfig.json` 的 `checkJs`（等价于全库 `// @ts-check`）语义；

函数注释风格参考：

```js
/**
 * 函数描述
 *
 * @default paramB = 'some text', paramI = 123
 * @param {string} paramA paramA的描述
 * @param {string} [paramB] paramB的描述
 * @param {number} [paramI] paramI的描述
 * @returns {any} 返回值描述
 */
function aFunction(paramA, paramB = 'some text', paramI = 123) {}
```

注意：应在全部 @param 前写一行式 @default 可包含多个赋值

类注释风格参考（`export class` 之前**紧挨着**的那一段就是 IDE hover 能看到的唯一一段）：

```js
/**
 * 类描述（一句话摘要）
 *
 * 契约摘要：本类对外承诺的关键行为，一到三行写完；
 *
 * 常用入口：
 * - aMethod: 说明
 * - bMethod: 说明
 * ...
 */
export class AClass {
    /**
     * 方法描述
     */
    static aStaticMethod() {}
}
```

### git

**未经明确指令，禁止操作 git，指令有效期仅一轮内有效**

git 提交使用约定式提交，例：

```
feat: 新功能

- 细节1
- 细节2

```