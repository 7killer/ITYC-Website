import { expect, test } from '@playwright/test'

const markdown = `# Hiérarchie des titres

## 1. Chapitre principal

### 1.1 Sous-chapitre

#### 1.1.1 Détail

Texte du premier chapitre.

## 2) Courbe de référence $f(tws)$

### 2.1 Sous-chapitre

#### 2.1.1 Détail

Texte du second chapitre.
`

for (const viewport of [{ width: 1440, height: 1000 }, { width: 360, height: 800 }]) {
  test(`les titres numérotés conservent leur hiérarchie et leurs mathématiques à ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.route('**/content/fr/tuto_pena.md?*', async route => {
      if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
      const response = await route.fetch()
      await route.fulfill({ response, body: `export default ${JSON.stringify(markdown)}` })
    })
    await page.goto('/#aide?article=tuto_pena')

    const links = page.locator('.help-content-section > h3 > .help-heading-link')
    await expect(links).toHaveCount(2)
    await expect(links.first()).toHaveText('1. Chapitre principal')
    await expect(links.nth(1)).toContainText('2) Courbe de référence')
    await expect(links.locator('ol, ul, li')).toHaveCount(0)
    await expect(page.locator('.help-subsections ol, .help-toc ol, .help-inline-toc ol')).toHaveCount(0)
    await expect(links.nth(1).locator('.katex-html')).toBeVisible()
    await expect(links.nth(1).locator('.katex annotation[encoding="application/x-tex"]')).toHaveText('f(tws)')

    await page.evaluate(async () => { await document.fonts.ready })
    const typography = await page.locator('.help-content-section').first().evaluate(section => {
      const h3 = section.querySelector('h3')!
      const size = (element: Element) => Number.parseFloat(getComputedStyle(element).fontSize)
      return {
        h3: size(h3),
        h4: size(section.querySelector('h4')!),
        h5: size(section.querySelector('h5')!),
        descendants: [...h3.querySelectorAll('a, span')].map(size),
      }
    })
    expect(typography.h3).toBeGreaterThan(typography.h4)
    expect(typography.h4).toBeGreaterThan(typography.h5)
    expect(typography.descendants.length).toBeGreaterThan(0)
    for (const size of typography.descendants) expect(size).toBe(typography.h3)
  })
}
