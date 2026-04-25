import { useState, useEffect } from 'react'
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
  const rawValue = props.value
  const initialValues = Array.isArray(rawValue) ? (rawValue as string[]) : []
  const isMutuallyExclusive = (props.variant ?? 'mutuallyExclusive') === 'mutuallyExclusive'

  const [localValues, setLocalValues] = useState<string[]>(initialValues)

  useEffect(() => {
    if (Array.isArray(rawValue)) setLocalValues(rawValue as string[])
  }, [rawValue])

  if (isMutuallyExclusive) {
    const selectedValue = localValues[0] ?? ''
    return (
      <div className="flex flex-col gap-1">
        {label && <span className="text-sm font-medium">{label}</span>}
        <Select
          value={selectedValue}
          onValueChange={(val) => {
            const newVals = [val]
            setLocalValues(newVals)
            props.setValue?.(newVals)
          }}
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
            checked={localValues.includes(opt.value)}
            onCheckedChange={(checked) => {
              const newVals = checked
                ? [...localValues, opt.value]
                : localValues.filter((v) => v !== opt.value)
              setLocalValues(newVals)
              props.setValue?.(newVals)
            }}
          />
          <span className="text-sm">{typeof opt.label === 'string' ? opt.label : String(opt.label)}</span>
        </div>
      ))}
    </div>
  )
})
