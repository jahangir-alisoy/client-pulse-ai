import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import type { AnalysisRequestSummary } from '../../api/types'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { StatusBadge } from '../../components/StatusBadge'
import { formatTime, shortId } from '../../lib/format'
import styles from './Simulation.module.css'

type SessionPanelProps = {
  sessionId: string
  turnCount: number
  requests: AnalysisRequestSummary[]
  onNewSession: () => void
}

export function SessionPanel({ sessionId, turnCount, requests, onNewSession }: SessionPanelProps) {
  const latest = requests.find((request) => request.status === 'COMPLETED')

  return (
    <Card className={styles.panel}>
      <section className={styles.panelSection}>
        <div className={styles.panelHeading}>
          <span>Session</span>
          <Button size="small" onClick={onNewSession} disabled={turnCount === 0}>
            <Plus size={14} strokeWidth={1.75} />
            New
          </Button>
        </div>
        <span className={`${styles.sessionId} mono`} title={sessionId}>
          {shortId(sessionId)}
        </span>
        <p className={styles.sessionMeta}>
          {turnCount} {turnCount === 1 ? 'message' : 'messages'}
        </p>
      </section>
      <section className={styles.panelSection}>
        <div className={styles.panelHeading}>Latest score</div>
        {latest && latest.score !== null ? (
          <>
            <div className={styles.latest}>
              <span className={styles.latestValue}>{latest.score}</span>
              <span className={styles.latestScale}>/ 100</span>
            </div>
            {latest.description && <p className={styles.latestDescription}>{latest.description}</p>}
          </>
        ) : (
          <p className={styles.placeholder}>No score yet</p>
        )}
      </section>
      <section className={styles.panelSection}>
        <div className={styles.panelHeading}>Sent to Client Pulse</div>
        {requests.length === 0 ? (
          <p className={styles.placeholder}>Each reply is scored in the background. Results appear here.</p>
        ) : (
          <ul className={styles.results}>
            {requests.map((request) => (
              <li key={request.id}>
                <Link to={`/requests/${request.id}`} className={styles.result}>
                  <span className={styles.resultId}>
                    <span className="mono">#{request.id}</span> · {formatTime(request.createdAt)}
                  </span>
                  <StatusBadge status={request.status} />
                  <span className={`${styles.resultScore} tabular`}>{request.score ?? '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Card>
  )
}
