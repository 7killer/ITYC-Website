import { expect, test } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const originalDocuments = [
  ['aide_pena', 'Calcul des temps de pénalités'],
  ['tuto_pena', 'Tutoriel pénalités'],
  ['aide_energy', "Calcul des pertes et des temps de récupération d'énergie"],
  ['tuto_energy', 'Tutoriel énergie'],
  ['tuto_polaire', 'Tutoriel polaires'],
  ['tuto_autoSail', 'Tutoriel voiles automatiques'],
  ['aide_dash', 'Aide Dashboard'],
] as const

test.use({ viewport: { width: 1440, height: 1000 } })

test('l’accueil de l’aide donne accès aux sept documents historiques dans l’ordre des outils', async ({ page }) => {
  await page.goto('/#aide')
  await expect.poll(async () => (await page.locator('.help-desktop-nav .help-chapters h2').allTextContents()).slice(0, 5)).toEqual([
    'Pénalités', 'Énergie', 'Polaires', 'Voiles Auto', 'Dashboard',
  ])

  for (const [id, title] of originalDocuments) {
    await expect(page.locator(`.help-article a[href*="article=${id}"]`)).toContainText(title)
  }
  await expect(page.locator('.help-content-section')).toHaveCount(0)
})

for (const mobile of [false, true]) {
  test(`le menu déplie seulement le groupe actif et conserve sa navigation (${mobile ? 'mobile' : 'ordinateur'})`, async ({ page }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/#aide?article=aide_pena')

    const sidebar = page.locator(mobile ? '.help-mobile-nav' : '.help-desktop-nav')
    const navigation = sidebar.locator('.help-chapters')
    const openNavigation = async () => {
      if (mobile && !(await sidebar.locator('details').evaluate(element => element.hasAttribute('open')))) {
        await sidebar.locator('summary').click()
      }
    }
    await openNavigation()

    const activeGroup = navigation.locator('section[data-active="true"]')
    await expect(activeGroup.locator('h2')).toHaveText('Pénalités')
    await expect(activeGroup.locator('.help-navigation-article > a')).toHaveText([
      'Calcul des temps de pénalités', 'Tutoriel pénalités',
    ])
    await expect(activeGroup.locator('.help-navigation-article > a').first()).toBeVisible()
    await expect(activeGroup.locator('.help-navigation-article > a').last()).toBeVisible()
    await expect(navigation.locator('section[data-active="false"] .help-navigation-article')).toHaveCount(0)

    await navigation.locator('h2 > a.help-group-link').filter({ hasText: /^Énergie$/ }).click()
    await expect(page).toHaveURL(/#aide\?article=aide_energy$/)
    await expect(page.locator('.help-article > h2')).toHaveText("Calcul des pertes et des temps de récupération d'énergie")
    await openNavigation()
    await expect(activeGroup.locator('h2')).toHaveText('Énergie')
    await expect(activeGroup.locator('.help-navigation-article > a')).toHaveText([
      "Calcul des pertes et des temps de récupération d'énergie", 'Tutoriel énergie',
    ])
    await expect(navigation.locator('section[data-active="false"] .help-navigation-article')).toHaveCount(0)

    await page.reload()
    await expect(page.locator('.help-article > h2')).toHaveText("Calcul des pertes et des temps de récupération d'énergie")
    await openNavigation()
    await expect(activeGroup.locator('h2')).toHaveText('Énergie')
    await expect(activeGroup.locator('.help-navigation-article > a')).toHaveCount(2)
    await expect(navigation.locator('section[data-active="false"] .help-navigation-article')).toHaveCount(0)

    const sectionLink = activeGroup.locator('.help-subsections a').nth(1)
    const destination = await sectionLink.getAttribute('href')
    const sectionId = new URLSearchParams(destination!.split('?')[1]).get('section')!
    await sectionLink.click()
    await expect(page).toHaveURL(new RegExp(`article=aide_energy.*section=${encodeURIComponent(sectionId)}`))
    await expect(page.locator(`[id="${sectionId}"] > h3`)).toBeInViewport()
  })
}

for (const [id, title] of originalDocuments) {
  test(`le document ${id} est accessible directement avec son contenu illustré`, async ({ page }) => {
    await page.goto(`/#aide?article=${id}`)
    await expect(page.locator('.help-article > h2')).toHaveText(title)
    await expect(page.locator('.help-content-section').first()).toBeVisible()
    await expect(page.locator('.help-article')).not.toContainText('<!-- anchor:')
    expect(await page.locator('.help-figure img').count()).toBeGreaterThan(0)
    expect(await page.locator('.help-toc a').count()).toBeGreaterThan(0)
  })
}

test('le sommaire crée un lien de section partageable et rechargeable', async ({ page }) => {
  await page.goto('/#aide?article=tuto_pena')
  const sectionLink = page.locator('.help-toc a[data-level="2"]').nth(2)
  const destination = await sectionLink.getAttribute('href')
  expect(destination).toMatch(/article=tuto_pena.*section=/)
  const sectionId = new URLSearchParams(destination!.split('?')[1]).get('section')!
  const heading = page.locator(`[id="${sectionId}"] h3`)
  const title = await heading.textContent()

  await sectionLink.click()
  await expect(page).toHaveURL(new RegExp(`article=tuto_pena.*section=${encodeURIComponent(sectionId)}`))
  await expect(heading).toBeInViewport()
  const sharedUrl = page.url()

  await page.reload()
  await expect(page).toHaveURL(sharedUrl)
  await expect(heading).toHaveText(title!)
  await expect(heading).toBeInViewport()
})

test('l’ancienne ancre Flotte du Dashboard reste accessible après rechargement', async ({ page }) => {
  await page.goto('/#aide?article=aide_dash&section=tabDashTab5')
  const fleet = page.locator('h4').filter({ has: page.locator('#tabDashTab5') })
  await expect(fleet).toHaveText('5. Page Flotte')
  await expect(fleet).toBeInViewport()
  await page.reload()
  await expect(page).toHaveURL(/article=aide_dash&section=tabDashTab5$/)
  await expect(fleet).toBeInViewport()
})

test('la recherche trouve aussi les explications dans le corps du Dashboard', async ({ page }) => {
  await page.goto('/#aide')
  await page.getByRole('searchbox').fill('carte de présentation')
  const result = page.locator('.help-results a[href*="article=aide_dash"]')
  await expect(result).toBeVisible()
  await result.click()
  await expect(page.locator('.help-article > h2')).toHaveText('Aide Dashboard')
  await expect(page.locator('.help-article')).toContainText('Chargé à la carte de présentation pour les autres bateaux.')
})

test('le Dashboard conserve les détails de flotte et de configuration présents dans l’aide d’origine', async ({ page }) => {
  await page.goto('/#aide?article=aide_dash')
  const article = page.locator('.help-article')
  await expect(article).toContainText('RT : Ouvre un onglet de routage zezo avec les coordonnées et les options pré remplies.')
  await expect(article).toContainText('Le reste des options zezo seront celles que vous avez utilisé sur la page zezo pour la course concernée')
  await expect(article).toContainText('Time : Heure de la dernière itération serveur reçue.')
  await expect(article).toContainText('UTC ou temps local selon configuration utilisateur')
  await expect(article).toContainText('Team : Team du joueur.')
  await expect(article).toContainText("Chargé à l'ouverture de la course pour les joueurs de la team.")
  await expect(article).toContainText('Chargé à la carte de présentation pour les autres bateaux.')
  await expect(article).toContainText("Pré - chargé au démarrage avec les données d'ITYC.")
  await expect(article).toContainText("Peut être caché si décoché dans l'onglet Configuration section Flotte.")
  await expect(article).toContainText('DTU : Distance To yoU (mn).')
  await expect(article).toContainText('ERT : Enhanced Race Time.')
})

test('les formules et les tableaux de référence restent consultables', async ({ page }) => {
  await page.goto('/#aide?article=aide_pena')
  await expect.poll(() => page.locator('.help-article .katex').count()).toBeGreaterThan(0)
  await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
  await expect(page.locator('.help-article')).toContainText('Temps minimal de manoeuvre')

  await page.goto('/#aide?article=aide_energy')
  const rates = page.locator('.help-article table').filter({ hasText: 'Taux de pertes' })
  await expect(rates).toHaveCount(1)
  await expect(rates.getByRole('row')).toHaveText([
    /Manoeuvre\s*Taux de pertes/, /Virement\s*10%/, /Empannage\s*10%/, /Changement de voile\s*20%/,
  ])
  await expect.poll(() => page.locator('.help-article .katex').count()).toBeGreaterThan(0)
  await expect(page.locator('.help-article .katex-error')).toHaveCount(0)
})

test('la version anglaise garde le document courant et ses captures', async ({ page }) => {
  await page.goto('/#aide?article=aide_dash')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('.help-article > h2')).toHaveText('Dashboard Help')
  await expect(page).toHaveURL(/article=aide_dash$/)
  await expect(page.locator('.help-content-section').first()).toContainText('Navigation on Virtual Regatta')
  await expect(page.locator('.help-article')).toContainText('RT : Opens a zezo routing tab')
  expect(await page.locator('.help-figure img').count()).toBeGreaterThan(0)
  await expect(page.locator('.help-article-footer a').first()).toHaveAttribute('href', 'https://ityc.fr/aide_dashEn.html')
})

