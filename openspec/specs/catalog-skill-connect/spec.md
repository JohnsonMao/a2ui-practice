# catalog-skill-connect Specification

## Purpose

以 colocate 的 `*.skill.ts` 取代中央 `api-registry.ts`，讓每個 catalog 組件能自訂 AI skill reference 的 `example` 與 `notes`，並消除手動維護清單的需求。

## Requirements

### Requirement: skill.ts provides a2ui.skill() registration function

~~`src/catalog/skill.ts` SHALL export a module-level registry...~~

`@a2ui/sdk` SHALL export `a2ui.skill()` and `getRegistry()` as its public API. Component skill files SHALL import from `@a2ui/sdk` instead of a local `skill.ts` file.

#### Scenario: Component registers via a2ui.skill()

- **WHEN** `a2ui.skill(XxxApi, { example, notes })` is called as a module-level side effect in a `*.skill.ts` file that imports from `@a2ui/sdk`
- **THEN** the entry SHALL be appended to the SDK's module-level registry array
- **THEN** the entry SHALL contain the `api` object, the `example` function, and the optional `notes` string

#### Scenario: getRegistry() returns all registered entries

- **WHEN** `getRegistry()` is called (from `@a2ui/sdk`) after one or more `*.skill.ts` files have been dynamically imported
- **THEN** it SHALL return a copy of the registry array containing all registered entries in import order

#### Scenario: example return type is constrained by generic

- **WHEN** `a2ui.skill<Api extends ComponentApi>(api, { example })` is called
- **THEN** the TypeScript compiler SHALL enforce that `example()` returns `{ id: string; component: string } & InferredComponentApiSchemaType<Api>`
- **THEN** a compile-time error SHALL occur if the `example` return shape does not match the API schema


