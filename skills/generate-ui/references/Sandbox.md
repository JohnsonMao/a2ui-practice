# Sandbox

## Props

| Prop | Type | Description | Default | Required |
|------|------|-------------|---------|----------|
| `source` | string | The full React component source code to render inside an isolated iframe sandbox. Must be a valid ES module that default-exports a React component (e.g. `export default function MyComponent({ name }) { return <h1>Hello {name}</h1> }`). Can import from `react` and `react-dom/client` via importmap. | — | ✓ |
| `props` | unknown | Key-value pairs passed to the sandboxed component as props. Values are forwarded via postMessage on mount and on every update. Use this to pass dynamic data from the outer surface into the sandboxed component. | — | — |

## JSON Example

```json
{
  "id": "my-sandbox",
  "component": "Sandbox",
  "source": "value"
}
```

**Optional props:** `props`
