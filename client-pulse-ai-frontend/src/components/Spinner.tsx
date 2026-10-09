import { LoaderCircle } from 'lucide-react'
import styles from './Spinner.module.css'

export function Spinner({ size = 14 }: { size?: number }) {
  return <LoaderCircle size={size} strokeWidth={2} className={styles.spinner} aria-hidden="true" />
}
