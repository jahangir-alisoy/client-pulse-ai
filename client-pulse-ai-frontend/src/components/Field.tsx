import { ChevronDown } from 'lucide-react'
import { createContext, useContext, useId, type AriaAttributes, type ComponentProps, type ReactNode } from 'react'
import styles from './Field.module.css'

type FieldProps = {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
}

type FieldContextValue = {
  describedBy?: string
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue>({ invalid: false })

export function Field({ label, hint, error, children }: FieldProps) {
  const messageId = useId()
  const message = error ?? hint
  const context = { describedBy: message ? messageId : undefined, invalid: Boolean(error) }

  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
      {message && (
        <span id={messageId} className={error ? styles.error : styles.hint}>
          {message}
        </span>
      )}
    </label>
  )
}

function useFieldAria(describedBy: string | undefined, invalid: AriaAttributes['aria-invalid']) {
  const field = useContext(FieldContext)
  return {
    'aria-describedby': [describedBy, field.describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': invalid ?? (field.invalid || undefined),
  }
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  const aria = useFieldAria(props['aria-describedby'], props['aria-invalid'])
  return <input {...props} {...aria} className={`${styles.control} ${className ?? ''}`} />
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  const aria = useFieldAria(props['aria-describedby'], props['aria-invalid'])
  return (
    <span className={styles.selectWrap}>
      <select {...props} {...aria} className={`${styles.control} ${styles.select} ${className ?? ''}`}>
        {children}
      </select>
      <ChevronDown size={14} strokeWidth={1.75} className={styles.chevron} aria-hidden="true" />
    </span>
  )
}
