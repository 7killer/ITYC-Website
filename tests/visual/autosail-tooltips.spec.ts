import { expect, test, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

const polar = {
  twa: [0, 90, 180],
  tws: [0, 20, 40],
  sail: [
    { name: 'Code0', speed: [[0, 0, 0], [8, 10, 12], [8, 10, 12]] },
    { name: 'LightGnk', speed: [[0, 0, 0], [8, 10.08, 15], [8, 12, 16]] },
  ],
}

declare global {
  interface Window { autosailDrawnText: WeakMap<HTMLCanvasElement, string[]> }
}

test.use({ viewport: { width: 1440, height: 1100 } })

test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(polar) }))
  await page.addInitScript(() => {
    localStorage.setItem('locale', 'fr')
    sessionStorage.setItem('ityc:tool-page:autosail', JSON.stringify({
      boat: 'Class 40 2021', twa: 90, tws: 20, twsStart: .1, twsEnd: 40, twaStart: 0, twaEnd: 180,
      options: { foil: false, hull: false, fullPack: false }, selectedSails: ['Code0', 'LightGnk'],
      sailForTwa: 'Code0', sailForTws: 'Code0', sailForRange: 'Code0', firstOverlapSail: 'Code0', secondOverlapSail: 'LightGnk',
    }))
    window.autosailDrawnText = new WeakMap()
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const fill = CanvasRenderingContext2D.prototype.fillText
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      window.autosailDrawnText.set(this.canvas, [])
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      const texts = window.autosailDrawnText.get(this.canvas) ?? []
      texts.push(args[0])
      window.autosailDrawnText.set(this.canvas, texts)
      return fill.apply(this, args)
    }
  })
  await page.goto('/#autosail')
  await expect(page.locator('#autosail-chart-0 canvas')).toHaveCount(1)
  await expect(page.locator('#autosail-chart-1 canvas')).toHaveCount(1)
})

async function tooltipAt(page: Page, chartIndex: number, x: number) {
  return page.evaluate(async ({ chartIndex, x }) => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#autosail-chart-${chartIndex} canvas`)!
    const chart = ChartConstructor.getChart(canvas) as Chart<'line'>
    const dataIndex = chart.data.datasets[0].data.findIndex(raw => Math.abs((raw as { x: number }).x - x) < .00001)
    if (dataIndex < 0) throw new Error(`Point ${x} absent de la courbe ${chartIndex}`)
    const point = chart.getDatasetMeta(0).data[dataIndex]
    chart.tooltip!.setActiveElements(chart.data.datasets.map((_, datasetIndex) => ({ datasetIndex, index: dataIndex })), { x: point.x, y: point.y })
    chart.update('none')
    return {
      datasets: chart.data.datasets.map(dataset => dataset.label),
      title: chart.tooltip!.title.join(' '),
      labels: chart.tooltip!.body.map(body => [...body.before, ...body.lines, ...body.after].join(' ')),
      drawn: window.autosailDrawnText.get(canvas) ?? [],
    }
  }, { chartIndex, x })
}

for (const axis of [
  { index: 0, name: 'TWS', overlap: 20, outside: 40, outsideSpeeds: ['15.000', '15.000', '12.000'] },
  { index: 1, name: 'TWA', overlap: 90, outside: 180, outsideSpeeds: ['12.000', '12.000', '10.000'] },
]) {
  test(`${axis.name} : trois vitesses, gain Auto en recouvrement et noms FR/EN sans rechargement`, async ({ page }) => {
    for (const locale of ['fr', 'en'] as const) {
      if (locale === 'en') await page.getByRole('button', { name: 'English', exact: true }).click()
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      const unit = locale === 'fr' ? 'nds' : 'kts'
      const light = locale === 'fr' ? 'Spi léger (LG)' : 'Light Gennaker'
      const title = (x: number) => `${axis.name} : ${x.toFixed(2)}${axis.name === 'TWS' ? ` ${unit}` : '°'}`
      const overlap = await tooltipAt(page, axis.index, axis.overlap)
      expect(overlap.datasets).toEqual(['Auto', 'Theo', 'Manu'])
      expect(overlap.title).toBe(title(axis.overlap))
      expect(overlap.labels).toEqual([
        `Auto : 10.080 (+0.080) ${unit} Code 0`,
        `Theo : 10.080 ${unit} ${light}`,
        `Manu : 10.000 ${unit} Code 0`,
      ])
      for (const label of overlap.labels) expect(overlap.drawn).toContain(label)

      const outside = await tooltipAt(page, axis.index, axis.outside)
      expect(outside.title).toBe(title(axis.outside))
      expect(outside.labels).toEqual([
        `Auto : ${axis.outsideSpeeds[0]} ${unit} ${light}`,
        `Theo : ${axis.outsideSpeeds[1]} ${unit} ${light}`,
        `Manu : ${axis.outsideSpeeds[2]} ${unit} Code 0`,
      ])
      for (const label of outside.labels) expect(outside.drawn).toContain(label)
    }
  })
}
