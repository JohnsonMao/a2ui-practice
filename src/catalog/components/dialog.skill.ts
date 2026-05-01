import { a2ui } from '@/catalog/skill'
import { DialogApi } from './dialog'

a2ui.skill(DialogApi, {
  example: () => ({
    id: 'my-dialog',
    component: 'Dialog',
    open: false,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    content: 'my-dialog-body',
  }),
  notes: 'Control visibility with the "open" prop. Use an action to toggle it.',
})
