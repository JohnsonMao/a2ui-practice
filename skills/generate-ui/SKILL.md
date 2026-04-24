---
name: generate-ui
description: Use when asked to generate, update, or modify the UI of this app — create forms, dashboards, profile pages, or any visual layout. Triggers on requests like "幫我建一個表單", "更新 UI", "新增一個頁面", or any instruction to change what the app displays.
---

# Generate UI with A2UI

Generate a valid A2UI v0.9 JSON payload and write it to `public/ui.json`. The running app polls this file every 2 seconds and renders changes automatically.

## Workflow

Execute these steps in order:

0. **Load component schemas** — before writing any JSON, read all `.md` files in the `references/` directory (same directory as this SKILL.md). Each file documents one available component: its props table and a JSON example. Use `list_dir` on `references/` to see available components, then `read_file` each one you need.
1. **Write UI** — generate the A2UI JSON and write to `scripts/ui.json` inside the skill folder
2. **Start server** — run `node scripts/serve.cjs` in async mode from the skill folder (the directory containing this SKILL.md)
3. **Open browser** — use the `open_browser_page` tool to open `http://localhost:5173`

For step 2:
```
node <path-to-skill-folder>/scripts/serve.cjs
```
Run in async mode. If port 5173 is already in use, skip to step 3.

> **Note:** The built app files (index.html, assets/, etc.) live alongside `serve.cjs` in `scripts/`. Run `pnpm build:skill` in the project root to rebuild them, then `pnpm sync:skill` to sync the skill to `.agents/skills/generate-ui/`.

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
