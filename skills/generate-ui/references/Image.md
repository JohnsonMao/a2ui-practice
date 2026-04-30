# Image

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `url` | string \| expression | Image source URL. | — | ✓ |
| `description` | string \| expression | Alternative text for accessibility and screen readers. | — | — |
| `fit` | "contain" \| "cover" \| "fill" \| "none" \| "scaleDown" | How the image should fit within its frame. | — | — |
| `variant` | "icon" \| "avatar" \| "smallFeature" \| "mediumFeature" \| "largeFeature" \| "header" | Size preset for common image usages. | — | — |

## JSON Example

```json
{
  "id": "my-image",
  "component": "Image",
  "url": "https://example.com/..."
}
```

**Optional props:** `description`, `fit`, `variant`
