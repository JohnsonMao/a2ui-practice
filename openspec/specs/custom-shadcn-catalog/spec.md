# custom-shadcn-catalog Specification

## Purpose

TBD - created by syncing change 'custom-shadcn-catalog'. Update Purpose after archive.

## Requirements

### Requirement: Provide shadcn-based component catalog

The app SHALL provide a `customCatalog` instance (from `src/catalog/index.ts`) that implements all 18 a2ui v0.9 basicCatalog components using shadcn/ui components. The catalog SHALL have id `"custom"`.

#### Scenario: All standard components available

- **WHEN** a `createSurface` message with `catalogId: "custom"` is processed
- **THEN** the `MessageProcessor` SHALL resolve all 18 component types (`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`) using `customCatalog` implementations

#### Scenario: shadcn design tokens applied

- **WHEN** any component from `customCatalog` is rendered
- **THEN** the component SHALL use shadcn/ui CSS variable design tokens (`--background`, `--foreground`, `--primary`, etc.) rather than a2ui built-in styles


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
