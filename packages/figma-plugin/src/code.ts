// Figma Plugin sandbox — runs in Figma's JS environment (no DOM, no fetch)
import { catalogFigmaMap, isLayoutMapping, warnUnmapped } from '@a2ui/figma-catalog-map'

const DEFAULT_PORT = '5173'

// ── Types ──────────────────────────────────────────────────────────────────────

type A2UIComponent = {
  id: string
  component: string
  properties: Record<string, unknown>
}

type PluginMessage =
  | { type: 'PUSH'; port: string }
  | { type: 'PULL'; data: unknown[] }

// ── Node traversal → A2UI components ──────────────────────────────────────────

function nodeToA2UIComponents(
  node: SceneNode,
  components: A2UIComponent[],
  _parentId?: string,
): void {
  let componentName: string | undefined

  if (node.type === 'INSTANCE') {
    const entry = catalogFigmaMap[node.name]
    if (!entry) {
      warnUnmapped(node.name)
      return
    }
    componentName = node.name
  } else if (node.type === 'FRAME' && 'layoutMode' in node) {
    const frame = node as FrameNode
    componentName = frame.layoutMode === 'HORIZONTAL' ? 'Row' : 'Column'
  } else {
    if ('children' in node) {
      for (const child of (node as unknown as ChildrenMixin).children) {
        nodeToA2UIComponents(child, components)
      }
    }
    return
  }

  const comp: A2UIComponent = {
    id: node.id,
    component: componentName,
    properties: {},
  }

  // Map Figma component properties to A2UI props
  const entry = catalogFigmaMap[componentName]
  if (entry && !isLayoutMapping(entry) && node.type === 'INSTANCE') {
    const instance = node as InstanceNode
    for (const [a2uiProp, figmaProp] of Object.entries(entry.propMap)) {
      const figmaValue = instance.componentProperties?.[figmaProp]
      if (figmaValue) {
        comp.properties[a2uiProp] = figmaValue.value
      }
    }
  }

  // Process children
  if ('children' in node) {
    const childIds: { id: string }[] = []
    for (const child of (node as unknown as ChildrenMixin).children) {
      const childComponents: A2UIComponent[] = []
      nodeToA2UIComponents(child, childComponents, node.id)
      if (childComponents.length > 0) {
        childIds.push({ id: childComponents[0].id })
        components.push(...childComponents)
      }
    }
    if (childIds.length > 0) {
      comp.properties['children'] = childIds
    }
  }

  components.push(comp)
}

// ── Plugin main ───────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 280, height: 220 })

// Load saved port and send to UI on startup
figma.clientStorage.getAsync('port').then((savedPort: string | undefined) => {
  const port = savedPort ?? DEFAULT_PORT
  figma.ui.postMessage({ type: 'INIT', port })
})

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'PUSH') {
    await figma.clientStorage.setAsync('port', msg.port)

    const selection = figma.currentPage.selection
    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'ERROR', message: 'Select a frame to push' })
      return
    }

    const allComponents: A2UIComponent[] = []
    for (const node of selection) {
      nodeToA2UIComponents(node, allComponents)
    }

    const uiJson = [
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
          components: allComponents,
        },
      },
    ]

    // Delegate fetch to the UI iframe (sandbox has no fetch)
    figma.ui.postMessage({ type: 'PUSH_REQUEST', components: uiJson })
  }

  if (msg.type === 'PULL') {
    const data = msg.data as Array<{
      version?: string
      updateComponents?: { surfaceId: string; components: A2UIComponent[] }
    }>

    const updateMsg = data.find((m) => m.updateComponents)
    if (!updateMsg?.updateComponents) {
      figma.ui.postMessage({ type: 'ERROR', message: 'No components found in ui.json' })
      return
    }

    const components = updateMsg.updateComponents.components

    // Identify root components (not referenced as children)
    const childIds = new Set<string>()
    for (const comp of components) {
      const children = comp.properties['children'] as { id: string }[] | undefined
      if (children) children.forEach((c) => childIds.add(c.id))
      const child = comp.properties['child'] as string | undefined
      if (child) childIds.add(child)
    }
    const roots = components.filter((c) => !childIds.has(c.id))

    const page = figma.currentPage
    for (const root of roots) {
      await createFigmaNode(root, components, page)
    }

    figma.viewport.scrollAndZoomIntoView(page.children.slice(-roots.length))
  }
}

async function createFigmaNode(
  comp: A2UIComponent,
  allComponents: A2UIComponent[],
  parent: BaseNode & ChildrenMixin,
): Promise<SceneNode | null> {
  const entry = catalogFigmaMap[comp.component]
  let node: SceneNode

  if (entry && !isLayoutMapping(entry)) {
    // Import from Figma library and create instance
    try {
      const component = await figma.importComponentByKeyAsync(entry.figmaKey)
      const instance = component.createInstance()
      for (const [a2uiProp, figmaProp] of Object.entries(entry.propMap)) {
        const value = comp.properties[a2uiProp]
        if (value !== undefined && instance.componentProperties[figmaProp] !== undefined) {
          instance.setProperties({ [figmaProp]: value as string | boolean })
        }
      }
      node = instance
    } catch {
      // Figma key not yet set up — create a labelled placeholder frame
      const frame = figma.createFrame()
      frame.name = `[Unknown: ${comp.component}]`
      frame.resize(100, 40)
      const text = figma.createText()
      text.characters = comp.component
      frame.appendChild(text)
      node = frame
    }
  } else if (entry && isLayoutMapping(entry)) {
    // Create Auto Layout frame for Row/Column/Box
    const frame = figma.createFrame()
    frame.name = comp.component
    frame.layoutMode = entry.direction === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL'
    frame.primaryAxisSizingMode = 'AUTO'
    frame.counterAxisSizingMode = 'AUTO'
    frame.paddingLeft = 8
    frame.paddingRight = 8
    frame.paddingTop = 8
    frame.paddingBottom = 8
    frame.itemSpacing = 8
    node = frame
  } else {
    // Unknown component — placeholder
    warnUnmapped(comp.component)
    const frame = figma.createFrame()
    frame.name = `[Unknown: ${comp.component}]`
    frame.resize(100, 40)
    node = frame
  }

  parent.appendChild(node)

  // Recurse into children
  if ('appendChild' in node) {
    const childrenProp = comp.properties['children'] as { id: string }[] | undefined
    const childProp = comp.properties['child'] as string | undefined
    const childIdList = childrenProp?.map((c) => c.id) ?? (childProp ? [childProp] : [])

    for (const childId of childIdList) {
      const childComp = allComponents.find((c) => c.id === childId)
      if (childComp) {
        await createFigmaNode(childComp, allComponents, node as BaseNode & ChildrenMixin)
      }
    }
  }

  return node
}
