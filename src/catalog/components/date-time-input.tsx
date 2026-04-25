import React, { useState, useEffect } from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { DateTimeInputApi } from '@a2ui/web_core/v0_9/basic_catalog'

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
      <input
        id={id}
        type={inputType}
        value={localValue}
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
