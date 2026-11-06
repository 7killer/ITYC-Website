import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { RangeNumberField } from '../../shared/ui/RangeNumberField'
import { ChartHelpLink } from '../../shared/ui/ChartHelpLink'
import { ChartActionIcon } from '../../shared/ui/ChartActionIcon'
import { getBestSpeed, polarLimit, sailColors } from './engine/polarMath'
import { loadPolarData } from './engine/polarData'
import type { PolarCalculationOptions, PolarData, PolarSailId } from './engine/polarTypes'
import { formatPolarNumber, localizePolarText, polarUnit, type ChartLayout, type SailId } from './polarModel'
import { getSailName } from './sailNames'

type ExpertPolarPanelProps = {
  boat: string
  display: { auto: boolean; foils: boolean; sails: boolean }
  embedded?: boolean
  isFocusMode: boolean
  locale: 'fr' | 'en'
  onDisplayChange: (key: 'auto' | 'foils' | 'sails') => void
  onLayoutChange: (layout: ChartLayout) => void
  onTwaChange: (value: number) => void
  onTwsChange: (value: number) => void
  options: { foil: boolean; hull: boolean }
  selectedSails: ReadonlySet<SailId>
  theme: 'dark' | 'light'
  twa: number
  tws: number
}

type PolarSample = { all: Partial<Record<PolarSailId, number>>; angle: number; best: { sail: PolarSailId; speed: number; vmg: number } }
type ExpertModel = {
  current: PolarSample['best'] & { all: PolarSample['all'] }
  foil?: PolarData['foil']
  max: { angle: number; sail: PolarSailId; speed: number }
  maxAngle: number
  maxSpeed: number
  samples: PolarSample[]
  sailRange: { twa: { max: number; min: number }; tws: { max: number; min: number } }
  selected: PolarSailId[]
  tws: number
  vmg: { down: { angle: number; sail: PolarSailId; value: number }; up: { angle: number; sail: PolarSailId; value: number } }
}

type ExpertPolarDiagramHandle = { resetZoom: () => void }

function foilIntensity(value: number, min: number, max: number, merge: number) {
  if (value < min) return Math.max(0, Math.min(1, (value - (min - merge)) / merge))
  if (value > max) return Math.max(0, Math.min(1, ((max + merge) - value) / merge))
  return 1
}

function foilCoverage(twa: number, tws: number, foil: NonNullable<PolarData['foil']>) {
  return foilIntensity(twa, foil.twaMin, foil.twaMax, foil.twaMerge)
    * foilIntensity(tws, foil.twsMin, foil.twsMax, foil.twsMerge)
}

function foilColor(intensity: number, alpha: number) {
  const normalized = Math.max(0, Math.min(1, intensity))
  return `rgba(76, 184, 255, ${alpha * normalized})`
}

function usePolarData(boat: string) {
  const [state, setState] = useState<{ data?: PolarData; error?: string }>({})
  useEffect(() => {
    let cancelled = false
    setState({})
    void loadPolarData(boat as Parameters<typeof loadPolarData>[0])
      .then((data) => { if (!cancelled) setState({ data }) })
      .catch((error: unknown) => { if (!cancelled) setState({ error: error instanceof Error ? error.message : 'Chargement impossible' }) })
    return () => { cancelled = true }
  }, [boat])
  return state
}

