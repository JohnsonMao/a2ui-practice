#!/usr/bin/env node
/**
 * Zero-dependency static server for the A2UI app.
 * Serves the pre-built React app from ./dist/ and
 * serves ui.json from the same directory as this script.
 *
 * Usage: node serve.js
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 5173
const DIST = __dirname
const UI_JSON = path.join(__dirname, 'ui.json')

const mime = {
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

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Serve ui.json from the skill directory (not from dist/)
  if (req.url === '/ui.json' || req.url === '/ui.json?_t=' + encodeURIComponent(req.url.split('?_t=')[1])) {
    try {
      const data = fs.readFileSync(UI_JSON, 'utf8')
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('[]')
    }
    return
  }

  // Strip query string for file lookup
  const urlPath = req.url.split('?')[0]
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath)

  // SPA fallback: unknown routes → index.html
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html')
  }

  const ext = path.extname(filePath)
  const contentType = mime[ext] || 'application/octet-stream'

  try {
    const data = fs.readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`A2UI app running → http://localhost:${PORT}`)
})
