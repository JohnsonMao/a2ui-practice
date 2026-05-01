import { a2ui } from '@/catalog/skill'
import { BoxApi } from './box'

a2ui.skill(BoxApi, {
  example: () => ({
    id: 'my-box',
    component: 'Box',
    className: 'p-4 flex flex-col gap-2',
    children: ['<child-id-1>', '<child-id-2>'],
  }),
  notes: 'Use className to apply Tailwind utility classes for layout and spacing.',
})
