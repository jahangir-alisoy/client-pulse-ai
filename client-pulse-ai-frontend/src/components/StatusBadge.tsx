import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import type { AnalysisStatus } from '../api/types'
import styles from './StatusBadge.module.css'

const STATUS = {
  COMPLETED: { label: 'Completed', Icon: CircleCheck, className: styles.completed },
  FAILED: { label: 'Failed', Icon: CircleX, className: styles.failed },
  PENDING: { label: 'Pending', Icon: LoaderCircle, className: `${styles.pending} ${styles.spin}` },
}

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  const { label, Icon, className } = STATUS[status]
  return (
    <span className={styles.badge}>
      <Icon size={14} strokeWidth={2} className={className} aria-hidden="true" />
      {label}
    </span>
  )
}
