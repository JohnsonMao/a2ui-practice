import { a2ui } from '@a2ui/sdk'
import { VideoApi } from './video'

a2ui.skill(VideoApi, {
  example: () => ({
    id: 'my-video',
    component: 'Video',
    url: 'https://example.com/video.mp4',
  }),
})
