import { useState, type FormEvent } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Field, Input } from '../../components/Field'
import { useToast } from '../../components/Toast'
import { errorMessage } from './errorMessage'
import styles from './Settings.module.css'

const USERNAME_PATTERN = /^[A-Za-z0-9._-]{3,50}$/

export function ProfileSection() {
  const { username, changeUsername } = useAuth()
  const { show } = useToast()
  const [newUsername, setNewUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const invalid = newUsername !== '' && !USERNAME_PATTERN.test(newUsername)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (invalid || newUsername === '' || currentPassword === '') {
      return
    }
    setSaving(true)
    try {
      await changeUsername(newUsername, currentPassword)
      show({ tone: 'success', title: 'Username updated', description: `You are now signed in as ${newUsername}.` })
      setNewUsername('')
      setCurrentPassword('')
    } catch (exception) {
      show({ tone: 'error', title: 'Username not changed', description: errorMessage(exception) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <p className={styles.sectionText}>The username you use to sign in to the console.</p>
      </div>
      <p className={styles.current}>
        Signed in as <strong>{username}</strong>
      </p>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
          <Field label="New username" error={invalid ? '3–50 characters: letters, numbers, dot, dash or underscore.' : undefined}>
            <Input
              autoComplete="username"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value.trim())}
            />
          </Field>
          <Field label="Current password">
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </Field>
        </div>
        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={saving || invalid || newUsername === '' || currentPassword === ''}>
            {saving ? 'Saving…' : 'Change username'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
