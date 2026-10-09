import styles from './Logo.module.css'

export function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M5 17h5l2.5-6 4 11 3-8 1.5 3H27"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.name}>Client Pulse</span>
    </span>
  )
}
