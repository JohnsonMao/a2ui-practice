# a2ui-cli Specification

## Purpose

TBD - created by archiving change 'monorepo-restructure'. Update Purpose after archive.

## Requirements

### Requirement: CLI provides a2ui serve command

The `@a2ui/cli` package SHALL provide an `a2ui serve` command that starts a zero-dependency HTTP static server serving the pre-built A2UI React app. The server SHALL support a `--port` flag (default 5173) and SHALL open the browser automatically on start.

#### Scenario: Serve starts successfully

- **WHEN** `a2ui serve` is executed and the specified port is available
- **THEN** the HTTP server SHALL listen on the specified port (default 5173)
- **THEN** the browser SHALL open `http://localhost:<port>` automatically
- **THEN** a confirmation message SHALL be printed to stdout

#### Scenario: Port already in use

- **WHEN** `a2ui serve` is executed and the port is already bound
- **THEN** the CLI SHALL print a clear error message indicating port conflict
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: monorepo-restructure
updated: 2026-05-03
code:
  - src/catalog/components/choice-picker.tsx
  - packages/app/src/catalog/components/typography.tsx
  - packages/app/src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/slider.skill.ts
  - packages/app/src/catalog/components/list.tsx
  - packages/app/src/catalog/components/divider.tsx
  - public/ui.json
  - src/catalog/components/audio-player.tsx
  - packages/app/src/catalog/components/table.tsx
  - src/components/ui/select.tsx
  - src/main.tsx
  - example/src/button.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - packages/app/src/catalog/components/divider.skill.ts
  - packages/app/src/index.css
  - src/catalog/components/checkbox.tsx
  - packages/app/src/components/ui/separator.tsx
  - packages/app/src/catalog/components/choice-picker.tsx
  - packages/app/src/hooks/useJsonPolling.ts
  - src/catalog/components/sandbox.skill.ts
  - packages/sdk/src/index.ts
  - src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/typography.skill.ts
  - src/components/ui/input.tsx
  - src/catalog/components/sandbox.tsx
  - packages/app/src/catalog/components/dialog.skill.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/app/src/components/ui/popover.tsx
  - src/catalog/components/date-time-input.tsx
  - packages/app/src/catalog/components/box.tsx
  - src/catalog/components/button.tsx
  - src/components/ui/checkbox.tsx
  - packages/app/src/catalog/components/modal.tsx
  - packages/app/src/catalog/components/button.skill.ts
  - packages/app/src/catalog/components/table.skill.ts
  - packages/cli/src/commands/serve.ts
  - src/components/ui/typography.tsx
  - packages/app/src/catalog/components/row.tsx
  - packages/app/src/catalog/components/slider.tsx
  - packages/app/src/catalog/components/image.tsx
  - packages/app/src/lib/utils.ts
  - src/catalog/components/column.tsx
  - src/components/ui/calendar.tsx
  - index.html
  - packages/app/src/catalog/components/sandbox.tsx
  - packages/sdk/vitest.config.ts
  - packages/app/src/catalog/components/dialog.tsx
  - packages/app/src/catalog/components/text.tsx
  - packages/app/src/catalog/index.ts
  - packages/cli/package.json
  - src/catalog/components/dialog.skill.ts
  - packages/app/src/catalog/components/audio-player.tsx
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
  - packages/app/src/catalog/components/row.skill.ts
  - packages/app/src/catalog/components/tabs.tsx
  - src/catalog/components/date-time-input.skill.ts
  - src/components/ui/card.tsx
  - src/catalog/components/date-picker.tsx
  - packages/app/public/icons.svg
  - packages/app/src/catalog/components/audio-player.skill.ts
  - packages/app/src/vite-env.d.ts
  - src/components/ui/dialog.tsx
  - packages/cli/tsconfig.json
  - packages/app/src/catalog/components/video.tsx
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/modal.skill.ts
  - packages/app/src/catalog/components/list.skill.ts
  - packages/app/src/catalog/components/column.tsx
  - packages/app/src/App.tsx
  - packages/app/tsconfig.node.json
  - src/catalog/components/table.tsx
  - pnpm-workspace.yaml
  - tsconfig.app.json
  - packages/app/components.json
  - src/catalog/components/icon.skill.ts
  - packages/app/vite.config.ts
  - src/catalog/index.ts
  - packages/app/src/components/ui/dialog.tsx
  - packages/app/src/catalog/components/badge.skill.ts
  - packages/app/src/components/ui/calendar.tsx
  - packages/app/src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/typography.tsx
  - packages/app/src/catalog/components/video.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/list.tsx
  - src/components/ui/slider.tsx
  - vite.config.ts
  - src/lib/utils.ts
  - packages/app/src/catalog/components/text.skill.ts
  - packages/app/src/catalog/components/slider.skill.ts
  - components.json
  - package.json
  - packages/app/src/catalog/components/checkbox.skill.ts
  - packages/app/src/catalog/components/icon.tsx
  - packages/app/src/components/ui/button.tsx
  - packages/app/src/catalog/components/card.skill.ts
  - packages/app/src/catalog/components/modal.skill.ts
  - src/components/ui/table.tsx
  - src/hooks/useJsonPolling.ts
  - packages/app/src/catalog/components/date-time-input.tsx
  - tsconfig.json
  - example/tsconfig.json
  - packages/app/src/catalog/components/badge.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/icon.tsx
  - packages/app/src/catalog/components/date-picker.tsx
  - packages/cli/src/index.ts
  - packages/app/src/components/ui/checkbox.tsx
  - packages/sdk/tsconfig.json
  - packages/app/src/catalog/components/icon.skill.ts
  - public/icons.svg
  - src/catalog/components/video.skill.ts
  - packages/app/src/catalog/components/button.tsx
  - src/components/ui/tabs.tsx
  - packages/app/src/components/ui/badge.tsx
  - src/catalog/components/date-picker.skill.ts
  - public/favicon.svg
  - example/package.json
  - packages/app/src/catalog/components/column.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/column.skill.ts
  - turbo.json
  - packages/app/src/catalog/components/sandbox.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/text.tsx
  - packages/app/src/components/ui/select.tsx
  - src/components/ui/badge.tsx
  - packages/app/src/catalog/components/tabs.skill.ts
  - tsconfig.node.json
  - src/components/ui/separator.tsx
  - packages/app/src/main.tsx
  - src/catalog/components/button.skill.ts
  - vite.cli.config.ts
  - src/catalog/components/typography.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/input.tsx
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/components/image.tsx
  - cli/index.ts
  - packages/app/src/components/ui/slider.tsx
  - packages/app/src/components/ui/table.tsx
  - packages/sdk/package.json
  - packages/app/src/catalog/components/checkbox.tsx
  - src/catalog/components/badge.tsx
  - src/catalog/components/row.tsx
  - packages/app/package.json
  - packages/app/src/catalog/components/card.tsx
  - src/components/ui/popover.tsx
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/tabs.tsx
  - packages/app/src/catalog/components/box.skill.ts
  - packages/app/src/components/ui/tabs.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/row.skill.ts
  - packages/app/index.html
  - packages/app/src/components/ui/date-picker.tsx
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/card.skill.ts
  - example/README.md
  - packages/app/src/catalog/components/date-picker.skill.ts
  - packages/app/src/catalog/components/text-field.skill.ts
  - packages/app/tsconfig.json
  - packages/cli/vite.config.ts
  - src/catalog/components/modal.tsx
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/video.tsx
  - src/components/ui/button.tsx
  - packages/app/public/ui.json
  - src/App.tsx
  - src/catalog/components/dialog.tsx
  - packages/app/tsconfig.app.json
  - src/components/ui/date-picker.tsx
  - packages/app/src/catalog/components/date-time-input.skill.ts
  - packages/app/src/components/ui/card.tsx
  - src/catalog/components/box.skill.ts
  - src/index.css
  - scripts/generate-catalog-refs.ts
  - packages/app/public/favicon.svg
