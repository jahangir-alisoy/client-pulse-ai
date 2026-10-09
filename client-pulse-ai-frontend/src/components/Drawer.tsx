import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'
import { Button } from './Button'
import styles from './Drawer.module.css'

type DrawerProps = {
  title: ReactNode
  onClose: () => void
  children: ReactNode
}

export function Drawer({ title, onClose, children }: DrawerProps) {
  const closeButton = useRef<HTMLButtonElement>(null)
  useBodyScrollLock(true)

  useEffect(() => {
    closeButton.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className={styles.header}>
          <h2 id="drawer-title" className={styles.title}>
            {title}
          </h2>
          <Button ref={closeButton} variant="ghost" iconOnly onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={1.75} />
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
      </aside>
    </>,
    document.body,
  )
}
