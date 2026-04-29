import type { ComponentApi } from '@a2ui/web_core/v0_9'
import React from 'react'
import { z } from 'zod'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { cn } from '@/lib/utils'

export const BoxApi = {
  name: 'Box',
  schema: z.object({
    className: z.string().describe('Tailwind CSS class names to apply to the wrapping <div> element. Use this to control layout, spacing, colors, or any other utility styles.').optional(),
    children: z.array(z.string()).describe('Array of child component IDs to render inside the box, in order. Use this when you have multiple children. Cannot be used together with `child`.').optional(),
    child: z.string().describe('ID of a single child component to render inside the box. Use this when you have exactly one child. Cannot be used together with `children`.').optional(),
  }).strict(),
} satisfies ComponentApi

export const BoxImpl = createComponentImplementation(BoxApi, ({ props, buildChild }) => {
  const { className, children, child } = props

  const renderChildren = () => {
    if (child) return buildChild(child as string)
    if (!children || !Array.isArray(children)) return null
    return (children as string[]).map((id, i) => (
      <React.Fragment key={`${id}-${i}`}>{buildChild(id)}</React.Fragment>
    ))
  }

  return (
    <div className={cn(className)}>
      {renderChildren()}
    </div>
  )
})
