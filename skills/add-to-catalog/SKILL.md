---
name: add-to-catalog
description: Use when asked to add a new component to the catalog, register a component, or integrate a UI component into the A2UI catalog pipeline. Triggers on requests like "add component to catalog", "register this component", "add DatePicker to catalog", "add X to catalog".
---

# Add a Component to the A2UI Catalog

Integrate an existing React UI component into the A2UI catalog so that it can be driven by AI agents via the `generate-ui` skill.

## Design Decisions

**Input: target component path (not manual props description)**
The user provides a component name or path (e.g., `src/components/ui/date-picker.tsx`). You read the source directly to derive the schema — do not ask the user to describe props manually. Reading source is faster and the output is easier to correct than writing from scratch.

**`box.tsx` is the structural template**
Use `src/catalog/components/box.tsx` as the reference for `XxxApi + XxxImpl` structure. It is the simplest custom component (pure props mapping, no side effects). `sandbox.tsx` contains iframe/postMessage/ResizeObserver logic and is NOT a general-purpose template.

**Schema covers only semantically meaningful props**
A2UI catalog components are driven by AI. Only map props that carry semantic intent (e.g., `value`, `label`, `placeholder`, `disabled`, `onChangeCallbackId`). Skip internal styling props, `ref`, `asChild`, and framework-specific internals. When in doubt, ask: "Would an AI agent need to set this prop to control the component's behavior or content?"

**Pipeline steps are fixed and sequential**
Each step depends on the previous one completing successfully. Do not skip or reorder:
1. Write catalog component file
2. Update api-registry
3. `pnpm generate:refs`
4. `pnpm sync:skill`

## Workflow

### Step 1: Locate the target component

Determine the full path to the source component. Accept:
- A relative path: `src/components/ui/date-picker.tsx`
- A component name: `DatePicker` → resolve to `src/components/ui/date-picker.tsx`

**If the component cannot be found:** List all files in `src/components/ui/` and ask the user to confirm the correct one before proceeding. Do not guess.

Read the target component source file in full.

### Step 2: Read the reference template

Read `src/catalog/components/box.tsx` to understand the required structure:

```ts
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const XxxApi = {
  name: 'Xxx',
  schema: z.object({
    // ... props
  }).strict(),
} satisfies ComponentApi

export const XxxImpl = createComponentImplementation(XxxApi, ({ props, buildChild }) => {
  // React implementation
})
```

### Step 3: Derive the Zod schema (`XxxApi`)

From the target component's props interface, identify which props are semantically meaningful for AI-driven usage. For each selected prop:

- Map its TypeScript type to a Zod primitive (`z.string()`, `z.number()`, `z.boolean()`, `z.enum([...])`)
- Add a `.describe()` annotation explaining what the prop does and when to use it (see `box.tsx` and `sandbox.tsx` for style reference)
- Mark props that are optional in the source as `z.xxx().optional()`
- Always close the schema with `.strict()`

**Props to include:** `value`, `defaultValue`, `label`, `placeholder`, `disabled`, `min`, `max`, `step`, `options`, `onChangeCallbackId`, `children`/`child` (as component ID strings), semantic layout props.

**Props to omit:** `ref`, `className` (unless the component has no other layout control), `asChild`, `style`, internal React keys, event handler functions (replace with callback ID strings if needed).

### Step 4: Write the catalog component file

**Target path:** `src/catalog/components/<kebab-name>.tsx`

Where `<kebab-name>` is the component name in kebab-case (e.g., `DatePicker` → `date-picker`).

**If the file already exists:** Stop and ask the user whether to overwrite or abort. Do not proceed without confirmation.

Write the file with:
- `XxxApi` exported (ComponentApi object with Zod schema)
- `XxxImpl` exported (React implementation using `createComponentImplementation`)
- Same import structure as `box.tsx`

The implementation in `XxxImpl` should forward the mapped props to the underlying shadcn component. Keep it minimal — prop forwarding only, no business logic.

### Step 5: Update `src/catalog/api-registry.ts`

Open `src/catalog/api-registry.ts` and add an export for `XxxApi` at the end of the custom component export block:

```ts
export { XxxApi } from './components/<kebab-name>'
```

**If the export already exists:** Skip this step and notify the user.

### Step 6: Run the pipeline

Execute commands in order. Stop immediately if any command exits with a non-zero code and show the error output.

```bash
pnpm generate:refs
```

This regenerates `skills/generate-ui/references/Xxx.md` from the updated registry. Confirm the file was created before continuing.

```bash
pnpm sync:skill
```

This syncs `skills/` to `.agents/skills/`. After this step, the new component is available to all AI agents.

Confirm to the user:
- `skills/generate-ui/references/<ComponentName>.md` was created
- The component is now registered in the catalog and available for `generate-ui`
