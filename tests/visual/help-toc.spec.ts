import { expect, test, type Locator, type Page } from '@playwright/test'

test.use({ viewport: { width: 1440, height: 1000 } })

const articleIds = [
  'aide_pena', 'tuto_pena', 'aide_energy', 'tuto_energy',
  'aide_polaire', 'tuto_polaire', 'aide_autoSail', 'tuto_autoSail', 'aide_dash',
] as const

const firstChapter = '1-premier-chapitre'
const secondChapter = '2-deuxieme-chapitre'
const thirdChapter = '3-chapitre-sans-sous-chapitre'
const firstParts = [
  `${firstChapter}-1-1-premiere-partie-1`,
  `${firstChapter}-1-2-seconde-partie-3`,
]
const secondParts = [
  `${secondChapter}-2-1-premiere-partie-1`,
  `${secondChapter}-2-2-seconde-partie-3`,
]
const firstDetail = `${firstChapter}-1-1-1-detail-2`
const siblingDetails = [
  `${firstChapter}-1-2-1-premier-detail-4`,
  `${firstChapter}-1-2-2-second-detail-5`,
]
const secondDetail = `${secondChapter}-2-1-1-detail-2`

const paragraphs = (name: string) => Array.from({ length: 22 }, (_, index) =>
  `${name}, paragraphe ${index + 1}. Ce texte permet de parcourir le chapitre sans rencontrer un autre titre. Les explications restent assez longues pour verifier le suivi du defilement dans les deux sens.`,
).join('\n\n')

const markdown = `# Sommaire contextuel

<!-- anchor:legacy-first-chapter -->
## 1. Premier chapitre

Introduction du premier chapitre.

### 1.1 Premiere partie

#### 1.1.1 Detail

${paragraphs('Premier chapitre, premiere partie')}

### 1.2 Seconde partie

${paragraphs('Premier chapitre, seconde partie')}

#### 1.2.1 Premier detail

${paragraphs('Premier chapitre, premier detail de la seconde partie')}

#### 1.2.2 Second detail

${paragraphs('Premier chapitre, second detail de la seconde partie')}

<!-- anchor:legacy-second-chapter -->
## 2. Deuxieme chapitre

Introduction du deuxieme chapitre.

<!-- anchor:legacy-second-part -->
### 2.1 Premiere partie

<!-- anchor:legacy-second-detail -->
#### 2.1.1 Detail

${paragraphs('Deuxieme chapitre, premiere partie')}

### 2.2 Seconde partie

${paragraphs('Deuxieme chapitre, seconde partie')}

## 3. Chapitre sans sous-chapitre

${paragraphs('Chapitre sans sous-chapitre')}
`

const href = (article: string, section: string) => `#aide?${new URLSearchParams({ article, section })}`

async function expectHrefs(links: Locator, expected: string[]) {
  await expect.poll(() => links.evaluateAll(elements => elements.map(element => element.getAttribute('href')))).toEqual(expected)
}

async function expectParts(page: Page, ids: string[], article = 'tuto_pena') {
  await expectHrefs(page.locator('.help-toc a[data-level="3"]'), ids.map(id => href(article, id)))
}

async function expectDetails(page: Page, ids: string[]) {
  await expectHrefs(page.locator('.help-toc a[data-level="4"]'), ids.map(id => href('tuto_pena', id)))
}

async function scrollTo(page: Page, id: string) {
  await page.locator(`[id="${id}"]`).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
}

async function useFixture(page: Page, source = markdown) {
  await page.route('**/content/fr/tuto_pena.md?*', async route => {
    if (!new URL(route.request().url()).searchParams.has('raw')) return route.continue()
    const response = await route.fetch()
    await route.fulfill({ response, body: `export default ${JSON.stringify(source)}` })
  })
}

test('le sommaire droit suit le chapitre pendant le defilement dans les deux sens', async ({ page }) => {
  await useFixture(page)
  await page.goto('/#aide?article=tuto_pena')
  await expectHrefs(page.locator('.help-toc a[data-level="2"]'),
    [firstChapter, secondChapter, thirdChapter].map(id => href('tuto_pena', id)))

  await scrollTo(page, firstChapter)
  await expectParts(page, firstParts)
  await expectDetails(page, [])
  const originalUrl = page.url()

  await scrollTo(page, secondParts[0])
  await expectParts(page, secondParts)
  await expectDetails(page, [secondDetail])
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'instant' }))
  await expectParts(page, secondParts)
  await expectDetails(page, [secondDetail])

  await scrollTo(page, thirdChapter)
  await expectParts(page, [])
  await expectDetails(page, [])

  await scrollTo(page, secondParts[1])
  await expectParts(page, secondParts)
  await expectDetails(page, [])
  await scrollTo(page, firstParts[1])
  await expectParts(page, firstParts)
  await expectDetails(page, siblingDetails)
  expect(page.url()).toBe(originalUrl)

  // The inline contents keeps every subchapter even when the right contents collapses them.
  await expectHrefs(page.locator('.help-inline-toc a[data-level="3"]'),
    [...firstParts, ...secondParts].map(id => href('tuto_pena', id)))
  await expect(page.locator('.help-inline-toc a[data-level="4"]')).toHaveCount(0)
})

