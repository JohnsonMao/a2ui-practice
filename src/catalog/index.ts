import { Catalog } from '@a2ui/web_core/v0_9'
import type { ReactComponentImplementation } from '@a2ui/react/v0_9'
import { TextImpl } from './components/text'
import { ImageImpl } from './components/image'
import { IconImpl } from './components/icon'
import { VideoImpl } from './components/video'
import { AudioPlayerImpl } from './components/audio-player'
import { RowImpl } from './components/row'
import { ColumnImpl } from './components/column'
import { ListImpl } from './components/list'
import { CardImpl } from './components/card'
import { TabsImpl } from './components/tabs'
import { ModalImpl } from './components/modal'
import { DividerImpl } from './components/divider'
import { ButtonImpl } from './components/button'
import { TextFieldImpl } from './components/text-field'
import { CheckBoxImpl } from './components/checkbox'
import { ChoicePickerImpl } from './components/choice-picker'
import { SliderImpl } from './components/slider'
import { DateTimeInputImpl } from './components/date-time-input'
import { BoxImpl } from './components/box'

export const customCatalog = new Catalog<ReactComponentImplementation>('custom', [
  TextImpl,
  ImageImpl,
  IconImpl,
  VideoImpl,
  AudioPlayerImpl,
  RowImpl,
  ColumnImpl,
  ListImpl,
  CardImpl,
  TabsImpl,
  ModalImpl,
  DividerImpl,
  ButtonImpl,
  TextFieldImpl,
  CheckBoxImpl,
  ChoicePickerImpl,
  SliderImpl,
  DateTimeInputImpl,
  BoxImpl,
])
