import { CircleCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { accountApi } from '../../api/endpoints'
import type { Account } from '../../api/types'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Field, Input } from '../../components/Field'
import { Switch } from '../../components/Switch'
import { useToast } from '../../components/Toast'
import { errorMessage } from './errorMessage'
import styles from './Settings.module.css'

type EmailAlertsSectionProps = {
  account: Account
  onChange: (account: Account) => void
}

export function EmailAlertsSection({ account, onChange }: EmailAlertsSectionProps) {
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)

  const run = async (action: () => Promise<void>, failureTitle: string) => {
    setBusy(true)
    try {
      await action()
    } catch (exception) {
      show({ tone: 'error', title: failureTitle, description: errorMessage(exception) })
    } finally {
      setBusy(false)
    }
  }

  const sendCode = (target: string) =>
    run(async () => {
      const sent = await accountApi.sendVerificationCode(target)
      onChange({ ...account, pendingNotificationEmail: sent.pendingNotificationEmail, emailDelivery: sent.emailDelivery })
      setEditing(false)
      setCode('')
      show({ tone: 'success', title: 'Verification code sent', description: `Check ${sent.pendingNotificationEmail} for a 6-digit code.` })
    }, 'Code not sent')

  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim() !== '') {
      void sendCode(email.trim())
    }
  }

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.length !== 6) {
      return
    }
    void run(async () => {
      onChange(await accountApi.verifyNotificationEmail(code))
      setCode('')
      setEmail('')
      show({ tone: 'success', title: 'Email verified', description: 'Low-score alerts will be sent to this address.' })
    }, 'Verification failed')
  }

  const toggle = (enabled: boolean) =>
    run(async () => {
      onChange(await accountApi.setNotificationsEnabled(enabled))
      show({ tone: 'success', title: enabled ? 'Alerts turned on' : 'Alerts turned off' })
    }, 'Alerts not updated')

  const remove = () =>
    run(async () => {
      onChange(await accountApi.removeNotificationEmail())
      setEditing(false)
      show({ tone: 'success', title: 'Alert email removed' })
    }, 'Email not removed')

  const pending = account.pendingNotificationEmail
  const verified = account.notificationEmail
  const showEmailForm = editing || (!pending && !verified)

  return (
    <Card className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Email alerts</h2>
        <p className={styles.sectionText}>
          We email you when a conversation scores below {account.alertThreshold}, so you can step in quickly.
        </p>
      </div>
      <div className={styles.stack}>
        {account.emailDelivery === 'LOG' && (
          <Alert tone="info" title="Email delivery isn't configured on the server yet">
            Verification codes and alerts are written to the server log until mail settings are added.
          </Alert>
        )}

        {verified && !editing && (
          <>
            <div className={styles.status}>
              <span className={styles.statusEmail}>
                <CircleCheck size={16} strokeWidth={2} className={styles.verified} aria-hidden="true" />
                {verified}
              </span>
              <div className={styles.actions}>
                <Button size="small" onClick={() => setEditing(true)} disabled={busy}>
                  Change
                </Button>
                <Button size="small" variant="danger" onClick={() => void remove()} disabled={busy}>
                  Remove
                </Button>
              </div>
            </div>
            <div className={styles.toggle}>
              <span>
                Send alerts
                <span className={styles.toggleText}> · score below {account.alertThreshold}</span>
              </span>
              <Switch
                checked={account.notificationsEnabled}
                onCheckedChange={(enabled) => void toggle(enabled)}
                disabled={busy}
                aria-label="Send low-score alerts"
              />
            </div>
          </>
        )}

        {pending && !editing && (
          <form className={styles.form} onSubmit={submitCode}>
            <p className={styles.sectionText}>
              Enter the 6-digit code we sent to <strong>{pending}</strong>. It expires in 10 minutes.
            </p>
            <Field label="Verification code">
              <Input
                className={styles.codeInput}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </Field>
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={busy || code.length !== 6}>
                Verify
              </Button>
              <Button onClick={() => void sendCode(pending)} disabled={busy}>
                Resend code
              </Button>
              <Button variant="ghost" onClick={() => setEditing(true)} disabled={busy}>
                Use another email
              </Button>
            </div>
          </form>
        )}

        {showEmailForm && (
          <form className={styles.form} onSubmit={submitEmail}>
            <Field label="Alert email" hint="We send a verification code to confirm the address.">
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={busy || email.trim() === ''}>
                Send code
              </Button>
              {(pending || verified) && (
                <Button variant="ghost" onClick={() => setEditing(false)} disabled={busy}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </Card>
  )
}
