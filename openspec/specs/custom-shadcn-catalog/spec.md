# custom-shadcn-catalog Specification

## Purpose

TBD - created by syncing change 'custom-shadcn-catalog'. Update Purpose after archive.

## Requirements

### Requirement: Provide shadcn-based component catalog

The app SHALL provide a `customCatalog` instance (from `src/catalog/index.ts`) that implements all 21 a2ui v0.9 components using shadcn/ui components. The catalog SHALL have id `"custom"`.

The `Table` component within `customCatalog` SHALL accept cell values as either plain strings or component reference objects (`{ "id": string }`), rendering component refs via `buildChild`.

#### Scenario: All standard components available

- **WHEN** a `createSurface` message with `catalogId: "custom"` is processed
- **THEN** the `MessageProcessor` SHALL resolve all 21 component types (`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`, `Sandbox`, `Table`, `DatePicker`) using `customCatalog` implementations

#### Scenario: shadcn design tokens applied

- **WHEN** any non-Sandbox component from `customCatalog` is rendered
- **THEN** the component SHALL use shadcn/ui CSS variable design tokens (`--background`, `--foreground`, `--primary`, etc.) rather than a2ui built-in styles

#### Scenario: Table cell component ref renders child component

- **WHEN** a `Table` component row contains a cell value `{ "id": "<component-id>" }`
- **THEN** the Table cell SHALL render the resolved A2UI component in place of a text value


<!-- @trace
source: table-cell-component-ref
updated: 2026-05-02
code:
  - src/catalog/components/table.tsx
  - public/ui.json
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Component prop schemas unchanged

The `customCatalog` implementations SHALL use the same `ComponentApi` schemas (`TextApi`, `ButtonApi`, etc.) as `basicCatalog`, so that `ui.json` message payloads require no structural changes other than the `catalogId` value.

#### Scenario: Existing prop keys accepted

- **WHEN** an `updateComponents` message is processed with props valid for `basicCatalog`
- **THEN** the `customCatalog` component SHALL render without schema validation errors

#### Scenario: Unknown props silently ignored

- **WHEN** a component receives props not defined in its `ComponentApi` schema
- **THEN** the component SHALL render without error and SHALL ignore the unknown props


<!-- @trace
source: custom-shadcn-catalog
updated: 2026-04-22
code:
  - src/catalog/index.ts
  - src/catalog/components/button.tsx
  - src/catalog/components/text.tsx
  - src/catalog/components/image.tsx
  - src/catalog/components/icon.tsx
  - src/catalog/components/video.tsx
  - src/catalog/components/audio-player.tsx
  - src/catalog/components/row.tsx
  - src/catalog/components/column.tsx
  - src/catalog/components/list.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/tabs.tsx
  - src/catalog/components/modal.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/text-field.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/date-time-input.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Input components maintain local state for immediate user feedback

Input components (`TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput`) in `customCatalog` SHALL maintain a React local state (`useState`) for the current value, so that user input is reflected immediately in the DOM without waiting for external data updates.

#### Scenario: TextField reflects keystroke immediately

- **WHEN** a user types a character in a `TextField` rendered by `customCatalog`
- **THEN** the input element SHALL display the updated value on the next render without requiring an external `updateComponents` or `updateDataModel` message

#### Scenario: Local state initializes from props

- **WHEN** a `TextField` receives a literal string `value` prop (e.g. `"value": "Johnson Mao"`)
- **THEN** the local state SHALL initialize to that string and the input SHALL display it

#### Scenario: Local state syncs when literal prop changes

- **WHEN** the `value` prop of a `TextField` changes to a new literal string (e.g. via a new `updateComponents` poll)
- **THEN** the local state SHALL update to match the new literal value


<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - src/catalog/components/text-field.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/date-time-input.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->


<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/text-field.tsx
  - public/ui.json
  - src/catalog/components/date-time-input.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/choice-picker.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Input components support path binding via DataModel

Input components in `customCatalog` SHALL call `props.setValue?.(newValue)` on every user-driven value change. When the component's `value` prop is a path binding object (`{ "path": "/..." }`), this call SHALL write the new value into the surface's `DataModel` at the specified path.

#### Scenario: setValue called on text change

