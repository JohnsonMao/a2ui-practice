# Modal

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `trigger` | string | The ID of the component that opens the modal when interacted with (e.g., a button). Do NOT define the component inline. | — | ✓ |
| `content` | string | The ID of the component to be displayed inside the modal. Do NOT define the component inline. | — | ✓ |

## JSON Example

```json
{
  "id": "my-modal",
  "component": "Modal",
  "trigger": "<trigger-id>",
  "content": "<content-id>"
}
```

**Optional props:** `accessibility`, `weight`
