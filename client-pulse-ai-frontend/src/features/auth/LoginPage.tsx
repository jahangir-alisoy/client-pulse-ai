import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/AuthContext'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Logo } from '../../components/Logo'
import { ErrorNotice } from '../../components/Notice'
import { ThemeSwitch } from '../../components/ThemeSwitch'
import styles from './LoginPage.module.css'

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
            <label className={styles.field}>
              <span className={styles.label}>Username</span>
              <input
                className={styles.input}
                name="username"
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <input
                className={styles.input}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && <ErrorNotice message={error} />}
            <Button type="submit" variant="primary" className={styles.submit} disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

function toLoginError(exception: unknown): string {
  if (exception instanceof ApiError && exception.status === 401) {
    return 'Incorrect username or password.'
  }
  return exception instanceof Error ? exception.message : 'Sign in failed.'
}
