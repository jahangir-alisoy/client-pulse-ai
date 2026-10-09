import styles from './Logo.module.css'

export function Logo() {
    return (
        <span className={styles.logo}>
          <img src="/logo.png" alt="" className={styles.mark} />
          <span className={styles.name}>Client Pulse AI</span>
        </span>
    )
}
