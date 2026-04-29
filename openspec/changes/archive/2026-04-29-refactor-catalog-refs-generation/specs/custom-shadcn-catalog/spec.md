## ADDED Requirements

### Requirement: Custom catalog component APIs are exported for tooling

All custom component API objects defined in `src/catalog/components/` SHALL be exported as named exports from their source files and re-exported from `src/catalog/api-registry.ts`, so that build-time tooling (such as reference generators) can import them without loading React or JSX.

#### Scenario: BoxApi is accessible without React

- **WHEN** a Node.js script imports `BoxApi` from `src/catalog/api-registry.ts`
- **THEN** the import SHALL succeed without requiring JSX transformation, and `BoxApi.name` SHALL equal `"Box"`

#### Scenario: SandboxApi is accessible without React

- **WHEN** a Node.js script imports `SandboxApi` from `src/catalog/api-registry.ts`
- **THEN** the import SHALL succeed without requiring JSX transformation, and `SandboxApi.name` SHALL equal `"Sandbox"`

#### Scenario: api-registry exports all catalog APIs

- **WHEN** `src/catalog/api-registry.ts` is imported
- **THEN** it SHALL export an API object for every component file in `src/catalog/components/` (excluding test files and files prefixed with `_`)

---

### Requirement: generate:refs produces reference files for all catalog components

Running `pnpm generate:refs` SHALL produce one Markdown reference file in `skills/generate-ui/references/` for every API exported from `src/catalog/api-registry.ts`, with no components silently skipped.

#### Scenario: Box reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/Box.md` SHALL exist and contain a props table derived from `BoxApi.schema`

#### Scenario: Sandbox reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/Sandbox.md` SHALL exist and contain a props table derived from `SandboxApi.schema`

#### Scenario: CheckBox reference file generated

- **WHEN** `pnpm generate:refs` is executed
- **THEN** `skills/generate-ui/references/CheckBox.md` SHALL exist and contain a props table derived from `CheckBoxApi.schema`

#### Scenario: No components silently skipped

- **WHEN** `pnpm generate:refs` completes successfully
- **THEN** the count of files in `skills/generate-ui/references/` SHALL equal the count of API objects exported from `src/catalog/api-registry.ts`, and the script SHALL print no `⚠ No API found` warnings
