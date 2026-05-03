import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'

export const VideoApi = {
  name: 'Video',
  schema: z.object({
    url: DynamicStringSchema.describe('Video source URL.'),
  }).strict(),
} satisfies ComponentApi

export const VideoImpl = createComponentImplementation(VideoApi, ({ props }) => {
  const url = typeof props.url === 'string' ? props.url : ''
  return (
    <video
      src={url}
      controls
      className="w-full rounded-md"
    />
  )
})
