import { createComponentImplementation } from '@a2ui/react/v0_9'
import { ButtonApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Button } from '@/components/ui/button'

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
