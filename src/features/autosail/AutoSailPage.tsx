import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { InteractiveLineChart, type InteractiveLineChartHandle, type InteractiveLineChartProps } from '../../shared/charts/InteractiveLineChart'
import { readChartPrecision, sampleChartRange, type ChartPrecision, type ChartPrecisions } from '../../shared/charts/chartPrecision'
import { RangeNumberField } from '../../shared/ui/RangeNumberField'
import { ChartHelpLink, type ChartHelpTopic } from '../../shared/ui/ChartHelpLink'
import { ChartActionIcon } from '../../shared/ui/ChartActionIcon'
import { ChartPrecisionButton } from '../../shared/ui/ChartPrecisionButton'
import { SailingCommandBar } from '../polar/SailingCommandBar'
import { readPageSessionState, savePageSessionState } from '../../shared/storage/pageSessionState'
import { boats, sails, type ChartLayout, type PolarOptions, type SailId } from '../polar/polarModel'
import { getSailName } from '../polar/sailNames'
import { getBestSpeed, polarLimit, sailColors } from '../polar/engine/polarMath'
import { loadPolarData } from '../polar/engine/polarData'
import type { PolarData } from '../polar/engine/polarTypes'
import '../../styles/autosail.css'

type AutoSailPageProps = {
  embedded?: boolean
  locale: 'fr' | 'en'
  onBackHome: () => void
  onLocaleChange: (locale: 'fr' | 'en') => void
  onThemeChange: (theme: 'dark' | 'light') => void
  theme: 'dark' | 'light'
}

type Axis = 'twa' | 'tws'
type Interval = { max: number; min: number }

type AutoSailPageSession = {
  boat: (typeof boats)[number]
  chartPrecisions: ChartPrecisions
  firstOverlapSail: SailId
  focus: number
  layout: ChartLayout
  options: PolarOptions
  overlapPrecision: ChartPrecision
  sailForRange: SailId
  sailForTwa: SailId
  sailForTws: SailId
  secondOverlapSail: SailId
  selectedSails: SailId[]
  twa: number
  twaEnd: number
  twaStart: number
  tws: number
  twsEnd: number
  twsStart: number
}

function format(value: number, locale: 'fr' | 'en', digits = 1) { return locale === 'fr' ? value.toFixed(digits).replace('.', ',') : value.toFixed(digits) }

function usePolarData(boat: string) {
  const [state, setState] = useState<{ data?: PolarData; error?: string }>({})
  useEffect(() => {
    let cancelled = false
    setState({})
    void loadPolarData(boat as Parameters<typeof loadPolarData>[0])
      .then((data) => { if (!cancelled) setState({ data }) })
      .catch(() => { if (!cancelled) setState({ error: 'Chargement des données polaires impossible.' }) })
    return () => { cancelled = true }
  }, [boat])
  return state
}

type ZoneState = { chart?: InteractiveLineChartProps; empty?: boolean; progress?: number }

function useSailZone(
  polar: PolarData | undefined,
  options: PolarOptions,
  selectedSails: ReadonlySet<SailId>,
  sail: SailId,
  locale: 'fr' | 'en',
  secondSail?: SailId,
  precision?: .01 | .1,
) {
  const [state, setState] = useState<ZoneState>({})
  useEffect(() => {
    if (!polar) return
    let cancelled = false
    const worker = new Worker(new URL('./autoSailZone.worker.ts', import.meta.url), { type: 'module' })
    setState({ progress: 0 })
    worker.onmessage = ({ data }) => {
      if (cancelled) return
      if (data.type === 'progress') setState({ progress: data.percent })
      if (data.type === 'result') setState({ chart: data.empty ? undefined : data.chart, empty: data.empty, progress: 100 })
    }
    worker.postMessage({ options, polar, precision, sails: Array.from(selectedSails), sail, secondSail })
    return () => { cancelled = true; worker.terminate() }
  }, [options, polar, precision, sail, secondSail, selectedSails])
  const chart = useMemo<InteractiveLineChartProps | undefined>(() => {
    if (!state.chart || !polar) return undefined
    const unit = locale === 'fr' ? 'nds' : 'kts'
    const calculationOptions = { foil: options.foil, hull: options.hull, sails: Array.from(selectedSails) }
    return {
      ...state.chart,
      series: state.chart.series.map((series, index) => ({ ...series, label: locale === 'fr' ? series.label : index === 0 ? 'Max TWA' : 'Min TWA' })),
      xAxis: { ...state.chart.xAxis, unit },
      tooltip: {
        title: (x) => `TWS : ${x.toFixed(2)} ${unit}`,
        label: ({ datasetIndex, parsed }) => {
          const angle = parsed.y ?? 0
          const { speed } = getBestSpeed(polar, angle, parsed.x ?? 0, calculationOptions)
          return `${datasetIndex === 0 ? 'Max TWA' : 'Min TWA'} : ${angle.toFixed(1)}° (${speed.toFixed(5)} ${unit})`
        },
      },
    }
  }, [locale, options.foil, options.hull, polar, selectedSails, state.chart])
  return { ...state, chart }
}

