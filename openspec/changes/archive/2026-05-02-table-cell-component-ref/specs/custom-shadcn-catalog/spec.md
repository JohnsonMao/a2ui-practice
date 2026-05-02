## MODIFIED Requirements

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
