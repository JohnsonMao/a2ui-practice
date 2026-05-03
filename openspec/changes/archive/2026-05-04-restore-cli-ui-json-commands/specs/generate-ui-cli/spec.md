## ADDED Requirements

### Requirement: CLI provides read command for agent use

The `cli.cjs` script (built from `@a2ui/cli`) SHALL provide a `read` subcommand accessible to agents via `node cli.cjs read`. The command SHALL output the current `ui.json` contents to stdout. If `ui.json` does not exist, the command SHALL output `[]`.

#### Scenario: Agent reads current UI state

- **WHEN** an agent executes `node cli.cjs read`
- **THEN** the current contents of `ui.json` SHALL be written to stdout
- **THEN** the agent MAY parse and inspect the current component tree

#### Scenario: No ui.json present

- **WHEN** an agent executes `node cli.cjs read` and no `ui.json` exists
- **THEN** `[]` SHALL be written to stdout

### Requirement: CLI provides set command for agent use

The `cli.cjs` script SHALL provide a `set` subcommand that completely overwrites `ui.json` with the provided JSON array. Agents SHALL use this command to initialize or replace the full UI state.

#### Scenario: Agent sets full UI state

- **WHEN** an agent executes `node cli.cjs set '<json>'` with valid JSON
- **THEN** `ui.json` SHALL be overwritten with the provided content
- **THEN** the live app SHALL reflect the new state on next poll

#### Scenario: Invalid JSON rejected

- **WHEN** an agent executes `node cli.cjs set '<invalid>'`
- **THEN** an error SHALL be printed to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero code

### Requirement: CLI provides update command for agent use

The `cli.cjs` script SHALL provide an `update` subcommand implementing merge-by-ID semantics. Agents SHALL use this command to patch individual components without replacing the entire UI state.

#### Scenario: Agent updates an existing component

- **WHEN** an agent executes `node cli.cjs update '<json>'` referencing an `id` already in `updateComponents`
- **THEN** the matching entry SHALL be replaced in-place
- **THEN** all other components SHALL remain unchanged

#### Scenario: Agent adds a new component

- **WHEN** an agent executes `node cli.cjs update '<json>'` referencing an `id` not in `updateComponents`
- **THEN** the new component SHALL be appended to the `updateComponents` array
