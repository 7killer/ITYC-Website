import { expect, test, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

const polar = {
  twa: [0, 60, 90, 120, 180],
  tws: [0, 2, 4],
  sail: [
    { name: 'Jib', speed: [[0, 0, 0], [0, 6, 12], [0, 5, 10], [0, 2, 4], [0, 1, 2]] },
    { name: 'Code0', speed: [[0, 0, 0], [0, 3, 6], [0, 4, 8], [0, 8, 16], [0, 2, 4]] },
  ],
}

declare global {
  interface Window {
    polarPrecisionRequests: Array<{ task?: string; precision?: string }>
    polarPrecisionMapWidth: number
  }
}

test.use({ viewport: { width: 1440, height: 1100 } })

test.beforeEach(async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(polar) }))
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.addInitScript(() => {
    localStorage.setItem('locale', 'fr')
    sessionStorage.clear()
    window.polarPrecisionRequests = []
    window.polarPrecisionMapWidth = 0
    const nativePost = Worker.prototype.postMessage
    Worker.prototype.postMessage = function (message, ...rest) {
      if (message.polar && message.requestId) {
        window.polarPrecisionRequests.push({ task: message.task, precision: message.precision })
        if (!message.task) this.addEventListener('message', ({ data }) => {
          if (data.type === 'result' && data.data?.twsValues) window.polarPrecisionMapWidth = data.data.twsValues.length
        })
      }
      return nativePost.call(this, message, ...(rest as [Transferable[]]))
    }
  })
})

async function samples(page: Page, index: number) {
  return page.evaluate(async index => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#polar-chart-${index} canvas`)
    const chart = canvas && ChartConstructor.getChart(canvas) as Chart<'line'> | undefined
    const points = chart?.data.datasets[0].data as Array<{ x: number; y: number }> | undefined
    return points ? { count: points.length, step: Number((points[1].x - points[0].x).toFixed(2)) } : undefined
  }, index)
}

test('les précisions Polaire sont indépendantes et les calculs dérivés de même pas sont réutilisés', async ({ page }) => {
  await page.goto('/polar.html?foil=false&hull=false&sails=Jib,Code0')
  await expect(page.locator('.chart-precision-button')).toHaveCount(6)
  await expect(page.locator('#polar-chart-0 .chart-precision-button')).toHaveCount(0)
  await expect.poll(() => samples(page, 1)).toEqual({ count: 40, step: .1 })
  await expect.poll(() => samples(page, 2)).toEqual({ count: 31, step: .1 })
  await expect.poll(() => page.evaluate(() => window.polarPrecisionMapWidth)).toBe(36)

  await page.locator('#polar-chart-1 .chart-precision-button').click()
  await expect.poll(() => samples(page, 1)).toEqual({ count: 391, step: .01 })
  await expect.poll(() => samples(page, 2)).toEqual({ count: 31, step: .1 })

  await page.locator('#polar-chart-2 .chart-precision-button').click()
  await expect.poll(() => samples(page, 2)).toEqual({ count: 301, step: .01 })
  await expect.poll(() => samples(page, 3)).toEqual({ count: 31, step: .1 })
  const fineWorkers = () => page.evaluate(() => window.polarPrecisionRequests.filter(request => request.task === 'derived' && request.precision === '0.01').length)
  expect(await fineWorkers()).toBe(1)
  await page.locator('#polar-chart-3 .chart-precision-button').click()
  await expect.poll(() => samples(page, 3)).toEqual({ count: 301, step: .01 })
  expect(await fineWorkers()).toBe(1)
  await page.locator('#polar-chart-2 .chart-precision-button').click()
  await expect.poll(() => samples(page, 2)).toEqual({ count: 31, step: .1 })
  await expect.poll(() => samples(page, 3)).toEqual({ count: 301, step: .01 })

  await page.locator('#polar-chart-6 .chart-precision-button').click()
  await expect.poll(() => page.evaluate(() => window.polarPrecisionMapWidth)).toBe(351)
  await expect(page.locator('#polar-chart-6 canvas')).toHaveCount(1)
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('ityc:tool-page:polar')!).chartPrecisions))
    .toMatchObject({ 1: '0.01', 2: '0.1', 3: '0.01', 6: '0.01' })
})

test('le TWS du diagramme expert conserve les centièmes à la saisie, au clavier et au curseur', async ({ page }) => {
  await page.goto('/polar.html?level=expert&layout=grid&foil=false&hull=false&sails=Jib,Code0')
  const input = page.locator('#expert-tws-number')
  const slider = page.locator('#expert-tws')
  await expect(slider).toHaveAttribute('step', '0.01')
  await expect(page.locator('.expert-diagram-actions .chart-precision-button')).toHaveCount(0)
  await input.fill('12,34')
  await input.blur()
  await expect(input).toHaveValue('12.34')
  await expect(slider).toHaveValue('12.34')
  await input.fill('12.34')
  await input.press('ArrowUp')
  await expect(input).toHaveValue('12.35')
  await slider.press('ArrowRight')
  await expect(slider).toHaveValue('12.36')
  await expect(input).toHaveValue('12.36')
  await expect(page.locator('.expert-polar-diagram')).toHaveAttribute('aria-label', /True Wind Speed 12,36 nds/)
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('ityc:tool-page:polar')!).tws)).toBe(12.36)
  await expect(page.locator('.site-header .main-navigation a[href*="polar.html"]')).toHaveAttribute('href', /[?&]ts=12\.36(?:&|$)/)
})
