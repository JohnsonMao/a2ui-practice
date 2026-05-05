## ADDED Requirements

### Requirement: figma-component-map package exports catalogFigmaMap

The `packages/figma-catalog-map` package SHALL export a `catalogFigmaMap` object that maps each A2UI catalog component name to its corresponding Figma component key, Figma component name, and a `propMap` that translates A2UI property names to Figma property names.

#### Scenario: Lookup by A2UI component name

- **WHEN** a consumer calls `catalogFigmaMap['Button']`
- **THEN** the result SHALL include `figmaKey` (string), `figmaName` (string), and `propMap` (object mapping A2UI prop names to Figma property names)

#### Scenario: Layout primitive mapping

- **WHEN** a consumer looks up a layout component (e.g., `catalogFigmaMap['Column']`)
- **THEN** the result SHALL include `figmaType: 'auto-layout'` and a `direction` field (`'VERTICAL'` or `'HORIZONTAL'`) instead of a `figmaKey`

### Requirement: figma-component-map package is importable in both Node.js and browser environments

The `figma-catalog-map` package SHALL be buildable as both ESM and CJS, and SHALL NOT use Node.js-only APIs, so it can be bundled into the Figma Plugin (browser sandbox) and imported by CLI commands.

#### Scenario: Import in Figma Plugin bundle

- **WHEN** the Figma Plugin build includes `figma-catalog-map`
- **THEN** the bundle SHALL compile without errors and the `catalogFigmaMap` SHALL be accessible at runtime in the Figma Plugin sandbox

#### Scenario: Import in CLI command

- **WHEN** the `pull-figma` CLI command imports `catalogFigmaMap`
- **THEN** the command SHALL resolve the mapping at runtime without errors in a Node.js environment

### Requirement: Unknown Figma components produce warnings, not errors

When a Figma node does not match any entry in `catalogFigmaMap`, the system SHALL emit a warning message and skip the node rather than throwing an error.

#### Scenario: Unmapped component encountered during pull-figma

- **WHEN** `a2ui pull-figma` processes a Figma frame that contains a component not present in `catalogFigmaMap`
- **THEN** the CLI SHALL print a warning to stderr identifying the unmapped component name
- **THEN** the CLI SHALL continue processing remaining nodes and produce a valid `ui.json` excluding the unmapped component
