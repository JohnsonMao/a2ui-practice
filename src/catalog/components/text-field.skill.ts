import { a2ui } from '@/catalog/skill'
import { TextFieldApi } from './text-field'

a2ui.skill(TextFieldApi, {
  example: () => ({
    id: 'my-textfield',
    component: 'TextField',
    label: 'Email address',
    variant: 'shortText' as const,
  }),
})
