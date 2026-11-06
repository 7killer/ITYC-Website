import { useEffect, useMemo, useState } from 'react'
import { RangeNumberField } from '../../shared/ui/RangeNumberField'
import type { InteractiveLineChartProps } from '../../shared/charts/InteractiveLineChart'
import { readChartPrecision, sampleChartRange, type ChartPrecision, type ChartPrecisions } from '../../shared/charts/chartPrecision'
import { loadPolarData } from '../polar/engine/polarData'
import type { PolarData } from '../polar/engine/polarTypes'
import type { ChartLayout } from '../polar/polarModel'
import { AnalysisCard, AnalysisShell, AnalysisToggle, consumptionByStamina, energyFactor, knots, seconds, staminaByBoat, windFactor } from '../analysis/AnalysisShell'
import { readPageSessionState, savePageSessionState } from '../../shared/storage/pageSessionState'

type Props = { embedded?: boolean; locale: 'fr' | 'en'; onBackHome: () => void; onLocaleChange: (locale: 'fr' | 'en') => void; onThemeChange: (theme: 'dark' | 'light') => void; theme: 'dark' | 'light' }
type Penalties = { gybe: number; sail: number; tack: number }
type WinchData = { hws: number; lws: number; tack: { std: { hw: { timer: number }; lw: { timer: number } } }; gybe: { std: { hw: { timer: number }; lw: { timer: number } } }; sailChange: { std: { hw: { timer: number }; lw: { timer: number } } } }
type PenaltiesPageSession = { boat: string; chartPrecisions: ChartPrecisions; doubleEnergy: number; doubleSpeed: number; doubleWind: number; focus: number; fullPack: boolean; furler: boolean; jacket: boolean; layout: ChartLayout; rentEnergy: number; rentWind: number; simpleEnergy: number; simpleSpeed: number; simpleWind: number; winch: boolean; withSpeed: number; withoutSpeed: number }

function usePolar(boat: string) { const [polar, setPolar] = useState<PolarData>(); useEffect(() => { let live = true; void loadPolarData(boat as Parameters<typeof loadPolarData>[0]).then((data) => { if (live) setPolar(data) }); return () => { live = false } }, [boat]); return polar }
function interpolate(wind: number, lowWind: number, highWind: number, low: number, high: number) { if (wind <= lowWind) return low; if (wind >= highWind) return high; return low + (1 - Math.cos((wind - lowWind) / (highWind - lowWind) * Math.PI)) * .5 * (high - low) }
function penaltyAt(polar: PolarData | undefined, wind: number, furler: boolean): Penalties {
  const winch = (polar as (PolarData & { winch?: WinchData }) | undefined)?.winch
  if (!winch) return { gybe: 0, sail: 0, tack: 0 }
  const sailRatio = furler ? .8 : 1
  return {
    tack: interpolate(wind, winch.lws, winch.hws, winch.tack.std.lw.timer, winch.tack.std.hw.timer),
    gybe: interpolate(wind, winch.lws, winch.hws, winch.gybe.std.lw.timer, winch.gybe.std.hw.timer),
    sail: interpolate(wind, winch.lws, winch.hws, winch.sailChange.std.lw.timer * sailRatio, winch.sailChange.std.hw.timer * sailRatio),
  }
}
function sameManoeuvreCoefficients(polar: PolarData | undefined) {
  const winch = (polar as (PolarData & { winch?: WinchData }) | undefined)?.winch
  return Boolean(winch
    && winch.tack.std.lw.timer === winch.gybe.std.lw.timer
    && winch.tack.std.hw.timer === winch.gybe.std.hw.timer)
}
function lossAt(boat: string, wind: number, jacket: boolean, furler: boolean) { const factor = windFactor(wind, jacket) * (consumptionByStamina[staminaByBoat[boat] ?? 0] ?? 1); return { tack: 10 * factor, gybe: 10 * factor, sail: 20 * factor * (furler ? .8 : 1) } }
function chartFor(title: string, lines: Array<{ color: string; id: string; label: string; value: (wind: number) => number }>, locale: 'fr' | 'en', precision: ChartPrecision): InteractiveLineChartProps { const points = sampleChartRange(0, 35, precision); return { cursor: 'vertical', series: lines.map((line) => ({ ...line, points: points.map((x) => ({ x, y: line.value(x) })) })), tooltip: { label: (item) => `${item.dataset.label} : ${minuteSecondTime(item.parsed.y ?? 0)}` }, xAxis: { label: 'True Wind Speed', unit: locale === 'fr' ? 'nds' : 'kts' }, yAxis: { label: title, unit: 's' }, zoom: 'x' } }

