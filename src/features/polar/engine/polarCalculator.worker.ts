/// <reference lib="webworker" />

import { getBestSpeed, polarLimit, sailColors } from './polarMath'
import type {
  CalculatedChart,
  CalculatedSeries,
  PolarCalculationOptions,
  PolarData,
  PolarSailId,
  PolarTask,
  PolarWorkerMessage,
  PolarWorkerRequest,
} from './polarTypes'

declare const self: DedicatedWorkerGlobalScope

type SpeedSeries = CalculatedSeries & { sails: PolarSailId[] }

function number(value: number, decimals = 1) {
  return value.toFixed(decimals)
}

function boatSpeedTooltip(name: string, speed: number, sail: PolarSailId, difference?: number) {
  const delta = difference === undefined ? '' : ` (${difference >= 0 ? '+' : ''}${number(difference, 5)})`
  return { text: `${name} : ${number(speed)} nds${delta}`, sail }
}

function angleTooltip(name: string, angle: number, speed: number, sail: PolarSailId) {
  return { text: `${name} : ${number(angle)}° (${number(speed, 5)} nds)`, sail }
}

function vmgTooltip(name: string, vmg: number, angle: number, speed: number, sail: PolarSailId) {
  return { text: `${name} : ${number(vmg)} nds (${number(angle)}° / ${number(speed, 5)} nds)`, sail }
}

function speedAtAngleTooltip(speed: number, angle: number, sail: PolarSailId) {
  return { text: `VSPD : ${number(speed)} nds (TWA : ${number(angle)}°)`, sail }
}

function range(max: number, step: number, min = 0) {
  const count = Math.floor((max - min) / step)
  return Array.from({ length: count + 1 }, (_, index) => Number((min + index * step).toFixed(3)))
}

function makeSpeedSeries(
  polar: PolarData,
  options: PolarCalculationOptions,
  xValues: number[],
  fixedValue: number,
  useTwaOnX: boolean,
  label: string,
  dash: number[] | undefined,
): SpeedSeries {
  const points = []
  const segments = []
  const sails: PolarSailId[] = []
  let color = '#00a000'
  for (const x of xValues) {
    const result = getBestSpeed(polar, useTwaOnX ? x : fixedValue, useTwaOnX ? fixedValue : x, options)
    color = sailColors[result.sail]
    points.push({ x, y: result.speed })
    segments.push({ color })
    sails.push(result.sail)
  }
  return { color, dash, id: label, label, points, sails, segments }
}

function withSpeedTooltips(series: SpeedSeries[]): CalculatedSeries[] {
  const reference = series[1]
  return series.map(({ sails, ...line }, seriesIndex) => ({
    ...line,
    tooltips: line.points.map((point, pointIndex) => boatSpeedTooltip(
      line.label,
      point.y,
      sails[pointIndex],
      seriesIndex === 1 ? undefined : point.y - reference.points[pointIndex].y,
    )),
  }))
}

function speedChartByTwa(polar: PolarData, options: PolarCalculationOptions, tws: number): CalculatedChart {
  const xValues = range(polarLimit(polar, 'twa', 180), .1)
  return {
    cursor: 'vertical',
    series: withSpeedTooltips([
      makeSpeedSeries(polar, options, xValues, Math.max(.1, tws - 1), true, 'TWS − 1', [10, 5, 2, 5]),
      makeSpeedSeries(polar, options, xValues, tws, true, 'TWS', undefined),
      makeSpeedSeries(polar, options, xValues, tws + 1, true, 'TWS + 1', [10, 5]),
    ]),
    xAxis: { label: 'True Wind Angle', unit: '°' },
    yAxis: { label: 'Vitesse bateau', unit: 'nds' },
  }
}

function speedChartByTws(polar: PolarData, options: PolarCalculationOptions, twa: number): CalculatedChart {
  const xValues = range(polarLimit(polar, 'tws', 50), .1, .1)
  return {
    cursor: 'vertical',
    series: withSpeedTooltips([
      makeSpeedSeries(polar, options, xValues, Math.max(0, twa - 2), false, 'TWA − 2°', [10, 5, 2, 5]),
      makeSpeedSeries(polar, options, xValues, twa, false, 'TWA', undefined),
      makeSpeedSeries(polar, options, xValues, Math.min(180, twa + 2), false, 'TWA + 2°', [10, 5]),
    ]),
    xAxis: { label: 'True Wind Speed', unit: 'nds' },
    yAxis: { label: 'Vitesse bateau', unit: 'nds' },
  }
}

