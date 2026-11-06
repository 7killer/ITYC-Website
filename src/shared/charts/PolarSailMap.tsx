import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { sailColors } from '../../features/polar/engine/polarMath'
import type { PolarSailMapData } from '../../features/polar/engine/polarTypes'
import { getSailName } from '../../features/polar/sailNames'
import { formatPolarNumber, polarUnit } from '../../features/polar/polarModel'

export type PolarSailMapHandle = { resetView: () => void }

type Viewport = { xMax: number; xMin: number; yMax: number; yMin: number }
type Point = { x: number; y: number }
type Contour = { level: number; segments: Float32Array }
type SailRun = { color: string; xMin: number; xMax: number }

const margin = { bottom: 32, left: 48, right: 14, top: 14 }

function color(variable: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback
}

function addCrossing(points: Point[], level: number, a: number, b: number, start: Point, end: Point) {
  if (a === b || level < Math.min(a, b) || level > Math.max(a, b)) return
  const ratio = (level - a) / (b - a)
  if (ratio >= 0 && ratio <= 1) points.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio })
}

function buildContours(data: PolarSailMapData): Contour[] {
  let maxSpeed = 0
  for (const speed of data.speeds) maxSpeed = Math.max(maxSpeed, speed)
  const levels = Array.from({ length: Math.floor((maxSpeed + .001) / 1.5) }, (_, index) => ({ level: (index + 1) * 1.5, segments: [] as number[] }))
  // Visit each cell once. Most fine cells contain no contour level, so avoid
  // scanning the entire dense grid once again for every speed contour.
  for (let yIndex = 0; yIndex < data.height - 1; yIndex += 1) {
    for (let xIndex = 0; xIndex < data.width - 1; xIndex += 1) {
      const index = yIndex * data.width + xIndex
      const v00 = data.speeds[index]
      const v10 = data.speeds[index + 1]
      const v11 = data.speeds[index + data.width + 1]
      const v01 = data.speeds[index + data.width]
      const firstLevel = Math.max(1, Math.ceil(Math.min(v00, v10, v11, v01) / 1.5))
      const lastLevel = Math.min(levels.length, Math.floor(Math.max(v00, v10, v11, v01) / 1.5))
      if (firstLevel > lastLevel) continue
      const x0 = data.twsValues[xIndex]; const x1 = data.twsValues[xIndex + 1]
      const y0 = data.twaValues[yIndex]; const y1 = data.twaValues[yIndex + 1]
      for (let levelIndex = firstLevel; levelIndex <= lastLevel; levelIndex++) {
        const { level, segments } = levels[levelIndex - 1]
        const points: Point[] = []
        addCrossing(points, level, v00, v10, { x: x0, y: y0 }, { x: x1, y: y0 })
        addCrossing(points, level, v10, v11, { x: x1, y: y0 }, { x: x1, y: y1 })
        addCrossing(points, level, v11, v01, { x: x1, y: y1 }, { x: x0, y: y1 })
        addCrossing(points, level, v01, v00, { x: x0, y: y1 }, { x: x0, y: y0 })
        if (points.length === 2) segments.push(points[0].x, points[0].y, points[1].x, points[1].y)
        if (points.length === 4) segments.push(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y)
      }
    }
  }
  return levels.map(({ level, segments }) => ({ level: Number(level.toFixed(1)), segments: new Float32Array(segments) }))
}

function buildSailRows(data: PolarSailMapData): SailRun[][] {
  return Array.from({ length: Math.max(0, data.height - 1) }, (_, yIndex) => {
    const runs: SailRun[] = []
    let start = 0
    for (let xIndex = 0; xIndex < data.width - 1; xIndex++) {
      const sail = data.sails[yIndex * data.width + xIndex]
      if (xIndex < data.width - 2 && sail === data.sails[yIndex * data.width + xIndex + 1]) continue
      runs.push({ color: sailColors[data.sailIds[sail]], xMin: data.twsValues[start], xMax: data.twsValues[xIndex + 1] })
      start = xIndex + 1
    }
    return runs
  })
}

