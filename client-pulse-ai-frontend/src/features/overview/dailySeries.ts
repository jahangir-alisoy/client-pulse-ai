import type { DailyStatistics } from '../../api/types'

const DAY_MS = 24 * 60 * 60 * 1000

export function fillMissingDays(days: DailyStatistics[]): DailyStatistics[] {
  if (days.length === 0) {
    return []
  }
  const byDate = new Map(days.map((day) => [day.date, day]))
  const first = toUtc(days[0].date)
  const last = toUtc(days[days.length - 1].date)
  const filled: DailyStatistics[] = []
  for (let time = first; time <= last; time += DAY_MS) {
    const date = new Date(time).toISOString().slice(0, 10)
    filled.push(byDate.get(date) ?? { date, requestCount: 0, averageScore: null })
  }
  return filled
}

function toUtc(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}
