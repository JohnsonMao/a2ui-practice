import { useState, useEffect } from 'react'
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicBooleanSchema, DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'

export const CheckBoxApi = {
  name: 'CheckBox',
  schema: z.object({
    label: DynamicStringSchema.describe('Optional text label displayed next to the checkbox.').optional(),
    value: DynamicBooleanSchema.describe('Current checked state of the checkbox.'),
  }).strict(),
} satisfies ComponentApi

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
