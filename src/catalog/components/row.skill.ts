import { a2ui } from '@/catalog/skill'
import { RowApi } from './row'

a2ui.skill(RowApi, {
  example: () => ({
    id: 'my-row',
    component: 'Row',
    children: ['<child-id-1>', '<child-id-2>'],
    justify: 'spaceBetween' as const,
    align: 'center' as const,
  }),
  notes: 'Use Row for horizontal layouts. justify="spaceBetween" distributes items with space between them.',
})
