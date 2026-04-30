# Row

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `children` | array \| object | Ordered list of child component IDs rendered horizontally. | — | — |
| `justify` | "start" \| "center" \| "end" \| "spaceBetween" \| "spaceAround" \| "spaceEvenly" \| "stretch" | Main-axis distribution of children in the horizontal direction. | — | — |
| `align` | "start" \| "center" \| "end" \| "stretch" | Cross-axis alignment of children in the vertical direction. | — | — |

## JSON Example

```json
{
  "id": "my-row",
  "component": "Row"
}
```

**Optional props:** `children`, `justify`, `align`
