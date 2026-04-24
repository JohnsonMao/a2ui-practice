# ChoicePicker

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `label` | string \| expression | The label for the group of options. | — | — |
| `variant` | "multipleSelection" \| "mutuallyExclusive" | A hint for how the choice picker should be displayed and behave. | "mutuallyExclusive" | — |
| `options` | array | The list of available options to choose from. | — | ✓ |
| `value` | array \| object | The list of currently selected values. This should be bound to a string array in the data model. | — | ✓ |
| `displayStyle` | "checkbox" \| "chips" | The display style of the component. | "checkbox" | — |
| `filterable` | boolean | If true, displays a search input to filter the options. | false | — |
| `checks` | array | A list of checks to perform. | — | — |

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

**Optional props:** `accessibility`, `weight`, `label`, `variant`, `displayStyle`, `filterable`, `checks`
