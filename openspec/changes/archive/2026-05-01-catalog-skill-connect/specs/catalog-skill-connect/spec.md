## ADDED Requirements

### Requirement: skill.ts provides a2ui.skill() registration function

`src/catalog/skill.ts` SHALL export an `a2ui` object with a `skill()` method and a `getRegistry()` function. The `skill()` method SHALL accept a `ComponentApi` object and an options object with optional `example` and `notes` fields. Calling `skill()` SHALL register the entry in a module-level array as a side effect, without requiring any export from the caller.

#### Scenario: Component registers a skill entry

- **WHEN** a `*.skill.ts` file calls `a2ui.skill(XxxApi, { example: () => ({...}), notes: '...' })`
- **THEN** the entry SHALL be stored in the module-level registry
- **THEN** `getRegistry()` SHALL return an array that includes `{ api: XxxApi, example: fn, notes: '...' }`

#### Scenario: Multiple components register independently

- **WHEN** multiple `*.skill.ts` files are imported in sequence
- **THEN** `getRegistry()` SHALL return all registered entries in import order

### Requirement: Each catalog component has a colocated *.skill.ts file

Every file at `src/catalog/components/<name>.tsx` SHALL have a corresponding `src/catalog/components/<name>.skill.ts` file. The `*.skill.ts` file SHALL import `XxxApi` from the sibling `*.tsx` file (not `XxxImpl`) and call `a2ui.skill()` with at minimum an `example` function.

#### Scenario: skill.ts imports only the Api, not the Impl

- **WHEN** a `*.skill.ts` file is authored
- **THEN** it SHALL import only `XxxApi` from the sibling component file
- **THEN** it SHALL NOT import `XxxImpl` or any React component that uses browser-specific APIs

#### Scenario: example function returns a valid JSON component object

- **WHEN** the `example` function is called with no arguments
- **THEN** it SHALL return a plain object with at minimum `id`, `component`, and any required props populated with representative values

### Requirement: generate-catalog-refs.ts scans *.skill.ts files as source of truth

`scripts/generate-catalog-refs.ts` SHALL discover all component registrations by globbing `src/catalog/components/*.skill.ts`, dynamically importing each file to trigger side effects, then calling `getRegistry()` to obtain all `{ api, example, notes }` entries. It SHALL NOT import from `api-registry.ts`.

#### Scenario: CLI generates references from skill registrations

- **WHEN** `pnpm generate:refs` is run
- **THEN** the script SHALL glob all `*.skill.ts` files under `src/catalog/components/`
- **THEN** each file SHALL be dynamically imported
- **THEN** `getRegistry()` SHALL be called after all imports complete
- **THEN** one Markdown file SHALL be written to `skills/generate-ui/references/<ComponentName>.md` per registered entry

#### Scenario: example function output is used in Markdown JSON Example section

- **WHEN** a component has a registered `example` function
- **THEN** the generated Markdown SHALL use the return value of `example()` as the JSON Example block
- **THEN** the auto-derived example logic (current `exampleValue()`) SHALL NOT be used for that component

### Requirement: api-registry.ts is removed

`src/catalog/api-registry.ts` SHALL be deleted. No file in the project SHALL import from `src/catalog/api-registry`.

#### Scenario: No remaining imports of api-registry

- **WHEN** `api-registry.ts` is deleted
- **THEN** no TypeScript source file SHALL contain an import path referencing `api-registry`
- **THEN** `pnpm typecheck` SHALL pass without errors
