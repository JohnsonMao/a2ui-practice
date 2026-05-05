## ADDED Requirements

### Requirement: Figma Plugin provides Push to Preview action

The Figma Plugin SHALL provide a "Push to Preview" action that reads the currently selected Figma frame, converts it to A2UI JSON using `catalogFigmaMap`, and sends it to the local A2UI preview server via `POST /ui.json`.

#### Scenario: Successful push to preview

- **WHEN** the designer selects a Figma frame and clicks "Push to Preview" in the plugin
- **THEN** the plugin SHALL traverse the selected frame's node tree
- **THEN** the plugin SHALL map each component instance to its A2UI catalog equivalent using `catalogFigmaMap`
- **THEN** the plugin SHALL POST the resulting A2UI JSON to `http://localhost:<port>/ui.json`
- **THEN** the plugin UI SHALL display a success message

#### Scenario: Preview server not running

- **WHEN** the designer clicks "Push to Preview" but no local A2UI server is running on the configured port
- **THEN** the plugin SHALL display an error message instructing the user to run `a2ui serve`
- **THEN** the plugin SHALL NOT crash or leave the UI in an unresponsive state

### Requirement: Figma Plugin provides Pull from Preview action

The Figma Plugin SHALL provide a "Pull from Preview" action that fetches the current `ui.json` from the local A2UI preview server and creates corresponding Figma frames on the canvas using Figma component instances from the library.

#### Scenario: Successful pull from preview

- **WHEN** the designer clicks "Pull from Preview" in the plugin
- **THEN** the plugin SHALL fetch `ui.json` via `GET http://localhost:<port>/ui.json`
- **THEN** the plugin SHALL parse the A2UI JSON and create Figma frames on the current page using `importComponentByKeyAsync` for each catalog component
- **THEN** layout components (`Column`, `Row`, `Box`) SHALL be rendered as Figma Auto Layout frames with the correct direction and spacing

#### Scenario: Component not found in Figma library

- **WHEN** a `ui.json` entry maps to a `catalogFigmaMap` entry whose `figmaKey` is not importable from the connected library
- **THEN** the plugin SHALL skip that component, place a placeholder frame with a warning label, and continue processing remaining nodes

### Requirement: Figma Plugin stores server port in local plugin storage

The Figma Plugin SHALL persist the user's configured local server port using `figma.clientStorage`, defaulting to `5173`.

#### Scenario: Port persists across Figma sessions

- **WHEN** the user changes the server port to `3000` in the plugin settings and closes Figma
- **THEN** on next plugin open, the port field SHALL show `3000`
