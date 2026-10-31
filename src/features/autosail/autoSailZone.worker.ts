import { getBestSpeed, polarLimit, sailColors } from '../polar/engine/polarMath'
import type { PolarData } from '../polar/engine/polarTypes'
import type { PolarOptions, SailId } from '../polar/polarModel'

type Request = {
  options: PolarOptions
  precision?: .01 | .1
  polar: PolarData
  sails: SailId[]
  secondSail?: SailId
  sail: SailId
}

function isActive(result: ReturnType<typeof getBestSpeed>, polar: PolarData, sail: SailId) {
  const speed = result.all[sail] ?? 0
  return speed > 0 && speed * (polar.autoSailChangeTolerance ?? 1.014) > result.speed
}

self.addEventListener('message', ({ data }: MessageEvent<Request>) => {
  const lower: Array<{ x: number; y: number }> = []
  const upper: Array<{ x: number; y: number }> = []
  const minTwa = Math.max(0, Math.min(...data.polar.twa))
  const maxTwa = Math.min(180, Math.max(...data.polar.twa))
  const maxTws = polarLimit(data.polar, 'tws', 50)
  // Les zones d'usage historiques travaillent avec TWS Ã  .01 et TWA Ã  .1.
  // La zone de recouvrement est plus sensible : elle utilise .01 sur les deux axes.
  const twsStep = data.secondSail ? data.precision ?? .1 : .01
  const twaStep = data.secondSail ? data.precision ?? .1 : .1
  const total = Math.ceil((maxTws - .1) / twsStep) + 1
  const progressStep = Math.max(1, Math.floor(total / 100))
  let index = 0

  for (let tws = .1; tws <= maxTws; tws += twsStep) {
    const angles: number[] = []
    for (let twa = minTwa; twa <= maxTwa; twa += twaStep) {
      const result = getBestSpeed(data.polar, twa, tws, { foil: data.options.foil, hull: data.options.hull, sails: data.sails })
      const active = isActive(result, data.polar, data.sail)
      const alsoActive = data.secondSail ? isActive(result, data.polar, data.secondSail) : true
      if (active && alsoActive) angles.push(twa)
    }
    if (angles.length) {
      lower.push({ x: Number(tws.toFixed(2)), y: Number(angles[0].toFixed(2)) })
      upper.push({ x: Number(tws.toFixed(2)), y: Number(angles[angles.length - 1].toFixed(2)) })
    }
    index += 1
    if (index % progressStep === 0 || index === total) self.postMessage({ percent: Math.min(100, Math.round(index / total * 100)), type: 'progress' })
  }

  // Les bornes restent volontairement constantes, pour permettre de les lire
  // quel que soit le couple de voiles ; seule la zone reprend la voile source.
  const maxTwaColor = '#a5b200'
  const minTwaColor = '#007f75'
  const zoneColor = `${sailColors[data.sail]}33`
  const hasValidZone = lower.length > 0 && upper.length > 0 && [...lower, ...upper].every((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
  self.postMessage({
    chart: {
      cursor: 'vertical',
      series: [
        { color: maxTwaColor, id: 'upper', label: 'TWA maxi', points: upper },
        { backgroundColor: zoneColor, color: minTwaColor, fill: '-1', id: 'lower', label: 'TWA mini', points: lower },
      ],
      xAxis: { label: 'True Wind Speed', unit: 'nds' },
      yAxis: { label: 'True Wind Angle', unit: '°' },
      zoom: 'x',
    },
    empty: !hasValidZone,
    type: 'result',
  })
})
