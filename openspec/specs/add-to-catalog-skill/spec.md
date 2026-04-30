# Spec: add-to-catalog-skill

## Requirement: Agent reads source component to derive catalog schema

The SKILL SHALL instruct the Agent to read the target UI component's source file (e.g., `src/components/ui/date-picker.tsx`) and derive a Zod schema (`XxxApi`) from its props interface. The Agent SHALL use `src/catalog/components/box.tsx` as the structural reference for `XxxApi` and `XxxImpl` patterns.

### Scenario: Agent derives schema from source component

- **WHEN** the user invokes the skill and provides a component path or name
- **THEN** the Agent SHALL read the target component source file
- **THEN** the Agent SHALL read `src/catalog/components/box.tsx` as a template reference
- **THEN** the Agent SHALL produce a `XxxApi` object with a Zod schema that covers semantically meaningful props and includes `.describe()` annotations for each field

### Scenario: Agent cannot find the target component

- **WHEN** the user provides a component name that does not resolve to an existing file
- **THEN** the Agent SHALL list candidate files in `src/components/ui/` and ask the user to confirm the correct one before proceeding

## Requirement: Agent writes catalog component file

The SKILL SHALL instruct the Agent to write a new file at `src/catalog/components/<kebab-name>.tsx` containing both `XxxApi` (the ComponentApi object) and `XxxImpl` (the React implementation using `createComponentImplementation`).

### Scenario: Catalog component file is created

- **WHEN** the Agent has derived the schema
- **THEN** the Agent SHALL create `src/catalog/components/<kebab-name>.tsx` with `XxxApi` exported and `XxxImpl` exported
- **THEN** the file SHALL follow the same import structure as `box.tsx` (imports from `@a2ui/web_core/v0_9`, `@a2ui/react/v0_9`, `zod`)

### Scenario: File already exists

- **WHEN** the target file path already exists
- **THEN** the Agent SHALL stop and ask the user whether to overwrite or abort

## Requirement: Agent updates api-registry

The SKILL SHALL instruct the Agent to add an export line for `XxxApi` in `src/catalog/api-registry.ts`.

### Scenario: Registry is updated

- **WHEN** the catalog component file has been created
- **THEN** the Agent SHALL append `export { XxxApi } from './components/<kebab-name>'` to `src/catalog/api-registry.ts`

### Scenario: Export already exists

- **WHEN** the registry already contains an export for `XxxApi`
- **THEN** the Agent SHALL skip the update and notify the user

## Requirement: Agent executes post-update pipeline

The SKILL SHALL instruct the Agent to run `pnpm generate:refs` and `pnpm sync:skill` after the registry is updated.

### Scenario: Pipeline runs successfully

- **WHEN** the registry has been updated
- **THEN** the Agent SHALL run `pnpm generate:refs`
- **THEN** the Agent SHALL run `pnpm sync:skill`
- **THEN** the Agent SHALL confirm to the user that `skills/generate-ui/references/Xxx.md` was created

### Scenario: Pipeline command fails

- **WHEN** `pnpm generate:refs` or `pnpm sync:skill` exits with a non-zero code
- **THEN** the Agent SHALL display the error output and stop without proceeding to the next step

## Requirements

### Requirement: Agent reads source component to derive catalog schema

The SKILL SHALL instruct the Agent to read the target UI component's source file (e.g., `src/components/ui/date-picker.tsx`) and derive a Zod schema (`XxxApi`) from its props interface. The Agent SHALL use `src/catalog/components/box.tsx` as the structural reference for `XxxApi` and `XxxImpl` patterns.

#### Scenario: Agent derives schema from source component

- **WHEN** the user invokes the skill and provides a component path or name
- **THEN** the Agent SHALL read the target component source file
- **THEN** the Agent SHALL read `src/catalog/components/box.tsx` as a template reference
- **THEN** the Agent SHALL produce a `XxxApi` object with a Zod schema that covers semantically meaningful props and includes `.describe()` annotations for each field

#### Scenario: Agent cannot find the target component

- **WHEN** the user provides a component name that does not resolve to an existing file
- **THEN** the Agent SHALL list candidate files in `src/components/ui/` and ask the user to confirm the correct one before proceeding


