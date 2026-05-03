## ADDED Requirements

### Requirement: CLI provides read command

The `@a2ui/cli` package SHALL provide a `read` subcommand that reads the `ui.json` file and outputs its content to stdout. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. If the file does not exist, the command SHALL output `[]` and exit with code 0.

#### Scenario: File exists

- **WHEN** `a2ui read` is executed and `ui.json` exists
- **THEN** the full contents of `ui.json` SHALL be written to stdout
- **THEN** the process SHALL exit with code 0

#### Scenario: File does not exist

- **WHEN** `a2ui read` is executed and `ui.json` does not exist
- **THEN** the string `[]` SHALL be written to stdout
- **THEN** the process SHALL exit with code 0

### Requirement: CLI provides set command

The `@a2ui/cli` package SHALL provide a `set` subcommand that accepts a JSON string argument and writes it to `ui.json`, completely replacing existing content. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. On success, the command SHALL print a confirmation message to stdout and exit with code 0. If the JSON argument is invalid, the command SHALL print an error to stderr, exit with a non-zero code, and SHALL NOT modify the file.

#### Scenario: Valid JSON written

- **WHEN** `a2ui set '<valid-json>'` is executed
- **THEN** `ui.json` SHALL be overwritten with the provided JSON
- **THEN** a confirmation message SHALL be printed to stdout
- **THEN** the process SHALL exit with code 0

#### Scenario: Invalid JSON rejected

- **WHEN** `a2ui set '<invalid-json>'` is executed
- **THEN** an error message SHALL be printed to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code

### Requirement: CLI provides update command

The `@a2ui/cli` package SHALL provide an `update` subcommand implementing Method A merge-by-ID: it reads the existing `ui.json`, locates the `updateComponents` message, and for each input component, replaces it if an entry with the same `id` exists, otherwise appends it. The result SHALL be written back to `ui.json`. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. If the `updateComponents` message is absent, the command SHALL print an error to stderr, exit with a non-zero code, and SHALL NOT modify the file.

#### Scenario: Existing component replaced

- **WHEN** `a2ui update '<json>'` is executed and an entry with the same `id` exists in `updateComponents`
- **THEN** the existing entry SHALL be replaced with the input entry
- **THEN** all other entries SHALL be preserved
- **THEN** the process SHALL exit with code 0

#### Scenario: New component appended

- **WHEN** `a2ui update '<json>'` is executed and no entry with the same `id` exists in `updateComponents`
- **THEN** the input entry SHALL be appended to the `updateComponents` array
- **THEN** the process SHALL exit with code 0

#### Scenario: Missing updateComponents message

- **WHEN** `a2ui update '<json>'` is executed and `ui.json` contains no `updateComponents` message
- **THEN** an error message SHALL be printed to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code

### Requirement: CLI provides open command

The `@a2ui/cli` package SHALL provide an `open` subcommand that opens `http://localhost:<port>` in the default browser. The port SHALL default to 5173 and MAY be overridden via `--port <number>`. If the browser cannot be opened, the command SHALL print a warning to stderr and exit with code 0.

#### Scenario: Browser opens successfully

- **WHEN** `a2ui open` is executed
- **THEN** `http://localhost:5173` SHALL be opened in the default browser
- **THEN** the process SHALL exit with code 0

#### Scenario: Custom port

- **WHEN** `a2ui open --port 3000` is executed
- **THEN** `http://localhost:3000` SHALL be opened in the default browser

### Requirement: CLI ui-json path resolution

All commands that read or write `ui.json` (`read`, `set`, `update`, `serve`) SHALL resolve the file path using the following priority:

1. `--ui-json <path>` option if provided
2. `__dirname/ui.json` (same directory as the CLI script) as default

#### Scenario: Default path used

- **WHEN** a ui-json command is executed without `--ui-json`
- **THEN** the file SHALL be resolved relative to `__dirname`

#### Scenario: Override path used

- **WHEN** a ui-json command is executed with `--ui-json /custom/path/ui.json`
- **THEN** the file SHALL be resolved at `/custom/path/ui.json`
