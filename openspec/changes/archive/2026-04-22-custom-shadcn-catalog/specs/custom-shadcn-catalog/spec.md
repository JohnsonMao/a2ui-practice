## ADDED Requirements

### Requirement: Provide shadcn-based component catalog

The app SHALL provide a `customCatalog` instance (from `src/catalog/index.ts`) that implements all 18 a2ui v0.9 basicCatalog components using shadcn/ui components. The catalog SHALL have id `"custom"`.

#### Scenario: All standard components available

- **WHEN** a `createSurface` message with `catalogId: "custom"` is processed
- **THEN** the `MessageProcessor` SHALL resolve all 18 component types (`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`) using `customCatalog` implementations

#### Scenario: shadcn design tokens applied

- **WHEN** any component from `customCatalog` is rendered
- **THEN** the component SHALL use shadcn/ui CSS variable design tokens (`--background`, `--foreground`, `--primary`, etc.) rather than a2ui built-in styles

### Requirement: Component prop schemas unchanged

The `customCatalog` implementations SHALL use the same `ComponentApi` schemas (`TextApi`, `ButtonApi`, etc.) as `basicCatalog`, so that `ui.json` message payloads require no structural changes other than the `catalogId` value.

#### Scenario: Existing prop keys accepted

- **WHEN** an `updateComponents` message is processed with props valid for `basicCatalog`
- **THEN** the `customCatalog` component SHALL render without schema validation errors

#### Scenario: Unknown props silently ignored

- **WHEN** a component receives props not defined in its `ComponentApi` schema
- **THEN** the component SHALL render without error and SHALL ignore the unknown props
