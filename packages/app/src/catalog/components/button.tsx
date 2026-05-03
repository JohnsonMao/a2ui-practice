import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { ActionSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

export const ButtonApi = {
  name: 'Button',
  schema: z.object({
    variant: z
      .enum(['default', 'primary', 'borderless'])
      .describe('Visual style. Use "primary" for emphasis, "default" for standard actions, and "borderless" for low-emphasis actions.')
      .optional(),
    child: z.string().describe('ID of a single child component rendered inside the button, typically a Text component.'),
    action: ActionSchema.describe('Action executed when the button is clicked.').optional(),
  }).strict(),
} satisfies ComponentApi

const variantMap: Record<string, 'default' | 'ghost' | 'outline'> = {
  default: 'default',
  primary: 'default',
  borderless: 'ghost',
}

export const ButtonImpl = createComponentImplementation(ButtonApi, ({ props, buildChild }) => {
  const variant = variantMap[props.variant ?? 'default'] ?? 'default'
  return (
    <Button
      variant={variant}
      onClick={props.action as React.MouseEventHandler<HTMLButtonElement> | undefined}
      disabled={props.isValid === false}
    >
      {props.child ? buildChild(props.child as string) : null}
    </Button>
  )
})
