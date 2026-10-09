import { BellRing, Gauge, KeyRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Field, Input } from '../../components/Field'
import { Logo } from '../../components/Logo'
import { ErrorNotice } from '../../components/Notice'
import { ThemeSwitch } from '../../components/ThemeSwitch'
import styles from './LoginPage.module.css'

const HIGHLIGHTS = [
  { Icon: Gauge, text: 'Every conversation turn is scored in the background' },
  { Icon: BellRing, text: 'Email alerts for conversations that score below 20' },
  { Icon: KeyRound, text: 'Your systems send conversations with a secure API key' },
]

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const from = (location.state as { from?: string } | null)?.from ?? '/overview'

  if (isAuthenticated && !submitting) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (exception) {
      setError(toLoginError(exception))
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.showcase}>
        <Logo />
        <div className={styles.pitch}>
          <h2 className={styles.pitchTitle}>Know how every client conversation lands.</h2>
          <p className={styles.pitchText}>Client Pulse AI scores each support conversation from 0 to 100 and explains the reasoning behind it.</p>
          <ul className={styles.points}>
            {HIGHLIGHTS.map(({ Icon, text }) => (
              <li key={text} className={styles.point}>
                <span className={styles.pointIcon} aria-hidden="true">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.footnote}>Client Pulse AI · Customer satisfaction console</p>
      </aside>
      <main className={styles.formSide}>
        <div className={styles.themeSwitch}>
          <ThemeSwitch />
        </div>
        <div className={styles.column}>
          <div className={styles.brand}>
            <Logo />
          </div>
          <Card className={styles.card}>
            <h1 className={styles.title}>Sign in</h1>
            <p className={styles.subtitle}>Use your console account to continue.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Field label="Username">
                <Input
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoFocus
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </Field>
              <Field label="Password">
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
              {error && <ErrorNotice message={error} />}
              <Button type="submit" variant="primary" className={styles.submit} disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

function toLoginError(exception: unknown): string {
  if (exception instanceof ApiError && exception.status === 401) {
    return 'Incorrect username or password.'
  }
  return exception instanceof Error ? exception.message : 'Sign in failed.'
}
