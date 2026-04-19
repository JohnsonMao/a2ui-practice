# a2ui-practice

A static React app powered by [`@a2ui/react`](https://www.npmjs.com/package/@a2ui/react) that renders UI driven by an AI Agent writing a local JSON file.

## How It Works

```
[AI Agent] → writes dist/ui.json → [static file server] → [React App polls every 2s] → renders UI
```

The React app polls `ui.json` every 2 seconds. When the content changes, it feeds the A2UI protocol messages to `MessageProcessor`, which updates the rendered surface automatically.

## Running

```bash
# 1. Install dependencies
pnpm install

# 2. Build the static files
pnpm build

# 3. Serve the dist directory
npx serve dist
```

Open `http://localhost:3000` in your browser.

## AI Agent Integration

Your AI Agent should write (overwrite) `dist/ui.json` with an array of A2UI v0.9 protocol messages. The React app will pick up the changes within 2 seconds.

### Message Format

```json
[
  {
    "version": "v0.9",
    "createSurface": {
      "surfaceId": "main",
      "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json"
    }
  },
  {
    "version": "v0.9",
    "updateComponents": {
      "surfaceId": "main",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "properties": {
            "children": [{ "id": "greeting" }]
          }
        },
        {
          "id": "greeting",
          "component": "Text",
          "properties": {
            "text": "Hello from the Agent!",
            "variant": "headline"
          }
        }
      ]
    }
  }
]
```

### Available Components (basicCatalog)

- **Layout**: `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`
- **Content**: `Text`, `Image`, `Icon`
- **Input**: `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`

### Update Strategy

Each time the Agent updates the UI, overwrite `dist/ui.json` with the **full** message array (including `createSurface`). The app compares the entire file content and re-processes all messages only when the content changes.

## Development

```bash
pnpm dev      # start dev server
pnpm test     # run tests in watch mode
pnpm test:run # run tests once
pnpm build    # build for production
```

