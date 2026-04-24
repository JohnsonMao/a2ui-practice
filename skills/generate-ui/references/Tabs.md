# Tabs

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `tabs` | array | An array of objects, where each object defines a tab with a title and a child component. | — | ✓ |

## JSON Example

```json
{
  "id": "my-tabs",
  "component": "Tabs",
  "tabs": [
    {
      "title": "Tab 1",
      "child": "<content-id>"
    }
  ]
}
```

**Optional props:** `accessibility`, `weight`
