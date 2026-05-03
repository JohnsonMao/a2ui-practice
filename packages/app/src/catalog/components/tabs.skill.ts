import { a2ui } from '@a2ui/sdk'
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
