import { a2ui } from '@a2ui/sdk'
import { ChoicePickerApi } from './choice-picker'

a2ui.skill(ChoicePickerApi, {
  example: () => ({
    id: 'my-choicepicker',
    component: 'ChoicePicker',
    options: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
    ],
    value: ['a'],
    variant: 'mutuallyExclusive' as const,
  }),
})
