import React from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { DateTimeInputApi } from '@a2ui/web_core/v0_9/basic_catalog'

export const DateTimeInputImpl = createComponentImplementation(DateTimeInputApi, ({ props }) => {
  const id = React.useId()
  const value = typeof props.value === 'string' ? props.value : ''
  const enableDate = Boolean(props.enableDate)
  const enableTime = Boolean(props.enableTime)

  const inputType =
    enableDate && enableTime ? 'datetime-local' :
    enableTime ? 'time' :
    'date'

  return (
    <div className="flex flex-col gap-1">
      <input
        id={id}
        type={inputType}
        value={value}
        onChange={(e) => props.setValue?.(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  )
})
