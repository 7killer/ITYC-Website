import { expect, test, type Page } from '@playwright/test'
import type { Chart } from 'chart.js'

// Keep both real zone workers cheap, including the overlap's fine angle scan.
const polar = {
  twa: [0, 2, 4],
  tws: [0, 2, 4],
  sail: [
    { name: 'Code0', speed: [[0, 0, 0], [2, 3, 4], [1, 1.5, 2]] },
    { name: 'LightGnk', speed: [[0, 0, 0], [2.016, 3.024, 4.032], [1.008, 1.512, 2.016]] },
  ],
}

test.use({ viewport: { width: 1440, height: 1100 } })

async function chartData(page: Page, index: number) {
  return page.evaluate(async chartIndex => {
    const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
    const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
    if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
    const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
    const canvas = document.querySelector<HTMLCanvasElement>(`#autosail-chart-${chartIndex} canvas`)
    const chart = canvas ? ChartConstructor.getChart(canvas) as Chart<'line'> | undefined : undefined
    return chart?.data.datasets.map(dataset => dataset.data.map(point => ({ ...(point as { x: number; y: number }) })))
  }, index)
}

async function sampleStep(page: Page, index: number) {
  const data = await chartData(page, index)
  return data?.[0]?.length ? Number((data[0][1].x - data[0][0].x).toFixed(2)) : undefined
}

test('les trois courbes AutoSail en TWS affinent leurs propres points et gardent leurs choix après rechargement', async ({ page }) => {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(polar) }))
  await page.goto('/autoSail.html?lang=fr&sails=Code0,LightGnk&o=&sailForTwa=Code0&sailForTws=LightGnk&sailForRange=Code0&firstOverlapSail=Code0&secondOverlapSail=LightGnk&twsStart=0.1&twsEnd=4')
  await expect(page.locator('.autosail-chart canvas')).toHaveCount(4)

  const button = (index: number) => page.locator(`#autosail-chart-${index} .chart-precision-button`)
  await expect(button(1)).toHaveCount(0)
  for (const index of [0, 2, 3]) {
    await expect(button(index)).toHaveText('0,1')
    expect(await sampleStep(page, index)).toBe(.1)
  }
  const angleData = await chartData(page, 1)
  const originalUsage = await chartData(page, 2)
  const originalOverlap = await chartData(page, 3)

  await button(0).click()
  await expect.poll(() => sampleStep(page, 0)).toBe(.01)
  expect(await chartData(page, 1)).toEqual(angleData)
  expect(await chartData(page, 2)).toEqual(originalUsage)
  expect(await chartData(page, 3)).toEqual(originalOverlap)
  const fineSpeed = await chartData(page, 0)

  await button(2).click()
  await expect.poll(() => sampleStep(page, 2)).toBe(.01)
  expect(await chartData(page, 0)).toEqual(fineSpeed)
  expect(await chartData(page, 1)).toEqual(angleData)
  expect(await chartData(page, 3)).toEqual(originalOverlap)
  // Usage precision changes its wind samples, while its angle bound stays 0.1°.
  expect((await chartData(page, 2))?.[1][0].y).toBe(.1)
  const fineUsage = await chartData(page, 2)

  await button(3).click()
  await expect.poll(() => sampleStep(page, 3)).toBe(.01)
  // Overlap precision continues to refine its angle samples as well.
  expect((await chartData(page, 3))?.[1][0].y).toBe(.01)
  expect(await chartData(page, 0)).toEqual(fineSpeed)
  expect(await chartData(page, 2)).toEqual(fineUsage)

  await page.getByRole('button', { name: 'English', exact: true }).click()
  for (const index of [0, 2, 3]) await expect(button(index)).toHaveText('0.01')
  expect(new URL(page.url()).searchParams.get('twsStart')).toBe('0.1')
  expect(new URL(page.url()).searchParams.get('twsEnd')).toBe('4')
  await expect(page.locator('#autosail-tws-start-number')).toHaveValue('0.1')
  await expect(page.locator('#autosail-tws-end-number')).toHaveValue('4.0')
  await page.reload()
  await expect(page.locator('.autosail-chart canvas')).toHaveCount(4)
  await expect(page.locator('#autosail-tws-start-number')).toHaveValue('0.1')
  await expect(page.locator('#autosail-tws-end-number')).toHaveValue('4.0')
  for (const index of [0, 2, 3]) {
    await expect(button(index)).toHaveText('0.01')
    expect(await sampleStep(page, index)).toBe(.01)
  }
})
