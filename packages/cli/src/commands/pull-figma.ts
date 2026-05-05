import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import type { Command } from 'commander'
import {
  catalogFigmaMap,
  isLayoutMapping,
  warnUnmapped,
  type FigmaCatalogEntry,
} from '@a2ui/figma-catalog-map'

// ── Types ─────────────────────────────────────────────────────────────────────

export type FigmaComponentProperty = {
  value: string
  type: string
}

export type FigmaNode = {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  componentProperties?: Record<string, FigmaComponentProperty>
  layoutMode?: 'VERTICAL' | 'HORIZONTAL' | 'NONE'
}

type FigmaNodesResponse = {
  nodes: Record<string, { document: FigmaNode } | undefined>
}

type A2UIComponent = {
  id: string
  component: string
  properties?: Record<string, unknown>
}

// ── URL Parsing ───────────────────────────────────────────────────────────────

/**
 * Parses a Figma design/file URL and extracts the fileKey and nodeId.
 * Supports:
 *   https://www.figma.com/design/{fileKey}/{name}?node-id={id}
 *   https://www.figma.com/file/{fileKey}/{name}?node-id={id}
 *
 * Returns null for any URL that does not match the expected shape.
 */
export function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (parsed.hostname !== 'www.figma.com' && parsed.hostname !== 'figma.com') {
    return null
  }

  const parts = parsed.pathname.split('/')
  const typeIdx = parts.findIndex((p) => p === 'design' || p === 'file')
  if (typeIdx === -1 || typeIdx + 1 >= parts.length) return null

  const fileKey = parts[typeIdx + 1]
  if (!fileKey) return null

  const rawNodeId = parsed.searchParams.get('node-id')
  if (!rawNodeId) return null

  // Figma URL format uses "-" as separator; API expects ":"
  const nodeId = rawNodeId.replace(/-/g, ':')
  return { fileKey, nodeId }
}

// ── Figma REST API ────────────────────────────────────────────────────────────

/**
 * Fetches a single Figma node via the REST API.
 * Uses the built-in `https` module — no external HTTP client.
 *
 * Audit notes:
 *  - Token is passed only in the Authorization header; never logged.
 *  - On non-2xx responses the body is discarded; only the status code is reported.
 *  - HTTPS is enforced by using the `https` module exclusively.
 */
