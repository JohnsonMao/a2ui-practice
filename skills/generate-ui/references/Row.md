# Row

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `children` | array \| object | Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID. | — | ✓ |
| `justify` | "center" \| "end" \| "spaceAround" \| "spaceBetween" \| "spaceEvenly" \| "start" \| "stretch" | Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together. | "start" | — |
| `align` | "start" \| "center" \| "end" \| "stretch" | Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start'). | "stretch" | — |

## JSON Example

```json
{
  "id": "my-row",
  "component": "Row",
  "children": [
    {
      "id": "<child-id>"
    }
  ]
}
```

**Optional props:** `accessibility`, `weight`, `justify`, `align`