<!-- @trace
source: add-to-catalog-skill
updated: 2026-04-30
code:
  - skills/generate-ui/references/AudioPlayer.md
  - skills/generate-ui/references/Card.md
  - src/catalog/components/row.tsx
  - skills/generate-ui/references/Dialog.md
  - skills/generate-ui/references/TextField.md
  - skills/generate-ui/references/Text.md
  - src/catalog/components/image.tsx
  - src/catalog/components/tabs.tsx
  - skills/generate-ui/references/Tabs.md
  - skills/generate-ui/references/Typography.md
  - src/catalog/components/list.tsx
  - skills/generate-ui/references/Badge.md
  - src/catalog/components/text.tsx
  - src/catalog/components/date-picker.tsx
  - skills/generate-ui/references/ChoicePicker.md
  - src/catalog/api-registry.ts
  - skills/add-to-catalog/SKILL.md
  - skills/generate-ui/references/Icon.md
  - src/catalog/components/card.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/dialog.tsx
  - src/catalog/components/text-field.tsx
  - skills/generate-ui/references/List.md
  - package.json
  - skills/generate-ui/references/DatePicker.md
  - src/catalog/components/icon.tsx
  - src/catalog/components/table.tsx
  - skills/generate-ui/references/Button.md
  - src/catalog/components/divider.tsx
  - src/catalog/components/modal.tsx
  - skills/generate-ui/references/Modal.md
  - skills/generate-ui/references/Row.md
  - skills/generate-ui/references/Column.md
  - skills/generate-ui/references/DateTimeInput.md
  - src/catalog/components/badge.tsx
  - skills/generate-ui/references/Video.md
  - src/catalog/components/button.tsx
  - src/catalog/components/audio-player.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - skills/generate-ui/references/Table.md
  - skills/generate-ui/references/Image.md
  - src/catalog/components/column.tsx
  - skills/generate-ui/references/CheckBox.md
  - src/catalog/components/typography.tsx
  - skills/generate-ui/references/Divider.md
  - skills/generate-ui/references/Slider.md
  - src/catalog/components/video.tsx
  - src/catalog/components/date-time-input.tsx
-->

---
### Requirement: Agent writes catalog component file

The SKILL SHALL instruct the Agent to write a new file at `src/catalog/components/<kebab-name>.tsx` containing both `XxxApi` (the ComponentApi object) and `XxxImpl` (the React implementation using `createComponentImplementation`).

#### Scenario: Catalog component file is created

- **WHEN** the Agent has derived the schema
- **THEN** the Agent SHALL create `src/catalog/components/<kebab-name>.tsx` with `XxxApi` exported and `XxxImpl` exported
- **THEN** the file SHALL follow the same import structure as `box.tsx` (imports from `@a2ui/web_core/v0_9`, `@a2ui/react/v0_9`, `zod`)

#### Scenario: File already exists

- **WHEN** the target file path already exists
- **THEN** the Agent SHALL stop and ask the user whether to overwrite or abort


<!-- @trace
source: add-to-catalog-skill
updated: 2026-04-30
code:
  - skills/generate-ui/references/AudioPlayer.md
  - skills/generate-ui/references/Card.md
  - src/catalog/components/row.tsx
  - skills/generate-ui/references/Dialog.md
  - skills/generate-ui/references/TextField.md
  - skills/generate-ui/references/Text.md
  - src/catalog/components/image.tsx
  - src/catalog/components/tabs.tsx
  - skills/generate-ui/references/Tabs.md
  - skills/generate-ui/references/Typography.md
  - src/catalog/components/list.tsx
  - skills/generate-ui/references/Badge.md
  - src/catalog/components/text.tsx
  - src/catalog/components/date-picker.tsx
  - skills/generate-ui/references/ChoicePicker.md
  - src/catalog/api-registry.ts
  - skills/add-to-catalog/SKILL.md
  - skills/generate-ui/references/Icon.md
  - src/catalog/components/card.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/dialog.tsx
  - src/catalog/components/text-field.tsx
  - skills/generate-ui/references/List.md
  - package.json
  - skills/generate-ui/references/DatePicker.md
  - src/catalog/components/icon.tsx
  - src/catalog/components/table.tsx
  - skills/generate-ui/references/Button.md
  - src/catalog/components/divider.tsx
  - src/catalog/components/modal.tsx
  - skills/generate-ui/references/Modal.md
  - skills/generate-ui/references/Row.md
  - skills/generate-ui/references/Column.md
  - skills/generate-ui/references/DateTimeInput.md
  - src/catalog/components/badge.tsx
  - skills/generate-ui/references/Video.md
  - src/catalog/components/button.tsx
  - src/catalog/components/audio-player.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - skills/generate-ui/references/Table.md
  - skills/generate-ui/references/Image.md
  - src/catalog/components/column.tsx
  - skills/generate-ui/references/CheckBox.md
  - src/catalog/components/typography.tsx
  - skills/generate-ui/references/Divider.md
  - skills/generate-ui/references/Slider.md
  - src/catalog/components/video.tsx
  - src/catalog/components/date-time-input.tsx
-->

---
### Requirement: Agent updates api-registry

The SKILL SHALL instruct the Agent to add an export line for `XxxApi` in `src/catalog/api-registry.ts`.

#### Scenario: Registry is updated

- **WHEN** the catalog component file has been created
- **THEN** the Agent SHALL append `export { XxxApi } from './components/<kebab-name>'` to `src/catalog/api-registry.ts`

#### Scenario: Export already exists

- **WHEN** the registry already contains an export for `XxxApi`
- **THEN** the Agent SHALL skip the update and notify the user