tests:
  - packages/app/src/test/setup.test.ts
  - packages/app/src/catalog/components/__tests__/catalog-components.test.tsx
  - src/test/setup.test.ts
  - packages/app/src/App.test.tsx
  - packages/app/src/test/setup.ts
  - packages/app/src/hooks/useJsonPolling.test.ts
  - src/hooks/useJsonPolling.test.ts
  - src/test/setup.ts
  - cli/__tests__/cli.test.mjs
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
  - packages/sdk/src/__tests__/skill.test.ts
  - packages/app/src/catalog/__tests__/skill.test.ts
  - src/App.test.tsx
-->

---
### Requirement: CLI provides a2ui generate-refs command

The `@a2ui/cli` package SHALL provide an `a2ui generate-refs` command that scans a directory for `*.skill.ts` files, dynamically imports them to populate the `@a2ui/sdk` registry, and writes one Markdown reference file per registered component to an output directory. The command SHALL support `--dir` and `--out` flags.

#### Scenario: Generate refs from TypeScript skill files

- **WHEN** `a2ui generate-refs --dir <dir> --out <out>` is executed and `<dir>` contains `*.skill.ts` files
- **THEN** each `*.skill.ts` file SHALL be imported as a side effect via `jiti` (supporting TypeScript without pre-compilation)
- **THEN** one Markdown file per registered component SHALL be written to `<out>/`
- **THEN** each Markdown file SHALL contain a props table and a JSON example block

