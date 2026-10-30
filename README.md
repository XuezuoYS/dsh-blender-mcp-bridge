# dsh-blender-mcp-bridge

<a href="https://awesome-dsh-plugin.com/p/XuezuoYS/dsh-blender-mcp-bridge/"><img alt="Awesome DSH Plugin" src="https://awesome-dsh-plugin.com/badge.svg"></a>

此项目是对 Deepseek Harness（以下简称 DSH） 开发的插件，旨在包装与桥接 Blender MCP Add-on，使 DSH 上的模型可便捷对接接入当前用户工作中的 Blender 以辅助创作，且满足基础安全需要。

目标兼容 DSH 最新 rc 版本，信源请参考官方文档。

[DSH 仓库链接](https://github.com/deepseek-ai/deepseek-harness)

[Blender MCP 文档](https://www.blender.org/lab/mcp-server/)

## 安装

除了通过 DSH 图形界面，还可以通过以下命令行安装：

```
dsh plugin --profile web add github:XuezuoYS/dsh-blender-mcp-bridge
```

## 使用前和运行环境

使用前请先安装 Blender (>= 5.1) 和 Blender MCP Add-on，安装此插件后请打开目标 Blender 软件，插件会自动识别当前 Blender 所有的 Python 运行库，并通过 pip 安装所需的 Python helper 脚本环境，运行环境和配置文件均位于 `$DSH_HOME/dsh-blender-mcp-bridge` 中，完成配置后即可使用。

详情设置配置信息请参考 [设置页文档](docs/settings-ui.md)

## 来源与许可

本项目以 MIT 发布（[LICENSE](LICENSE)，Copyright (c) 2026 xuezuoys）。

随包的第三方内容来自 `create-3d-model` 技能库，同样是 MIT，版权声明和许可全文随包保留：

- 直接来源：[CheshireJCat/create-3d-model-skill](https://github.com/CheshireJCat/create-3d-model-skill)，MIT，Copyright (c) 2026 CheshireJCat
- 上游血缘：[RobLe3/cc-blender-skill](https://github.com/RobLe3/cc-blender-skill)，MIT，Copyright (c) 2026 RobLe3
- 26 个 helper 和 6 个核心 references 原样复制，`SKILL.md` 为改写版

`dsh-blender`（[CheshireJCat/blender](https://github.com/CheshireJCat/blender)）只作为兼容参考，本项目没有复制它的文件。

来源清单和许可位置见 [NOTICE](NOTICE)，细节见 [引用说明](docs/refer-create-3d-model.md)。

本项目不是 DeepSeek AI、Blender Foundation 或上游作者的官方产品。

## 开发和贡献

请遵循 [AGENTS.md](/AGENTS.md) 和相关文档 [docs/](/docs/) 以及其它约定开发