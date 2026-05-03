## MODIFIED Requirements

### Requirement: CLI provides serve command

~~The CLI SHALL start a zero-dependency HTTP static server on port 5173 serving the pre-built A2UI React app and the skill's `ui.json` file when the `serve` subcommand is invoked via `node cli.cjs serve`.~~

The CLI SHALL start a zero-dependency HTTP static server serving the pre-built A2UI React app when the `serve` subcommand is invoked via `a2ui serve`. The server SHALL support a `--port` flag (default 5173). After the server starts, the CLI SHALL open `http://localhost:<port>` in the default browser automatically.

#### Scenario: Serve starts successfully

- **WHEN** `a2ui serve` is executed and the specified port is available
- **THEN** the HTTP server SHALL listen on the specified port (default 5173)
- **THEN** the browser SHALL open `http://localhost:<port>`
- **THEN** a confirmation message SHALL be printed to stdout

#### Scenario: Port already in use

- **WHEN** `a2ui serve` is executed and the port is already bound
- **THEN** the CLI SHALL print a clear error message indicating port conflict with suggestion to use `--port`
- **THEN** the process SHALL exit with a non-zero exit code

## REMOVED Requirements

### Requirement: CLI provides open command

~~The CLI SHALL open `http://localhost:5173` in the default macOS browser when the `open` subcommand is invoked, without starting a server.~~

(Removed: use `a2ui serve --port <port>` with a different port instead.)