#### Scenario: No skill files found

- **WHEN** `a2ui generate-refs --dir <dir>` is executed and `<dir>` contains no `*.skill.ts` files
- **THEN** the CLI SHALL print a warning to stderr
- **THEN** the process SHALL exit with code 0


<!-- @trace
source: monorepo-restructure
updated: 2026-05-03
code:
  - src/catalog/components/choice-picker.tsx
  - packages/app/src/catalog/components/typography.tsx
  - packages/app/src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/slider.skill.ts
  - packages/app/src/catalog/components/list.tsx
  - packages/app/src/catalog/components/divider.tsx
  - public/ui.json
  - src/catalog/components/audio-player.tsx
  - packages/app/src/catalog/components/table.tsx
  - src/components/ui/select.tsx
  - src/main.tsx
  - example/src/button.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - packages/app/src/catalog/components/divider.skill.ts
  - packages/app/src/index.css
  - src/catalog/components/checkbox.tsx
  - packages/app/src/components/ui/separator.tsx
  - packages/app/src/catalog/components/choice-picker.tsx
  - packages/app/src/hooks/useJsonPolling.ts
  - src/catalog/components/sandbox.skill.ts
  - packages/sdk/src/index.ts
  - src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/typography.skill.ts
  - src/components/ui/input.tsx
  - src/catalog/components/sandbox.tsx
  - packages/app/src/catalog/components/dialog.skill.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/app/src/components/ui/popover.tsx
  - src/catalog/components/date-time-input.tsx
  - packages/app/src/catalog/components/box.tsx
  - src/catalog/components/button.tsx
  - src/components/ui/checkbox.tsx
  - packages/app/src/catalog/components/modal.tsx
  - packages/app/src/catalog/components/button.skill.ts
  - packages/app/src/catalog/components/table.skill.ts
  - packages/cli/src/commands/serve.ts
  - src/components/ui/typography.tsx
  - packages/app/src/catalog/components/row.tsx
  - packages/app/src/catalog/components/slider.tsx
  - packages/app/src/catalog/components/image.tsx
  - packages/app/src/lib/utils.ts
  - src/catalog/components/column.tsx
  - src/components/ui/calendar.tsx
  - index.html
  - packages/app/src/catalog/components/sandbox.tsx
  - packages/sdk/vitest.config.ts
  - packages/app/src/catalog/components/dialog.tsx
  - packages/app/src/catalog/components/text.tsx
  - packages/app/src/catalog/index.ts
  - packages/cli/package.json
  - src/catalog/components/dialog.skill.ts
  - packages/app/src/catalog/components/audio-player.tsx
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
  - packages/app/src/catalog/components/row.skill.ts
  - packages/app/src/catalog/components/tabs.tsx
  - src/catalog/components/date-time-input.skill.ts
  - src/components/ui/card.tsx
  - src/catalog/components/date-picker.tsx
  - packages/app/public/icons.svg
  - packages/app/src/catalog/components/audio-player.skill.ts
  - packages/app/src/vite-env.d.ts
  - src/components/ui/dialog.tsx
  - packages/cli/tsconfig.json
  - packages/app/src/catalog/components/video.tsx
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/modal.skill.ts
  - packages/app/src/catalog/components/list.skill.ts
  - packages/app/src/catalog/components/column.tsx
  - packages/app/src/App.tsx
  - packages/app/tsconfig.node.json
  - src/catalog/components/table.tsx
  - pnpm-workspace.yaml
  - tsconfig.app.json
  - packages/app/components.json
  - src/catalog/components/icon.skill.ts
  - packages/app/vite.config.ts
  - src/catalog/index.ts
  - packages/app/src/components/ui/dialog.tsx
  - packages/app/src/catalog/components/badge.skill.ts
  - packages/app/src/components/ui/calendar.tsx
  - packages/app/src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/typography.tsx
  - packages/app/src/catalog/components/video.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/list.tsx
  - src/components/ui/slider.tsx
  - vite.config.ts
  - src/lib/utils.ts
  - packages/app/src/catalog/components/text.skill.ts
  - packages/app/src/catalog/components/slider.skill.ts
  - components.json
  - package.json
  - packages/app/src/catalog/components/checkbox.skill.ts
  - packages/app/src/catalog/components/icon.tsx
  - packages/app/src/components/ui/button.tsx
  - packages/app/src/catalog/components/card.skill.ts
  - packages/app/src/catalog/components/modal.skill.ts
  - src/components/ui/table.tsx
  - src/hooks/useJsonPolling.ts
  - packages/app/src/catalog/components/date-time-input.tsx
  - tsconfig.json
  - example/tsconfig.json
  - packages/app/src/catalog/components/badge.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/icon.tsx
  - packages/app/src/catalog/components/date-picker.tsx
  - packages/cli/src/index.ts
  - packages/app/src/components/ui/checkbox.tsx
  - packages/sdk/tsconfig.json
  - packages/app/src/catalog/components/icon.skill.ts
  - public/icons.svg
  - src/catalog/components/video.skill.ts
  - packages/app/src/catalog/components/button.tsx
  - src/components/ui/tabs.tsx
  - packages/app/src/components/ui/badge.tsx
  - src/catalog/components/date-picker.skill.ts
  - public/favicon.svg
  - example/package.json
  - packages/app/src/catalog/components/column.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/column.skill.ts
  - turbo.json
  - packages/app/src/catalog/components/sandbox.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/text.tsx
  - packages/app/src/components/ui/select.tsx
  - src/components/ui/badge.tsx
  - packages/app/src/catalog/components/tabs.skill.ts
  - tsconfig.node.json
  - src/components/ui/separator.tsx
  - packages/app/src/main.tsx
  - src/catalog/components/button.skill.ts
  - vite.cli.config.ts
  - src/catalog/components/typography.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/input.tsx
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/components/image.tsx
  - cli/index.ts
  - packages/app/src/components/ui/slider.tsx
  - packages/app/src/components/ui/table.tsx
  - packages/sdk/package.json
  - packages/app/src/catalog/components/checkbox.tsx
  - src/catalog/components/badge.tsx
  - src/catalog/components/row.tsx
  - packages/app/package.json
  - packages/app/src/catalog/components/card.tsx
  - src/components/ui/popover.tsx
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/tabs.tsx
  - packages/app/src/catalog/components/box.skill.ts
  - packages/app/src/components/ui/tabs.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/row.skill.ts
  - packages/app/index.html
  - packages/app/src/components/ui/date-picker.tsx
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/card.skill.ts
  - example/README.md
  - packages/app/src/catalog/components/date-picker.skill.ts
  - packages/app/src/catalog/components/text-field.skill.ts
  - packages/app/tsconfig.json
  - packages/cli/vite.config.ts
  - src/catalog/components/modal.tsx
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/video.tsx
  - src/components/ui/button.tsx
  - packages/app/public/ui.json
  - src/App.tsx
  - src/catalog/components/dialog.tsx
  - packages/app/tsconfig.app.json
  - src/components/ui/date-picker.tsx
  - packages/app/src/catalog/components/date-time-input.skill.ts
  - packages/app/src/components/ui/card.tsx
  - src/catalog/components/box.skill.ts
  - src/index.css
  - scripts/generate-catalog-refs.ts
  - packages/app/public/favicon.svg
