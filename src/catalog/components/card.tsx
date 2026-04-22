import { createComponentImplementation } from '@a2ui/react/v0_9'
import { CardApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Card, CardContent } from '@/components/ui/card'

export const CardImpl = createComponentImplementation(CardApi, ({ props, buildChild }) => {
  return (
    <Card>
      <CardContent className="p-4">
        {props.child ? buildChild(props.child as string) : null}
      </CardContent>
    </Card>
  )
})
