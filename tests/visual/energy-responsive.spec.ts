import { expect, test } from '@playwright/test'

for (const width of [820, 1280]) {
  test(`les réglages Énergie restent lisibles et sans chevauchement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/#energie')
    const cards = page.locator('.analysis-layout-grid .analysis-card:has(.energy-settings)')
    await expect(cards).toHaveCount(2)
    await expect(cards.locator('.energy-settings-controls .range-field')).toHaveCount(3)
    await page.evaluate(async () => { await document.fonts.ready })

    for (const card of await cards.all()) {
      const geometry = await card.evaluate(element => {
        const rect = (bounds: DOMRect) => ({ left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom })
        return {
          card: rect(element.getBoundingClientRect()),
          fields: [...element.querySelectorAll('.energy-settings-controls .range-field')].map(field => {
            // Measure the actual text, which can overflow a narrowed grid cell.
            const label = document.createRange()
            label.selectNodeContents(field.querySelector('span')!)
            return {
              field: rect(field.getBoundingClientRect()),
              label: rect(label.getBoundingClientRect()),
              input: rect(field.querySelector('.range-input-row')!.getBoundingClientRect()),
            }
          }),
        }
      })

      const overlaps = (first: typeof geometry.card, second: typeof geometry.card) =>
        first.left < second.right - 1 && first.right > second.left + 1
        && first.top < second.bottom - 1 && first.bottom > second.top + 1

      for (const [index, { field, label, input }] of geometry.fields.entries()) {
        expect(field.left).toBeGreaterThanOrEqual(geometry.card.left - 1)
        expect(field.right).toBeLessThanOrEqual(geometry.card.right + 1)
        expect(overlaps(label, input), 'Le libellé ne doit pas passer sous la saisie numérique').toBe(false)
        for (const other of geometry.fields.slice(index + 1)) {
          expect(overlaps(field, other.field), 'Les champs doivent rester distincts').toBe(false)
        }
      }
    }
  })
}
