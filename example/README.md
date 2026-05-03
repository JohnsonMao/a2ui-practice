# example

This package demonstrates how **any** project can register its own UI components with `@a2ui/sdk`, completely decoupled from the `app` package.

## Quickstart

```sh
# From workspace root
pnpm install

# Generate component reference Markdown docs
pnpm --filter example generate-refs
```

The generated docs will be written to `example/references/`.

## How it works

1. Define a `ComponentApi` using Zod (see `src/button.skill.ts`).
2. Call `a2ui.skill(api, { example, notes? })` to register the component.
3. Run `a2ui generate-refs --dir ./src --out ./references` to produce Markdown.

You don't need to install `app` or import anything from it — just `@a2ui/sdk` and `@a2ui/web_core`.
