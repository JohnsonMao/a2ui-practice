import { a2ui } from '@a2ui/sdk'
import { ColumnApi } from './column'

a2ui.skill(ColumnApi, {
  example: () => ({
    id: 'my-column',
    component: 'Column',
    children: ['<child-id-1>', '<child-id-2>'],
    align: 'stretch' as const,
  }),
  notes: 'Use Column for vertical stacking. Use align="center" to horizontally center children.',
})
