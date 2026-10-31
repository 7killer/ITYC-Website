import { useEffect, useMemo, useState } from 'react'
import type { InteractiveLineChartProps } from '../../shared/charts/InteractiveLineChart'
import { RangeNumberField } from '../../shared/ui/RangeNumberField'
import { loadPolarData } from '../polar/engine/polarData'
import type { PolarData } from '../polar/engine/polarTypes'
import type { ChartLayout } from '../polar/polarModel'
import { AnalysisCard, AnalysisShell, AnalysisToggle, consumptionByStamina, minutes, staminaByBoat, windFactor } from '../analysis/AnalysisShell'
import { readPageSessionState, savePageSessionState } from '../../shared/storage/pageSessionState'

type Props = { embedded?: boolean; locale: 'fr' | 'en'; onBackHome: () => void; onLocaleChange: (locale: 'fr' | 'en') => void; onThemeChange: (theme: 'dark' | 'light') => void; theme: 'dark' | 'light' }
type WinchData = { tack: { std: { hw: { timer: number }; lw: { timer: number } } }; gybe: { std: { hw: { timer: number }; lw: { timer: number } } } }
type EnergyPageSession = { boat: string; energy: number; focus: number; fullPack: boolean; furler: boolean; jacket: boolean; layout: ChartLayout; lossWind: number; pug: boolean; recoveryWind: number; winch: boolean }
function useBoatData(boat: string) { const [polar, setPolar] = useState<PolarData>(); useEffect(() => { let live = true; setPolar(undefined); void loadPolarData(boat as Parameters<typeof loadPolarData>[0]).then((data) => { if (live) setPolar(data) }); return () => { live = false } }, [boat]); return polar }
function sameManoeuvreCoefficients(polar: PolarData | undefined) { const winch = (polar as (PolarData & { winch?: WinchData }) | undefined)?.winch; return Boolean(winch && winch.tack.std.lw.timer === winch.gybe.std.lw.timer && winch.tack.std.hw.timer === winch.gybe.std.hw.timer) }
function fmtPercent(value: number, locale: 'fr' | 'en') { return `-${locale === 'fr' ? value.toFixed(1).replace('.', ',') : value.toFixed(1)} %` }
function recoveryPerPoint(wind: number, pug: boolean) { const minutesAtWind = wind <= 0 ? 5 : wind >= 30 ? 15 : 5 + (1 - Math.cos(wind / 30 * Math.PI)) * 5; return minutesAtWind * 60 * (pug ? .8 : 1) }
function formatMinutesSeconds(seconds: number) { const total = Math.max(0, Math.round(seconds)); return `${Math.floor(total / 60)} min ${total % 60} s` }