test('toutes les captures Markdown FR et EN sont servies dans leurs thèmes disponibles', async ({ request }) => {
  const imagePaths = new Set<string>()
  for (const locale of ['fr', 'en']) {
    const directory = resolve('src/features/help/content', locale)
    for (const filename of readdirSync(directory).filter(name => name.endsWith('.md'))) {
      const source = readFileSync(resolve(directory, filename), 'utf8')
      for (const image of source.matchAll(/!\[[^\]]*\]\(([^\n)]+)\)/g)) {
        const path = image[1]
        expect(path, `${locale}/${filename}`).toMatch(/^\/assets\/help\//)
        imagePaths.add(path)
        const dark = path.replace(/\.(png|jpg|jpeg)$/i, '_b.$1')
        if (existsSync(resolve('public', decodeURI(dark).replace(/^\//, '')))) imagePaths.add(dark)
      }
    }
  }
  expect(imagePaths.size).toBeGreaterThan(100)
  const paths = [...imagePaths]
  for (let offset = 0; offset < paths.length; offset += 12) {
    await Promise.all(paths.slice(offset, offset + 12).map(async path => {
      const response = await request.head(path)
      expect(response.ok(), path).toBe(true)
      expect(response.headers()['content-type'], path).toMatch(/^image\//)
    }))
  }
})
