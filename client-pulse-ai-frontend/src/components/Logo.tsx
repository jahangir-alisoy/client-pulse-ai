import styles from './Logo.module.css'

type LogoProps = {
  className?: string
  nameClassName?: string
}

export function Logo({ className, nameClassName }: LogoProps) {
  return (
    <span className={`${styles.logo} ${className ?? ''}`}>
      <img src="/logo.png" alt="" className={styles.mark} />
      <span className={`${styles.name} ${nameClassName ?? ''}`}>Client Pulse AI</span>
    </span>
  )
}
