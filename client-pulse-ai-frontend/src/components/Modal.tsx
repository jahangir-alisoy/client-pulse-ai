import { X } from 'lucide-react'
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'
import { focusableElements, trapTabKey } from '../lib/focusable'
import { Button } from './Button'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  title: string
  description?: ReactNode
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  size?: 'small' | 'medium'
}

export function Modal({ open, title, description, onClose, children, footer, size = 'medium' }: ModalProps) {
  if (!open) {
    return null
  }
  return (
    <ModalDialog title={title} description={description} onClose={onClose} footer={footer} size={size}>
      {children}
    </ModalDialog>
  )
}

function ModalDialog({ title, description, onClose, children, footer, size }: Omit<ModalProps, 'open'>) {
  const dialog = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const hasBody = children !== undefined && children !== null && children !== false
  useBodyScrollLock(true)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const firstFocusable = content.current ? focusableElements(content.current)[0] : undefined
    const target = firstFocusable ?? dialog.current
    target?.focus()
    return () => previouslyFocused?.focus()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }
    if (dialog.current) {
      trapTabKey(event.nativeEvent, dialog.current)
    }
  }

  return createPortal(
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`${styles.dialog} ${styles[size ?? 'medium']}`}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.header}>
          <div className={styles.heading}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className={styles.description}>
                {description}
              </div>
            )}
          </div>
          <Button variant="ghost" iconOnly onClick={onClose} aria-label="Close" className={styles.close}>
            <X size={16} strokeWidth={1.75} />
          </Button>
        </div>
        <div ref={content} className={styles.content}>
          {hasBody && <div className={styles.body}>{children}</div>}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  )
}
