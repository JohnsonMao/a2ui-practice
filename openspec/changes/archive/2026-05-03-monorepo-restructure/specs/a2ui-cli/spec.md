## ADDED Requirements

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

### Requirement: CLI is distributed as a single CJS bundle

The `@a2ui/cli` build SHALL produce a single `dist/cli.cjs` file that can be executed with `node` without additional dependencies being bundled (Node builtins and `jiti` are externalized).

#### Scenario: CLI bundle exists after build

- **WHEN** `pnpm --filter @a2ui/cli build` is executed
- **THEN** `packages/cli/dist/cli.cjs` SHALL exist
- **THEN** `node packages/cli/dist/cli.cjs --help` SHALL print help listing `serve` and `generate-refs` subcommands
