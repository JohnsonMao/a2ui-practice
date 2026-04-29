# Box

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `className` | string | Tailwind CSS class names to apply to the wrapping <div> element. Use this to control layout, spacing, colors, or any other utility styles. | — | — |
| `children` | array | Array of child component IDs to render inside the box, in order. Use this when you have multiple children. Cannot be used together with `child`. | — | — |
| `child` | string | ID of a single child component to render inside the box. Use this when you have exactly one child. Cannot be used together with `children`. | — | — |

## JSON Example

```json
{
  "id": "my-box",
  "component": "Box"
}
```

**Optional props:** `className`, `children`, `child`
