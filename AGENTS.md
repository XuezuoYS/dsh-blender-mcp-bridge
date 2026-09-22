# dsh-blender-mcp-bridge

此项目是对 Deepseek Harness（以下简称 DSH） 开发的插件，旨在包装与桥接 Blender MCP Add-on，使 DSH 上的模型可便捷对接接入当前用户工作的 Blender 以辅助创作，且满足基础安全需要。

[DSH 仓库链接](https://github.com/deepseek-ai/deepseek-harness)

[Blender MCP 文档](https://www.blender.org/lab/mcp-server/)

## 项目内容细节

### 基础安全需要

此插件有基础安全要求，需要在提示词提示 AI 且拦截 AI 危险行为。以下为细则：

1. 禁止保存用户当前的会话窗口，将修改纳入历史记录，用户可通过 `Ctrl + Z` 逐步撤销修改
2. 临时工作目录为当前 .blend 文件所在的目录下设的子目录，子目录命名格式为 `dsh-blender-{AI 视情况命名}` ，每会话中 AI 视任务创建一个或多个工作目录，工作完成后目录不删除，但目录过多 AI 可询问用户是否删除旧的或无用的。
3. 临时工作目录下保存快照，默认3个，提供配置项可自定义保存内容。

### 知识库

本项目知识库为迁移转译自 blender 官方提供的 MCP Server 内置的知识库。

## 工作约束

### 工作记忆

在本项目根目录创建 `.AGENTS` 文件夹，需自动整理记录重要记忆为 md。

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

注意：

1. 类说明必须**紧贴 `export class X {`**，中间只允许空行；一旦隔了 `import`、常量、
   `@typedef` 块或任何函数，那段注释就归了别的节点，类 hover 为空（方法不受影响，
   因为每个方法上方就是它自己那段 JSDoc）。
2. 文件级说明写成 `/** @fileoverview … */`（或普通 `//` 注释）；`@fileoverview` 块**也不能紧贴 class**，紧贴时它会顶掉类注释。
3. `@typedef` / `@property` 一律独立成块，不与类描述同块：同块时整块被 typedef 认领，
   类 hover 为空。只能拆块，不能删（删了会丢类型并抬高 `pnpm check` 诊断数）。


### git

**未经明确指令，禁止操作 git，指令有效期仅一轮内有效**

git 提交使用约定式提交，例：

```
feat: 新功能

- 细节1
- 细节2

```