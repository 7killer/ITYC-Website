export type PolarSailId = 'Jib' | 'Spi' | 'Staysail' | 'LightJib' | 'Code0' | 'HeavyGnk' | 'LightGnk'

export type PolarData = {
  autoSailChangeTolerance?: number
  foil?: { speedRatio: number; twaMax: number; twaMerge: number; twaMin: number; twsMax: number; twsMerge: number; twsMin: number }
  globalSpeedRatio?: number
  hull?: { speedRatio: number }
  sail: Array<{ name: string; speed: number[][] }>
  twa: number[]
  tws: number[]
}

export type PolarCalculationOptions = {
  foil: boolean
  hull: boolean
  sails: PolarSailId[]
}

export type CalculatedPoint = { x: number; y: number }
export type CalculatedSegment = { color?: string; dash?: number[] }
export type CalculatedSeries = {
  color: string
  dash?: number[]
  id: string
  label: string
  points: CalculatedPoint[]
  segments?: CalculatedSegment[]
  tooltips?: Array<{ text: string; sail: PolarSailId }>
}

export type CalculatedChart = {
  cursor?: 'cross' | 'horizontal' | 'none' | 'vertical'
  series: CalculatedSeries[]
  xAxis: { label: string; unit?: string }
  yAxis: { label: string; unit?: string }
}

export type PolarTask = 'derived' | 'twa' | 'tws'

export type PolarWorkerRequest = {
  options: PolarCalculationOptions
  polar: PolarData
  requestId: number
  task: PolarTask
  twa: number
  tws: number
}

export type PolarWorkerMessage =
  | { chartIndexes: number[]; percent: number; requestId: number; type: 'progress' }
  | { charts: Array<{ index: number; chart: CalculatedChart }>; requestId: number; type: 'result' }
  | { message: string; requestId: number; type: 'error' }

export type PolarSailMapData = {
  height: number
  sailIds: PolarSailId[]
  sails: Uint8Array
  speeds: Float32Array
  twaValues: Float32Array
  twsValues: Float32Array
  width: number
}

export type PolarSailMapRequest = {
  options: PolarCalculationOptions
  polar: PolarData
  requestId: number
}

export type PolarSailMapMessage =
  | { percent: number; requestId: number; type: 'progress' }
  | { data: PolarSailMapData; requestId: number; type: 'result' }
  | { message: string; requestId: number; type: 'error' }
