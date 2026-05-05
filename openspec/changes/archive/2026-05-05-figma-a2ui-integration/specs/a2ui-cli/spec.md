## ADDED Requirements

### Requirement: CLI provides a2ui pull-figma command

The `@a2ui/cli` package SHALL provide an `a2ui pull-figma <figma-url>` command that reads a Figma frame via the Figma REST API, converts it to A2UI JSON using `catalogFigmaMap`, and writes the result to the local `ui.json` file. The command SHALL read the Figma Personal Access Token from the `FIGMA_TOKEN` environment variable.

#### Scenario: Successful pull from Figma

- **WHEN** the user runs `a2ui pull-figma https://figma.com/design/<key>?node-id=<id>` with `FIGMA_TOKEN` set
- **THEN** the CLI SHALL fetch the specified frame from the Figma API
- **THEN** the CLI SHALL convert the frame tree to A2UI JSON using `catalogFigmaMap`
- **THEN** the CLI SHALL write the result to the `ui.json` path used by the running `serve` instance (default: `ui.json` in the CLI bundle directory)
- **THEN** the CLI SHALL print a success message with the number of components mapped

#### Scenario: FIGMA_TOKEN not set

- **WHEN** the user runs `a2ui pull-figma` without the `FIGMA_TOKEN` environment variable set
- **THEN** the CLI SHALL print an error message explaining how to set `FIGMA_TOKEN`
- **THEN** the CLI SHALL exit with a non-zero exit code

#### Scenario: Invalid or inaccessible Figma URL

- **WHEN** the user runs `a2ui pull-figma` with a URL that cannot be accessed with the provided token
- **THEN** the CLI SHALL print an error message with the HTTP status code from the Figma API
- **THEN** the CLI SHALL exit with a non-zero exit code

## MODIFIED Requirements

### Requirement: CLI provides a2ui serve command

The `@a2ui/cli` package SHALL provide an `a2ui serve` command that starts a zero-dependency HTTP static server serving the pre-built A2UI React app. The server SHALL support a `--port` flag (default 5173) and SHALL open the browser automatically on start. The server SHALL accept `POST /ui.json` requests with a JSON body, write the body content to the `ui.json` file, and respond with `200 OK`, enabling external tools such as the Figma Plugin to push preview updates.

#### Scenario: Serve starts successfully

- **WHEN** the user runs `a2ui serve`
- **THEN** the server SHALL start on port 5173 and open the browser at `http://localhost:5173`

#### Scenario: Serve starts on custom port

- **WHEN** the user runs `a2ui serve --port 3000`
- **THEN** the server SHALL start on port 3000

#### Scenario: POST /ui.json updates preview

- **WHEN** an external client sends `POST /ui.json` with a valid A2UI JSON array body
- **THEN** the server SHALL write the body to the `ui.json` file
- **THEN** the server SHALL respond with HTTP 200
- **THEN** the React App's next polling cycle SHALL render the updated content

#### Scenario: POST /ui.json with invalid JSON body

- **WHEN** an external client sends `POST /ui.json` with a malformed JSON body
- **THEN** the server SHALL respond with HTTP 400 and an error message
- **THEN** the existing `ui.json` file SHALL remain unchanged
