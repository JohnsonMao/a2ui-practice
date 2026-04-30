import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'

export const BadgeApi = {
  name: 'Badge',
  schema: z.object({
    label: z.string().describe('Text content displayed inside the badge.'),
    variant: z
      .enum(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'])
      .describe(
        'Visual style. "default" uses the primary color; "secondary" is muted; "destructive" is red for errors or warnings; "outline" shows a border with no fill; "ghost" is transparent; "link" shows underline styling.'
      )
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const BadgeImpl = createComponentImplementation(BadgeApi, ({ props }) => {
  return (
    <Badge variant={props.variant}>
      {typeof props.label === 'string' ? props.label : ''}
    </Badge>
  )
})
