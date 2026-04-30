import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { ChildListSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const ListApi = {
  name: 'List',
  schema: z.object({
    direction: z
      .enum(['vertical', 'horizontal'])
      .describe('Layout direction for list items.')
      .optional(),
    children: ChildListSchema.describe('Ordered child component IDs rendered as list items.').optional(),
  }).strict(),
} satisfies ComponentApi

export const ListImpl = createComponentImplementation(ListApi, ({ props, buildChild }) => {
  const direction = props.direction ?? 'vertical'
  const children = props.children
  const isHorizontal = direction === 'horizontal'

  const renderChildren = () => {
    if (!children || !Array.isArray(children)) return null
    return (children as Array<string | { id: string; basePath?: string }>).map((item, i) => {
      const child = typeof item === 'string'
        ? buildChild(item)
        : item && typeof item === 'object' && 'id' in item
          ? buildChild(item.id, item.basePath)
          : null
      if (!child) return null
      return (
        <li key={typeof item === 'string' ? `${item}-${i}` : `${(item as { id: string }).id}-${i}`}>
          {child}
        </li>
      )
    })
  }

  return (
    <ul className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} gap-1 list-none p-0 m-0`}>
      {renderChildren()}
    </ul>
  )
})
