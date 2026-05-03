import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicBooleanSchema, DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const DialogApi = {
  name: 'Dialog',
  schema: z.object({
    open: DynamicBooleanSchema.describe(
      'Whether the dialog is currently visible. Set to true to show the dialog, false to dismiss it.'
    ).optional(),
    title: DynamicStringSchema.describe(
      'Heading text displayed at the top of the dialog.'
    ).optional(),
    description: DynamicStringSchema.describe(
      'Descriptive text shown below the title to give context.'
    ).optional(),
    content: z
      .string()
      .describe('ID of the child component to render as the dialog body.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const DialogImpl = createComponentImplementation(DialogApi, ({ props, buildChild }) => {
  const open = typeof props.open === 'boolean' ? props.open : false

  return (
    <Dialog open={open} onOpenChange={(val) => props.setOpen?.(val)}>
      <DialogContent>
        {(props.title || props.description) && (
          <DialogHeader>
            {props.title && <DialogTitle>{String(props.title)}</DialogTitle>}
            {props.description && (
              <DialogDescription>{String(props.description)}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {props.content ? buildChild(props.content as string) : null}
      </DialogContent>
    </Dialog>
  )
})
