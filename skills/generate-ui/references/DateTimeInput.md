# DateTimeInput

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `value` | string \| expression | Current value in ISO-like input format (date, time, or datetime-local). | — | ✓ |
| `enableDate` | boolean | When true, date selection is enabled. | — | — |
| `enableTime` | boolean | When true, time selection is enabled. | — | — |
| `min` | string | Optional lower bound for the date/time value. | — | — |
| `max` | string | Optional upper bound for the date/time value. | — | — |
| `label` | string | Optional label for the input field. | — | — |

## JSON Example

```json
{
  "id": "my-datetimeinput",
  "component": "DateTimeInput",
  "value": "value"
}
```

**Optional props:** `enableDate`, `enableTime`, `min`, `max`, `label`
