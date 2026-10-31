import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { InteractiveLineChartProps } from '../../../shared/charts/InteractiveLineChart'
import { localizePolarText, type SailId } from '../polarModel'
import { getSailName } from '../sailNames'
import { loadPolarData } from './polarData'
import type { CalculatedChart, PolarCalculationOptions, PolarTask, PolarWorkerMessage, PolarWorkerRequest } from './polarTypes'

export type PolarChartState = {
  chart?: CalculatedChart
  error?: string
  progress: number
}

const blankStates = (): PolarChartState[] => Array.from({ length: 6 }, () => ({ progress: 0 }))

function chartIndexes(task: PolarTask) {
  return task === 'twa' ? [0] : task === 'tws' ? [1] : [2, 3, 4, 5]
}

export function toInteractiveChart(chart: CalculatedChart, locale: 'fr' | 'en'): InteractiveLineChartProps {
  const xAxis = { ...chart.xAxis, label: localizePolarText(chart.xAxis.label, locale), unit: chart.xAxis.unit ? localizePolarText(chart.xAxis.unit, locale) : undefined }
  const yAxis = { ...chart.yAxis, label: localizePolarText(chart.yAxis.label, locale), unit: chart.yAxis.unit ? localizePolarText(chart.yAxis.unit, locale) : undefined }
  return {
    cursor: chart.cursor,
    series: chart.series.map(({ tooltips, ...series }) => ({
      ...series,
      label: localizePolarText(series.label, locale),
      segment: (index) => series.segments?.[index],
      tooltipColor: (index) => series.segments?.[index]?.color ?? series.color,
    })),
    tooltip: {
      label: (item) => {
        const tooltip = chart.series[item.datasetIndex]?.tooltips?.[item.dataIndex]
        return tooltip ? `${localizePolarText(tooltip.text, locale)} ${getSailName(tooltip.sail, locale)}`
          : `${item.dataset.label} : ${Number(item.parsed.y ?? 0).toFixed(1)} ${yAxis.unit ?? ''}`.trim()
      },
      title: (x) => `${xAxis.label} : ${x.toFixed(1)}${xAxis.unit ? ` ${xAxis.unit}` : ''}`,
    },
    xAxis,
    yAxis,
    zoom: 'x',
  }
}

function usePolarTask(
  task: PolarTask,
  boat: string,
  options: { foil: boolean; hull: boolean },
  sailKey: string,
  twa: number,
  tws: number,
  setCharts: Dispatch<SetStateAction<PolarChartState[]>>,
) {
  const requestId = useRef(0)
  const activeValue = task === 'twa' ? tws : task === 'tws' ? twa : undefined

  useEffect(() => {
    const activeRequest = ++requestId.current
    const affectedCharts = chartIndexes(task)
    let cancelled = false
    let worker: Worker | undefined
    const calculationOptions: PolarCalculationOptions = {
      foil: options.foil,
      hull: options.hull,
      sails: sailKey ? sailKey.split(',') as SailId[] : [],
    }

    setCharts((current) => current.map((chart, index) => affectedCharts.includes(index) ? { progress: 0 } : chart))

    void loadPolarData(boat as Parameters<typeof loadPolarData>[0])
      .then((polar) => {
        if (cancelled) return

        worker = new Worker(new URL('./polarCalculator.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = ({ data }: MessageEvent<PolarWorkerMessage>) => {
          if (cancelled || data.requestId !== activeRequest) return
          if (data.type === 'progress') {
            setCharts((current) => current.map((chart, index) => data.chartIndexes.includes(index)
              ? { ...chart, progress: data.percent }
              : chart))
            return
          }
          if (data.type === 'result') {
            setCharts((current) => {
              const next = [...current]
              data.charts.forEach(({ chart, index }) => {
                next[index] = { chart, progress: 100 }
              })
              return next
            })
            worker?.terminate()
            return
          }
          setCharts((current) => current.map((chart, index) => affectedCharts.includes(index)
            ? { ...chart, error: data.message }
            : chart))
          worker?.terminate()
        }
        worker.onerror = () => {
          if (cancelled) return
          setCharts((current) => current.map((chart, index) => affectedCharts.includes(index)
            ? { ...chart, error: 'Le calcul a échoué' }
            : chart))
          worker?.terminate()
        }
        worker.postMessage({ options: calculationOptions, polar, requestId: activeRequest, task, twa, tws } satisfies PolarWorkerRequest)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Chargement de la polaire impossible'
        setCharts((current) => current.map((chart, index) => affectedCharts.includes(index)
          ? { error: message, progress: 0 }
          : chart))
      })

    return () => {
      cancelled = true
      worker?.terminate()
    }
  }, [activeValue, boat, options.foil, options.hull, sailKey, setCharts, task])
}

export function usePolarCalculations(
  boat: string,
  options: { foil: boolean; hull: boolean },
  selectedSails: ReadonlySet<SailId>,
  twa: number,
  tws: number,
) {
  const [charts, setCharts] = useState<PolarChartState[]>(blankStates)
  const sailKey = Array.from(selectedSails).sort().join(',')

  usePolarTask('twa', boat, options, sailKey, twa, tws, setCharts)
  usePolarTask('tws', boat, options, sailKey, twa, tws, setCharts)
  usePolarTask('derived', boat, options, sailKey, twa, tws, setCharts)

  return charts
}
