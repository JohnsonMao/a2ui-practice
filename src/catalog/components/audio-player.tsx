import { createComponentImplementation } from '@a2ui/react/v0_9'
import { AudioPlayerApi } from '@a2ui/web_core/v0_9/basic_catalog'

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