tests:
  - packages/app/src/test/setup.test.ts
  - packages/app/src/catalog/components/__tests__/catalog-components.test.tsx
  - src/test/setup.test.ts
  - packages/app/src/App.test.tsx
  - packages/app/src/test/setup.ts
  - packages/app/src/hooks/useJsonPolling.test.ts
  - src/hooks/useJsonPolling.test.ts
  - src/test/setup.ts
  - cli/__tests__/cli.test.mjs
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
  - packages/sdk/src/__tests__/skill.test.ts
  - packages/app/src/catalog/__tests__/skill.test.ts
  - src/App.test.tsx
-->

---
### Requirement: CLI is distributed as a single CJS bundle

The `@a2ui/cli` build SHALL produce a single `dist/cli.cjs` file that can be executed with `node` without additional dependencies being bundled (Node builtins and `jiti` are externalized).

#### Scenario: CLI bundle exists after build

- **WHEN** `pnpm --filter @a2ui/cli build` is executed
- **THEN** `packages/cli/dist/cli.cjs` SHALL exist
- **THEN** `node packages/cli/dist/cli.cjs --help` SHALL print help listing `serve` and `generate-refs` subcommands

<!-- @trace
source: monorepo-restructure
updated: 2026-05-03
code:
  - src/catalog/components/choice-picker.tsx
  - packages/app/src/catalog/components/typography.tsx
  - packages/app/src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/slider.skill.ts
  - packages/app/src/catalog/components/list.tsx
  - packages/app/src/catalog/components/divider.tsx
  - public/ui.json
  - src/catalog/components/audio-player.tsx
  - packages/app/src/catalog/components/table.tsx
  - src/components/ui/select.tsx
  - src/main.tsx
  - example/src/button.skill.ts
  - src/catalog/components/audio-player.skill.ts
  - packages/app/src/catalog/components/divider.skill.ts
  - packages/app/src/index.css
  - src/catalog/components/checkbox.tsx
  - packages/app/src/components/ui/separator.tsx
  - packages/app/src/catalog/components/choice-picker.tsx
  - packages/app/src/hooks/useJsonPolling.ts
  - src/catalog/components/sandbox.skill.ts
  - packages/sdk/src/index.ts
  - src/catalog/components/text-field.tsx
  - packages/app/src/catalog/components/typography.skill.ts
  - src/components/ui/input.tsx
  - src/catalog/components/sandbox.tsx
  - packages/app/src/catalog/components/dialog.skill.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/app/src/components/ui/popover.tsx
  - src/catalog/components/date-time-input.tsx
  - packages/app/src/catalog/components/box.tsx
  - src/catalog/components/button.tsx
  - src/components/ui/checkbox.tsx
  - packages/app/src/catalog/components/modal.tsx
  - packages/app/src/catalog/components/button.skill.ts
  - packages/app/src/catalog/components/table.skill.ts
  - packages/cli/src/commands/serve.ts
  - src/components/ui/typography.tsx
  - packages/app/src/catalog/components/row.tsx
  - packages/app/src/catalog/components/slider.tsx
  - packages/app/src/catalog/components/image.tsx
  - packages/app/src/lib/utils.ts
  - src/catalog/components/column.tsx
  - src/components/ui/calendar.tsx
  - index.html
  - packages/app/src/catalog/components/sandbox.tsx
  - packages/sdk/vitest.config.ts
  - packages/app/src/catalog/components/dialog.tsx
  - packages/app/src/catalog/components/text.tsx
  - packages/app/src/catalog/index.ts
  - packages/cli/package.json
  - src/catalog/components/dialog.skill.ts
  - packages/app/src/catalog/components/audio-player.tsx
  - src/catalog/skill.ts
  - src/catalog/components/table.skill.ts
  - packages/app/src/catalog/components/row.skill.ts
  - packages/app/src/catalog/components/tabs.tsx
  - src/catalog/components/date-time-input.skill.ts
  - src/components/ui/card.tsx
  - src/catalog/components/date-picker.tsx
  - packages/app/public/icons.svg
  - packages/app/src/catalog/components/audio-player.skill.ts
  - packages/app/src/vite-env.d.ts
  - src/components/ui/dialog.tsx
  - packages/cli/tsconfig.json
  - packages/app/src/catalog/components/video.tsx
  - src/catalog/components/divider.skill.ts
  - src/catalog/components/modal.skill.ts
  - packages/app/src/catalog/components/list.skill.ts
  - packages/app/src/catalog/components/column.tsx
  - packages/app/src/App.tsx
  - packages/app/tsconfig.node.json
  - src/catalog/components/table.tsx
  - pnpm-workspace.yaml
  - tsconfig.app.json
  - packages/app/components.json
  - src/catalog/components/icon.skill.ts
  - packages/app/vite.config.ts
  - src/catalog/index.ts
  - packages/app/src/components/ui/dialog.tsx
  - packages/app/src/catalog/components/badge.skill.ts
  - packages/app/src/components/ui/calendar.tsx
  - packages/app/src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/typography.tsx
  - packages/app/src/catalog/components/video.skill.ts
  - src/catalog/components/choice-picker.skill.ts
  - src/catalog/components/list.skill.ts
  - src/catalog/components/list.tsx
  - src/components/ui/slider.tsx
  - vite.config.ts
  - src/lib/utils.ts
  - packages/app/src/catalog/components/text.skill.ts
  - packages/app/src/catalog/components/slider.skill.ts
  - components.json
  - package.json
  - packages/app/src/catalog/components/checkbox.skill.ts
  - packages/app/src/catalog/components/icon.tsx
  - packages/app/src/components/ui/button.tsx
  - packages/app/src/catalog/components/card.skill.ts
  - packages/app/src/catalog/components/modal.skill.ts
  - src/components/ui/table.tsx
  - src/hooks/useJsonPolling.ts
  - packages/app/src/catalog/components/date-time-input.tsx
  - tsconfig.json
  - example/tsconfig.json
  - packages/app/src/catalog/components/badge.tsx
  - src/catalog/components/card.tsx
  - src/catalog/components/icon.tsx
  - packages/app/src/catalog/components/date-picker.tsx
  - packages/cli/src/index.ts
  - packages/app/src/components/ui/checkbox.tsx
  - packages/sdk/tsconfig.json
  - packages/app/src/catalog/components/icon.skill.ts
  - public/icons.svg
  - src/catalog/components/video.skill.ts
  - packages/app/src/catalog/components/button.tsx
  - src/components/ui/tabs.tsx
  - packages/app/src/components/ui/badge.tsx
  - src/catalog/components/date-picker.skill.ts
  - public/favicon.svg
  - example/package.json
  - packages/app/src/catalog/components/column.skill.ts
  - src/catalog/components/checkbox.skill.ts
  - src/catalog/components/column.skill.ts
  - turbo.json
  - packages/app/src/catalog/components/sandbox.skill.ts
  - src/catalog/components/box.tsx
  - src/catalog/components/text.tsx
  - packages/app/src/components/ui/select.tsx
  - src/components/ui/badge.tsx
  - packages/app/src/catalog/components/tabs.skill.ts
  - tsconfig.node.json
  - src/components/ui/separator.tsx
  - packages/app/src/main.tsx
  - src/catalog/components/button.skill.ts
  - vite.cli.config.ts
  - src/catalog/components/typography.tsx
  - src/catalog/components/slider.tsx
  - src/catalog/components/image.skill.ts
  - packages/app/src/components/ui/input.tsx
  - src/catalog/components/tabs.skill.ts
  - src/catalog/components/text.skill.ts
  - src/catalog/components/image.tsx
  - cli/index.ts
  - packages/app/src/components/ui/slider.tsx
  - packages/app/src/components/ui/table.tsx
  - packages/sdk/package.json
  - packages/app/src/catalog/components/checkbox.tsx
  - src/catalog/components/badge.tsx
  - src/catalog/components/row.tsx
  - packages/app/package.json
  - packages/app/src/catalog/components/card.tsx
  - src/components/ui/popover.tsx
  - src/catalog/components/typography.skill.ts
  - src/catalog/components/tabs.tsx
  - packages/app/src/catalog/components/box.skill.ts
  - packages/app/src/components/ui/tabs.tsx
  - src/catalog/components/divider.tsx
  - src/catalog/components/row.skill.ts
  - packages/app/index.html
  - packages/app/src/components/ui/date-picker.tsx
  - src/catalog/components/badge.skill.ts
  - src/catalog/components/card.skill.ts
  - example/README.md
  - packages/app/src/catalog/components/date-picker.skill.ts
  - packages/app/src/catalog/components/text-field.skill.ts
  - packages/app/tsconfig.json
  - packages/cli/vite.config.ts
  - src/catalog/components/modal.tsx
  - src/catalog/components/text-field.skill.ts
  - src/catalog/components/video.tsx
  - src/components/ui/button.tsx
  - packages/app/public/ui.json
  - src/App.tsx
  - src/catalog/components/dialog.tsx
  - packages/app/tsconfig.app.json
  - src/components/ui/date-picker.tsx
  - packages/app/src/catalog/components/date-time-input.skill.ts
  - packages/app/src/components/ui/card.tsx
  - src/catalog/components/box.skill.ts
  - src/index.css
  - scripts/generate-catalog-refs.ts
  - packages/app/public/favicon.svg