<!-- @trace
source: monorepo-restructure
updated: 2026-05-03
code:
  - src/catalog/components/choice-picker.tsx
  - packages/app/src/catalog/components/typography.tsx
  - packages/app/src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/slider.skill.ts
  - packages/app/src/catalog/components/list.tsx
  - packages/app/src/catalog/components/divider.tsx
  - public/ui.json
  - src/catalog/components/audio-player.tsx
  - packages/app/src/catalog/components/table.tsx
  - src/components/ui/select.tsx
  - src/main.tsx
  - example/src/button.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - packages/app/src/catalog/components/divider.skill.ts
  - packages/app/src/index.css
  - src/catalog/components/checkbox.tsx
  - packages/app/src/components/ui/separator.tsx
  - packages/app/src/catalog/components/choice-picker.tsx
  - packages/app/src/hooks/useJsonPolling.ts
  - src/catalog/components/sandbox.skill.ts
  - packages/sdk/src/index.ts
  - src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/typography.skill.ts
  - src/components/ui/input.tsx
  - src/catalog/components/sandbox.tsx
  - packages/app/src/catalog/components/dialog.skill.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/app/src/components/ui/popover.tsx
  - src/catalog/components/date-time-input.tsx
  - packages/app/src/catalog/components/box.tsx
  - src/catalog/components/button.tsx
  - src/components/ui/checkbox.tsx
  - packages/app/src/catalog/components/modal.tsx
  - packages/app/src/catalog/components/button.skill.ts
  - packages/app/src/catalog/components/table.skill.ts
  - packages/cli/src/commands/serve.ts
  - src/components/ui/typography.tsx
  - packages/app/src/catalog/components/row.tsx
  - packages/app/src/catalog/components/slider.tsx
  - packages/app/src/catalog/components/image.tsx
  - packages/app/src/lib/utils.ts
  - src/catalog/components/column.tsx
  - src/components/ui/calendar.tsx
  - index.html
  - packages/app/src/catalog/components/sandbox.tsx
  - packages/sdk/vitest.config.ts
  - packages/app/src/catalog/components/dialog.tsx
  - packages/app/src/catalog/components/text.tsx
  - packages/app/src/catalog/index.ts
  - packages/cli/package.json
  - src/catalog/components/dialog.skill.ts
  - packages/app/src/catalog/components/audio-player.tsx
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
  - packages/app/src/catalog/components/row.skill.ts
  - packages/app/src/catalog/components/tabs.tsx
  - src/catalog/components/date-time-input.skill.ts
  - src/components/ui/card.tsx
  - src/catalog/components/date-picker.tsx
  - packages/app/public/icons.svg
  - packages/app/src/catalog/components/audio-player.skill.ts
  - packages/app/src/vite-env.d.ts
  - src/components/ui/dialog.tsx
  - packages/cli/tsconfig.json
  - packages/app/src/catalog/components/video.tsx
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/modal.skill.ts
  - packages/app/src/catalog/components/list.skill.ts
  - packages/app/src/catalog/components/column.tsx
  - packages/app/src/App.tsx
  - packages/app/tsconfig.node.json
  - src/catalog/components/table.tsx
  - pnpm-workspace.yaml
  - tsconfig.app.json
  - packages/app/components.json
  - src/catalog/components/icon.skill.ts
  - packages/app/vite.config.ts
  - src/catalog/index.ts
  - packages/app/src/components/ui/dialog.tsx
  - packages/app/src/catalog/components/badge.skill.ts
  - packages/app/src/components/ui/calendar.tsx
  - packages/app/src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/typography.tsx
  - packages/app/src/catalog/components/video.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/list.tsx
  - src/components/ui/slider.tsx
  - vite.config.ts
  - src/lib/utils.ts
  - packages/app/src/catalog/components/text.skill.ts
  - packages/app/src/catalog/components/slider.skill.ts
  - components.json
  - package.json
  - packages/app/src/catalog/components/checkbox.skill.ts
  - packages/app/src/catalog/components/icon.tsx
  - packages/app/src/components/ui/button.tsx
  - packages/app/src/catalog/components/card.skill.ts
  - packages/app/src/catalog/components/modal.skill.ts
  - src/components/ui/table.tsx
  - src/hooks/useJsonPolling.ts
  - packages/app/src/catalog/components/date-time-input.tsx
  - tsconfig.json
  - example/tsconfig.json
  - packages/app/src/catalog/components/badge.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/icon.tsx
  - packages/app/src/catalog/components/date-picker.tsx
  - packages/cli/src/index.ts
  - packages/app/src/components/ui/checkbox.tsx
  - packages/sdk/tsconfig.json
  - packages/app/src/catalog/components/icon.skill.ts
  - public/icons.svg
  - src/catalog/components/video.skill.ts
  - packages/app/src/catalog/components/button.tsx
  - src/components/ui/tabs.tsx
  - packages/app/src/components/ui/badge.tsx
  - src/catalog/components/date-picker.skill.ts
  - public/favicon.svg
  - example/package.json
  - packages/app/src/catalog/components/column.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/column.skill.ts
  - turbo.json
  - packages/app/src/catalog/components/sandbox.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/text.tsx
  - packages/app/src/components/ui/select.tsx
  - src/components/ui/badge.tsx
  - packages/app/src/catalog/components/tabs.skill.ts
  - tsconfig.node.json
  - src/components/ui/separator.tsx
  - packages/app/src/main.tsx
  - src/catalog/components/button.skill.ts
  - vite.cli.config.ts
  - src/catalog/components/typography.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/input.tsx
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/components/image.tsx
  - cli/index.ts
  - packages/app/src/components/ui/slider.tsx
  - packages/app/src/components/ui/table.tsx
  - packages/sdk/package.json
  - packages/app/src/catalog/components/checkbox.tsx
  - src/catalog/components/badge.tsx
  - src/catalog/components/row.tsx
  - packages/app/package.json
  - packages/app/src/catalog/components/card.tsx
  - src/components/ui/popover.tsx
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/tabs.tsx
  - packages/app/src/catalog/components/box.skill.ts
  - packages/app/src/components/ui/tabs.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/row.skill.ts
  - packages/app/index.html
  - packages/app/src/components/ui/date-picker.tsx
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/card.skill.ts
  - example/README.md
  - packages/app/src/catalog/components/date-picker.skill.ts
  - packages/app/src/catalog/components/text-field.skill.ts
  - packages/app/tsconfig.json
  - packages/cli/vite.config.ts
  - src/catalog/components/modal.tsx
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/video.tsx
  - src/components/ui/button.tsx
  - packages/app/public/ui.json
  - src/App.tsx
  - src/catalog/components/dialog.tsx
  - packages/app/tsconfig.app.json
  - src/components/ui/date-picker.tsx
  - packages/app/src/catalog/components/date-time-input.skill.ts
  - packages/app/src/components/ui/card.tsx
  - src/catalog/components/box.skill.ts
  - src/index.css
  - scripts/generate-catalog-refs.ts
  - packages/app/public/favicon.svg
