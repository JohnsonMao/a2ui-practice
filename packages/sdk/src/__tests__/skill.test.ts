// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'

describe('skill registry', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('getRegistry() returns empty array initially', async () => {
    const { getRegistry } = await import('../index.js')
    expect(getRegistry()).toEqual([])
  })

  it('a2ui.skill() registers an entry and getRegistry() returns it', async () => {
    const { a2ui, getRegistry } = await import('../index.js')
    const mockApi = { name: 'Mock', schema: z.object({}) }
    const example = () => ({ id: 'my-mock', component: 'Mock' })
    a2ui.skill(mockApi, { example })
    const registry = getRegistry()
    expect(registry).toHaveLength(1)
    expect(registry[0].api).toBe(mockApi)
    expect(registry[0].example).toBe(example)
    expect(registry[0].notes).toBeUndefined()
  })

  it('notes is captured when provided', async () => {
    const { a2ui, getRegistry } = await import('../index.js')
    const mockApi = { name: 'Mock', schema: z.object({}) }
    a2ui.skill(mockApi, { example: () => ({ id: 'my-mock', component: 'Mock' }), notes: 'Use this for X' })
    expect(getRegistry()[0].notes).toBe('Use this for X')
  })

  it('getRegistry() returns a copy, not the internal array', async () => {
    const { a2ui, getRegistry } = await import('../index.js')
    const mockApi = { name: 'Mock', schema: z.object({}) }
    a2ui.skill(mockApi, { example: () => ({ id: 'my-mock', component: 'Mock' }) })
    const reg = getRegistry()
    reg.push({ api: mockApi, example: () => ({}) })
    expect(getRegistry()).toHaveLength(1)
  })

  it('multiple registrations accumulate in import order', async () => {
    const { a2ui, getRegistry } = await import('../index.js')
    const api1 = { name: 'A', schema: z.object({}) }
    const api2 = { name: 'B', schema: z.object({}) }
    a2ui.skill(api1, { example: () => ({ id: 'my-a', component: 'A' }) })
    a2ui.skill(api2, { example: () => ({ id: 'my-b', component: 'B' }) })
    const reg = getRegistry()
    expect(reg).toHaveLength(2)
    expect(reg[0].api.name).toBe('A')
    expect(reg[1].api.name).toBe('B')
  })
})
