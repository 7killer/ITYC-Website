export type ChartPrecision = '0.1' | '0.01'
export type ChartPrecisions = Partial<Record<number, ChartPrecision>>

export function readChartPrecision(value: unknown, fallback: ChartPrecision = '0.1'): ChartPrecision {
  return value === '0.1' || value === '0.01' ? value : fallback
}

/** Use integer sample indexes to avoid drift and stay within the chart domain. */
export function sampleChartRange(min: number, max: number, precision: ChartPrecision): number[] {
  const step = Number(precision)
  const count = Math.floor((max - min) / step + 1e-8)
  return Array.from({ length: Math.max(0, count + 1) }, (_, index) => Number((min + index * step).toFixed(4)))
}
