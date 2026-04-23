---
name: generate-ui
description: Use when asked to generate, update, or modify the UI of this app — create forms, dashboards, profile pages, or any visual layout. Triggers on requests like "幫我建一個表單", "更新 UI", "新增一個頁面", or any instruction to change what the app displays.
---

# Generate UI with A2UI

Generate a valid A2UI v0.9 JSON payload and write it to `public/ui.json`. The running app polls this file every 2 seconds and renders changes automatically.

## Workflow

Execute these steps in order:

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

### Layout

**Column** — vertical flex stack
```json
{ "id": "my-col", "component": "Column", "children": [{"id": "child1"}, {"id": "child2"}],
  "justify": "start|center|end|spaceBetween|spaceAround|spaceEvenly|stretch",
  "align": "start|center|end|stretch" }
```

**Row** — horizontal flex stack
```json
{ "id": "my-row", "component": "Row", "children": [{"id": "child1"}],
  "justify": "start|center|end|spaceBetween|spaceAround|spaceEvenly|stretch",
  "align": "start|center|end|stretch" }
```

**Card** — shadcn Card container, takes a single child
```json
{ "id": "my-card", "component": "Card", "child": "card-body-id" }
```

**List** — list container
```json
{ "id": "my-list", "component": "List", "children": [{"id": "item1"}],
  "direction": "vertical|horizontal" }
```

**Divider** — horizontal or vertical separator
```json
{ "id": "my-div", "component": "Divider", "axis": "horizontal|vertical" }
```

### Typography

**Text** — text display
```json
{ "id": "my-text", "component": "Text", "text": "Hello", 
  "variant": "h1|h2|h3|h4|h5|caption|body" }
```

### Media

**Image**
```json
{ "id": "my-img", "component": "Image", "url": "https://...", "description": "alt text",
  "variant": "icon|avatar|smallFeature|mediumFeature|largeFeature|header",
  "fit": "contain|cover|fill|none|scaleDown" }
```

**Icon** — Lucide icon
```json
{ "id": "my-icon", "component": "Icon", "name": "<icon-name>" }
```
Available icon names: `accountCircle`, `add`, `arrowBack`, `arrowForward`, `attachFile`, `calendarToday`, `call`, `camera`, `check`, `close`, `delete`, `download`, `edit`, `event`, `error`, `fastForward`, `favorite`, `favoriteOff`, `folder`, `help`, `home`, `info`, `locationOn`, `lock`, `lockOpen`, `mail`, `menu`, `moreVert`, `moreHoriz`, `notifications`, `notificationsOff`, `pause`, `payment`, `person`, `phone`, `photo`, `play`, `print`, `refresh`, `rewind`, `search`, `send`, `settings`, `share`, `shoppingCart`, `skipNext`, `skipPrevious`, `star`, `starHalf`, `starOff`, `stop`, `upload`, `visibility`, `visibilityOff`, `volumeDown`, `volumeMute`, `volumeOff`, `volumeUp`, `warning`

**Video**
```json
{ "id": "my-video", "component": "Video", "url": "https://..." }
```

**AudioPlayer**
```json
{ "id": "my-audio", "component": "AudioPlayer", "url": "https://...", "description": "label" }
```

### Interactive

**Button** — takes a child component for label
```json
{ "id": "my-btn", "component": "Button",
  "variant": "default|primary|borderless",
  "child": "btn-label-id" }
```
Note: Always create a separate `Text` component for the button label and reference it via `child`.

**TextField** — text input
```json
{ "id": "my-field", "component": "TextField",
  "label": "Field Label", "value": "initial value",
  "variant": "shortText|longText|number|obscured" }
```

**CheckBox**
```json
{ "id": "my-check", "component": "CheckBox", "label": "Option label", "value": false }
```

**ChoicePicker** — dropdown (mutuallyExclusive) or checkboxes (multipleSelection)
```json
{ "id": "my-picker", "component": "ChoicePicker",
  "label": "Pick one",
  "options": [{"label": "Option A", "value": "a"}, {"label": "Option B", "value": "b"}],
  "value": ["a"],
  "variant": "mutuallyExclusive|multipleSelection" }
```

**Slider**
```json
{ "id": "my-slider", "component": "Slider",
  "label": "Volume", "min": 0, "max": 100, "value": 50 }
```

**DateTimeInput**
```json
{ "id": "my-date", "component": "DateTimeInput",
  "value": "2026-04-23",
  "enableDate": true, "enableTime": false }
```

**Tabs** — tabbed panels, each tab has a `title` and references a child by ID
```json
{ "id": "my-tabs", "component": "Tabs",
  "tabs": [
    {"title": "Tab 1", "child": "tab1-content-id"},
    {"title": "Tab 2", "child": "tab2-content-id"}
  ]
}
```

**Modal** — dialog triggered by another component
```json
{ "id": "my-modal", "component": "Modal",
  "trigger": "trigger-btn-id",
  "content": "modal-content-id" }
```

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
