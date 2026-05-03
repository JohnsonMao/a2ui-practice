import { a2ui } from '@a2ui/sdk'
import { SliderApi } from './slider'

a2ui.skill(SliderApi, {
  example: () => ({
    id: 'my-slider',
    component: 'Slider',
    max: 100,
    value: 50,
    min: 0,
    label: 'Volume',
  }),
})
