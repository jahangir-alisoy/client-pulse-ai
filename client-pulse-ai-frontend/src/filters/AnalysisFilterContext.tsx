import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AnalysisQuery, Channel } from '../api/types'

export type RangePreset = '7d' | '30d' | '90d' | 'all' | 'custom'

export type AnalysisFilterState = {
  range: RangePreset
  from: string
  to: string
  channel: Channel | ''
}

type AnalysisFilterContextValue = {
  filter: AnalysisFilterState
  setFilter: (update: Partial<AnalysisFilterState>) => void
  query: AnalysisQuery
}

const PRESET_DAYS: Record<'7d' | '30d' | '90d', number> = { '7d': 7, '30d': 30, '90d': 90 }

const AnalysisFilterContext = createContext<AnalysisFilterContextValue | null>(null)

export function AnalysisFilterProvider({ children }: { children: ReactNode }) {
  const [filter, setState] = useState<AnalysisFilterState>({ range: '30d', from: '', to: '', channel: '' })

  const value = useMemo<AnalysisFilterContextValue>(
    () => ({
      filter,
      setFilter: (update) => setState((current) => ({ ...current, ...update })),
      query: toQuery(filter),
    }),
    [filter],
  )

  return <AnalysisFilterContext.Provider value={value}>{children}</AnalysisFilterContext.Provider>
}

export function useAnalysisFilter(): AnalysisFilterContextValue {
  const context = useContext(AnalysisFilterContext)
  if (!context) {
    throw new Error('useAnalysisFilter must be used inside AnalysisFilterProvider')
  }
  return context
}

function toQuery(filter: AnalysisFilterState): AnalysisQuery {
  const channel = filter.channel || undefined
  if (filter.range === 'all') {
    return { channel }
  }
  if (filter.range === 'custom') {
    return {
      from: filter.from ? startOfDay(filter.from).toISOString() : undefined,
      to: filter.to ? addDays(startOfDay(filter.to), 1).toISOString() : undefined,
      channel,
    }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return { from: addDays(today, 1 - PRESET_DAYS[filter.range]).toISOString(), channel }
}

function startOfDay(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
