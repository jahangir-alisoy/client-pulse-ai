import { Check } from 'lucide-react'
import { Card } from '../../components/Card'
import { useTheme, type ThemePreference } from '../../theme/ThemeContext'
import styles from './Settings.module.css'

const OPTIONS: { value: ThemePreference; label: string; previewClass: string }[] = [
  { value: 'system', label: 'System', previewClass: styles.previewSystem },
  { value: 'light', label: 'Light', previewClass: styles.previewLight },
  { value: 'dark', label: 'Dark', previewClass: styles.previewDark },
]

export function AppearanceSection() {
  const { preference, setPreference } = useTheme()

  return (
    <Card className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <p className={styles.sectionText}>System follows your device setting.</p>
      </div>
      <div className={styles.themes} role="radiogroup" aria-label="Theme">
        {OPTIONS.map(({ value, label, previewClass }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={preference === value}
            className={`${styles.theme} ${preference === value ? styles.themeSelected : ''}`}
            onClick={() => setPreference(value)}
          >
            <span className={`${styles.preview} ${previewClass}`} aria-hidden="true">
              <span className={styles.previewSide} />
              <span className={styles.previewMain}>
                <span className={styles.previewLine} />
                <span className={styles.previewLine} />
                <span className={styles.previewLine} />
              </span>
            </span>
            <span className={styles.themeLabel}>
              {preference === value && <Check size={14} strokeWidth={2} aria-hidden="true" />}
              {label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
