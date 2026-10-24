<!--
Adapted from CheshireJCat/create-3d-model-skill `skills/create-3d-model/`
(MIT, Copyright (c) 2026 CheshireJCat), which preserves modules from
RobLe3/cc-blender-skill (release 1.3.0, commit 11016c9a..., MIT,
Copyright (c) 2026 RobLe3).
Changes: BlenderMCP/Codex tool names mapped to blender_mcp_*; save flow
replaced by task-dir snapshots + Ctrl+Z; live-session safety rules;
English-only; helper scripts exposed through blender_mcp_helper.
This is a self-curated adaptation, not an official subset.
-->

# Blender Live Session

Work inside the user's **currently open Blender session** through the
`blender_mcp_*` tools. The session may contain unsaved work: never save the
`.blend`, never open another file, never quit Blender, never change
preferences. The plugin blocks the obvious calls; the guard is a mistake
guard, not a sandbox.

## Ground rules

1. **Inspect first**: `blender_mcp_status`, then `blender_mcp_inspect`.
2. **Choose the `blender_mcp_exec` mode.** Write code uses the default mode:
   the plugin snapshots before the call according to the snapshot policy
   (default `adaptive`: the first write of a turn, every 10 writes, and
   delete-like calls), then pushes one undo step; group snippets with `batch`.
   Inspection code uses `readOnly: true`: no snapshot, no object diff, no undo
   step — unless the call actually changed the scene, then one step is pushed
   anyway. Code that pushes its own undo steps can add more. Tell the user
   `Ctrl+Z` steps back; to go further back the user opens a snapshot in Blender,
   the plugin never restores one by itself.
3. **Write only under the task directory** (`.dsh-blender-<task>` next to the
   `.blend`); OS temp files are allowed for scratch work. Blocked writes return
   `suggestedPath`; do not retry the same path.
4. **Do not change render settings on your own.** Preview renders use the exact
   width/height/samples the user gave (`blender_mcp_render` restores settings).
   For a long production render pass `timeoutMs` (1 s–30 min) instead of the
   120 s default, or use `background: true` to return once the render started.
   When a render returns `timeout` or `running`, Blender is still rendering:
   call `blender_mcp_render_status` with the jobId instead of rendering again.
   The status tool only reads the task directory, so it also works while
   Blender is busy; every other Blender tool will time out until the render
   finishes. The settings are restored when the render finishes; the plugin
   does not cancel it for you.
5. **Never roll back.** If something looks wrong (blocked write, `.blend`
   changed on disk, timeout, guard self-check failure, broken scene), stop, tell
   the user what happened with the snapshot path, and end the turn. The user
   decides whether to undo or open a snapshot.
6. **Visual validation**: capture (`blender_mcp_capture`) or render
   (`blender_mcp_render`) after a blockout and before claiming completion. A
   non-empty image file is not visual validation; look at it.
7. **Manual**: when unsure about an API, read `status.docs.manualEn`.

## Workflow

### 1. Establish the target

Classify the input: text, one image, multiview/orthographic, wireframe, texture
pack, or an existing asset. Record subject, dimensions, style, delivery format,
and unknowns. For one image, state depth/scale/occlusion assumptions.

### 2. Plan before mutating

Define units, orientation, object boundaries, stable names, collection
ownership, modifier strategy, and validation views. Prefer creating a
task-specific collection; leave unrelated objects alone.

### 3. Blockout to detail

Build silhouette and proportions with the fewest primitives, capture a
screenshot, fix scale/orientation/framing, then add detail. Prefer `bpy.data`
and `bmesh` over operators; when using operators, set active object, selection
and mode explicitly. Split work into small retryable chunks and print compact
evidence (`result = {...}`).

### 4. Validate

After each phase verify names, transforms, dimensions, parents, modifiers,
topology counts, materials and accidental duplicates (send these checks with
`readOnly: true`). Inspect a screenshot after the blockout and a render before
calling the model finished.

### 5. Snapshots and handoff

The plugin snapshots automatically. `adaptive` (the default) copies before the
first write of a turn, every 10 writes, and delete-like code; `turn` keeps one
per turn plus delete-like code; `write` copies before every write.
`blender_mcp_status` reports how many writes happened since the last snapshot,
and a snapshot result carries its bytes and duration. Take an extra one with
`blender_mcp_snapshot` before a risky step; it also resets the automatic
interval. Files and reports go under the task directory. End by telling the user
what changed, how to undo it with `Ctrl+Z`, and which snapshot to open to go
further back — the plugin never restores a snapshot by itself.

## Tool mapping

| Upstream tool | Use here |
|---|---|
| `get_scene_info` / `get_object_info` | `blender_mcp_inspect` |
| `execute_blender_code` | `blender_mcp_exec` (`readOnly: true` for inspection) |
| `get_viewport_screenshot` | `blender_mcp_capture` |
| render preview / production still | `blender_mcp_render` (`timeoutMs`, `background`) |
| collect a timed-out or background render | `blender_mcp_render_status` |
| save versioned `.blend` | snapshots + `Ctrl+Z`; never save |
| analysis/validation helpers | `blender_mcp_helpers` + `blender_mcp_helper` |

## Helpers

`blender_mcp_helpers` lists 23 regular helpers (3 maintenance helpers stay
hidden unless enabled) and the status of the one managed Python environment.
Arguments are validated against the catalog; inputs must be in the workspace,
the `.blend` directory or the task directory; outputs land in the task
directory. Read the helper result and inspect any image output.

Helpers that need numpy, Pillow, OpenCV or SciPy use the plugin environment at
`DSH_HOME/dsh-blender-mcp-bridge/python/venv`. When the result says it is
missing, incomplete or broken, tell the user to open Settings → Blender MCP →
Python helper environment and install it, or to run the printed setup command;
never run `pip install` yourself. Dependency-free helpers can run on Blender's
own Python in the meantime.

## References

- `references/visual-validation.md`: image inspection gates and correction loop.
- `references/core/assembly-order.md`: phased production order.
- `references/modeling-patterns.md`: coordinates, naming, topology, modifier order.
- `references/core/common-object-dimensions.md`: real-world size table.
- `references/blender-5-compat.md`: Blender 5.x API notes.
- `references/capability-map.md`: upstream module map (domain modules not
  shipped in v1; use the helper tools and the manual instead).
