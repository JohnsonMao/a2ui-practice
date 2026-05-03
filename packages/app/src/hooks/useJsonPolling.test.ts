import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useJsonPolling } from './useJsonPolling'

const mockFetch = (impl: () => Promise<Partial<Response>>) => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(impl))
}

describe('useJsonPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('calls onNewData on first successful fetch', async () => {
    const data = [{ version: 'v0.9', createSurface: { surfaceId: 'main' } }]
    mockFetch(async () => ({ ok: true, text: async () => JSON.stringify(data) }))

    const onNewData = vi.fn()
    renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })

    expect(onNewData).toHaveBeenCalledOnce()
    expect(onNewData).toHaveBeenCalledWith(data)
  })

  it('calls onNewData immediately on mount without waiting for interval', async () => {
    const data = [{ version: 'v0.9', createSurface: { surfaceId: 'main' } }]
    mockFetch(async () => ({ ok: true, text: async () => JSON.stringify(data) }))

    const onNewData = vi.fn()
    renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(onNewData).toHaveBeenCalledOnce()
  })

  it('does not call onNewData when content is unchanged', async () => {
    const data = [{ version: 'v0.9' }]
    const text = JSON.stringify(data)
    mockFetch(async () => ({ ok: true, text: async () => text }))

    const onNewData = vi.fn()
    renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })

    expect(onNewData).toHaveBeenCalledOnce()
  })

  it('sets error and continues polling on fetch failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', fetchMock)

    const onNewData = vi.fn()
    const { result } = renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })

    expect(result.current.error).not.toBeNull()
    expect(onNewData).not.toHaveBeenCalled()

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('sets error and does not call onNewData on invalid JSON', async () => {
    mockFetch(async () => ({ ok: true, text: async () => 'not valid json {{{' }))

    const onNewData = vi.fn()
    const { result } = renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })

    expect(result.current.error).not.toBeNull()
    expect(onNewData).not.toHaveBeenCalled()
  })

  it('clears interval on unmount', async () => {
    mockFetch(async () => ({ ok: true, text: async () => JSON.stringify([]) }))

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const onNewData = vi.fn()
    const { unmount } = renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('sets lastUpdated to a Date instance after successful update', async () => {
    const data = [{ version: 'v0.9' }]
    mockFetch(async () => ({ ok: true, text: async () => JSON.stringify(data) }))

    const onNewData = vi.fn()
    const { result } = renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    expect(result.current.lastUpdated).toBeNull()

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })

    expect(result.current.lastUpdated).toBeInstanceOf(Date)
  })

  it('clears error on recovery after previous failure', async () => {
    const data = [{ version: 'v0.9', updated: true }]
    vi.stubGlobal('fetch', vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockImplementation(async () => ({ ok: true, text: async () => JSON.stringify(data) }))
    )

    const onNewData = vi.fn()
    const { result } = renderHook(() => useJsonPolling('/ui.json', onNewData, 2000))

    await act(async () => { await vi.advanceTimersByTimeAsync(0) })
    expect(result.current.error).not.toBeNull()

    await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
    expect(result.current.error).toBeNull()
    expect(onNewData).toHaveBeenCalledOnce()
  })
})