function getIntervals(values: Array<{ active: boolean; x: number }>) {
  const intervals: Interval[] = []
  let start: number | undefined
  let previous: number | undefined
  for (const value of values) {
    if (value.active && start === undefined) start = value.x
    if (!value.active && start !== undefined) { intervals.push({ min: start, max: previous ?? start }); start = undefined }
    previous = value.x
  }
  if (start !== undefined) intervals.push({ min: start, max: previous ?? start })
  return intervals
}

function buildAutoChart(
  polar: PolarData,
  options: PolarOptions,
  selectedSails: ReadonlySet<SailId>,
  axis: Axis,
  fixed: number,
  from: number,
  to: number,
  selectedSail: SailId,
  locale: 'fr' | 'en',
  precision: ChartPrecision = '0.1',
): { chart: InteractiveLineChartProps; intervals: Interval[] } {
  const unit = locale === 'fr' ? 'nds' : 'kts'
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  const samples = sampleChartRange(min, max, axis === 'tws' ? precision : '0.1').map((x) => {
    const twa = axis === 'tws' ? fixed : x
    const tws = axis === 'tws' ? x : fixed
    const result = getBestSpeed(polar, twa, tws, { foil: options.foil, hull: options.hull, sails: Array.from(selectedSails) })
    const selectedSpeed = result.all[selectedSail] ?? 0
    const active = selectedSpeed > 0 && selectedSpeed * (polar.autoSailChangeTolerance ?? 1.014) > result.speed
    const overlap = active && result.sail !== selectedSail
    return { active, best: result.sail, overlap, selectedSpeed, speed: result.speed, x }
  })
  const speedSeries = {
    color: sailColors[samples[0]?.overlap ? selectedSail : samples[0]?.best ?? selectedSail],
    id: 'auto',
    label: 'Auto',
    order: -1,
    points: samples.map(({ speed, x }) => ({ x, y: speed })),
    segment: (index: number) => {
      const sample = samples[index]
      return {
        color: sailColors[sample?.overlap ? selectedSail : sample?.best ?? selectedSail],
        dash: sample?.overlap ? [6, 6] : [2, 0],
      }
    },
    tooltipColor: (index: number) => {
      const sample = samples[index]
      return sailColors[sample?.overlap ? selectedSail : sample?.best ?? selectedSail]
    },
  }
  const overlapSeries = {
    color: sailColors[samples[0]?.best ?? selectedSail],
    id: 'theoretical',
    label: locale === 'fr' ? 'Theo' : 'Theoretical',
    order: 0,
    points: samples.map(({ speed, x }) => ({ x, y: speed })),
    segment: (index: number) => ({ color: sailColors[samples[index]?.best ?? selectedSail], dash: [2, 0] }),
    tooltipColor: (index: number) => sailColors[samples[index]?.best ?? selectedSail],
  }
  const theoreticalSailSeries = {
    color: `${sailColors[selectedSail]}99`,
    id: 'theoretical-sail',
    label: locale === 'fr' ? 'Manu' : 'Manual',
    order: 1,
    points: samples.map(({ selectedSpeed, x }) => ({ x, y: selectedSpeed })),
    tooltipColor: () => sailColors[selectedSail],
    width: 1,
  }
  return {
    chart: {
      cursor: 'vertical' as const,
      series: [speedSeries, overlapSeries, theoreticalSailSeries],
      tooltip: {
        title: (x) => `${axis === 'tws' ? 'TWS' : 'TWA'} : ${x.toFixed(2)}${axis === 'tws' ? ` ${unit}` : '°'}`,
        label: ({ dataIndex, datasetIndex, dataset }) => {
          const sample = samples[dataIndex]
          const speed = datasetIndex === 2 ? sample.selectedSpeed : sample.speed
          const sail = datasetIndex === 1 || (datasetIndex === 0 && !sample.overlap) ? sample.best : selectedSail
          const gain = datasetIndex === 0 && sample.overlap ? ` (+${(sample.speed - sample.selectedSpeed).toFixed(3)})` : ''
          return `${dataset.label} : ${speed.toFixed(3)}${gain} ${unit} ${getSailName(sail, locale)}`
        },
      },
      xAxis: { label: axis === 'tws' ? 'True Wind Speed' : 'True Wind Angle', unit: axis === 'tws' ? unit : '°' },
      yAxis: { label: locale === 'fr' ? 'Vitesse bateau' : 'Boat speed', unit },
      zoom: 'x' as const,
    },
    intervals: getIntervals(samples.map(({ active, x }) => ({ active, x }))),
  }
}

