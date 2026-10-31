import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartType,
  type Plugin,
  type ScriptableLineSegmentContext,
  type TooltipItem,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'hammerjs'
import { useLocale, type Locale } from '../i18n/LocaleContext'

export type ChartPoint = { x: number; y: number | null }
export type CursorMode = 'none' | 'vertical' | 'horizontal' | 'cross'

export type LineSeries = {
  backgroundColor?: string
  color: string
  dash?: number[]
  fill?: boolean | number | string
  id: string
  label: string
  showInLegend?: boolean
  order?: number
  points: ChartPoint[]
  segment?: (index: number) => { color?: string; dash?: number[] } | undefined
  tooltipColor?: (index: number) => string
  width?: number
}

export type InteractiveLineChartProps = {
  cursor?: CursorMode
  height?: string
  series: readonly LineSeries[]
  tooltip?: {
    label?: (item: TooltipItem<'line'>) => string
    title?: (x: number) => string
  }
  xAxis: { label: string; unit?: string }
  yAxis: { label: string; tickFormat?: (value: number) => string; tickStep?: number; unit?: string }
  zoom?: 'x' | 'xy' | 'y' | false
}

export type InteractiveLineChartHandle = {
  resetView: () => void
}

type CursorPluginOptions = { mode: CursorMode }

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    itycCursor?: CursorPluginOptions
  }
}

const cursorPlugin: Plugin<'line', CursorPluginOptions> = {
  id: 'itycCursor',
  afterDraw(chart, _args, options) {
    if (!options || options.mode === 'none') return
    const active = chart.tooltip?.getActiveElements() ?? []
    const first = active[0]?.element
    if (!first) return

    const { bottom, left, right, top } = chart.chartArea
    const { ctx } = chart
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, .65)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    if (options.mode === 'vertical' || options.mode === 'cross') {
      ctx.beginPath()
      ctx.moveTo(first.x, top)
      ctx.lineTo(first.x, bottom)
      ctx.stroke()
    }
    if (options.mode === 'horizontal' || options.mode === 'cross') {
      ctx.beginPath()
      ctx.moveTo(left, first.y)
      ctx.lineTo(right, first.y)
      ctx.stroke()
    }
    ctx.restore()
  },
}

Chart.register(LineController, LineElement, LinearScale, PointElement, Tooltip, Legend, Filler, zoomPlugin, cursorPlugin)

function readThemeColor(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

function formatValue(value: number, unit?: string, locale: Locale = 'fr') {
  const number = Number(value).toFixed(2)
  return `${locale === 'fr' ? number.replace('.', ',') : number}${unit ? ` ${locale === 'en' && unit === 'nds' ? 'kts' : unit}` : ''}`
}

function getXBounds(series: readonly LineSeries[]) {
  const values = series.flatMap((line) => line.points.map((point) => point.x)).filter(Number.isFinite)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  return { max, min, minRange: Math.max(range / 250, .001) }
}

export const InteractiveLineChart = forwardRef<InteractiveLineChartHandle, InteractiveLineChartProps>(function InteractiveLineChart({
  cursor = 'vertical',
  height = '100%',
  series,
  tooltip,
  xAxis,
  yAxis,
  zoom = 'x',
}: InteractiveLineChartProps, ref) {
  const locale = useLocale()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart<'line'> | null>(null)
  const [themeVersion, setThemeVersion] = useState(0)

  useImperativeHandle(ref, () => ({
    resetView: () => chartRef.current?.resetZoom(),
  }), [])

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeVersion((version) => version + 1))
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'], attributes: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gridColor = readThemeColor('--line', 'rgba(255, 255, 255, .2)')
    const ink = readThemeColor('--muted', 'rgba(255, 255, 255, .75)')
    const xBounds = getXBounds(series)
    const datasets = series.map((line) => ({
      backgroundColor: line.backgroundColor,
      borderColor: line.color,
      borderDash: line.dash,
      data: line.points,
      fill: line.fill,
      label: line.label,
      order: line.order,
      parsing: false as const,
      pointRadius: 0,
      pointHitRadius: 10,
      borderWidth: line.width ?? 2.5,
      // La polaire est une table de points : on relie donc les mesures sans
      // interpolation Bézier, afin de rendre chaque segment fidèle aux données.
      tension: 0,
      segment: {
        borderColor: (context: ScriptableLineSegmentContext) => line.segment?.(context.p0DataIndex)?.color ?? line.color,
        borderDash: (context: ScriptableLineSegmentContext) => line.segment?.(context.p0DataIndex)?.dash ?? line.dash,
      },
    }))

    chartRef.current?.destroy()
    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: { datasets },
      options: {
        animation: false,
        maintainAspectRatio: false,
        normalized: true,
        parsing: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxHeight: 8,
              boxWidth: 18,
              color: ink,
              filter: (item) => item.datasetIndex === undefined || series[item.datasetIndex]?.showInLegend !== false,
              font: { size: 11, weight: 600 },
              usePointStyle: false,
            },
          },
          itycCursor: { mode: cursor },
          tooltip: {
            backgroundColor: 'rgba(25, 27, 30, .96)',
            borderColor: gridColor,
            borderWidth: 1,
            callbacks: {
              title: (items) => tooltip?.title?.(items[0]?.parsed.x ?? 0) ?? `${xAxis.label} : ${formatValue(items[0]?.parsed.x ?? 0, xAxis.unit, locale)}`,
              label: (item) => tooltip?.label?.(item) ?? `${item.dataset.label} : ${formatValue(item.parsed.y ?? 0, yAxis.unit, locale)}`,
              labelColor: (item) => {
                const color = series[item.datasetIndex]?.tooltipColor?.(item.dataIndex) ?? String(item.dataset.borderColor ?? '#ffffff')
                return { backgroundColor: color, borderColor: color, borderWidth: 1 }
              },
            },
          },
          zoom: zoom ? {
            limits: { x: xBounds },
            pan: { enabled: true, mode: zoom },
            zoom: {
              mode: zoom,
              pinch: { enabled: true },
              wheel: { enabled: true, speed: .05 },
            },
          } : undefined,
        },
        scales: {
          x: {
            grid: { color: gridColor },
            max: xBounds.max,
            min: xBounds.min,
            ticks: {
              color: ink,
              maxRotation: 0,
              callback: (value) => formatValue(Number(value), undefined, locale),
            },
            title: { color: ink, display: true, text: xAxis.unit ? `${xAxis.label} (${locale === 'en' && xAxis.unit === 'nds' ? 'kts' : xAxis.unit})` : xAxis.label },
            type: 'linear',
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: ink, callback: (value) => yAxis.tickFormat?.(Number(value)) ?? formatValue(Number(value), undefined, locale), stepSize: yAxis.tickStep },
            title: { color: ink, display: true, text: yAxis.unit ? `${yAxis.label} (${locale === 'en' && yAxis.unit === 'nds' ? 'kts' : yAxis.unit})` : yAxis.label },
            type: 'linear',
          },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [cursor, locale, series, themeVersion, tooltip, xAxis, yAxis, zoom])

  return <div className="interactive-line-chart" style={{ height }}><canvas ref={canvasRef} /></div>
})