function derivedCharts(
  polar: PolarData,
  options: PolarCalculationOptions,
  onProgress: (percent: number) => void,
): Array<{ chart: CalculatedChart; index: number }> {
  // Même domaine que les workers historiques : de 1 à la limite, par 0,1.
  const winds = range(polarLimit(polar, 'tws', 50), .1, 1)
  const angles = range(polarLimit(polar, 'twa', 180), .1, 1)
  const upAngle: CalculatedSeries = { color: '#cd0342', id: 'up-angle', label: 'Best VMG UP', points: [], segments: [], tooltips: [] }
  const downAngle: CalculatedSeries = { color: '#0000ff', id: 'down-angle', label: 'Best VMG DW', points: [], segments: [], tooltips: [] }
  const upVmg: CalculatedSeries = { color: '#cd0342', id: 'up-vmg', label: 'VMG UP', points: [], segments: [], tooltips: [] }
  const downVmg: CalculatedSeries = { color: '#0000ff', id: 'down-vmg', label: 'VMG DW', points: [], segments: [], tooltips: [] }
  const bestSpeedAngle: CalculatedSeries = { color: '#00a000', id: 'best-speed-angle', label: 'TWA', points: [], segments: [], tooltips: [] }
  const bestSpeed: CalculatedSeries = { color: '#00a000', id: 'best-speed', label: 'VSPD', points: [], segments: [], tooltips: [] }

  winds.forEach((wind, windIndex) => {
    let up: { sail: PolarSailId; speed: number; twa: number; vmg: number } = { sail: 'Jib', speed: 0, twa: 0, vmg: -Infinity }
    let down: { sail: PolarSailId; speed: number; twa: number; vmg: number } = { sail: 'Spi', speed: 0, twa: 180, vmg: Infinity }
    let max: { sail: PolarSailId; speed: number; twa: number } = { sail: 'Jib', speed: -Infinity, twa: 0 }

    for (const angle of angles) {
      const result = getBestSpeed(polar, angle, wind, options)
      if (result.vmg > up.vmg) up = { sail: result.sail, speed: result.speed, twa: angle, vmg: result.vmg }
      if (result.vmg < down.vmg) down = { sail: result.sail, speed: result.speed, twa: angle, vmg: result.vmg }
      if (result.speed > max.speed) max = { sail: result.sail, speed: result.speed, twa: angle }
    }

    upAngle.points.push({ x: wind, y: up.twa })
    upAngle.segments?.push({ color: sailColors[up.sail] })
    upAngle.tooltips?.push(angleTooltip('BVMG UP', up.twa, up.speed, up.sail))
    downAngle.points.push({ x: wind, y: down.twa })
    downAngle.segments?.push({ color: sailColors[down.sail] })
    downAngle.tooltips?.push(angleTooltip('BVMG DW', down.twa, down.speed, down.sail))
    upVmg.points.push({ x: wind, y: Math.abs(up.vmg) })
    upVmg.segments?.push({ color: sailColors[up.sail] })
    upVmg.tooltips?.push(vmgTooltip('VMG UP', Math.abs(up.vmg), up.twa, up.speed, up.sail))
    downVmg.points.push({ x: wind, y: Math.abs(down.vmg) })
    downVmg.segments?.push({ color: sailColors[down.sail] })
    downVmg.tooltips?.push(vmgTooltip('VMG DW', Math.abs(down.vmg), down.twa, down.speed, down.sail))
    // Best Speed : le TWA auquel la vitesse maximale est obtenue, pour ce TWS.
    bestSpeedAngle.points.push({ x: wind, y: max.twa })
    bestSpeedAngle.segments?.push({ color: sailColors[max.sail] })
    bestSpeedAngle.tooltips?.push(angleTooltip('BSPD', max.twa, max.speed, max.sail))
    bestSpeed.points.push({ x: wind, y: max.speed })
    bestSpeed.segments?.push({ color: sailColors[max.sail] })
    bestSpeed.tooltips?.push(speedAtAngleTooltip(max.speed, max.twa, max.sail))

    onProgress(Math.round(((windIndex + 1) / winds.length) * 100))
  })

  return [
    { chart: { cursor: 'vertical', series: [downAngle, upAngle], xAxis: { label: 'True Wind Speed', unit: 'nds' }, yAxis: { label: 'True Wind Angle', unit: '°' } }, index: 2 },
    { chart: { cursor: 'vertical', series: [downVmg, upVmg], xAxis: { label: 'True Wind Speed', unit: 'nds' }, yAxis: { label: 'VMG', unit: 'nds' } }, index: 3 },
    { chart: { cursor: 'vertical', series: [bestSpeedAngle], xAxis: { label: 'True Wind Speed', unit: 'nds' }, yAxis: { label: 'True Wind Angle', unit: '°' } }, index: 4 },
    { chart: { cursor: 'vertical', series: [bestSpeed], xAxis: { label: 'True Wind Speed', unit: 'nds' }, yAxis: { label: 'Vitesse bateau', unit: 'nds' } }, index: 5 },
  ]
}

function calculate(request: PolarWorkerRequest) {
  const { options, polar, task, twa, tws } = request
  if (task === 'twa') return [{ chart: speedChartByTwa(polar, options, tws), index: 0 }]
  if (task === 'tws') return [{ chart: speedChartByTws(polar, options, twa), index: 1 }]
  return derivedCharts(polar, options, (percent) => postProgress(request, percent))
}

function chartIndexes(task: PolarTask) {
  return task === 'twa' ? [0] : task === 'tws' ? [1] : [2, 3, 4, 5]
}

function postProgress(request: PolarWorkerRequest, percent: number) {
  const message: PolarWorkerMessage = { chartIndexes: chartIndexes(request.task), percent, requestId: request.requestId, type: 'progress' }
  self.postMessage(message)
}

self.onmessage = ({ data }: MessageEvent<PolarWorkerRequest>) => {
  try {
    postProgress(data, 0)
    const charts = calculate(data)
    const message: PolarWorkerMessage = { charts, requestId: data.requestId, type: 'result' }
    self.postMessage(message)
  } catch (error) {
    const message: PolarWorkerMessage = {
      message: error instanceof Error ? error.message : 'Erreur de calcul inconnue',
      requestId: data.requestId,
      type: 'error',
    }
    self.postMessage(message)
  }
}
