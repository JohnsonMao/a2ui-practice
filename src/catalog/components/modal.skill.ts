import { a2ui } from '@/catalog/skill'
import { ModalApi } from './modal'

a2ui.skill(ModalApi, {
  example: () => ({
    id: 'my-modal',
    component: 'Modal',
    trigger: 'open-btn',
    content: 'modal-body',
  }),
  notes: 'The trigger component is rendered as a clickable element that opens the modal.',
})
