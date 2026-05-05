export type ComponentMapping = {
  figmaKey: string
  figmaName: string
  propMap: Record<string, string>
}

export type LayoutMapping = {
  figmaType: 'auto-layout'
  direction: 'VERTICAL' | 'HORIZONTAL'
}

export type FigmaCatalogEntry = ComponentMapping | LayoutMapping

export const catalogFigmaMap: Record<string, FigmaCatalogEntry> = {
  Button: {
    figmaKey: 'FIGMA_KEY_BUTTON',
    figmaName: 'Button',
    propMap: { variant: 'Variant' },
  },
  Text: {
    figmaKey: 'FIGMA_KEY_TEXT',
    figmaName: 'Text',
    propMap: { text: 'Text', variant: 'Variant' },
  },
  Column: {
    figmaType: 'auto-layout',
    direction: 'VERTICAL',
  },
  Row: {
    figmaType: 'auto-layout',
    direction: 'HORIZONTAL',
  },
  Box: {
    figmaType: 'auto-layout',
    direction: 'VERTICAL',
  },
  Badge: {
    figmaKey: 'FIGMA_KEY_BADGE',
    figmaName: 'Badge',
    propMap: { label: 'Label', variant: 'Variant' },
  },
  Card: {
    figmaKey: 'FIGMA_KEY_CARD',
    figmaName: 'Card',
    propMap: { title: 'Title' },
  },
  Tabs: {
    figmaKey: 'FIGMA_KEY_TABS',
    figmaName: 'Tabs',
    propMap: { activeTab: 'Active Tab' },
  },
  Modal: {
    figmaKey: 'FIGMA_KEY_MODAL',
    figmaName: 'Modal',
    propMap: { title: 'Title' },
  },
  Dialog: {
    figmaKey: 'FIGMA_KEY_DIALOG',
    figmaName: 'Dialog',
    propMap: { title: 'Title' },
  },
  Image: {
    figmaKey: 'FIGMA_KEY_IMAGE',
    figmaName: 'Image',
    propMap: { src: 'Source', alt: 'Alt Text' },
  },
  Video: {
    figmaKey: 'FIGMA_KEY_VIDEO',
    figmaName: 'Video',
    propMap: { src: 'Source' },
  },
  Icon: {
    figmaKey: 'FIGMA_KEY_ICON',
    figmaName: 'Icon',
    propMap: { name: 'Icon Name', size: 'Size' },
  },
  Divider: {
    figmaKey: 'FIGMA_KEY_DIVIDER',
    figmaName: 'Divider',
    propMap: {},
  },
  Checkbox: {
    figmaKey: 'FIGMA_KEY_CHECKBOX',
    figmaName: 'Checkbox',
    propMap: { label: 'Label', checked: 'Checked' },
  },
  Table: {
    figmaKey: 'FIGMA_KEY_TABLE',
    figmaName: 'Table',
    propMap: {},
  },
  List: {
    figmaKey: 'FIGMA_KEY_LIST',
    figmaName: 'List',
    propMap: {},
  },
  Slider: {
    figmaKey: 'FIGMA_KEY_SLIDER',
    figmaName: 'Slider',
    propMap: { min: 'Min', max: 'Max', value: 'Value' },
  },
  DatePicker: {
    figmaKey: 'FIGMA_KEY_DATE_PICKER',
    figmaName: 'DatePicker',
    propMap: { label: 'Label' },
  },
  DateTimeInput: {
    figmaKey: 'FIGMA_KEY_DATE_TIME_INPUT',
    figmaName: 'DateTimeInput',
    propMap: { label: 'Label' },
  },
  TextField: {
    figmaKey: 'FIGMA_KEY_TEXT_FIELD',
    figmaName: 'TextField',
    propMap: { label: 'Label', placeholder: 'Placeholder' },
  },
  ChoicePicker: {
    figmaKey: 'FIGMA_KEY_CHOICE_PICKER',
    figmaName: 'ChoicePicker',
    propMap: { label: 'Label' },
  },
  Typography: {
    figmaKey: 'FIGMA_KEY_TYPOGRAPHY',
    figmaName: 'Typography',
    propMap: { text: 'Text', variant: 'Variant' },
  },
  AudioPlayer: {
    figmaKey: 'FIGMA_KEY_AUDIO_PLAYER',
    figmaName: 'AudioPlayer',
    propMap: { src: 'Source' },
  },
}

export function isLayoutMapping(entry: FigmaCatalogEntry): entry is LayoutMapping {
  return 'figmaType' in entry && entry.figmaType === 'auto-layout'
}

export function warnUnmapped(componentName: string): undefined {
  console.warn(`[figma-catalog-map] Warning: unmapped component "${componentName}" — skipping`)
  return undefined
}