tests:
  - packages/app/src/test/setup.test.ts
  - packages/app/src/catalog/components/__tests__/catalog-components.test.tsx
  - src/test/setup.test.ts
  - packages/app/src/App.test.tsx
  - packages/app/src/test/setup.ts
  - packages/app/src/hooks/useJsonPolling.test.ts
  - src/hooks/useJsonPolling.test.ts
  - src/test/setup.ts
  - cli/__tests__/cli.test.mjs
  - src/catalog/components/__tests__/catalog-components.test.tsx
  - src/catalog/__tests__/skill.test.ts
  - packages/sdk/src/__tests__/skill.test.ts
  - packages/app/src/catalog/__tests__/skill.test.ts
  - src/App.test.tsx
-->

---
### Requirement: CLI provides read command

The `@a2ui/cli` package SHALL provide a `read` subcommand that reads the `ui.json` file and outputs its content to stdout. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. If the file does not exist, the command SHALL output `[]` and exit with code 0.

#### Scenario: File exists

- **WHEN** `a2ui read` is executed and `ui.json` exists
- **THEN** the full contents of `ui.json` SHALL be written to stdout
- **THEN** the process SHALL exit with code 0

#### Scenario: File does not exist

- **WHEN** `a2ui read` is executed and `ui.json` does not exist
- **THEN** the string `[]` SHALL be written to stdout
- **THEN** the process SHALL exit with code 0


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
### Requirement: CLI provides set command

