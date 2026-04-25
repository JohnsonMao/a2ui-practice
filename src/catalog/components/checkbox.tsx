import { useState, useEffect } from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { CheckBoxApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Checkbox } from '@/components/ui/checkbox'

export const CheckBoxImpl = createComponentImplementation(CheckBoxApi, ({ props }) => {
  const label = typeof props.label === 'string' ? props.label : ''
  const rawValue = props.value
  const [checked, setChecked] = useState(Boolean(rawValue))

  useEffect(() => {
    if (typeof rawValue === 'boolean') setChecked(rawValue)
  }, [rawValue])

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => {
          const newVal = Boolean(val)
          setChecked(newVal)
          props.setValue?.(newVal)
        }}
      />
      {label && (
        <span className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </span>
      )}
    </div>
  )
})
