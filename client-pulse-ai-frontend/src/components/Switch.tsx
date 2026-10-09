import type { ComponentProps } from 'react'
import styles from './Switch.module.css'

type SwitchProps = Omit<ComponentProps<'button'>, 'onChange' | 'role'> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`${styles.switch} ${checked ? styles.on : ''} ${className ?? ''}`}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  )
}
