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
      test(`${tool.name} sans débordement horizontal`, async ({ page }) => {
        await page.goto(`/${tool.hash}`)
        await expect(page.locator(tool.hash ? '.tool-page' : '.app-shell')).toBeVisible()
        await page.evaluate(async () => { await document.fonts.ready })

        const dimensions = await page.evaluate(() => {
          const viewportWidth = window.innerWidth
          const offenders = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
            .map((element) => ({ element, rect: element.getBoundingClientRect() }))
            .filter(({ element, rect }) => !element.closest('.site-header') && (rect.right > viewportWidth + 1 || rect.left < -1))
            .sort((left, right) => right.rect.right - left.rect.right)
            .map(({ element, rect }) => `${element.tagName.toLowerCase()}.${element.className || 'sans-classe'} (${Math.round(rect.left)}→${Math.round(rect.right)})`)
            .slice(0, 8)
          return { documentWidth: document.documentElement.scrollWidth, offenders, viewportWidth }
        })
        expect(dimensions.documentWidth, `largeur de page : ${dimensions.documentWidth}px pour un viewport de ${dimensions.viewportWidth}px ; éléments : ${dimensions.offenders.join(', ')}`)
          .toBeLessThanOrEqual(dimensions.viewportWidth + 1)
      })
    }
  })
}
