import { CircleCheck, CircleX, LoaderCircle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { analysisApi } from '../../api/endpoints'
import type { AnalysisStatistics } from '../../api/types'
import { ChartCard } from '../../charts/ChartCard'
import { ColumnChart } from '../../charts/ColumnChart'
import { LineChart } from '../../charts/LineChart'
import { Button, ButtonLink } from '../../components/Button'
import { Card } from '../../components/Card'
import { ErrorNotice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { formatCount, formatDay, formatScore } from '../../lib/format'
import { usePolling } from '../../lib/usePolling'
import { useResource } from '../../lib/useResource'
import { fillMissingDays } from './dailySeries'
import styles from './OverviewPage.module.css'

const SCORE_TICKS = [0, 25, 50, 75, 100]

export function OverviewPage() {
  const statistics = useResource(() => analysisApi.statistics(), [])
  const data = statistics.data
  usePolling(statistics.refresh, 4000, (data?.pendingRequests ?? 0) > 0)

  return (
    <>
      <PageHeader
        title="Overview"
        description="How satisfied clients are, based on every conversation Client Pulse has scored."
        actions={
          <Button onClick={() => void statistics.reload()} disabled={statistics.loading}>
            <RefreshCw size={14} strokeWidth={1.75} className={statistics.loading ? styles.spin : undefined} />
            Refresh
          </Button>
        }
      />
      {statistics.error && <ErrorNotice message={statistics.error} />}
      {!data && !statistics.error && <p className={styles.loading}>Loading…</p>}
      {data && (data.totalRequests === 0 ? <EmptyOverview /> : <Dashboard data={data} refreshing={statistics.loading} />)}
    </>
  )
}

function Dashboard({ data, refreshing }: { data: AnalysisStatistics; refreshing: boolean }) {
  const days = fillMissingDays(data.dailyStatistics)
  const requestsPerDay = days.map((day) => ({ key: day.date, label: formatDay(day.date), value: day.requestCount }))
  const scorePerDay = days.map((day) => ({ key: day.date, label: formatDay(day.date), value: day.averageScore }))
  const distribution = data.scoreDistribution.map((range) => ({
    key: String(range.from),
    label: `${range.from}–${range.to}`,
    value: range.count,
  }))

  return (
    <>
      <Card className={styles.summary}>
        <div className={styles.hero}>
          <span className={styles.label}>Average satisfaction</span>
          <div className={styles.heroValue}>
            <span className={styles.heroNumber}>{formatScore(data.averageScore)}</span>
            <span className={styles.heroScale}>/ 100</span>
          </div>
          <p className={styles.caption}>
            Across {formatCount(data.completedRequests)} scored {data.completedRequests === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
        <div className={styles.stats}>
          <Stat label="Total requests" value={data.totalRequests} />
          <Stat
            label="Completed"
            value={data.completedRequests}
            icon={<CircleCheck size={13} strokeWidth={2} className={styles.good} aria-hidden="true" />}
          />
          <Stat
            label="Failed"
            value={data.failedRequests}
            icon={<CircleX size={13} strokeWidth={2} className={styles.critical} aria-hidden="true" />}
          />
          <Stat
            label="Pending"
            value={data.pendingRequests}
            icon={<LoaderCircle size={13} strokeWidth={2} className={styles.muted} aria-hidden="true" />}
          />
        </div>
      </Card>
      <div className={styles.charts}>
        <ChartCard
          title="Requests per day"
          description="Conversation turns sent to Client Pulse"
          columns={['Day', 'Requests']}
          rows={requestsPerDay.map((day) => [day.label, formatCount(day.value)])}
          dimmed={refreshing}
        >
          <ColumnChart data={requestsPerDay} unit="requests" ariaLabel="Requests per day" />
        </ChartCard>
        <ChartCard
          title="Score distribution"
          description="Scored conversations by satisfaction range"
          columns={['Score range', 'Conversations']}
          rows={distribution.map((range) => [range.label, formatCount(range.value ?? 0)])}
          dimmed={refreshing}
        >
          <ColumnChart data={distribution} unit="conversations" ariaLabel="Score distribution" />
        </ChartCard>
        <div className={styles.wide}>
          <ChartCard
            title="Average score per day"
            description="Mean satisfaction score, 0 to 100"
            columns={['Day', 'Average score']}
            rows={scorePerDay.map((day) => [day.label, formatScore(day.value)])}
            dimmed={refreshing}
          >
            <LineChart data={scorePerDay} domain={[0, 100]} ticks={SCORE_TICKS} unit="average score" ariaLabel="Average score per day" />
          </ChartCard>
        </div>
      </div>
    </>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: ReactNode }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>
        {icon}
        {label}
      </span>
      <div className={styles.statValue}>{formatCount(value)}</div>
    </div>
  )
}

function EmptyOverview() {
  return (
    <Card className={styles.empty}>
      <h2 className={styles.emptyTitle}>No conversations scored yet</h2>
      <p className={styles.emptyText}>
        Start a conversation in Simulation. Each turn is sent to Client Pulse in the background, and the scores show up here.
      </p>
      <ButtonLink to="/simulation" variant="primary">
        Open simulation
      </ButtonLink>
    </Card>
  )
}
