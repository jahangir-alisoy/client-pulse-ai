import { EyeOff, Fingerprint, RefreshCw, ShieldCheck } from 'lucide-react'
import { Card } from '../../components/Card'
import styles from './ApiKeys.module.css'

const PRACTICES = [
  {
    Icon: Fingerprint,
    title: 'Stored as a hash',
    text: 'Only a SHA-256 hash of each key is saved. Nobody can read a key back, not even Client Pulse AI.',
  },
  {
    Icon: EyeOff,
    title: 'Shown once',
    text: 'The full secret appears only right after you create or rotate a key, and never in browser storage.',
  },
  {
    Icon: RefreshCw,
    title: 'Rotate in one step',
    text: 'Rotating issues a new secret and the old one stops working immediately.',
  },
  {
    Icon: ShieldCheck,
    title: 'Tied to your account',
    text: 'Conversations sent with a key are linked to you, so low-score alerts reach your email. Delete a key to cut off access at once.',
  },
]

export function KeySecurityCard() {
  return (
    <Card className={styles.security}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeading}>
          <h2 className={styles.cardTitle}>How your keys are protected</h2>
        </div>
      </div>
      <ul className={styles.practices}>
        {PRACTICES.map(({ Icon, title, text }) => (
          <li key={title} className={styles.practice}>
            <span className={styles.practiceIcon} aria-hidden="true">
              <Icon size={15} strokeWidth={1.75} />
            </span>
            <div className={styles.practiceText}>
              <h3 className={styles.practiceTitle}>{title}</h3>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
