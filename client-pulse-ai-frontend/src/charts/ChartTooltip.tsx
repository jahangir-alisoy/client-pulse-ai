import styles from './Chart.module.css'

type ChartTooltipProps = {
  x: number
  y: number
  containerWidth: number
  value: string
  unit: string
  label: string
}

const EDGE = 72

export function ChartTooltip({ x, y, containerWidth, value, unit, label }: ChartTooltipProps) {
  const shift = x < EDGE ? '0%' : x > containerWidth - EDGE ? '-100%' : '-50%'
  return (
    <div className={styles.tooltip} style={{ left: x, top: y, transform: `translate(${shift}, calc(-100% - 10px))` }}>
      <div className={styles.tooltipValue}>
        <span className={styles.tooltipKey} />
        <span>
          <strong>{value}</strong> {unit}
        </span>
      </div>
      <div className={styles.tooltipLabel}>{label}</div>
    </div>
  )
}
