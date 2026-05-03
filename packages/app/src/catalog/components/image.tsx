import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const ImageApi = {
  name: 'Image',
  schema: z.object({
    url: DynamicStringSchema.describe('Image source URL.'),
    description: DynamicStringSchema.describe('Alternative text for accessibility and screen readers.').optional(),
    fit: z
      .enum(['contain', 'cover', 'fill', 'none', 'scaleDown'])
      .describe('How the image should fit within its frame.')
      .optional(),
    variant: z
      .enum(['icon', 'avatar', 'smallFeature', 'mediumFeature', 'largeFeature', 'header'])
      .describe('Size preset for common image usages.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

const fitMap: Record<string, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  scaleDown: 'object-scale-down',
}

const variantSizeMap: Record<string, string> = {
  icon: 'w-6 h-6',
  avatar: 'w-10 h-10 rounded-full',
  smallFeature: 'w-24 h-24',
  mediumFeature: 'w-48 h-48',
  largeFeature: 'w-full h-64',
  header: 'w-full h-40',
}

export const ImageImpl = createComponentImplementation(ImageApi, ({ props }) => {
  const url = typeof props.url === 'string' ? props.url : ''
  const description = typeof props.description === 'string' ? props.description : ''
  const fit = fitMap[props.fit ?? 'fill'] ?? 'object-fill'
  const size = variantSizeMap[props.variant ?? 'mediumFeature'] ?? ''
  return (
    <img
      src={url}
      alt={description}
      className={`${size} ${fit}`}
    />
  )
})