export const PolarSailMap = forwardRef<PolarSailMapHandle, { data: PolarSailMapData; locale: 'fr' | 'en' }>(function PolarSailMap({ data, locale }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resetRef = useRef<() => void>(() => undefined)
  const contours = useMemo(() => buildContours(data), [data])
  const sailRows = useMemo(() => buildSailRows(data), [data])

  useImperativeHandle(ref, () => ({ resetView: () => resetRef.current() }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const unit = polarUnit(locale)
    const number = (value: number, digits: number) => formatPolarNumber(value, digits, locale)

    const fullViewport = (): Viewport => ({
      xMax: data.twsValues[data.twsValues.length - 1],
      xMin: data.twsValues[0],
      yMax: data.twaValues[data.twaValues.length - 1],
      yMin: data.twaValues[0],
    })
    let viewport = fullViewport()
    let hover: Point | undefined
    let panning: { point: Point; viewport: Viewport } | undefined

    const dimensions = () => ({
      height: Math.max(1, canvas.clientHeight),
      width: Math.max(1, canvas.clientWidth),
    })
    const plot = () => {
      const size = dimensions()
      return { height: Math.max(1, size.height - margin.top - margin.bottom), left: margin.left, top: margin.top, width: Math.max(1, size.width - margin.left - margin.right) }
    }
    const worldToScreen = (x: number, y: number, rect = plot()) => ({
      x: rect.left + (x - viewport.xMin) / (viewport.xMax - viewport.xMin) * rect.width,
      y: rect.top + (viewport.yMax - y) / (viewport.yMax - viewport.yMin) * rect.height,
    })
    const screenToWorld = (x: number, y: number, rect = plot()) => ({
      x: viewport.xMin + (x - rect.left) / rect.width * (viewport.xMax - viewport.xMin),
      y: viewport.yMax - (y - rect.top) / rect.height * (viewport.yMax - viewport.yMin),
    })
    const clampViewport = () => {
      const bounds = fullViewport()
      const minSpanX = 2
      const minSpanY = 8
      if (viewport.xMax - viewport.xMin < minSpanX) viewport.xMax = viewport.xMin + minSpanX
      if (viewport.yMax - viewport.yMin < minSpanY) viewport.yMax = viewport.yMin + minSpanY
      if (viewport.xMin < bounds.xMin) { viewport.xMax += bounds.xMin - viewport.xMin; viewport.xMin = bounds.xMin }
      if (viewport.xMax > bounds.xMax) { viewport.xMin -= viewport.xMax - bounds.xMax; viewport.xMax = bounds.xMax }
      if (viewport.yMin < bounds.yMin) { viewport.yMax += bounds.yMin - viewport.yMin; viewport.yMin = bounds.yMin }
      if (viewport.yMax > bounds.yMax) { viewport.yMin -= viewport.yMax - bounds.yMax; viewport.yMax = bounds.yMax }
    }
    const resize = () => {
      const { height, width } = dimensions()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const indexAt = (values: Float32Array, value: number) => {
      const step = values[1] - values[0]
      return Math.max(0, Math.min(values.length - 1, Math.round((value - values[0]) / step)))
    }
    const drawAxes = (rect: ReturnType<typeof plot>) => {
      const ink = color('--muted', '#c8c8c8')
      const grid = color('--line', 'rgba(255,255,255,.25)')
      context.save()
      context.strokeStyle = grid
      context.fillStyle = ink
      context.lineWidth = 1
      context.font = '11px Arial'
      context.textAlign = 'center'
      context.textBaseline = 'top'
      for (let value = 0; value <= 50; value += 5) {
        if (value < viewport.xMin || value > viewport.xMax) continue
        const point = worldToScreen(value, viewport.yMin, rect)
        context.beginPath(); context.moveTo(point.x, rect.top); context.lineTo(point.x, rect.top + rect.height); context.stroke()
        context.fillText(String(value), point.x, rect.top + rect.height + 5)
      }
      context.textAlign = 'right'
      context.textBaseline = 'middle'
      for (let value = 0; value <= 180; value += 20) {
        if (value < viewport.yMin || value > viewport.yMax) continue
        const point = worldToScreen(viewport.xMin, value, rect)
        context.beginPath(); context.moveTo(rect.left, point.y); context.lineTo(rect.left + rect.width, point.y); context.stroke()
        context.fillText(String(value), rect.left - 7, point.y)
      }
      context.strokeStyle = ink
      context.strokeRect(rect.left, rect.top, rect.width, rect.height)
      context.textAlign = 'center'; context.textBaseline = 'bottom'; context.font = '12px Arial'
      context.fillText(`TWS (${unit})`, rect.left + rect.width / 2, rect.top + rect.height + 30)
      context.save(); context.translate(13, rect.top + rect.height / 2); context.rotate(-Math.PI / 2); context.fillText('TWA (°)', 0, 0); context.restore()
      context.restore()
    }
    const drawContours = (rect: ReturnType<typeof plot>) => {
      context.save()
      context.beginPath(); context.rect(rect.left, rect.top, rect.width, rect.height); context.clip()
      context.strokeStyle = 'rgba(12, 15, 17, .9)'; context.lineWidth = 1
      context.font = '11px Arial'; context.textAlign = 'left'; context.textBaseline = 'bottom'
      for (const contour of contours) {
        let label: Point | undefined
        context.beginPath()
        for (let index = 0; index < contour.segments.length; index += 4) {
          const x0 = contour.segments[index]; const y0 = contour.segments[index + 1]
          const x1 = contour.segments[index + 2]; const y1 = contour.segments[index + 3]
          if (Math.max(x0, x1) < viewport.xMin || Math.min(x0, x1) > viewport.xMax || Math.max(y0, y1) < viewport.yMin || Math.min(y0, y1) > viewport.yMax) continue
          const p0 = worldToScreen(x0, y0, rect); const p1 = worldToScreen(x1, y1, rect)
          context.moveTo(p0.x, p0.y); context.lineTo(p1.x, p1.y)
          if (!label && index > contour.segments.length * .35) label = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }
        }
        context.stroke()
        if (label) {
          const text = number(contour.level, 1); const width = context.measureText(text).width + 4
          context.fillStyle = 'rgba(255, 255, 255, .75)'; context.fillRect(label.x - 2, label.y - 12, width, 13)
          context.fillStyle = '#111'; context.fillText(text, label.x, label.y - 1)
        }
      }
      context.restore()
    }
    const drawHover = (rect: ReturnType<typeof plot>) => {
      if (!hover) return
      const world = screenToWorld(hover.x, hover.y, rect)
      if (world.x < viewport.xMin || world.x > viewport.xMax || world.y < viewport.yMin || world.y > viewport.yMax) return
      const xIndex = indexAt(data.twsValues, world.x)
      const yIndex = indexAt(data.twaValues, world.y)
      const index = yIndex * data.width + xIndex
      const tws = data.twsValues[xIndex]
      const twa = data.twaValues[yIndex]
      const sail = data.sailIds[data.sails[index]]
      const speed = data.speeds[index]
      const point = worldToScreen(tws, twa, rect)
      const textColor = color('--ink', '#fff')
      const lines = [`TWS ${number(tws, 2)} ${unit}`, `TWA ${number(twa, 0)}°`, `${getSailName(sail, locale)} · ${number(speed, 2)} ${unit}`]

      context.save()
      context.strokeStyle = color('--ocean-bright', '#5ce2dc'); context.setLineDash([4, 4])
      context.beginPath(); context.moveTo(point.x, rect.top); context.lineTo(point.x, rect.top + rect.height); context.moveTo(rect.left, point.y); context.lineTo(rect.left + rect.width, point.y); context.stroke()
      context.setLineDash([]); context.font = '11px Arial'
      const boxWidth = Math.max(...lines.map((line) => context.measureText(line).width)) + 16
      const boxHeight = 54
      const size = dimensions()
      const x = Math.min(size.width - boxWidth - 5, point.x + 9)
      const y = Math.max(5, Math.min(size.height - boxHeight - 5, point.y - boxHeight - 8))
      context.fillStyle = color('--surface-raised', '#202124'); context.strokeStyle = sailColors[sail]
      context.fillRect(x, y, boxWidth, boxHeight); context.strokeRect(x, y, boxWidth, boxHeight)
      context.fillStyle = textColor
      lines.forEach((line, lineIndex) => context.fillText(line, x + 8, y + 15 + lineIndex * 14))
      context.restore()
    }
    const draw = () => {
      resize()
      const { height, width } = dimensions()
      const background = color('--page', '#202124')
      context.clearRect(0, 0, width, height)
      context.fillStyle = background; context.fillRect(0, 0, width, height)
      const rect = plot()
      context.save(); context.beginPath(); context.rect(rect.left, rect.top, rect.width, rect.height); context.clip()
      for (let yIndex = 0; yIndex < data.height - 1; yIndex += 1) {
        const y0 = data.twaValues[yIndex]; const y1 = data.twaValues[yIndex + 1]
        if (y1 < viewport.yMin || y0 > viewport.yMax) continue
        for (const run of sailRows[yIndex]) {
          if (run.xMax < viewport.xMin || run.xMin > viewport.xMax) continue
          const p0 = worldToScreen(run.xMin, y0, rect); const p1 = worldToScreen(run.xMax, y1, rect)
          context.fillStyle = run.color
          context.fillRect(p0.x, p1.y, Math.max(1, p1.x - p0.x + .5), Math.max(1, p0.y - p1.y + .5))
        }
      }
      context.restore()
      drawContours(rect)
      drawAxes(rect)
      drawHover(rect)
    }
    const eventPoint = (event: MouseEvent | WheelEvent): Point => {
      const rect = canvas.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = plot(); const point = eventPoint(event); const world = screenToWorld(point.x, point.y, rect)
      const factor = event.deltaY < 0 ? .85 : 1.18
      const xSpan = (viewport.xMax - viewport.xMin) * factor; const ySpan = (viewport.yMax - viewport.yMin) * factor
      const xRatio = (world.x - viewport.xMin) / (viewport.xMax - viewport.xMin); const yRatio = (world.y - viewport.yMin) / (viewport.yMax - viewport.yMin)
      viewport.xMin = world.x - xSpan * xRatio; viewport.xMax = viewport.xMin + xSpan
      viewport.yMin = world.y - ySpan * yRatio; viewport.yMax = viewport.yMin + ySpan
      clampViewport(); draw()
    }
    const onMouseDown = (event: MouseEvent) => { panning = { point: eventPoint(event), viewport: { ...viewport } }; canvas.style.cursor = 'grabbing' }
    const onMouseMove = (event: MouseEvent) => {
      hover = eventPoint(event)
      if (panning) {
        const rect = plot(); const point = hover
        const dx = (point.x - panning.point.x) / rect.width * (panning.viewport.xMax - panning.viewport.xMin)
        const dy = (point.y - panning.point.y) / rect.height * (panning.viewport.yMax - panning.viewport.yMin)
        viewport.xMin = panning.viewport.xMin - dx; viewport.xMax = panning.viewport.xMax - dx
        viewport.yMin = panning.viewport.yMin + dy; viewport.yMax = panning.viewport.yMax + dy
        clampViewport()
      }
      draw()
    }
    const stopPan = () => { panning = undefined; canvas.style.cursor = 'crosshair' }
    const onMouseLeave = () => { hover = undefined; stopPan(); draw() }
    const reset = () => { viewport = fullViewport(); hover = undefined; draw() }

    resetRef.current = reset
    canvas.style.cursor = 'crosshair'
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('dblclick', reset)
    window.addEventListener('mouseup', stopPan)
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    draw()

    return () => {
      resetRef.current = () => undefined
      observer.disconnect(); canvas.removeEventListener('wheel', onWheel); canvas.removeEventListener('mousedown', onMouseDown); canvas.removeEventListener('mousemove', onMouseMove); canvas.removeEventListener('mouseleave', onMouseLeave); canvas.removeEventListener('dblclick', reset); window.removeEventListener('mouseup', stopPan)
    }
  }, [contours, data, locale, sailRows])

  return <div className="polar-sail-map"><canvas aria-label={locale === 'fr' ? 'Carte d’utilisation des voiles' : 'Sail usage map'} ref={canvasRef} role="img" /></div>
})
