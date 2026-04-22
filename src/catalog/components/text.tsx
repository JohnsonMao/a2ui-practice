import { createComponentImplementation } from '@a2ui/react/v0_9'
import { TextApi } from '@a2ui/web_core/v0_9/basic_catalog'

const variantTagMap = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', caption: 'span', body: 'p',
} as const

const variantClassMap: Record<string, string> = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold',
  caption: 'text-sm text-muted-foreground',
  body: 'text-base leading-7',
}

export const TextImpl = createComponentImplementation(TextApi, ({ props }) => {
  const variant = props.variant ?? 'body'
  const Tag = variantTagMap[variant] as keyof React.JSX.IntrinsicElements
  const text = typeof props.text === 'string' ? props.text : String(props.text ?? '')
  return <Tag className={variantClassMap[variant]}>{text}</Tag>
})
