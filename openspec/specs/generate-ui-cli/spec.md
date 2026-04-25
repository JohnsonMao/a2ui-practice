# generate-ui-cli Specification

## Purpose

The `generate-ui-cli` capability provides a zero-dependency CLI (`cli.cjs`) for agents to interact with the A2UI skill's local dev server. It enables agents to read and write the `ui.json` file, serve the pre-built app, and open the browser — without requiring any npm packages.

## Requirements

### Requirement: CLI provides serve command

The CLI SHALL start a zero-dependency HTTP static server on port 5173 serving the pre-built A2UI React app and the skill's `ui.json` file when the `serve` subcommand is invoked. After the server starts, the CLI SHALL open `http://localhost:5173` in the default browser automatically.

#### Scenario: Serve starts successfully

- **WHEN** `node cli.cjs serve` is executed and port 5173 is available
- **THEN** the HTTP server SHALL listen on port 5173
- **THEN** the browser SHALL open `http://localhost:5173`
- **THEN** a confirmation message SHALL be printed to stdout

#### Scenario: Port already in use

- **WHEN** `node cli.cjs serve` is executed and port 5173 is already bound
- **THEN** the CLI SHALL print a clear error message indicating port conflict
- **THEN** the CLI SHALL suggest using `cli.cjs open` to open the browser instead
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI provides open command

The CLI SHALL open `http://localhost:5173` in the default macOS browser when the `open` subcommand is invoked, without starting a server.

#### Scenario: Open browser

- **WHEN** `node cli.cjs open` is executed
- **THEN** the system SHALL open `http://localhost:5173` in the default browser via the `open` command


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI provides read command

The CLI SHALL output the current contents of `ui.json` (located in the same directory as `cli.cjs`) to stdout when the `read` subcommand is invoked.

#### Scenario: ui.json exists

- **WHEN** `node cli.cjs read` is executed and `ui.json` exists
- **THEN** the full JSON content SHALL be printed to stdout

#### Scenario: ui.json does not exist

- **WHEN** `node cli.cjs read` is executed and `ui.json` does not exist
- **THEN** the CLI SHALL print an empty JSON array `[]` to stdout


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI provides set command

The CLI SHALL replace the entire contents of `ui.json` with the provided JSON string when the `set` subcommand is invoked.

#### Scenario: Valid JSON provided

- **WHEN** `node cli.cjs set '<json>'` is executed with a valid JSON array string
- **THEN** `ui.json` SHALL be overwritten with the provided content
- **THEN** a confirmation message SHALL be printed to stdout

#### Scenario: Invalid JSON provided

- **WHEN** `node cli.cjs set '<json>'` is executed with a malformed JSON string
- **THEN** the CLI SHALL print a parse error message to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI provides update command

The CLI SHALL merge the provided component array into the existing `ui.json` by component ID when the `update` subcommand is invoked. For each component in the input: if an object with the same `id` exists in `updateComponents.components`, it SHALL be replaced; if not, it SHALL be appended to the array. Components not present in the input SHALL remain unchanged.

#### Scenario: Update existing component

- **WHEN** `node cli.cjs update '[{"id":"btn","variant":"secondary","component":"Button","child":"btn-text"}]'` is executed
- **THEN** the component with `"id": "btn"` in `ui.json` SHALL be replaced with the provided object
- **THEN** all other components SHALL remain unchanged

#### Scenario: Add new component

- **WHEN** `node cli.cjs update '[{"id":"new-field","component":"TextField","label":"Email"}]'` is executed and no component with `"id": "new-field"` exists
- **THEN** the new component SHALL be appended to `updateComponents.components`
- **THEN** all existing components SHALL remain unchanged

#### Scenario: ui.json has no updateComponents message

- **WHEN** `node cli.cjs update '[...]'` is executed and `ui.json` contains no `updateComponents` message
- **THEN** the CLI SHALL print an error indicating no updateComponents message was found
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code

#### Scenario: Invalid JSON provided

- **WHEN** `node cli.cjs update '<malformed>'` is executed
- **THEN** the CLI SHALL print a parse error to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI is zero-dependency

The CLI (`cli.cjs`) SHALL use only Node.js built-in modules (`http`, `fs`, `path`, `child_process`). No external npm packages SHALL be required.

#### Scenario: Running without node_modules

- **WHEN** `node cli.cjs serve` is executed in a directory with no `node_modules`
- **THEN** the server SHALL start successfully without any dependency errors


<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->

---
### Requirement: CLI is included in sync:skill

The `pnpm sync:skill` script SHALL copy `cli.cjs` from `skills/generate-ui/scripts/` to `.agents/skills/generate-ui/scripts/` alongside `serve.cjs` and `ui.json`.

#### Scenario: Sync includes cli.cjs

- **WHEN** `pnpm sync:skill` is executed
- **THEN** `.agents/skills/generate-ui/scripts/cli.cjs` SHALL exist with the same content as `skills/generate-ui/scripts/cli.cjs`

<!-- @trace
source: generate-ui-cli
updated: 2026-04-25
code:
  - skills/generate-ui/scripts/cli.cjs
  - skills/generate-ui/scripts/serve.cjs
  - vite.cli.config.ts
  - skills/generate-ui/SKILL.md
  - skills/generate-ui/scripts/assets/index-0rLisBmW.css
  - package.json
  - skills/generate-ui/scripts/assets/index-Bznp7iK3.js
  - cli.ts
tests:
  - skills/generate-ui/scripts/__tests__/cli.test.mjs
-->