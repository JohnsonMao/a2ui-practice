# local-json-polling Specification

## Purpose

TBD - created by archiving change 'a2ui-static-polling-app'. Update Purpose after archive.

## Requirements

### Requirement: Poll local JSON file at fixed interval

The `useJsonPolling` hook SHALL fetch the given URL on a fixed interval (default 2000ms) and invoke `onNewData` only when the response content has changed since the last fetch.

#### Scenario: Content unchanged

- **WHEN** the fetched response text is identical to the previous fetch
- **THEN** `onNewData` SHALL NOT be called

#### Scenario: Content changed

- **WHEN** the fetched response text differs from the previous fetch
- **THEN** the hook SHALL parse the response as JSON
- **THEN** `onNewData` SHALL be called with the parsed value

#### Scenario: First fetch

- **WHEN** the hook fetches successfully for the first time
- **THEN** `onNewData` SHALL be called regardless of previous state (there is no prior content)


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
### Requirement: Report fetch errors without crashing

The hook SHALL catch fetch and parse errors and expose them via a returned `error` string, without stopping the polling loop.

#### Scenario: Network error

- **WHEN** a `fetch` call throws or returns a non-ok HTTP status
- **THEN** the `error` field SHALL be set to a non-empty string describing the failure
- **THEN** polling SHALL continue on the next interval tick

#### Scenario: Invalid JSON

- **WHEN** the fetched response is not valid JSON
- **THEN** the `error` field SHALL be set to a non-empty string
- **THEN** `onNewData` SHALL NOT be called with the invalid content

#### Scenario: Recovery after error

- **WHEN** a previous fetch failed and the next fetch succeeds with new content
- **THEN** the `error` field SHALL be cleared (set to `null`)
- **THEN** `onNewData` SHALL be called with the new content


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
### Requirement: Clean up interval on unmount

The polling interval SHALL be cleared when the component using the hook unmounts.

#### Scenario: Component unmounts

- **WHEN** the component that called `useJsonPolling` unmounts
- **THEN** the `setInterval` timer SHALL be cleared immediately


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
### Requirement: Expose last updated timestamp

The hook SHALL return a `lastUpdated` field that reflects the timestamp of the most recent successful content change.

#### Scenario: Successful update

- **WHEN** `onNewData` is called due to changed content
- **THEN** `lastUpdated` SHALL be set to the current `Date` at the time of the update

#### Scenario: No update yet

- **WHEN** no successful content change has occurred since mount
- **THEN** `lastUpdated` SHALL be `null`

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