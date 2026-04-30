---
name: generate-ui
description: Use when asked to generate, update, or modify the UI of this app. Triggers on UI creation, form building, dashboard layout, or any visual change request.
---

# Generate UI with A2UI

Generate a valid A2UI v0.9 JSON payload and write it to `scripts/ui.json` inside the skill folder. The running app polls this file every 2 seconds and renders changes automatically.

## When NOT to Use

Do NOT trigger this skill for requests that do not require visual UI changes:
- Modifying business logic, data calculations, or API endpoints without changing the displayed UI
- Fixing non-visual bugs (e.g., incorrect data binding values, event handler logic)
- Configuration changes that have no visual effect

## Workflow

**Is this the first render, or an update to existing UI?**
- **First render** → follow steps 0–2 below
- **Updating existing UI** → skip to [Incremental Updates](#incremental-updates)

### First Render

0. **Load component schemas** — before writing any JSON, use `list_dir` on `references/` (same directory as this SKILL.md) to discover available components, then `read_file` only the specific component files needed for this task. Do NOT read all reference files upfront.
1. **Write UI** — use `cli.cjs set` to write the complete A2UI JSON to `scripts/ui.json`
2. **Start server** — run `node scripts/cli.cjs serve` in async mode from the skill folder. This starts the static server on port 5173 **and** opens the browser automatically.

```
node <path-to-skill-folder>/scripts/cli.cjs serve
```

> **Port conflict (EADDRINUSE):** If port 5173 is already in use, skip `serve` and run `node scripts/cli.cjs open` instead — the server is already running.

### Incremental Updates

For any change to an already-rendered UI, **never use `set`** — use `update` instead:

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

## Output Target

Always use the CLI commands (`set` or `update`) to write UI JSON — the CLI handles the output path internally. Never write `ui.json` directly with file tools.

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

Component schemas are auto-generated from the catalog. See the `references/` directory next to this SKILL.md for individual component documentation (props table + JSON example per component). This includes `references/Sandbox.md`.

Load them in Step 0 of the Workflow above before writing any JSON.

### When no existing component meets the need — use Sandbox

If none of the catalog components in `references/` can satisfy the user's UI requirement, use the `Sandbox` component instead:

- **`source`** (required): A complete ESM string with `import` statements and an `export default` React component.
- Third-party packages must be imported from `https://esm.sh/<package>` inside the source string. If the package has React as a peer dependency (e.g. recharts), append `?external=react,react-dom` to avoid a dual-React-instance error.
- **`props`** (optional): Pass dynamic data into the component. Values can be static or A2UI DataBindings (`{ "path": "/..." }`).

Example — simple counter (no third-party library, uses `react` bare specifier from importmap):
```json
{
  "id": "counter",
  "component": "Sandbox",
  "source": "import { createElement as h, useState } from 'react';\nexport default function Counter() {\n  const [n, setN] = useState(0);\n  return h('div', null,\n    h('p', null, 'Count: ' + n),\n    h('button', { onClick: () => setN(n + 1) }, '+1')\n  );\n}"
}
```

Example — recharts bar chart (third-party library with React peer dep — **must** append `?external=react,react-dom`):
```json
{
  "id": "sales-chart",
  "component": "Sandbox",
  "source": "import { createElement as h } from 'react';\nimport { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'https://esm.sh/recharts@2?external=react,react-dom';\nconst data = [{name:'Jan',v:400},{name:'Feb',v:300},{name:'Mar',v:600}];\nexport default function Chart() {\n  return h(ResponsiveContainer, { width: '100%', height: 300 },\n    h(BarChart, { data },\n      h(CartesianGrid, { strokeDasharray: '3 3' }),\n      h(XAxis, { dataKey: 'name' }),\n      h(YAxis, null),\n      h(Tooltip, null),\n      h(Bar, { dataKey: 'v', fill: '#6366f1', radius: [4,4,0,0] })\n    )\n  );\n}"
}
```

Example — data model binding via `props`:
```json
{
  "id": "user-card",
  "component": "Sandbox",
  "source": "import { createElement as h } from 'react';\nexport default function UserCard({ name, email }) {\n  return h('div', { style: { padding: '16px' } },\n    h('h3', null, name),\n    h('p', null, email)\n  );\n}",
  "props": {
    "name": { "path": "/user/name" },
    "email": { "path": "/user/email" }
  }
}
```

> **Note:** Always use `createElement` (not JSX) in `source` — JSX is not transformed inside the iframe.

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
| Bypassing the CLI to write `ui.json` directly | Always use `node scripts/cli.cjs set '<json>'` or `update '<json>'`; never write `ui.json` with file tools |
| Using `set` for small updates | Use `update` for incremental changes; `set` replaces the entire UI |
