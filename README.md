# dsh-blender-mcp-bridge

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

详情设置配置信息请参考 [设置页文档](/docs/settings-ui.md)

## 上游

此项目使用了 [CheshireJCat/create-3d-model-skill](https://github.com/CheshireJCat/create-3d-model-skill) 作为技能库和 helpers。

此项目参考了 [CheshireJCat/blender](https://github.com/CheshireJCat/blender)（`dsh-blender`） 作为利用 `create-3d-model-skill` 的参考

详情请参见 [对应文档](/docs/refer-create-3d-model.md)

## 开发和贡献

请遵循 [AGENTS.md](/AGENTS.md) 和相关文档 [docs/](/docs/) 以及其它约定开发