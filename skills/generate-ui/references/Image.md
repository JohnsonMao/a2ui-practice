# Image

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `url` | string \| expression | The URL of the image to display. | — | ✓ |
| `description` | string \| expression | The accessibility description of the image. | — | — |
| `fit` | "contain" \| "cover" \| "fill" \| "none" \| "scaleDown" | Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property. | "fill" | — |
| `variant` | "icon" \| "avatar" \| "smallFeature" \| "mediumFeature" \| "largeFeature" \| "header" | A hint for the image size and style. | "mediumFeature" | — |

## JSON Example

```json
{
  "id": "my-image",
  "component": "Image",
  "url": "https://example.com/..."
}
```

**Optional props:** `accessibility`, `weight`, `description`, `fit`, `variant`
