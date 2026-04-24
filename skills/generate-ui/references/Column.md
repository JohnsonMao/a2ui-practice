# Column

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `children` | array \| object | Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID. | — | ✓ |
| `justify` | "start" \| "center" \| "end" \| "spaceBetween" \| "spaceAround" \| "spaceEvenly" \| "stretch" | Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together. | "start" | — |
| `align` | "center" \| "end" \| "start" \| "stretch" | Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property. | "stretch" | — |

## JSON Example

```json
{
  "id": "my-column",
  "component": "Column",
  "children": [
    {
      "id": "<child-id>"
    }
  ]
}
```

**Optional props:** `accessibility`, `weight`, `justify`, `align`
