# DateTimeInput

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `value` | string \| expression | The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string. | — | ✓ |
| `enableDate` | boolean | If true, allows the user to select a date. | false | — |
| `enableTime` | boolean | If true, allows the user to select a time. | false | — |
| `min` | string \| expression | The minimum allowed date/time in ISO 8601 format. | — | — |
| `max` | string \| expression | The maximum allowed date/time in ISO 8601 format. | — | — |
| `label` | string \| expression | The text label for the input field. | — | — |
| `checks` | array | A list of checks to perform. | — | — |

## JSON Example

```json
{
  "id": "my-datetimeinput",
  "component": "DateTimeInput",
  "value": "value"
}
```

**Optional props:** `accessibility`, `weight`, `enableDate`, `enableTime`, `min`, `max`, `label`, `checks`
