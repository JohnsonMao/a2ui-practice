import { a2ui } from '@/catalog/skill'
import { CardApi } from './card'

a2ui.skill(CardApi, {
  example: () => ({
    id: 'my-card',
    component: 'Card',
    child: 'my-content',
  }),
})
