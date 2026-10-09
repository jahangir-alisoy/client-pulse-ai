import { ChevronDown, Plus } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { AnalysisRequestSummary } from '../../api/types'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { StatusBadge } from '../../components/StatusBadge'
import { formatTime, shortId } from '../../lib/format'
import styles from './Simulation.module.css'

type SessionPanelProps = {
  setup: ReactNode
  sessionId: string
  turnCount: number
  requests: AnalysisRequestSummary[]
  onNewSession: () => void
  summary?: string
}

export function SessionPanel({ setup, sessionId, turnCount, requests, onNewSession, summary }: SessionPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const bodyId = useId()
  const latest = requests.find((request) => request.status === 'COMPLETED')

  return (
    <Card className={`${styles.panel} ${expanded ? styles.panelExpanded : ''}`}>
      <button
        type="button"
        className={styles.panelToggle}
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className={styles.panelToggleText}>
          <span className={styles.panelToggleTitle}>Session setup</span>
          <span className={styles.panelToggleSummary}>{summary ?? `${turnCount} ${turnCount === 1 ? 'message' : 'messages'}`}</span>
        </span>
        {latest && latest.score !== null && (
          <span className={`${styles.panelToggleScore} tabular`} aria-label={`Latest score ${latest.score} out of 100`}>
            {latest.score}
          </span>
        )}
        <ChevronDown size={18} strokeWidth={1.75} className={styles.panelChevron} aria-hidden="true" />
      </button>
      <div id={bodyId} className={styles.panelBody}>
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
          {setup}
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
          <div className={styles.panelHeading}>Sent to Client Pulse AI</div>
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
      </div>
    </Card>
  )
}
