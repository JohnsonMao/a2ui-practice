// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { catalogFigmaMap, isLayoutMapping, warnUnmapped } from '../index'

describe('catalogFigmaMap', () => {
  it('exports Button mapping with figmaKey and propMap', () => {
    const entry = catalogFigmaMap['Button']
    expect(entry).toBeDefined()
    expect(isLayoutMapping(entry!)).toBe(false)
    if (!isLayoutMapping(entry!)) {
      expect(entry.figmaKey).toBe('FIGMA_KEY_BUTTON')
      expect(entry.propMap['variant']).toBe('Variant')
    }
  })

  it('exports Column as auto-layout VERTICAL', () => {
    const entry = catalogFigmaMap['Column']
    expect(entry).toBeDefined()
    expect(isLayoutMapping(entry!)).toBe(true)
    if (isLayoutMapping(entry!)) {
      expect(entry.direction).toBe('VERTICAL')
    }
  })

  it('exports Row as auto-layout HORIZONTAL', () => {
    const entry = catalogFigmaMap['Row']
    expect(isLayoutMapping(entry!)).toBe(true)
    if (isLayoutMapping(entry!)) {
      expect(entry.direction).toBe('HORIZONTAL')
    }
  })

  it('returns undefined for an unknown component', () => {
    expect(catalogFigmaMap['NonExistent']).toBeUndefined()
  })
})

describe('warnUnmapped', () => {
  it('calls console.warn with the component name and returns undefined', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = warnUnmapped('FooBar')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('FooBar'))
    expect(result).toBeUndefined()
    spy.mockRestore()
  })
})
