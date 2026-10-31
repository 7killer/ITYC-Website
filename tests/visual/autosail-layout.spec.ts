import { expect, test } from '@playwright/test'

const polar = {
  twa: [0, 90, 180],
  tws: [0, 2, 4],
  sail: [
    { name: 'Code0', speed: [[0, 0, 0], [8, 10, 12], [4, 5, 6]] },
    { name: 'Jib', speed: [[0, 0, 0], [4, 5, 6], [2, 2.5, 3]] },
  ],
}

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
]) {
  test(`la hauteur des Voiles Auto reste stable après les calculs à ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.route('**/data/export/class40_2021.json', route => route.fulfill({
      contentType: 'application/json', body: JSON.stringify(polar),
    }))
    await page.addInitScript(() => {
      sessionStorage.setItem('ityc:tool-page:autosail', JSON.stringify({
        boat: 'Class 40 2021', layout: 'grid',
        options: { foil: false, hull: false, fullPack: false }, selectedSails: ['Code0', 'Jib'],
        sailForRange: 'Code0', firstOverlapSail: 'Code0', secondOverlapSail: 'Jib', overlapPrecision: '0.1',
        twa: 120, tws: 2, twsStart: .1, twsEnd: 4,
      }))
    })
    await page.goto('/#autosail')
    await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })).toHaveCount(0)
    await expect(page.locator('.autosail-chart canvas')).toHaveCount(3)
    await expect(page.locator('#autosail-chart-3 .autosail-chart > p')).toHaveText('Pas de zones de recouvrement.')
    await expect(page.locator('.autosail-settings .range-field')).toHaveCount(6)
    await page.evaluate(async () => { await document.fonts.ready })

    // Sample after both workers finish: their progress must not be mistaken for a resize loop.
    const samples = await page.evaluate(async () => {
      const result: Array<{ page: number; canvases: number[]; cards: number[]; width: number }> = []
      for (let index = 0; index < 8; index++) {
        if (index) await new Promise(resolve => window.setTimeout(resolve, 100))
        result.push({
          page: document.documentElement.scrollHeight,
          canvases: [...document.querySelectorAll('.autosail-chart canvas')].map(canvas => canvas.getBoundingClientRect().height),
          cards: [...document.querySelectorAll('.autosail-card')].map(card => card.getBoundingClientRect().height),
          width: document.documentElement.scrollWidth,
        })
      }
      return result
    })
    const spread = (values: number[]) => Math.max(...values) - Math.min(...values)
    expect(spread(samples.map(sample => sample.page)), 'La page ne doit pas grandir après la fin des calculs').toBeLessThanOrEqual(1)
    for (let index = 0; index < 3; index++) {
      expect(spread(samples.map(sample => sample.canvases[index])), `Le canvas ${index} doit conserver sa hauteur`).toBeLessThanOrEqual(1)
      expect(samples[0].canvases[index]).toBeGreaterThanOrEqual(320)
    }
    for (let index = 0; index < 4; index++) {
      expect(spread(samples.map(sample => sample.cards[index])), `La carte ${index} doit conserver sa hauteur`).toBeLessThanOrEqual(1)
    }
    for (const sample of samples) expect(sample.width).toBeLessThanOrEqual(viewport.width + 1)

    const fields = await page.locator('.autosail-settings .range-field').evaluateAll(elements => elements.map(element => {
      const label = document.createRange()
      label.selectNodeContents(element.querySelector('span')!)
      return {
        labelRight: label.getBoundingClientRect().right,
        inputLeft: element.querySelector('.range-input-row')!.getBoundingClientRect().left,
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right,
      }
    }))
    for (const field of fields) {
      expect(field.labelRight, 'Le libellé doit rester lisible avant la saisie numérique').toBeLessThanOrEqual(field.inputLeft + 1)
      expect(field.left).toBeGreaterThanOrEqual(-1)
      expect(field.right).toBeLessThanOrEqual(viewport.width + 1)
    }
  })
}
