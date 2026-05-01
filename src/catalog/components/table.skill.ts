import { a2ui } from '@/catalog/skill'
import { TableApi } from './table'

a2ui.skill(TableApi, {
  example: () => ({
    id: 'my-table',
    component: 'Table',
    columns: ['Name', 'Role', 'Status'],
    rows: [
      ['Alice', 'Engineer', 'Active'],
      ['Bob', 'Designer', 'Active'],
    ],
    caption: 'Team members',
  }),
})
