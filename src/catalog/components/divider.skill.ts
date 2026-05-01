import { a2ui } from '@/catalog/skill'
import { DividerApi } from './divider'

a2ui.skill(DividerApi, {
  example: () => ({
    id: 'my-divider',
    component: 'Divider',
  }),
})
