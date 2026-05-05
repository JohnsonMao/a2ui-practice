// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { FigmaCatalogEntry } from '@a2ui/figma-catalog-map'
import { parseFigmaUrl, convertFigmaNodeToA2UI } from '../commands/pull-figma'
import type { FigmaNode } from '../commands/pull-figma'

const testCatalogMap: Record<string, FigmaCatalogEntry> = {
  Button: {
    figmaKey: 'KEY_BTN',
    figmaName: 'Button',
    propMap: { variant: 'Variant', label: 'Label' },
  },
  Column: {
    figmaType: 'auto-layout',
    direction: 'VERTICAL',
  },
  Row: {
    figmaType: 'auto-layout',
    direction: 'HORIZONTAL',
  },
}

// ── URL Parsing ──────────────────────────────────────────────────────────────

describe('parseFigmaUrl', () => {
  it('parses a valid /design/ URL with node-id', () => {
    const result = parseFigmaUrl(
      'https://www.figma.com/design/abc123/MyDesign?node-id=1-2',
    )
    expect(result).toEqual({ fileKey: 'abc123', nodeId: '1:2' })
  })

  it('parses a valid /file/ URL with node-id', () => {
    const result = parseFigmaUrl(
      'https://www.figma.com/file/xyz789/MyFile?node-id=3-4',
    )
    expect(result).toEqual({ fileKey: 'xyz789', nodeId: '3:4' })
  })

  it('converts node-id dash separator to colon (Figma API format)', () => {
    const result = parseFigmaUrl(
      'https://www.figma.com/design/k/name?node-id=10-200',
    )
    expect(result?.nodeId).toBe('10:200')
  })

  it('accepts figma.com hostname without www', () => {
    const result = parseFigmaUrl(
      'https://figma.com/design/abc123/name?node-id=1-2',
    )
    expect(result).toEqual({ fileKey: 'abc123', nodeId: '1:2' })
  })

  it('returns null when node-id query param is missing', () => {
    expect(parseFigmaUrl('https://www.figma.com/design/abc123/MyDesign')).toBeNull()
  })

  it('returns null for a non-figma hostname', () => {
    expect(
      parseFigmaUrl('https://example.com/design/abc123?node-id=1-2'),
    ).toBeNull()
  })

  it('returns null for an unrecognised path prefix (e.g. /proto/)', () => {
    expect(
      parseFigmaUrl('https://www.figma.com/proto/abc123/name?node-id=1-2'),
    ).toBeNull()
  })

  it('returns null for a completely invalid URL string', () => {
    expect(parseFigmaUrl('not-a-url')).toBeNull()
  })

  it('returns null when the fileKey segment is empty', () => {
    expect(
      parseFigmaUrl('https://www.figma.com/design/?node-id=1-2'),
    ).toBeNull()
  })
})

// ── Figma node → A2UI conversion ─────────────────────────────────────────────

