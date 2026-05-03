import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'

export const CardApi = {
  name: 'Card',
  schema: z.object({
    child: z.string().describe('ID of the child component rendered inside the card body.'),
  }).strict(),
} satisfies ComponentApi

export const CardImpl = createComponentImplementation(CardApi, ({ props, buildChild }) => {
  return (
    <Card>
      <CardContent className="p-4">
        {props.child ? buildChild(props.child as string) : null}
      </CardContent>
    </Card>
  )
})