type PenaltyResult = { name: string; time: number; energy: number; distance: number }
type ResultColumn = 'time' | 'energy' | 'distance'
function minuteSecondTime(value: number) { const rounded = Math.round(value); const hours = Math.floor(rounded / 3600); const min = Math.floor((rounded % 3600) / 60); const sec = rounded % 60; return `${hours ? `${hours} h ` : ''}${min} min${sec ? ` ${sec} s` : ''}` }
function PenaltyTimeValue({ value }: { value: number }) { return <span className="penalty-time-value"><strong>{seconds(value)}</strong><small>{minuteSecondTime(value)}</small></span> }
function PenaltyResultsTable({ columns, rows, variant, locale = 'fr' }: { columns: ResultColumn[]; rows: PenaltyResult[]; variant?: string; locale?: 'fr' | 'en' }) {
  const fr = locale === 'fr'
  const headings: Record<ResultColumn, string> = { time: fr ? 'Temps' : 'Time', energy: fr ? 'Énergie' : 'Energy', distance: 'Distance' }
  return <table className={`analysis-table penalty-results-table${columns.includes('time') ? ' penalty-has-time' : ''}${variant ? ` ${variant}` : ''}`}><thead><tr><th scope="col">{fr ? 'Manœuvre' : 'Maneuver'}</th>{columns.map((column) => <th key={column} scope="col">{headings[column]}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.name}><th scope="row">{row.name}</th>{columns.map((column) => <td key={column}>{column === 'time' ? <PenaltyTimeValue value={row.time} /> : column === 'energy' ? `-${fr ? row.energy.toFixed(1).replace('.', ',') : row.energy.toFixed(1)} %` : knots(row.distance, locale)}</td>)}</tr>)}</tbody></table>
}

