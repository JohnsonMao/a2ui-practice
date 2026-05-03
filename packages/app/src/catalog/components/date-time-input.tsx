import React, { useState, useEffect } from 'react'
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const DateTimeInputApi = {
  name: 'DateTimeInput',
  schema: z.object({
    value: DynamicStringSchema.describe('Current value in ISO-like input format (date, time, or datetime-local).'),
    enableDate: z.boolean().describe('When true, date selection is enabled.').optional(),
    enableTime: z.boolean().describe('When true, time selection is enabled.').optional(),
    min: z.string().describe('Optional lower bound for the date/time value.').optional(),
    max: z.string().describe('Optional upper bound for the date/time value.').optional(),
    label: z.string().describe('Optional label for the input field.').optional(),
  }).strict(),
} satisfies ComponentApi

export const DateTimeInputImpl = createComponentImplementation(DateTimeInputApi, ({ props }) => {
  const id = React.useId()
  const rawValue = props.value
  const initialValue = typeof rawValue === 'string' ? rawValue : ''
  const enableDate = Boolean(props.enableDate)
  const enableTime = Boolean(props.enableTime)

  const [localValue, setLocalValue] = useState(initialValue)

  useEffect(() => {
    if (typeof rawValue === 'string') setLocalValue(rawValue)
  }, [rawValue])

  const inputType =
    enableDate && enableTime ? 'datetime-local' :
    enableTime ? 'time' :
    'date'

  return (
    <div className="flex flex-col gap-1">
      {typeof props.label === 'string' && props.label && (
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {props.label}
        </label>
      )}
      <input
        id={id}
        type={inputType}
        value={localValue}
        min={typeof props.min === 'string' ? props.min : undefined}
        max={typeof props.max === 'string' ? props.max : undefined}
        onChange={(e) => {
          const newVal = e.target.value
          setLocalValue(newVal)
          props.setValue?.(newVal)
        }}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  )
})
