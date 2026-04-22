import { createComponentImplementation } from '@a2ui/react/v0_9'
import { ImageApi } from '@a2ui/web_core/v0_9/basic_catalog'

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
