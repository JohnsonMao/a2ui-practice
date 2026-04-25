import { useState, useEffect } from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { SliderApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Slider } from '@/components/ui/slider'

export const SliderImpl = createComponentImplementation(SliderApi, ({ props }) => {
  const label = typeof props.label === 'string' ? props.label : ''
  const min = typeof props.min === 'number' ? props.min : 0
  const max = typeof props.max === 'number' ? props.max : 100
  const rawValue = props.value
  const initialValue = typeof rawValue === 'number' ? rawValue : min

  const [localValue, setLocalValue] = useState(initialValue)

  useEffect(() => {
    if (typeof rawValue === 'number') setLocalValue(rawValue)
  }, [rawValue])

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{localValue}</span>
        </div>
      )}
      <Slider
        min={min}
        max={max}
        value={[localValue]}
        onValueChange={(vals) => {
          const newVal = vals[0]
          setLocalValue(newVal)
          props.setValue?.(newVal)
        }}
      />
    </div>
  )
})
