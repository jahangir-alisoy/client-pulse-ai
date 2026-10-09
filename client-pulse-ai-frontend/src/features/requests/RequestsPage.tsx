import { ChevronLeft, ChevronRight, Inbox, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { analysisApi } from '../../api/endpoints'
import type { AnalysisRequestSummary, Page } from '../../api/types'
import { Button, ButtonLink } from '../../components/Button'
import { Card } from '../../components/Card'
import { ChannelBadge } from '../../components/ChannelBadge'
import { EmptyState } from '../../components/EmptyState'
import { Select } from '../../components/Field'
import { ErrorNotice } from '../../components/Notice'
import { CustomerInfo, SupportAgentInfo } from '../../components/People'
import { useAnalysisFilter } from '../../filters/AnalysisFilterContext'
import { FilterBar } from '../../filters/FilterBar'
import { PageHeader } from '../../components/PageHeader'
import { ScoreMeter } from '../../components/ScoreMeter'
import { Skeleton } from '../../components/Skeleton'
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
        description="Every conversation turn sent to Client Pulse AI, with the AI score and the reasoning behind it."
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
      {!requests.data && !requests.error && <RequestsSkeleton />}
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
  const open = (id: number) => navigate(`/requests/${id}`)

  return (
    <div className={styles.results}>
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
                <th scope="col" className={styles.assessmentHeading}>
                  Assessment
                </th>
                <th scope="col">Received</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((request) => (
                <tr key={request.id} onClick={() => open(request.id)}>
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
                    {assessmentText(request)}
                  </td>
                  <td className={`${styles.secondary} tabular`}>{formatDateTime(request.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className={`${styles.cards} ${dimmed ? styles.dimmed : ''}`}>
          {data.content.map((request) => (
            <li key={request.id} className={styles.requestCard} onClick={() => open(request.id)}>
              <div className={styles.cardTop}>
                <Link to={`/requests/${request.id}`} className={`${styles.idLink} mono`} onClick={(event) => event.stopPropagation()}>
                  #{request.id}
                </Link>
                <ChannelBadge channel={request.channel} />
                <span className={styles.cardStatus}>
                  <StatusBadge status={request.status} />
                </span>
              </div>
              <div className={styles.cardScore}>
                <ScoreMeter score={request.score} />
                <span className={`${styles.secondary} tabular`}>{formatDateTime(request.createdAt)}</span>
              </div>
              <p className={styles.cardAssessment}>{assessmentText(request)}</p>
              <dl className={styles.cardPeople}>
                <dt>Customer</dt>
                <dd>
                  <CustomerInfo customer={request.customer} />
                </dd>
                <dt>Assistant</dt>
                <dd>
                  <SupportAgentInfo supportAgent={request.supportAgent} />
                </dd>
              </dl>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <span className={`${styles.range} tabular`}>
            {formatCount(first)}–{formatCount(last)} of {formatCount(totalElements)}
          </span>
          <div className={styles.pager}>
            <Select className={styles.pageSize} aria-label="Rows per page" value={size} onChange={(event) => onSizeChange(Number(event.target.value))}>
              {PAGE_SIZES.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </Select>
            <span className={`${styles.pageNumber} tabular`}>
              Page {number + 1} of {Math.max(totalPages, 1)}
            </span>
            <div className={styles.pageButtons}>
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
        </div>
      </Card>
    </div>
  )
}

function assessmentText(request: AnalysisRequestSummary): string {
  return request.description ?? request.failureReason ?? (request.status === 'PENDING' ? 'Scoring…' : '—')
}

function RequestsSkeleton() {
  return (
    <Card className={styles.skeleton} aria-busy="true" aria-label="Loading requests">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index} className={styles.skeletonRow}>
          <Skeleton width={44} height={12} />
          <Skeleton width={72} height={12} />
          <Skeleton width="22%" height={12} />
          <Skeleton width="16%" height={12} className={styles.skeletonOptional} />
          <Skeleton width="28%" height={12} className={styles.skeletonOptional} />
        </div>
      ))}
    </Card>
  )
}

function EmptyRequests() {
  return (
    <EmptyState
      icon={<Inbox size={20} strokeWidth={1.75} />}
      title="No requests yet"
      description="Nothing matches the current filters. Conversations from Simulation appear here as soon as they are sent to Client Pulse AI."
      action={
        <ButtonLink to="/simulation" variant="primary">
          Open simulation
        </ButtonLink>
      }
    />
  )
}
