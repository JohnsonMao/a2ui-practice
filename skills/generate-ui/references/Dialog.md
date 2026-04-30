# Dialog

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `open` | boolean \| expression | Whether the dialog is currently visible. Set to true to show the dialog, false to dismiss it. | — | — |
| `title` | string \| expression | Heading text displayed at the top of the dialog. | — | — |
| `description` | string \| expression | Descriptive text shown below the title to give context. | — | — |
| `content` | string | ID of the child component to render as the dialog body. | — | — |

## JSON Example

```json
{
  "id": "my-dialog",
  "component": "Dialog"
}
```

**Optional props:** `open`, `title`, `description`, `content`
