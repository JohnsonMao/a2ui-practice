# generate-ui-cli Specification

## Purpose

The `generate-ui-cli` capability provides a zero-dependency CLI (`cli.cjs`) for agents to interact with the A2UI skill's local dev server. It enables agents to read and write the `ui.json` file, serve the pre-built app, and open the browser — without requiring any npm packages.

## Requirements

### Requirement: CLI provides serve command

~~The CLI SHALL start a zero-dependency HTTP static server on port 5173 serving the pre-built A2UI React app and the skill's `ui.json` file when the `serve` subcommand is invoked via `node cli.cjs serve`.~~

The CLI SHALL start a zero-dependency HTTP static server serving the pre-built A2UI React app when the `serve` subcommand is invoked via `a2ui serve`. The server SHALL support a `--port` flag (default 5173). After the server starts, the CLI SHALL open `http://localhost:<port>` in the default browser automatically.

#### Scenario: Serve starts successfully

- **WHEN** `a2ui serve` is executed and the specified port is available
- **THEN** the HTTP server SHALL listen on the specified port (default 5173)
- **THEN** the browser SHALL open `http://localhost:<port>`
- **THEN** a confirmation message SHALL be printed to stdout

#### Scenario: Port already in use

- **WHEN** `a2ui serve` is executed and the port is already bound
- **THEN** the CLI SHALL print a clear error message indicating port conflict with suggestion to use `--port`
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: monorepo-restructure
updated: 2026-05-03
code:
  - src/catalog/components/choice-picker.tsx
  - packages/app/src/catalog/components/typography.tsx
  - packages/app/src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/slider.skill.ts
  - packages/app/src/catalog/components/list.tsx
  - packages/app/src/catalog/components/divider.tsx
  - public/ui.json
  - src/catalog/components/audio-player.tsx
  - packages/app/src/catalog/components/table.tsx
  - src/components/ui/select.tsx
  - src/main.tsx
  - example/src/button.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - packages/app/src/catalog/components/divider.skill.ts
  - packages/app/src/index.css
  - src/catalog/components/checkbox.tsx
  - packages/app/src/components/ui/separator.tsx
  - packages/app/src/catalog/components/choice-picker.tsx
  - packages/app/src/hooks/useJsonPolling.ts
  - src/catalog/components/sandbox.skill.ts
  - packages/sdk/src/index.ts
  - src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/typography.skill.ts
  - src/components/ui/input.tsx
  - src/catalog/components/sandbox.tsx
  - packages/app/src/catalog/components/dialog.skill.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/app/src/components/ui/popover.tsx
  - src/catalog/components/date-time-input.tsx
  - packages/app/src/catalog/components/box.tsx
  - src/catalog/components/button.tsx
  - src/components/ui/checkbox.tsx
  - packages/app/src/catalog/components/modal.tsx
  - packages/app/src/catalog/components/button.skill.ts
  - packages/app/src/catalog/components/table.skill.ts
  - packages/cli/src/commands/serve.ts
  - src/components/ui/typography.tsx
  - packages/app/src/catalog/components/row.tsx
  - packages/app/src/catalog/components/slider.tsx
  - packages/app/src/catalog/components/image.tsx
  - packages/app/src/lib/utils.ts
  - src/catalog/components/column.tsx
  - src/components/ui/calendar.tsx
  - index.html
  - packages/app/src/catalog/components/sandbox.tsx
  - packages/sdk/vitest.config.ts
  - packages/app/src/catalog/components/dialog.tsx
  - packages/app/src/catalog/components/text.tsx
  - packages/app/src/catalog/index.ts
  - packages/cli/package.json
  - src/catalog/components/dialog.skill.ts
  - packages/app/src/catalog/components/audio-player.tsx
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
  - packages/app/src/catalog/components/row.skill.ts
  - packages/app/src/catalog/components/tabs.tsx
  - src/catalog/components/date-time-input.skill.ts
  - src/components/ui/card.tsx
  - src/catalog/components/date-picker.tsx
  - packages/app/public/icons.svg
  - packages/app/src/catalog/components/audio-player.skill.ts
  - packages/app/src/vite-env.d.ts
  - src/components/ui/dialog.tsx
  - packages/cli/tsconfig.json
  - packages/app/src/catalog/components/video.tsx
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/modal.skill.ts
  - packages/app/src/catalog/components/list.skill.ts
  - packages/app/src/catalog/components/column.tsx
  - packages/app/src/App.tsx
  - packages/app/tsconfig.node.json
  - src/catalog/components/table.tsx
  - pnpm-workspace.yaml
  - tsconfig.app.json
  - packages/app/components.json
  - src/catalog/components/icon.skill.ts
  - packages/app/vite.config.ts
  - src/catalog/index.ts
  - packages/app/src/components/ui/dialog.tsx
  - packages/app/src/catalog/components/badge.skill.ts
  - packages/app/src/components/ui/calendar.tsx
  - packages/app/src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/typography.tsx
  - packages/app/src/catalog/components/video.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/list.tsx
  - src/components/ui/slider.tsx
  - vite.config.ts
  - src/lib/utils.ts
  - packages/app/src/catalog/components/text.skill.ts
  - packages/app/src/catalog/components/slider.skill.ts
  - components.json
  - package.json
  - packages/app/src/catalog/components/checkbox.skill.ts
  - packages/app/src/catalog/components/icon.tsx
  - packages/app/src/components/ui/button.tsx
  - packages/app/src/catalog/components/card.skill.ts
  - packages/app/src/catalog/components/modal.skill.ts
  - src/components/ui/table.tsx
  - src/hooks/useJsonPolling.ts
  - packages/app/src/catalog/components/date-time-input.tsx
  - tsconfig.json
  - example/tsconfig.json
  - packages/app/src/catalog/components/badge.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/icon.tsx
  - packages/app/src/catalog/components/date-picker.tsx
  - packages/cli/src/index.ts
  - packages/app/src/components/ui/checkbox.tsx
  - packages/sdk/tsconfig.json
  - packages/app/src/catalog/components/icon.skill.ts
  - public/icons.svg
  - src/catalog/components/video.skill.ts
  - packages/app/src/catalog/components/button.tsx
  - src/components/ui/tabs.tsx
  - packages/app/src/components/ui/badge.tsx
  - src/catalog/components/date-picker.skill.ts
  - public/favicon.svg
  - example/package.json
  - packages/app/src/catalog/components/column.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/column.skill.ts
  - turbo.json
  - packages/app/src/catalog/components/sandbox.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/text.tsx
  - packages/app/src/components/ui/select.tsx
  - src/components/ui/badge.tsx
  - packages/app/src/catalog/components/tabs.skill.ts
  - tsconfig.node.json
  - src/components/ui/separator.tsx
  - packages/app/src/main.tsx
  - src/catalog/components/button.skill.ts
  - vite.cli.config.ts
  - src/catalog/components/typography.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/input.tsx
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/components/image.tsx
  - cli/index.ts
  - packages/app/src/components/ui/slider.tsx
  - packages/app/src/components/ui/table.tsx
  - packages/sdk/package.json
  - packages/app/src/catalog/components/checkbox.tsx
  - src/catalog/components/badge.tsx
  - src/catalog/components/row.tsx
  - packages/app/package.json
  - packages/app/src/catalog/components/card.tsx
  - src/components/ui/popover.tsx
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/tabs.tsx
  - packages/app/src/catalog/components/box.skill.ts
  - packages/app/src/components/ui/tabs.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/row.skill.ts
  - packages/app/index.html
  - packages/app/src/components/ui/date-picker.tsx
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/card.skill.ts
  - example/README.md
  - packages/app/src/catalog/components/date-picker.skill.ts
  - packages/app/src/catalog/components/text-field.skill.ts
  - packages/app/tsconfig.json
  - packages/cli/vite.config.ts
  - src/catalog/components/modal.tsx
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/video.tsx
  - src/components/ui/button.tsx
  - packages/app/public/ui.json
  - src/App.tsx
  - src/catalog/components/dialog.tsx
  - packages/app/tsconfig.app.json
  - src/components/ui/date-picker.tsx
  - packages/app/src/catalog/components/date-time-input.skill.ts
  - packages/app/src/components/ui/card.tsx
  - src/catalog/components/box.skill.ts
  - src/index.css
  - scripts/generate-catalog-refs.ts
  - packages/app/public/favicon.svg
