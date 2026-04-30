# Badge

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `label` | string | Text content displayed inside the badge. | — | ✓ |
| `variant` | "default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link" | Visual style. "default" uses the primary color; "secondary" is muted; "destructive" is red for errors or warnings; "outline" shows a border with no fill; "ghost" is transparent; "link" shows underline styling. | — | — |

## JSON Example

```json
{
  "id": "my-badge",
  "component": "Badge",
  "label": "Label"
}
```

**Optional props:** `variant`
