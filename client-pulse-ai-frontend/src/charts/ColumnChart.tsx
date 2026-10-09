import { useState } from 'react'
import { formatCount } from '../lib/format'
import { useElementWidth } from '../lib/useElementWidth'
import { ChartTooltip } from './ChartTooltip'
import { labelInterval, MARGIN, niceTicks, roundedTopBar, type ChartDatum } from './scale'
import styles from './Chart.module.css'

type ColumnChartProps = {
  data: ChartDatum[]
  unit: string
  ariaLabel: string
  height?: number
}

const MAX_BAR_WIDTH = 24

export function ColumnChart({ data, unit, ariaLabel, height = 220 }: ColumnChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const values = data.map((datum) => datum.value ?? 0)
  const max = Math.max(0, ...values)
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]
  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotHeight = height - MARGIN.top - MARGIN.bottom
  const baseline = MARGIN.top + plotHeight
  const band = data.length > 0 ? plotWidth / data.length : 0
  const barWidth = Math.min(MAX_BAR_WIDTH, band * 0.6)
  const every = labelInterval(data.length, plotWidth)
  const peakIndex = max > 0 ? values.indexOf(max) : -1

  const yOf = (value: number) => baseline - (value / top) * plotHeight
  const centerOf = (index: number) => MARGIN.left + index * band + band / 2

  return (
    <div ref={ref} className={styles.chart} style={{ height }}>
      {width > 0 && (
        <svg className={styles.svg} width={width} height={height} role="img" aria-label={ariaLabel}>
          {ticks.map((tick) => (
            <g key={tick}>
              {tick > 0 && <line className={styles.grid} x1={MARGIN.left} x2={width - MARGIN.right} y1={yOf(tick)} y2={yOf(tick)} />}
              <text className={styles.tick} x={MARGIN.left - 8} y={yOf(tick)} dy="0.32em" textAnchor="end">
                {formatCount(tick)}
              </text>
            </g>
          ))}
          {data.map((datum, index) =>
            values[index] > 0 ? (
              <path
                key={datum.key}
                className={`${styles.bar} ${activeIndex === index ? styles.barActive : ''}`}
                d={roundedTopBar(centerOf(index) - barWidth / 2, yOf(values[index]), barWidth, baseline)}
              />
            ) : null,
          )}
          <line className={styles.baseline} x1={MARGIN.left} x2={width - MARGIN.right} y1={baseline} y2={baseline} />
          {data.map((datum, index) =>
            index % every === 0 ? (
              <text key={datum.key} className={styles.tick} x={centerOf(index)} y={height - 8} textAnchor="middle">
                {datum.label}
              </text>
            ) : null,
          )}
          {peakIndex >= 0 && activeIndex === null && (
            <text className={styles.directLabel} x={centerOf(peakIndex)} y={yOf(max) - 6} textAnchor="middle">
              {formatCount(max)}
            </text>
          )}
          {data.map((datum, index) => (
            <rect
              key={datum.key}
              className={styles.hit}
              x={MARGIN.left + index * band}
              y={MARGIN.top}
              width={band}
              height={plotHeight}
              tabIndex={0}
              aria-label={`${datum.label}: ${formatCount(values[index])} ${unit}`}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
          ))}
        </svg>
      )}
      {activeIndex !== null && (
        <ChartTooltip
          x={centerOf(activeIndex)}
          y={yOf(values[activeIndex])}
          containerWidth={width}
          value={formatCount(values[activeIndex])}
          unit={unit}
          label={data[activeIndex].label}
        />
      )}
    </div>
  )
}
