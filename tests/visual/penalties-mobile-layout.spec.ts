import { expect, test } from '@playwright/test'

for (const viewport of [{ width: 360, height: 800 }, { width: 390, height: 844 }]) {
  test(`la carte Rentabilité garde un graphique lisible sans débordement à ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/#penalites')
    const card = page.locator('.analysis-layout-grid #analysis-card-2')
    const chart = card.locator('.analysis-chart')
    await expect(chart.locator('canvas')).toBeVisible()
    await expect(card.locator('.penalty-rent-fields > .range-field')).toHaveCount(4)
    await page.evaluate(async () => { await document.fonts.ready })
    await expect.poll(async () => (await chart.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(320)

    const geometry = await card.evaluate(element => {
      const bounds = (target: Element) => {
        const { left, right, top, bottom, height } = target.getBoundingClientRect()
        return { left, right, top, bottom, height }
      }
      return {
        card: bounds(element),
        chart: bounds(element.querySelector('.analysis-chart')!),
        settings: bounds(element.querySelector('.penalty-rent-settings')!),
        fields: [...element.querySelectorAll('.penalty-rent-fields > .range-field')].map(bounds),
        nextCard: bounds(document.getElementById('analysis-card-1')!),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }
    })

    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth + 1)
    for (const field of geometry.fields) {
      expect(field.left).toBeGreaterThanOrEqual(geometry.card.left - 1)
      expect(field.right).toBeLessThanOrEqual(geometry.card.right + 1)
    }
    expect(geometry.chart.top).toBeGreaterThanOrEqual(geometry.settings.bottom - 1)
    expect(geometry.chart.bottom).toBeLessThanOrEqual(geometry.card.bottom + 1)
    expect(geometry.nextCard.top).toBeGreaterThanOrEqual(geometry.card.bottom - 1)
  })
}