<!-- @trace
source: add-to-catalog-skill
updated: 2026-04-30
code:
  - skills/generate-ui/references/AudioPlayer.md
  - skills/generate-ui/references/Card.md
  - src/catalog/components/row.tsx
  - skills/generate-ui/references/Dialog.md
  - skills/generate-ui/references/TextField.md
  - skills/generate-ui/references/Text.md
  - src/catalog/components/image.tsx
  - src/catalog/components/tabs.tsx
  - skills/generate-ui/references/Tabs.md
  - skills/generate-ui/references/Typography.md
  - src/catalog/components/list.tsx
  - skills/generate-ui/references/Badge.md
  - src/catalog/components/text.tsx
  - src/catalog/components/date-picker.tsx
  - skills/generate-ui/references/ChoicePicker.md
  - src/catalog/api-registry.ts
  - skills/add-to-catalog/SKILL.md
  - skills/generate-ui/references/Icon.md
  - src/catalog/components/card.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/dialog.tsx
  - src/catalog/components/text-field.tsx
  - skills/generate-ui/references/List.md
  - package.json
  - skills/generate-ui/references/DatePicker.md
  - src/catalog/components/icon.tsx
  - src/catalog/components/table.tsx
  - skills/generate-ui/references/Button.md
  - src/catalog/components/divider.tsx
  - src/catalog/components/modal.tsx
  - skills/generate-ui/references/Modal.md
  - skills/generate-ui/references/Row.md
  - skills/generate-ui/references/Column.md
  - skills/generate-ui/references/DateTimeInput.md
  - src/catalog/components/badge.tsx
  - skills/generate-ui/references/Video.md
  - src/catalog/components/button.tsx
  - src/catalog/components/audio-player.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - skills/generate-ui/references/Table.md
  - skills/generate-ui/references/Image.md
  - src/catalog/components/column.tsx
  - skills/generate-ui/references/CheckBox.md
  - src/catalog/components/typography.tsx
  - skills/generate-ui/references/Divider.md
  - skills/generate-ui/references/Slider.md
  - src/catalog/components/video.tsx
  - src/catalog/components/date-time-input.tsx
-->

---
### Requirement: Agent executes post-update pipeline

The SKILL SHALL instruct the Agent to run `pnpm generate:refs` and `pnpm sync:skill` after the registry is updated.

#### Scenario: Pipeline runs successfully

- **WHEN** the registry has been updated
- **THEN** the Agent SHALL run `pnpm generate:refs`
- **THEN** the Agent SHALL run `pnpm sync:skill`
- **THEN** the Agent SHALL confirm to the user that `skills/generate-ui/references/Xxx.md` was created

#### Scenario: Pipeline command fails

- **WHEN** `pnpm generate:refs` or `pnpm sync:skill` exits with a non-zero code
- **THEN** the Agent SHALL display the error output and stop without proceeding to the next step

<!-- @trace
source: add-to-catalog-skill
updated: 2026-04-30
code:
  - skills/generate-ui/references/AudioPlayer.md
  - skills/generate-ui/references/Card.md
  - src/catalog/components/row.tsx
  - skills/generate-ui/references/Dialog.md
  - skills/generate-ui/references/TextField.md
  - skills/generate-ui/references/Text.md
  - src/catalog/components/image.tsx
  - src/catalog/components/tabs.tsx
  - skills/generate-ui/references/Tabs.md
  - skills/generate-ui/references/Typography.md
  - src/catalog/components/list.tsx
  - skills/generate-ui/references/Badge.md
  - src/catalog/components/text.tsx
  - src/catalog/components/date-picker.tsx
  - skills/generate-ui/references/ChoicePicker.md
  - src/catalog/api-registry.ts
  - skills/add-to-catalog/SKILL.md
  - skills/generate-ui/references/Icon.md
  - src/catalog/components/card.tsx
  - src/catalog/components/checkbox.tsx
  - src/catalog/components/dialog.tsx
  - src/catalog/components/text-field.tsx
  - skills/generate-ui/references/List.md
  - package.json
  - skills/generate-ui/references/DatePicker.md
  - src/catalog/components/icon.tsx
  - src/catalog/components/table.tsx
  - skills/generate-ui/references/Button.md
  - src/catalog/components/divider.tsx
  - src/catalog/components/modal.tsx
  - skills/generate-ui/references/Modal.md
  - skills/generate-ui/references/Row.md
  - skills/generate-ui/references/Column.md
  - skills/generate-ui/references/DateTimeInput.md
  - src/catalog/components/badge.tsx
  - skills/generate-ui/references/Video.md
  - src/catalog/components/button.tsx
  - src/catalog/components/audio-player.tsx
  - src/catalog/components/choice-picker.tsx
  - src/catalog/components/slider.tsx
  - skills/generate-ui/references/Table.md
  - skills/generate-ui/references/Image.md
  - src/catalog/components/column.tsx
  - skills/generate-ui/references/CheckBox.md
  - src/catalog/components/typography.tsx
  - skills/generate-ui/references/Divider.md
  - skills/generate-ui/references/Slider.md
  - src/catalog/components/video.tsx
  - src/catalog/components/date-time-input.tsx
-->