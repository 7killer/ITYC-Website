import { expect, test } from '@playwright/test'
import type { HelpDocument } from '../../src/features/help/helpDocuments'
import { createHelpSearchIndex, searchHelp } from '../../src/features/help/helpSearch'

test.use({ viewport: { width: 1440, height: 1000 } })

const documentFixture = (id: string, title: string, sections: HelpDocument['sections']): HelpDocument => ({
  id, title, sections, group: 'Documentation', tool: '#aide', original: false,
  source: '', intro: '', toc: sections,
})

test('la recherche associe tous les mots dans une même section indépendamment de leur ordre et des accents', () => {
  const index = createHelpSearchIndex([
    documentFixture('energy', 'Guide technique', [
      { id: 'recovery', title: 'Récupération', content: 'Retrouvez votre énergie après la manœuvre.', headings: [] },
      { id: 'other', title: 'Autre section', content: 'Une explication sans rapport.', headings: [] },
    ]),
    documentFixture('separate', 'Autre guide', [
      { id: 'energy', title: 'Énergie', content: 'Le niveau du skipper.', headings: [] },
      { id: 'recovery', title: 'Récupération', content: 'Un autre sujet.', headings: [] },
    ]),
  ])

  const forward = searchHelp(index, 'ENERGIE recuperation')
  const reverse = searchHelp(index, 'récupération énergie')
  expect(forward.map(result => [result.document.id, result.sectionId])).toEqual([['energy', 'recovery']])
  expect(reverse.map(result => [result.document.id, result.sectionId])).toEqual([['energy', 'recovery']])
  expect(forward[0].excerpt).toContain('énergie')
  expect(searchHelp(index, 'énergie introuvable')).toEqual([])
  expect(searchHelp(index, '   ')).toEqual([])
})

test('une recherche par titre de document ne répète pas chaque section qui contient seulement un des mots', () => {
  const index = createHelpSearchIndex([
    documentFixture('tuto_energy', 'Tutoriel énergie', [
      { id: 'recovery', title: 'Récupération', content: 'Retrouvez votre énergie après une manœuvre.', headings: [] },
      { id: 'presentation', title: 'Présentation', content: 'Ce tutoriel présente les commandes disponibles.', headings: [] },
      { id: 'other', title: 'Réglages', content: 'Choisissez les options de votre bateau.', headings: [] },
    ]),
  ])

  const results = searchHelp(index, 'Tutoriel énergie')
  expect(results.map(result => [result.document.id, result.sectionId])).toEqual([['tuto_energy', undefined]])
  expect(results[0].title).toBe('Tutoriel énergie')
})

test('un terme de glossaire exact précède les occurrences répétées dans un long article', () => {
  const index = createHelpSearchIndex([
    documentFixture('aide_dash', 'Dashboard', [
      { id: 'navigation', title: 'Navigation', content: 'TWA dans les paramètres. '.repeat(80), headings: [] },
    ]),
    documentFixture('glossaire', 'Glossaire', [
      { id: 'twa', alias: 'glossary-twa', title: 'TWA', content: 'Angle entre le cap du bateau et le vent réel.', headings: [] },
    ]),
  ])

  const results = searchHelp(index, 'TWA')
  expect(results).toHaveLength(2)
  expect(results[0].document.id).toBe('glossaire')
  expect(results[0].sectionId).toBe('glossary-twa')
  expect(results[0].score).toBeGreaterThan(results[1].score)
})

test('les commentaires, adresses et options de mise en page ne sont pas recherchés ni affichés dans les extraits', () => {
  const index = createHelpSearchIndex([
    documentFixture('guide', 'Guide', [{
      id: 'sails', title: 'Voiles', headings: [], content: `<!-- hidden-comment-token -->
:::figure rows image=center width=83% blocks=23%,77%
![Illustration utile](/assets/help/hidden-capture-token.png)

La **voile** change à la demande.

[Explications](https://example.test/hidden-link-token)
:::
`,
    }]),
  ])

  for (const query of ['hidden comment token', 'hidden capture token', 'hidden link token', 'blocks']) {
    expect(searchHelp(index, query), query).toEqual([])
  }
  const [result] = searchHelp(index, 'demande')
  expect(result.excerpt).toContain('voile')
  expect(result.excerpt).toContain('demande')
  expect(result.excerpt).not.toMatch(/:::|<!--|https?:|\/assets\/|blocks=|\*\*/)
})

test('les mots dans un ordre différent trouvent la section du glossaire et son extrait', async ({ page }) => {
  await page.goto('/#aide')
  await page.getByRole('searchbox').fill('voile changement')
  const result = page.locator('.help-result[href*="article=glossaire"]').filter({
    has: page.locator('h3').filter({ hasText: /changement/i }),
  }).first()
  await expect(result).toBeVisible()
  await expect(result.locator('p')).not.toBeEmpty()
  await expect(result.locator('p')).not.toContainText(':::')
  await expect(result.locator('p')).not.toContainText('/assets/')

  await page.getByRole('searchbox').fill('PENALITE')
  await expect(page.locator('.help-result[href*="article=glossaire"] h3').filter({ hasText: /pénalité/i }).first()).toBeVisible()
})

