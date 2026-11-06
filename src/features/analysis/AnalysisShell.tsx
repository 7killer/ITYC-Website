import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { SiteFooter } from '../../components/SiteFooter'
import { SiteHeader } from '../../components/SiteHeader'
import { InteractiveLineChart, type InteractiveLineChartHandle, type InteractiveLineChartProps } from '../../shared/charts/InteractiveLineChart'
import { SegmentedControl } from '../../shared/ui/SegmentedControl'
import { ChartHelpLink, type ChartHelpTopic } from '../../shared/ui/ChartHelpLink'
import { ChartActionIcon } from '../../shared/ui/ChartActionIcon'
import { ChartPrecisionButton } from '../../shared/ui/ChartPrecisionButton'
import type { ChartPrecision } from '../../shared/charts/chartPrecision'
import { boats, polarUpdatedAt, type ChartLayout } from '../polar/polarModel'

type PageProps = {
  active: 'penalites' | 'energie'
  embedded?: boolean
  boat: string
  children: ReactNode
  layout: ChartLayout
  locale: 'fr' | 'en'
  onBackHome: () => void
  onBoatChange: (boat: string) => void
  onLayoutChange: (layout: ChartLayout) => void
  onLocaleChange: (locale: 'fr' | 'en') => void
  onThemeChange: (theme: 'dark' | 'light') => void
  options: ReactNode
  theme: 'dark' | 'light'
  title: string
}

export function AnalysisShell({ active, boat, children, embedded = false, layout, locale, onBackHome, onBoatChange, onLayoutChange, onLocaleChange, onThemeChange, options, theme, title }: PageProps) {
  const commandStackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const fr = locale === 'fr'

  useLayoutEffect(() => {
    const updateAvailableHeight = () => {
      const content = contentRef.current
      if (!content) return
      const contentTop = content.getBoundingClientRect().top
      const availableHeight = Math.max(320, Math.floor(window.innerHeight - contentTop - 6))
      content.style.setProperty('--analysis-card-height', `${availableHeight}px`)
    }

    const frame = window.requestAnimationFrame(updateAvailableHeight)
    const observer = new ResizeObserver(updateAvailableHeight)
    if (commandStackRef.current) observer.observe(commandStackRef.current)
    window.addEventListener('resize', updateAvailableHeight)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', updateAvailableHeight)
    }
  }, [])

  return <div className={`tool-page analysis-page${embedded ? ' embedded-page' : ''}`}>
    <SiteHeader active={active} embedded={embedded} locale={locale} onLocaleChange={onLocaleChange} onThemeChange={onThemeChange} theme={theme} />
    {embedded && <h1 className="sr-only">{title}</h1>}
    {!embedded && <section className="page-heading"><h1>{title}</h1><p><button onClick={onBackHome} type="button">{fr ? 'Accueil' : 'Home'}</button><span>/</span><b>{title}</b></p></section>}
    <div className="analysis-command-stack" ref={commandStackRef}><div className="analysis-workspace analysis-toolbar">
      {embedded ? <span className="embedded-boat-name">{boat}</span> : <>
        <label className="boat-selector"><select aria-label={fr ? 'Bateau' : 'Boat'} onChange={(event) => onBoatChange(event.target.value)} value={boat}>{boats.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <p>{fr ? polarUpdatedAt : 'Updated: Tuesday 2 July 2024 20:33:41'}</p><a href="#aide">{fr ? 'Tutoriel' : 'Tutorial'}</a>
      </>}
      <SegmentedControl ariaLabel={fr ? "Mode d'affichage" : 'Display mode'} onChange={onLayoutChange} options={[{ label: fr ? 'Grille' : 'Grid', value: 'grid' }, { label: 'Focus', value: 'focus' }]} value={layout} />
      {!embedded && <div className="analysis-toolbar-options">{options}</div>}
    </div></div>
    <main className={`analysis-workspace analysis-content analysis-layout-${layout}`} ref={contentRef}>{children}</main>
    {!embedded && <SiteFooter locale={locale} />}
  </div>
}

type ToggleProps = { checked: boolean; label: string; onChange: (checked: boolean) => void }
export function AnalysisToggle({ checked, label, onChange }: ToggleProps) {
  return <label className="analysis-toggle"><input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" /><span aria-hidden="true" /><b>{label}</b></label>
}