tests:
  - packages/app/src/test/setup.test.ts
  - packages/app/src/catalog/components/__tests__/catalog-components.test.tsx
  - src/test/setup.test.ts
  - packages/app/src/App.test.tsx
  - packages/app/src/test/setup.ts
  - packages/app/src/hooks/useJsonPolling.test.ts
  - src/hooks/useJsonPolling.test.ts
  - src/test/setup.ts
  - cli/__tests__/cli.test.mjs
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
  - packages/sdk/src/__tests__/skill.test.ts
  - packages/app/src/catalog/__tests__/skill.test.ts
  - src/App.test.tsx
-->

---
### Requirement: Each catalog component has a colocated *.skill.ts file

Every file under `src/catalog/components/*.tsx` SHALL have a corresponding `src/catalog/components/*.skill.ts` file that calls `a2ui.skill()` with a realistic `example` value.

#### Scenario: skill.ts imports only XxxApi, not XxxImpl

- **WHEN** a `*.skill.ts` file is authored
- **THEN** it SHALL import only `XxxApi` (the pure TypeScript ComponentApi object) from the sibling `.tsx` file
- **THEN** it SHALL NOT import `XxxImpl` or any browser-only API, so that the file can be executed in Node.js without error

#### Scenario: Skill file registers with realistic example

- **WHEN** `a2ui.skill(XxxApi, { example })` is called
- **THEN** the `example` function SHALL return an object with `id`, `component`, and all required fields from the component's Zod schema
- **THEN** the values SHALL demonstrate a primary and realistic use case of the component (not auto-derived generic placeholders)


<!-- @trace
source: catalog-skill-connect
updated: 2026-05-01
code:
  - src/catalog/components/video.skill.ts
  - src/catalog/components/icon.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/api-registry.ts
  - src/catalog/components/card.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/sandbox.skill.ts
  - src/catalog/components/slider.skill.ts
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/column.skill.ts
  - src/catalog/components/button.skill.ts
  - scripts/generate-catalog-refs.ts
  - src/catalog/components/dialog.skill.ts
  - src/catalog/components/modal.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - src/catalog/components/row.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/box.skill.ts
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/date-time-input.skill.ts
  - src/catalog/components/date-picker.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/image.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
tests:
  - src/catalog/__tests__/api-registry.test.ts
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
-->

---
### Requirement: generate-catalog-refs.ts scans *.skill.ts via glob

`scripts/generate-catalog-refs.ts` SHALL locate all `src/catalog/components/*.skill.ts` files using glob, dynamically import each one to trigger the `a2ui.skill()` side effects, then call `getRegistry()` to obtain all registered entries for Markdown generation.

#### Scenario: All skill.ts files are discovered and executed

- **WHEN** `pnpm generate:refs` is run
- **THEN** the script SHALL glob `src/catalog/components/*.skill.ts`
- **THEN** for each matched path, it SHALL `await import(path)` to execute the registration side effect
- **THEN** it SHALL call `getRegistry()` to obtain the full list of registered entries

