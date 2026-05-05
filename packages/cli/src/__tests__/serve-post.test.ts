// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createA2UIServer } from '../commands/serve'

function makeRequest(
  method: string,
  port: number,
  urlPath: string,
  body?: string,
): Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port, path: urlPath, method }, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk.toString()
      })
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 0, body: data, headers: res.headers })
      })
    })
    req.on('error', reject)
    if (body !== undefined) {
      req.setHeader('Content-Type', 'application/json')
      req.write(body)
    }
    req.end()
  })
}

describe('createA2UIServer — POST /ui.json', () => {
  let server: http.Server
  let port: number
  let uiJsonPath: string

  beforeEach(async () => {
    uiJsonPath = path.join(os.tmpdir(), `test-ui-${Date.now()}.json`)
    fs.writeFileSync(uiJsonPath, '[]', 'utf8')
    server = createA2UIServer(uiJsonPath, os.tmpdir())
    await new Promise<void>((resolve) => server.listen(0, resolve))
    port = (server.address() as { port: number }).port
  })

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
    if (fs.existsSync(uiJsonPath)) fs.unlinkSync(uiJsonPath)
  })

  it('POST /ui.json with valid JSON array returns 200 and writes to file', async () => {
    const payload = JSON.stringify([{ version: 'v0.9', createSurface: { surfaceId: 'main' } }])
    const response = await makeRequest('POST', port, '/ui.json', payload)
    expect(response.status).toBe(200)
    expect(JSON.parse(response.body)).toMatchObject({ ok: true })
    expect(fs.readFileSync(uiJsonPath, 'utf8')).toBe(payload)
  })

  it('POST /ui.json with non-array JSON returns 400 and does not modify file', async () => {
    const original = '[]'
    fs.writeFileSync(uiJsonPath, original, 'utf8')
    const response = await makeRequest('POST', port, '/ui.json', '{"not":"array"}')
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ error: expect.any(String) })
    expect(fs.readFileSync(uiJsonPath, 'utf8')).toBe(original)
  })

  it('POST /ui.json with invalid JSON returns 400 and does not modify file', async () => {
    const original = '[]'
    fs.writeFileSync(uiJsonPath, original, 'utf8')
    const response = await makeRequest('POST', port, '/ui.json', 'not valid json')
    expect(response.status).toBe(400)
    expect(JSON.parse(response.body)).toMatchObject({ error: expect.any(String) })
    expect(fs.readFileSync(uiJsonPath, 'utf8')).toBe(original)
  })

  it('existing ui.json is unchanged after 400 response', async () => {
    const original = JSON.stringify([{ version: 'v0.9', createSurface: { surfaceId: 's1' } }])
    fs.writeFileSync(uiJsonPath, original, 'utf8')
    await makeRequest('POST', port, '/ui.json', 'bad json')
    expect(fs.readFileSync(uiJsonPath, 'utf8')).toBe(original)
  })

  it('GET /ui.json still works after refactor', async () => {
    const content = '[{"test":true}]'
    fs.writeFileSync(uiJsonPath, content, 'utf8')
    const response = await makeRequest('GET', port, '/ui.json')
    expect(response.status).toBe(200)
    expect(response.body).toBe(content)
  })

  it('OPTIONS preflight returns 204', async () => {
    const response = await makeRequest('OPTIONS', port, '/ui.json')
    expect(response.status).toBe(204)
  })

  it('CORS headers are present on responses', async () => {
    const response = await makeRequest('GET', port, '/ui.json')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toContain('POST')
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type')
  })
})
