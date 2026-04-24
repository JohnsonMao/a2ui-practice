# Video

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `url` | string \| expression | The URL of the video to display. | — | ✓ |

## JSON Example

```json
{
  "id": "my-video",
  "component": "Video",
  "url": "https://example.com/..."
}
```

**Optional props:** `accessibility`, `weight`
