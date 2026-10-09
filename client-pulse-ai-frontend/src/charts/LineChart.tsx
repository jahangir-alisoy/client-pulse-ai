import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import { formatScore } from '../lib/format'
import { useElementWidth } from '../lib/useElementWidth'
import { ChartTooltip } from './ChartTooltip'
import { labelInterval, MARGIN, type ChartDatum } from './scale'
import styles from './Chart.module.css'

type LineChartProps = {
  data: ChartDatum[]
  domain: [number, number]
  ticks: number[]
  unit: string
  ariaLabel: string
  height?: number
}

const END_LABEL_SPACE = 32
const DOT_THRESHOLD = 24

type Point = { index: number; x: number; y: number; value: number }

export function LineChart({ data, domain, ticks, unit, ariaLabel, height = 220 }: LineChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const right = MARGIN.right + END_LABEL_SPACE
  const plotWidth = Math.max(0, width - MARGIN.left - right)
  const plotHeight = height - MARGIN.top - MARGIN.bottom
  const baseline = MARGIN.top + plotHeight
  const [min, max] = domain
  const every = labelInterval(data.length, plotWidth)

  const xOf = (index: number) =>
    data.length === 1 ? MARGIN.left + plotWidth / 2 : MARGIN.left + (index / (data.length - 1)) * plotWidth
  const yOf = (value: number) => baseline - ((value - min) / (max - min)) * plotHeight

  const points: (Point | null)[] = data.map((datum, index) =>
    datum.value === null ? null : { index, x: xOf(index), y: yOf(datum.value), value: datum.value },
  )
  const segments = toSegments(points)
  const lastPoint = [...points].reverse().find((point): point is Point => point !== null)
  const visibleDots = data.length <= DOT_THRESHOLD ? points.filter((point): point is Point => point !== null) : lastPoint ? [lastPoint] : []
  const activePoint = activeIndex === null ? null : points[activeIndex]

  const nearestIndex = (pointerX: number) => {
    if (data.length <= 1) {
      return 0
    }
    const ratio = (pointerX - MARGIN.left) / plotWidth
    return Math.min(data.length - 1, Math.max(0, Math.round(ratio * (data.length - 1))))
  }

  const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect()
    if (bounds) {
      setActiveIndex(nearestIndex(event.clientX - bounds.left))
    }
  }

  const handleKeyDown = (event: KeyboardEvent<SVGRectElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step !== 0) {
      event.preventDefault()
      setActiveIndex((current) => Math.min(data.length - 1, Math.max(0, (current ?? data.length - 1) + step)))
    }
  }

  return (
    <div ref={ref} className={styles.chart} style={{ height }}>
      {width > 0 && (
        <svg className={styles.svg} width={width} height={height} role="img" aria-label={ariaLabel}>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className={tick === min ? styles.baseline : styles.grid}
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={yOf(tick)}
                y2={yOf(tick)}
              />
              <text className={styles.tick} x={MARGIN.left - 8} y={yOf(tick)} dy="0.32em" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          {data.map((datum, index) =>
            index % every === 0 ? (
              <text key={datum.key} className={styles.tick} x={xOf(index)} y={height - 8} textAnchor="middle">
                {datum.label}
              </text>
            ) : null,
          )}
          {activeIndex !== null && (
            <line className={styles.crosshair} x1={xOf(activeIndex)} x2={xOf(activeIndex)} y1={MARGIN.top} y2={baseline} />
          )}
          {segments.map((segment) => (
            <path key={segment[0].index} className={styles.line} d={segment.map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ')} />
          ))}
          {visibleDots.map((point) => (
            <circle key={point.index} className={styles.dot} cx={point.x} cy={point.y} r={4} />
          ))}
          {activePoint && <circle className={styles.dot} cx={activePoint.x} cy={activePoint.y} r={5} />}
          {lastPoint && activeIndex === null && (
            <text className={styles.directLabel} x={lastPoint.x + 10} y={lastPoint.y} dy="0.32em">
              {formatScore(lastPoint.value)}
            </text>
          )}
          <rect
            className={styles.hit}
            x={MARGIN.left - 8}
            y={MARGIN.top}
            width={plotWidth + 16}
            height={plotHeight}
            tabIndex={0}
            aria-label={`${ariaLabel}. Use arrow keys to read values.`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(data.length - 1)}
            onBlur={() => setActiveIndex(null)}
            onKeyDown={handleKeyDown}
          />
        </svg>
      )}
      {activeIndex !== null && (
        <ChartTooltip
          x={xOf(activeIndex)}
          y={activePoint ? activePoint.y : MARGIN.top + plotHeight / 2}
          containerWidth={width}
          value={activePoint ? formatScore(activePoint.value) : 'No data'}
          unit={activePoint ? unit : ''}
          label={data[activeIndex].label}
        />
      )}
    </div>
  )
}

function toSegments(points: (Point | null)[]): Point[][] {
  return points.reduce<Point[][]>((segments, point, index) => {
    if (point === null) {
      return segments
    }
    if (index > 0 && points[index - 1] !== null && segments.length > 0) {
      segments[segments.length - 1].push(point)
    } else {
      segments.push([point])
    }
    return segments
  }, [])
}
