import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { createBinderlessComponentImplementation } from '@a2ui/react/v0_9'

export const SandboxApi = {
  name: 'Sandbox',
  schema: z.object({
    source: z.string().describe('The full React component source code to render inside an isolated iframe sandbox. Must be a valid ES module that default-exports a React component (e.g. `export default function MyComponent({ name }) { return <h1>Hello {name}</h1> }`). Can import from `react` and `react-dom/client` via importmap.'),
    props: z.record(z.unknown()).describe('Key-value pairs passed to the sandboxed component as props. Values are forwarded via postMessage on mount and on every update. Use this to pass dynamic data from the outer surface into the sandboxed component.').optional(),
  }).strict(),
} satisfies ComponentApi

/**
 * Builds the srcdoc HTML for the sandbox iframe.
 *
 * Design decisions (see design.md):
 * - iframe 作為沙箱隔離邊界: avoids React dual-instance problem
 * - iframe 的 HTML shell 以 srcdoc 注入: no separate HTML file needed
 * - importmap maps 'react' and 'react-dom/*' to esm.sh so AI source can
 *   write `import { useState } from 'react'` and share the same React instance
 * - Source is JSON-stringified; `</` is escaped to `<\/` to prevent the HTML
 *   parser from prematurely closing the <script> tag when parsing srcdoc
 */
function buildSrcdoc(source: string, reactBase: string, parentOrigin: string): string {
  const safeSource = JSON.stringify(source).replace(/<\//g, '<\\/')
  const safeParentOrigin = JSON.stringify(parentOrigin)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>body{margin:0;overflow:hidden}</style>
  <script type="importmap">{"imports":{"react":"${reactBase}/react@18","react/":"${reactBase}/react@18/","react-dom":"${reactBase}/react-dom@18","react-dom/":"${reactBase}/react-dom@18/","react-dom/client":"${reactBase}/react-dom@18/client"}}</script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import { createElement } from 'react';
    import { createRoot } from 'react-dom/client';

    const PARENT_ORIGIN = ${safeParentOrigin};
    const rootEl = document.getElementById('root');
    const root = createRoot(rootEl);
    let Component = null;
    let pendingProps = {};

    function renderComponent(props) {
      if (!Component) { pendingProps = props; return; }
      root.render(createElement(Component, props));
    }

    function showError(msg) {
      try { root.unmount(); } catch (_) {}
      rootEl.innerHTML = '<div style="color:#b91c1c;padding:8px 12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:4px;font:12px/1.5 monospace">&#9888; ' + String(msg) + '</div>';
    }

    // Props passed via postMessage (a2ui:props)
    // targetOrigin from host is '*' (iframe has opaque null origin); validate sender here
    window.addEventListener('message', (e) => {
      if (e.origin !== PARENT_ORIGIN) return;
      if (e.data?.type === 'a2ui:props') renderComponent(e.data.payload ?? {});
    });

    // iframe 高度自適應: report root element height to parent
    new ResizeObserver(([entry]) => {
      window.parent.postMessage({ type: 'a2ui:resize', height: entry.contentRect.height }, PARENT_ORIGIN);
    }).observe(rootEl);

    const blobUrl = URL.createObjectURL(new Blob([${safeSource}], { type: 'text/javascript' }));
    try {
      const mod = await import(blobUrl);
      Component = mod.default;
      renderComponent(pendingProps);
    } catch (err) {
      showError(err);
    }
  </script>
</body>
</html>`
}

/** Returns true if the value looks like an A2UI DataBinding `{ path: string }`. */
function isDynamicBinding(v: unknown): v is { path: string } {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    'path' in v &&
    typeof (v as Record<string, unknown>).path === 'string'
  )
}

export const SandboxImpl = createBinderlessComponentImplementation(SandboxApi, ({ context }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(0)

  // Track raw component properties — updates when updateComponents is called
  const [rawProperties, setRawProperties] = useState(() => context.componentModel.properties)
  useEffect(() => {
    const sub = context.componentModel.onUpdated.subscribe(() => {
      setRawProperties({ ...context.componentModel.properties })
    })
    return () => sub.unsubscribe()
  }, [context])

  const source = rawProperties.source as string
  const rawPropsRecord = (rawProperties.props as Record<string, unknown>) ?? {}

  // Subscribe to each value in props that is a `{ path: "..." }` DataBinding.
  // Static values (strings, numbers, etc.) are used as-is.
  // This allows AI agents to write: "props": { "name": { "path": "/user/name" } }
  const [resolvedPropsRecord, setResolvedPropsRecord] = useState<Record<string, unknown>>({})
  const rawPropsJson = JSON.stringify(rawPropsRecord)

  useEffect(() => {
    const subscriptions: Array<{ unsubscribe(): void }> = []
    const initial: Record<string, unknown> = {}

    for (const [k, v] of Object.entries(rawPropsRecord)) {
      if (isDynamicBinding(v)) {
        const sub = context.dataContext.subscribeDynamicValue<unknown>(v, (newVal) => {
          setResolvedPropsRecord((prev) => ({ ...prev, [k]: newVal }))
        })
        initial[k] = sub.value
        subscriptions.push(sub)
      } else {
        initial[k] = v
      }
    }

    setResolvedPropsRecord(initial)
    return () => subscriptions.forEach((s) => s.unsubscribe())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, rawPropsJson])

  // Keep a ref so the iframe load handler always reads the latest resolved props
  const resolvedPropsRef = useRef(resolvedPropsRecord)
  useEffect(() => {
    resolvedPropsRef.current = resolvedPropsRecord
  }, [resolvedPropsRecord])

  // Send props on iframe load (Props delivered on mount)
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const onLoad = () => {
      iframe.contentWindow?.postMessage({ type: 'a2ui:props', payload: resolvedPropsRef.current }, '*')
    }
    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [])

  // Props update propagated whenever resolved values change
  const resolvedPropsJson = JSON.stringify(resolvedPropsRecord)
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'a2ui:props', payload: JSON.parse(resolvedPropsJson) },
      '*',
    )
  }, [resolvedPropsJson])

  // iframe 高度自適應: listen for resize messages from this iframe only
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return
      if (e.data?.type === 'a2ui:resize' && typeof e.data.height === 'number') {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const reactBase = import.meta.env.VITE_SANDBOX_REACT_BASE_URL ?? 'https://esm.sh'
  const parentOrigin = window.location.origin
  const srcdoc = useMemo(() => buildSrcdoc(source, reactBase, parentOrigin), [source, reactBase, parentOrigin])

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      srcDoc={srcdoc}
      style={{ width: '100%', height: `${height}px`, border: 'none', display: 'block' }}
      title="Sandbox component"
    />
  )
})
