import { expect, test, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

const polar = {
  twa: [0, 90, 180],
  tws: [0, 20, 40],
  sail: [
    { name: 'Code0', speed: [[0, 0, 0], [8, 10, 12], [4, 5, 6]] },
    { name: 'LightGnk', speed: [[0, 0, 0], [8.064, 10.08, 12.096], [4.032, 5.04, 6.048]] },
  ],
}

declare global {
  interface Window {
    autosailZoneDrawnText: WeakMap<HTMLCanvasElement, string[]>
    autosailZoneWorkerStarts: number
  }
}

test.use({ viewport: { width: 1440, height: 1100 } })

test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(polar) }))
  await page.addInitScript(() => {
    localStorage.setItem('locale', 'fr')
    sessionStorage.setItem('ityc:tool-page:autosail', JSON.stringify({
      boat: 'Class 40 2021', options: { foil: false, hull: false, fullPack: false }, selectedSails: ['Code0', 'LightGnk'],
      sailForRange: 'Code0', firstOverlapSail: 'Code0', secondOverlapSail: 'LightGnk', overlapPrecision: '0.1',
    }))
    window.autosailZoneWorkerStarts = 0
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options)
        if (String(url).includes('autoSailZone.worker')) window.autosailZoneWorkerStarts++
      }
    }
    window.autosailZoneDrawnText = new WeakMap()
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const fill = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      window.autosailZoneDrawnText.set(this.canvas, [])
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      const texts = window.autosailZoneDrawnText.get(this.canvas) ?? []
      texts.push(args[0])
      window.autosailZoneDrawnText.set(this.canvas, texts)
      return fill.apply(this, args)
    }
  })
  await page.goto('/#autosail')
  await expect(page.locator('#autosail-chart-2 canvas')).toHaveCount(1)
  await expect(page.locator('#autosail-chart-3 canvas')).toHaveCount(1)
})

async function tooltipAtTwentyKnots(page: Page, chartIndex: number) {
  return page.evaluate(async chartIndex => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#autosail-chart-${chartIndex} canvas`)!
    const chart = ChartConstructor.getChart(canvas) as Chart<'line'>
    const dataIndex = chart.data.datasets[0].data.findIndex(raw => Math.abs((raw as { x: number }).x - 20) < .00001)
    if (dataIndex < 0) throw new Error(`Point TWS 20 absent de la zone ${chartIndex}`)
    const point = chart.getDatasetMeta(0).data[dataIndex]
    chart.tooltip!.setActiveElements(chart.data.datasets.map((_, datasetIndex) => ({ datasetIndex, index: dataIndex })), { x: point.x, y: point.y })
    chart.update('none')
    return {
      title: chart.tooltip!.title.join(' '),
      labels: chart.tooltip!.body.map(body => [...body.before, ...body.lines, ...body.after].join(' ')),
      drawn: window.autosailZoneDrawnText.get(canvas) ?? [],
    }
  }, chartIndex)
}

for (const zone of [{ index: 2, name: 'utilisation' }, { index: 3, name: 'recouvrement' }]) {
  test(`zone ${zone.name} : bornes TWA et vitesses optimales précises, FR/EN sans recalcul`, async ({ page }) => {
    const workersBefore = await page.evaluate(() => window.autosailZoneWorkerStarts)
    expect(workersBefore).toBeGreaterThan(0)
    for (const locale of ['fr', 'en'] as const) {
      if (locale === 'en') await page.getByRole('button', { name: 'English', exact: true }).click()
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      const unit = locale === 'fr' ? 'nds' : 'kts'
      const tooltip = await tooltipAtTwentyKnots(page, zone.index)
      expect(tooltip.title).toBe(`TWS : 20.00 ${unit}`)
      expect(tooltip.labels).toEqual([
        `Max TWA : 180.0° (5.04000 ${unit})`,
        `Min TWA : 0.1° (0.01120 ${unit})`,
      ])
      for (const line of [tooltip.title, ...tooltip.labels]) expect(tooltip.drawn).toContain(line)
      expect(await page.evaluate(() => window.autosailZoneWorkerStarts)).toBe(workersBefore)
    }
  })
}
