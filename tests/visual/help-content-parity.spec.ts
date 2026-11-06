import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const documents = [
  'aide_pena', 'tuto_pena', 'aide_energy', 'tuto_energy', 'aide_polaire',
  'tuto_polaire', 'aide_autoSail', 'tuto_autoSail', 'aide_dash', 'glossaire',
] as const

for (const document of documents) {
  test(`la traduction de ${document} conserve la structure et les illustrations de référence`, () => {
    const source = (locale: string) => readFileSync(resolve('src/features/help/content', locale, `${document}.md`), 'utf8')
    const french = source('fr')
    const english = source('en')
    const levels = (text: string) => [...text.matchAll(/^(#{1,4}) /gm)].map(match => match[1].length)
    const layouts = (text: string) => text.match(/^:::(?:figure|table).*$/gm) ?? []
    const anchors = (text: string) => [...text.matchAll(/<!-- anchor:([^>]+) -->/g)].map(match => match[1])
    expect(levels(english)).toEqual(levels(french))
    expect(layouts(english)).toEqual(layouts(french))
    expect(english.match(/^!\[/gm)?.length ?? 0).toBe(french.match(/^!\[/gm)?.length ?? 0)
    expect(anchors(english)).toEqual(expect.arrayContaining(anchors(french)))
    expect(english.match(/\$\$/g)?.length ?? 0).toBe(french.match(/\$\$/g)?.length ?? 0)
  })
}

for (const locale of ['fr', 'en'] as const) {
  for (const article of ['aide_polaire', 'aide_autoSail'] as const) {
    test(`le chapitre de calcul ${article} est accessible, traduit et rechargeable (${locale})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 })
      await page.addInitScript(language => localStorage.setItem('locale', language), locale)
      await page.goto('/#aide')
      await page.locator(`.help-index-entry[href="#aide?article=${article}"]`).click()
      await expect(page.locator('.help-content-section').first()).toBeVisible()
      await expect(page.locator('.help-article .katex')).not.toHaveCount(0)
      await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
      await expect(page.locator(`.help-article-footer a[href*="ityc.fr/${article}"]`)).toHaveCount(0)
      await expect(page.locator('.help-article-footer a')).toHaveCount(1)

      const link = page.locator('.help-toc a[data-level="2"]').nth(1)
      const destination = await link.getAttribute('href')
      const sectionId = new URLSearchParams(destination!.split('?')[1]).get('section')!
      const chapter = page.locator(`[id="${sectionId}"]`)
      const alias = await chapter.locator(':scope > .help-anchor-alias').first().getAttribute('id')
      await link.click()
      await expect(chapter.locator(':scope > h3')).toBeInViewport()
      await page.reload()
      await expect(chapter.locator(':scope > h3')).toBeInViewport()

      await page.getByRole('button', { name: locale === 'fr' ? 'English' : 'Français', exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`article=${article}&section=${alias}$`))
      await expect(page.locator(`[id="${alias}"]`).locator('..').locator(':scope > h3')).toBeInViewport()
      await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
      await page.reload()
      await expect(page.locator(`[id="${alias}"]`).locator('..').locator(':scope > h3')).toBeInViewport()
    })
  }

  test(`les nouveaux calculs sont recherchables et lisibles sur mobile (${locale})`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.addInitScript(language => localStorage.setItem('locale', language), locale)
    await page.goto('/#aide')
    for (const [article, query] of [
      ['aide_polaire', 'interpolation'],
      ['aide_autoSail', locale === 'fr' ? 'tolérance' : 'tolerance'],
    ]) {
      await page.getByRole('searchbox').fill(query)
      await page.locator(`.help-result[href*="article=${article}"]`).first().click()
      await expect(page.locator('.help-content-section').first()).toBeVisible()
      await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
      await page.evaluate(async () => { await document.fonts.ready })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    }
  })
}

test('le changement de langue retrouve un détail Dashboard à partir de son lien français', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/aide.html?lang=fr#aide?article=aide_dash&section=ChromeInstallTab2')
  const detail = page.locator('h5').filter({ has: page.locator('#ChromeInstallTab2') })
  await expect(detail).toBeInViewport()
  const canonicalId = await detail.getAttribute('id')
  await page.goto(`/aide.html?lang=fr#aide?article=aide_dash&section=${canonicalId}`)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page).toHaveURL(/article=aide_dash&section=ChromeInstallTab2$/)
  await expect(page.locator('h5').filter({ has: page.locator('#ChromeInstallTab2') })).toBeInViewport()
  await page.reload()
  await expect(page.locator('h5').filter({ has: page.locator('#ChromeInstallTab2') })).toBeInViewport()
})

test('le changement de langue distingue deux titres qui partagent une ancienne ancre', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/aide.html?lang=fr#aide?article=tuto_polaire')
  const frenchHeading = page.locator('h4[id]').filter({ hasText: '1.2 Mode Grille Expert' })
  const section = await frenchHeading.getAttribute('id')
  await page.goto(`/aide.html?lang=fr#aide?article=tuto_polaire&section=${section}`)
  await expect(frenchHeading).toBeInViewport()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  const englishHeading = page.locator('h4[id]').filter({ hasText: '1.2 Expert Grid mode' })
  await expect(englishHeading).toBeInViewport()
  await expect(page).toHaveURL(new RegExp(`section=${await englishHeading.getAttribute('id')}$`))
  await page.reload()
  await expect(englishHeading).toBeInViewport()
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await expect(frenchHeading).toBeInViewport()
})
