import { a2ui } from '@a2ui/sdk'
import { TypographyApi } from './typography'

a2ui.skill(TypographyApi, {
  example: () => ({
    id: 'my-typography',
    component: 'Typography',
    variant: 'h2' as const,
    text: 'Section Title',
  }),
  notes: 'For bulleted lists, use variant="list" with the "items" prop instead of "text".',
})
