# Table

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `columns` | array | Column header labels, in display order. | — | ✓ |
| `rows` | array | Rows of data. Each row is an array of string cell values aligned to the columns order. | — | ✓ |
| `caption` | string | Optional caption text displayed below the table. | — | — |

## JSON Example

```json
{
  "id": "my-table",
  "component": "Table",
  "columns": [],
  "rows": []
}
```

**Optional props:** `caption`
