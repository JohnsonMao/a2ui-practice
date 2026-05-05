import http from 'http'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import type { Command } from 'commander'

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

export function createA2UIServer(uiJsonPath: string, distDir: string): http.Server {
  const distPrefix = distDir + path.sep

  return http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    if (req.method === 'POST' && (req.url === '/ui.json' || req.url?.startsWith('/ui.json?'))) {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          if (!Array.isArray(parsed)) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Body must be a JSON array' }))
            return
          }
          fs.writeFileSync(uiJsonPath, body, 'utf8')
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    if (req.url === '/ui.json' || req.url?.startsWith('/ui.json?')) {
      try {
        const data = fs.readFileSync(uiJsonPath, 'utf8')
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(data)
      } catch {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end('[]')
      }
      return
    }

    const urlPath = (req.url ?? '/').split('?')[0]
    const resolved = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath)

    if (!resolved.startsWith(distPrefix) && resolved !== distDir) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    let filePath = resolved
    if (!fs.existsSync(filePath)) {
      filePath = path.join(distDir, 'index.html')
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
}

export function addServeCommand(program: Command): void {
  program
    .command('serve')
    .description('Start static server serving the pre-built A2UI app and ui.json')
    .option('-p, --port <number>', 'port to listen on', '5173')
    .option('--ui-json <path>', 'path to ui.json file')
    .option('--dist <path>', 'path to built app directory')
    .action((options: { port: string; uiJson?: string; dist?: string }) => {
      const port = parseInt(options.port, 10)
      const distDir = path.resolve(
        options.dist ??
          (fs.existsSync(path.join(__dirname, 'index.html'))
            ? __dirname
            : path.join(__dirname, '../../app/dist')),
      )
      const uiJsonPath = options.uiJson ?? path.join(distDir, 'ui.json')

      const server = createA2UIServer(uiJsonPath, distDir)

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          process.stderr.write(
            `Error: port ${port} is already in use.\n` +
              `If the server is already running, try a different port with: a2ui serve --port <port>\n`,
          )
          process.exit(1)
        }
        throw err
      })

      server.listen(port, () => {
        console.log(`A2UI app running → http://localhost:${port}`)
        exec(`open http://localhost:${port}`, (err) => {
          if (err) {
            process.stderr.write(`Warning: could not open browser — ${err.message}\n`)
          }
        })
      })
    })
}
