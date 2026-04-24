# List

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `children` | array \| object | Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. | — | ✓ |
| `direction` | "vertical" \| "horizontal" | The direction in which the list items are laid out. | "vertical" | — |
| `align` | "start" \| "center" \| "end" \| "stretch" | Defines the alignment of children along the cross axis. | "stretch" | — |

## JSON Example

```json
{
  "id": "my-list",
  "component": "List",
  "children": [
    {
      "id": "<child-id>"
    }
  ]
}
```

**Optional props:** `accessibility`, `weight`, `direction`, `align`
