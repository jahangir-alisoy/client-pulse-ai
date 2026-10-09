const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
})

const dayFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

const countFormat = new Intl.NumberFormat()

export function formatDateTime(iso: string | null): string {
  return iso ? dateTimeFormat.format(new Date(iso)) : '—'
}

export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso))
}

export function formatDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dayFormat.format(new Date(year, month - 1, day))
}

export function formatCount(value: number): string {
  return countFormat.format(value)
}

export function formatScore(value: number | null): string {
  return value === null ? '—' : String(Math.round(value * 10) / 10)
}

export function shortId(uuid: string): string {
  return uuid.slice(0, 8)
}