tests:
  - packages/app/src/test/setup.test.ts
  - packages/app/src/catalog/components/__tests__/catalog-components.test.tsx
  - src/test/setup.test.ts
  - packages/app/src/App.test.tsx
  - packages/app/src/test/setup.ts
  - packages/app/src/hooks/useJsonPolling.test.ts
  - src/hooks/useJsonPolling.test.ts
  - src/test/setup.ts
  - cli/__tests__/cli.test.mjs
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
  - packages/sdk/src/__tests__/skill.test.ts
  - packages/app/src/catalog/__tests__/skill.test.ts
  - src/App.test.tsx
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

---
### Requirement: CLI provides read command for agent use

The `cli.cjs` script (built from `@a2ui/cli`) SHALL provide a `read` subcommand accessible to agents via `node cli.cjs read`. The command SHALL output the current `ui.json` contents to stdout. If `ui.json` does not exist, the command SHALL output `[]`.

#### Scenario: Agent reads current UI state

- **WHEN** an agent executes `node cli.cjs read`
- **THEN** the current contents of `ui.json` SHALL be written to stdout
- **THEN** the agent MAY parse and inspect the current component tree

#### Scenario: No ui.json present

- **WHEN** an agent executes `node cli.cjs read` and no `ui.json` exists
- **THEN** `[]` SHALL be written to stdout


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
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


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
### Requirement: CLI provides update command for agent use

The `cli.cjs` script SHALL provide an `update` subcommand implementing merge-by-ID semantics. Agents SHALL use this command to patch individual components without replacing the entire UI state.

#### Scenario: Agent updates an existing component

- **WHEN** an agent executes `node cli.cjs update '<json>'` referencing an `id` already in `updateComponents`
- **THEN** the matching entry SHALL be replaced in-place
- **THEN** all other components SHALL remain unchanged

#### Scenario: Agent adds a new component

- **WHEN** an agent executes `node cli.cjs update '<json>'` referencing an `id` not in `updateComponents`
- **THEN** the new component SHALL be appended to the `updateComponents` array

<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->