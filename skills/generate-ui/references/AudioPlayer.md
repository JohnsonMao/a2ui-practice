# AudioPlayer

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `url` | string \| expression | Audio source URL to play. Use an HTTPS URL or a resolvable local asset path. | — | ✓ |
| `description` | string \| expression | Optional helper text shown above the audio controls. | — | — |

## JSON Example

```json
{
  "id": "my-audioplayer",
  "component": "AudioPlayer",
  "url": "https://example.com/..."
}
```

**Optional props:** `description`
