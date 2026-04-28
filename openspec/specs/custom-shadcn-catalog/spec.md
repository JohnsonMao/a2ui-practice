# custom-shadcn-catalog Specification

## Purpose

TBD - created by syncing change 'custom-shadcn-catalog'. Update Purpose after archive.

## Requirements

### Requirement: Provide shadcn-based component catalog

The app SHALL provide a `customCatalog` instance (from `src/catalog/index.ts`) that implements all 19 a2ui v0.9 components using shadcn/ui components. The catalog SHALL have id `"custom"`.

#### Scenario: All standard components available

- **WHEN** a `createSurface` message with `catalogId: "custom"` is processed
- **THEN** the `MessageProcessor` SHALL resolve all 19 component types (`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`, `Sandbox`) using `customCatalog` implementations

#### Scenario: shadcn design tokens applied

- **WHEN** any non-Sandbox component from `customCatalog` is rendered
- **THEN** the component SHALL use shadcn/ui CSS variable design tokens (`--background`, `--foreground`, `--primary`, etc.) rather than a2ui built-in styles


<!-- @trace
source: sandbox-catalog-component
updated: 2026-04-28
code:
  - skills/generate-ui/scripts/assets/index-Bdw4MtAi.css
  - public/ui.json
  - skills/generate-ui/scripts/index.html
  - skills/generate-ui/scripts/assets/index-BYmVytfX.js
  - skills/generate-ui/references/CheckBox.md
  - skills/generate-ui/scripts/ui.json
  - src/catalog/components/sandbox.tsx
  - skills/generate-ui/scripts/assets/index-BxbJP-hD.js
  - skills/generate-ui/SKILL.md
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