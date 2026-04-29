// @vitest-environment node
import { describe, it, expect } from 'vitest'

describe('api-registry', () => {
  it('exports BoxApi with name "Box"', async () => {
    const { BoxApi } = await import('../api-registry')
    expect(BoxApi.name).toBe('Box')
  })

  it('exports SandboxApi with name "Sandbox"', async () => {
    const { SandboxApi } = await import('../api-registry')
    expect(SandboxApi.name).toBe('Sandbox')
  })

  it('exports CheckBoxApi with name "CheckBox"', async () => {
    const { CheckBoxApi } = await import('../api-registry')
    expect(CheckBoxApi.name).toBe('CheckBox')
  })

  it('exports all 20 catalog APIs', async () => {
    const registry = await import('../api-registry')
    const apis = Object.values(registry)
    const names = apis.map((api) => api.name)
    const expected = [
      'Text', 'Button', 'Image', 'Icon', 'Video', 'AudioPlayer',
      'Row', 'Column', 'List', 'Card', 'Tabs', 'Modal', 'Divider',
      'TextField', 'CheckBox', 'ChoicePicker', 'Slider', 'DateTimeInput',
      'Box', 'Sandbox',
    ]
    for (const name of expected) {
      expect(names, `Expected "${name}" to be present in api-registry`).toContain(name)
    }
  })
})