function buildModel(polar: PolarData, options: PolarCalculationOptions, twa: number, tws: number, autoSails: boolean): ExpertModel {
  const maxAngle = polarLimit(polar, 'twa', 180)
  const selected = options.sails
  const samples: PolarSample[] = []
  let maxSpeed = 0
  for (let angle = 0; angle <= maxAngle; angle += .1) {
    const best = getBestSpeed(polar, angle, tws, options)
    samples.push({ all: best.all, angle, best })
    maxSpeed = Math.max(maxSpeed, ...Object.values(best.all).filter((value): value is number => value !== undefined))
  }

  let max = { angle: 0, sail: selected[0] ?? 'Jib', speed: -Infinity }
  let up = { angle: 0, sail: selected[0] ?? 'Jib', value: -Infinity }
  let down = { angle: maxAngle, sail: selected[0] ?? 'Spi', value: Infinity }
  for (let angle = 0; angle <= maxAngle; angle += .1) {
    const best = getBestSpeed(polar, angle, tws, options)
    if (best.speed > max.speed) max = { angle, sail: best.sail, speed: best.speed }
    if (best.vmg > up.value) up = { angle, sail: best.sail, value: best.vmg }
    if (best.vmg < down.value) down = { angle, sail: best.sail, value: best.vmg }
  }

  const currentResult = getBestSpeed(polar, twa, tws, options)
  const tolerance = polar.autoSailChangeTolerance ?? 1.014
  const isInActiveRange = (speed: number, bestSpeed: number) => speed > 0 && (autoSails ? speed * tolerance > bestSpeed : speed >= bestSpeed)
  const validAngles = samples.filter((sample) => {
    const speed = sample.all[currentResult.sail] ?? 0
    return isInActiveRange(speed, sample.best.speed)
  }).map((sample) => sample.angle)
  const maxTws = polarLimit(polar, 'tws', 50)
  const validTws = Array.from({ length: Math.round(maxTws * 10) + 1 }, (_, index) => index / 10).filter((wind) => {
    const sample = getBestSpeed(polar, twa, wind, options)
    return isInActiveRange(sample.all[currentResult.sail] ?? 0, sample.speed)
  })
  return {
    current: { ...currentResult },
    foil: options.foil ? polar.foil : undefined,
    max,
    maxAngle,
    maxSpeed,
    samples,
    sailRange: {
      twa: { max: validAngles.at(-1) ?? maxAngle, min: validAngles[0] ?? 0 },
      tws: { max: validTws.at(-1) ?? maxTws, min: validTws[0] ?? 0 },
    },
    selected,
    tws,
    vmg: { down: { ...down, value: Math.abs(down.value) }, up },
  }
}

