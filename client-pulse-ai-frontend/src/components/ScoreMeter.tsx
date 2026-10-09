import styles from './ScoreMeter.module.css'

export function ScoreMeter({ score }: { score: number | null }) {
  if (score === null) {
    return <span className={styles.empty}>—</span>
  }
  return (
    <span className={styles.meter}>
      <span className={styles.value}>{score}</span>
      <span className={styles.track} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label="Score">
        <span className={styles.fill} style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }} />
      </span>
    </span>
  )
}
