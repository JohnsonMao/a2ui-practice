import type { ComponentApi } from '@a2ui/web_core/v0_9'
import React from 'react'
import { z } from 'zod'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { cn } from '@/lib/utils'

const BoxApi: ComponentApi = {
  name: 'Box',
  schema: z.object({
    className: z.string().optional(),
    children: z.array(z.string()).optional(),
    child: z.string().optional(),
  }).strict(),
}

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