export function sailIsActive(
  polar: PolarData,
  options: PolarOptions,
  selectedSails: ReadonlySet<SailId>,
  sail: SailId,
  twa: number,
  tws: number,
) {
  const result = getBestSpeed(polar, twa, tws, { foil: options.foil, hull: options.hull, sails: Array.from(selectedSails) })
  const speed = result.all[sail] ?? 0
  return speed > 0 && speed * (polar.autoSailChangeTolerance ?? 1.014) > result.speed
}

export function buildUsageZoneChart(
  polar: PolarData,
  options: PolarOptions,
  selectedSails: ReadonlySet<SailId>,
  sail: SailId,
  secondSail?: SailId,
  locale: 'fr' | 'en' = 'fr',
): InteractiveLineChartProps {
  const lower: Array<{ x: number; y: number }> = []
  const upper: Array<{ x: number; y: number }> = []
  const minTwa = Math.max(0, Math.min(...polar.twa))
  const maxTwa = Math.min(180, Math.max(...polar.twa))
  const maxTws = polarLimit(polar, 'tws', 50)

  for (let tws = .1; tws <= maxTws; tws += .1) {
    const angles: number[] = []
    for (let twa = minTwa; twa <= maxTwa; twa += .1) {
      const active = sailIsActive(polar, options, selectedSails, sail, twa, tws)
      const alsoActive = secondSail ? sailIsActive(polar, options, selectedSails, secondSail, twa, tws) : true
      if (active && alsoActive) angles.push(twa)
    }
    if (angles.length) {
      lower.push({ x: tws, y: angles[0] })
      upper.push({ x: tws, y: angles[angles.length - 1] })
    }
  }

  const primaryColor = sailColors[sail]
  const secondaryColor = secondSail ? sailColors[secondSail] : primaryColor
  return {
    cursor: 'vertical',
    series: [
      { color: secondaryColor, id: 'upper', label: locale === 'fr' ? 'TWA maxi' : 'Max TWA', points: upper },
      { backgroundColor: `${primaryColor}33`, color: primaryColor, fill: '-1', id: 'lower', label: locale === 'fr' ? 'TWA mini' : 'Min TWA', points: lower },
    ],
    xAxis: { label: 'True Wind Speed', unit: locale === 'fr' ? 'nds' : 'kts' },
    yAxis: { label: 'True Wind Angle', unit: '°' },
    zoom: 'x',
  }
}

