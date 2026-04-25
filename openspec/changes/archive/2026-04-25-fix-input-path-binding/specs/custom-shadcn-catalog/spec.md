## ADDED Requirements

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

### Requirement: ui.json supports DataModel initialization via updateDataModel message

The `public/ui.json` SHALL include an `updateDataModel` message that initializes the surface DataModel with the initial values for all input fields, placed after `createSurface` and before or alongside `updateComponents`.

#### Scenario: DataModel initialized on load

- **WHEN** the app loads and processes messages from `ui.json`
- **THEN** the `MessageProcessor` SHALL have a populated `DataModel` for `surfaceId: "main"` containing all input field initial values before the first render

#### Scenario: Input component value resolves from DataModel path

- **WHEN** a `TextField` component has `"value": { "path": "/user/name" }` and the DataModel contains a value at `/user/name`
- **THEN** the component's initial local state SHALL be set from the DataModel value at that path
