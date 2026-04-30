# TextField

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `label` | string \| expression | The text label for the input field. | — | ✓ |
| `value` | string \| expression | Current text value of the input. | — | — |
| `variant` | "longText" \| "number" \| "shortText" \| "obscured" | Input mode. Use longText for textarea, number for numeric input, obscured for passwords. | — | — |
| `validationRegexp` | string | Optional regular expression string used for client-side validation hints. | — | — |

## JSON Example

```json
{
  "id": "my-textfield",
  "component": "TextField",
  "label": "Label"
}
```

**Optional props:** `value`, `variant`, `validationRegexp`
