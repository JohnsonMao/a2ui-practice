# Slider

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `label` | string \| expression | Optional label shown above the slider. | — | — |
| `min` | number | Minimum slider value. | — | — |
| `max` | number | Maximum slider value. | — | ✓ |
| `value` | number \| expression | Current slider value. | — | ✓ |

## JSON Example

```json
{
  "id": "my-slider",
  "component": "Slider",
  "max": 0,
  "value": 50
}
```

**Optional props:** `label`, `min`
