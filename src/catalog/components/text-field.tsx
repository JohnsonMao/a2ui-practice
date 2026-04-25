import React, { useState, useEffect } from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { TextFieldApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Input } from '@/components/ui/input'

export const TextFieldImpl = createComponentImplementation(TextFieldApi, ({ props }) => {
  const id = React.useId()
  const label = typeof props.label === 'string' ? props.label : ''
  const rawValue = props.value
  const initialValue = typeof rawValue === 'string' ? rawValue : ''
  const variant = props.variant ?? 'shortText'

  const [localValue, setLocalValue] = useState(initialValue)

  useEffect(() => {
    if (typeof rawValue === 'string') setLocalValue(rawValue)
  }, [rawValue])

  const inputType =
    variant === 'number' ? 'number' :
    variant === 'obscured' ? 'password' :
    'text'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setLocalValue(newVal)
    props.setValue?.(newVal)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
      {variant === 'longText' ? (
        <textarea
          id={id}
          value={localValue}
          onChange={handleChange}
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      ) : (
        <Input
          id={id}
          type={inputType}
          value={localValue}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
        />
      )}
    </div>
  )
})