function AutoSailCard({
  actions,
  chart,
  controls,
  intervals,
  title,
  unit,
  showRanges = true,
  progress,
  index,
  locale,
  theme,
  embedded = false,
  helpTopic,
  isFocusMode,
  onSelect,
  rangeAxis,
  rangePrecision = '0.1',
  emptyMessage,
  empty = false,
}: {
  actions?: ReactNode
  chart?: InteractiveLineChartProps
  controls: ReactNode
  intervals: Interval[]
  title: string
  unit: string
  showRanges?: boolean
  progress?: number
  index: number
  locale: 'fr' | 'en'
  theme: 'dark' | 'light'
  embedded?: boolean
  helpTopic: ChartHelpTopic
  isFocusMode: boolean
  onSelect: () => void
  rangeAxis?: string
  rangePrecision?: ChartPrecision
  emptyMessage?: string
  empty?: boolean
}) {
  const chartRef = useRef<InteractiveLineChartHandle>(null)
  const fr = locale === 'fr'
  const resetLabel = fr ? `Réinitialiser le zoom de ${title}` : `Reset zoom for ${title}`
  const layoutLabel = isFocusMode ? (fr ? 'Revenir à la grille' : 'Back to grid') : (fr ? `Afficher ${title} en focus` : `Focus on ${title}`)
  const hasChartData = Boolean(chart?.series.some((series) => series.points.some((point) => point.y !== null && Number.isFinite(point.x) && Number.isFinite(point.y))))
  const showEmptyMessage = Boolean(emptyMessage && (empty || (progress === 100 && !hasChartData)))
  return <article className="autosail-card" id={`autosail-chart-${index}`}>
    <div className="autosail-card-heading">
      <h2>{title}</h2>
      <div className="autosail-card-actions chart-actions">
        {actions}
        <button aria-label={resetLabel} className="icon-button" onClick={() => chartRef.current?.resetView()} type="button"><ChartActionIcon action="reset" /></button>
        <button aria-label={layoutLabel} className="icon-button" onClick={onSelect} type="button"><ChartActionIcon action={isFocusMode ? 'grid' : 'focus'} /></button>
        <ChartHelpLink topic={helpTopic} locale={locale} theme={theme} embedded={embedded} />
      </div>
    </div>
    <div className="autosail-card-content">
      <div className="autosail-chart">{hasChartData && chart ? <InteractiveLineChart {...chart} ref={chartRef} /> : <p>{showEmptyMessage ? emptyMessage : (progress === undefined ? (fr ? 'Calcul de la courbe…' : 'Calculating chart…') : `${fr ? 'Calcul en cours' : 'Calculating'} : ${progress}%`)}</p>}</div>
      <aside className="autosail-settings">
        {controls}
        {showRanges && <section className="autosail-ranges"><h3>{fr ? 'Plage d’utilisation' : 'Usage range'}</h3>
          {intervals.length ? <table><thead><tr><th></th><th>{fr ? 'Mini' : 'Min'}</th><th>{fr ? 'Maxi' : 'Max'}</th></tr></thead><tbody>{intervals.map((interval) => <tr key={`${interval.min}-${interval.max}`}><td><i>{rangeAxis}</i></td><td>{format(interval.min, locale, rangePrecision === '0.01' ? 2 : 1)} {unit}</td><td>{format(interval.max, locale, rangePrecision === '0.01' ? 2 : 1)} {unit}</td></tr>)}</tbody></table> : <p>{fr ? 'Aucune plage utilisable.' : 'No usable range.'}</p>}
        </section>}
      </aside>
    </div>
  </article>
}

