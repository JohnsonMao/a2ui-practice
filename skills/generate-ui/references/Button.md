# Button

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `accessibility` | object | Attributes to enhance accessibility. | — | — |
| `weight` | number | The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column. | — | — |
| `child` | string | The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline. | — | ✓ |
| `variant` | "default" \| "primary" \| "borderless" | A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link. | "default" | — |
| `action` | object | — | — | ✓ |
| `checks` | array | A list of checks to perform. | — | — |

## JSON Example

```json
{
  "id": "my-button",
  "component": "Button",
  "child": "<component-id>"
}
```

**Optional props:** `accessibility`, `weight`, `variant`, `checks`
