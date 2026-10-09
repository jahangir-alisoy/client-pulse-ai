import { Mail, MessageSquare, Phone } from 'lucide-react'
import type { Channel } from '../api/types'
import styles from './ChannelBadge.module.css'

export const CHANNELS: Channel[] = ['CHAT', 'PHONE', 'EMAIL']

export const CHANNEL_LABELS: Record<Channel, string> = {
  CHAT: 'Chat',
  PHONE: 'Phone',
  EMAIL: 'Email',
}

const ICONS = { CHAT: MessageSquare, PHONE: Phone, EMAIL: Mail }

export function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon = ICONS[channel]
  return (
    <span className={styles.badge}>
      <Icon size={14} strokeWidth={1.75} className={styles.icon} aria-hidden="true" />
      {CHANNEL_LABELS[channel]}
    </span>
  )
}
