import { expect, test } from '@playwright/test'

test('les réglages Énergie restent sur la première ligne en grille', async ({ page }) => {
  await page.setViewportSize({ width: 1660, height: 900 })
  await page.goto('/#energie')

  const cards = page.locator('.analysis-layout-grid .analysis-card')
  const lost = cards.nth(0)
  const recovered = cards.nth(1)

  for (const card of [lost, recovered]) {
    const alignment = await card.evaluate((element) => {
      const heading = element.querySelector('.analysis-card-heading h2')!.getBoundingClientRect()
      const fields = [...element.querySelectorAll('.energy-settings-controls .range-field')].map((field) => field.getBoundingClientRect())
      const table = element.querySelector('.energy-settings-results')!.getBoundingClientRect()
      return { fields: fields.map(({ top }) => top), heading: heading.top, table: table.top }
    })

    expect(alignment.fields.every((top) => top <= alignment.heading)).toBe(true)
    expect(alignment.table).toBeGreaterThan(Math.max(...alignment.fields))
  }
})
