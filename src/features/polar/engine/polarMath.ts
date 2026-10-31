import type { PolarCalculationOptions, PolarData, PolarSailId } from './polarTypes'

const sailAliases: Record<string, PolarSailId> = {
  code0: 'Code0',
  heavygnk: 'HeavyGnk',
  jib: 'Jib',
  lightgnk: 'LightGnk',
  lightjib: 'LightJib',
  spi: 'Spi',
  staysail: 'Staysail',
}

function sailAlias(name: string) {
  return sailAliases[name.replace(/[^a-z0-9]/gi, '').toLowerCase()]
}

export const sailColors: Record<PolarSailId, string> = {
  Code0: '#00a000',
  HeavyGnk: '#b00000',
  Jib: '#cd0342',
  LightGnk: '#d77900',
  LightJib: '#f67876',
  Spi: '#00ff00',
  Staysail: '#0000ff',
}

type Interpolation = { high: number; low: number; ratio: number }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function interpolateIndex(values: number[], value: number): Interpolation {
  const target = Math.abs(value)
  if (target <= values[0]) return { high: 1, low: 0, ratio: 0 }
  const last = values.length - 1
  if (target >= values[last]) return { high: last, low: last - 1, ratio: 1 }
  for (let high = 1; high < values.length; high += 1) {
    if (target <= values[high]) {
      const low = high - 1
      return { high, low, ratio: (target - values[low]) / (values[high] - values[low]) }
    }
  }
  return { high: last, low: last - 1, ratio: 1 }
}

function bilinear(x: number, y: number, f00: number, f10: number, f01: number, f11: number) {
  return f00 * (1 - x) * (1 - y) + f10 * x * (1 - y) + f01 * (1 - x) * y + f11 * x * y
}

function taper(value: number, min: number, max: number, merge: number) {
  if (value < min) return clamp((value - (min - merge)) / merge, 0, 1)
  if (value > max) return clamp(((max + merge) - value) / merge, 0, 1)
  return 1
}

function multiplier(polar: PolarData, twa: number, tws: number, options: PolarCalculationOptions) {
  const hull = options.hull ? polar.hull?.speedRatio ?? 1 : 1
  if (!options.foil || !polar.foil) return hull * (polar.globalSpeedRatio ?? 1)
  const foil = polar.foil
  const foilRatio = taper(twa, foil.twaMin, foil.twaMax, foil.twaMerge) * taper(tws, foil.twsMin, foil.twsMax, foil.twsMerge)
  return hull * (polar.globalSpeedRatio ?? 1) * (1 + (foil.speedRatio - 1) * foilRatio)
}

function sailSpeed(polar: PolarData, sail: { speed: number[][] }, twa: number, tws: number) {
  const angle = interpolateIndex(polar.twa, twa)
  const wind = interpolateIndex(polar.tws, tws)
  const matrix = sail.speed
  return bilinear(
    angle.ratio,
    wind.ratio,
    matrix[angle.low]?.[wind.low] ?? 0,
    matrix[angle.high]?.[wind.low] ?? 0,
    matrix[angle.low]?.[wind.high] ?? 0,
    matrix[angle.high]?.[wind.high] ?? 0,
  )
}

export function getBestSpeed(polar: PolarData, twa: number, tws: number, options: PolarCalculationOptions) {
  const selected = new Set(options.sails)
  const factor = multiplier(polar, twa, tws, options)
  let sail: PolarSailId = options.sails[0] ?? 'Jib'
  let speed = -Infinity
  const all: Partial<Record<PolarSailId, number>> = {}

  for (const sailDefinition of polar.sail) {
    const sailId = sailAlias(sailDefinition.name)
    if (!sailId) continue
    const value = sailSpeed(polar, sailDefinition, twa, tws) * factor
    all[sailId] = value
    if (selected.has(sailId) && value > speed) {
      speed = value
      sail = sailId
    }
  }

  const resolvedSpeed = Number.isFinite(speed) ? speed : 0
  return { all, sail, speed: resolvedSpeed, vmg: resolvedSpeed * Math.cos(twa * Math.PI / 180) }
}

export function polarLimit(polar: PolarData, axis: 'twa' | 'tws', fallback: number) {
  const values = polar[axis]
  return Math.min(Math.max(...values), fallback)
}
