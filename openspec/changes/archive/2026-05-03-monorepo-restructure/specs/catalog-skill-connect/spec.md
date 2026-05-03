## MODIFIED Requirements

### Requirement: skill.ts provides a2ui.skill() registration function

~~`src/catalog/skill.ts` SHALL export a module-level registry...~~

`@a2ui/sdk` SHALL export `a2ui.skill()` and `getRegistry()` as its public API. Component skill files SHALL import from `@a2ui/sdk` instead of a local `skill.ts` file.

#### Scenario: Component registers via a2ui.skill()

- **WHEN** `a2ui.skill(XxxApi, { example, notes })` is called as a module-level side effect in a `*.skill.ts` file that imports from `@a2ui/sdk`
- **THEN** the entry SHALL be appended to the SDK's module-level registry array
- **THEN** the entry SHALL contain the `api` object, the `example` function, and the optional `notes` string

#### Scenario: getRegistry() returns all registered entries

- **WHEN** `getRegistry()` is called (from `@a2ui/sdk`) after one or more `*.skill.ts` files have been dynamically imported
- **THEN** it SHALL return a copy of the registry array containing all registered entries in import order

#### Scenario: example return type is constrained by generic

- **WHEN** `a2ui.skill<Api extends ComponentApi>(api, { example })` is called
- **THEN** the TypeScript compiler SHALL enforce that `example()` returns `{ id: string; component: string } & InferredComponentApiSchemaType<Api>`
- **THEN** a compile-time error SHALL occur if the `example` return shape does not match the API schema
