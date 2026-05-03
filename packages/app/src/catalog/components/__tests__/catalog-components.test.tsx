import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { SurfaceModel, Catalog, ComponentModel, ComponentContext } from '@a2ui/web_core/v0_9'
import type { ComponentApi } from '@a2ui/web_core/v0_9'

// Replicate createTestContext without relying on unexported test utils
function createTestContext(properties: Record<string, unknown>) {
  const surface = new SurfaceModel('test', new Catalog('test-catalog', [] as ComponentApi[]), {})
  const component = new ComponentModel('test-id', 'TestComponent', properties)
  surface.componentsModel.addComponent(component)
  return new ComponentContext(surface, 'test-id', '/')
}

const noBuildChild = () => null

// ----- Text -----
describe('CustomText', () => {
  it('renders text content', async () => {
    const { TextImpl } = await import('../text')
    const ctx = createTestContext({ text: 'Hello World', variant: 'body' })
    const { container } = render(<TextImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.textContent).toContain('Hello World')
  })

  it('renders h2 element for h2 variant', async () => {
    const { TextImpl } = await import('../text')
    const ctx = createTestContext({ text: 'Heading', variant: 'h2' })
    const { container } = render(<TextImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('h2')).toBeTruthy()
  })
})

// ----- Image -----
describe('CustomImage', () => {
  it('renders img element with src', async () => {
    const { ImageImpl } = await import('../image')
    const ctx = createTestContext({ url: 'https://example.com/img.png', description: 'alt text' })
    const { container } = render(<ImageImpl.render context={ctx} buildChild={noBuildChild} />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png')
    expect(img?.getAttribute('alt')).toBe('alt text')
  })
})

// ----- Icon -----
describe('CustomIcon', () => {
  it('renders svg for a known icon name', async () => {
    const { IconImpl } = await import('../icon')
    const ctx = createTestContext({ name: 'add' })
    const { container } = render(<IconImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})

// ----- Video -----
describe('CustomVideo', () => {
  it('renders video element with src', async () => {
    const { VideoImpl } = await import('../video')
    const ctx = createTestContext({ url: 'https://example.com/video.mp4' })
    const { container } = render(<VideoImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('video')).toBeTruthy()
  })
})

// ----- AudioPlayer -----
describe('CustomAudioPlayer', () => {
  it('renders audio element', async () => {
    const { AudioPlayerImpl } = await import('../audio-player')
    const ctx = createTestContext({ url: 'https://example.com/audio.mp3' })
    const { container } = render(<AudioPlayerImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('audio')).toBeTruthy()
  })
})

// ----- Row -----
describe('CustomRow', () => {
  it('renders flex row container', async () => {
    const { RowImpl } = await import('../row')
    const ctx = createTestContext({ children: [] })
    const { container } = render(<RowImpl.render context={ctx} buildChild={noBuildChild} />)
    const div = container.firstElementChild as HTMLElement
    expect(div?.className).toMatch(/flex/)
  })
})

// ----- Column -----
describe('CustomColumn', () => {
  it('renders flex column container', async () => {
    const { ColumnImpl } = await import('../column')
    const ctx = createTestContext({ children: [] })
    const { container } = render(<ColumnImpl.render context={ctx} buildChild={noBuildChild} />)
    const div = container.firstElementChild as HTMLElement
    expect(div?.className).toMatch(/flex/)
    expect(div?.className).toMatch(/flex-col/)
  })
})

// ----- List -----
describe('CustomList', () => {
  it('renders list container', async () => {
    const { ListImpl } = await import('../list')
    const ctx = createTestContext({ children: [] })
    const { container } = render(<ListImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.firstElementChild).toBeTruthy()
  })
})

// ----- Card -----
describe('CustomCard', () => {
  it('renders card with shadcn data-slot', async () => {
    const { CardImpl } = await import('../card')
    const ctx = createTestContext({ child: 'child-id' })
    const childNode = <span data-testid="child">content</span>
    const { container } = render(
      <CardImpl.render context={ctx} buildChild={(id) => id === 'child-id' ? childNode : null} />
    )
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy()
  })
})

// ----- Tabs -----
describe('CustomTabs', () => {
  it('renders tabs with tab titles', async () => {
    const { TabsImpl } = await import('../tabs')
    const ctx = createTestContext({ tabs: [{ title: 'Tab 1', child: 'c1' }, { title: 'Tab 2', child: 'c2' }] })
    const { getByText } = render(<TabsImpl.render context={ctx} buildChild={() => null} />)
    expect(getByText('Tab 1')).toBeTruthy()
  })
})

// ----- Modal -----
describe('CustomModal', () => {
  it('renders trigger element', async () => {
    const { ModalImpl } = await import('../modal')
    const ctx = createTestContext({ trigger: 'trigger-id', content: 'content-id' })
    const triggerNode = <button>Open</button>
    const { getByText } = render(
      <ModalImpl.render context={ctx} buildChild={(id) => id === 'trigger-id' ? triggerNode : null} />
    )
    expect(getByText('Open')).toBeTruthy()
  })
})

// ----- Divider -----
describe('CustomDivider', () => {
  it('renders separator element', async () => {
    const { DividerImpl } = await import('../divider')
    const ctx = createTestContext({ axis: 'horizontal' })
    const { container } = render(<DividerImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.firstElementChild).toBeTruthy()
  })
})

// ----- Button -----
describe('CustomButton', () => {
  it('renders button element', async () => {
    const { ButtonImpl } = await import('../button')
    const ctx = createTestContext({ child: 'label-id', variant: 'primary' })
    const { container } = render(
      <ButtonImpl.render context={ctx} buildChild={() => <span>Click me</span>} />
    )
    expect(container.querySelector('button')).toBeTruthy()
  })
})

// ----- TextField -----
describe('CustomTextField', () => {
  it('renders input element', async () => {
    const { TextFieldImpl } = await import('../text-field')
    const ctx = createTestContext({ label: 'Name', value: '', variant: 'shortText' })
    const { container } = render(<TextFieldImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('input')).toBeTruthy()
  })
})

// ----- CheckBox -----
describe('CustomCheckBox', () => {
  it('renders checkbox input with label', async () => {
    const { CheckBoxImpl } = await import('../checkbox')
    const ctx = createTestContext({ label: 'Agree', value: false })
    const { container } = render(<CheckBoxImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('button[role="checkbox"]')).toBeTruthy()
  })
})

// ----- ChoicePicker -----
describe('CustomChoicePicker', () => {
  it('renders select element', async () => {
    const { ChoicePickerImpl } = await import('../choice-picker')
    const ctx = createTestContext({
      options: [{ label: 'A', value: 'a' }],
      value: [],
      variant: 'mutuallyExclusive',
    })
    const { container } = render(<ChoicePickerImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.firstElementChild).toBeTruthy()
  })
})

// ----- Slider -----
describe('CustomSlider', () => {
  it('renders slider input', async () => {
    const { SliderImpl } = await import('../slider')
    const ctx = createTestContext({ min: 0, max: 100, value: 50 })
    const { container } = render(<SliderImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('span[role="slider"]')).toBeTruthy()
  })
})

// ----- DateTimeInput -----
describe('CustomDateTimeInput', () => {
  it('renders date/time input', async () => {
    const { DateTimeInputImpl } = await import('../date-time-input')
    const ctx = createTestContext({ value: '', enableDate: true, enableTime: false })
    const { container } = render(<DateTimeInputImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('input[type="date"]')).toBeTruthy()
  })
})

// ----- Interaction: TextField -----
describe('CustomTextField interaction', () => {
  it('reflects typed input immediately without external prop change', async () => {
    const { TextFieldImpl } = await import('../text-field')
    const ctx = createTestContext({ value: 'initial', label: '', variant: 'shortText' })
    const { container } = render(<TextFieldImpl.render context={ctx} buildChild={noBuildChild} />)
    const input = container.querySelector('input')!
    expect(input.value).toBe('initial')
    fireEvent.change(input, { target: { value: 'typed' } })
    expect(input.value).toBe('typed')
  })
})

// ----- Interaction: CheckBox -----
describe('CustomCheckBox interaction', () => {
  it('reflects toggle immediately without external prop change', async () => {
    const { CheckBoxImpl } = await import('../checkbox')
    const ctx = createTestContext({ value: false, label: '' })
    const { container } = render(<CheckBoxImpl.render context={ctx} buildChild={noBuildChild} />)
    const checkbox = container.querySelector('button[role="checkbox"]')!
    expect(checkbox.getAttribute('data-state')).toBe('unchecked')
    fireEvent.click(checkbox)
    expect(checkbox.getAttribute('data-state')).toBe('checked')
  })
})

// ----- Interaction: DateTimeInput -----
describe('CustomDateTimeInput interaction', () => {
  it('reflects date change immediately without external prop change', async () => {
    const { DateTimeInputImpl } = await import('../date-time-input')
    const ctx = createTestContext({ value: '2024-01-01', enableDate: true, enableTime: false })
    const { container } = render(<DateTimeInputImpl.render context={ctx} buildChild={noBuildChild} />)
    const input = container.querySelector('input')!
    expect(input.value).toBe('2024-01-01')
    fireEvent.change(input, { target: { value: '2024-06-15' } })
    expect(input.value).toBe('2024-06-15')
  })
})

// ----- Sandbox -----
describe('CustomSandbox', () => {
  it('renders iframe element', async () => {
    const { SandboxImpl } = await import('../sandbox')
    const ctx = createTestContext({ source: 'export default () => null', props: {} })
    const { container } = render(<SandboxImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('iframe')).toBeTruthy()
  })

  it('iframe has sandbox="allow-scripts" attribute', async () => {
    const { SandboxImpl } = await import('../sandbox')
    const ctx = createTestContext({ source: 'export default () => null' })
    const { container } = render(<SandboxImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(container.querySelector('iframe')?.getAttribute('sandbox')).toBe('allow-scripts')
  })
})

// ----- Table -----
describe('CustomTable', () => {
  it('renders string cell as text (Scenario: String cell renders as text)', async () => {
    const { TableImpl } = await import('../table')
    const ctx = createTestContext({
      columns: ['Name', 'Role'],
      rows: [['Alice', 'Engineer']],
    })
    const { getByText } = render(<TableImpl.render context={ctx} buildChild={noBuildChild} />)
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Engineer')).toBeTruthy()
  })

  it('renders component ref cell via buildChild (Scenario: Component ref cell renders the referenced component)', async () => {
    const { TableImpl } = await import('../table')
    const ctx = createTestContext({
      columns: ['Name', 'Actions'],
      rows: [['Alice', { id: 'alice-btn' }]],
    })
    const childNode = <button data-testid="alice-btn">Click</button>
    const buildChild = (id: string) => id === 'alice-btn' ? childNode : null
    const { getByTestId } = render(<TableImpl.render context={ctx} buildChild={buildChild} />)
    expect(getByTestId('alice-btn')).toBeTruthy()
  })

  it('renders empty cell when component ref is missing (Scenario: Missing component ref renders empty cell)', async () => {
    const { TableImpl } = await import('../table')
    const ctx = createTestContext({
      columns: ['Name', 'Actions'],
      rows: [['Alice', { id: 'nonexistent' }]],
    })
    const { container } = render(<TableImpl.render context={ctx} buildChild={noBuildChild} />)
    const cells = container.querySelectorAll('td')
    expect(cells.length).toBe(2)
    expect(cells[1].textContent).toBe('')
  })

  it('handles mixed string and component ref cells in same row (Scenario: Mixed row)', async () => {
    const { TableImpl } = await import('../table')
    const ctx = createTestContext({
      columns: ['Name', 'Status', 'Actions'],
      rows: [['Alice', 'Active', { id: 'row-btn' }]],
    })
    const buildChild = (id: string) =>
      id === 'row-btn' ? <span data-testid="row-btn">Go</span> : null
    const { getByText, getByTestId } = render(
      <TableImpl.render context={ctx} buildChild={buildChild} />
    )
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Active')).toBeTruthy()
    expect(getByTestId('row-btn')).toBeTruthy()
  })
})

// ----- Catalog registration -----
describe('customCatalog', () => {
  it('contains all 25 components including Sandbox', async () => {
    const { customCatalog } = await import('../../index')
    expect(customCatalog.components.has('Sandbox')).toBe(true)
    expect(customCatalog.components.size).toBe(25)
  })
})