test('les details restent limites au sous-chapitre actif et leurs liens suivent le defilement', async ({ page }) => {
  await useFixture(page)
  await page.goto('/#aide?article=tuto_pena')
  await scrollTo(page, firstParts[0])
  await expectDetails(page, [firstDetail])

  await scrollTo(page, firstDetail)
  await expectDetails(page, [firstDetail])
  await expect(page.locator(`.help-toc a[href="${href('tuto_pena', firstDetail)}"]`)).toHaveAttribute('aria-current', 'location')

  await scrollTo(page, firstParts[1])
  await expectDetails(page, siblingDetails)
  const secondDetailLink = page.locator(`.help-toc a[href="${href('tuto_pena', siblingDetails[1])}"]`)
  await secondDetailLink.click()
  await expect(page).toHaveURL(new RegExp(`section=${siblingDetails[1]}$`))
  await expect(page.locator(`[id="${siblingDetails[1]}"]`)).toBeInViewport()
  await expect(secondDetailLink).toHaveAttribute('aria-current', 'location')
  await expectDetails(page, siblingDetails)

  await scrollTo(page, siblingDetails[0])
  await expectDetails(page, siblingDetails)
  await expect(page.locator(`.help-toc a[href="${href('tuto_pena', siblingDetails[0])}"]`)).toHaveAttribute('aria-current', 'location')

  await scrollTo(page, firstParts[0])
  await expectDetails(page, [firstDetail])
  await scrollTo(page, firstChapter)
  await expectDetails(page, [])
})

test('cliquer un chapitre ouvre seulement ses sous-chapitres et conserve le lien partageable', async ({ page }) => {
  await useFixture(page)
  await page.goto('/#aide?article=tuto_pena')
  await page.locator(`.help-toc a[href="${href('tuto_pena', secondChapter)}"]`).click()
  await expect(page).toHaveURL(new RegExp(`section=${secondChapter}$`))
  await expectParts(page, secondParts)
  await expectDetails(page, [])
  await expect(page.locator(`[id="${secondChapter}"] > h3`)).toBeInViewport()

  await page.locator(`.help-toc a[href="${href('tuto_pena', thirdChapter)}"]`).click()
  await expectParts(page, [])
  await expectDetails(page, [])
  await expect(page.locator('.help-toc a[data-level="2"]')).toHaveCount(3)
})

test('un dernier chapitre court reste actif en bas de page apres clic ou lien direct', async ({ page }) => {
  const lastChapter = '2-dernier-chapitre'
  const lastPart = `${lastChapter}-2-1-dernier-sous-chapitre-1`
  await useFixture(page, `# Dernier chapitre court

## 1. Premier chapitre

### 1.1 Premiere partie

${paragraphs('Premier chapitre long')}

## 2. Dernier chapitre

### 2.1 Dernier sous-chapitre

Une explication courte termine cet article.
`)

  const expectLastChapter = async () => {
    await expectParts(page, [lastPart])
    await expect(page.locator(`[id="${lastChapter}"] > h3`)).toBeInViewport()
    await expect.poll(() => page.evaluate(() =>
      Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) <= 1,
    )).toBe(true)
  }

  await page.goto('/#aide?article=tuto_pena')
  await scrollTo(page, firstChapter)
  await expectParts(page, [firstParts[0]])

  await page.locator(`.help-toc a[href="${href('tuto_pena', lastChapter)}"]`).click()
  await expectLastChapter()
  await page.reload()
  await expectLastChapter()
  await scrollTo(page, firstChapter)
  await expectParts(page, [firstParts[0]])

  // Start a fresh document so the direct-link case does not reuse an active chapter.
  await page.goto('about:blank')
  await page.goto(`/${href('tuto_pena', lastPart)}`)
  await expectLastChapter()
  await page.reload()
  await expectLastChapter()
  await scrollTo(page, firstChapter)
  await expectParts(page, [firstParts[0]])
})

