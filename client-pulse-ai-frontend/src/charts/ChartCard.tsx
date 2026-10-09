import { useState, type ReactNode } from 'react'
import { Card } from '../components/Card'
import styles from './ChartCard.module.css'

type ChartCardProps = {
  title: string
  description?: string
  columns: [string, string]
  rows: [string, string][]
  dimmed?: boolean
  emptyMessage?: string
  children: ReactNode
}

type View = 'chart' | 'table'

export function ChartCard({ title, description, columns, rows, dimmed = false, emptyMessage, children }: ChartCardProps) {
  const [view, setView] = useState<View>('chart')

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.toggle} role="tablist" aria-label={`${title} view`}>
          {(['chart', 'table'] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={view === option}
              className={`${styles.toggleOption} ${view === option ? styles.toggleSelected : ''}`}
              onClick={() => setView(option)}
            >
              {option === 'chart' ? 'Chart' : 'Table'}
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.body} ${dimmed ? styles.dimmed : ''}`}>
        {view === 'chart' ? (
          children
        ) : rows.length === 0 ? (
          <p className={styles.description}>{emptyMessage}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{columns[0]}</th>
                  <th scope="col">{columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
