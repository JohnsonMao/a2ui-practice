import { a2ui } from '@/catalog/skill'
import { DateTimeInputApi } from './date-time-input'

a2ui.skill(DateTimeInputApi, {
  example: () => ({
    id: 'my-datetimeinput',
    component: 'DateTimeInput',
    value: '2024-01-15',
    enableDate: true,
    label: 'Select date',
  }),
})