export function AutoSailPage({ embedded = false, locale, onBackHome, onLocaleChange, onThemeChange, theme }: AutoSailPageProps) {
  const fr = locale === 'fr'
  const unit = fr ? 'nds' : 'kts'
  const [savedState] = useState(() => readPageSessionState<AutoSailPageSession>('autosail'))
  const [boat, setBoat] = useState<(typeof boats)[number]>(() => savedState.boat && boats.includes(savedState.boat) ? savedState.boat : 'Class 40 2021')
  const [options, setOptions] = useState<PolarOptions>(() => savedState.options ?? { foil: true, fullPack: true, hull: true })
  const [selectedSails, setSelectedSails] = useState<Set<SailId>>(() => new Set(savedState.selectedSails ?? sails.map((sail) => sail.id)))
  const [twa, setTwa] = useState(() => savedState.twa ?? 120)
  const [tws, setTws] = useState(() => savedState.tws ?? 18)
  const [twsStart, setTwsStart] = useState(() => savedState.twsStart ?? 1)
  const [twsEnd, setTwsEnd] = useState(() => savedState.twsEnd ?? 40)
  const [twaStart, setTwaStart] = useState(() => savedState.twaStart ?? 0)
  const [twaEnd, setTwaEnd] = useState(() => savedState.twaEnd ?? 180)
  const defaultSail: SailId = embedded && !selectedSails.has('Code0') ? Array.from(selectedSails)[0] ?? 'Jib' : 'Code0'
  const defaultOverlapSail: SailId = embedded && defaultSail === 'Jib' && selectedSails.has('Spi') ? 'Spi' : 'Jib'
  const initialSail = (value: SailId | undefined, fallback: SailId) => value && (!embedded || selectedSails.has(value)) ? value : fallback
  const [sailForTwa, setSailForTwa] = useState<SailId>(() => initialSail(savedState.sailForTwa, defaultSail))
  const [sailForTws, setSailForTws] = useState<SailId>(() => initialSail(savedState.sailForTws, defaultSail))
  const [sailForRange, setSailForRange] = useState<SailId>(() => initialSail(savedState.sailForRange, defaultSail))
  const [firstOverlapSail, setFirstOverlapSail] = useState<SailId>(() => initialSail(savedState.firstOverlapSail, defaultSail))
  const [secondOverlapSail, setSecondOverlapSail] = useState<SailId>(() => initialSail(savedState.secondOverlapSail, defaultOverlapSail))
  const [overlapPrecision, setOverlapPrecision] = useState<ChartPrecision>(() => readChartPrecision(savedState.overlapPrecision))
  const [chartPrecisions, setChartPrecisions] = useState<ChartPrecisions>(() => ({
    0: readChartPrecision(savedState.chartPrecisions?.[0]),
    2: readChartPrecision(savedState.chartPrecisions?.[2]),
  }))
  const twaPrecision = readChartPrecision(chartPrecisions[0])
  const rangePrecision = readChartPrecision(chartPrecisions[2])
  const changePrecision = (index: number, value: ChartPrecision) => setChartPrecisions(current => ({ ...current, [index]: value }))
  const [layout, setLayout] = useState<ChartLayout>(() => savedState.layout === 'focus' ? 'focus' : 'grid')
  const [focus, setFocus] = useState(() => savedState.focus ?? 0)
  const [scrollToChart, setScrollToChart] = useState<number | null>(() => savedState.layout === 'focus' && savedState.focus !== undefined ? savedState.focus : null)
  const { data: polar, error } = usePolarData(boat)
  const changeLayout = (value: ChartLayout) => { setLayout(value) }

  useEffect(() => {
    savePageSessionState('autosail', { boat, chartPrecisions, firstOverlapSail, focus, layout, options, overlapPrecision, sailForRange, sailForTwa, sailForTws, secondOverlapSail, selectedSails: Array.from(selectedSails), twa, twaEnd, twaStart, tws, twsEnd, twsStart })
  }, [boat, chartPrecisions, firstOverlapSail, focus, layout, options, overlapPrecision, sailForRange, sailForTwa, sailForTws, secondOverlapSail, selectedSails, twa, twaEnd, twaStart, tws, twsEnd, twsStart])

  const twaChart = useMemo(() => polar ? buildAutoChart(polar, options, selectedSails, 'tws', twa, twsStart, twsEnd, sailForTwa, locale, twaPrecision) : undefined, [locale, options, polar, sailForTwa, selectedSails, twa, twsEnd, twsStart, twaPrecision])
  const twsChart = useMemo(() => polar ? buildAutoChart(polar, options, selectedSails, 'twa', tws, twaStart, twaEnd, sailForTws, locale) : undefined, [locale, options, polar, sailForTws, selectedSails, twaEnd, twaStart, tws])
  const rangeChart = useSailZone(polar, options, selectedSails, sailForRange, locale, undefined, Number(rangePrecision) as .01 | .1)
  const overlapChart = useSailZone(polar, options, selectedSails, firstOverlapSail, locale, secondOverlapSail, Number(overlapPrecision) as .01 | .1)

  useEffect(() => {
    if (scrollToChart === null) return
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`autosail-chart-${scrollToChart}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setScrollToChart(null)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [layout, scrollToChart])

  function showFocus(index: number) { setFocus(index); setScrollToChart(index); changeLayout('focus') }
  function showGrid(index: number) { setFocus(index); setScrollToChart(index); changeLayout('grid') }

  function toggleSail(id: SailId, checked: boolean) {
    setSelectedSails((current) => {
      const next = new Set(current)
      if (checked) next.add(id); else next.delete(id)
      return next
    })
    setOptions((current) => ({ ...current, fullPack: false }))
  }
  function changeOption(option: keyof PolarOptions, checked: boolean) {
    if (option === 'fullPack') {
      setOptions({ foil: checked, fullPack: checked, hull: checked })
      setSelectedSails(checked ? new Set(sails.map((sail) => sail.id)) : new Set(['Jib', 'Spi']))
      return
    }
    setOptions((current) => ({ ...current, [option]: checked, fullPack: checked && (option === 'foil' ? checked : current.foil) && (option === 'hull' ? checked : current.hull) }))
  }
  const sailSelect = (value: SailId, onChange: (sail: SailId) => void) => <select aria-label={fr ? 'Voile analysée' : 'Analyzed sail'} disabled={embedded && selectedSails.size === 0} onChange={(event) => onChange(event.target.value as SailId)} value={value}>{embedded && selectedSails.size === 0 && <option value={value}>{fr ? 'Aucune voile équipée' : 'No equipped sail'}</option>}{sails.filter((sail) => selectedSails.has(sail.id)).map((sail) => <option key={sail.id} value={sail.id}>{getSailName(sail.id, locale)}</option>)}</select>

  return <div className={`tool-page autosail-page${embedded ? ' embedded-page' : ''}`}>
    <SiteHeader active="autosail" embedded={embedded} locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
    {embedded && <h1 className="sr-only">{fr ? 'Voiles Automatiques' : 'Auto Sails'}</h1>}
    {!embedded && <section className="page-heading"><h1>{fr ? 'Voiles Automatiques' : 'Auto Sails'}</h1><p><button onClick={onBackHome} type="button">{fr ? 'Accueil' : 'Home'}</button><span>/</span><b>{fr ? 'Voiles Auto' : 'Auto Sails'}</b></p></section>}
    <div className="autosail-command-stack"><div className="autosail-workspace autosail-command-workspace">
      <SailingCommandBar boat={boat} embedded={embedded} layout={layout} onBoatChange={setBoat} onLayoutChange={changeLayout} onOptionChange={changeOption} onSailChange={toggleSail} options={options} selectedSails={selectedSails} />
    </div></div>
    <main className={`autosail-workspace autosail-content autosail-layout-${layout}`}>
      {error && <p className="autosail-error">{fr ? error : 'Unable to load polar data.'}</p>}
      <AutoSailCard actions={<ChartPrecisionButton label={fr ? 'Précision de la courbe TWA fixe' : 'Fixed TWA chart precision'} locale={locale} onChange={value => changePrecision(0, value)} value={twaPrecision} />} chart={twaChart?.chart} embedded={embedded} helpTopic="autosail-twa" index={0} intervals={twaChart?.intervals ?? []} isFocusMode={layout === 'focus'} locale={locale} theme={theme} onSelect={() => layout === 'focus' ? showGrid(0) : showFocus(0)} rangeAxis="TWS" rangePrecision={twaPrecision} title={fr ? 'Voile active · TWA fixe' : 'Active sail · fixed TWA'} unit={unit} controls={<>
        <label>{fr ? 'Voile' : 'Sail'}{sailSelect(sailForTwa, setSailForTwa)}</label>
        <RangeNumberField id="autosail-twa" label="True Wind Angle" shortLabel="TWA" max={180} min={0} onChange={setTwa} unit="°" value={twa} />
        <RangeNumberField id="autosail-tws-start" label={fr ? 'TWS début' : 'Start TWS'} max={50} min={.1} onChange={setTwsStart} unit={unit} value={twsStart} />
        <RangeNumberField id="autosail-tws-end" label={fr ? 'TWS fin' : 'End TWS'} max={50} min={.1} onChange={setTwsEnd} unit={unit} value={twsEnd} />
      </>} />
      <AutoSailCard chart={twsChart?.chart} embedded={embedded} helpTopic="autosail-tws" index={1} intervals={twsChart?.intervals ?? []} isFocusMode={layout === 'focus'} locale={locale} theme={theme} onSelect={() => layout === 'focus' ? showGrid(1) : showFocus(1)} rangeAxis="TWA" title={fr ? 'Voile active · TWS fixe' : 'Active sail · fixed TWS'} unit="°" controls={<>
        <label>{fr ? 'Voile' : 'Sail'}{sailSelect(sailForTws, setSailForTws)}</label>
        <RangeNumberField id="autosail-tws" label="True Wind Speed" shortLabel="TWS" max={50} min={.1} onChange={setTws} unit={unit} value={tws} />
        <RangeNumberField id="autosail-twa-start" label={fr ? 'TWA début' : 'Start TWA'} max={180} min={0} onChange={setTwaStart} unit="°" value={twaStart} />
        <RangeNumberField id="autosail-twa-end" label={fr ? 'TWA fin' : 'End TWA'} max={180} min={0} onChange={setTwaEnd} unit="°" value={twaEnd} />
      </>} />
      <AutoSailCard actions={<ChartPrecisionButton label={fr ? 'Précision de la zone d’utilisation' : 'Usage zone precision'} locale={locale} onChange={value => changePrecision(2, value)} value={rangePrecision} />} chart={rangeChart.chart} embedded={embedded} empty={rangeChart.empty} emptyMessage={fr ? 'Pas de zone d’utilisation.' : 'No usage zone.'} helpTopic="autosail-usage" index={2} intervals={[]} isFocusMode={layout === 'focus'} locale={locale} theme={theme} onSelect={() => layout === 'focus' ? showGrid(2) : showFocus(2)} progress={rangeChart.progress} showRanges={false} title={fr ? 'Zone d’utilisation' : 'Usage zone'} unit={unit} controls={<label>{fr ? 'Voile' : 'Sail'}{sailSelect(sailForRange, setSailForRange)}</label>} />
      <AutoSailCard actions={<ChartPrecisionButton label={fr ? 'Précision du recouvrement' : 'Overlap precision'} locale={locale} onChange={setOverlapPrecision} value={overlapPrecision} />} chart={overlapChart.chart} embedded={embedded} empty={overlapChart.empty} emptyMessage={fr ? 'Pas de zones de recouvrement.' : 'No overlap zone.'} helpTopic="autosail-overlap" index={3} intervals={[]} isFocusMode={layout === 'focus'} locale={locale} theme={theme} onSelect={() => layout === 'focus' ? showGrid(3) : showFocus(3)} progress={overlapChart.progress} showRanges={false} title={fr ? 'Zone de recouvrement' : 'Overlap zone'} unit={unit} controls={<>
        <label>{fr ? 'Première voile' : 'First sail'}{sailSelect(firstOverlapSail, setFirstOverlapSail)}</label>
        <label>{fr ? 'Seconde voile' : 'Second sail'}{sailSelect(secondOverlapSail, setSecondOverlapSail)}</label>
      </>} />
    </main>
    {!embedded && <SiteFooter locale={locale} />}
  </div>
}