- **WHEN** a user changes the value of a `TextField`
- **THEN** `props.setValue` SHALL be called with the new string value

#### Scenario: setValue called on checkbox toggle

- **WHEN** a user toggles a `CheckBox`
- **THEN** `props.setValue` SHALL be called with the new boolean value

#### Scenario: setValue called on slider move

- **WHEN** a user changes the position of a `Slider`
- **THEN** `props.setValue` SHALL be called with the new numeric value

#### Scenario: setValue called on choice selection

- **WHEN** a user selects an option in a `ChoicePicker`
- **THEN** `props.setValue` SHALL be called with the updated selection value


<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - src/catalog/components/text-field.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/date-time-input.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->


<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/text-field.tsx
  - public/ui.json
  - src/catalog/components/date-time-input.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/choice-picker.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: ui.json supports DataModel initialization via updateDataModel message

The `public/ui.json` SHALL include an `updateDataModel` message that initializes the surface DataModel with the initial values for all input fields, placed after `createSurface` and before or alongside `updateComponents`.

#### Scenario: DataModel initialized on load

- **WHEN** the app loads and processes messages from `ui.json`
- **THEN** the `MessageProcessor` SHALL have a populated `DataModel` for `surfaceId: "main"` containing all input field initial values before the first render

#### Scenario: Input component value resolves from DataModel path

- **WHEN** a `TextField` component has `"value": { "path": "/user/name" }` and the DataModel contains a value at `/user/name`
- **THEN** the component's initial local state SHALL be set from the DataModel value at that path


<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - public/ui.json
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

<!-- @trace
source: fix-input-path-binding
updated: 2026-04-25
code:
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/text-field.tsx
  - public/ui.json
  - src/catalog/components/date-time-input.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/choice-picker.tsx
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Custom catalog component APIs are exported for tooling

All custom component API objects defined in `src/catalog/components/` SHALL be exported as named exports from their source files and re-exported from `src/catalog/api-registry.ts`, so that build-time tooling (such as reference generators) can import them without loading React or JSX.

#### Scenario: BoxApi is accessible without React

- **WHEN** a Node.js script imports `BoxApi` from `src/catalog/api-registry.ts`
- **THEN** the import SHALL succeed without requiring JSX transformation, and `BoxApi.name` SHALL equal `"Box"`

#### Scenario: SandboxApi is accessible without React

- **WHEN** a Node.js script imports `SandboxApi` from `src/catalog/api-registry.ts`
- **THEN** the import SHALL succeed without requiring JSX transformation, and `SandboxApi.name` SHALL equal `"Sandbox"`

#### Scenario: api-registry exports all catalog APIs

- **WHEN** `src/catalog/api-registry.ts` is imported
- **THEN** it SHALL export an API object for every component file in `src/catalog/components/` (excluding test files and files prefixed with `_`)


<!-- @trace
source: refactor-catalog-refs-generation
updated: 2026-04-29
code:
  - src/catalog/api-registry.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/sandbox.tsx
tests:
  - src/catalog/__tests__/api-registry.test.ts
-->

---
### Requirement: generate:refs produces reference files for all catalog components

Running `pnpm generate:refs` SHALL produce one Markdown reference file in `skills/generate-ui/references/` for every API exported from `src/catalog/api-registry.ts`, with no components silently skipped.

#### Scenario: Box reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/Box.md` SHALL exist and contain a props table derived from `BoxApi.schema`

#### Scenario: Sandbox reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/Sandbox.md` SHALL exist and contain a props table derived from `SandboxApi.schema`

#### Scenario: CheckBox reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/CheckBox.md` SHALL exist and contain a props table derived from `CheckBoxApi.schema`

#### Scenario: No components silently skipped

- **WHEN** `pnpm generate:refs` completes successfully
- **THEN** the count of files in `skills/generate-ui/references/` SHALL equal the count of API objects exported from `src/catalog/api-registry.ts`, and the script SHALL print no `⚠ No API found` warnings


<!-- @trace
source: refactor-catalog-refs-generation
updated: 2026-04-29
code:
  - scripts/generate-catalog-refs.ts
tests:
  - src/catalog/__tests__/api-registry.test.ts
-->