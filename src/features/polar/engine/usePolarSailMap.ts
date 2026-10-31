import { useEffect, useRef, useState } from 'react'
import type { SailId } from '../polarModel'
import { loadPolarData } from './polarData'
import type { PolarSailMapData, PolarSailMapMessage, PolarSailMapRequest } from './polarTypes'

export type PolarSailMapState = {
  data?: PolarSailMapData
  error?: string
  progress: number
}

export function usePolarSailMap(
  boat: string,
  options: { foil: boolean; hull: boolean },
  selectedSails: ReadonlySet<SailId>,
) {
  const [state, setState] = useState<PolarSailMapState>({ progress: 0 })
  const requestId = useRef(0)
  const sailKey = Array.from(selectedSails).sort().join(',')

  useEffect(() => {
    const activeRequest = ++requestId.current
    let cancelled = false
    let worker: Worker | undefined
    setState({ progress: 0 })

    void loadPolarData(boat as Parameters<typeof loadPolarData>[0])
      .then((polar) => {
        if (cancelled) return
        worker = new Worker(new URL('./polarSailMap.worker.ts', import.meta.url), { type: 'module' })
        worker.onmessage = ({ data }: MessageEvent<PolarSailMapMessage>) => {
          if (cancelled || data.requestId !== activeRequest) return
          if (data.type === 'progress') {
            setState((current) => ({ ...current, progress: data.percent }))
          } else if (data.type === 'result') {
            setState({ data: data.data, progress: 100 })
            worker?.terminate()
          } else {
            setState({ error: data.message, progress: 0 })
            worker?.terminate()
          }
        }
        worker.onerror = () => setState({ error: 'Le calcul de la carte a échoué', progress: 0 })
        const request: PolarSailMapRequest = {
          options: { foil: options.foil, hull: options.hull, sails: Array.from(selectedSails) },
          polar,
          requestId: activeRequest,
        }
        worker.postMessage(request)
      })
      .catch((error: unknown) => setState({ error: error instanceof Error ? error.message : 'Chargement de la polaire impossible', progress: 0 }))

    return () => {
      cancelled = true
      worker?.terminate()
    }
  }, [boat, options.foil, options.hull, sailKey])

  return state
}
