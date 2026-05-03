import { a2ui } from '@a2ui/sdk'
import { IconApi } from './icon'

a2ui.skill(IconApi, {
  example: () => ({
    id: 'my-icon',
    component: 'Icon',
    name: 'star',
  }),
  notes: 'Use Lucide icon names such as "star", "search", "settings", "add", "warning".',
})
