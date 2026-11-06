import { getBestSpeed, polarLimit, sailColors } from '../polar/engine/polarMath'
import type { PolarData } from '../polar/engine/polarTypes'
import type { PolarOptions, SailId } from '../polar/polarModel'
import { sampleChartRange } from '../../shared/charts/chartPrecision'

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
  const precision = data.precision === .01 ? '0.01' : '0.1'
  const winds = sampleChartRange(.1, maxTws, precision)
  // Usage zones refine TWS alone; overlap zones keep refining both axes.
  const angles = sampleChartRange(minTwa, maxTwa, data.secondSail ? precision : '0.1')
  const calculationOptions = { foil: data.options.foil, hull: data.options.hull, sails: data.sails }
  const total = winds.length
  const progressStep = Math.max(1, Math.floor(total / 100))
  let index = 0

  for (const tws of winds) {
    let firstAngle: number | undefined
    let lastAngle: number | undefined
    for (const twa of angles) {
      const result = getBestSpeed(data.polar, twa, tws, calculationOptions)
      const active = isActive(result, data.polar, data.sail)
      const alsoActive = data.secondSail ? isActive(result, data.polar, data.secondSail) : true
      if (active && alsoActive) {
        firstAngle ??= twa
        lastAngle = twa
      }
    }
    if (firstAngle !== undefined && lastAngle !== undefined) {
      lower.push({ x: tws, y: firstAngle })
      upper.push({ x: tws, y: lastAngle })
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
