import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyList,
  TypographyP,
} from '@/components/ui/typography'

export const TypographyApi = {
  name: 'Typography',
  schema: z.object({
    variant: z
      .enum(['h1', 'h2', 'h3', 'h4', 'p', 'blockquote', 'list'])
      .describe(
        'Typographic style. Use "h1"–"h4" for headings in descending size, "p" for body paragraphs, "blockquote" for quoted content, and "list" for a bulleted list (use the "items" prop).'
      ),
    text: z
      .string()
      .describe(
        'Text content to display. Used by all variants except "list", which uses the "items" prop instead.'
      )
      .optional(),
    items: z
      .array(z.string())
      .describe('Bulleted list items. Only used when variant is "list".')
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const TypographyImpl = createComponentImplementation(TypographyApi, ({ props }) => {
  const text = typeof props.text === 'string' ? props.text : ''
  const items = Array.isArray(props.items) ? (props.items as string[]) : []

  switch (props.variant) {
    case 'h1':
      return <TypographyH1>{text}</TypographyH1>
    case 'h2':
      return <TypographyH2>{text}</TypographyH2>
    case 'h3':
      return <TypographyH3>{text}</TypographyH3>
    case 'h4':
      return <TypographyH4>{text}</TypographyH4>
    case 'blockquote':
      return <TypographyBlockquote>{text}</TypographyBlockquote>
    case 'list':
      return (
        <TypographyList>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </TypographyList>
      )
    default:
      return <TypographyP>{text}</TypographyP>
  }
})
