import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { DatePicker } from '@/components/ui/date-picker'

export const DatePickerApi = {
  name: 'DatePicker',
  schema: z.object({
    date: DynamicStringSchema.describe(
      'Currently selected date as an ISO 8601 date string (e.g. "2024-01-15"). Leave unset or empty for no initial selection.'
    ).optional(),
    placeholder: z
      .string()
      .describe('Placeholder text shown when no date is selected. Defaults to "Pick a date".')
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const DatePickerImpl = createComponentImplementation(DatePickerApi, ({ props }) => {
  const rawDate = typeof props.date === 'string' && props.date ? new Date(props.date) : undefined
  const [localDate, setLocalDate] = useState<Date | undefined>(rawDate)

  useEffect(() => {
    const d = typeof props.date === 'string' && props.date ? new Date(props.date) : undefined
    setLocalDate(d)
  }, [props.date])

  return (
    <DatePicker
      date={localDate}
      placeholder={typeof props.placeholder === 'string' ? props.placeholder : undefined}
      onDateChange={(date) => {
        setLocalDate(date)
        props.setDate?.(date ? date.toISOString().split('T')[0] : '')
      }}
    />
  )
})
