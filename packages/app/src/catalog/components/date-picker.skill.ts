import { a2ui } from '@a2ui/sdk'
import { DatePickerApi } from './date-picker'

a2ui.skill(DatePickerApi, {
  example: () => ({
    id: 'my-datepicker',
    component: 'DatePicker',
    placeholder: 'Pick a date',
  }),
})
