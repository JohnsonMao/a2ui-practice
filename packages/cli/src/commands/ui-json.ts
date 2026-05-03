import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { exec } from 'child_process'
import type { Command } from 'commander'

// ── Pure business logic (exported for testing) ────────────────────────────────

/**
 * Reads ui.json from the given path.
 * Returns the file contents as a string, or "[]" if the file does not exist.
 */
export function readUiJson(uiJsonPath: string): string {
  if (!existsSync(uiJsonPath)) return '[]'
  return readFileSync(uiJsonPath, 'utf8')
}

/**
 * Completely overwrites ui.json with the given JSON string.
 * Throws a SyntaxError if the input is not valid JSON — the file is NOT modified.
 */
export function setUiJson(uiJsonPath: string, jsonStr: string): void {
  JSON.parse(jsonStr) // throws SyntaxError if invalid; file untouched
  writeFileSync(uiJsonPath, jsonStr, 'utf8')
}

type UiMessage = { type: string; components?: UiComponent[] } & Record<string, unknown>
type UiComponent = { id: string } & Record<string, unknown>

/**
 * Merge-by-ID update: reads existing ui.json, locates the `updateComponents`
 * message, and for each input component replaces the existing entry by id or
 * appends if not found. Throws if the input is invalid JSON or if no
 * `updateComponents` message is present — the file is NOT modified on error.
 */
export function updateUiJson(uiJsonPath: string, jsonStr: string): void {
  const incoming = JSON.parse(jsonStr) as UiComponent[] // throws on bad JSON

  const existing = readUiJson(uiJsonPath)
  const messages = JSON.parse(existing) as UiMessage[]

  const msgIndex = messages.findIndex((m) => m.type === 'updateComponents')
  if (msgIndex === -1) {
    throw new Error(
      'ui.json does not contain an updateComponents message. ' +
        'Use `a2ui set` to initialise ui.json first.',
    )
  }

  const msg = messages[msgIndex]
  const components: UiComponent[] = [...(msg.components ?? [])]

  for (const comp of incoming) {
    const idx = components.findIndex((c) => c.id === comp.id)
    if (idx !== -1) {
      components[idx] = comp
    } else {
      components.push(comp)
    }
  }

  messages[msgIndex] = { ...msg, components }
  writeFileSync(uiJsonPath, JSON.stringify(messages), 'utf8')
}

// ── Commander wrappers ─────────────────────────────────────────────────────────

function resolveUiJsonPath(optionPath: string | undefined, scriptDir: string): string {
  return optionPath ?? join(scriptDir, 'ui.json')
}

export function addReadCommand(program: Command): void {
  program
    .command('read')
    .description('Print ui.json contents to stdout (outputs [] if file not found)')
    .option('--ui-json <path>', 'path to ui.json file')
    .action((options: { uiJson?: string }) => {
      const uiJsonPath = resolveUiJsonPath(options.uiJson, __dirname)
      process.stdout.write(readUiJson(uiJsonPath) + '\n')
    })
}

export function addSetCommand(program: Command): void {
  program
    .command('set <json>')
    .description('Overwrite ui.json with the provided JSON string')
    .option('--ui-json <path>', 'path to ui.json file')
    .action((json: string, options: { uiJson?: string }) => {
      const uiJsonPath = resolveUiJsonPath(options.uiJson, __dirname)
      try {
        setUiJson(uiJsonPath, json)
        process.stdout.write(`ui.json updated → ${uiJsonPath}\n`)
      } catch (err) {
        process.stderr.write(`Error: invalid JSON — ${(err as Error).message}\n`)
        process.exit(1)
      }
    })
}

export function addUpdateCommand(program: Command): void {
  program
    .command('update <json>')
    .description('Merge-by-ID update: patch individual components in ui.json')
    .option('--ui-json <path>', 'path to ui.json file')
    .action((json: string, options: { uiJson?: string }) => {
      const uiJsonPath = resolveUiJsonPath(options.uiJson, __dirname)
      try {
        updateUiJson(uiJsonPath, json)
        process.stdout.write(`ui.json updated → ${uiJsonPath}\n`)
      } catch (err) {
        process.stderr.write(`Error: ${(err as Error).message}\n`)
        process.exit(1)
      }
    })
}

export function addOpenCommand(program: Command): void {
  program
    .command('open')
    .description('Open the A2UI app in the default browser')
    .option('-p, --port <number>', 'port to open', '5173')
    .action((options: { port: string }) => {
      const url = `http://localhost:${options.port}`
      exec(`open ${url}`, (err) => {
        if (err) process.stderr.write(`Warning: could not open browser — ${err.message}\n`)
      })
    })
}
