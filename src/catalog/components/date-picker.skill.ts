import { a2ui } from '@/catalog/skill'
import { DatePickerApi } from './date-picker'

a2ui.skill(DatePickerApi, {
  example: () => ({
    id: 'my-datepicker',
    component: 'DatePicker',
    placeholder: 'Pick a date',
  }),
})