const ExpertPolarDiagram = forwardRef<ExpertPolarDiagramHandle, { display: ExpertPolarPanelProps['display']; isFocusMode: boolean; locale: 'fr' | 'en'; model: ExpertModel; onTwaChange: (value: number) => void; theme: 'dark' | 'light'; twa: number }>(function ExpertPolarDiagram({ display, isFocusMode, locale, model, onTwaChange, theme, twa }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resetZoomRef = useRef<() => void>(() => undefined)
  const zoomRef = useRef(1)
  const viewOffsetRef = useRef({ x: 0, y: 0 })
  const lastFocusModeRef = useRef(isFocusMode)

  useImperativeHandle(ref, () => ({ resetZoom: () => resetZoomRef.current() }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const number = (value: number, digits = 2) => formatPolarNumber(value, digits, locale)
    const unit = polarUnit(locale)
    if (lastFocusModeRef.current !== isFocusMode) {
      zoomRef.current = 1
      viewOffsetRef.current = { x: 0, y: 0 }
      lastFocusModeRef.current = isFocusMode
    }
    let drawing = false
    const diagramOuterMargin = 58
    const frameInset = 16
    const cursorExtension = 20
    const limitExtension = 8
    const layerOffset = { cursor: 35, degrees: 14, foils: 2, sailRange: 20, vmg: 20 }
    const size = () => ({ height: Math.max(1, canvas.clientHeight), width: Math.max(1, canvas.clientWidth) })
    const cursorLines = () => {
      const lines = [`${number(twa, 1)}°`, `${number(model.current.speed)} ${unit}`, getSailName(model.current.sail, locale)]
      if (model.foil) lines.push(`${Math.round(foilCoverage(twa, model.tws, model.foil) * 100)} %`)
      return lines
    }
    context.save(); context.font = 'bold 10px Arial'
    const labelLines = [...cursorLines(), ...model.selected.map((sail) => getSailName(sail, locale))]
    const diagramLabelWidth = Math.max(...labelLines.map((line) => context.measureText(line).width)) + 5
    context.restore()
    const diagramRadius = () => {
      const { height, width } = size()
      // Fit the semicircle and its labels before applying interactive zoom.
      const heightRadius = (height - 2 * diagramOuterMargin) / 2
      const widthRadius = width - 2 * frameInset - layerOffset.cursor - diagramLabelWidth
      const baseRadius = Math.max(1, Math.min(heightRadius, widthRadius))
      return baseRadius * zoomRef.current
    }
    const geometry = () => {
      const { height, width } = size()
      const radius = diagramRadius()
      // Le demi-polaire est ancré en haut : l'arc entier reste visible sans
      // gaspiller de hauteur avant le diagramme.
      const baseCenterX = isFocusMode ? (width - radius) / 2 + Math.min(width * .12, 144) : width * .08
      const baseCenterY = height / 2
      return {
        centerX: baseCenterX + viewOffsetRef.current.x,
        centerY: baseCenterY + viewOffsetRef.current.y,
        radius,
      }
    }
    const keepDiagramInFrame = () => {
      const { height, width } = size()
      const radius = diagramRadius()
      const margin = frameInset
      const minimumCenterY = radius + diagramOuterMargin
      const maximumCenterY = height - radius - diagramOuterMargin

      // Tant que le diagramme est plus haut que son cadre, le zoom au curseur
      // reste libre. Dès qu'il peut y tenir entièrement, on le ramène dans le
      // cadre au lieu de conserver un décalage hérité d'un zoom précédent.
      const baseCenterY = height / 2
      if (minimumCenterY <= maximumCenterY) {
        const centerY = baseCenterY + viewOffsetRef.current.y
        viewOffsetRef.current.y = Math.min(maximumCenterY, Math.max(minimumCenterY, centerY)) - baseCenterY
      }

      // Le demi-diagramme se développe vers la droite. On protège donc en
      // priorité son espace avec la colonne d'informations. S'il est trop
      // large, seule sa partie gauche peut être rognée par le canvas. Le
      // libellé extérieur du curseur fait partie de cette emprise.
      const baseCenterX = isFocusMode ? (width - radius) / 2 + Math.min(width * .12, 144) : width * .08
      const minimumCenterX = margin
      const currentLabelWidth = diagramLabelWidth
      // Reserve the cursor-label width at the widest point of the semicircle.
      // The centre therefore remains stable while the TWA changes.
      const currentLabelExtent = radius + layerOffset.cursor + currentLabelWidth
      const maximumCenterX = width - Math.max(radius + layerOffset.cursor, currentLabelExtent) - margin
      const centerX = baseCenterX + viewOffsetRef.current.x
      const constrainedCenterX = minimumCenterX <= maximumCenterX
        ? Math.min(maximumCenterX, Math.max(minimumCenterX, centerX))
        : maximumCenterX
      viewOffsetRef.current.x = constrainedCenterX - baseCenterX
    }
    const point = (angle: number, speed: number) => {
      const { centerX, centerY, radius } = geometry()
      const r = speed / Math.max(1, model.maxSpeed) * radius
      const radians = angle * Math.PI / 180
      return { x: centerX + Math.sin(radians) * r, y: centerY - Math.cos(radians) * r }
    }
    const outerPoint = (angle: number, offset: number) => {
      const { centerX, centerY, radius } = geometry()
      const radians = angle * Math.PI / 180
      return { x: centerX + Math.sin(radians) * (radius + offset), y: centerY - Math.cos(radians) * (radius + offset) }
    }
    const resize = () => {
      const { height, width } = size(); const ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const draw = () => {
      resize()
      keepDiagramInFrame()
      const { height, width } = size(); const { centerX, centerY, radius } = geometry()
      const page = getComputedStyle(document.documentElement).getPropertyValue('--page').trim() || '#202124'
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#c8c8c8'
      const grid = getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || 'rgba(255,255,255,.25)'
      context.clearRect(0, 0, width, height); context.fillStyle = page; context.fillRect(0, 0, width, height)

      // Foils are a background reference: draw one continuous outline before
      // the grid, labels and sail curves so they stay readable when zooming.
      if (display.foils && model.foil) {
        const foil = model.foil
        const windIntensity = foilIntensity(model.tws, foil.twsMin, foil.twsMax, foil.twsMerge)
        const firstAngle = Math.max(0, foil.twaMin - foil.twaMerge)
        const lastAngle = Math.min(model.maxAngle, foil.twaMax + foil.twaMerge)
        const start = (firstAngle - 90) * Math.PI / 180
        const end = (lastAngle - 90) * Math.PI / 180

        context.save()
        if (windIntensity > 0) {
          context.beginPath(); context.moveTo(centerX, centerY); context.arc(centerX, centerY, radius, start, end); context.closePath()
          context.fillStyle = 'rgba(97, 181, 255, .12)'; context.fill()
        }
        context.lineCap = 'round'; context.lineWidth = 3
        for (let angle = firstAngle; angle < lastAngle; angle += .25) {
          const nextAngle = Math.min(lastAngle, angle + .25)
          const intensity = foilCoverage((angle + nextAngle) / 2, model.tws, foil)
          if (intensity <= 0) continue
          context.beginPath(); context.arc(centerX, centerY, radius + layerOffset.foils, (angle - 90) * Math.PI / 180, (nextAngle - 90) * Math.PI / 180)
          context.strokeStyle = foilColor(intensity, .35 + intensity * .6); context.stroke()
        }
        context.restore()
      }
      context.save(); context.strokeStyle = grid; context.fillStyle = ink; context.lineWidth = 1; context.font = '10px Arial'
      const rings = 4
      for (let ring = 1; ring <= rings; ring += 1) {
        context.beginPath(); context.arc(centerX, centerY, radius * ring / rings, -Math.PI / 2, Math.PI / 2); context.stroke()
        context.fillText(`${number(model.maxSpeed * ring / rings, 0)} ${unit}`, centerX - 5, centerY - radius * ring / rings - 3)
      }
      context.textAlign = 'center'; context.textBaseline = 'middle'
      for (let angle = 0; angle <= 180; angle += 10) {
        const radians = angle * Math.PI / 180
        const x = centerX + Math.sin(radians) * radius; const y = centerY - Math.cos(radians) * radius
        const label = outerPoint(angle, layerOffset.degrees)
        context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(x, y); context.stroke()
        context.fillText(`${angle}°`, label.x, label.y)
      }
      context.restore()

      // Les secteurs hors des angles de meilleur VMG restent visibles même
      // lorsque les autres couches de la polaire sont masquées.
      const drawVmgExclusion = (from: number, to: number) => {
        const start = (from - 90) * Math.PI / 180; const end = (to - 90) * Math.PI / 180
        const labelAngle = from === 0 ? to : from
        context.save(); context.beginPath(); context.moveTo(centerX, centerY); context.arc(centerX, centerY, radius, start, end); context.closePath()
        context.fillStyle = 'rgba(200, 0, 0, .18)'; context.fill(); context.strokeStyle = '#d00000'; context.setLineDash([3, 5]); context.stroke(); context.setLineDash([])
        const boundary = point(labelAngle, model.maxSpeed)
        const extension = outerPoint(labelAngle, limitExtension)
        context.beginPath(); context.moveTo(boundary.x, boundary.y); context.lineTo(extension.x, extension.y); context.setLineDash([3, 5]); context.stroke(); context.setLineDash([])
        context.fillStyle = '#f00000'; context.font = 'bold 10px Arial'
        const label = outerPoint(labelAngle, layerOffset.vmg); context.fillText(`${number(labelAngle, 1)}°`, label.x + 3, label.y)
        context.restore()
      }
      drawVmgExclusion(0, model.vmg.up.angle)
      drawVmgExclusion(model.vmg.down.angle, 180)

      if (display.sails) for (const sail of model.selected) {
        context.save(); context.beginPath()
        model.samples.forEach((sample, index) => {
          const p = point(sample.angle, sample.all[sail] ?? 0)
          if (index === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y)
        })
        context.lineTo(centerX, centerY); context.closePath(); context.globalAlpha = .12; context.fillStyle = sailColors[sail]; context.fill()
        context.globalAlpha = .9; context.lineWidth = 1.15; context.strokeStyle = sailColors[sail]; context.stroke(); context.restore()
      }
      // Le contour automatique est toujours visible. Le mode Voiles Auto ne
      // masque pas les courbes : il change seulement la tolérance de plage.
      {
        context.save(); context.lineWidth = 2.5
        model.samples.forEach((sample, index) => {
          if (index === 0) return
          const previous = model.samples[index - 1]
          const start = point(previous.angle, previous.best.speed); const end = point(sample.angle, sample.best.speed)
          context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y)
          context.strokeStyle = sailColors[previous.best.sail]; context.stroke()
        })
        context.restore()
      }

      const pointOnCurve = point(twa, model.current.speed)
      const current = outerPoint(twa, layerOffset.cursor)
      const cursorEnd = outerPoint(twa, cursorExtension)
      context.save(); context.strokeStyle = sailColors[model.current.sail]; context.setLineDash([4, 4]); context.lineWidth = 1.5
      context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(cursorEnd.x, cursorEnd.y); context.stroke(); context.setLineDash([])
      context.fillStyle = sailColors[model.current.sail]; context.beginPath(); context.arc(pointOnCurve.x, pointOnCurve.y, 3, 0, Math.PI * 2); context.fill()
      context.font = 'bold 10px Arial'; context.textAlign = 'left'; context.textBaseline = 'middle'
      const lines = cursorLines()
      const labelWidth = Math.max(...lines.map((line) => context.measureText(line).width))
      const labelHalfHeight = (lines.length - 1) * 14 / 2
      const labelX = Math.max(5, Math.min(width - labelWidth - 5, current.x + 5))
      const labelY = Math.max(labelHalfHeight + 7, Math.min(height - labelHalfHeight - 7, current.y))
      lines.forEach((line, index) => context.fillText(line, labelX, labelY + (index - (lines.length - 1) / 2) * 14))
      context.restore()

      // Bornes de changement de la voile actuellement retenue.
      context.save(); context.strokeStyle = sailColors[model.current.sail]; context.fillStyle = context.strokeStyle; context.lineWidth = 2; context.setLineDash([3, 5]); context.font = 'bold 10px Arial'
      for (const angle of [model.sailRange.twa.min, model.sailRange.twa.max]) {
        if (angle <= 0 || angle >= model.maxAngle) continue
        const boundary = outerPoint(angle, limitExtension)
        context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(boundary.x, boundary.y); context.stroke()
        const label = outerPoint(angle, layerOffset.sailRange); context.fillText(`${number(angle, 1)}°`, label.x + 3, label.y)
      }
      context.setLineDash([]); context.restore()
    }
    const setAngleFromEvent = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect(); const { centerX, centerY } = geometry()
      const x = event.clientX - bounds.left - centerX; const y = event.clientY - bounds.top - centerY
      let angle = Math.atan2(x, -y) * 180 / Math.PI
      if (angle < 0) angle = angle > -90 ? 0 : 180
      onTwaChange(Math.round(Math.min(model.maxAngle, Math.max(0, angle)) * 10) / 10)
    }
    const onDown = (event: MouseEvent) => { drawing = true; setAngleFromEvent(event) }
    const onMove = (event: MouseEvent) => { if (drawing || event.buttons === 1) setAngleFromEvent(event) }
    const onUp = () => { drawing = false }
    const onWheel = (event: WheelEvent) => {
      const bounds = canvas.getBoundingClientRect()
      const pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      const previousZoom = zoomRef.current
      const previous = geometry()
      const relativeX = pointer.x - previous.centerX
      const relativeY = pointer.y - previous.centerY
      const isOverPolar = relativeX >= 0 && Math.hypot(relativeX, relativeY) <= previous.radius
      if (!isOverPolar) return

      event.preventDefault()
      zoomRef.current = Math.min(2.8, Math.max(1, previousZoom * (event.deltaY < 0 ? 1.12 : .89)))

      // Conserve le point sous le curseur pendant le changement d'échelle.
      // Le diagramme peut ainsi être zoomé directement sur sa partie basse.
      const factor = zoomRef.current / previousZoom
      const { height, width } = size()
      const radius = diagramRadius()
      const baseCenterX = isFocusMode ? (width - radius) / 2 + Math.min(width * .12, 144) : width * .08
      const baseCenterY = height / 2
      viewOffsetRef.current = {
        x: pointer.x - factor * (pointer.x - previous.centerX) - baseCenterX,
        y: pointer.y - factor * (pointer.y - previous.centerY) - baseCenterY,
      }
      keepDiagramInFrame()
      draw()
    }
    const resetZoom = () => { zoomRef.current = 1; viewOffsetRef.current = { x: 0, y: 0 }; draw() }
    resetZoomRef.current = resetZoom
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    canvas.addEventListener('mousedown', onDown); canvas.addEventListener('mousemove', onMove); canvas.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('mouseup', onUp); window.addEventListener('resize', draw); draw()
    return () => { resetZoomRef.current = () => undefined; observer.disconnect(); canvas.removeEventListener('mousedown', onDown); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('wheel', onWheel); window.removeEventListener('mouseup', onUp); window.removeEventListener('resize', draw) }
  }, [display, isFocusMode, locale, model, onTwaChange, theme, twa])

  return <canvas aria-label={`${locale === 'fr' ? 'Polaire visuelle' : 'Visual polar'}; True Wind Angle ${formatPolarNumber(twa, 1, locale)}°; True Wind Speed ${formatPolarNumber(model.tws, 2, locale)} ${polarUnit(locale)}`} className="expert-polar-diagram" ref={canvasRef} role="img" />
})

