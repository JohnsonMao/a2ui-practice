import { createComponentImplementation } from '@a2ui/react/v0_9'
import { CheckBoxApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Checkbox } from '@/components/ui/checkbox'

export const CheckBoxImpl = createComponentImplementation(CheckBoxApi, ({ props }) => {
  const label = typeof props.label === 'string' ? props.label : ''
  const checked = Boolean(props.value)

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => props.setValue?.(Boolean(val))}
      />
      {label && (
        <span className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </span>
      )}
    </div>
  )
})
