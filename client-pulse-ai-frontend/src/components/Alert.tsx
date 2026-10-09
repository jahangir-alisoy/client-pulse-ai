import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './Alert.module.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'error'

type AlertProps = {
  tone: AlertTone
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

const ICONS = { info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert }

export function Alert({ tone, title, children, action, className }: AlertProps) {
  const Icon = ICONS[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`${styles.alert} ${styles[tone]} ${className ?? ''}`}>
      <Icon size={16} strokeWidth={2} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {children && <div className={styles.text}>{children}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
