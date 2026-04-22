import { createComponentImplementation } from '@a2ui/react/v0_9'
import { VideoApi } from '@a2ui/web_core/v0_9/basic_catalog'

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
