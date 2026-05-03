import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { Separator } from '@/components/ui/separator'

export const DividerApi = {
  name: 'Divider',
  schema: z.object({
    axis: z
      .enum(['horizontal', 'vertical'])
      .describe('Orientation of the divider line. Use vertical between side-by-side elements.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const DividerImpl = createComponentImplementation(DividerApi, ({ props }) => {
  const orientation = props.axis === 'vertical' ? 'vertical' : 'horizontal'
  return (
    <Separator
      orientation={orientation}
      className={orientation === 'vertical' ? 'h-full' : 'w-full'}
    />
  )
})
