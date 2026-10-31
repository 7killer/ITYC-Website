import { expect, test } from '@playwright/test'

const pages = [
  { name: 'accueil', hash: '' },
  { name: 'polaires', hash: '#polaire' },
  { name: 'voiles-auto', hash: '#autosail' },
  { name: 'penalites', hash: '#penalites' },
  { name: 'energie', hash: '#energie' },
  { name: 'dash', hash: '#dash' },
]

const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablette-768', width: 768, height: 1024 },
  { name: 'ipad-air', width: 820, height: 1180 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    for (const tool of pages) {
      test(`${tool.name} reste lisible`, async ({ page }) => {
        await page.goto(`/${tool.hash}`)
        await expect(page.locator(tool.hash ? '.tool-page' : '.app-shell')).toBeVisible()
        await page.evaluate(async () => { await document.fonts.ready })
        if (tool.hash === '#polaire') {
          await expect(page.locator('.chart-card canvas')).toHaveCount(7)
          await expect(page.locator('.calculation-progress')).toHaveCount(0)
        } else if (tool.hash === '#autosail') {
          await expect(page.locator('.autosail-chart > p').filter({ hasText: /^Calcul/ })).toHaveCount(0, { timeout: 25_000 })
          const emptyOverlap = page.locator('#autosail-chart-3 .autosail-chart > p').filter({ hasText: /^Pas de zones de recouvrement\.$/ })
          await expect(page.locator('.autosail-card canvas')).toHaveCount(await emptyOverlap.count() ? 3 : 4)
        }
        await page.waitForTimeout(500)

        await expect(page).toHaveScreenshot(`${tool.name}-${viewport.name}.png`, {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixelRatio: .01,
        })
      })
    }
  })
}
