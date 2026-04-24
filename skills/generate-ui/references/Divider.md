# Divider

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `axis` | "horizontal" \| "vertical" | The orientation of the divider. | "horizontal" | — |

## JSON Example

```json
{
  "id": "my-divider",
  "component": "Divider"
}
```

**Optional props:** `accessibility`, `weight`, `axis`
