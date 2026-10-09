import { useState, type FormEvent } from 'react'
import { accountApi } from '../../api/endpoints'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Field, Input } from '../../components/Field'
import { useToast } from '../../components/Toast'
import { errorMessage } from './errorMessage'
import styles from './Settings.module.css'

const MIN_LENGTH = 8

export function PasswordSection() {
  const { show } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saving, setSaving] = useState(false)
  const tooShort = newPassword !== '' && newPassword.length < MIN_LENGTH
  const mismatch = confirmation !== '' && confirmation !== newPassword
  const ready = currentPassword !== '' && newPassword.length >= MIN_LENGTH && confirmation === newPassword

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready) {
      return
    }
    setSaving(true)
    try {
      await accountApi.changePassword(currentPassword, newPassword)
      show({ tone: 'success', title: 'Password changed', description: 'Use your new password next time you sign in.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmation('')
    } catch (exception) {
      show({ tone: 'error', title: 'Password not changed', description: errorMessage(exception) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Password</h2>
        <p className={styles.sectionText}>Use at least {MIN_LENGTH} characters.</p>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <Field label="Current password">
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </Field>
        <div className={styles.row}>
          <Field label="New password" error={tooShort ? `At least ${MIN_LENGTH} characters.` : undefined}>
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </Field>
          <Field label="Confirm new password" error={mismatch ? 'Passwords do not match.' : undefined}>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </Field>
        </div>
        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={saving || !ready}>
            {saving ? 'Saving…' : 'Change password'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
