## MODIFIED Requirements

### Requirement: Agent writes catalog component file

The SKILL SHALL instruct the Agent to write a new file at `src/catalog/components/<kebab-name>.tsx` containing both `XxxApi` (the ComponentApi object) and `XxxImpl` (the React implementation using `createComponentImplementation`).

#### Scenario: Catalog component file is created

- **WHEN** the Agent has derived the schema
- **THEN** the Agent SHALL create `src/catalog/components/<kebab-name>.tsx` with `XxxApi` exported and `XxxImpl` exported
- **THEN** the file SHALL follow the same import structure as `box.tsx` (imports from `@a2ui/web_core/v0_9`, `@a2ui/react/v0_9`, `zod`)

#### Scenario: File already exists

- **WHEN** the target file path already exists
- **THEN** the Agent SHALL stop and ask the user whether to overwrite or abort

## REMOVED Requirements

### Requirement: Agent updates api-registry

**Reason**: `api-registry.ts` is deleted as part of `catalog-skill-connect`. Component discovery is now handled by colocated `*.skill.ts` files.
**Migration**: Agents SHALL create a `*.skill.ts` file instead (see ADDED requirement below).

#### Scenario: Agent no longer modifies api-registry after adding a catalog component

- **WHEN** the Agent completes adding a new catalog component
- **THEN** the Agent SHALL NOT attempt to add an export line to `src/catalog/api-registry.ts`
- **THEN** the Agent SHALL create a `*.skill.ts` file as described in the ADDED requirement

## ADDED Requirements

### Requirement: Agent creates colocated skill file

The SKILL SHALL instruct the Agent to create `src/catalog/components/<kebab-name>.skill.ts` after the catalog component file is written. The skill file SHALL import `XxxApi` from the sibling `*.tsx` file and call `a2ui.skill(XxxApi, { example: () => ({...}) })` with a representative example object. The Agent SHALL use `src/catalog/components/button.skill.ts` as a structural reference.

#### Scenario: skill file is created alongside the catalog component

- **WHEN** the Agent has created `src/catalog/components/<kebab-name>.tsx`
- **THEN** the Agent SHALL create `src/catalog/components/<kebab-name>.skill.ts`
- **THEN** the skill file SHALL import only `XxxApi` (not `XxxImpl`) from the sibling file
- **THEN** the skill file SHALL call `a2ui.skill(XxxApi, { example: () => ({ id: 'my-<name>', component: '<Name>', ...requiredProps }) })`

#### Scenario: Agent executes post-update pipeline

- **WHEN** both the catalog component file and skill file have been created
- **THEN** the Agent SHALL run `pnpm generate:refs` to regenerate skill references
- **THEN** the Agent SHALL run `pnpm sync:skill` to sync the skill