describe('convertFigmaNodeToA2UI', () => {
  it('returns a two-message array (createSurface + updateComponents)', () => {
    const node: FigmaNode = { id: '1:1', name: 'F', type: 'FRAME', layoutMode: 'VERTICAL' }
    const result = convertFigmaNodeToA2UI(node, testCatalogMap)
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ version: 'v0.9', createSurface: { surfaceId: 'figma' } })
    expect(result[1]).toMatchObject({ version: 'v0.9', updateComponents: { surfaceId: 'figma' } })
  })

  it('includes the A2UI catalogId in createSurface', () => {
    const node: FigmaNode = { id: '1:1', name: 'F', type: 'FRAME' }
    const result = convertFigmaNodeToA2UI(node, testCatalogMap)
    expect((result[0] as { createSurface: { catalogId: string } }).createSurface.catalogId).toMatch(
      /a2ui\.org/,
    )
  })

  it('maps a FRAME with VERTICAL layoutMode to Column', () => {
    const node: FigmaNode = { id: '1:1', name: 'F', type: 'FRAME', layoutMode: 'VERTICAL' }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components).toHaveLength(1)
    expect(components[0]).toMatchObject({ id: '1:1', component: 'Column' })
  })

  it('maps a FRAME with HORIZONTAL layoutMode to Row', () => {
    const node: FigmaNode = { id: '2:1', name: 'H', type: 'FRAME', layoutMode: 'HORIZONTAL' }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components[0]).toMatchObject({ id: '2:1', component: 'Row' })
  })

  it('maps a FRAME with no layoutMode to Column (default)', () => {
    const node: FigmaNode = { id: '3:1', name: 'N', type: 'FRAME' }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components[0]).toMatchObject({ component: 'Column' })
  })

  it('maps a known INSTANCE to its catalog component with mapped props', () => {
    const node: FigmaNode = {
      id: '4:1',
      name: 'Button',
      type: 'INSTANCE',
      componentProperties: {
        Variant: { value: 'Primary', type: 'VARIANT' },
        Label: { value: 'Click me', type: 'TEXT' },
      },
    }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components[0]).toMatchObject({
      id: '4:1',
      component: 'Button',
      properties: { variant: 'Primary', label: 'Click me' },
    })
  })

  it('maps a layout-mapping INSTANCE (e.g. Column) to the catalog key name', () => {
    const node: FigmaNode = { id: '5:1', name: 'Column', type: 'INSTANCE', children: [] }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components[0]).toMatchObject({ id: '5:1', component: 'Column' })
  })

  it('skips unmapped INSTANCE and calls warnUnmapped', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const node: FigmaNode = { id: '6:1', name: 'UnknownWidget', type: 'INSTANCE' }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components).toHaveLength(0)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('UnknownWidget'))
    warnSpy.mockRestore()
  })

  it('builds children references for nested nodes', () => {
    const node: FigmaNode = {
      id: '1:1',
      name: 'F',
      type: 'FRAME',
      layoutMode: 'VERTICAL',
      children: [
        {
          id: '1:2',
          name: 'Button',
          type: 'INSTANCE',
          componentProperties: { Variant: { value: 'Secondary', type: 'VARIANT' } },
        },
      ],
    }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components).toHaveLength(2)
    const frame = components.find((c) => c.id === '1:1')
    expect(frame?.properties?.['children']).toEqual([{ id: '1:2' }])
  })

  it('does not include children property when node has no children', () => {
    const node: FigmaNode = { id: '7:1', name: 'Button', type: 'INSTANCE' }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    expect(components[0]?.properties?.['children']).toBeUndefined()
  })

  it('omits nodes of unhandled types (e.g. GROUP) but recurses into their children', () => {
    const node: FigmaNode = {
      id: '8:1',
      name: 'G',
      type: 'GROUP',
      children: [{ id: '8:2', name: 'Button', type: 'INSTANCE' }],
    }
    const components = getComponents(convertFigmaNodeToA2UI(node, testCatalogMap))
    // Button is recognised; GROUP itself is not emitted
    expect(components.map((c) => c.id)).toEqual(['8:2'])
  })
})

// ── FIGMA_TOKEN validation ────────────────────────────────────────────────────

describe('FIGMA_TOKEN validation', () => {
  let origToken: string | undefined

  beforeEach(() => {
    origToken = process.env['FIGMA_TOKEN']
    delete process.env['FIGMA_TOKEN']
  })

  afterEach(() => {
    if (origToken !== undefined) {
      process.env['FIGMA_TOKEN'] = origToken
    } else {
      delete process.env['FIGMA_TOKEN']
    }
  })

  it('writes a FIGMA_TOKEN error to stderr and exits with code 1 when token is missing', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(
      ((_code?: string | number | null) => {
        throw new Error('process.exit called')
      }) as (code?: string | number | null | undefined) => never,
    )
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

    const { addPullFigmaCommand } = await import('../commands/pull-figma')
    const { Command } = await import('commander')
    const program = new Command()
    program.exitOverride()
    addPullFigmaCommand(program)

    await expect(
      program.parseAsync([
        'node',
        'a2ui',
        'pull-figma',
        'https://www.figma.com/design/abc/name?node-id=1-2',
      ]),
    ).rejects.toThrow('process.exit called')

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('FIGMA_TOKEN'))
    expect(exitSpy).toHaveBeenCalledWith(1)

    exitSpy.mockRestore()
    stderrSpy.mockRestore()
  })

  it('writes an error and exits with code 1 for an invalid Figma URL', async () => {
    process.env['FIGMA_TOKEN'] = 'dummy-token'
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(
      ((_code?: string | number | null) => {
        throw new Error('process.exit called')
      }) as (code?: string | number | null | undefined) => never,
    )
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)

    const { addPullFigmaCommand } = await import('../commands/pull-figma')
    const { Command } = await import('commander')
    const program = new Command()
    program.exitOverride()
    addPullFigmaCommand(program)

    await expect(
      program.parseAsync(['node', 'a2ui', 'pull-figma', 'https://example.com/not-figma']),
    ).rejects.toThrow('process.exit called')

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('invalid Figma URL'))
    expect(exitSpy).toHaveBeenCalledWith(1)

    exitSpy.mockRestore()
    stderrSpy.mockRestore()
  })
})

// ── helpers ──────────────────────────────────────────────────────────────────

function getComponents(
  result: object[],
): { id: string; component: string; properties?: Record<string, unknown> }[] {
  return (
    (result[1] as { updateComponents: { components: unknown[] } }).updateComponents
      .components as { id: string; component: string; properties?: Record<string, unknown> }[]
  )
}
