import React from 'react'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { RowApi } from '@a2ui/web_core/v0_9/basic_catalog'

const justifyMap: Record<string, string> = {
  center: 'justify-center',
  end: 'justify-end',
  spaceAround: 'justify-around',
  spaceBetween: 'justify-between',
  spaceEvenly: 'justify-evenly',
  start: 'justify-start',
  stretch: 'justify-stretch',
}

const alignMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

export const RowImpl = createComponentImplementation(RowApi, ({ props, buildChild }) => {
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
    <div className={`flex flex-row gap-2 ${justify} ${align}`}>
      {renderChildren()}
    </div>
  )
})
