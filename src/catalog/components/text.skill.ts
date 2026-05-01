import { a2ui } from '@/catalog/skill'
import { TextApi } from './text'

a2ui.skill(TextApi, {
  example: () => ({
    id: 'my-text',
    component: 'Text',
    text: 'Hello, world!',
    variant: 'body' as const,
  }),
  notes: 'Use variant="h1"–"h4" for headings. Use variant="caption" for small helper text.',
})
