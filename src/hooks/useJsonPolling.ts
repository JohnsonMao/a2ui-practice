import { useEffect, useRef, useState } from 'react'

interface UseJsonPollingResult {
  error: string | null
  lastUpdated: Date | null
}

export function useJsonPolling(
  url: string,
  onNewData: (data: unknown[]) => void,
  intervalMs = 2000,
): UseJsonPollingResult {
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const lastTextRef = useRef<string | null>(null)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const text = await res.text()
        const parsed: unknown = JSON.parse(text)
        if (text === lastTextRef.current) return
        lastTextRef.current = text
        setError(null)
        setLastUpdated(new Date())
        onNewData(parsed as unknown[])
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    poll()
    const id = setInterval(poll, intervalMs)
    return () => clearInterval(id)
  }, [url, onNewData, intervalMs])

  return { error, lastUpdated }
}
