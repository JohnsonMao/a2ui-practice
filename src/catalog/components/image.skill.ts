import { a2ui } from '@/catalog/skill'
import { ImageApi } from './image'

a2ui.skill(ImageApi, {
  example: () => ({
    id: 'my-image',
    component: 'Image',
    url: 'https://example.com/photo.jpg',
    variant: 'mediumFeature' as const,
    fit: 'cover' as const,
  }),
})