The `@a2ui/cli` package SHALL provide a `set` subcommand that accepts a JSON string argument and writes it to `ui.json`, completely replacing existing content. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. On success, the command SHALL print a confirmation message to stdout and exit with code 0. If the JSON argument is invalid, the command SHALL print an error to stderr, exit with a non-zero code, and SHALL NOT modify the file.

#### Scenario: Valid JSON written

- **WHEN** `a2ui set '<valid-json>'` is executed
- **THEN** `ui.json` SHALL be overwritten with the provided JSON
- **THEN** a confirmation message SHALL be printed to stdout
- **THEN** the process SHALL exit with code 0

#### Scenario: Invalid JSON rejected

- **WHEN** `a2ui set '<invalid-json>'` is executed
- **THEN** an error message SHALL be printed to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
### Requirement: CLI provides update command

The `@a2ui/cli` package SHALL provide an `update` subcommand implementing Method A merge-by-ID: it reads the existing `ui.json`, locates the `updateComponents` message, and for each input component, replaces it if an entry with the same `id` exists, otherwise appends it. The result SHALL be written back to `ui.json`. The default path SHALL be `__dirname/ui.json`. The path MAY be overridden via `--ui-json <path>`. If the `updateComponents` message is absent, the command SHALL print an error to stderr, exit with a non-zero code, and SHALL NOT modify the file.

