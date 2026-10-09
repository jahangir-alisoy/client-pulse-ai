export type ChartDatum = {
  key: string
  label: string
  value: number | null
}

export const MARGIN = { top: 16, right: 12, bottom: 28, left: 36 }

export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) {
    return [0, 1]
  }
  const rough = max / count
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const residual = rough / magnitude
  const step = Math.max(1, (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude)
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, index) => index * step)
}

export function labelInterval(count: number, plotWidth: number, minSpacing = 52): number {
  const capacity = Math.max(1, Math.floor(plotWidth / minSpacing))
  return Math.max(1, Math.ceil(count / capacity))
}

export function roundedTopBar(x: number, y: number, width: number, baseline: number, radius = 4): string {
  const r = Math.min(radius, width / 2, baseline - y)
  return [
    `M${x},${baseline}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${baseline}`,
    'Z',
  ].join(' ')
}
