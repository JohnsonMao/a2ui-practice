import { a2ui } from '@a2ui/sdk'
import { CardApi } from './card'

a2ui.skill(CardApi, {
  example: () => ({
    id: 'my-card',
    component: 'Card',
    child: 'my-content',
  }),
})
