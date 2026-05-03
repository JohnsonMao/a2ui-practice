import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

export const ModalApi = {
  name: 'Modal',
  schema: z.object({
    trigger: z.string().describe('ID of the component used as the modal trigger.'),
    content: z.string().describe('ID of the component rendered inside the modal content area.'),
  }).strict(),
} satisfies ComponentApi

export const ModalImpl = createComponentImplementation(ModalApi, ({ props, buildChild }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="inline-block">
          {props.trigger ? buildChild(props.trigger as string) : null}
        </span>
      </DialogTrigger>
      <DialogContent>
        {props.content ? buildChild(props.content as string) : null}
      </DialogContent>
    </Dialog>
  )
})
