import { a2ui } from '@a2ui/sdk'
import { BadgeApi } from './badge'

a2ui.skill(BadgeApi, {
  example: () => ({
    id: 'my-badge',
    component: 'Badge',
    label: 'New',
    variant: 'default' as const,
  }),
})