for (const section of [
  secondParts[0],
  secondDetail,
  'legacy-second-part',
  'legacy-second-chapter',
  'legacy-second-detail',
]) {
  test(`le lien direct ${section} ouvre le chapitre parent aussi apres rechargement`, async ({ page }) => {
    await useFixture(page)
    await page.goto(`/${href('tuto_pena', section)}`)
    const heading = section === 'legacy-second-chapter'
      ? page.locator(`[id="${secondChapter}"] > h3`)
      : section === 'legacy-second-detail'
        ? page.locator('h5').filter({ has: page.locator(`[id="${section}"]`) })
        : section === 'legacy-second-part'
          ? page.locator('h4').filter({ has: page.locator(`[id="${section}"]`) })
          : page.locator(`[id="${section}"]`)
    await expectParts(page, secondParts)
    await expectDetails(page, section === 'legacy-second-chapter' ? [] : [secondDetail])
    if (section === secondDetail || section === 'legacy-second-detail') {
      await expect(page.locator(`.help-toc a[href="${href('tuto_pena', secondDetail)}"]`)).toHaveAttribute('aria-current', 'location')
    }
    await expect(heading).toBeInViewport()
    const sharedUrl = page.url()

    await page.reload()
    await expect(page).toHaveURL(sharedUrl)
    await expectParts(page, secondParts)
    await expectDetails(page, section === 'legacy-second-chapter' ? [] : [secondDetail])
    await expect(heading).toBeInViewport()
  })
}

test('le sommaire mobile conserve tous les chapitres et sous-chapitres', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await useFixture(page)
  await page.goto('/#aide?article=tuto_pena')
  await expect(page.locator('.help-toc')).toBeHidden()
  await page.locator('.help-inline-toc > summary').click()
  await expect(page.locator('.help-inline-toc a[data-level="2"]')).toHaveCount(3)
  await expectHrefs(page.locator('.help-inline-toc a[data-level="3"]'),
    [...firstParts, ...secondParts].map(id => href('tuto_pena', id)))
  await expect(page.locator('.help-inline-toc a[data-level="4"]')).toHaveCount(0)
})

for (const locale of ['fr', 'en'] as const) {
  test(`le guide retiré Nouvelle interface n’est plus proposé et son ancien lien affiche le sommaire (${locale})`, async ({ page }) => {
    await page.addInitScript(language => localStorage.setItem('locale', language), locale)
    await page.goto('/#aide?article=nouvelle-interface')
    await expect(page.locator('.help-article').getByRole('heading', {
      name: locale === 'fr' ? 'Documentation ITYC' : 'ITYC documentation', exact: true,
    })).toBeVisible()
    await expect(page.locator('.help-index-entry')).toHaveCount(articleIds.length + 1)
    await expect(page.locator('a[href*="article=nouvelle-interface"]')).toHaveCount(0)
    await expect(page.locator('.help-content-section')).toHaveCount(0)
    await expect(page.locator('.help-toc')).toHaveCount(0)
    await page.reload()
    await expect(page.locator('.help-index-entry')).toHaveCount(articleIds.length + 1)
    await expect(page.locator('a[href*="article=nouvelle-interface"]')).toHaveCount(0)
  })

  for (const article of articleIds) {
    test(`le sommaire contextuel conserve tous les chapitres de ${article} (${locale})`, async ({ page }) => {
      await page.addInitScript(language => localStorage.setItem('locale', language), locale)
      await page.goto(`/#aide?article=${article}`)
      await expect(page.locator('.help-content-section').first()).toBeVisible()

      const chapters = await page.locator('.help-content-section').evaluateAll(elements => elements.map(element => ({
        id: element.id,
        parts: [...element.querySelectorAll('h4[id]')].map(heading => heading.id),
      })))
      const expectedChapters = chapters.map(chapter => href(article, chapter.id))
      await expectHrefs(page.locator('.help-toc a[data-level="2"]'), expectedChapters)

      // Prefer a later chapter with subchapters to detect an incorrectly retained initial group.
      const selected = chapters.slice(1).find(chapter => chapter.parts.length > 0)
        ?? chapters.find(chapter => chapter.parts.length > 0)
        ?? chapters[Math.min(1, chapters.length - 1)]
      await page.goto(`/${href(article, selected.id)}`)
      await expect(page.locator(`[id="${selected.id}"] > h3`)).toBeInViewport()
      await expectHrefs(page.locator('.help-toc a[data-level="2"]'), expectedChapters)
      await expectParts(page, selected.parts, article)
      await expectHrefs(page.locator('.help-inline-toc a[data-level="3"]'),
        chapters.flatMap(chapter => chapter.parts.map(id => href(article, id))))
    })
  }
}