#### Scenario: Existing component replaced

- **WHEN** `a2ui update '<json>'` is executed and an entry with the same `id` exists in `updateComponents`
- **THEN** the existing entry SHALL be replaced with the input entry
- **THEN** all other entries SHALL be preserved
- **THEN** the process SHALL exit with code 0

#### Scenario: New component appended

- **WHEN** `a2ui update '<json>'` is executed and no entry with the same `id` exists in `updateComponents`
- **THEN** the input entry SHALL be appended to the `updateComponents` array
- **THEN** the process SHALL exit with code 0

#### Scenario: Missing updateComponents message

- **WHEN** `a2ui update '<json>'` is executed and `ui.json` contains no `updateComponents` message
- **THEN** an error message SHALL be printed to stderr
- **THEN** `ui.json` SHALL NOT be modified
- **THEN** the process SHALL exit with a non-zero exit code


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
### Requirement: CLI provides open command

The `@a2ui/cli` package SHALL provide an `open` subcommand that opens `http://localhost:<port>` in the default browser. The port SHALL default to 5173 and MAY be overridden via `--port <number>`. If the browser cannot be opened, the command SHALL print a warning to stderr and exit with code 0.

#### Scenario: Browser opens successfully

- **WHEN** `a2ui open` is executed
- **THEN** `http://localhost:5173` SHALL be opened in the default browser
- **THEN** the process SHALL exit with code 0

#### Scenario: Custom port

- **WHEN** `a2ui open --port 3000` is executed
- **THEN** `http://localhost:3000` SHALL be opened in the default browser


<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->

---
### Requirement: CLI ui-json path resolution

All commands that read or write `ui.json` (`read`, `set`, `update`, `serve`) SHALL resolve the file path using the following priority:

1. `--ui-json <path>` option if provided
2. `__dirname/ui.json` (same directory as the CLI script) as default

#### Scenario: Default path used

- **WHEN** a ui-json command is executed without `--ui-json`
- **THEN** the file SHALL be resolved relative to `__dirname`

#### Scenario: Override path used

- **WHEN** a ui-json command is executed with `--ui-json /custom/path/ui.json`
- **THEN** the file SHALL be resolved at `/custom/path/ui.json`

<!-- @trace
source: restore-cli-ui-json-commands
updated: 2026-05-04
code:
  - packages/cli/package.json
  - packages/app/package.json
  - packages/cli/src/commands/ui-json.ts
  - package.json
  - packages/cli/src/index.ts
  - packages/cli/src/commands/generate-refs.ts
  - packages/cli/vite.config.ts
tests:
  - packages/cli/src/__tests__/ui-json.test.ts
-->