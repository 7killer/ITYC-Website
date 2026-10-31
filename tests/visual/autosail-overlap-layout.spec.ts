import { expect, test } from '@playwright/test'
import type { Chart } from 'chart.js'

// These cases intentionally load the real Class 40 data and run both workers.
test.setTimeout(60_000)

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1280, height: 800 },
]) {
  test(`Code 0 et LJ affichent une zone de recouvrement stable à ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.addInitScript(() => {
      localStorage.setItem('locale', 'fr')
      sessionStorage.removeItem('ityc:tool-page:autosail')
    })
    await page.goto('/#autosail')
    await expect(page.getByRole('combobox', { name: 'Bateau', exact: true })).toHaveValue('Class 40 2021')

    const overlap = page.locator('#autosail-chart-3')
    const chart = overlap.locator('.autosail-chart')
    const firstSail = overlap.locator('.autosail-settings > label').filter({ hasText: 'Première voile' }).locator('select')
    const secondSail = overlap.locator('.autosail-settings > label').filter({ hasText: 'Seconde voile' }).locator('select')
    const empty = chart.getByText('Pas de zones de recouvrement.', { exact: true })

    await expect(firstSail).toHaveValue('Code0')
    await expect(secondSail).toHaveValue('Jib')
    await expect(overlap.getByRole('group', { name: 'Précision du recouvrement' })
      .getByRole('button', { name: '0,1', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(empty).toBeVisible({ timeout: 15_000 })
    await expect(chart.locator('canvas')).toHaveCount(0)

    await secondSail.selectOption('LightJib')
    await expect(secondSail).toHaveValue('LightJib')
    await expect(chart.locator('canvas')).toHaveCount(1, { timeout: 15_000 })
    await expect(empty).toHaveCount(0)
    await expect(chart.locator('p').filter({ hasText: /^Calcul/ })).toHaveCount(0)

    // A mounted canvas must contain actual finite upper/lower bounds, including
    // a nonzero interval; axes alone would not prove that the overlap exists.
    await expect.poll(() => page.evaluate(async () => {
      const source = await (await fetch('/src/shared/charts/InteractiveLineChart.tsx')).text()
      const moduleUrl = source.match(/from\s+["']([^"']*\/chart__js\.js[^"']*)["']/)?.[1]
      if (!moduleUrl) throw new Error('Module Chart.js du rendu introuvable')
      const { Chart: ChartConstructor } = await import(moduleUrl) as typeof import('chart.js')
      const canvas = document.querySelector<HTMLCanvasElement>('#autosail-chart-3 canvas')
      const rendered = canvas ? ChartConstructor.getChart(canvas) as Chart<'line'> | undefined : undefined
      if (!rendered || rendered.data.datasets.length !== 2) return false
      const upper = rendered.data.datasets[0].data as Array<{ x: number; y: number }>
      const lower = rendered.data.datasets[1].data as Array<{ x: number; y: number }>
      return upper.length > 0 && upper.length === lower.length
        && [...upper, ...lower].every(point => Number.isFinite(point.x) && Number.isFinite(point.y))
        && upper.some((point, index) => point.x === lower[index].x && point.y > lower[index].y)
    })).toBe(true)

    // Finish the more expensive usage-zone worker before checking page geometry.
    await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ }))
      .toHaveCount(0, { timeout: 25_000 })
    await expect(page.locator('.autosail-chart canvas')).toHaveCount(4)
    await page.evaluate(async () => { await document.fonts.ready })
    await overlap.scrollIntoViewIfNeeded()

    const samples = await overlap.evaluate(async card => {
      const chart = card.querySelector('.autosail-chart')!
      const canvas = chart.querySelector('canvas')!
      const settings = card.querySelector('.autosail-settings')!
      const bounds = (element: Element) => {
        const { left, right, top, bottom, width, height } = element.getBoundingClientRect()
        return { left, right, top, bottom, width, height }
      }
      const result = []
      for (let index = 0; index < 8; index++) {
        if (index) await new Promise(resolve => window.setTimeout(resolve, 100))
        result.push({
          documentHeight: document.documentElement.scrollHeight,
          documentWidth: document.documentElement.scrollWidth,
          card: bounds(card), chart: bounds(chart), canvas: bounds(canvas), settings: bounds(settings),
        })
      }
      return result
    })
    const spread = (values: number[]) => Math.max(...values) - Math.min(...values)
    expect(spread(samples.map(sample => sample.documentHeight)), 'La page reste stable après le calcul du recouvrement')
      .toBeLessThanOrEqual(1)
    for (const element of ['card', 'chart', 'canvas'] as const) {
      expect(spread(samples.map(sample => sample[element].height)), `La hauteur de ${element} reste stable`)
        .toBeLessThanOrEqual(1)
      expect(spread(samples.map(sample => sample[element].width)), `La largeur de ${element} reste stable`)
        .toBeLessThanOrEqual(1)
    }
    for (const sample of samples) {
      expect(sample.documentWidth).toBeLessThanOrEqual(viewport.width + 1)
      expect(sample.canvas.height).toBeGreaterThanOrEqual(320)
      expect(sample.canvas.width).toBeGreaterThan(0)
      expect(sample.canvas.left).toBeGreaterThanOrEqual(sample.card.left - 1)
      expect(sample.canvas.right).toBeLessThanOrEqual(sample.card.right + 1)
      expect(sample.chart.top).toBeGreaterThanOrEqual(sample.settings.bottom - 1)
      expect(sample.canvas.bottom).toBeLessThanOrEqual(sample.card.bottom + 1)
    }
  })
}
