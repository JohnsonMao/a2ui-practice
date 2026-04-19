import { useState, useEffect, useCallback } from 'react'
import { MessageProcessor } from '@a2ui/web_core/v0_9'
import { A2uiSurface, basicCatalog } from '@a2ui/react/v0_9'
import type { SurfaceModel } from '@a2ui/web_core/v0_9'
import type { ReactComponentImplementation } from '@a2ui/react/v0_9'
import { useJsonPolling } from './hooks/useJsonPolling'

function App() {
  const [processor] = useState(() => new MessageProcessor([basicCatalog]))
  const [surface, setSurface] = useState<SurfaceModel<ReactComponentImplementation> | null>(null)

  useEffect(() => {
    const sub = processor.onSurfaceCreated((s) => {
      setSurface(s as SurfaceModel<ReactComponentImplementation>)
    })
    return () => sub.unsubscribe()
  }, [processor])

  const handleNewData = useCallback(
    (messages: unknown[]) => {
      const filtered = (messages as Record<string, unknown>[]).filter((msg) => {
        if (msg && typeof msg === 'object' && 'createSurface' in msg) {
          const surfaceId = (msg.createSurface as Record<string, unknown>)?.surfaceId as string
          return !processor.model.getSurface(surfaceId)
        }
        return true
      })
      processor.processMessages(filtered as unknown as Parameters<typeof processor.processMessages>[0])
    },
    [processor],
  )

  useJsonPolling('/ui.json', handleNewData)

  return (
    <div className="min-h-screen p-4">
      {surface
        ? <A2uiSurface surface={surface} />
        : <div className="text-gray-500">Initializing Agent UI...</div>
      }
    </div>
  )
}

export default App
