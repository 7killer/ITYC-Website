import { expect, test, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

const polar = {
  twa: [0, 180], tws: [0, 35],
  sail: [{ name: 'Jib', speed: [[0, 0], [8, 10]] }],
  winch: {
    lws: 0, hws: 35,
    tack: { std: { lw: { timer: 120 }, hw: { timer: 240 } } },
    gybe: { std: { lw: { timer: 120 }, hw: { timer: 240 } } },
    sailChange: { std: { lw: { timer: 180 }, hw: { timer: 360 } } },
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(polar) }))
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }))
})

async function readCurve(page: Page, index: number, showFineTooltip = false) {
  return page.evaluate(async ({ index, showFineTooltip }) => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#analysis-card-${index} canvas`)!
    const chart = ChartConstructor.getChart(canvas) as Chart<'line'>
    const points = chart.data.datasets[0].data as Array<{ x: number; y: number }>
    if (showFineTooltip) {
      const pointIndex = points.findIndex(point => point.x === 10.01)
      const point = chart.getDatasetMeta(0).data[pointIndex]
      chart.tooltip!.setActiveElements([{ datasetIndex: 0, index: pointIndex }], { x: point.x, y: point.y })
      chart.update('none')
    }
    return {
      id: chart.id, count: points.length, datasets: chart.data.datasets.length,
      first: points[0].x, second: points[1].x, last: points[points.length - 1].x,
      commonValue: points.find(point => point.x === 10.1)?.y,
      title: chart.tooltip?.title?.join(' ') ?? '',
    }
  }, { index, showFineTooltip })
}

for (const tool of [{ file: 'energy', state: 'energy', cards: 2 }, { file: 'pena', state: 'penalties', cards: 3 }]) {
  test(`${tool.file} change réellement le pas TWS de chaque carte et conserve les autres courbes`, async ({ page }) => {
    await page.goto(`/${tool.file}.html?lang=fr&th=dark`)
    await expect(page.locator('.analysis-card canvas')).toHaveCount(tool.cards)
    // The second dataset appears after the polar's identical tack/gybe
    // coefficients have been loaded, so later redraws cannot mask independence.
    await expect.poll(async () => (await readCurve(page, 0)).datasets).toBe(2)
    const first = page.locator('#analysis-card-0 .chart-precision-button')
    const second = page.locator('#analysis-card-1 .chart-precision-button')
    await expect(first).toHaveText('0,1')
    await expect(second).toHaveText('0,1')
    const coarse = await readCurve(page, 0)
    const untouched = await readCurve(page, 1)
    expect(coarse).toMatchObject({ count: 351, first: 0, second: .1, last: 35 })
    if (tool.file === 'pena') await expect(page.locator('#analysis-card-2 .chart-precision-button')).toHaveCount(0)

    await first.click()
    await expect(first).toHaveText('0,01')
    const fine = await readCurve(page, 0, true)
    expect(fine).toMatchObject({ count: 3501, first: 0, second: .01, last: 35 })
    expect(fine.commonValue).toBeCloseTo(coarse.commonValue!, 10)
    expect(fine.title).toBe('True Wind Speed : 10,01 nds')
    expect(await readCurve(page, 1)).toMatchObject({ id: untouched.id, count: 351 })

    await second.click()
    expect(await readCurve(page, 1)).toMatchObject({ count: 3501, second: .01 })
    await expect.poll(() => page.evaluate(state => JSON.parse(sessionStorage.getItem(`ityc:tool-page:${state}`)!).chartPrecisions, tool.state))
      .toEqual({ 0: '0.01', 1: '0.01' })
    await page.reload()
    await expect(page.locator('.chart-precision-button')).toHaveText(['0,01', '0,01'])
    await first.click()
    expect(await readCurve(page, 0)).toMatchObject({ count: 351, second: .1 })
    expect(await readCurve(page, 1)).toMatchObject({ count: 3501, second: .01 })
  })
}

for (const width of [390, 1540, 1660]) {
  test(`les quatre commandes Énergie restent distinctes des réglages à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 })
    await page.goto('/energy.html?lang=fr&th=dark')
    for (const card of await page.locator('.analysis-card').all()) {
      const geometry = await card.evaluate(card => {
        const bounds = (element: Element) => {
          const { left, right, top, bottom } = element.getBoundingClientRect()
          return { left, right, top, bottom }
        }
        return {
          heading: bounds(card.querySelector('.analysis-card-heading h2')!),
          buttons: [...card.querySelectorAll('.chart-actions > .icon-button')].map(bounds),
          fields: [...card.querySelectorAll('.energy-settings-controls > .range-field')].map(bounds),
        }
      })
      const overlaps = (a: typeof geometry.heading, b: typeof geometry.heading) =>
        a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1
      expect(geometry.buttons).toHaveLength(4)
      for (const button of geometry.buttons) {
        expect(overlaps(button, geometry.heading)).toBe(false)
        for (const field of geometry.fields) expect(overlaps(button, field)).toBe(false)
      }
      for (const field of geometry.fields) expect(overlaps(field, geometry.heading)).toBe(false)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
  })
}
