import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useId, useState } from 'react'
import type { ApiKey } from '../../api/types'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { CopyButton } from '../../components/CopyButton'
import { Modal } from '../../components/Modal'
import styles from './ApiKeys.module.css'

type SecretKeyModalProps = {
  apiKey: ApiKey
  secret: string
  rotated: boolean
  onClose: () => void
}

export function SecretKeyModal({ apiKey, secret, rotated, onClose }: SecretKeyModalProps) {
  const [revealed, setRevealed] = useState(false)
  const labelId = useId()
  const valueId = useId()

  return (
    <Modal
      open
      title="Save your secret key"
      description={
        rotated
          ? `“${apiKey.name}” has a new secret. The previous secret has stopped working.`
          : `“${apiKey.name}” is ready. Use this secret in the X-API-Key header.`
      }
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className={styles.secret}>
        <span id={labelId} className={styles.secretLabel}>
          Secret key
        </span>
        <div className={styles.secretRow}>
          <code
            id={valueId}
            className={`${styles.secretValue} ${revealed ? styles.secretRevealed : ''}`}
            aria-labelledby={labelId}
            translate="no"
          >
            {revealed ? secret : apiKey.maskedKey}
          </code>
          <div className={styles.secretActions}>
            <CopyButton value={secret} label="Copy key" accessibleLabel="Copy secret key" />
            <Button size="small" aria-pressed={revealed} aria-controls={valueId} onClick={() => setRevealed((current) => !current)}>
              {revealed ? <EyeOff size={14} strokeWidth={1.75} aria-hidden="true" /> : <Eye size={14} strokeWidth={1.75} aria-hidden="true" />}
              {revealed ? 'Hide' : 'Reveal'}
            </Button>
          </div>
        </div>
      </div>
      <Alert tone="warning" title="You won’t be able to see this key again" className={styles.secretWarning}>
        Store it somewhere safe, such as a password manager. If you lose it, rotate the key to get a new secret.
      </Alert>
      <p className={styles.secretNote}>
        <ShieldCheck size={14} strokeWidth={1.75} aria-hidden="true" />
        Client Pulse AI keeps only a SHA-256 hash of this key, so it cannot be shown later.
      </p>
    </Modal>
  )
}
