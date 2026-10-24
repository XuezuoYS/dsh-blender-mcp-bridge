# Helpers

These 26 Python helpers are copied verbatim from the upstream
`create-3d-model` skill library and run on demand through
`blender_mcp_helpers` / `blender_mcp_helper`.

## Provenance

- Source: [CheshireJCat/create-3d-model-skill](https://github.com/CheshireJCat/create-3d-model-skill),
  `skills/create-3d-model/references/modules/*/scripts/` (MIT, Copyright (c) 2026 CheshireJCat).
- Upstream lineage: `RobLe3/cc-blender-skill` 1.3.0, commit
  `11016c9a5847897491dde935c346571bd7548e3d` (MIT, Copyright (c) 2026 RobLe3).
- License texts: `LICENSES/CheshireJCat-MIT.txt` and `LICENSES/RobLe3-MIT.txt`.

The files are unmodified. This project only adds the catalog
(`lib/helperCatalogData.js`), argument validation, path limits and the
subprocess runtime around them.

## Runtime split

- `surface_texture_coverage_audit.py` runs inside Blender through the plugin's
  trusted exec channel (read-only; no undo step, no snapshot).
- Every other helper runs in a separate Python process, spawned without a
  shell. Helpers that need third-party packages use the plugin-managed venv at
  `DSH_HOME/dsh-blender-mcp-bridge/python/venv`; dependency-free helpers may
  run on Blender's bundled Python. Outputs must land inside the task directory.
- `skill_graph_audit`, `release_readiness_check` and
  `sanitize_skill_contributions` are maintenance helpers; they stay hidden
  until `helper.enableMaintenanceHelpers` is turned on.

## Installing dependencies

The user installs the environment from the plugin settings
(Settings → Blender MCP → Python helper environment) or runs:

```sh
node scripts/setupAnalysis.js
```

It uses Blender's bundled Python as the base, creates the fixed venv and
installs `requirements-analysis.lock.txt`. The plugin never installs packages
during a tool call.
