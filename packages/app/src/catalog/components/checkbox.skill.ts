import { a2ui } from '@a2ui/sdk'
import { CheckBoxApi } from './checkbox'

a2ui.skill(CheckBoxApi, {
  example: () => ({
    id: 'my-checkbox',
    component: 'CheckBox',
    value: false,
    label: 'I agree to the terms',
  }),
})
