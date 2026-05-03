import { a2ui } from '@a2ui/sdk'
import { ButtonApi } from './button'

a2ui.skill(ButtonApi, {
  example: () => ({
    id: 'my-button',
    component: 'Button',
    variant: 'primary' as const,
    child: 'my-label',
  }),
  notes: 'Use variant="primary" for the main CTA on a page. Pair with a Text child component for the label.',
})
