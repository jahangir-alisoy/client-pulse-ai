import type { Channel } from '../api/types'
import { CHANNEL_LABELS, CHANNELS } from '../components/ChannelBadge'
import { useAnalysisFilter, type RangePreset } from './AnalysisFilterContext'
import styles from './FilterBar.module.css'

const PRESETS: { value: RangePreset; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom' },
]

export function FilterBar() {
  const { filter, setFilter } = useAnalysisFilter()

  return (
    <div className={styles.bar}>
      <div className={styles.segmented} role="radiogroup" aria-label="Date range">
        {PRESETS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={filter.range === value}
            className={`${styles.option} ${filter.range === value ? styles.selected : ''}`}
            onClick={() => setFilter({ range: value })}
          >
            {label}
          </button>
        ))}
      </div>
      {filter.range === 'custom' && (
        <div className={styles.dates}>
          <input
            type="date"
            className={styles.control}
            aria-label="From date"
            value={filter.from}
            max={filter.to || undefined}
            onChange={(event) => setFilter({ from: event.target.value })}
          />
          –
          <input
            type="date"
            className={styles.control}
            aria-label="To date"
            value={filter.to}
            min={filter.from || undefined}
            onChange={(event) => setFilter({ to: event.target.value })}
          />
        </div>
      )}
      <select
        className={styles.control}
        aria-label="Channel"
        value={filter.channel}
        onChange={(event) => setFilter({ channel: event.target.value as Channel | '' })}
      >
        <option value="">All channels</option>
        {CHANNELS.map((channel) => (
          <option key={channel} value={channel}>
            {CHANNEL_LABELS[channel]}
          </option>
        ))}
      </select>
    </div>
  )
}
