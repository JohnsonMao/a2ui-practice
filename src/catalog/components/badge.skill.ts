import { a2ui } from '@/catalog/skill'
import { BadgeApi } from './badge'

a2ui.skill(BadgeApi, {
  example: () => ({
    id: 'my-badge',
    component: 'Badge',
    label: 'New',
    variant: 'default' as const,
  }),
})
