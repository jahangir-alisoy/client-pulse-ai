import { ChartColumn, KeyRound, List, LogOut, Menu, MessagesSquare, Settings, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { trapTabKey } from '../lib/focusable'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'
import { useMediaQuery } from '../lib/useMediaQuery'
import { Button } from './Button'
import { Logo } from './Logo'
import { ThemeSwitch } from './ThemeSwitch'
import styles from './AppShell.module.css'

const MOBILE_QUERY = '(max-width: 767px)'

const NAVIGATION = [
  {
    label: 'Workspace',
    items: [
      { to: '/overview', label: 'Overview', Icon: ChartColumn },
      { to: '/simulation', label: 'Simulation', Icon: MessagesSquare },
      { to: '/requests', label: 'Requests', Icon: List },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/api-keys', label: 'API keys', Icon: KeyRound },
      { to: '/settings', label: 'Settings', Icon: Settings },
    ],
  },
]

export function AppShell() {
  const { username, logout } = useAuth()
  const location = useLocation()
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const sidebar = useRef<HTMLElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const menuOpen = isMobile && menuOpenedAt === location.pathname
  const section = location.pathname.split('/')[1] ?? ''
  const initial = username?.charAt(0) ?? '?'

  const closeMenu = () => setMenuOpenedAt(null)

  useBodyScrollLock(menuOpen)

  useEffect(() => {
    const panel = sidebar.current
    if (!menuOpen || !panel) {
      return
    }
    closeButton.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpenedAt(null)
      } else {
        trapTabKey(event, panel)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      menuButton.current?.focus()
    }
  }, [menuOpen])

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <button
          ref={menuButton}
          type="button"
          className={styles.iconButton}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="app-navigation"
          onClick={() => setMenuOpenedAt(location.pathname)}
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
        <Link to="/overview" className={styles.topbarBrand}>
          <Logo />
        </Link>
        <Link to="/settings" className={styles.topbarAvatar} aria-label="Account settings" title={username ?? undefined}>
          {initial}
        </Link>
      </header>
      <div className={`${styles.backdrop} ${menuOpen ? styles.backdropVisible : ''}`} onClick={closeMenu} aria-hidden="true" />
      <aside
        ref={sidebar}
        id="app-navigation"
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}
        aria-label="Navigation"
        role={menuOpen ? 'dialog' : undefined}
        aria-modal={menuOpen || undefined}
      >
        <div className={styles.brand}>
          <Link to="/overview" className={styles.brandLink} onClick={closeMenu}>
            <Logo nameClassName={styles.brandName} />
          </Link>
          <button
            ref={closeButton}
            type="button"
            className={`${styles.iconButton} ${styles.closeButton}`}
            aria-label="Close navigation"
            onClick={closeMenu}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <nav className={styles.nav} aria-label="Main">
          {NAVIGATION.map((group) => (
            <div key={group.label} className={styles.group}>
              <span className={styles.groupLabel} id={`nav-${group.label}`}>
                {group.label}
              </span>
              <ul className={styles.list} aria-labelledby={`nav-${group.label}`}>
                {group.items.map(({ to, label, Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      aria-label={label}
                      className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                      onClick={closeMenu}
                    >
                      <Icon size={17} strokeWidth={1.75} className={styles.linkIcon} aria-hidden="true" />
                      <span className={styles.linkLabel}>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>Theme</span>
            <ThemeSwitch className={styles.themeSwitch} />
          </div>
          <div className={styles.account}>
            <span className={styles.avatar} aria-hidden="true">
              {initial}
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
          <div key={section} className={styles.page}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
