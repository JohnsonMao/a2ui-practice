# table-cell-component-ref Specification

## Purpose

Extends the Table catalog component so that individual cells can reference A2UI component IDs, enabling rich interactive content (buttons, badges, etc.) inside table cells without requiring Sandbox workarounds.

## ADDED Requirements

### Requirement: Table cell accepts component reference

The `Table` component's `rows` prop SHALL accept cell values as either a plain string or a component reference object of shape `{ "id": "<component-id>" }`.

When a cell value is a `{ "id": string }` object, the Table SHALL render the corresponding A2UI component by calling `buildChild(id)`.
When a cell value is a plain string, the Table SHALL render it as text, preserving existing behavior.

#### Scenario: String cell renders as text

- **WHEN** a row contains a plain string cell value
- **THEN** the Table SHALL display that string as text content in the cell

#### Scenario: Component ref cell renders the referenced component

- **WHEN** a row contains a cell value of `{ "id": "some-btn" }` and a component with id `"some-btn"` exists in the surface
- **THEN** the Table SHALL render the component referenced by `"some-btn"` inside that cell

#### Scenario: Missing component ref renders empty cell

- **WHEN** a row contains a cell value of `{ "id": "nonexistent" }` and no such component exists
- **THEN** the Table SHALL render an empty cell without throwing an error

#### Scenario: Mixed row with strings and component refs

- **WHEN** a row contains a mix of string values and `{ "id": string }` values
- **THEN** each cell SHALL render according to its own type — strings as text, component refs as components
