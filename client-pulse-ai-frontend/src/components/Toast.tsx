import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export type ToastOptions = {
  tone: ToastTone
  title: string
  description?: string
  durationMs?: number
}

type ToastContextValue = {
  show: (options: ToastOptions) => void
}

type ToastEntry = ToastOptions & {
  id: number
  leaving: boolean
}

const MAX_VISIBLE = 4
const DEFAULT_DURATION_MS = 5000
const ERROR_DURATION_MS = 8000
const EXIT_DURATION_MS = 160

const ICONS = { success: CircleCheck, error: CircleAlert, warning: TriangleAlert, info: Info }

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const nextId = useRef(0)

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const dismiss = useCallback(
    (id: number) => {
      setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
      window.setTimeout(() => remove(id), EXIT_DURATION_MS)
    },
    [remove],
  )

  const show = useCallback((options: ToastOptions) => {
    nextId.current += 1
    const entry: ToastEntry = { ...options, id: nextId.current, leaving: false }
    setToasts((current) => [...current.filter((toast) => !toast.leaving).slice(-(MAX_VISIBLE - 1)), entry])
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <section className={styles.viewport} aria-label="Notifications" aria-live="polite" aria-relevant="additions text">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </section>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastEntry; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(toast.durationMs ?? (toast.tone === 'error' ? ERROR_DURATION_MS : DEFAULT_DURATION_MS))
  const Icon = ICONS[toast.tone]

  useEffect(() => {
    if (paused || toast.leaving) {
      return
    }
    const startedAt = Date.now()
    const timer = window.setTimeout(() => onDismiss(toast.id), Math.max(0, remaining.current))
    return () => {
      window.clearTimeout(timer)
      remaining.current -= Date.now() - startedAt
    }
  }, [paused, toast.leaving, toast.id, onDismiss])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : undefined}
      className={`${styles.toast} ${styles[toast.tone]} ${toast.leaving ? styles.leaving : ''}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon size={16} strokeWidth={2} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <p className={styles.title}>{toast.title}</p>
        {toast.description && <p className={styles.description}>{toast.description}</p>}
      </div>
      <button type="button" className={styles.dismiss} aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}>
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return context
}