type CardProps = {
  chart: InteractiveLineChartProps
  controls?: ReactNode
  embedded?: boolean
  focus: boolean
  helpTopic?: ChartHelpTopic
  index: number
  layout: ChartLayout
  locale?: 'fr' | 'en'
  onLayoutChange: (layout: ChartLayout) => void
  precision?: { value: ChartPrecision; onChange: (value: ChartPrecision) => void }
  settings?: ReactNode
  table?: ReactNode
  theme?: 'dark' | 'light'
  title: string
}
export function AnalysisCard({ chart, controls, embedded = false, focus, helpTopic, index, layout, locale = 'fr', onLayoutChange, precision, settings, table, theme = 'dark', title }: CardProps) {
  const chartRef = useRef<InteractiveLineChartHandle>(null)
  const resetLabel = locale === 'fr' ? `Réinitialiser le zoom de ${title}` : `Reset zoom for ${title}`
  const layoutLabel = layout === 'focus' ? (locale === 'fr' ? 'Revenir à la grille' : 'Back to grid') : (locale === 'fr' ? `Afficher ${title} en focus` : `Focus on ${title}`)
  function select() {
    if (layout === 'focus') { onLayoutChange('grid'); window.setTimeout(() => document.getElementById(`analysis-card-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); return }
    onLayoutChange('focus')
    window.setTimeout(() => document.getElementById(`analysis-card-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  return <section className={`analysis-card ${focus ? 'is-focus' : ''}`} id={`analysis-card-${index}`}>
    <div className="analysis-card-heading"><h2>{title}</h2><div className="analysis-card-actions chart-actions">{precision && <ChartPrecisionButton locale={locale} onChange={precision.onChange} value={precision.value} />}<button aria-label={resetLabel} className="icon-button" onClick={() => chartRef.current?.resetView()} type="button"><ChartActionIcon action="reset" /></button><button aria-label={layoutLabel} className="icon-button" onClick={select} type="button"><ChartActionIcon action={layout === 'focus' ? 'grid' : 'focus'} /></button>{helpTopic && <ChartHelpLink topic={helpTopic} locale={locale} theme={theme} embedded={embedded} />}</div></div>
    <div className="analysis-card-content">{settings ?? <div className="analysis-settings">{controls}{table}</div>}<div className="analysis-chart"><InteractiveLineChart {...chart} ref={chartRef} /></div></div>
  </section>
}

export const staminaByBoat: Record<string, number> = {
  'Cruiser Racer': 5, 'Class 40 2021': 0, 'Figaro 3': 0, 'OffShore Racer': 0, Imoca: 5, 'Mini 6.50': 0, Mod70: 5,
  'Ocean 50 (Multi 50)': 0, 'Volvo 65': 5, 'Super Maxi 100': 15, Tara: 50, 'Ultim (Crew)': 15, 'Ultim (Solo)': 15,
  'Ultim BP XI': 15, Olympus: 15, Caravelle: 50,
}

export const consumptionByStamina: Record<number, number> = { 0: 1, 5: 1.2, 15: 1.5, 50: 2 }
export function energyFactor(energy: number) { return Math.max(.5, 2 - energy * .015) }
export function windFactor(wind: number, jacket: boolean) {
  const values = jacket ? [[0, 1], [10, 1], [20, 1.2], [30, 1.8]] : [[0, 1], [10, 1.2], [20, 1.5], [30, 2]]
  const upper = values.find(([point]) => point >= wind) ?? values[values.length - 1]
  const lower = [...values].reverse().find(([point]) => point <= wind) ?? values[0]
  if (upper[0] === lower[0]) return upper[1]
  return lower[1] + ((wind - lower[0]) / (upper[0] - lower[0])) * (upper[1] - lower[1])
}
export function seconds(value: number) { const rounded = Math.round(value); return `${rounded} s` }
export function minutes(value: number) {
  const rounded = Math.round(value)
  const hours = Math.floor(rounded / 3600)
  const min = Math.floor((rounded % 3600) / 60)
  const sec = rounded % 60
  return `${hours ? `${hours} h ` : ''}${min} min${sec ? ` ${sec} s` : ''}`
}
export function knots(value: number, locale: 'fr' | 'en' = 'fr') { return `${locale === 'fr' ? value.toFixed(2).replace('.', ',') : value.toFixed(2)} nm` }
