# sandbox-catalog-component Specification

## Purpose

TBD - created by syncing change 'sandbox-catalog-component'. Update Purpose after archive.

## Requirements

### Requirement: Sandbox component renders arbitrary React source in iframe

The `Sandbox` catalog component (registered as `"Sandbox"` in `customCatalog`) SHALL render AI-provided React component source code inside an `<iframe>` using `srcdoc`. The iframe SHALL use the `sandbox="allow-scripts"` attribute to prevent navigation while permitting ES module execution.

#### Scenario: Source renders successfully

- **WHEN** a `Sandbox` component with a valid `source` prop (a string containing a valid ES module that exports a default React component) and a `props` prop (an object) is included in `updateComponents`
- **THEN** the rendered page SHALL display the output of that React component, receiving the `props` object as its React props, within an iframe region

#### Scenario: Source with third-party library renders successfully

- **WHEN** the `source` prop imports a third-party library using an absolute esm.sh URL (e.g., `import Chart from 'https://esm.sh/chart.js'`) and otherwise exports a valid default React component
- **THEN** the library SHALL be fetched from esm.sh at runtime and the component SHALL render without error

#### Scenario: Source syntax error shows error overlay

- **WHEN** the `source` prop contains invalid JavaScript or JSX that causes a runtime error inside the iframe
- **THEN** the iframe SHALL display a visible error overlay containing the error message, rather than a blank white area


<!-- @trace
source: sandbox-catalog-component
updated: 2026-04-28
code:
  - skills/generate-ui/scripts/assets/index-Bdw4MtAi.css
  - public/ui.json
  - skills/generate-ui/scripts/index.html
  - skills/generate-ui/scripts/assets/index-BYmVytfX.js
  - skills/generate-ui/references/CheckBox.md
  - skills/generate-ui/scripts/ui.json
  - src/catalog/components/sandbox.tsx
  - skills/generate-ui/scripts/assets/index-BxbJP-hD.js
  - skills/generate-ui/SKILL.md
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Props are passed to the sandboxed component via postMessage

The `Sandbox` catalog component SHALL transmit the `props` object to the iframe using `window.postMessage` with the message shape `{ type: 'a2ui:props', payload: <props object> }`. The iframe's bootstrap script SHALL listen for this message and pass the payload as React props to the mounted component.

#### Scenario: Props delivered on mount

- **WHEN** the `Sandbox` component mounts and the iframe `load` event fires
- **THEN** the parent SHALL dispatch a `postMessage` of type `a2ui:props` to the iframe contentWindow, containing the current `props` value

#### Scenario: Props update propagated

- **WHEN** the `props` prop of a mounted `Sandbox` component changes (e.g., A2UI state update)
- **THEN** the parent SHALL dispatch a new `postMessage` of type `a2ui:props` to the iframe contentWindow with the updated payload, causing the sandboxed component to re-render


<!-- @trace
source: sandbox-catalog-component
updated: 2026-04-28
code:
  - skills/generate-ui/scripts/assets/index-Bdw4MtAi.css
  - public/ui.json
  - skills/generate-ui/scripts/index.html
  - skills/generate-ui/scripts/assets/index-BYmVytfX.js
  - skills/generate-ui/references/CheckBox.md
  - skills/generate-ui/scripts/ui.json
  - src/catalog/components/sandbox.tsx
  - skills/generate-ui/scripts/assets/index-BxbJP-hD.js
  - skills/generate-ui/SKILL.md
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: Sandbox iframe height auto-adjusts to content

The iframe rendered by `Sandbox` SHALL automatically resize its height to match the sandboxed component's root element height. The iframe's bootstrap script SHALL observe the root element with `ResizeObserver` and post `{ type: 'a2ui:resize', height: <number> }` to `window.parent`. The `Sandbox` catalog component SHALL apply the received height as the iframe's `height` style property.

#### Scenario: Initial height set after render

- **WHEN** the sandboxed component finishes its first render and the `ResizeObserver` callback fires
- **THEN** the parent `Sandbox` component SHALL set the iframe height to the reported value in pixels

#### Scenario: Height updates on content change

- **WHEN** the sandboxed component's root element changes height (e.g., expanding a list)
- **THEN** the parent `Sandbox` component SHALL update the iframe height to match the new reported value within one animation frame


<!-- @trace
source: sandbox-catalog-component
updated: 2026-04-28
code:
  - skills/generate-ui/scripts/assets/index-Bdw4MtAi.css
  - public/ui.json
  - skills/generate-ui/scripts/index.html
  - skills/generate-ui/scripts/assets/index-BYmVytfX.js
  - skills/generate-ui/references/CheckBox.md
  - skills/generate-ui/scripts/ui.json
  - src/catalog/components/sandbox.tsx
  - skills/generate-ui/scripts/assets/index-BxbJP-hD.js
  - skills/generate-ui/SKILL.md
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->

---
### Requirement: AI agent skill documents Sandbox usage

The `skills/generate-ui/references/Sandbox.md` file SHALL exist and document the `Sandbox` component's props (`source`, `props`), usage rules, and a complete JSON example. The `skills/generate-ui/SKILL.md` file SHALL include a decision rule stating that `Sandbox` SHALL be used when no catalog component satisfies the requirement.

#### Scenario: SKILL.md references Sandbox decision rule

- **WHEN** the `SKILL.md` file is read by an AI agent
- **THEN** the file SHALL contain a rule directing the agent to use the `Sandbox` component when no other catalog component matches the user's requirement

#### Scenario: Sandbox.md provides complete documentation

- **WHEN** an AI agent reads `references/Sandbox.md`
- **THEN** the file SHALL contain the props table (with `source` and `props` documented), browser requirements (Chrome 89+), network requirement (esm.sh), and a JSON example using a real third-party library

<!-- @trace
source: sandbox-catalog-component
updated: 2026-04-28
code:
  - skills/generate-ui/scripts/assets/index-Bdw4MtAi.css
  - public/ui.json
  - skills/generate-ui/scripts/index.html
  - skills/generate-ui/scripts/assets/index-BYmVytfX.js
  - skills/generate-ui/references/CheckBox.md
  - skills/generate-ui/scripts/ui.json
  - src/catalog/components/sandbox.tsx
  - skills/generate-ui/scripts/assets/index-BxbJP-hD.js
  - skills/generate-ui/SKILL.md
tests:
  - src/catalog/components/__tests__/catalog-components.test.tsx
-->