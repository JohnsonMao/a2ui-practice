import { createComponentImplementation } from '@a2ui/react/v0_9'
import { SliderApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Slider } from '@/components/ui/slider'

export const SliderImpl = createComponentImplementation(SliderApi, ({ props }) => {
  const label = typeof props.label === 'string' ? props.label : ''
  const min = typeof props.min === 'number' ? props.min : 0
  const max = typeof props.max === 'number' ? props.max : 100
  const value = typeof props.value === 'number' ? props.value : min

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
      )}
      <Slider
        min={min}
        max={max}
        value={[value]}
        onValueChange={(vals) => props.setValue?.(vals[0])}
      />
    </div>
  )
})
