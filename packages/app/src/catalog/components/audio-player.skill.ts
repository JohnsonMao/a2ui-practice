import { a2ui } from '@a2ui/sdk'
import { AudioPlayerApi } from './audio-player'

a2ui.skill(AudioPlayerApi, {
  example: () => ({
    id: 'my-audioplayer',
    component: 'AudioPlayer',
    url: 'https://example.com/audio.mp3',
  }),
})
