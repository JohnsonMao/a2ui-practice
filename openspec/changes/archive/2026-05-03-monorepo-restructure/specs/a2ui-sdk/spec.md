## ADDED Requirements

### Requirement: SDK exports skill registration API

The `@a2ui/sdk` package SHALL export `a2ui.skill()`, `getRegistry()`, and `SkillEntry` type as its public API. The package SHALL declare `@a2ui/web_core` as a peerDependency and SHALL build to `dist/index.js` with accompanying type declarations.

#### Scenario: Skill registered and retrieved

- **WHEN** `a2ui.skill(api, { example })` is called with a valid `ComponentApi` and example factory
- **THEN** `getRegistry()` SHALL return an array containing the registered entry with `api`, `example`, and optional `notes`

#### Scenario: Registry is initially empty

- **WHEN** the SDK module is freshly imported (no prior registrations)
- **THEN** `getRegistry()` SHALL return an empty array

### Requirement: SDK package is independently buildable

The `@a2ui/sdk` package SHALL build in isolation via `pnpm --filter @a2ui/sdk build` without requiring any other workspace package to be built first.

#### Scenario: SDK build produces dist artifacts

- **WHEN** `pnpm --filter @a2ui/sdk build` is executed
- **THEN** `packages/sdk/dist/index.js` SHALL exist
- **THEN** `packages/sdk/dist/index.d.ts` SHALL exist
