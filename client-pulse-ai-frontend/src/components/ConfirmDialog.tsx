import { LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'
import styles from './ConfirmDialog.module.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  tone?: 'default' | 'danger'
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'default',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const close = () => {
    if (!busy) {
      onCancel()
    }
  }

  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={close}
      size="small"
      footer={
        <>
          <Button onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy} aria-busy={busy}>
            {busy && <LoaderCircle size={14} strokeWidth={2} className={styles.spin} aria-hidden="true" />}
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}
