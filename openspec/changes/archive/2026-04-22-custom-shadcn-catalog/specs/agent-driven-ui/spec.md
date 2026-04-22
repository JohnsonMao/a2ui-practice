## MODIFIED Requirements

### Requirement: Initialize MessageProcessor with basicCatalog

The app SHALL initialize a single `MessageProcessor` instance (from `@a2ui/web_core/v0_9`) with `customCatalog` (from `src/catalog/index.ts`) — replacing the previous `basicCatalog` — on first render and retain it for the entire application lifecycle.

#### Scenario: Processor created once

- **WHEN** the React application mounts
- **THEN** exactly one `MessageProcessor` instance SHALL be created with `[customCatalog]`
- **THEN** the same instance SHALL be used for all subsequent message processing
