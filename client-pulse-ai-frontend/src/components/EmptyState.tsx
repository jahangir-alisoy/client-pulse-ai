import type { ReactNode } from 'react'
import { Card } from './Card'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: ReactNode
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </Card>
  )
}
