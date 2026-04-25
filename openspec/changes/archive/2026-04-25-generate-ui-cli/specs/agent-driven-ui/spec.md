## MODIFIED Requirements

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
