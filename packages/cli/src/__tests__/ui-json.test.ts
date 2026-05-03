// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest'
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readUiJson, setUiJson, updateUiJson } from '../commands/ui-json'

// ── helpers ──────────────────────────────────────────────────────────────────

const tmp = (name: string) => join(tmpdir(), name)

function cleanup(...paths: string[]) {
  for (const p of paths) if (existsSync(p)) unlinkSync(p)
}

// ── readUiJson ────────────────────────────────────────────────────────────────

describe('readUiJson', () => {
  const file = tmp('read-ui-test.json')
  afterEach(() => cleanup(file))

  it('returns file content when file exists', () => {
    const content = '[{"type":"setComponents","components":[]}]'
    writeFileSync(file, content, 'utf8')
    expect(readUiJson(file)).toBe(content)
  })

  it('returns "[]" when file does not exist', () => {
    expect(readUiJson('/nonexistent/__ui_test_9999.json')).toBe('[]')
  })
})

// ── setUiJson ─────────────────────────────────────────────────────────────────

describe('setUiJson', () => {
  const file = tmp('set-ui-test.json')
  afterEach(() => cleanup(file))

  it('writes valid JSON string to file', () => {
    const json = '[{"type":"setComponents","components":[]}]'
    setUiJson(file, json)
    expect(readFileSync(file, 'utf8')).toBe(json)
  })

  it('throws ParseError on invalid JSON and does not create file', () => {
    expect(() => setUiJson(file, 'not { valid } json')).toThrow()
    expect(existsSync(file)).toBe(false)
  })

  it('throws ParseError and does not modify existing file on invalid JSON', () => {
    const original = '[{"type":"setComponents","components":[]}]'
    writeFileSync(file, original, 'utf8')
    expect(() => setUiJson(file, '{bad json')).toThrow()
    expect(readFileSync(file, 'utf8')).toBe(original)
  })
})

// ── updateUiJson ──────────────────────────────────────────────────────────────

const BASE_UI = JSON.stringify([
  { type: 'createSurface', surfaceId: 's1' },
  {
    type: 'updateComponents',
    components: [
      { id: 'btn1', component: 'Button', text: 'Old' },
      { id: 'txt1', component: 'Text', text: 'Hello' },
    ],
  },
])

describe('updateUiJson', () => {
  const file = tmp('update-ui-test.json')
  afterEach(() => cleanup(file))

  it('replaces an existing component matched by id', () => {
    writeFileSync(file, BASE_UI, 'utf8')
    updateUiJson(file, JSON.stringify([{ id: 'btn1', component: 'Button', text: 'New' }]))
    const result = JSON.parse(readFileSync(file, 'utf8')) as unknown[]
    const msg = result.find((m) => (m as { type: string }).type === 'updateComponents') as {
      components: { id: string; text: string }[]
    }
    const btn = msg.components.find((c) => c.id === 'btn1')
    expect(btn?.text).toBe('New')
    // other component unchanged
    const txt = msg.components.find((c) => c.id === 'txt1')
    expect(txt?.text).toBe('Hello')
  })

  it('appends a new component when id is not present', () => {
    writeFileSync(file, BASE_UI, 'utf8')
    updateUiJson(file, JSON.stringify([{ id: 'new1', component: 'Icon', name: 'star' }]))
    const result = JSON.parse(readFileSync(file, 'utf8')) as unknown[]
    const msg = result.find((m) => (m as { type: string }).type === 'updateComponents') as {
      components: { id: string }[]
    }
    expect(msg.components).toHaveLength(3)
    expect(msg.components[2].id).toBe('new1')
  })

  it('throws when ui.json has no updateComponents message', () => {
    const noUpdate = JSON.stringify([{ type: 'createSurface', surfaceId: 's1' }])
    writeFileSync(file, noUpdate, 'utf8')
    expect(() =>
      updateUiJson(file, JSON.stringify([{ id: 'x', component: 'Text' }])),
    ).toThrow()
    // file not modified
    expect(readFileSync(file, 'utf8')).toBe(noUpdate)
  })

  it('throws on invalid JSON input and does not modify file', () => {
    writeFileSync(file, BASE_UI, 'utf8')
    expect(() => updateUiJson(file, 'bad json')).toThrow()
    expect(readFileSync(file, 'utf8')).toBe(BASE_UI)
  })
})
