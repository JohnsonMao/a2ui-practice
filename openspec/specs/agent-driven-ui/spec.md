# agent-driven-ui Specification

## Purpose

TBD - created by archiving change 'a2ui-static-polling-app'. Update Purpose after archive.

## Requirements

### Requirement: Initialize MessageProcessor with basicCatalog

The app SHALL initialize a single `MessageProcessor` instance (from `@a2ui/web_core/v0_9`) with `customCatalog` (from `src/catalog/index.ts`) — replacing the previous `basicCatalog` — on first render and retain it for the entire application lifecycle.

#### Scenario: Processor created once

- **WHEN** the React application mounts
- **THEN** exactly one `MessageProcessor` instance SHALL be created with `[customCatalog]`
- **THEN** the same instance SHALL be used for all subsequent message processing


<!-- @trace
source: a2ui-static-polling-app
updated: 2026-04-19
code:
  - vite.config.ts
  - src/hooks/useJsonPolling.ts
  - package.json
  - README.md
  - src/App.tsx
  - public/ui.json
  - src/components/ui/button.tsx
  - tsconfig.app.json
  - tsconfig.json
tests:
  - src/App.test.tsx
  - src/test/setup.ts
  - src/test/setup.test.ts
  - src/hooks/useJsonPolling.test.ts
-->

---
### Requirement: Subscribe to surface creation

The app SHALL subscribe to `MessageProcessor.onSurfaceCreated` to capture the first surface and render it.

#### Scenario: Surface becomes available

- **WHEN** the `MessageProcessor` emits a surface creation event
- **THEN** the app SHALL store the surface in React state
- **THEN** `<A2uiSurface surface={surface} />` SHALL be rendered

#### Scenario: No surface yet

- **WHEN** the app has received no messages or no `createSurface` message has been processed
- **THEN** the app SHALL render a loading/initializing placeholder instead of `A2uiSurface`


<!-- @trace
source: a2ui-static-polling-app
updated: 2026-04-19
code:
  - vite.config.ts
  - src/hooks/useJsonPolling.ts
  - package.json
  - README.md
  - src/App.tsx
  - public/ui.json
  - src/components/ui/button.tsx
  - tsconfig.app.json
  - tsconfig.json
tests:
  - src/App.test.tsx
  - src/test/setup.ts
  - src/test/setup.test.ts
  - src/hooks/useJsonPolling.test.ts
-->

---
### Requirement: Process A2UI protocol messages

The app SHALL pass incoming message arrays to `MessageProcessor.processMessages()` to update the rendered surface.

#### Scenario: Valid messages processed

- **WHEN** `processMessages` is called with a valid A2UI v0.9 message array
- **THEN** the surface state SHALL update reactively without a full React re-render of the App component

#### Scenario: Subscription cleanup on unmount

- **WHEN** the App component unmounts
- **THEN** the `onSurfaceCreated` subscription SHALL be unsubscribed to prevent memory leaks


<!-- @trace
source: a2ui-static-polling-app
updated: 2026-04-19
code:
  - vite.config.ts
  - src/hooks/useJsonPolling.ts
  - package.json
  - README.md
  - src/App.tsx
  - public/ui.json
  - src/components/ui/button.tsx
  - tsconfig.app.json
  - tsconfig.json
tests:
  - src/App.test.tsx
  - src/test/setup.ts
  - src/test/setup.test.ts
  - src/hooks/useJsonPolling.test.ts
-->

---
### Requirement: Provide example ui.json

The repository SHALL include a `skills/generate-ui/scripts/ui.json` file (within the skill folder) with a valid A2UI v0.9 message array that creates a surface and renders at least one component. Agents SHALL use `cli.cjs set` or `cli.cjs update` to write to this file. The `public/ui.json` file SHALL remain as a standalone example for the dev server and SHALL NOT be used by the skill workflow.

#### Scenario: Skill ui.json is valid

- **WHEN** `skills/generate-ui/scripts/ui.json` is read via `node cli.cjs read`
- **THEN** the output SHALL be a valid JSON array accepted by `MessageProcessor.processMessages` without errors
- **THEN** a visible UI component SHALL be rendered in the browser at `http://localhost:5173`

#### Scenario: Agent updates UI incrementally

- **WHEN** an agent runs `node cli.cjs update '[...]'` with a subset of changed components
- **THEN** `skills/generate-ui/scripts/ui.json` SHALL reflect the merged result
- **THEN** the React app SHALL render the updated UI within 2 seconds (next poll cycle)

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