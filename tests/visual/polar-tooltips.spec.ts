import { expect, test, type Page } from '@playwright/test'
import type { Chart, TooltipItem } from 'chart.js'

const names = [
  { fr: 'Foc (J)', en: 'Jib' },
  { fr: 'Spi (S)', en: 'Spi' },
  { fr: 'Trinquette (SS)', en: 'Staysail' },
  { fr: 'Génois léger (LJ)', en: 'Light jib' },
  { fr: 'Code 0', en: 'Code 0' },
  { fr: 'Spi lourd (HG)', en: 'Heavy Gennaker' },
  { fr: 'Spi léger (LG)', en: 'Light Gennaker' },
]

declare global {
  interface Window { polarDrawnText: WeakMap<HTMLCanvasElement, string[]> }
}

test.use({ viewport: { width: 1440, height: 1100 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('locale', 'fr')
    window.polarDrawnText = new WeakMap()
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const fill = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      window.polarDrawnText.set(this.canvas, [])
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      const texts = window.polarDrawnText.get(this.canvas) ?? []
      texts.push(args[0])
      window.polarDrawnText.set(this.canvas, texts)
      return fill.apply(this, args)
    }
  })
  await page.goto('/#polaire')
  await expect(page.locator('.chart-card canvas')).toHaveCount(7)
})

async function checkCurveTooltips(page: Page, locale: 'fr' | 'en') {
  return page.evaluate(async expectedNames => {
    // Import the same Chart.js module as the application to inspect live charts.
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    return Array.from({ length: 6 }, (_, chartIndex) => {
      const canvas = document.querySelector<HTMLCanvasElement>(`#polar-chart-${chartIndex} canvas`)!
      const chart = ChartConstructor.getChart(canvas) as Chart<'line'>
      const callback = chart.options.plugins!.tooltip!.callbacks!.label!
      let checked = 0
      for (const [datasetIndex, dataset] of chart.data.datasets.entries()) {
        for (const [dataIndex, raw] of dataset.data.entries()) {
          const point = raw as { x: number; y: number }
          const item = { chart, dataset, datasetIndex, dataIndex, raw, parsed: point } as TooltipItem<'line'>
          const label = callback.call(chart.tooltip!, item)
          if (typeof label !== 'string' || !expectedNames.some(name => label.endsWith(` ${name}`)) || label.includes(' Voile (')) {
            throw new Error(`Courbe ${chartIndex}, série ${datasetIndex}, point ${dataIndex} : ${String(label)}`)
          }
          checked++
        }
      }
      const point = chart.getDatasetMeta(0).data[0]
      chart.tooltip!.setActiveElements([{ datasetIndex: 0, index: 0 }], { x: point.x, y: point.y })
      chart.update('none')
      const text = window.polarDrawnText.get(canvas) ?? []
      if (!text.some(line => expectedNames.some(name => line.endsWith(` ${name}`)))) throw new Error(`Infobulle non dessinée : ${chartIndex}`)
      return checked
    })
  }, names.map(name => name[locale]))
}

test('les six courbes affichent les noms complets et changent de langue sans rechargement', async ({ page }) => {
  const french = await checkCurveTooltips(page, 'fr')
  expect(french).toHaveLength(6)
  expect(french.every(count => count > 0)).toBe(true)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  expect(await checkCurveTooltips(page, 'en')).toEqual(french)
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  expect(await checkCurveTooltips(page, 'fr')).toEqual(french)
})

test('la carte des voiles et le cartouche expert utilisent aussi les noms traduits', async ({ page }) => {
  const map = page.locator('.polar-sail-map canvas')
  await map.scrollIntoViewIfNeeded()
  const size = await map.boundingBox()
  if (!size) throw new Error('Carte des voiles invisible')
  let position = { x: size.width * .25, y: size.height * .75 }
  let selected: (typeof names)[number] | undefined
  for (const ratio of [.25, .45, .65, .85]) {
    position = { x: size.width * ratio, y: size.height * .75 }
    await map.hover({ position })
    const text = await map.evaluate(canvas => window.polarDrawnText.get(canvas as HTMLCanvasElement) ?? [])
    selected = names.find(name => name.fr !== name.en && text.some(line => line.startsWith(`${name.fr} · `)))
    if (selected) break
  }
  expect(selected, 'nom français complet sur la carte').toBeDefined()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await map.hover({ position })
  await expect.poll(() => map.evaluate(canvas => window.polarDrawnText.get(canvas as HTMLCanvasElement) ?? []))
    .toContainEqual(expect.stringContaining(`${selected!.en} · `))

  await page.getByRole('group', { name: 'Detail level' }).getByRole('button', { name: 'Expert', exact: true }).click()
  const expert = page.locator('.expert-polar-diagram')
  await expect(expert).toBeVisible()
  await expect.poll(async () => {
    const text = await expert.evaluate(canvas => window.polarDrawnText.get(canvas as HTMLCanvasElement) ?? [])
    return names.some(name => text.includes(name.en))
  }).toBe(true)
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await expect.poll(async () => {
    const text = await expert.evaluate(canvas => window.polarDrawnText.get(canvas as HTMLCanvasElement) ?? [])
    return names.some(name => text.includes(name.fr))
  }).toBe(true)
})
