import { createComponentImplementation } from '@a2ui/react/v0_9'
import { ChoicePickerApi } from '@a2ui/web_core/v0_9/basic_catalog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export const ChoicePickerImpl = createComponentImplementation(ChoicePickerApi, ({ props }) => {
  const label = typeof props.label === 'string' ? props.label : ''
  const options = Array.isArray(props.options) ? props.options : []
  const values = Array.isArray(props.value) ? (props.value as string[]) : []
  const isMutuallyExclusive = (props.variant ?? 'mutuallyExclusive') === 'mutuallyExclusive'

  if (isMutuallyExclusive) {
    const selectedValue = values[0] ?? ''
    return (
      <div className="flex flex-col gap-1">
        {label && <span className="text-sm font-medium">{label}</span>}
        <Select
          value={selectedValue}
          onValueChange={(val) => props.setValue?.([val])}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt: { label: unknown; value: string }, i: number) => (
              <SelectItem key={i} value={opt.value}>
                {typeof opt.label === 'string' ? opt.label : String(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // multipleSelection - render as checkboxes
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium">{label}</span>}
      {options.map((opt: { label: unknown; value: string }, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <Checkbox
            checked={values.includes(opt.value)}
            onCheckedChange={(checked) => {
              const newVals = checked
                ? [...values, opt.value]
                : values.filter((v) => v !== opt.value)
              props.setValue?.(newVals)
            }}
          />
          <span className="text-sm">{typeof opt.label === 'string' ? opt.label : String(opt.label)}</span>
        </div>
      ))}
    </div>
  )
})