#### Scenario: Markdown output is generated for each registered component

- **WHEN** `getRegistry()` returns N entries
- **THEN** the script SHALL generate one Markdown file per entry at `skills/generate-ui/references/<ComponentName>.md`
- **THEN** the `example` section in each Markdown SHALL use the value returned by `entry.example()` rather than auto-derived values

#### Scenario: Script uses no any types

- **WHEN** the script accesses internal Zod schema definitions to build the props table
- **THEN** it SHALL use typed `ZodInspectable` helpers instead of `any` casts
- **THEN** `pnpm typecheck` SHALL pass with zero errors


<!-- @trace
source: catalog-skill-connect
updated: 2026-05-01
code:
  - src/catalog/skill.ts
  - src/catalog/components/*.skill.ts
  - scripts/generate-catalog-refs.ts
  - skills/add-to-catalog/SKILL.md
-->

---
### Requirement: generate-catalog-refs.ts scans *.skill.ts files as source of truth

`scripts/generate-catalog-refs.ts` SHALL discover all component registrations by globbing `src/catalog/components/*.skill.ts`, dynamically importing each file to trigger side effects, then calling `getRegistry()` to obtain all `{ api, example, notes }` entries. It SHALL NOT import from `api-registry.ts`.

#### Scenario: CLI generates references from skill registrations

- **WHEN** `pnpm generate:refs` is run
- **THEN** the script SHALL glob all `*.skill.ts` files under `src/catalog/components/`
- **THEN** each file SHALL be dynamically imported
- **THEN** `getRegistry()` SHALL be called after all imports complete
- **THEN** one Markdown file SHALL be written to `skills/generate-ui/references/<ComponentName>.md` per registered entry

#### Scenario: example function output is used in Markdown JSON Example section

- **WHEN** a component has a registered `example` function
- **THEN** the generated Markdown SHALL use the return value of `example()` as the JSON Example block
- **THEN** the auto-derived example logic (current `exampleValue()`) SHALL NOT be used for that component


<!-- @trace
source: catalog-skill-connect
updated: 2026-05-01
code:
  - src/catalog/components/video.skill.ts
  - src/catalog/components/icon.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/api-registry.ts
  - src/catalog/components/card.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/sandbox.skill.ts
  - src/catalog/components/slider.skill.ts
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/column.skill.ts
  - src/catalog/components/button.skill.ts
  - scripts/generate-catalog-refs.ts
  - src/catalog/components/dialog.skill.ts
  - src/catalog/components/modal.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - src/catalog/components/row.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/box.skill.ts
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/date-time-input.skill.ts
  - src/catalog/components/date-picker.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/image.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
tests:
  - src/catalog/__tests__/api-registry.test.ts
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
-->

---
### Requirement: api-registry.ts is removed

`src/catalog/api-registry.ts` SHALL be deleted. No file in the project SHALL import from `src/catalog/api-registry`.

#### Scenario: No remaining imports of api-registry

- **WHEN** `api-registry.ts` is deleted
- **THEN** no TypeScript source file SHALL contain an import path referencing `api-registry`
- **THEN** `pnpm typecheck` SHALL pass without errors

<!-- @trace
source: catalog-skill-connect
updated: 2026-05-01
code:
  - src/catalog/components/video.skill.ts
  - src/catalog/components/icon.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/api-registry.ts
  - src/catalog/components/card.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/sandbox.skill.ts
  - src/catalog/components/slider.skill.ts
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/column.skill.ts
  - src/catalog/components/button.skill.ts
  - scripts/generate-catalog-refs.ts
  - src/catalog/components/dialog.skill.ts
  - src/catalog/components/modal.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - src/catalog/components/row.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/box.skill.ts
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/date-time-input.skill.ts
  - src/catalog/components/date-picker.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/image.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
tests:
  - src/catalog/__tests__/api-registry.test.ts
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
-->