import { ChartColumn, CircleCheck, CircleX, LoaderCircle, RefreshCw, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { analysisApi } from '../../api/endpoints'
import type { AnalysisStatistics } from '../../api/types'
import { ChartCard } from '../../charts/ChartCard'
import { ColumnChart } from '../../charts/ColumnChart'
import { LineChart } from '../../charts/LineChart'
import { Button, ButtonLink } from '../../components/Button'
import { Card } from '../../components/Card'
import { CHANNEL_LABELS } from '../../components/ChannelBadge'
import { EmptyState } from '../../components/EmptyState'
import { ErrorNotice } from '../../components/Notice'
import { Skeleton } from '../../components/Skeleton'
import { useAnalysisFilter } from '../../filters/AnalysisFilterContext'
import { FilterBar } from '../../filters/FilterBar'
import { PageHeader } from '../../components/PageHeader'
import { formatCount, formatDay, formatScore } from '../../lib/format'
import { usePolling } from '../../lib/usePolling'
import { useResource } from '../../lib/useResource'
import { fillMissingDays } from './dailySeries'
import styles from './OverviewPage.module.css'

const SCORE_TICKS = [0, 25, 50, 75, 100]

export function OverviewPage() {
  const { query } = useAnalysisFilter()
  const statistics = useResource(() => analysisApi.statistics(query), [query])
  const data = statistics.data
  usePolling(statistics.refresh, 4000, (data?.pendingRequests ?? 0) > 0)

  return (
    <>
      <PageHeader
        title="Overview"
        description="How satisfied clients are, based on every conversation Client Pulse AI has scored."
        actions={
          <Button onClick={() => void statistics.reload()} disabled={statistics.loading}>
            <RefreshCw size={14} strokeWidth={1.75} className={statistics.loading ? styles.spin : undefined} />
            Refresh
          </Button>
        }
      />
      <FilterBar />
      {statistics.error && <ErrorNotice message={statistics.error} className={styles.error} />}
      {!data && !statistics.error && <OverviewSkeleton />}
      {data && (data.totalRequests === 0 ? <EmptyOverview filtered={query.from !== undefined || query.channel !== undefined} /> : <Dashboard data={data} refreshing={statistics.loading} />)}
    </>
  )
}

function Dashboard({ data, refreshing }: { data: AnalysisStatistics; refreshing: boolean }) {
  const days = fillMissingDays(data.dailyStatistics)
  const requestsPerDay = days.map((day) => ({ key: day.date, label: formatDay(day.date), value: day.requestCount }))
  const scorePerDay = days.map((day) => ({ key: day.date, label: formatDay(day.date), value: day.averageScore }))
  const byChannel = data.channelStatistics.map((entry) => ({
    key: entry.channel,
    label: CHANNEL_LABELS[entry.channel],
    count: entry.requestCount,
    averageScore: entry.averageScore,
  }))
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
          <span className={styles.heroTrack} aria-hidden="true">
            <span className={styles.heroFill} style={{ width: `${Math.min(Math.max(data.averageScore ?? 0, 0), 100)}%` }} />
          </span>
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
          description="Conversation turns sent to Client Pulse AI"
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
        <ChartCard
          title="Requests by channel"
          description="Conversations received per channel"
          columns={['Channel', 'Requests']}
          rows={byChannel.map((entry) => [entry.label, formatCount(entry.count)])}
          dimmed={refreshing}
        >
          <ColumnChart
            data={byChannel.map((entry) => ({ key: entry.key, label: entry.label, value: entry.count }))}
            unit="requests"
            ariaLabel="Requests by channel"
          />
        </ChartCard>
        <ChartCard
          title="Average score by channel"
          description="Mean satisfaction score per channel"
          columns={['Channel', 'Average score']}
          rows={byChannel.map((entry) => [entry.label, formatScore(entry.averageScore)])}
          dimmed={refreshing}
        >
          <ColumnChart
            data={byChannel.map((entry) => ({
              key: entry.key,
              label: entry.label,
              value: entry.averageScore === null ? null : Math.round(entry.averageScore * 10) / 10,
            }))}
            unit="average score"
            ariaLabel="Average score by channel"
          />
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

function OverviewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading statistics">
      <Card className={`${styles.summary} ${styles.skeletonSummary}`}>
        <div className={styles.hero}>
          <Skeleton width={128} height={12} />
          <Skeleton width={150} height={44} className={styles.skeletonGap} />
          <Skeleton width={190} height={12} className={styles.skeletonGap} />
        </div>
        <div className={styles.stats}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={styles.stat}>
              <Skeleton width={84} height={12} />
              <Skeleton width={56} height={26} className={styles.skeletonGap} />
            </div>
          ))}
        </div>
      </Card>
      <div className={styles.charts}>
        {[0, 1].map((index) => (
          <Card key={index} className={styles.skeletonChart}>
            <Skeleton width={140} height={14} />
            <Skeleton width={220} height={12} className={styles.skeletonGapSmall} />
            <Skeleton height={180} radius={6} className={styles.skeletonGap} />
          </Card>
        ))}
      </div>
    </div>
  )
}

function EmptyOverview({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <EmptyState
        icon={<SearchX size={20} strokeWidth={1.75} />}
        title="No conversations match these filters"
        description="Try a wider date range or another channel."
      />
    )
  }
  return (
    <EmptyState
      icon={<ChartColumn size={20} strokeWidth={1.75} />}
      title="No conversations scored yet"
      description="Start a conversation in Simulation. Each turn is sent to Client Pulse AI in the background, and the scores show up here."
      action={
        <ButtonLink to="/simulation" variant="primary">
          Open simulation
        </ButtonLink>
      }
    />
  )
}
