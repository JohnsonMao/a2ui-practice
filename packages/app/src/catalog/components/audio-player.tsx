import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const AudioPlayerApi = {
  name: 'AudioPlayer',
  schema: z.object({
    url: DynamicStringSchema.describe('Audio source URL to play. Use an HTTPS URL or a resolvable local asset path.'),
    description: DynamicStringSchema.describe('Optional helper text shown above the audio controls.').optional(),
  }).strict(),
} satisfies ComponentApi

export const AudioPlayerImpl = createComponentImplementation(AudioPlayerApi, ({ props }) => {
  const url = typeof props.url === 'string' ? props.url : ''
  const description = typeof props.description === 'string' ? props.description : ''
  return (
    <div className="flex flex-col gap-1">
      {description && <span className="text-sm text-muted-foreground">{description}</span>}
      <audio src={url} controls className="w-full" />
    </div>
  )
})
