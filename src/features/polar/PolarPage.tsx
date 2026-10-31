import { useEffect, useMemo, useRef, useState } from 'react'
import { SegmentedControl } from '../../shared/ui/SegmentedControl'
import { RangeNumberField } from '../../shared/ui/RangeNumberField'
import { ChartHelpLink } from '../../shared/ui/ChartHelpLink'
import { SiteHeader } from '../../components/SiteHeader'
import { SiteFooter } from '../../components/SiteFooter'
import { InteractiveLineChart, type InteractiveLineChartHandle } from '../../shared/charts/InteractiveLineChart'
import { PolarSailMap, type PolarSailMapHandle } from '../../shared/charts/PolarSailMap'
import { toInteractiveChart, usePolarCalculations } from './engine/usePolarCalculations'
import { usePolarSailMap } from './engine/usePolarSailMap'
import type { CalculatedChart, PolarSailMapData } from './engine/polarTypes'
import { ExpertPolarPanel } from './ExpertPolarPanel'
import { SailingCommandBar } from './SailingCommandBar'
import { readPageSessionState, savePageSessionState } from '../../shared/storage/pageSessionState'
import {
  boats,
  getNormalCharts,
  localizePolarText,
  polarUnit,
  sails,
  type ChartLayout,
  type PolarLevel,
  type PolarOptions,
  type SailId,
} from './polarModel'

const helpTopics = ['polar-speed-twa', 'polar-speed-tws', 'polar-bvmg', 'polar-vmg', 'polar-best-speed', 'polar-vspd', 'polar-sails'] as const

type PolarPageProps = {
  embedded?: boolean
  locale: 'fr' | 'en'
  onBackHome: () => void
  onLocaleChange: (locale: 'fr' | 'en') => void
  onThemeChange: (theme: 'dark' | 'light') => void
  theme: 'dark' | 'light'
}

type ChartCondition = {
  id: string
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  unit: string
  value: number
}

type PolarPageSession = {
  boat: (typeof boats)[number]
  expertDisplay: { auto: boolean; foils: boolean; sails: boolean }
  focus: number
  layout: ChartLayout
  level: PolarLevel
  options: PolarOptions
  selectedSails: SailId[]
  twa: number
  tws: number
}

function ChartCard({
  active,
  chart,
  condition,
  embedded,
  error,
  index,
  idSuffix = '',
  isFocusMode,
  locale,
  onSelect,
  progress,
  sailMap,
  showLayoutAction = true,
  theme,
  title,
}: {
  active: boolean
  chart?: CalculatedChart
  condition?: ChartCondition
  embedded: boolean
  error?: string
  index: number
  idSuffix?: string
  isFocusMode: boolean
  locale: 'fr' | 'en'
  onSelect: () => void
  progress: number
  sailMap?: PolarSailMapData
  showLayoutAction?: boolean
  theme: 'dark' | 'light'
  title: string
}) {
  const chartRef = useRef<InteractiveLineChartHandle>(null)
  const sailMapRef = useRef<PolarSailMapHandle>(null)
  const interactiveChart = useMemo(() => chart ? toInteractiveChart(chart, locale) : undefined, [chart, locale])
  const fr = locale === 'fr'

  return (
    <article className={`chart-card${active ? ' is-active' : ''}`} id={`polar-chart-${index}${idSuffix}`}>
      <div className="chart-card-heading">
        <div>
          <h3>{title}</h3>
        </div>
        <div className="chart-card-actions">
          {condition && <div className="chart-condition"><RangeNumberField {...condition} /></div>}
          <div className="chart-actions">
            <button aria-label={fr ? `Réinitialiser le zoom et le déplacement de ${title}` : `Reset zoom and pan for ${title}`} className="icon-button chart-reset-button" onClick={() => { chartRef.current?.resetView(); sailMapRef.current?.resetView() }} title={fr ? 'Réinitialiser le zoom' : 'Reset zoom'} type="button">↺</button>
            {showLayoutAction && <button className="icon-button" onClick={onSelect} type="button">
              <span className="sr-only">{isFocusMode ? (fr ? 'Revenir à la grille' : 'Return to grid') : (fr ? `Afficher ${title} en focus` : `Show ${title} in focus`)}</span>
              <span aria-hidden="true">{isFocusMode ? '⊞' : '↗'}</span>
            </button>}
            <ChartHelpLink embedded={embedded} locale={locale} theme={theme} topic={helpTopics[index]} />
          </div>
        </div>
      </div>
      <div className="chart-placeholder" aria-label={fr ? `Zone de tracé : ${title}` : `Plot area: ${title}`}>
        {sailMap ? <PolarSailMap data={sailMap} locale={locale} ref={sailMapRef} /> : interactiveChart ? <InteractiveLineChart {...interactiveChart} ref={chartRef} /> : (
          <div className="calculation-progress" role="status">
            <span>{error ? localizePolarText(error, locale) : (fr ? 'Calcul de la polaire en cours' : 'Calculating the polar')}</span>
            {!error && <>
              <strong>{progress}%</strong>
              <i aria-hidden="true"><b style={{ width: `${progress}%` }} /></i>
            </>}
          </div>
        )}
      </div>
    </article>
  )
}

