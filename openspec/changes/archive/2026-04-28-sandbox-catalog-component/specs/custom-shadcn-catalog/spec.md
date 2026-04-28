## MODIFIED Requirements

### Requirement: Provide shadcn-based component catalog

The app SHALL provide a `customCatalog` instance (from `src/catalog/index.ts`) that implements all 19 a2ui v0.9 components using shadcn/ui components. The catalog SHALL have id `"custom"`.

#### Scenario: All standard components available

- **WHEN** a `createSurface` message with `catalogId: "custom"` is processed
- **THEN** the `MessageProcessor` SHALL resolve all 19 component types (`Text`, `Image`, `Icon`, `Video`, `AudioPlayer`, `Row`, `Column`, `List`, `Card`, `Tabs`, `Modal`, `Divider`, `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`, `Sandbox`) using `customCatalog` implementations

#### Scenario: shadcn design tokens applied

- **WHEN** any non-Sandbox component from `customCatalog` is rendered
- **THEN** the component SHALL use shadcn/ui CSS variable design tokens (`--background`, `--foreground`, `--primary`, etc.) rather than a2ui built-in styles