export function fetchFigmaNode(
  fileKey: string,
  nodeId: string,
  token: string,
): Promise<FigmaNode> {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'api.figma.com',
      path: `/v1/files/${encodeURIComponent(fileKey)}/nodes?ids=${encodeURIComponent(nodeId)}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const req = https.request(reqOptions, (res) => {
      const { statusCode } = res
      if (!statusCode || statusCode < 200 || statusCode >= 300) {
        res.resume() // drain to free the socket
        reject(new Error(`Figma API error: HTTP ${statusCode}`))
        return
      }

      let data = ''
      res.on('data', (chunk: Buffer) => {
        data += chunk.toString()
      })
      res.on('end', () => {
        try {
          const body = JSON.parse(data) as FigmaNodesResponse
          const nodeEntry = body.nodes[nodeId]
          if (!nodeEntry?.document) {
            reject(new Error(`Node "${nodeId}" not found in Figma response`))
            return
          }
          resolve(nodeEntry.document)
        } catch {
          reject(new Error('Failed to parse Figma API response'))
        }
      })
    })

    req.on('error', (err: Error) => {
      reject(new Error(`Network error: ${err.message}`))
    })

    req.end()
  })
}

// ── Conversion ────────────────────────────────────────────────────────────────

function convertNodeInternal(
  node: FigmaNode,
  catalogMap: Record<string, FigmaCatalogEntry>,
  allComponents: A2UIComponent[],
): string | null {
  // Recurse into children first so parent can reference their IDs
  const childRefs: { id: string }[] = []
  for (const child of node.children ?? []) {
    const childId = convertNodeInternal(child, catalogMap, allComponents)
    if (childId !== null) childRefs.push({ id: childId })
  }
  const childrenProp = childRefs.length > 0 ? { children: childRefs } : {}

  if (node.type === 'INSTANCE') {
    // Guard against prototype-pollution: only accept own properties
    if (!Object.hasOwn(catalogMap, node.name)) {
      warnUnmapped(node.name)
      return null
    }

    const entry = catalogMap[node.name]!

    if (isLayoutMapping(entry)) {
      allComponents.push({ id: node.id, component: node.name, properties: { ...childrenProp } })
      return node.id
    }

    // ComponentMapping — translate Figma componentProperties → A2UI props
    const properties: Record<string, unknown> = { ...childrenProp }
    for (const [a2uiProp, figmaPropName] of Object.entries(entry.propMap)) {
      const figmaProp = node.componentProperties?.[figmaPropName]
      if (figmaProp !== undefined) properties[a2uiProp] = figmaProp.value
    }
    allComponents.push({ id: node.id, component: node.name, properties })
    return node.id
  }

  if (node.type === 'FRAME') {
    const componentName = node.layoutMode === 'HORIZONTAL' ? 'Row' : 'Column'
    allComponents.push({ id: node.id, component: componentName, properties: { ...childrenProp } })
    return node.id
  }

  // For GROUP, VECTOR, TEXT, etc. — recurse but emit no A2UI component
  return null
}

/**
 * Converts a Figma node tree to an A2UI JSON message array.
 *
 * @param node       - Root Figma node (document field from API response)
 * @param catalogMap - Figma→A2UI component mapping (defaults to catalogFigmaMap)
 * @returns Array of two A2UI protocol messages: createSurface + updateComponents
 */
export function convertFigmaNodeToA2UI(
  node: FigmaNode,
  catalogMap: Record<string, FigmaCatalogEntry> = catalogFigmaMap,
): object[] {
  const components: A2UIComponent[] = []
  convertNodeInternal(node, catalogMap, components)

  return [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'figma',
        catalogId: 'https://a2ui.org/specification/v0_9/basic_catalog.json',
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'figma',
        components,
      },
    },
  ]
}

// ── Command ───────────────────────────────────────────────────────────────────

export function addPullFigmaCommand(program: Command): void {
  program
    .command('pull-figma')
    .description('Pull a Figma frame and write it to ui.json (requires FIGMA_TOKEN env var)')
    .argument('<figma-url>', 'Figma design URL with node-id query param')
    .option('--ui-json <path>', 'path to write ui.json output', 'ui.json')
    .action(async (figmaUrl: string, options: { uiJson: string }) => {
      // 1. Validate URL before any API call
      const parsed = parseFigmaUrl(figmaUrl)
      if (!parsed) {
        process.stderr.write(`Error: invalid Figma URL: "${figmaUrl}"\n`)
        process.stderr.write(
          'Expected: https://www.figma.com/design/<fileKey>/<name>?node-id=<nodeId>\n',
        )
        process.exit(1)
      }

      // 2. Require token — never log its value
      const token = process.env['FIGMA_TOKEN']
      if (!token) {
        process.stderr.write('Error: FIGMA_TOKEN environment variable is not set\n')
        process.stderr.write('Set it with: export FIGMA_TOKEN=<your-personal-access-token>\n')
        process.exit(1)
      }

      // 3. Fetch node (HTTPS only; only status code exposed on error)
      let figmaNode: FigmaNode
      try {
        figmaNode = await fetchFigmaNode(parsed.fileKey, parsed.nodeId, token)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        process.stderr.write(`Error: ${msg}\n`)
        process.exit(1)
      }

      // 4. Convert and write
      const uiJson = convertFigmaNodeToA2UI(figmaNode)
      const outPath = path.resolve(options.uiJson)
      fs.writeFileSync(outPath, JSON.stringify(uiJson, null, 2), 'utf8')

      const update = uiJson[1] as { updateComponents: { components: A2UIComponent[] } }
      process.stdout.write(
        `✓ Pulled ${update.updateComponents.components.length} component(s) → ${outPath}\n`,
      )
    })
}