export function PolarPage({ embedded = false, locale, onBackHome, onLocaleChange, onThemeChange, theme }: PolarPageProps) {
  const [savedState] = useState(() => readPageSessionState<PolarPageSession>('polar'))
  const [boat, setBoat] = useState<(typeof boats)[number]>(() => savedState.boat && boats.includes(savedState.boat) ? savedState.boat : 'Class 40 2021')
  const [level, setLevel] = useState<PolarLevel>(() => savedState.level === 'expert' ? 'expert' : 'normal')
  const [layout, setLayout] = useState<ChartLayout>(() => savedState.layout === 'focus' ? 'focus' : 'grid')
  const [focus, setFocus] = useState(() => savedState.focus ?? 0)
  const [scrollToChart, setScrollToChart] = useState<number | null>(() => savedState.layout === 'focus' && savedState.focus !== undefined ? savedState.focus : null)
  const [twa, setTwa] = useState(() => savedState.twa ?? 120)
  const [tws, setTws] = useState(() => savedState.tws ?? 18)
  const [options, setOptions] = useState<PolarOptions>(() => savedState.options ?? { foil: true, fullPack: true, hull: true })
  const [expertDisplay, setExpertDisplay] = useState(() => savedState.expertDisplay ?? { auto: true, foils: true, sails: true })
  const [selectedSails, setSelectedSails] = useState<Set<SailId>>(
    () => new Set(savedState.selectedSails ?? sails.map((sail) => sail.id)),
  )
  const changeLayout = (value: ChartLayout) => { setLayout(value) }

  useEffect(() => {
    savePageSessionState('polar', { boat, expertDisplay, focus, layout, level, options, selectedSails: Array.from(selectedSails), twa, tws })
  }, [boat, expertDisplay, focus, layout, level, options, selectedSails, twa, tws])

  const chartTitles = getNormalCharts(locale)
  const chartConditions: Array<ChartCondition | undefined> = [
    { id: 'tws', label: 'True Wind Speed', max: 40, min: 1, onChange: setTws, unit: polarUnit(locale), value: tws },
    { id: 'twa', label: 'True Wind Angle', max: 180, min: 0, onChange: setTwa, unit: '°', value: twa },
  ]
  const calculatedCharts = usePolarCalculations(boat, options, selectedSails, twa, tws)
  const sailMap = usePolarSailMap(boat, options, selectedSails)

  useEffect(() => {
    if (scrollToChart === null) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`polar-chart-${scrollToChart}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      setScrollToChart(null)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [layout, scrollToChart])

  function changeOption(option: keyof PolarOptions, checked: boolean) {
    if (option === 'fullPack') {
      setOptions({ foil: checked, fullPack: checked, hull: checked })
      setSelectedSails(checked ? new Set(sails.map((sail) => sail.id)) : new Set(['Jib', 'Spi']))
      return
    }

    setOptions((current) => ({
      ...current,
      [option]: checked,
      fullPack: checked && current.foil && current.hull,
    }))
  }

  function toggleSail(id: SailId, checked: boolean) {
    setSelectedSails((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
    setOptions((current) => ({ ...current, fullPack: false }))
  }

  function showFocus(index: number) {
    setFocus(index)
    setScrollToChart(index)
    changeLayout('focus')
  }

  function showGrid(index: number) {
    setFocus(index)
    setScrollToChart(index)
    changeLayout('grid')
  }

  function toggleExpertDisplay(key: keyof typeof expertDisplay) {
    setExpertDisplay((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className={`tool-page${embedded ? ' embedded-page' : ''}`} data-polar-level={level} id="polaire">
      <SiteHeader active="polaire" embedded={embedded} locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
      {embedded && <h1 className="sr-only">{locale === 'fr' ? 'Polaires' : 'Polars'}</h1>}
      <div className="polar-command-stack">
      {!embedded && <section className="page-heading">
        <div><h1>{locale === 'fr' ? 'Polaires' : 'Polars'}</h1></div>
        <p><button onClick={onBackHome} type="button">{locale === 'fr' ? 'Accueil' : 'Home'}</button><span>/</span> {locale === 'fr' ? 'Polaires' : 'Polars'}</p>
      </section>}

      <div className="polar-workspace polar-command-workspace">
        <SailingCommandBar
          boat={boat}
          embedded={embedded}
          locale={locale}
          extraModeControl={<SegmentedControl ariaLabel={locale === 'fr' ? 'Niveau de détail' : 'Detail level'} onChange={setLevel} options={[{ label: 'Normal', value: 'normal' }, { label: 'Expert', value: 'expert' }] as const} value={level} />}
          layout={layout}
          onBoatChange={setBoat}
          onLayoutChange={changeLayout}
          onOptionChange={changeOption}
          onSailChange={toggleSail}
          options={options}
          selectedSails={selectedSails}
        />

      </div>
      </div>

      <main className="polar-workspace polar-chart-workspace">
        {level === 'expert' && <section className={`expert-workspace${layout === 'focus' ? ' is-focus' : ''}`} aria-label={locale === 'fr' ? 'Analyse polaire experte' : 'Expert polar analysis'}>
          {layout === 'grid' && <div className="expert-curve-stack">
            {chartTitles.slice(0, 2).map((chart, index) => {
              const calculation = calculatedCharts[index]
              return <ChartCard
                active={false}
                chart={calculation?.chart}
                embedded={embedded}
                index={index}
                isFocusMode={false}
                locale={locale}
                key={index}
                onSelect={() => showFocus(index)}
                progress={calculation?.progress ?? 0}
                theme={theme}
                title={chart}
              />
            })}
          </div>}
          <ExpertPolarPanel boat={boat} display={expertDisplay} embedded={embedded} isFocusMode={layout === 'focus'} locale={locale} onDisplayChange={toggleExpertDisplay} onTwaChange={setTwa} onTwsChange={setTws} options={options} selectedSails={selectedSails} theme={theme} twa={twa} tws={tws} />
        </section>}
        <section className={`chart-workspace layout-${layout}`} aria-label={locale === 'fr' ? `Courbes ${level === 'normal' ? 'normales' : 'expertes'} de ${boat}` : `${level === 'normal' ? 'Standard' : 'Expert'} charts for ${boat}`}>
          <div className="chart-grid">
            {(level === 'expert' && layout === 'grid' ? chartTitles.slice(2) : chartTitles).map((chart, relativeIndex) => {
              const index = level === 'expert' && layout === 'grid' ? relativeIndex + 2 : relativeIndex
              const calculation = calculatedCharts[index]
              const isSailMap = index === chartTitles.length - 1
              return (
              <ChartCard
                active={layout === 'focus'}
                chart={!isSailMap ? calculation?.chart : undefined}
                condition={chartConditions[index]}
                embedded={embedded}
                error={isSailMap ? sailMap.error : calculation?.error}
                index={index}
                isFocusMode={layout === 'focus'}
                locale={locale}
                key={index}
                onSelect={() => layout === 'focus' ? showGrid(index) : showFocus(index)}
                progress={isSailMap ? sailMap.progress : calculation?.progress ?? 0}
                sailMap={isSailMap ? sailMap.data : undefined}
                theme={theme}
                title={chart}
              />
              )
            })}
          </div>
        </section>
      </main>

      {!embedded && <SiteFooter locale={locale} />}
    </div>
  )
}
