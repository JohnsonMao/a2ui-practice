# ChoicePicker

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `label` | string \| expression | Optional label displayed above the options. | — | — |
| `variant` | "mutuallyExclusive" \| "multipleSelection" | Selection mode. Use "mutuallyExclusive" for single selection, "multipleSelection" for multi-select. | — | — |
| `options` | array | List of available choices. | — | ✓ |
| `value` | array \| object | Current selected values. Single-select mode uses the first value in the list. | — | ✓ |

## JSON Example

```json
{
  "id": "my-choicepicker",
  "component": "ChoicePicker",
  "options": [
    {
      "label": "Option A",
      "value": "a"
    }
  ],
  "value": []
}
```

**Optional props:** `label`, `variant`
