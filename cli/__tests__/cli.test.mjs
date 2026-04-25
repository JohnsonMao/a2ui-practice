// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { spawnSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLI = join(__dirname, '..', '..', 'skills/generate-ui/scripts/cli.cjs')
const TMP_UI_JSON = join(__dirname, '_test_ui.json')

function runCli(args, env = {}) {
  return spawnSync('node', [CLI, '--ui-json', TMP_UI_JSON, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
}

const SAMPLE_UI_JSON = JSON.stringify([
  { version: 'v0.9', createSurface: { surfaceId: 'main', catalogId: 'custom' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        { id: 'root', component: 'Column', children: [{ id: 'btn' }] },
        { id: 'btn', component: 'Button', variant: 'primary', child: 'btn-text' },
        { id: 'btn-text', component: 'Text', text: 'Click' },
      ],
    },
  },
])

beforeEach(() => {
  if (existsSync(TMP_UI_JSON)) unlinkSync(TMP_UI_JSON)
})

afterEach(() => {
  if (existsSync(TMP_UI_JSON)) unlinkSync(TMP_UI_JSON)
})

// ── read ──────────────────────────────────────────────────────────────────

describe('read', () => {
  it('outputs [] when ui.json does not exist', () => {
    const result = runCli(['read'])
    expect(result.status).toBe(0)
    expect(result.stdout.trim()).toBe('[]')
  })

  it('outputs file content when ui.json exists', () => {
    writeFileSync(TMP_UI_JSON, SAMPLE_UI_JSON, 'utf8')
    const result = runCli(['read'])
    expect(result.status).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual(JSON.parse(SAMPLE_UI_JSON))
  })
})

// ── set ───────────────────────────────────────────────────────────────────

describe('set', () => {
  it('writes valid JSON to ui.json', () => {
    const payload = JSON.stringify([{ version: 'v0.9', createSurface: { surfaceId: 'main', catalogId: 'custom' } }])
    const result = runCli(['set', payload])
    expect(result.status).toBe(0)
    expect(JSON.parse(readFileSync(TMP_UI_JSON, 'utf8'))).toEqual(JSON.parse(payload))
  })

  it('does not modify ui.json on invalid JSON', () => {
    writeFileSync(TMP_UI_JSON, SAMPLE_UI_JSON, 'utf8')
    const result = runCli(['set', '{bad json}'])
    expect(result.status).not.toBe(0)
    expect(readFileSync(TMP_UI_JSON, 'utf8')).toBe(SAMPLE_UI_JSON)
  })

  it('prints error to stderr on invalid JSON', () => {
    const result = runCli(['set', '{bad json}'])
    expect(result.stderr).toMatch(/invalid|parse|error/i)
  })
})

// ── update ────────────────────────────────────────────────────────────────

describe('update', () => {
  it('replaces an existing component by ID', () => {
    writeFileSync(TMP_UI_JSON, SAMPLE_UI_JSON, 'utf8')
    const patch = JSON.stringify([{ id: 'btn', component: 'Button', variant: 'secondary', child: 'btn-text' }])
    const result = runCli(['update', patch])
    expect(result.status).toBe(0)
    const written = JSON.parse(readFileSync(TMP_UI_JSON, 'utf8'))
    const components = written[1].updateComponents.components
    const btn = components.find(c => c.id === 'btn')
    expect(btn.variant).toBe('secondary')
    // other components untouched
    expect(components.find(c => c.id === 'root')).toBeDefined()
    expect(components.find(c => c.id === 'btn-text')).toBeDefined()
  })

  it('appends a new component when ID does not exist', () => {
    writeFileSync(TMP_UI_JSON, SAMPLE_UI_JSON, 'utf8')
    const patch = JSON.stringify([{ id: 'new-field', component: 'TextField', label: 'Email' }])
    const result = runCli(['update', patch])
    expect(result.status).toBe(0)
    const written = JSON.parse(readFileSync(TMP_UI_JSON, 'utf8'))
    const components = written[1].updateComponents.components
    expect(components.find(c => c.id === 'new-field')).toEqual({ id: 'new-field', component: 'TextField', label: 'Email' })
    // existing components still present
    expect(components).toHaveLength(4)
  })

  it('exits non-zero when ui.json has no updateComponents', () => {
    const noUpdate = JSON.stringify([{ version: 'v0.9', createSurface: { surfaceId: 'main', catalogId: 'custom' } }])
    writeFileSync(TMP_UI_JSON, noUpdate, 'utf8')
    const result = runCli(['update', '[{"id":"x","component":"Text","text":"hi"}]'])
    expect(result.status).not.toBe(0)
    expect(readFileSync(TMP_UI_JSON, 'utf8')).toBe(noUpdate)
  })

  it('exits non-zero on invalid JSON', () => {
    writeFileSync(TMP_UI_JSON, SAMPLE_UI_JSON, 'utf8')
    const result = runCli(['update', '{bad}'])
    expect(result.status).not.toBe(0)
    expect(readFileSync(TMP_UI_JSON, 'utf8')).toBe(SAMPLE_UI_JSON)
  })
})

// ── unknown subcommand ────────────────────────────────────────────────────

describe('unknown subcommand', () => {
  it('prints usage and exits non-zero', () => {
    const result = runCli(['foobar'])
    expect(result.status).not.toBe(0)
    expect(result.stdout + result.stderr).toMatch(/usage|unknown/i)
  })

  it('prints usage when no subcommand given', () => {
    const result = runCli([])
    expect(result.status).not.toBe(0)
    expect(result.stdout + result.stderr).toMatch(/usage/i)
  })
})
