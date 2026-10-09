import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemePreference } from '../theme/ThemeContext'
import styles from './ThemeSwitch.module.css'

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System theme', Icon: Monitor },
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
]

type ThemeSwitchProps = {
  className?: string
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { preference, setPreference } = useTheme()

  return (
    <div className={`${styles.switch} ${className ?? ''}`} role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          aria-label={label}
          title={label}
          className={`${styles.option} ${preference === value ? styles.selected : ''}`}
          onClick={() => setPreference(value)}
        >
          <Icon size={14} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}