export function EnergyPage(props: Props) {
  const { locale, theme, embedded } = props
  const fr = locale === 'fr'
  const unit = fr ? 'nds' : 'kts'
  const tack = fr ? 'Virement' : 'Tack'
  const gybe = fr ? 'Empannage' : 'Gybe'
  const combined = fr ? 'Virement / Empannage' : 'Tack / Gybe'
  const sail = fr ? 'Voile' : 'Sail change'
  const lossTitle = fr ? 'Énergie perdue' : 'Energy lost'
  const recoveryTitle = fr ? 'Énergie récupérée' : 'Recovered energy'
  const recoveryLabel = fr ? 'Temps de récupération pour 1 pt' : 'Recovery time per point'
  const [savedState] = useState(() => readPageSessionState<EnergyPageSession>('energy'))
  const [boat, setBoat] = useState(() => savedState.boat ?? 'Class 40 2021'); const polar = useBoatData(boat); const [layout, setLayout] = useState<ChartLayout>(() => savedState.layout === 'focus' ? 'focus' : 'grid'); const [focus, setFocus] = useState(() => savedState.focus ?? 0)
  const changeLayout = (value: ChartLayout) => { setLayout(value) }
  const [fullPack, setFullPack] = useState(() => savedState.fullPack ?? true); const [winch, setWinch] = useState(() => savedState.winch ?? true); const [furler, setFurler] = useState(() => savedState.furler ?? true); const [jacket, setJacket] = useState(() => savedState.jacket ?? true); const [pug, setPug] = useState(() => savedState.pug ?? true)
  const [lossWind, setLossWind] = useState(() => savedState.lossWind ?? 10); const [recoveryWind, setRecoveryWind] = useState(() => savedState.recoveryWind ?? 10); const [energy, setEnergy] = useState(() => savedState.energy ?? 66.7)
  useEffect(() => {
    savePageSessionState('energy', { boat, energy, focus, fullPack, furler, jacket, layout, lossWind, pug, recoveryWind, winch })
  }, [boat, energy, focus, fullPack, furler, jacket, layout, lossWind, pug, recoveryWind, winch])
  const setPack = (value: boolean) => { setFullPack(value); setWinch(value); setFurler(value); setJacket(value); setPug(value) }
  const multiplier = consumptionByStamina[staminaByBoat[boat] ?? 0] ?? 1
  const lossFor = (wind: number) => { const factor = windFactor(wind, jacket) * multiplier; return { tack: 10 * factor, gybe: 10 * factor, sail: 20 * factor * (furler ? .8 : 1) } }
  const lossChart = useMemo<InteractiveLineChartProps>(() => { const points = Array.from({ length: 351 }, (_, i) => i / 10); const same = sameManoeuvreCoefficients(polar); return { cursor: 'vertical', series: [
    { id: 'tack', label: same ? combined : tack, color: '#00a000', points: points.map((x) => ({ x, y: lossFor(x).tack })) },
    ...(same ? [] : [{ id: 'gybe', label: gybe, color: '#1267e9', points: points.map((x) => ({ x, y: lossFor(x).gybe })) }]),
    { id: 'sail', label: sail, color: '#e00000', points: points.map((x) => ({ x, y: lossFor(x).sail })) },
  ], xAxis: { label: 'True Wind Speed', unit }, yAxis: { label: lossTitle, unit: '%' }, zoom: 'x' } }, [boat, furler, jacket, locale, polar])
  const recoveryChart = useMemo<InteractiveLineChartProps>(() => { const points = Array.from({ length: 351 }, (_, i) => i / 10); return { cursor: 'vertical', series: [{ id: 'recovery', label: recoveryLabel, color: '#00a000', points: points.map((x) => ({ x, y: recoveryPerPoint(x, pug) })) }], tooltip: { label: (item) => `${recoveryLabel} : ${formatMinutesSeconds(item.parsed.y ?? 0)}` }, xAxis: { label: 'True Wind Speed', unit }, yAxis: { label: fr ? 'Temps de récupération' : 'Recovery time', tickFormat: (value) => `${Math.round(value / 60)} min`, tickStep: 60, unit: 'min' }, zoom: 'x' } }, [locale, pug])
  const loss = lossFor(lossWind); const recovery = recoveryPerPoint(lossWind, pug); const recoveryTime = recoveryPerPoint(recoveryWind, pug) * (100 - energy)
  const lossRows: Array<[string, number]> = sameManoeuvreCoefficients(polar) ? [[combined, loss.tack], [sail, loss.sail]] : [[tack, loss.tack], [gybe, loss.gybe], [sail, loss.sail]]
  const lossTable = <table className="analysis-table"><thead><tr><th>{fr ? 'Manœuvre' : 'Maneuver'}</th><th>{fr ? 'Énergie' : 'Energy'}</th><th>{fr ? 'Récupération' : 'Recovery'}</th></tr></thead><tbody>{lossRows.map(([name, value]) => <tr key={name}><th>{name}</th><td>{fmtPercent(value, locale)}</td><td>{minutes(value * recovery)}</td></tr>)}</tbody></table>
  const recoveryTable = <table className="analysis-table"><tbody><tr><th>{recoveryTitle}</th><td>{fr ? (100 - energy).toFixed(1).replace('.', ',') : (100 - energy).toFixed(1)} %</td></tr><tr><th>{fr ? 'Temps de récupération' : 'Recovery time'}</th><td>{minutes(recoveryTime)}</td></tr><tr><th>{fr ? 'Récupération par point' : 'Recovery per point'}</th><td>{minutes(recoveryPerPoint(recoveryWind, pug))}</td></tr></tbody></table>
  const lossSettings = <div className="analysis-settings energy-settings"><div className="energy-settings-controls"><RangeNumberField id="energy-loss-wind" label="True Wind Speed" max={35} min={.1} onChange={setLossWind} unit={unit} value={lossWind} /></div><div className="energy-settings-results">{lossTable}</div></div>
  const recoverySettings = <div className="analysis-settings energy-settings"><div className="energy-settings-controls"><RangeNumberField id="energy-recovery-energy" label={fr ? 'Énergie du skipper' : 'Skipper energy'} max={99.9} min={0} onChange={setEnergy} unit="%" value={energy} /><RangeNumberField id="energy-recovery-wind" label="True Wind Speed" max={35} min={.1} onChange={setRecoveryWind} unit={unit} value={recoveryWind} /></div><div className="energy-settings-results">{recoveryTable}</div></div>
  const controls = <div className="analysis-page-options"><AnalysisToggle checked={fullPack} label="Full Pack" onChange={setPack} /><AnalysisToggle checked={winch} label="Winch" onChange={(value) => { setWinch(value); setFullPack(value && furler && jacket && pug) }} /><AnalysisToggle checked={furler} label={fr ? 'Enrouleur' : 'Furler'} onChange={(value) => { setFurler(value); setFullPack(value && winch && jacket && pug) }} /><AnalysisToggle checked={jacket} label={fr ? 'Veste' : 'Jacket'} onChange={(value) => { setJacket(value); setFullPack(value && winch && furler && pug) }} /><AnalysisToggle checked={pug} label={fr ? 'Coussin' : 'Cushion'} onChange={(value) => { setPug(value); setFullPack(value && winch && furler && jacket) }} /></div>
  return <AnalysisShell active="energie" boat={boat} layout={layout} onBoatChange={setBoat} onLayoutChange={changeLayout} options={controls} {...props} title={fr ? 'Énergie' : 'Energy'}>
    <AnalysisCard chart={lossChart} embedded={embedded} focus={focus === 0} helpTopic="energy-loss" index={0} layout={layout} locale={locale} theme={theme} onLayoutChange={(value) => { setFocus(0); changeLayout(value) }} settings={lossSettings} title={lossTitle} />
    <AnalysisCard chart={recoveryChart} embedded={embedded} focus={focus === 1} helpTopic="energy-recovery" index={1} layout={layout} locale={locale} theme={theme} onLayoutChange={(value) => { setFocus(1); changeLayout(value) }} settings={recoverySettings} title={recoveryTitle} />
  </AnalysisShell>
}
