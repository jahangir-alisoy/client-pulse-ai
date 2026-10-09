import { CircleAlert } from 'lucide-react'
import styles from './Notice.module.css'

export function ErrorNotice({ message, className }: { message: string; className?: string }) {
  return (
    <div role="alert" className={`${styles.notice} ${className ?? ''}`}>
      <CircleAlert size={14} strokeWidth={2} className={styles.icon} aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
