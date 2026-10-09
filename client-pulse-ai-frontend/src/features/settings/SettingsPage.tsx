import { useEffect, useState } from 'react'
import { accountApi } from '../../api/endpoints'
import type { Account } from '../../api/types'
import { ErrorNotice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { Skeleton } from '../../components/Skeleton'
import { useAuth } from '../../auth/AuthContext'
import { useResource } from '../../lib/useResource'
import { AppearanceSection } from './AppearanceSection'
import { EmailAlertsSection } from './EmailAlertsSection'
import { PasswordSection } from './PasswordSection'
import { ProfileSection } from './ProfileSection'
import styles from './Settings.module.css'

export function SettingsPage() {
  const { username } = useAuth()
  const account = useResource(() => accountApi.get(), [username])
  const [current, setCurrent] = useState<Account | null>(null)

  useEffect(() => {
    if (account.data) {
      setCurrent(account.data)
    }
  }, [account.data])

  return (
    <>
      <PageHeader title="Settings" description="Manage your account, appearance and email alerts." />
      <div className={styles.sections}>
        <ProfileSection />
        <PasswordSection />
        <AppearanceSection />
        {account.error && <ErrorNotice message={account.error} />}
        {!current && !account.error && <Skeleton height={160} />}
        {current && <EmailAlertsSection account={current} onChange={setCurrent} />}
      </div>
    </>
  )
}
