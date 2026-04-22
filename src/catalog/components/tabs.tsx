import { createComponentImplementation } from '@a2ui/react/v0_9'
import { TabsApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export const TabsImpl = createComponentImplementation(TabsApi, ({ props, buildChild }) => {
  const tabs = Array.isArray(props.tabs) ? props.tabs : []
  if (tabs.length === 0) return null

  const defaultValue = String(tabs[0]?.title ?? '0')

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {tabs.map((tab, i) => (
          <TabsTrigger key={i} value={String(tab.title ?? i)}>
            {typeof tab.title === 'string' ? tab.title : String(tab.title ?? '')}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={i} value={String(tab.title ?? i)}>
          {tab.child ? buildChild(tab.child) : null}
        </TabsContent>
      ))}
    </Tabs>
  )
})