test('la recherche affiche plusieurs sections d’un même document', async ({ page }) => {
  await page.goto('/#aide')
  await page.getByRole('searchbox').fill('TWA')
  const sections = page.locator('.help-result[href*="article=aide_dash"][href*="section="]')
  await expect.poll(() => sections.count()).toBeGreaterThan(1)
  const destinations = await sections.evaluateAll(links => links.map(link => link.getAttribute('href')))
  expect(new Set(destinations).size).toBe(destinations.length)
})

test('le premier résultat TWA ouvre le terme exact, rechargeable et conservé en anglais', async ({ page }) => {
  await page.goto('/#aide')
  await page.getByRole('searchbox').fill('TWA')
  const firstResult = page.locator('.help-result').first()
  await expect(firstResult).toHaveAttribute('href', '#aide?article=glossaire&section=glossary-twa')
  await expect(firstResult.locator('h3')).toContainText('TWA')
  await expect(firstResult.locator('p')).toContainText('Angle entre le cap du bateau')
  await firstResult.click()

  const term = page.locator('.help-content-section').filter({ has: page.locator('#glossary-twa') })
  await expect(page.locator('.help-article > h2')).toHaveText('Glossaire')
  await expect(term.locator('h3')).toBeInViewport()
  await expect(page.getByRole('searchbox')).toHaveValue('')
  await page.reload()
  await expect(term.locator('h3')).toBeInViewport()
  await expect(page).toHaveURL(/article=glossaire&section=glossary-twa$/)

  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('.help-article > h2')).toHaveText('Glossary')
  await expect(term).toContainText('True Wind Angle')
  await expect(term.locator('h3')).toBeInViewport()
  await expect(page).toHaveURL(/article=glossaire&section=glossary-twa$/)

  // A translated term keeps the same destination from either navigation menu.
  const sailChangeHref = '#aide?article=glossaire&section=glossary-sail-change'
  await page.locator(`.help-toc a[href="${sailChangeHref}"]`).click()
  const sailChange = page.locator('.help-content-section').filter({ has: page.locator('#glossary-sail-change') })
  await expect(sailChange.locator('h3')).toHaveText('Sail change')
  await expect(sailChange.locator('h3')).toBeInViewport()
  await page.getByRole('button', { name: 'Français', exact: true }).click()
  await expect(sailChange.locator('h3')).toHaveText('Changement de voile')
  await expect(sailChange.locator('h3')).toBeInViewport()
  await expect(page).toHaveURL(/article=glossaire&section=glossary-sail-change$/)
  await expect(page.locator('.help-desktop-nav .help-subsections a').filter({ hasText: /^Changement de voile$/ })).toHaveAttribute('href', sailChangeHref)
})

test('aucun résultat puis effacement permettent de reprendre la recherche au clavier', async ({ page }) => {
  await page.goto('/#aide?article=glossaire')
  const search = page.getByRole('searchbox')
  await search.fill('zzzzmotinexistantzzzz')
  await expect(page.locator('.help-result')).toHaveCount(0)
  await expect(page.locator('.help-empty')).toBeVisible()
  await page.getByRole('button', { name: 'Effacer la recherche' }).click()
  await expect(search).toHaveValue('')
  await expect(search).toBeFocused()
  await expect(page.locator('.help-article > h2')).toHaveText('Glossaire')
})

for (const locale of ['fr', 'en'] as const) {
  test(`le glossaire contient les 25 définitions sans lien vers une page historique inexistante (${locale})`, async ({ page }) => {
    await page.addInitScript(language => localStorage.setItem('locale', language), locale)
    await page.goto('/#aide')
    await page.locator('.help-index-entry[href="#aide?article=glossaire"]').click()
    await expect(page.locator('.help-article > h2')).toHaveText(locale === 'fr' ? 'Glossaire' : 'Glossary')
    await expect(page.locator('.help-content-section')).toHaveCount(25)
    await expect(page.locator('.help-article-footer a[href*="ityc.fr/glossaire"]')).toHaveCount(0)
    await expect(page.locator('.help-article-footer a').filter({ hasText: /Ouvrir l’outil|Open the tool/ })).toHaveCount(0)
  })
}

test('la recherche et le glossaire restent utilisables sur mobile sans défilement horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  await page.goto('/#aide')
  const search = page.getByRole('searchbox')
  await expect(search).toBeVisible()
  await search.fill('TWA')
  await expect(page.locator('.help-result').first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.locator('.help-result').first().click()
  await expect(page.locator('.help-article > h2')).toHaveText('Glossaire')
  await expect(page.locator('.help-content-section').filter({ has: page.locator('#glossary-twa') }).locator('h3')).toBeInViewport()
  await page.locator('.help-mobile-nav > details > summary').click()
  await expect(page.locator('.help-mobile-nav .help-navigation-article > a').filter({ hasText: 'Glossaire' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
