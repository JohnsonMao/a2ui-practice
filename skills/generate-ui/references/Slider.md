# Slider

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `label` | string \| expression | The label for the slider. | — | — |
| `min` | number | The minimum value of the slider. | 0 | — |
| `max` | number | The maximum value of the slider. | — | ✓ |
| `value` | number \| expression | The current value of the slider. | — | ✓ |
| `checks` | array | A list of checks to perform. | — | — |

## JSON Example

```json
{
  "id": "my-slider",
  "component": "Slider",
  "max": 0,
  "value": 50
}
```

**Optional props:** `accessibility`, `weight`, `label`, `min`, `checks`
