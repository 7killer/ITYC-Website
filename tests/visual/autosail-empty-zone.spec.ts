import { expect, test, type Page } from '@playwright/test'

// A small wind/angle domain keeps the real worker inexpensive. LightGnk is
// twice as fast as Code0, so Code0 has no usage zone while LightGnk is selected.
const polar = {
  twa: [0, 10, 20],
  tws: [0, 10, 20],
  sail: [
    { name: 'Code0', speed: [[0, 0, 0], [4, 5, 6], [4, 5, 6]] },
    { name: 'LightGnk', speed: [[0, 0, 0], [8, 10, 12], [8, 10, 12]] },
  ],
}

const emptyMessage = 'Pas de zone d’utilisation.'

test.use({ viewport: { width: 1440, height: 1100 } })

async function openAutoSails(page: Page, selectedSails: string[]) {
  await page.route('**/data/export/class40_2021.json', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify(polar),
  }))
  await page.addInitScript(selected => {
    localStorage.setItem('locale', 'fr')
    sessionStorage.setItem('ityc:tool-page:autosail', JSON.stringify({
      boat: 'Class 40 2021',
      options: { foil: false, hull: false, fullPack: false },
      selectedSails: selected,
      sailForRange: 'Code0',
      firstOverlapSail: 'Code0',
      secondOverlapSail: 'LightGnk',
      overlapPrecision: '0.1',
    }))
  }, selectedSails)
  await page.goto('/#autosail')
}

test('une zone d’utilisation vide affiche un resultat terminal apres reduction des voiles', async ({ page }) => {
  await openAutoSails(page, ['Code0', 'LightGnk'])
  await page.locator('label[for="sail-Code0"]').click()
  await expect(page.locator('#sail-Code0')).not.toBeChecked()
  await expect(page.locator('#sail-LightGnk')).toBeChecked()

  const usage = page.locator('#autosail-chart-2 .autosail-chart')
  await expect(usage.getByText(emptyMessage, { exact: true })).toBeVisible()
  await expect(usage.locator('canvas')).toHaveCount(0)
  await expect(usage.locator('p').filter({ hasText: /^Calcul/ })).toHaveCount(0)
})

test('une voile utilisable conserve sa courbe et termine le calcul', async ({ page }) => {
  await openAutoSails(page, ['Code0'])
  const usage = page.locator('#autosail-chart-2 .autosail-chart')
  await expect(usage.locator('canvas')).toHaveCount(1)
  await expect(usage.getByText(emptyMessage, { exact: true })).toHaveCount(0)
  await expect(usage.locator('p').filter({ hasText: /^Calcul/ })).toHaveCount(0)
})