export function PenaltiesPage(props: Props) {
  const { locale, theme, embedded } = props
  const fr = locale === 'fr'
  const unit = fr ? 'nds' : 'kts'
  const tack = fr ? 'Virement' : 'Tack'
  const gybe = fr ? 'Empannage' : 'Gybe'
  const combined = fr ? 'Virement / Empannage' : 'Tack / Gybe'
  const sail = fr ? 'Voile' : 'Sail change'
  const tackSail = fr ? 'Virement + voile' : 'Tack + sail change'
  const gybeSail = fr ? 'Empannage + voile' : 'Gybe + sail change'
  const combinedSail = fr ? 'Virement / Empannage + voile' : 'Tack / Gybe + sail change'
  const [savedState] = useState(() => readPageSessionState<PenaltiesPageSession>('penalties'))
  const [chartPrecisions, setChartPrecisions] = useState<ChartPrecisions>(() => ({
    0: readChartPrecision(savedState.chartPrecisions?.[0]),
    1: readChartPrecision(savedState.chartPrecisions?.[1]),
  }))
  const simplePrecision = readChartPrecision(chartPrecisions[0])
  const doublePrecision = readChartPrecision(chartPrecisions[1])
  const [boat, setBoat] = useState(() => savedState.boat ?? 'Class 40 2021'); const polar = usePolar(boat); const [layout, setLayout] = useState<ChartLayout>(() => savedState.layout === 'focus' ? 'focus' : 'grid'); const [focus, setFocus] = useState(() => savedState.focus ?? 0)
  const changeLayout = (value: ChartLayout) => { setLayout(value) }
  const [fullPack, setFullPack] = useState(() => savedState.fullPack ?? true); const [winch, setWinch] = useState(() => savedState.winch ?? true); const [furler, setFurler] = useState(() => savedState.furler ?? true); const [jacket, setJacket] = useState(() => savedState.jacket ?? true)
  const [simpleEnergy, setSimpleEnergy] = useState(() => savedState.simpleEnergy ?? 66.7); const [simpleWind, setSimpleWind] = useState(() => savedState.simpleWind ?? 10); const [simpleSpeed, setSimpleSpeed] = useState(() => savedState.simpleSpeed ?? 5)
  const [doubleEnergy, setDoubleEnergy] = useState(() => savedState.doubleEnergy ?? 66.7); const [doubleWind, setDoubleWind] = useState(() => savedState.doubleWind ?? 10); const [doubleSpeed, setDoubleSpeed] = useState(() => savedState.doubleSpeed ?? 5)
  const [rentEnergy, setRentEnergy] = useState(() => savedState.rentEnergy ?? 66.7); const [rentWind, setRentWind] = useState(() => savedState.rentWind ?? 10); const [withoutSpeed, setWithoutSpeed] = useState(() => savedState.withoutSpeed ?? 10); const [withSpeed, setWithSpeed] = useState(() => savedState.withSpeed ?? 12)
  useEffect(() => {
    savePageSessionState('penalties', { boat, chartPrecisions, doubleEnergy, doubleSpeed, doubleWind, focus, fullPack, furler, jacket, layout, rentEnergy, rentWind, simpleEnergy, simpleSpeed, simpleWind, winch, withSpeed, withoutSpeed })
  }, [boat, chartPrecisions, doubleEnergy, doubleSpeed, doubleWind, focus, fullPack, furler, jacket, layout, rentEnergy, rentWind, simpleEnergy, simpleSpeed, simpleWind, winch, withSpeed, withoutSpeed])
  const setPack = (value: boolean) => { setFullPack(value); setWinch(value); setFurler(value); setJacket(value) }
  const simpleChart = useMemo(() => { const same = sameManoeuvreCoefficients(polar); return chartFor(fr ? 'Temps' : 'Time', [
    { id: 'tack', label: same ? combined : tack, color: '#00a000', value: (wind) => penaltyAt(polar, wind, furler).tack * energyFactor(simpleEnergy) },
    ...(same ? [] : [{ id: 'gybe', label: gybe, color: '#1267e9', value: (wind: number) => penaltyAt(polar, wind, furler).gybe * energyFactor(simpleEnergy) }]),
    { id: 'sail', label: sail, color: '#e00000', value: (wind) => penaltyAt(polar, wind, furler).sail * energyFactor(simpleEnergy) },
  ], locale, simplePrecision) }, [furler, locale, polar, simpleEnergy, simplePrecision])
  const doubleChart = useMemo(() => { const same = sameManoeuvreCoefficients(polar); return chartFor(fr ? 'Temps' : 'Time', [
    { id: 'tack-sail', label: same ? combinedSail : tackSail, color: '#00a000', value: (wind) => Math.max(penaltyAt(polar, wind, furler).tack, penaltyAt(polar, wind, furler).sail) * energyFactor(doubleEnergy) },
    ...(same ? [] : [{ id: 'gybe-sail', label: gybeSail, color: '#1267e9', value: (wind: number) => Math.max(penaltyAt(polar, wind, furler).gybe, penaltyAt(polar, wind, furler).sail) * energyFactor(doubleEnergy) }]),
  ], locale, doublePrecision) }, [doubleEnergy, doublePrecision, furler, locale, polar])
  const rentPenalty = penaltyAt(polar, rentWind, furler).sail * energyFactor(rentEnergy)
  const rentability = useMemo(() => {
    const reducedSpeed = withSpeed * (winch ? .7 : .5)
    let catchUp = 0
    for (let time = 1; time <= 12 * 3600; time++) {
      const without = time * withoutSpeed / 3600
      const withChange = (Math.min(time, rentPenalty) * reducedSpeed + Math.max(0, time - rentPenalty) * withSpeed) / 3600
      if (withChange > without) { catchUp = time; break }
    }
    const duration = catchUp ? catchUp + 10 : 12 * 3600
    const points = Array.from({ length: duration + 1 }, (_, time) => ({
      time,
      without: time * withoutSpeed / 3600,
      withChange: (Math.min(time, rentPenalty) * reducedSpeed + Math.max(0, time - rentPenalty) * withSpeed) / 3600,
    }))
    return { catchUp, points }
  }, [rentPenalty, winch, withSpeed, withoutSpeed])
  const rentChart = useMemo<InteractiveLineChartProps>(() => ({ cursor: 'vertical', series: [
    { id: 'without', label: fr ? 'Sans changement de voile' : 'Without sail change', color: '#00a000', points: rentability.points.map(({ time, without }) => ({ x: time, y: without })) },
    { id: 'with', label: fr ? 'Avec changement de voile' : 'With sail change', color: '#1267e9', points: rentability.points.map(({ time, withChange }) => ({ x: time, y: withChange })) },
  ], xAxis: { label: fr ? 'Temps' : 'Time', unit: 's' }, yAxis: { label: 'Distance', unit: 'nm' }, zoom: 'x' }), [locale, rentability])
  const simple = penaltyAt(polar, simpleWind, furler); const simpleLoss = lossAt(boat, simpleWind, jacket, furler); const double = penaltyAt(polar, doubleWind, furler); const factor = energyFactor(doubleEnergy); const winchFactor = winch ? .7 : .5
  const sameManoeuvre = sameManoeuvreCoefficients(polar)
  const simpleDefinitions: Array<[string, number, number]> = sameManoeuvre
    ? [[combined, simple.tack, simpleLoss.tack], [sail, simple.sail, simpleLoss.sail]]
    : [[tack, simple.tack, simpleLoss.tack], [gybe, simple.gybe, simpleLoss.gybe], [sail, simple.sail, simpleLoss.sail]]
  const simpleRows: PenaltyResult[] = simpleDefinitions.map(([name, time, energy]) => ({ name, time: time * energyFactor(simpleEnergy), energy, distance: simpleSpeed / 3600 * time * energyFactor(simpleEnergy) * (winchFactor - 1) }))
  const doubleLoss = lossAt(boat, doubleWind, jacket, furler)
  const doubleDefinitions: Array<[string, number, number]> = sameManoeuvre
    ? [[combinedSail, double.tack, doubleLoss.tack]]
    : [[tackSail, double.tack, doubleLoss.tack], [gybeSail, double.gybe, doubleLoss.gybe]]
  const doubleRows: PenaltyResult[] = doubleDefinitions.map(([name, time, energy]) => {
      const total = Math.max(time, double.sail); const slower = Math.min(time, double.sail)
      return { name, time: total * factor, energy: energy + doubleLoss.sail, distance: doubleSpeed / 3600 * (slower * factor * winchFactor * winchFactor + (total - slower) * factor * winchFactor - total * factor) }
  })
  const penaltySettings = (prefix: string, energy: number, wind: number, speed: number, onEnergy: (value: number) => void, onWind: (value: number) => void, onSpeed: (value: number) => void, rows: PenaltyResult[]) => <div className="analysis-settings penalty-settings">
    <div className="penalty-field-group">
      <div className="penalty-field penalty-field-energy"><RangeNumberField id={`${prefix}-energy`} label={fr ? 'Énergie du skipper' : 'Skipper energy'} max={100} min={0} onChange={onEnergy} unit="%" value={energy} /></div>
      <div className="penalty-field penalty-field-wind"><RangeNumberField id={`${prefix}-wind`} label="True Wind Speed" max={35} min={.1} onChange={onWind} unit={unit} value={wind} /></div>
      <div className="penalty-field penalty-field-speed"><RangeNumberField id={`${prefix}-speed`} label={fr ? 'Vitesse bateau' : 'Boat speed'} max={45} min={1} onChange={onSpeed} unit={unit} value={speed} /></div>
    </div>
    <div className="penalty-focus-time"><PenaltyResultsTable columns={['time', 'energy']} rows={rows} locale={locale} /></div>
    <div className="penalty-focus-distance"><PenaltyResultsTable columns={['distance']} rows={rows} locale={locale} /></div>
    <PenaltyResultsTable columns={['time', 'energy', 'distance']} rows={rows} variant="penalty-grid-results" locale={locale} />
  </div>
  const recovery = rentability.catchUp
  const catchUpPoint = rentability.points[recovery]
  const rentPenaltyRows: PenaltyResult[] = [{ name: sail, time: rentPenalty, energy: lossAt(boat, rentWind, jacket, furler).sail, distance: 0 }]
  const rentTable = <div className="penalty-rent-results"><div className="penalty-rent-penalty"><PenaltyResultsTable columns={['time', 'energy']} rows={rentPenaltyRows} locale={locale} /></div><table className="analysis-table penalty-rent-summary"><tbody><tr><th>{fr ? 'Rattrapage' : 'Catch-up'}</th><td>{recovery ? <PenaltyTimeValue value={recovery} /> : '> 12 h'}</td></tr><tr><th>Distance</th><td>{catchUpPoint ? knots(catchUpPoint.withChange, locale) : '—'}</td></tr></tbody></table></div>
  const rentSettings = <div className="analysis-settings penalty-rent-settings"><div className="penalty-rent-fields">
    <RangeNumberField id="pena-rent-energy" label={fr ? 'Énergie du skipper' : 'Skipper energy'} max={100} min={0} onChange={setRentEnergy} unit="%" value={rentEnergy} />
    <RangeNumberField id="pena-rent-wind" label="True Wind Speed" max={35} min={.1} onChange={setRentWind} unit={unit} value={rentWind} />
    <RangeNumberField id="pena-rent-without" label={fr ? 'Vitesse sans changement' : 'Speed without sail change'} max={45} min={1} onChange={setWithoutSpeed} unit={unit} value={withoutSpeed} />
    <RangeNumberField id="pena-rent-with" label={fr ? 'Vitesse avec changement' : 'Speed with sail change'} max={45} min={1} onChange={setWithSpeed} unit={unit} value={withSpeed} />
  </div>{rentTable}</div>
  const controls = <div className="analysis-page-options"><AnalysisToggle checked={fullPack} label="Full Pack" onChange={setPack} /><AnalysisToggle checked={winch} label="Winch" onChange={(value) => { setWinch(value); setFullPack(value && furler && jacket) }} /><AnalysisToggle checked={furler} label={fr ? 'Enrouleur' : 'Furler'} onChange={(value) => { setFurler(value); setFullPack(value && winch && jacket) }} /><AnalysisToggle checked={jacket} label={fr ? 'Veste' : 'Jacket'} onChange={(value) => { setJacket(value); setFullPack(value && winch && furler) }} /></div>
  return <AnalysisShell active="penalites" boat={boat} layout={layout} onBoatChange={setBoat} onLayoutChange={changeLayout} options={controls} {...props} title={fr ? 'Pénalités' : 'Penalties'}>
    <AnalysisCard chart={simpleChart} embedded={embedded} focus={focus === 0} helpTopic="penalties-simple" index={0} layout={layout} locale={locale} theme={theme} onLayoutChange={(value) => { setFocus(0); changeLayout(value) }} precision={{ value: simplePrecision, onChange: (value) => setChartPrecisions(current => ({ ...current, 0: value })) }} settings={penaltySettings('pena-simple', simpleEnergy, simpleWind, simpleSpeed, setSimpleEnergy, setSimpleWind, setSimpleSpeed, simpleRows)} title={fr ? 'Pénalités simples' : 'Simple penalties'} />
    <AnalysisCard chart={rentChart} embedded={embedded} focus={focus === 2} helpTopic="penalties-rentability" index={2} layout={layout} locale={locale} theme={theme} onLayoutChange={(value) => { setFocus(2); changeLayout(value) }} settings={rentSettings} title={fr ? 'Rentabilité' : 'Break-even'} />
    <AnalysisCard chart={doubleChart} embedded={embedded} focus={focus === 1} helpTopic="penalties-double" index={1} layout={layout} locale={locale} theme={theme} onLayoutChange={(value) => { setFocus(1); changeLayout(value) }} precision={{ value: doublePrecision, onChange: (value) => setChartPrecisions(current => ({ ...current, 1: value })) }} settings={penaltySettings('pena-double', doubleEnergy, doubleWind, doubleSpeed, setDoubleEnergy, setDoubleWind, setDoubleSpeed, doubleRows)} title={fr ? 'Pénalités doubles' : 'Double penalties'} />
  </AnalysisShell>
}
