import { ChartColumn, List, LogOut, MessagesSquare } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { Button } from './Button'
import { Logo } from './Logo'
import { ThemeSwitch } from './ThemeSwitch'
import styles from './AppShell.module.css'

const NAVIGATION = [
  { to: '/overview', label: 'Overview', Icon: ChartColumn },
  { to: '/simulation', label: 'Simulation', Icon: MessagesSquare },
  { to: '/requests', label: 'Requests', Icon: List },
]

export function AppShell() {
  const { username, logout } = useAuth()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo />
        </div>
        <nav className={styles.nav} aria-label="Main">
          {NAVIGATION.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>Theme</span>
            <ThemeSwitch />
          </div>
          <div className={styles.account}>
            <span className={styles.avatar} aria-hidden="true">
              {username?.charAt(0) ?? '?'}
            </span>
            <span className={styles.username} title={username ?? undefined}>
              {username}
            </span>
            <Button variant="ghost" size="small" iconOnly onClick={logout} aria-label="Sign out" title="Sign out">
              <LogOut size={15} strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
