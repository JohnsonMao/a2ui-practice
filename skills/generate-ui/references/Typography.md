# Typography

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `variant` | "h1" \| "h2" \| "h3" \| "h4" \| "p" \| "blockquote" \| "list" | Typographic style. Use "h1"–"h4" for headings in descending size, "p" for body paragraphs, "blockquote" for quoted content, and "list" for a bulleted list (use the "items" prop). | — | ✓ |
| `text` | string | Text content to display. Used by all variants except "list", which uses the "items" prop instead. | — | — |
| `items` | array | Bulleted list items. Only used when variant is "list". | — | — |

## JSON Example

```json
{
  "id": "my-typography",
  "component": "Typography",
  "variant": "h1"
}
```

**Optional props:** `text`, `items`
