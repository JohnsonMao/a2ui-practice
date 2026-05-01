import { a2ui } from '@/catalog/skill'
import { TabsApi } from './tabs'

a2ui.skill(TabsApi, {
  example: () => ({
    id: 'my-tabs',
    component: 'Tabs',
    tabs: [
      { title: 'Overview', child: 'tab-overview' },
      { title: 'Details', child: 'tab-details' },
    ],
  }),
})
