# Text

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `text` | string \| expression | The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation. | — | ✓ |
| `variant` | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "caption" \| "body" | A hint for the base text style. | "body" | — |

## JSON Example

```json
{
  "id": "my-text",
  "component": "Text",
  "text": "Sample text"
}
```

**Optional props:** `accessibility`, `weight`, `variant`
