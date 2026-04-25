---
name: generate-ui
description: Use when asked to generate, update, or modify the UI of this app — create forms, dashboards, profile pages, or any visual layout. Triggers on requests like "幫我建一個表單", "更新 UI", "新增一個頁面", or any instruction to change what the app displays.
---

# Generate UI with A2UI

Generate a valid A2UI v0.9 JSON payload and write it to `scripts/ui.json` inside the skill folder. The running app polls this file every 2 seconds and renders changes automatically.

## Workflow

Execute these steps in order:

0. **Load component schemas** — before writing any JSON, read all `.md` files in the `references/` directory (same directory as this SKILL.md). Each file documents one available component: its props table and a JSON example. Use `list_dir` on `references/` to see available components, then `read_file` each one you need.
1. **Write UI** — use `cli.cjs set` to write the complete A2UI JSON to `scripts/ui.json`
2. **Start server** — run `node scripts/cli.cjs serve` in async mode from the skill folder. This starts the static server on port 5173 **and** opens the browser automatically.

For step 2:
```
node <path-to-skill-folder>/scripts/cli.cjs serve
```
Run in async mode. If port 5173 is already in use (error: EADDRINUSE), skip step 2 and run `node scripts/cli.cjs open` instead.

### Subsequent UI updates (incremental)

After the server is running, prefer incremental updates over rewriting the full JSON:

1. **Read current structure** — run `node scripts/cli.cjs read` to inspect the existing component tree
2. **Update only what changed** — run `node scripts/cli.cjs update '<json>'` with only the modified or new components

Only use `set` when replacing the entire UI surface (e.g. loading a completely different screen).

## CLI Reference

All CLI commands use `node scripts/cli.cjs` from the skill folder:

| Subcommand | Description |
|---|---|
| `serve` | Start static server on port 5173 and open browser |
| `open` | Open `http://localhost:5173` in default browser (server already running) |
| `read` | Print current `ui.json` to stdout |
| `set '<json>'` | Replace entire `ui.json` with provided JSON |
| `update '<json>'` | Merge components by ID — replace existing, append new |

Examples:
```
# Initial setup
node scripts/cli.cjs set '[{"version":"v0.9","createSurface":{...}},{"version":"v0.9","updateComponents":{...}}]'

# Read current structure before patching
node scripts/cli.cjs read

# Update a single component
node scripts/cli.cjs update '[{"id":"submit-btn","component":"Button","variant":"secondary","child":"submit-btn-text"}]'
```

> **Note:** The built app files (index.html, assets/, etc.) live alongside `cli.cjs` in `scripts/`. Run `pnpm build:skill` in the project root to rebuild them, then `pnpm sync:skill` to sync the skill to `.agents/skills/generate-ui/`.

## Output Target

Always write the complete JSON array to **`scripts/ui.json`** inside the skill folder (i.e. `skills/generate-ui/scripts/ui.json` in the project, or the same relative path inside `.agents/skills/generate-ui/scripts/ui.json` when running from the agent context). Do NOT write to `public/ui.json`.

## A2UI v0.9 Message Format

A `ui.json` file is a **JSON array** of messages processed in order:

```json
[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "main",
      "catalogId": "custom"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "main",
      "components": [ ...component list... ]
    }
  }
]
```

### Rules

- Always include `createSurface` as the first message with `surfaceId: "main"` and `catalogId: "custom"`
- All components go inside one `updateComponents` message
- Every component MUST have a unique `"id"` string
- Components reference children by ID (never nest inline)
- One component MUST have `"id": "root"` — it is the entry point
- Component names are **PascalCase**: `Text`, `Button`, `Column`, etc.

## Component Reference

Component schemas are auto-generated from the catalog. See the `references/` directory next to this SKILL.md for individual component documentation (props table + JSON example per component).

Load them in Step 0 of the Workflow above before writing any JSON.

## ID Naming Convention

Use kebab-case descriptive IDs: `login-form`, `email-field`, `submit-btn`, `submit-btn-text`.
For Button labels, always suffix the Text component with `-text`: `submit-btn-text`.

## Complete Example: Login Form

```json
[
  {
    "version": "v0.9",
    "createSurface": { "surfaceId": "main", "catalogId": "custom" }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "main",
      "components": [
        { "id": "root", "component": "Column", "children": [{"id": "login-card"}] },
        { "id": "login-card", "component": "Card", "child": "login-form" },
        { "id": "login-form", "component": "Column", "children": [
          {"id": "title"}, {"id": "email-field"}, {"id": "password-field"}, {"id": "actions"}
        ]},
        { "id": "title", "component": "Text", "text": "登入", "variant": "h2" },
        { "id": "email-field", "component": "TextField", "label": "電子郵件", "value": "", "variant": "shortText" },
        { "id": "password-field", "component": "TextField", "label": "密碼", "value": "", "variant": "obscured" },
        { "id": "actions", "component": "Row", "justify": "end", "children": [{"id": "submit-btn"}] },
        { "id": "submit-btn-text", "component": "Text", "text": "登入" },
        { "id": "submit-btn", "component": "Button", "variant": "primary", "child": "submit-btn-text" }
      ]
    }
  }
]
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Nested component objects | Always reference children by ID string |
| Missing `"id": "root"` | Every payload needs a root component |
| `catalogId: "basic"` | Must be `"custom"` for this project |
| Button without child | Create a Text component and reference via `child` |
| Tabs `child` as array | Each tab takes a single `child` ID string |
| Duplicate IDs | Every component ID must be globally unique |
