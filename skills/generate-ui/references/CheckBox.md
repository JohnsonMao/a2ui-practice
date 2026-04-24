# CheckBox

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `label` | string \| expression | The text to display next to the checkbox. | — | ✓ |
| `value` | boolean \| expression | The current state of the checkbox (true for checked, false for unchecked). | — | ✓ |
| `checks` | array | A list of checks to perform. | — | — |

## JSON Example

```json
{
  "id": "my-checkbox",
  "component": "CheckBox",
  "label": "Label",
  "value": false
}
```

**Optional props:** `accessibility`, `weight`, `checks`
