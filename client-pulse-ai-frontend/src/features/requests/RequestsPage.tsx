import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { analysisApi } from '../../api/endpoints'
import type { AnalysisRequestSummary, Page } from '../../api/types'
import { Button, ButtonLink } from '../../components/Button'
import { Card } from '../../components/Card'
import { ChannelBadge } from '../../components/ChannelBadge'
import { ErrorNotice } from '../../components/Notice'
import { CustomerInfo, SupportAgentInfo } from '../../components/People'
import { useAnalysisFilter } from '../../filters/AnalysisFilterContext'
import { FilterBar } from '../../filters/FilterBar'
import { PageHeader } from '../../components/PageHeader'
import { ScoreMeter } from '../../components/ScoreMeter'
import { StatusBadge } from '../../components/StatusBadge'
import { formatCount, formatDateTime } from '../../lib/format'
import { usePolling } from '../../lib/usePolling'
import { useResource } from '../../lib/useResource'
import styles from './Requests.module.css'

const PAGE_SIZES = [10, 20, 50]

export function RequestsPage() {
  const { query } = useAnalysisFilter()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const requests = useResource(() => analysisApi.list(page, size, query), [page, size, query])

  useEffect(() => {
    setPage(0)
  }, [query])
  const hasPending = requests.data?.content.some((request) => request.status === 'PENDING') ?? false
  usePolling(requests.refresh, 3000, hasPending)

  return (
    <>
      <PageHeader
        title="Requests"
        description="Every conversation turn sent to Client Pulse, with the AI score and the reasoning behind it."
        actions={
          <>
            {hasPending && (
              <span className={styles.live}>
                <span className={styles.liveDot} />
                Updating
              </span>
            )}
            <Button onClick={() => void requests.reload()} disabled={requests.loading}>
              <RefreshCw size={14} strokeWidth={1.75} className={requests.loading ? styles.spin : undefined} />
              Refresh
            </Button>
          </>
        }
      />
      <FilterBar />
      {requests.error && <ErrorNotice message={requests.error} className={styles.error} />}
      {!requests.data && !requests.error && <p className={styles.loading}>Loading…</p>}
      {requests.data &&
        (requests.data.page.totalElements === 0 ? (
          <EmptyRequests />
        ) : (
          <RequestsTable
            data={requests.data}
            dimmed={requests.loading}
            onPageChange={setPage}
            onSizeChange={(nextSize) => {
              setSize(nextSize)
              setPage(0)
            }}
          />
        ))}
      <Outlet />
    </>
  )
}

type RequestsTableProps = {
  data: Page<AnalysisRequestSummary>
  dimmed: boolean
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

function RequestsTable({ data, dimmed, onPageChange, onSizeChange }: RequestsTableProps) {
  const navigate = useNavigate()
  const { number, size, totalElements, totalPages } = data.page
  const first = number * size + 1
  const last = number * size + data.content.length

  return (
    <Card className={styles.tableCard}>
      <div className={`${styles.scroll} ${dimmed ? styles.dimmed : ''}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Channel</th>
              <th scope="col">Customer</th>
              <th scope="col">Support assistant</th>
              <th scope="col">Status</th>
              <th scope="col">Score</th>
              <th scope="col">Assessment</th>
              <th scope="col">Received</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((request) => (
              <tr key={request.id} onClick={() => navigate(`/requests/${request.id}`)}>
                <td>
                  <Link to={`/requests/${request.id}`} className={`${styles.idLink} mono`} onClick={(event) => event.stopPropagation()}>
                    #{request.id}
                  </Link>
                </td>
                <td>
                  <ChannelBadge channel={request.channel} />
                </td>
                <td className={styles.person}>
                  <CustomerInfo customer={request.customer} />
                </td>
                <td className={styles.person}>
                  <SupportAgentInfo supportAgent={request.supportAgent} />
                </td>
                <td>
                  <StatusBadge status={request.status} />
                </td>
                <td>
                  <ScoreMeter score={request.score} />
                </td>
                <td className={styles.assessment} title={request.description ?? request.failureReason ?? undefined}>
                  {request.description ?? request.failureReason ?? (request.status === 'PENDING' ? 'Scoring…' : '—')}
                </td>
                <td className={`${styles.secondary} tabular`}>{formatDateTime(request.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <span className="tabular">
          {formatCount(first)}–{formatCount(last)} of {formatCount(totalElements)}
        </span>
        <div className={styles.pager}>
          <label>
            <span className="visually-hidden">Rows per page</span>
            <select className={styles.select} value={size} onChange={(event) => onSizeChange(Number(event.target.value))}>
              {PAGE_SIZES.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </label>
          <span className="tabular">
            Page {number + 1} of {Math.max(totalPages, 1)}
          </span>
          <Button size="small" iconOnly aria-label="Previous page" disabled={number === 0} onClick={() => onPageChange(number - 1)}>
            <ChevronLeft size={14} strokeWidth={1.75} />
          </Button>
          <Button
            size="small"
            iconOnly
            aria-label="Next page"
            disabled={number + 1 >= totalPages}
            onClick={() => onPageChange(number + 1)}
          >
            <ChevronRight size={14} strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function EmptyRequests() {
  return (
    <Card className={styles.empty}>
      <h2 className={styles.emptyTitle}>No requests yet</h2>
      <p className={styles.emptyText}>Nothing matches the current filters. Conversations from Simulation appear here as soon as they are sent to Client Pulse.</p>
      <ButtonLink to="/simulation" variant="primary">
        Open simulation
      </ButtonLink>
    </Card>
  )
}
