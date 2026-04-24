# TextField

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `label` | string \| expression | The text label for the input field. | — | ✓ |
| `value` | string \| expression | The value of the text field. | — | — |
| `variant` | "longText" \| "number" \| "shortText" \| "obscured" | The type of input field to display. | "shortText" | — |
| `validationRegexp` | string | A regular expression used for client-side validation of the input. | — | — |
| `checks` | array | A list of checks to perform. | — | — |

## JSON Example

```json
{
  "id": "my-textfield",
  "component": "TextField",
  "label": "Label"
}
```

**Optional props:** `accessibility`, `weight`, `value`, `variant`, `validationRegexp`, `checks`
