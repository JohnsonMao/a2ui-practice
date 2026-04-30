# Button

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `variant` | "default" \| "primary" \| "borderless" | Visual style. Use "primary" for emphasis, "default" for standard actions, and "borderless" for low-emphasis actions. | — | — |
| `child` | string | ID of a single child component rendered inside the button, typically a Text component. | — | ✓ |
| `action` | object | Action executed when the button is clicked. | — | — |

## JSON Example

```json
{
  "id": "my-button",
  "component": "Button",
  "child": "<component-id>"
}
```

**Optional props:** `variant`, `action`
