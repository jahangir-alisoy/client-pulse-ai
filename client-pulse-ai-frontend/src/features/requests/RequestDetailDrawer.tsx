import { CircleAlert } from 'lucide-react'
import { useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { analysisApi } from '../../api/endpoints'
import type { AnalysisRequestDetail } from '../../api/types'
import { Drawer } from '../../components/Drawer'
import { ChannelBadge } from '../../components/ChannelBadge'
import { ErrorNotice } from '../../components/Notice'
import { CustomerInfo, SupportAgentInfo } from '../../components/People'
import { StatusBadge } from '../../components/StatusBadge'
import { formatDateTime, shortId } from '../../lib/format'
import { usePolling } from '../../lib/usePolling'
import { useResource } from '../../lib/useResource'
import styles from './Requests.module.css'

export function RequestDetailDrawer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const requestId = Number(id)
  const detail = useResource(() => analysisApi.get(requestId), [requestId])
  usePolling(detail.refresh, 2000, detail.data?.status === 'PENDING')

  const close = useCallback(() => {
    if (location.key === 'default') {
      navigate('/requests')
    } else {
      navigate(-1)
    }
  }, [location.key, navigate])

  return (
    <Drawer title={`Request #${id}`} onClose={close}>
      {detail.error && <ErrorNotice message={detail.error} />}
      {!detail.data && !detail.error && <p className={styles.loading}>Loading…</p>}
      {detail.data && <RequestDetail request={detail.data} />}
    </Drawer>
  )
}

function RequestDetail({ request }: { request: AnalysisRequestDetail }) {
  return (
    <>
      <div className={styles.summary}>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Status</span>
          <StatusBadge status={request.status} />
        </div>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Score</span>
          <div className={styles.score}>
            <span className={styles.scoreValue}>{request.score ?? '—'}</span>
            {request.score !== null && <span className={styles.scoreScale}>/ 100</span>}
          </div>
        </div>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Channel</span>
          <ChannelBadge channel={request.channel} />
        </div>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Customer</span>
          <CustomerInfo customer={request.customer} />
        </div>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Support assistant</span>
          <SupportAgentInfo supportAgent={request.supportAgent} />
        </div>
        <div className={styles.summaryCell}>
          <span className={styles.summaryLabel}>Session</span>
          <span className="mono" title={request.sessionId}>
            {shortId(request.sessionId)}
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Assessment</h3>
        <Assessment request={request} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>
        <dl className={styles.details}>
          <dt>Session ID</dt>
          <dd className="mono">{request.sessionId}</dd>
          <dt>Received</dt>
          <dd className="tabular">{formatDateTime(request.createdAt)}</dd>
          <dt>Analyzed</dt>
          <dd className="tabular">{formatDateTime(request.analyzedAt)}</dd>
          <dt>Duration</dt>
          <dd className="tabular">{formatDuration(request.createdAt, request.analyzedAt)}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Conversation · {request.messages.length} messages</h3>
        <div className={styles.transcript}>
          {request.messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${message.role === 'USER' ? styles.messageClient : ''}`}>
              <span className={styles.role}>
                {message.role === 'USER' ? request.customer?.fullName ?? 'Client' : request.supportAgent?.fullName ?? 'Assistant'}
              </span>
              <span className={styles.content}>{message.content}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Assessment({ request }: { request: AnalysisRequestDetail }) {
  if (request.status === 'PENDING') {
    return <p className={`${styles.paragraph} ${styles.muted}`}>Client Pulse is scoring this conversation…</p>
  }
  if (request.status === 'FAILED') {
    return (
      <p className={`${styles.paragraph} ${styles.failure}`}>
        <CircleAlert size={14} strokeWidth={2} className={styles.failureIcon} aria-hidden="true" />
        {request.failureReason ?? 'The analysis failed.'}
      </p>
    )
  }
  return <p className={styles.paragraph}>{request.description}</p>
}

function formatDuration(from: string, to: string | null): string {
  if (!to) {
    return '—'
  }
  const seconds = (new Date(to).getTime() - new Date(from).getTime()) / 1000
  return `${seconds.toFixed(1)} s`
}