export function ExpertPolarPanel({ boat, display, embedded = false, isFocusMode, locale, onDisplayChange, onLayoutChange, onTwaChange, onTwsChange, options, selectedSails, theme, twa, tws }: ExpertPolarPanelProps) {
  const { data: polar, error } = usePolarData(boat)
  const calculationOptions = useMemo<PolarCalculationOptions>(() => ({ foil: options.foil, hull: options.hull, sails: Array.from(selectedSails) }), [options.foil, options.hull, selectedSails])
  const model = useMemo(() => polar ? buildModel(polar, calculationOptions, twa, tws, display.auto) : undefined, [calculationOptions, display.auto, polar, twa, tws])
  const diagramRef = useRef<ExpertPolarDiagramHandle>(null)
  const currentSail = model ? getSailName(model.current.sail, locale) : ''
  const fr = locale === 'fr'
  const layoutLabel = isFocusMode ? (fr ? 'Revenir à la grille' : 'Back to grid') : (fr ? 'Afficher la polaire en focus' : 'Focus on the polar diagram')
  const unit = polarUnit(locale)
  const number = (value: number, digits = 2) => formatPolarNumber(value, digits, locale)

  if (error) return <div className="expert-panel-container"><section className="expert-polar-panel">{localizePolarText(error, locale)}</section></div>
  if (!model) return <div className="expert-panel-container"><section className="expert-polar-panel expert-polar-loading">{fr ? 'Calcul de la polaire experte…' : 'Calculating the expert polar…'}</section></div>

  return (
    <div className="expert-panel-container"><section className="expert-polar-panel" aria-label={fr ? 'Polaire experte' : 'Expert polar'}>
      <div className="expert-diagram-column">
        <div className="expert-diagram-actions chart-actions">
          <button aria-label={fr ? 'Réinitialiser le zoom de la polaire' : 'Reset polar zoom'} className="icon-button expert-polar-reset" onClick={() => diagramRef.current?.resetZoom()} title={fr ? 'Réinitialiser le zoom' : 'Reset zoom'} type="button"><ChartActionIcon action="reset" /></button>
          <button aria-label={layoutLabel} className="icon-button expert-polar-layout" onClick={() => onLayoutChange(isFocusMode ? 'grid' : 'focus')} title={layoutLabel} type="button"><ChartActionIcon action={isFocusMode ? 'grid' : 'focus'} /></button>
          <ChartHelpLink embedded={embedded} locale={locale} theme={theme} topic="polar-diagram" />
        </div>
        <div className="expert-diagram-wrap"><ExpertPolarDiagram display={display} isFocusMode={isFocusMode} locale={locale} model={model} onTwaChange={onTwaChange} ref={diagramRef} theme={theme} twa={twa} /></div>
      </div>
      <aside className="expert-info-panel">
        <div className="expert-diagram-toolbar" aria-label={fr ? 'Affichage de la polaire' : 'Polar display'}>
          <button aria-pressed={display.sails} className={display.sails ? 'is-active' : ''} onClick={() => onDisplayChange('sails')} type="button">{fr ? 'Toutes' : 'All sails'}</button>
          <button aria-pressed={display.foils} className={display.foils ? 'is-active' : ''} onClick={() => onDisplayChange('foils')} type="button">Foils</button>
          <button aria-pressed={display.auto} className={display.auto ? 'is-active' : ''} onClick={() => onDisplayChange('auto')} type="button">{fr ? 'Voiles Auto' : 'Auto Sails'}</button>
        </div>
        <div className="expert-conditions">
          <RangeNumberField id="expert-twa" label="True Wind Angle" max={180} min={0} onChange={onTwaChange} unit="°" value={twa} />
          <RangeNumberField id="expert-tws" label="True Wind Speed" max={40} min={1} onChange={onTwsChange} step={0.01} unit={unit} value={tws} />
        </div>
        <section><h3>{fr ? 'Actuelle' : 'Current'}</h3><dl><dt>TWA</dt><dd>{number(twa, 1)}°</dd><dt>{fr ? 'Vitesse' : 'Speed'}</dt><dd>{number(model.current.speed)} {unit}</dd><dt>VMG</dt><dd>{number(Math.abs(model.current.vmg))} {unit}</dd><dt>{fr ? 'Voile' : 'Sail'}</dt><dd>{currentSail}</dd></dl></section>
        <section><h3>{fr ? 'Vitesse max' : 'Best Speed'}</h3><dl><dt>TWA</dt><dd>{number(model.max.angle, 1)}°</dd><dt>{fr ? 'Vitesse' : 'Speed'}</dt><dd>{number(model.max.speed)} {unit}</dd><dt>{fr ? 'Voile' : 'Sail'}</dt><dd>{getSailName(model.max.sail, locale)}</dd></dl></section>
        <section><h3>Best VMG</h3><dl><dt>{fr ? 'Au près' : 'Upwind'}</dt><dd>{number(model.vmg.up.angle, 1)}° · {number(model.vmg.up.value)} {unit}</dd><dt>{fr ? 'Au portant' : 'Downwind'}</dt><dd>{number(model.vmg.down.angle, 1)}° · {number(model.vmg.down.value)} {unit}</dd></dl></section>
        <section><h3>{fr ? 'Plage' : 'Range'} {currentSail}</h3><dl><dt>{fr ? 'TWA mini' : 'TWA min'}</dt><dd>{number(model.sailRange.twa.min, 1)}°</dd><dt>{fr ? 'TWA maxi' : 'TWA max'}</dt><dd>{number(model.sailRange.twa.max, 1)}°</dd><dt>{fr ? 'TWS mini' : 'TWS min'}</dt><dd>{number(model.sailRange.tws.min, 1)} {unit}</dd><dt>{fr ? 'TWS maxi' : 'TWS max'}</dt><dd>{number(model.sailRange.tws.max, 1)} {unit}</dd></dl></section>
        <section className="expert-sails-info">
          <h3>{fr ? 'Voiles' : 'Sails'}</h3>
          <table>
            <thead><tr><th>{fr ? 'Voiles' : 'Sails'}</th><th>{fr ? 'Vitesse' : 'Speed'}<br />({unit})</th><th>VMG<br />({unit})</th></tr></thead>
            <tbody>{model.selected.map((sail) => {
              const speed = model.current.all[sail] ?? 0
              const active = sail === model.current.sail
              const overlap = display.auto && !active && speed * (polar?.autoSailChangeTolerance ?? 1.014) > model.current.speed
              return <tr className={active ? 'is-active' : ''} key={sail}>
                <td>{getSailName(sail, locale)}</td>
                <td>{number(speed)}{overlap && <small> ({number(model.current.speed)})</small>}</td>
                <td>{number(Math.abs(speed * Math.cos(twa * Math.PI / 180)))}</td>
              </tr>
            })}</tbody>
          </table>
        </section>
      </aside>
    </section></div>
  )
}
