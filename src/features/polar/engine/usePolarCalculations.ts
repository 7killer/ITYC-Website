import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { InteractiveLineChartProps } from '../../../shared/charts/InteractiveLineChart'
import { readChartPrecision, type ChartPrecision, type ChartPrecisions } from '../../../shared/charts/chartPrecision'
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
      title: (x) => `${xAxis.label} : ${x.toFixed(chart.xAxis.label === 'True Wind Speed' ? 2 : 1)}${xAxis.unit ? ` ${xAxis.unit}` : ''}`,
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
  precision: ChartPrecision = '0.1',
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
        worker.postMessage({ options: calculationOptions, polar, precision, requestId: activeRequest, task, twa, tws } satisfies PolarWorkerRequest)
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
  }, [activeValue, boat, options.foil, options.hull, precision, sailKey, setCharts, task])
}

const derivedIndexes = [2, 3, 4, 5]
type DerivedCharts = Array<{ index: number; chart: CalculatedChart }>
type DerivedJob = { cancelled: boolean; progress: number; requestId: number; worker?: Worker }

/** Share the expensive angle search for equal precisions, while each card keeps
 * its own selection. Results at both steps are cached until boat/options change. */
function useDerivedCharts(
  boat: string,
  options: { foil: boolean; hull: boolean },
  sailKey: string,
  precisions: ChartPrecisions,
  setCharts: Dispatch<SetStateAction<PolarChartState[]>>,
) {
  const calculation = useRef({
    key: '',
    nextRequestId: 0,
    selections: new Map<number, ChartPrecision>(),
    jobs: new Map<ChartPrecision, DerivedJob>(),
    cache: new Map<ChartPrecision, DerivedCharts>(),
  })
  const precisionKey = derivedIndexes.map(index => readChartPrecision(precisions[index])).join(',')

  useEffect(() => {
    const current = calculation.current
    const key = JSON.stringify([boat, options.foil, options.hull, sailKey])
    if (current.key !== key) {
      for (const job of current.jobs.values()) { job.cancelled = true; job.worker?.terminate() }
      current.jobs.clear()
      current.cache.clear()
      current.key = key
    }
    const values = precisionKey.split(',') as ChartPrecision[]
    current.selections = new Map(derivedIndexes.map((index, position) => [index, values[position]]))
    const requested = new Set(values)
    for (const [precision, job] of current.jobs) {
      if (!requested.has(precision)) {
        job.cancelled = true
        job.worker?.terminate()
        current.jobs.delete(precision)
      }
    }

    const updateResult = (precision: ChartPrecision, results: DerivedCharts) => {
      setCharts(previous => {
        if (current.key !== key) return previous
        const next = [...previous]
        let changed = false
        for (const { chart, index } of results) {
          if (current.selections.get(index) !== precision) continue
          if (next[index].chart === chart && next[index].progress === 100) continue
          next[index] = { chart, progress: 100 }
          changed = true
        }
        return changed ? next : previous
      })
    }
    const updateProgress = (precision: ChartPrecision, progress: number, error?: string) => {
      setCharts(previous => current.key !== key ? previous : previous.map((chart, index) => current.selections.get(index) === precision
        ? { progress, ...(error ? { error } : {}) }
        : chart))
    }

    for (const precision of requested) {
      const cached = current.cache.get(precision)
      if (cached) { updateResult(precision, cached); continue }
      const running = current.jobs.get(precision)
      updateProgress(precision, running?.progress ?? 0)
      if (running) continue

      const job: DerivedJob = { cancelled: false, progress: 0, requestId: ++current.nextRequestId }
      current.jobs.set(precision, job)
      const active = () => !job.cancelled && current.key === key && current.jobs.get(precision) === job
      const fail = (message: string) => {
        if (!active()) return
        updateProgress(precision, 0, message)
        current.jobs.delete(precision)
        job.worker?.terminate()
      }
      void loadPolarData(boat as Parameters<typeof loadPolarData>[0])
        .then(polar => {
          if (!active()) return
          const worker = new Worker(new URL('./polarCalculator.worker.ts', import.meta.url), { type: 'module' })
          job.worker = worker
          worker.onmessage = ({ data }: MessageEvent<PolarWorkerMessage>) => {
            if (!active() || data.requestId !== job.requestId) return
            if (data.type === 'progress') {
              job.progress = data.percent
              updateProgress(precision, data.percent)
            } else if (data.type === 'result') {
              current.cache.set(precision, data.charts)
              current.jobs.delete(precision)
              updateResult(precision, data.charts)
              worker.terminate()
            } else fail(data.message)
          }
          worker.onerror = () => fail('Le calcul a échoué')
          worker.postMessage({
            options: { foil: options.foil, hull: options.hull, sails: sailKey ? sailKey.split(',') as SailId[] : [] },
            polar, precision, requestId: job.requestId, task: 'derived', twa: 0, tws: 0,
          } satisfies PolarWorkerRequest)
        })
        .catch((error: unknown) => fail(error instanceof Error ? error.message : 'Chargement de la polaire impossible'))
    }
  }, [boat, options.foil, options.hull, precisionKey, sailKey, setCharts])

  useEffect(() => () => {
    for (const job of calculation.current.jobs.values()) { job.cancelled = true; job.worker?.terminate() }
    calculation.current.jobs.clear()
  }, [])
}

export function usePolarCalculations(
  boat: string,
  options: { foil: boolean; hull: boolean },
  selectedSails: ReadonlySet<SailId>,
  twa: number,
  tws: number,
  precisions: ChartPrecisions = {},
) {
  const [charts, setCharts] = useState<PolarChartState[]>(blankStates)
  const sailKey = Array.from(selectedSails).sort().join(',')

  usePolarTask('twa', boat, options, sailKey, twa, tws, setCharts)
  usePolarTask('tws', boat, options, sailKey, twa, tws, setCharts, readChartPrecision(precisions[1]))
  useDerivedCharts(boat, options, sailKey, precisions, setCharts)

  return charts
}
