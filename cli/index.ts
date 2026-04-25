import http from 'http'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

interface UiComponent {
  id: string
  [key: string]: unknown
}

interface UpdateComponentsPayload {
  updateComponents: {
    components: UiComponent[]
  }
}

const isUpdateComponentsMsg = (m: unknown): m is UpdateComponentsPayload =>
  m !== null && typeof m === 'object' && 'updateComponents' in m

const PORT = 5173
const SCRIPT_DIR = __dirname

// Parse --ui-json flag (used in tests to redirect file path)
let UI_JSON_PATH = path.join(SCRIPT_DIR, 'ui.json')
const rawArgs = process.argv.slice(2)
const remaining: string[] = []
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === '--ui-json' && rawArgs[i + 1]) {
    UI_JSON_PATH = rawArgs[++i]
  } else {
    remaining.push(rawArgs[i])
  }
}

const [subcommand, ...rest] = remaining

function readUiJsonRaw(): string {
  try {
    return fs.readFileSync(UI_JSON_PATH, 'utf8')
  } catch {
    return '[]'
  }
}

function safeParseJson(raw: string, label: string): unknown {
  try {
    return JSON.parse(raw)
  } catch (e) {
    process.stderr.write(`Error: invalid JSON${label ? ' (' + label + ')' : ''} — ${(e as Error).message}\n`)
    process.exit(1)
  }
}

function cmdRead(): void {
  process.stdout.write(readUiJsonRaw() + '\n')
}

function cmdSet(args: string[]): void {
  const raw = args[0]
  if (!raw) {
    process.stderr.write('Error: set requires a JSON argument\n')
    process.exit(1)
  }
  const parsed = safeParseJson(raw, 'set argument')
  fs.writeFileSync(UI_JSON_PATH, JSON.stringify(parsed, null, 2), 'utf8')
  console.log('ui.json updated (set)')
}

function cmdUpdate(args: string[]): void {
  const raw = args[0]
  if (!raw) {
    process.stderr.write('Error: update requires a JSON argument\n')
    process.exit(1)
  }
  const incoming = safeParseJson(raw, 'update argument')
  if (!Array.isArray(incoming)) {
    process.stderr.write('Error: update argument must be a JSON array\n')
    process.exit(1)
  }

  const currentRaw = readUiJsonRaw()
  const messages = safeParseJson(currentRaw, 'existing ui.json')

  if (!Array.isArray(messages)) {
    process.stderr.write('Error: existing ui.json is not an array — use "set" to reinitialise\n')
    process.exit(1)
  }

  const updateMsg = messages.find(isUpdateComponentsMsg)
  if (!updateMsg) {
    process.stderr.write('Error: ui.json has no updateComponents message — use "set" to initialise\n')
    process.exit(1)
  }

  const components = updateMsg.updateComponents.components
  for (const comp of incoming as UiComponent[]) {
    const idx = components.findIndex(c => c.id === comp.id)
    if (idx !== -1) {
      components[idx] = comp
    } else {
      components.push(comp)
    }
  }

  fs.writeFileSync(UI_JSON_PATH, JSON.stringify(messages, null, 2), 'utf8')
  console.log('ui.json updated (update)')
}

function cmdOpen(): void {
  exec(`open http://localhost:${PORT}`, (err) => {
    if (err) {
      process.stderr.write(`Warning: could not open browser — ${err.message}\n`)
    }
  })
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
}

function cmdServe(): void {
  const DIST = SCRIPT_DIR
  const DIST_PREFIX = DIST + path.sep

  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')

    if (req.url === '/ui.json' || req.url?.startsWith('/ui.json?')) {
      try {
        const data = fs.readFileSync(UI_JSON_PATH, 'utf8')
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(data)
      } catch {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end('[]')
      }
      return
    }

    const urlPath = (req.url ?? '/').split('?')[0]
    const resolved = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath)

    if (!resolved.startsWith(DIST_PREFIX) && resolved !== DIST) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    let filePath = resolved
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, 'index.html')
    }

    const ext = path.extname(filePath)
    const contentType = MIME[ext] || 'application/octet-stream'

    try {
      const data = fs.readFileSync(filePath)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      process.stderr.write(
        `Error: port ${PORT} is already in use.\n` +
        `If the server is already running, use: node cli.cjs open\n`,
      )
      process.exit(1)
    }
    throw err
  })

  server.listen(PORT, () => {
    console.log(`A2UI app running → http://localhost:${PORT}`)
    cmdOpen()
  })
}

function printUsage(): void {
  process.stderr.write(
    `Usage: node cli.cjs [--ui-json <path>] <subcommand> [args]\n\n` +
    `Subcommands:\n` +
    `  serve              Start static server on port ${PORT} and open browser\n` +
    `  open               Open http://localhost:${PORT} in default browser\n` +
    `  read               Print current ui.json to stdout\n` +
    `  set '<json>'       Replace ui.json with provided JSON\n` +
    `  update '<json>'    Merge components by ID into ui.json\n`,
  )
  process.exit(1)
}

switch (subcommand) {
  case 'serve':  cmdServe(); break
  case 'open':   cmdOpen();  break
  case 'read':   cmdRead();  break
  case 'set':    cmdSet(rest); break
  case 'update': cmdUpdate(rest); break
  default:
    if (subcommand) {
      process.stderr.write(`Unknown subcommand: ${subcommand}\n\n`)
    }
    printUsage()
}
