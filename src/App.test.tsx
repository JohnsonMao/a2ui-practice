import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageProcessor } from '@a2ui/web_core/v0_9'

vi.mock('@a2ui/react/v0_9', () => ({
  basicCatalog: { id: 'mock-catalog' },
  A2uiSurface: ({ surface }: { surface: unknown }) =>
    <div data-testid="a2ui-surface" data-surface={String(surface)} />,
}))

vi.mock('./hooks/useJsonPolling', () => ({
  useJsonPolling: vi.fn(() => ({ error: null, lastUpdated: null })),
}))

// Dynamically import App after mocks are set up
const getApp = async () => (await import('./App')).default

describe('App', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates MessageProcessor only once across re-renders', async () => {
    const constructorSpy = vi.spyOn(MessageProcessor.prototype, 'onSurfaceCreated')
      .mockReturnValue({ unsubscribe: vi.fn() })

    const App = await getApp()
    const { rerender } = render(<App />)
    rerender(<App />)
    rerender(<App />)

    expect(constructorSpy).toHaveBeenCalledOnce()
  })

  it('renders loading placeholder when no surface is available', async () => {
    vi.spyOn(MessageProcessor.prototype, 'onSurfaceCreated')
      .mockReturnValue({ unsubscribe: vi.fn() })

    const App = await getApp()
    render(<App />)

    expect(screen.queryByTestId('a2ui-surface')).toBeNull()
    expect(screen.getByText(/initializing/i)).toBeTruthy()
  })

  it('renders A2uiSurface after surface creation event fires', async () => {
    let capturedCallback: ((surface: unknown) => void) | null = null

    vi.spyOn(MessageProcessor.prototype, 'onSurfaceCreated')
      .mockImplementation(((cb: (surface: unknown) => void) => {
        capturedCallback = cb
        return { unsubscribe: vi.fn() }
      }) as typeof MessageProcessor.prototype.onSurfaceCreated)

    const App = await getApp()
    const { act: localAct } = await import('@testing-library/react')
    render(<App />)

    expect(screen.queryByTestId('a2ui-surface')).toBeNull()

    await localAct(async () => {
      capturedCallback?.({ id: 'main' })
    })

    await screen.findByTestId('a2ui-surface')
  })
})
