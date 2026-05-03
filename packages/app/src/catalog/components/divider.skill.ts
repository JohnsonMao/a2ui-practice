import { a2ui } from '@a2ui/sdk'
import { DividerApi } from './divider'

a2ui.skill(DividerApi, {
  example: () => ({
    id: 'my-divider',
    component: 'Divider',
  }),
})
