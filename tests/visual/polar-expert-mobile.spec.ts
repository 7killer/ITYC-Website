import { expect, test, type Locator } from '@playwright/test'

type PolarRing = { x: number; y: number; radius: number }
declare global {
  interface Window { expertDrawnRings: WeakMap<HTMLCanvasElement, PolarRing[]> }
}

async function expectDiagramInFrame(canvas: Locator) {
  await expect.poll(() => canvas.evaluate(element => window.expertDrawnRings.get(element as HTMLCanvasElement)?.length ?? 0)).toBeGreaterThanOrEqual(4)
  const geometry = await canvas.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const rings = window.expertDrawnRings.get(element as HTMLCanvasElement) ?? []
    return { width: bounds.width, height: bounds.height, ring: rings.reduce((outer, ring) => ring.radius > outer.radius ? ring : outer) }
  })
  expect(geometry.width, 'Le dessin doit disposer d’une largeur utile sur mobile').toBeGreaterThanOrEqual(260)
  expect(geometry.height).toBeGreaterThanOrEqual(260)
  expect(geometry.ring.radius, 'La polaire ne doit pas être réduite à un tracé minuscule').toBeGreaterThan(100)
  expect(geometry.ring.x, 'Le centre de la polaire doit rester dans le canvas').toBeGreaterThanOrEqual(0)
  expect(geometry.ring.x + geometry.ring.radius).toBeLessThanOrEqual(geometry.width + 1)
  expect(geometry.ring.y - geometry.ring.radius).toBeGreaterThanOrEqual(-1)
  expect(geometry.ring.y + geometry.ring.radius).toBeLessThanOrEqual(geometry.height + 1)
}

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1440, height: 1000 },
]) {
  for (const layout of ['grid', 'focus'] as const) {
    test(`la polaire Expert reste dans son cadre en ${layout} à ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport)
      await page.addInitScript(layout => {
        localStorage.setItem('locale', 'fr')
        sessionStorage.setItem('ityc:tool-page:polar', JSON.stringify({ level: 'expert', layout }))
        window.expertDrawnRings = new WeakMap()
        const clear = CanvasRenderingContext2D.prototype.clearRect
        const arc = CanvasRenderingContext2D.prototype.arc
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
          if (this.canvas.classList.contains('expert-polar-diagram')) window.expertDrawnRings.set(this.canvas, [])
          return clear.apply(this, args)
        }
        CanvasRenderingContext2D.prototype.arc = function (x, y, radius, start, end, counterclockwise) {
          if (this.canvas.classList.contains('expert-polar-diagram') && Math.abs(start + Math.PI / 2) < .000001 && Math.abs(end - Math.PI / 2) < .000001) {
            const rings = window.expertDrawnRings.get(this.canvas) ?? []
            rings.push({ x, y, radius })
            window.expertDrawnRings.set(this.canvas, rings)
          }
          return arc.call(this, x, y, radius, start, end, counterclockwise)
        }
      }, layout)
      await page.goto('/#polaire')
      const canvas = page.locator('.expert-polar-diagram')
      await expect(canvas).toHaveCount(1)
      await page.evaluate(async () => { await document.fonts.ready })
      await expectDiagramInFrame(canvas)
      await canvas.scrollIntoViewIfNeeded()
      const bounds = await canvas.boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(-1)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1)
      await expect(canvas).toBeInViewport()
      await expect.poll(() => canvas.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        return document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2) === element
      }), { message: 'Les commandes fixes ne doivent pas masquer le centre du tracé' }).toBe(true)
      await page.getByRole('button', { name: 'Réinitialiser le zoom de la polaire', exact: true }).click()
      await expectDiagramInFrame(canvas)
      await canvas.scrollIntoViewIfNeeded()
      await page.screenshot({ path: testInfo.outputPath(`expert-viewport-${layout}-${viewport.width}.png`), animations: 'disabled' })
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1)
      await page.locator('.expert-polar-panel').screenshot({ path: testInfo.outputPath(`expert-${layout}-${viewport.width}.png`), animations: 'disabled' })
    })
  }
}
