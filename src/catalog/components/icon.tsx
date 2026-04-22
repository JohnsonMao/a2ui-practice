import { createComponentImplementation } from '@a2ui/react/v0_9'
import { IconApi } from '@a2ui/web_core/v0_9/basic_catalog'
import {
  User, Plus, ArrowLeft, ArrowRight, Paperclip, Calendar, Phone, Camera,
  Check, X, Trash2, Download, Edit, CalendarDays, AlertCircle, FastForward,
  Heart, HeartOff, Folder, HelpCircle, Home, Info, MapPin, Lock, Unlock,
  Mail, Menu, MoreVertical, MoreHorizontal, BellOff, Bell, Pause, CreditCard,
  Image as ImageIcon, Play, Printer, RefreshCw, Rewind, Search, Send,
  Settings, Share2, ShoppingCart, SkipForward, SkipBack, Star, StarHalf,
  StarOff, Square, Upload, Eye, EyeOff, Volume1, VolumeX, Volume2, AlertTriangle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  accountCircle: User,
  add: Plus,
  arrowBack: ArrowLeft,
  arrowForward: ArrowRight,
  attachFile: Paperclip,
  calendarToday: Calendar,
  call: Phone,
  camera: Camera,
  check: Check,
  close: X,
  delete: Trash2,
  download: Download,
  edit: Edit,
  event: CalendarDays,
  error: AlertCircle,
  fastForward: FastForward,
  favorite: Heart,
  favoriteOff: HeartOff,
  folder: Folder,
  help: HelpCircle,
  home: Home,
  info: Info,
  locationOn: MapPin,
  lock: Lock,
  lockOpen: Unlock,
  mail: Mail,
  menu: Menu,
  moreVert: MoreVertical,
  moreHoriz: MoreHorizontal,
  notificationsOff: BellOff,
  notifications: Bell,
  pause: Pause,
  payment: CreditCard,
  person: User,
  phone: Phone,
  photo: ImageIcon,
  play: Play,
  print: Printer,
  refresh: RefreshCw,
  rewind: Rewind,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share2,
  shoppingCart: ShoppingCart,
  skipNext: SkipForward,
  skipPrevious: SkipBack,
  star: Star,
  starHalf: StarHalf,
  starOff: StarOff,
  stop: Square,
  upload: Upload,
  visibility: Eye,
  visibilityOff: EyeOff,
  volumeDown: Volume1,
  volumeMute: VolumeX,
  volumeOff: VolumeX,
  volumeUp: Volume2,
  warning: AlertTriangle,
}

export const IconImpl = createComponentImplementation(IconApi, ({ props }) => {
  const nameVal = props.name as unknown
  const name = typeof nameVal === 'string' ? nameVal : (nameVal as { path?: string })?.path ?? ''
  const LucideComponent = iconMap[name]
  if (!LucideComponent) return null
  return <LucideComponent className="w-5 h-5" />
})
