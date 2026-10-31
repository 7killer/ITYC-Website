/// <reference lib="webworker" />

import { getBestSpeed, polarLimit } from './polarMath'
import type { PolarSailId, PolarSailMapMessage, PolarSailMapRequest } from './polarTypes'

declare const self: DedicatedWorkerGlobalScope

const sailIds: PolarSailId[] = ['Jib', 'Spi', 'Staysail', 'LightJib', 'Code0', 'HeavyGnk', 'LightGnk']

function buildAxis(min: number, max: number, step: number) {
  const count = Math.floor((max - min) / step)
  return Float32Array.from({ length: count + 1 }, (_, index) => Number((min + index * step).toFixed(3)))
}

function sendProgress(requestId: number, percent: number) {
  const message: PolarSailMapMessage = { percent, requestId, type: 'progress' }
  self.postMessage(message)
}

self.onmessage = ({ data: request }: MessageEvent<PolarSailMapRequest>) => {
  try {
    const twsValues = buildAxis(.5, polarLimit(request.polar, 'tws', 50), .5)
    const twaValues = buildAxis(0, polarLimit(request.polar, 'twa', 180), 1)
    const width = twsValues.length
    const height = twaValues.length
    const sails = new Uint8Array(width * height)
    const speeds = new Float32Array(width * height)

    sendProgress(request.requestId, 0)
    twaValues.forEach((twa, yIndex) => {
      twsValues.forEach((tws, xIndex) => {
        const result = getBestSpeed(request.polar, twa, tws, request.options)
        const index = yIndex * width + xIndex
        sails[index] = sailIds.indexOf(result.sail)
        speeds[index] = result.speed
      })
      sendProgress(request.requestId, Math.round((yIndex + 1) / height * 100))
    })

    const result: PolarSailMapMessage = {
      data: { height, sailIds, sails, speeds, twaValues, twsValues, width },
      requestId: request.requestId,
      type: 'result',
    }
    self.postMessage(result, [sails.buffer, speeds.buffer, twaValues.buffer, twsValues.buffer])
  } catch (error) {
    const message: PolarSailMapMessage = {
      message: error instanceof Error ? error.message : 'Erreur de calcul de la carte des voiles',
      requestId: request.requestId,
      type: 'error',
    }
    self.postMessage(message)
  }
}
