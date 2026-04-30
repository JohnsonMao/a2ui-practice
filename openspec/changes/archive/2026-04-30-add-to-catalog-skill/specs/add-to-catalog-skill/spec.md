## ADDED Requirements

### Requirement: Agent reads source component to derive catalog schema

The SKILL SHALL instruct the Agent to read the target UI component's source file (e.g., `src/components/ui/date-picker.tsx`) and derive a Zod schema (`XxxApi`) from its props interface. The Agent SHALL use `src/catalog/components/box.tsx` as the structural reference for `XxxApi` and `XxxImpl` patterns.

#### Scenario: Agent derives schema from source component

- **WHEN** the user invokes the skill and provides a component path or name
- **THEN** the Agent SHALL read the target component source file
- **THEN** the Agent SHALL read `src/catalog/components/box.tsx` as a template reference
- **THEN** the Agent SHALL produce a `XxxApi` object with a Zod schema that covers semantically meaningful props and includes `.describe()` annotations for each field

#### Scenario: Agent cannot find the target component

- **WHEN** the user provides a component name that does not resolve to an existing file
- **THEN** the Agent SHALL list candidate files in `src/components/ui/` and ask the user to confirm the correct one before proceeding

### Requirement: Agent writes catalog component file

The SKILL SHALL instruct the Agent to write a new file at `src/catalog/components/<kebab-name>.tsx` containing both `XxxApi` (the ComponentApi object) and `XxxImpl` (the React implementation using `createComponentImplementation`).

#### Scenario: Catalog component file is created

- **WHEN** the Agent has derived the schema
- **THEN** the Agent SHALL create `src/catalog/components/<kebab-name>.tsx` with `XxxApi` exported and `XxxImpl` exported
- **THEN** the file SHALL follow the same import structure as `box.tsx` (imports from `@a2ui/web_core/v0_9`, `@a2ui/react/v0_9`, `zod`)

#### Scenario: File already exists

- **WHEN** the target file path already exists
- **THEN** the Agent SHALL stop and ask the user whether to overwrite or abort

### Requirement: Agent updates api-registry

The SKILL SHALL instruct the Agent to add an export line for `XxxApi` in `src/catalog/api-registry.ts`.

#### Scenario: Registry is updated

- **WHEN** the catalog component file has been created
- **THEN** the Agent SHALL append `export { XxxApi } from './components/<kebab-name>'` to `src/catalog/api-registry.ts`

#### Scenario: Export already exists

- **WHEN** the registry already contains an export for `XxxApi`
- **THEN** the Agent SHALL skip the update and notify the user

### Requirement: Agent executes post-update pipeline

The SKILL SHALL instruct the Agent to run `pnpm generate:refs` and `pnpm sync:skill` after the registry is updated.

#### Scenario: Pipeline runs successfully

- **WHEN** the registry has been updated
- **THEN** the Agent SHALL run `pnpm generate:refs`
- **THEN** the Agent SHALL run `pnpm sync:skill`
- **THEN** the Agent SHALL confirm to the user that `skills/generate-ui/references/Xxx.md` was created

#### Scenario: Pipeline command fails

- **WHEN** `pnpm generate:refs` or `pnpm sync:skill` exits with a non-zero code
- **THEN** the Agent SHALL display the error output and stop without proceeding to the next step
