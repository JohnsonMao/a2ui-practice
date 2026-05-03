import React from 'react'
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { ChildListSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const ColumnApi = {
  name: 'Column',
  schema: z.object({
    children: ChildListSchema.describe('Ordered list of child component IDs rendered vertically.').optional(),
    justify: z
      .enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'])
      .describe('Main-axis distribution of children in the vertical direction.')
      .optional(),
    align: z
      .enum(['start', 'center', 'end', 'stretch'])
      .describe('Cross-axis alignment of children in the horizontal direction.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  spaceBetween: 'justify-between',
  spaceAround: 'justify-around',
  spaceEvenly: 'justify-evenly',
  stretch: 'justify-stretch',
}

const alignMap: Record<string, string> = {
  center: 'items-center',
  end: 'items-end',
  start: 'items-start',
  stretch: 'items-stretch',
}

export const ColumnImpl = createComponentImplementation(ColumnApi, ({ props, buildChild }) => {
  const justify = justifyMap[props.justify ?? 'start'] ?? 'justify-start'
  const align = alignMap[props.align ?? 'stretch'] ?? 'items-stretch'
  const children = props.children

  const renderChildren = () => {
    if (!children || !Array.isArray(children)) return null
    return (children as Array<string | { id: string; basePath?: string }>).map((item, i) => {
      if (typeof item === 'string') return <React.Fragment key={`${item}-${i}`}>{buildChild(item)}</React.Fragment>
      if (item && typeof item === 'object' && 'id' in item) {
        return <React.Fragment key={`${item.id}-${i}`}>{buildChild(item.id, item.basePath)}</React.Fragment>
      }
      return null
    })
  }

  return (
    <div className={`flex flex-col gap-2 ${justify} ${align}`}>
      {renderChildren()}
    </div>
  )
})
