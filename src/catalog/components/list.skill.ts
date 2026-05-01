import { a2ui } from '@/catalog/skill'
import { ListApi } from './list'

a2ui.skill(ListApi, {
  example: () => ({
    id: 'my-list',
    component: 'List',
    direction: 'vertical' as const,
    children: ['<item-1>', '<item-2>', '<item-3>'],
  }),
  notes: 'Use direction="horizontal" for side-by-side items, "vertical" for stacked.',
})
