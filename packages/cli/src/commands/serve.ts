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

export function addServeCommand(program: Command): void {
  program
    .command('serve')
    .description('Start static server serving the pre-built A2UI app and ui.json')
    .option('-p, --port <number>', 'port to listen on', '5173')
    .option('--ui-json <path>', 'path to ui.json file')
    .action((options: { port: string; uiJson?: string }) => {
      const port = parseInt(options.port, 10)
      const scriptDir = __dirname
      const uiJsonPath = options.uiJson ?? path.join(scriptDir, 'ui.json')
      const distDir = scriptDir
      const distPrefix = distDir + path.sep

      const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        res.setHeader('Access-Control-Allow-Origin', '*')

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
