import { createComponentImplementation } from '@a2ui/react/v0_9'
import { ModalApi } from '@a2ui/web_core/v0_9/basic_catalog'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

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
